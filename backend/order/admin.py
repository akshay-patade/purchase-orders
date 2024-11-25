from django.contrib import admin
from django.utils.html import format_html
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    # List of fields to display in the admin list view
    list_display = (
        'id', 
        'uploaded_at', 
        'file'
    )
    
    # Fields that can be used to filter the list view

    
    # Read-only fields (since id is not editable)
    readonly_fields = (
        'id', 
        'uploaded_at'
    )
    
    # # Custom method to display processed status with color
    # def processed_status(self, obj):
    #     color = 'green' if obj.processed == Order.ProcessedStatus.FINAL else 'orange'
    #     return format_html(
    #         '<span style="color: {};">{}</span>', 
    #         color, 
    #         obj.get_processed_display()
    #     )
    # processed_status.short_description = 'Processed Status'
    
    # # Custom method to preview file (if it's a small file type)
    # def file_preview(self, obj):
    #     try:
    #         # This is a basic preview - adjust based on your file type
    #         preview_text = f"Binary File ({len(obj.file)} bytes)"
    #         return preview_text
    #     except Exception:
    #         return "Unable to preview file"
    # file_preview.short_description = 'File'
    
    # # Customize the form
    # fieldsets = (
    #     (None, {
    #         'fields': (
    #             'id', 
    #             'uploaded_at', 
    #             'processed'
    #         )
    #     }),
    #     ('File Details', {
    #         'fields': ('file',)
    #     })
    # )
    
    # Customize search capabilities
    search_fields = (
        'id', 
        'process_status'
    )