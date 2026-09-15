from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryListView, MenuItemViewSet, OutletViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'items', MenuItemViewSet, basename='menuitem')
router.register(r'outlets', OutletViewSet, basename='outlet')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('', include(router.urls)),
]
