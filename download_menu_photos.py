"""
Downloads Sogno Coffee menu photos from their foodpanda listing.
Run from the root of the sogno-coffee-demo repo:
    python download_menu_photos.py
Photos are saved to assets/images/menu/<item-id>.jpg

jumbo-croissant.jpg is not downloaded here: Jumbo Croissant isn't listed on
foodpanda, so that photo is a crop of assets/images/pastry_chiller.png.
"""
import os
import urllib.request

BASE = "https://images.deliveryhero.io/image/"
OUT_DIR = os.path.join("assets", "images", "menu")

PHOTOS = {
    # Exact matches on Sogno's foodpanda menu
    "red-velvet-croissant": "global-menu-service/FP_MY/vendor/ijnb/product/1861565651/01aee519-a446-4ad1-b138-46da02adc74b.jpg",
    "kunafa-pistachio": "global-menu-service/FP_MY/vendor/ijnb/product/1861565674/98469024-1c2f-4022-a5bd-4de79d421f3a.jpg",
    "crofa": "global-menu-service/FP_MY/vendor/ijnb/product/4b11a43f-58ab-4917-91bd-72202e088cb2.jpg",
    "pain-au-kitkat": "global-menu-service/FP_MY/vendor/ijnb/product/1861565675/37ef4bbe-effe-4ab2-9c09-4fa9b2c3b532.jpg",
    "buttercream-latte": "fd-my/Products/1495445107.jpg",
    "spanish-latte": "fd-my/Products/1495445102.jpg",
    "biscoff-frappe": "fd-my/Products/1495445147.jpg",
    "pink-lady-milk": "fd-my/products/1495445122.jpg",

    # Close matches (listed under a slightly different name on foodpanda)
    "sogno-americano": "fd-my/Products/1495445105.jpg",        # "Americano"
    "caramel-macchiato": "fd-my/Products/1495445097.jpg",      # "Caramel Macchiato Latte"
    "matcha-cream-frappe": "fd-my/Products/1495445146.jpg",    # "Matcha Frappe"

    # Stand-ins: these demo items aren't sold at any Sogno outlet on foodpanda
    # (checked Ampang Point, Bangi, Shah Alam, Putrajaya, Tanah Merah, Kota Bharu),
    # so the closest real product photo is used.
    "dark-chocolate-mocha-frappe": "fd-my/Products/1495445140.jpg",  # "Mocha Latte Frappe"
    "strawberry-dream-milk": "fd-my/Products/1495445120.jpg",        # "Strawberry Yogurt Velvet"
    "pistachio-cream-milk": "fd-my/products/1495445108.jpg",         # "Pistachio Latte"
}

os.makedirs(OUT_DIR, exist_ok=True)
headers = {"User-Agent": "Mozilla/5.0"}

for item_id, path in PHOTOS.items():
    dest = os.path.join(OUT_DIR, f"{item_id}.jpg")
    try:
        req = urllib.request.Request(BASE + path, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp, open(dest, "wb") as f:
            f.write(resp.read())
        print(f"OK    {dest}")
    except Exception as e:
        print(f"FAIL  {item_id}: {e}")
