# Sogno Coffee — Brand Landing Page & Mobile App Demo

> **Un Sogno Diventato Realtà** — Artisan Viennoiserie & Specialty Coffee  
> Origin: Kota Bharu, Kelantan (SOGNO COFFEE SDN BHD)

A high-fashion brand landing page and fast-retail mobile ordering web application benchmarked against top coffee leaders in Malaysia (**ZUS Coffee**, **Kenangan Coffee**, **Bask Bear**, **Perk Coffee**, and **The Coffee Bean & Tea Leaf**).

---

## ✨ Features

### 1. 🌟 Luxury Brand Landing Page (index.html)
- **Editorial Typography & Visual Tone**: Inspired by Kenangan Coffee with **Playfair Display**, **Cinzel**, and **Plus Jakarta Sans**.
- **Roastery Craft Bar**: Highlights Sogno's *Medium-Dark Velvet Roast*, *100% Arabica Colombia Huila & Brazil Cerrado terroir*, double ristretto extraction, and *72-hour slow fermentation French Normandy butter lamination*.
- **Real Showcase Chiller & Storefront**: Authentic photography of the Kota Bharu flagship exterior and the 3-tier refrigerated bakery chiller featuring the viral **Jumbo Croissant (RM 40)**, **Red Velvet Croissant (RM 21)**, **Kunafa Pistachio (RM 18.90)**, and **Cinnamon Roll (RM 8)**.
- **Sensory Flavor Profile Chips**: Every menu item details tasting notes (e.g., *Whipped Buttercream • Double Ristretto • Salted Caramel Finish*).
- **High-Ticket Food & Beverage Pairings**: Recommended pairings (Bask Bear benchmark) designed to maximize Average Order Value (AOV).
- **Multi-Outlet Locator**: Real-time status for Kota Bharu Flagship (HQ), Pantai Tapang Bachok (#6), Shah Alam Seksyen 7, and Ampang Point.

### 2. 📱 ZUS Coffee Benchmark Mobile App UI (pp.html & Embedded Simulator)
- **Instant Order Mode Toggle**: Seamless switch between **Self-Pickup (Ready in 10-15 mins)** and **Delivery**.
- **Active Branch Switcher**: Dropdown modal with live distance in km, operating hours, and prep times.
- **VIP Sogno Club Strip**: Progress tracker (*6/10 Sips to Next Free Buttercream Latte*) with active 20% discount coupon (SOGNO20).
- **Sticky Category Navigation**: Smooth horizontal scroll across *Pastry Sogno*, *Specialty Coffee*, *Frappe Dream*, and *Milk Series*.
- **Tactile Customization Bottom Sheet**:
  - Temperature (Iced vs. Hot)
  - Sweetness (100% Normal, 50% Less Sweet, 0% Zero)
  - Milk selection (Fresh Dairy, Oat Milk +RM 3.00, Soy +RM 2.00)
  - Pastry Serving (Warmly Reheated vs. Room Temp)
- **Slide-up Review Bag & Checkout**: 6% SST calculation, voucher discount applicator, and payment method selector (DuitNow QR, TNG, Card/Apple Pay, FPX, Counter).
- **Order Tracking Simulation**: Dynamic live prep timeline with simulated counter pickup QR code.

### 3. 🐍 Django Backend Ready (ackend/)
- Django REST Framework models for Category, MenuItem, Outlet, Order, and OrderItem.
- Pre-populated fixture [initial_menu.json](backend/menu/fixtures/initial_menu.json) pre-seeded with all verified menu items, exact RM prices, and branch details.

---

## 🚀 Getting Started

### Run the Web Demo Locally:
`ash
# Start a local static HTTP server
python -m http.server 8085
`
- Open **http://localhost:8085/** for the **Master Showcase Portal** (Landing Page + ZUS App Simulator + Pitch Deck).
- Open **http://localhost:8085/app.html** for the **Standalone Mobile App** (ideal for mobile viewports).

### Run the Django Backend (Optional):
`ash
cd backend
python manage.py migrate
python manage.py loaddata menu/fixtures/initial_menu.json
python manage.py runserver
`

---

## 📸 Real Asset Library (Zero AI-Generated Imagery)
- ssets/images/logo.png — Official Sogno Coffee circular S-bean emblem.
- ssets/images/storefront.png — Authentic Kota Bharu flagship exterior.
- ssets/images/pastry_chiller.png — Authentic pastry chiller display with Jumbo Croissant, Red Velvet, and Kunafa Pistachio.
