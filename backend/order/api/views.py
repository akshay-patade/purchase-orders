from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema

from .serializers import ExtractMappingSerializer

class ExtractMappingView(APIView):

    @extend_schema(
        operation_id='upload_file',
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'file': {
                        'type': 'string',
                        'format': 'binary'
                        }
                    }
                }
            },
        )
    
    def post(self, request, format=None):
        serializer = ExtractMappingSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the file and get the result
            result = serializer.save()

            file_path = result['file_path']

                        
            return Response({
                'message': 'File uploaded successfully',
                'file_path': result['file_path']
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)