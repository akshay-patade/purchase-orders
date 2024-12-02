
from django.urls import path
from .views import ProcessOrderView

urlpatterns = [
    path('extractOrderDetails/', ProcessOrderView.as_view(), name="extract_order_details"),
]
