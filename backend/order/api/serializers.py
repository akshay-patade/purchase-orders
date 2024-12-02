from rest_framework import serializers

from order.models import Order, OrderDetails

class OrderSerializer(serializers.ModelSerializer):

    uploaded_at = serializers.DateField(format='%Y-%m-%d')

    class Meta:
        model = Order
        fields = "__all__" 


class OrderDetailsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderDetails
        fields = '__all__'



