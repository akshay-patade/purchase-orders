from django.contrib import admin

# Register your models here.

from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('type', 'material', 'size', 'length', 'coating', 'thread_type')
    search_fields = ('type', 'material', 'size', 'thread_type')
    list_filter = ('coating', 'thread_type')