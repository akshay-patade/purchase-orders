
from django.urls import path
from .views import ProcessOrderView, OrderDetailsByOrderId, AddOrUpdateOrderDetails, DeleteOrderDetails

urlpatterns = [
    path('extractOrderDetails/', ProcessOrderView.as_view(), name="extract_order_details"),
    path('order-detail/', OrderDetailsByOrderId.as_view(), name="order_details_by_id"),
    path('order-details/', AddOrUpdateOrderDetails.as_view(), name='add-order-details'),
    path('order-details/<str:pk>/', AddOrUpdateOrderDetails.as_view(), name='update-order-details'),
    path('order-details/delete/<str:pk>/', DeleteOrderDetails.as_view(), name='delete-order-details'),
]
