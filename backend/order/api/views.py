import json
import os

from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.conf import settings

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
            )
        }
    )

    def post(self, request, *args, **kwargs):
        # Extract the file and order ID from the request
        file = request.FILES.get('file')
        order_id: int = request.data.get('order_id')

        if not file:
            return Response({"error": "File is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if order ID is provided
        if order_id and (order_id).isdigit():
            # Try to fetch the existing order
            order = get_object_or_404(Order, id=order_id)

            # Check if the process status is FINAL
            if order.process_status == Order.ProcessedStatus.FINAL:
                return Response({"error": "This order is already processed and cannot be updated."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Delete existing order details
            order.order_details.all().delete()

        else:
            # Create a new order if ID is not provided
            order = Order.objects.create(file=file)

        # Extract contents from the file (assuming the method returns a list of order details)

        media_root_path = settings.MEDIA_ROOT

        full_file_path = os.path.join(media_root_path, order.file.path)
        text_wrapper = TextWrapper(document_path = full_file_path)
        clean_product_table = text_wrapper.extract_product_table()

        #Once the contents are extracted it is time to organise the data according to our defined schema
        groq_wrapper = GroqWrapper()

        response_text = groq_wrapper.extractOrderDetails(clean_product_table)
        order_details_data = json.loads(response_text)

        # Create new order details
        for detail in order_details_data:
            OrderDetails.objects.create(
                order_id=order,
                product_description=detail.get("product_description"),
                item_number=detail.get("item_number"),
                vendor_number=detail.get("vendor_number"),
                quantity=detail.get("quantity"),
                unit_price=detail.get("unit_price"),
                total=detail.get("total"),
            )

        # Serialize the order details for response
        serialized_order_details = OrderDetailsSerializer(order.order_details.all(), many=True)
        
        # Return the response including the order_id
        response_data = {
            "order_id": order.id,
            "order_details": serialized_order_details.data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)

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
        }
    )


    def get(self, request):
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


class AddOrUpdateOrderDetails(APIView):
    def post(self, request):
        # Add a new order detail
        serializer = OrderDetailsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        # Update an existing order detail
        try:
            order_detail = OrderDetails.objects.get(pk=pk)
        except OrderDetails.DoesNotExist:
            return Response(
                {"error": "Order detail not found."},
                status=status.HTTP_404_NOT_FOUND
            )

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

        serializer = OrderDetailsSerializer(order_detail, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DeleteOrderDetails(APIView):

    def delete(self, request, pk):
        try:
            order_detail = OrderDetails.objects.get(pk=pk)
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