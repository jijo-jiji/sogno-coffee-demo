from rest_framework import generics, viewsets
from rest_framework.response import Response
from .models import Category, MenuItem, Outlet, Order
from .serializers import CategorySerializer, MenuItemSerializer, OutletSerializer, OrderSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.prefetch_related('items').filter(is_active=True)
    serializer_class = CategorySerializer

class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer

class OutletViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Outlet.objects.filter(is_active=True)
    serializer_class = OutletSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
