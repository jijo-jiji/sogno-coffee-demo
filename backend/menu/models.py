from django.db import models

class Outlet(models.Model):
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=50)
    operating_hours = models.CharField(max_length=100, default="8:00 AM - 11:00 PM")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.city})"

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['display_order']

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    category = models.ForeignKey(Category, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=6, decimal_places=2, help_text="Price in RM")
    description = models.TextField(blank=True)
    badge = models.CharField(max_length=50, blank=True, help_text="e.g. Signature Pastry, #1 Bestseller")
    image_url = models.CharField(max_length=255, blank=True)
    is_fresh_bake = models.BooleanField(default=False, help_text="Indicates live batch baking in store")
    is_available = models.BooleanField(default=True)
    calories = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - RM {self.price}"

class Order(models.Model):
    ORDER_TYPES = [
        ('pickup', 'Self-Pickup'),
        ('dine_in', 'Dine-In'),
        ('delivery', 'Delivery'),
    ]
    STATUS_CHOICES = [
        ('received', 'Order Received'),
        ('preparing', 'Barista & Baker Preparing'),
        ('ready', 'Ready at Counter / Picked Up'),
        ('completed', 'Completed'),
    ]
    order_number = models.CharField(max_length=30, unique=True)
    outlet = models.ForeignKey(Outlet, on_delete=models.CASCADE)
    order_type = models.CharField(max_length=20, choices=ORDER_TYPES, default='pickup')
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=30)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    discount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=8, decimal_places=2, default=0.00, help_text="6% SST")
    total = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.order_number} - {self.customer_name} (RM {self.total})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    customization_notes = models.TextField(blank=True, help_text="e.g. Less Sweet 50%, Oat Milk, Toasted")
    unit_price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"
