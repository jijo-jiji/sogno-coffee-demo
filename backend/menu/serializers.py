from rest_framework import serializers
from .models import Category, MenuItem, Outlet, Order, OrderItem

class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'category', 'category_name', 'price', 'description', 'badge', 'image_url', 'is_fresh_bake', 'is_available', 'calories']

class CategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'display_order', 'items']

class OutletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Outlet
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='menu_item.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'item_name', 'quantity', 'customization_notes', 'unit_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    outlet_name = serializers.ReadOnlyField(source='outlet.name')

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'outlet', 'outlet_name', 'order_type', 'customer_name', 'customer_phone', 'status', 'subtotal', 'discount', 'tax', 'total', 'created_at', 'items']
