// Sogno Coffee - Official Core Menu & Store Data
// Enhanced with Sensory Flavor Profiles (Perk Coffee & Kenangan Benchmarks)

const SOGNO_BRAND = {
  name: "Sogno Coffee",
  tagline: "Un Sogno Diventato Realtà — A Dream in Every Cup & Bite",
  subtitle: "Artisan Viennoiserie & Specialty Coffee",
  established: "2023",
  origin: "Kota Bharu, Kelantan",
  companyNo: "SOGNO COFFEE SDN BHD (202301012275)",
  primaryColor: "#4F0A15",
  accentColor: "#C99355",
  creamColor: "#FAF6F0"
};

const SOGNO_ROAST_CRAFT = {
  blendName: "Sogno House Velvet Blend",
  origin: "Colombia Huila & Brazilian Cerrado",
  roastLevel: "Medium-Dark Velvet Roast",
  process: "Washed & Natural Arabica",
  notes: ["Dark Cocoa", "Salted Caramel", "Roasted Hazelnut", "Brown Sugar"],
  acidity: "Low & Smooth",
  body: "Full & Syrupy"
};

const SOGNO_OUTLETS = [
  {
    id: "kb-flagship",
    name: "Kota Bharu Flagship (HQ)",
    city: "Kota Bharu, Kelantan",
    address: "PT 482, Jalan Lembah Sireh, 15050 Kota Bharu, Kelantan",
    hours: "8:00 AM - 11:30 PM Daily",
    status: "Open Now",
    phone: "+60 9-743 2889",
    tag: "Flagship & Bakery Hub",
    pickupTime: "10-15 mins",
    deliveryTime: "25-35 mins",
    distance: "0.8 km",
    dineIn: true
  },
  {
    id: "bachok",
    name: "Pantai Tapang, Bachok",
    city: "Bachok, Kelantan",
    address: "Pantai Tapang, 16300 Bachok, Kelantan",
    hours: "9:00 AM - 11:00 PM Daily",
    status: "Open Now",
    phone: "+60 19-980 4455",
    tag: "Beachside Branch #6",
    pickupTime: "8-12 mins",
    deliveryTime: "30-40 mins",
    distance: "14.2 km",
    dineIn: true
  },
  {
    id: "shah-alam",
    name: "Shah Alam Seksyen 7",
    city: "Shah Alam, Selangor",
    address: "No. 14, Jalan Plumbum Q7/Q, Seksyen 7, 40000 Shah Alam, Selangor",
    hours: "8:30 AM - 11:00 PM Daily",
    status: "Open Now",
    phone: "+60 3-5524 8192",
    tag: "Klang Valley Flagship",
    pickupTime: "10-15 mins",
    deliveryTime: "20-30 mins",
    distance: "Central Selangor",
    dineIn: true
  },
  {
    id: "ampang-point",
    name: "Ampang Point",
    city: "Ampang, Selangor",
    address: "Lot G-12, Ampang Point Shopping Centre, 68000 Ampang, Selangor",
    hours: "8:00 AM - 10:30 PM Daily",
    status: "Open Now",
    phone: "+60 3-4251 6720",
    tag: "Klang Valley Express",
    pickupTime: "5-10 mins",
    deliveryTime: "20-30 mins",
    distance: "Kuala Lumpur East",
    dineIn: true
  }
];

const SOGNO_CATEGORIES = [
  { id: "pastry-sogno", name: "Pastry Sogno", icon: "🥐", count: 5, tag: "Artisan Viennoiserie" },
  { id: "coffee", name: "Specialty Coffee", icon: "☕", count: 4, tag: "100% Arabica Craft" },
  { id: "frappe", name: "Frappe Dream", icon: "🥤", count: 3, tag: "Velvety Blends" },
  { id: "milk-series", name: "Milk Series", icon: "🥛", count: 3, tag: "Handcrafted Dairy" }
];

const SOGNO_MENU = [
  // Pastry Sogno
  {
    id: "red-velvet-croissant",
    categoryId: "pastry-sogno",
    categoryName: "Pastry Sogno",
    name: "Red Velvet Croissant",
    price: 21.00,
    formattedPrice: "RM 21.00",
    description: "Croissant with cream cheese filling. Laminated with crimson red velvet butter dough and rich Madagascar cream cheese drizzle.",
    badge: "Signature Pastry",
    image: "assets/images/pastry_chiller.png",
    hasRealPhoto: true,
    photoStatus: "Featured in Display Chiller",
    freshOutMinutes: 15,
    type: "pastry",
    calories: "380 kcal",
    tastingNotes: ["Cream Cheese Tang", "Velvety Cocoa", "Flaky Butter"],
    pairWith: "Buttercream Latte",
    options: {
      serving: ["Warm (Freshly Reheated)", "Room Temperature (Flaky)"]
    }
  },
  {
    id: "crofa",
    categoryId: "pastry-sogno",
    categoryName: "Pastry Sogno",
    name: "Crofa",
    price: 18.90,
    formattedPrice: "RM 18.90",
    description: "Croissant with chocolate mix and strawberry topping. Waffle-pressed golden croissant topped with molten Belgian chocolate and fresh strawberries.",
    badge: "Crowd Favorite",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    freshOutMinutes: 5,
    type: "pastry",
    calories: "420 kcal",
    tastingNotes: ["Toasted Caramel", "Belgian Cocoa", "Sweet Strawberry"],
    pairWith: "Spanish Latte",
    options: {
      serving: ["Warm (Freshly Reheated)", "Room Temperature"],
      topping: ["Standard Chocolate & Strawberry", "Extra Molten Drizzle (+RM 2.00)"]
    }
  },
  {
    id: "kunafa-pistachio",
    categoryId: "pastry-sogno",
    categoryName: "Pastry Sogno",
    name: "Kunafa Pistachio",
    price: 18.90,
    formattedPrice: "RM 18.90",
    description: "Pistachio-infused kunafa pastry. Middle Eastern toasted crispy kataifi shreds with rich Sicilian pistachio praline cream inside a layered French butter croissant.",
    badge: "Viral Hit",
    image: "assets/images/pastry_chiller.png",
    hasRealPhoto: true,
    photoStatus: "Featured in Display Chiller",
    freshOutMinutes: 20,
    type: "pastry",
    calories: "460 kcal",
    tastingNotes: ["Crispy Kataifi", "Roasted Pistachio", "Buttery Honey"],
    pairWith: "Sogno Americano",
    options: {
      serving: ["Warm (Freshly Reheated)", "Room Temperature"]
    }
  },
  {
    id: "pain-au-kitkat",
    categoryId: "pastry-sogno",
    categoryName: "Pastry Sogno",
    name: "Pain Au Kitkat",
    price: 17.00,
    formattedPrice: "RM 17.00",
    description: "Pain Au Chocolat style pastry with KitKat flavors. Crisp wafer fingers nestled inside flaky French puff pastry with melting chocolate ganache.",
    badge: "Chef's Pick",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    freshOutMinutes: 30,
    type: "pastry",
    calories: "390 kcal",
    tastingNotes: ["Crisp Wafer", "Melting Milk Chocolate", "Golden Butter"],
    pairWith: "Pink Lady Milk",
    options: {
      serving: ["Warm (Freshly Reheated)", "Room Temperature"]
    }
  },
  {
    id: "jumbo-croissant",
    categoryId: "pastry-sogno",
    categoryName: "Pastry Sogno",
    name: "Jumbo Croissant",
    price: 40.00,
    formattedPrice: "RM 40.00",
    description: "The viral 40cm giant golden French croissant displayed proudly in Sogno's chiller. Designed for sharing and dipping into specialty lattes.",
    badge: "Showstopper",
    image: "assets/images/pastry_chiller.png",
    hasRealPhoto: true,
    photoStatus: "Featured on Top Chiller Shelf",
    freshOutMinutes: 45,
    type: "pastry",
    calories: "850 kcal",
    tastingNotes: ["French Normandy Butter", "Honeycomb Lamination", "Ideal for Sharing"],
    pairWith: "Buttercream Latte",
    options: {
      serving: ["Warm (Freshly Reheated)", "Room Temperature"]
    }
  },

  // Coffee
  {
    id: "buttercream-latte",
    categoryId: "coffee",
    categoryName: "Specialty Coffee",
    name: "Buttercream Latte",
    price: 19.10,
    formattedPrice: "RM 19.10",
    description: "Rich espresso blended with creamy buttercream. Silky smooth velvet texture with decadent sweet-cream aromatics.",
    badge: "#1 Bestseller",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "280 kcal",
    tastingNotes: ["Whipped Buttercream", "Double Ristretto", "Salted Caramel Finish"],
    pairWith: "Red Velvet Croissant",
    options: {
      temp: ["Iced (Signature)", "Hot"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)", "Zero Sweetness (0%)"],
      milk: ["Fresh Dairy Milk", "Oat Milk (+RM 3.00)", "Soy Milk (+RM 2.00)"],
      bean: ["Sogno House Velvet Blend", "Single Origin Colombia (+RM 2.50)"]
    }
  },
  {
    id: "spanish-latte",
    categoryId: "coffee",
    categoryName: "Specialty Coffee",
    name: "Spanish Latte",
    price: 17.60,
    formattedPrice: "RM 17.60",
    description: "Espresso-based beverage with milk and condensed milk. Smooth balance of bold roasted Arabica and sweet caramelized dairy.",
    badge: "Customer Favorite",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "240 kcal",
    tastingNotes: ["Sweet Condensed Milk", "Dark Roasted Arabica", "Toffee Crema"],
    pairWith: "Kunafa Pistachio",
    options: {
      temp: ["Iced (Signature)", "Hot"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"],
      milk: ["Fresh Dairy Milk", "Oat Milk (+RM 3.00)"],
      bean: ["Sogno House Velvet Blend", "Single Origin Colombia (+RM 2.50)"]
    }
  },
  {
    id: "sogno-americano",
    categoryId: "coffee",
    categoryName: "Specialty Coffee",
    name: "Sogno Americano",
    price: 11.00,
    formattedPrice: "RM 11.00",
    description: "Clean, aromatic double-shot extraction using signature Arabica beans over purified chilled water.",
    badge: "Classic",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "15 kcal",
    tastingNotes: ["Dark Cocoa", "Walnut", "Subtle Molasses"],
    pairWith: "Jumbo Croissant",
    options: {
      temp: ["Iced", "Hot"],
      bean: ["Sogno House Velvet Blend", "Single Origin Colombia (+RM 2.50)"]
    }
  },
  {
    id: "caramel-macchiato",
    categoryId: "coffee",
    categoryName: "Specialty Coffee",
    name: "Caramel Macchiato",
    price: 18.50,
    formattedPrice: "RM 18.50",
    description: "Steamed vanilla-infused milk marked with bold espresso and finished with crosshatched artisanal caramel sauce.",
    badge: "Sweet Indulgence",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "260 kcal",
    tastingNotes: ["Bourbon Vanilla", "Bold Espresso Crema", "Artisan Caramel"],
    pairWith: "Pain Au Kitkat",
    options: {
      temp: ["Iced", "Hot"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"],
      milk: ["Fresh Dairy Milk", "Oat Milk (+RM 3.00)"]
    }
  },

  // Frappe
  {
    id: "biscoff-frappe",
    categoryId: "frappe",
    categoryName: "Frappe Dream",
    name: "Biscoff Frappe",
    price: 23.50,
    formattedPrice: "RM 23.50",
    description: "Caramel-flavored drink blended with spiced biscuits. Topped with whipped cream and crushed Lotus Biscoff speculoos.",
    badge: "Top Indulgence",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "450 kcal",
    tastingNotes: ["Spiced Speculoos", "Whipped Cream", "Caramel Swirl"],
    options: {
      temp: ["Ice Blended"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"],
      whippedCream: ["With Whipped Cream", "No Whipped Cream"]
    }
  },
  {
    id: "matcha-cream-frappe",
    categoryId: "frappe",
    categoryName: "Frappe Dream",
    name: "Matcha Cream Frappe",
    price: 22.00,
    formattedPrice: "RM 22.00",
    description: "Authentic Uji matcha blended with fresh milk, vanilla base, and crowned with velvety whipped cream.",
    badge: "Japanese Craft",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "360 kcal",
    tastingNotes: ["Ceremonial Uji Matcha", "Vanilla Bean", "Whipped Cream"],
    options: {
      temp: ["Ice Blended"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"],
      whippedCream: ["With Whipped Cream", "No Whipped Cream"]
    }
  },
  {
    id: "dark-chocolate-mocha-frappe",
    categoryId: "frappe",
    categoryName: "Frappe Dream",
    name: "Dark Chocolate Mocha Frappe",
    price: 22.50,
    formattedPrice: "RM 22.50",
    description: "Rich Belgian cocoa melted with espresso freeze, topped with chocolate curls and whipped cream.",
    badge: "Chocoholic",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "390 kcal",
    tastingNotes: ["70% Belgian Dark Cocoa", "Espresso Freeze", "Chocolate Curls"],
    options: {
      temp: ["Ice Blended"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"],
      whippedCream: ["With Whipped Cream", "No Whipped Cream"]
    }
  },

  // Milk Series
  {
    id: "pink-lady-milk",
    categoryId: "milk-series",
    categoryName: "Milk Series",
    name: "Pink Lady Milk",
    price: 19.10,
    formattedPrice: "RM 19.10",
    description: "Milkshake blended with Pink Lady apples and cinnamon. Creamy, delicately sweet, and beautifully fragrant with orchard apple notes.",
    badge: "House Specialty",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "290 kcal",
    tastingNotes: ["Crisp Apple Reduction", "Ceylon Cinnamon", "Velvet Milkshake"],
    pairWith: "Pain Au Kitkat",
    options: {
      temp: ["Iced (Blended Milkshake)", "Chilled Milk"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"]
    }
  },
  {
    id: "strawberry-dream-milk",
    categoryId: "milk-series",
    categoryName: "Milk Series",
    name: "Strawberry Dream Milk",
    price: 18.00,
    formattedPrice: "RM 18.00",
    description: "Artisan strawberry puree layered with fresh cream milk. Vibrant natural pink with rich strawberry aroma.",
    badge: "Fresh Fruit",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "230 kcal",
    tastingNotes: ["Fresh Strawberry Purée", "Farm Fresh Dairy", "Vanilla Floral"],
    options: {
      temp: ["Iced", "Warm"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"]
    }
  },
  {
    id: "pistachio-cream-milk",
    categoryId: "milk-series",
    categoryName: "Milk Series",
    name: "Pistachio Cream Milk",
    price: 19.50,
    formattedPrice: "RM 19.50",
    description: "Silky smooth milk infused with real crushed roasted pistachios. Caffeine-free gourmet treat.",
    badge: "Nutty Treat",
    image: "",
    hasRealPhoto: false,
    photoStatus: "Photo Needed",
    type: "beverage",
    calories: "310 kcal",
    tastingNotes: ["Roasted Pistachio Praline", "Silky Milk Foam", "Caffeine-Free"],
    options: {
      temp: ["Iced", "Warm"],
      sweetness: ["Normal (100%)", "Less Sweet (50%)"]
    }
  }
];

const SOGNO_VOUCHERS = [
  { code: "SOGNO20", discount: 0.20, label: "20% OFF Welcome Voucher", minSpend: 15.00 },
  { code: "FREESHIP", discount: 5.00, type: "flat", label: "RM 5 OFF Delivery", minSpend: 30.00 }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOGNO_BRAND, SOGNO_ROAST_CRAFT, SOGNO_OUTLETS, SOGNO_CATEGORIES, SOGNO_MENU, SOGNO_VOUCHERS };
}
