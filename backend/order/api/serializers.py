from rest_framework import serializers

class ExtractMappingSerializer(serializers.Serializer):
    file = serializers.FileField()

    def create(self, validated_data):
        """
        Custom create method to handle file saving
        """
        uploaded_file = validated_data.get('file')
        
        # Generate a unique filename to prevent overwriting
        import os
        from django.utils import timezone
        
        # Create uploads directory if it doesn't exist
        import os
        upload_dir = os.path.join('media', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename with timestamp
        filename = f"{timezone.now().strftime('%Y%m%d_%H%M%S')}_{uploaded_file.name}"
        full_path = os.path.join(upload_dir, filename)
        
        # Save the file
        with open(full_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        
        return {'file_path': full_path}
    
