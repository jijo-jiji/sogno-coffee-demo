# Sogno Coffee — Website & Ordering App Demo

Demo website and mobile ordering app for Sogno Coffee (Kota Bharu, Kelantan).

## What's inside

- **`index.html`**: website with three tabs.
  - **Website**: hero, pastry case, menu with photos, how ordering works, outlets.
  - **App**: the live ordering app (`app.html`) inside a phone frame. "Order" buttons on the website menu open that item in the app.
  - **Pitch notes**: talking points and a photo checklist showing where each menu photo comes from.
- **`app.html`**: standalone mobile ordering app. Open it on a phone for the best demo.
  - Pickup / delivery switch and outlet picker
  - Category tabs with a scrolling menu, and search
  - Item sheet with options (temperature, milk, sweetness, etc.) and add-on pricing
  - Cart with quantity changes, vouchers (`SOGNO20`, `FREESHIP`), payment methods, 6% SST
  - Order status screen with progress and a pickup code
- **`assets/js/menu-data.js`**: menu, outlets, vouchers and loyalty data shared by both pages.
- **`backend/`**: Django REST models and a fixture for categories, menu items, outlets and orders (not connected to the front end yet).

## Run locally

```bash
python -m http.server 8085
```

- Website: http://localhost:8085/
- App: http://localhost:8085/app.html

To try the app on a phone, run the server on your computer and open `http://<your-computer-ip>:8085/app.html` from a phone on the same Wi-Fi.

## Menu photos

Menu photos live in `assets/images/menu/<item-id>.jpg`. `download_menu_photos.py` re-downloads them from Sogno's foodpanda listings. Three items use stand-in photos and the Jumbo Croissant photo is a crop of the display case photo; see the Pitch notes tab for details.

## Django backend (optional)

```bash
cd backend
python manage.py migrate
python manage.py loaddata menu/fixtures/initial_menu.json
python manage.py runserver
```
