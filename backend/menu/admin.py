from django.contrib import admin
from .models import Outlet, Category, MenuItem, Order, OrderItem

class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [MenuItemInline]

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'badge', 'is_fresh_bake', 'is_available')
    list_filter = ('category', 'is_fresh_bake', 'is_available')
    search_fields = ('name', 'description')

@admin.register(Outlet)
class OutletAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'phone', 'is_active')
    list_filter = ('city', 'is_active')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'outlet', 'order_type', 'customer_name', 'total', 'status', 'created_at')
    list_filter = ('status', 'order_type', 'outlet')
    inlines = [OrderItemInline]
