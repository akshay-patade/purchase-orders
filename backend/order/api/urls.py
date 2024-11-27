
from django.urls import path
from .views import ExtractMappingView

urlpatterns = [
    path('extractMappings/', ExtractMappingView.as_view(), name="extract_mappings"),
]
