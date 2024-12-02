
from django.urls import path
from .views import ProductMatchingView,ProductSuggestionsView

urlpatterns = [
    path('productMatching/', ProductMatchingView.as_view(), name = "product_matching_by_query"),
    path('search/', ProductSuggestionsView.as_view(), name = "search_product_by_query")
]
