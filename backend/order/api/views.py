import json
import os

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from elasticsearch import RequestError

from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.exceptions import ValidationError

from product.services.ElasticSearchWrapper import ElasticSearchWrapper
from order.models import Order, OrderDetails
from order.services.TextWrapper import TextWrapper
from order.services.GroqWrapper import GroqWrapper

from .serializers import OrderDetailsSerializer

class ProcessOrderView(APIView):

    @extend_schema(
        operation_id='upload_file_and_process_order',
        summary="Upload a file and process order details",
        description=(
            "This endpoint allows users to upload a file containing order details. "
            "If `order_id` is provided, the order details for that ID will be updated. "
            "If not provided, a new order is created."
        ),
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'file': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'The file containing order details to process.'
                    },
                    'order_id': {
                        'type': 'string',
                        'description': 'Optional. The ID of the order to update. If not provided, a new order is created.',
                        'nullable': True
                    }
                },
                'required': ['file']
            }
        },
        responses={
            201: OrderDetailsSerializer(many=True),
            400: OpenApiExample(
                name="Error Example",
                value={"error": "This order is already processed and cannot be updated."},
                description="An example error response."
            ),
            500: OpenApiExample(
                name="Server Error",
                value={"error": "An unexpected error occurred."},
                description="An example server error response."
            )
        }
    )
    
    def post(self, request, *args, **kwargs):
        try:
            file = request.FILES.get('file')
            order_id = request.data.get('order_id')

            if not file:
                return Response({"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST)

            if order_id and str(order_id).isdigit():
                order = get_object_or_404(Order, id=order_id)
                if order.process_status == Order.ProcessedStatus.FINAL:
                    return Response({"error": "This order is already processed and cannot be updated."},
                                    status=status.HTTP_400_BAD_REQUEST)
                order.order_details.all().delete()
            else:
                order = Order.objects.create(file=file)

            media_root_path = settings.MEDIA_ROOT
            full_file_path = os.path.join(media_root_path, order.file.path)
            text_wrapper = TextWrapper(document_path=full_file_path)
            clean_product_table = text_wrapper.extract_product_table()

            groq_wrapper = GroqWrapper()
            response_text = groq_wrapper.extractOrderDetails(clean_product_table)
            order_details_data = json.loads(response_text)

            elastic_search_wrapper = ElasticSearchWrapper()
            queries = [detail.get("product_description") for detail in order_details_data]
            bestMatchResults = elastic_search_wrapper.getProductMatchings(queries)

            for detail, bestMatch in zip(order_details_data, bestMatchResults):
                bestResult = bestMatch["matches"][0]["description"]
                OrderDetails.objects.create(
                    order_id=order,
                    product_description=detail.get("product_description"),
                    best_match=bestResult,
                    item_number=detail.get("item_number"),
                    vendor_number=detail.get("vendor_number"),
                    quantity=detail.get("quantity"),
                    unit_price=detail.get("unit_price"),
                    total=detail.get("total"),
                )

            serialized_order_details = OrderDetailsSerializer(order.order_details.all(), many=True)
            response_data = {
                "order_id": order.id,
                "created_at": order.uploaded_at,
                "process_status": order.process_status,
                "order_details": serialized_order_details.data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        except ValidationError as ve:
            return Response({"error": f"Validation error: {str(ve)}"}, status=status.HTTP_400_BAD_REQUEST)
        except RequestError as re:
            return Response({"error": f"Elasticsearch error: {str(re)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class OrderDetailsByOrderId(APIView):

    @extend_schema(
        operation_id='get_order_details_by_id',
        summary="Get Order Details by id",
        description=(
            "This endpoint allows users to get order details by id "
            "Return the order details if we found the record "
            "Raise a 404 if order details are not found."
        ),
        parameters=[
            OpenApiParameter(
                name='order_id', 
                description='Search the order by its id', 
                type=str,
                location=OpenApiParameter.QUERY,
                required=True
            ),
        ],
        request={
                'application/json': {
                    'type': 'object',
                    'properties': {
                        'order_id': {
                            'type': 'int', 
                        }
                    }
                }
            },
        responses={
            200: {
                'type': 'object', 
                'properties': {
                    'message': {'type': 'string'}, 
                    'queries': {'type': 'array', 'items': {'type': 'object'}}
                }
            },
            400: {
                'type': 'object', 
                'properties': {
                    'error': {'type': 'string'}
                }
            },
            404: {
                'type': 'object', 
                'properties': {
                    'message': {'type': 'string'}
                }
            },
            500: {
                'type': 'object',
                'properties': {
                    'error': {'type': 'string'}
                }
            }
        }
    )

    def get(self, request):
        try:
            order_id = request.query_params.get('order_id')
            if not order_id:
                return Response(
                    {"error": "order_id query parameter is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            order_details = OrderDetails.objects.filter(order_id=order_id)
            if not order_details.exists():
                return Response(
                    {"message": "No order details found for the given order_id."},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = OrderDetailsSerializer(order_details, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValidationError as ve:
            return Response({"error": f"Validation error: {str(ve)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddOrUpdateOrderDetails(APIView):
    def post(self, request):
        # Add a new order detail
        
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({"error": "Order ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        order = get_object_or_404(Order, pk=order_id)

        if order.process_status == Order.ProcessedStatus.FINAL:
            return Response(
                {"error": "The order is set to 'Final' and cannot be updated."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = OrderDetailsSerializer(data=request.data)


        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        # Update an existing order detail
        try:
            order_id = request.data.get('order_id')
            if not order_id:
                return Response({"error": "Order ID is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            order = get_object_or_404(Order, pk=order_id)

            if order.process_status == Order.ProcessedStatus.FINAL:
                return Response(
                    {"error": "The order is set to 'Final' and cannot be updated."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            order_detail = OrderDetails.objects.get(pk=pk)

        except OrderDetails.DoesNotExist:
            return Response(
                {"error": "Order detail not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError as ve:
            return Response({"error": f"Validation error: {str(ve)}"}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = OrderDetailsSerializer(order_detail, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        # Partially update an existing order detail
        try:
            order_detail = OrderDetails.objects.get(pk=pk)

        except OrderDetails.DoesNotExist:
            return Response(
                {"error": "Order detail not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        except ValidationError as ve:
            return Response({"error": f"Validation error: {str(ve)}"}, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if order_detail.order_id.process_status == Order.ProcessedStatus.FINAL:
            return Response(
                {"error": "This order's process_status is set to final. It cannot be updated."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OrderDetailsSerializer(order_detail, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteOrderDetails(APIView):
    def delete(self, request, pk):
        try:
            order_detail = OrderDetails.objects.get(pk=pk)
            order = get_object_or_404(Order, pk=order_detail.order_id.id)

            if order.process_status == Order.ProcessedStatus.FINAL:
                return Response(
                    {"error": "The order is set to 'Final' and cannot be updated."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except OrderDetails.DoesNotExist:
            return Response(
                {"error": "Order detail not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        order_detail.delete()
        return Response(
            {"message": "Order detail deleted successfully."},
            status=status.HTTP_200_OK
        )