from django.contrib import admin
from .models import Order, OrderDetails

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

    # Customize search capabilities
    search_fields = (
        'id', 
        'process_status'
    )


@admin.register(OrderDetails)
class OrderDetailsAdmin(admin.ModelAdmin):

    # List of fields to display in the admin list view
    list_display = (
        'id', 
        "order_id",
        "product_description",
        "item_number",
        "vendor_number",
        "quantity",
        "unit_price",
        "total",
        "updated_at"
    )
    
    readonly_fields = (
        'id', 
        "order_id",
        "product_description",
        "item_number",
        "vendor_number",
        "quantity",
        "unit_price",
        "total",
        "updated_at"
    )
        # Customize search capabilities
    search_fields = [
        'id', 
    ]

    # Customize search capabilities