from elasticsearch import RequestError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter
from django.core.exceptions import ValidationError


from product.services.ElasticSearchWrapper import ElasticSearchWrapper

class ProductMatchingView(APIView):

    @extend_schema(
        operation_id='find_product_best_matching',
        summary="Find the top 10 best product that matches requested query",
        description=(
            "This endpoint allows users to get the top 10 recommendations based on the requesetd query"
            "If we found the requested product from the database we will get the top 10 result"
            "If we do not find any result, then we will have empty array result"
        ),
        request={
                'application/json': {
                    'type': 'object',
                    'properties': {
                        'queries': {
                            'type': 'array', 
                            'items': {'type': 'string'}
                        }
                    }
                }
            },
        responses={
            200: {
                'type': 'object', 
                'properties': {
                    'message': {'type': 'string'}, 
                    'queries': {'type': 'array', 'items': {'type': 'string'}}
                }
            },
            400: {
                'type': 'object', 
                'properties': {
                    'error': {'type': 'string'}
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

    def post(self, request, *args, **kwargs):
        try:
            queries = request.data.get("queries")
            print(queries)

            if not queries or not isinstance(queries, list):
                return Response(
                    {"error": "Invalid data. 'queries' should be a list."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            elastic_search_wrapper = ElasticSearchWrapper()
            data = elastic_search_wrapper.getProductMatchings(queries)

            result = {"message": "Queries processed successfully", "queries": data}
            return Response(result, status=status.HTTP_200_OK)

        except ValidationError as ve:
            return Response(
                {"error": f"Validation error: {str(ve)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except RequestError as re:
            return Response(
                {"error": f"Elasticsearch error: {str(re)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ProductSuggestionsView(APIView):
        
        @extend_schema(
        operation_id='find_product_best_matching_by_filed',
        summary="Find the product based on any search field",
        description=(
            "This endpoint allows users to find the product by any field from the dropdown."
            "If we found the requested product from the database we will return the result. "
            "If we do not find any result, then we will have empty array result"
        ),

        parameters=[
            OpenApiParameter(
                name='query', 
                description='Search the product by any search field', 
                type=str,
                location=OpenApiParameter.QUERY,
                required=True
            ),
        ],

        request={
                'application/json': {
                    'type': 'object',
                    'properties': {
                        'queries': {
                            'type': 'array', 
                            'items': {'type': 'string'}
                        }
                    }
                }
            },
        responses={
            200: {
                'type': 'object', 
                'properties': {
                    'message': {'type': 'string'}, 
                    'queries': {'type': 'array', 'items': {'type': 'string'}}
                }
            },
            400: {
                'type': 'object', 
                'properties': {
                    'error': {'type': 'string'}
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

        def get(self, request, *args, **kwargs):
            try:
                # Get search parameters from the request
                search_field = "description"
                query = request.query_params.get('query', '')
                
                if not search_field or not query:
                    return Response({
                        'error': 'Both search field and query are required'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                elastic_search_wrapper = ElasticSearchWrapper()
                suggestions = elastic_search_wrapper.productBySearchField(search_field, query)

                return Response({
                    'suggestions': suggestions
                }, status=status.HTTP_200_OK)

            except ValidationError as ve:
                return Response(
                    {"error": f"Validation error: {str(ve)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except RequestError as re:
                return Response(
                    {"error": f"Elasticsearch error: {str(re)}"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    


    