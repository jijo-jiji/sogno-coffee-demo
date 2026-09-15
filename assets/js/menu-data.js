// Sogno Coffee - menu, outlet and voucher data shared by the website and the app.

const SOGNO_BRAND = {
  name: "Sogno Coffee",
  tagline: "Un Sogno Diventato Realtà",
  established: "2023",
  origin: "Kota Bharu, Kelantan",
  companyNo: "SOGNO COFFEE SDN BHD (202301012275)"
};

// Addresses and place IDs from each outlet's Google Maps listing (checked September 2026).
// Pickup and delivery times are demo estimates.
const SOGNO_OUTLETS = [
  {
    id: "kota-bharu",
    name: "Kota Bharu",
    region: "Kelantan",
    address: "PT 210, Ground Floor, Depan KB Mall, Jalan Hamzah, Seksyen 19, 15050 Kota Bharu, Kelantan",
    placeId: "ChIJ5aQ7ERivtjERcDpqoU289sU",
    image: "assets/images/outlets/kota-bharu.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "25–35 min"
  },
  {
    id: "signature",
    name: "Signature, Jalan Kuala Krai",
    region: "Kelantan",
    address: "PT62, Tingkat 1, Bangunan Kicap Gajah, Batu 2, Jalan Kuala Krai, 15150 Kota Bharu, Kelantan",
    placeId: "ChIJ88YTTQCvtjEREtYNTY2ETvk",
    image: "assets/images/outlets/signature.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "25–35 min"
  },
  {
    id: "kubang-kerian",
    name: "Kubang Kerian",
    region: "Kelantan",
    address: "Lot 1867, Jalan Tok Kenali, Kubang Kerian, 16150 Kota Bharu, Kelantan",
    placeId: "ChIJobC9fQC7tjER6cY6Norri8c",
    image: "assets/images/outlets/kubang-kerian.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "25–35 min"
  },
  {
    id: "ampang",
    name: "Ampang",
    region: "Klang Valley",
    address: "58-G & 58-M, Jalan Memanda 9, Taman Dato Ahmad Razali, 68000 Ampang Jaya, Selangor",
    placeId: "ChIJMzoWTwA3zDERy2uDMcWPefw",
    image: "assets/images/outlets/ampang.jpg",
    pickupTime: "5–10 min",
    deliveryTime: "20–30 min"
  },
  {
    id: "taman-melawati",
    name: "Taman Melawati",
    region: "Klang Valley",
    address: "273, Jalan Bandar 11, Taman Melawati, 53100 Kuala Lumpur",
    placeId: "ChIJN4bscgA5zDERe6z1EI8ZWn8",
    image: "assets/images/outlets/taman-melawati.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "20–30 min"
  },
  {
    id: "shah-alam",
    name: "Shah Alam Seksyen 7",
    region: "Klang Valley",
    address: "13, Jalan Plumbum U 7/U, Seksyen 7, 40000 Shah Alam, Selangor",
    placeId: "ChIJr5hYagBTzDERE3iZtCCqTys",
    image: "assets/images/outlets/shah-alam.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "20–30 min"
  },
  {
    id: "setia-alam",
    name: "Setia Alam",
    region: "Klang Valley",
    address: "47-2F, Persiaran Setia Utama, Alam Nusantara, 40170 Shah Alam, Selangor",
    placeId: "ChIJp6ufJwBRzDERSXbNn1V1rsk",
    image: "assets/images/outlets/setia-alam.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "20–30 min"
  },
  {
    id: "putrajaya",
    name: "Putrajaya",
    region: "Klang Valley",
    address: "Level 1, 5A, Jalan Pulau Pinang P15, Presint 15, 62050 Putrajaya",
    placeId: "ChIJ1aLCLgDJzTERuvYX4_nuOWI",
    image: "assets/images/outlets/putrajaya.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "25–35 min"
  },
  {
    id: "bangi",
    name: "Bangi",
    region: "Klang Valley",
    address: "17G, Jalan 8/35, Seksyen 8, 43650 Bangi, Selangor",
    placeId: "ChIJQxjpVgDLzTERH8dLVJubGqs",
    image: "assets/images/outlets/bangi.jpg",
    pickupTime: "10–15 min",
    deliveryTime: "25–35 min"
  }
];

function sognoMapsUrl(outlet) {
  const q = encodeURIComponent(`Sogno Coffee ${outlet.name}, ${outlet.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=${outlet.placeId}`;
}

const SOGNO_CATEGORIES = [
  { id: "pastry-sogno", name: "Pastry Sogno" },
  { id: "coffee", name: "Coffee" },
  { id: "frappe", name: "Frappe" },
  { id: "milk-series", name: "Milk Series" }
];

// Option groups, in the order they appear on the item sheet.
const SOGNO_OPTION_GROUPS = [
  { key: "temp", label: "Temperature" },
  { key: "serving", label: "Serve" },
  { key: "topping", label: "Topping" },
  { key: "milk", label: "Milk" },
  { key: "bean", label: "Espresso" },
  { key: "sweetness", label: "Sweetness" },
  { key: "whippedCream", label: "Whipped cream" }
];

const SWEETNESS = [{ label: "Normal" }, { label: "Less sweet" }, { label: "No sugar" }];
const MILK = [{ label: "Fresh milk" }, { label: "Oat milk", price: 3.00 }, { label: "Soy milk", price: 2.00 }];
const BEAN = [{ label: "House blend" }, { label: "Single origin", price: 2.50 }];
const SERVING = [{ label: "Warmed" }, { label: "Room temperature" }];
const WHIPPED = [{ label: "With whipped cream" }, { label: "No whipped cream" }];

const SOGNO_MENU = [
  // Pastry Sogno
  {
    id: "red-velvet-croissant",
    categoryId: "pastry-sogno",
    name: "Red Velvet Croissant",
    price: 21.00,
    description: "Red velvet croissant filled with cream cheese.",
    badge: "Signature",
    image: "assets/images/menu/red-velvet-croissant.jpg",
    options: { serving: SERVING }
  },
  {
    id: "crofa",
    categoryId: "pastry-sogno",
    name: "Crofa",
    price: 18.90,
    description: "Waffle-pressed croissant topped with chocolate and fresh strawberries.",
    image: "assets/images/menu/crofa.jpg",
    options: {
      serving: SERVING,
      topping: [{ label: "Regular" }, { label: "Extra chocolate", price: 2.00 }]
    }
  },
  {
    id: "kunafa-pistachio",
    categoryId: "pastry-sogno",
    name: "Kunafa Pistachio",
    price: 18.90,
    description: "Croissant filled with pistachio cream and crispy kunafa.",
    badge: "Popular",
    image: "assets/images/menu/kunafa-pistachio.jpg",
    options: { serving: SERVING }
  },
  {
    id: "pain-au-kitkat",
    categoryId: "pastry-sogno",
    name: "Pain Au Kitkat",
    price: 17.00,
    description: "Flaky pastry filled with chocolate and KitKat.",
    image: "assets/images/menu/pain-au-kitkat.jpg",
    options: { serving: SERVING }
  },
  {
    id: "jumbo-croissant",
    categoryId: "pastry-sogno",
    name: "Jumbo Croissant",
    price: 40.00,
    description: "Our giant butter croissant, made for sharing.",
    badge: "Signature",
    image: "assets/images/menu/jumbo-croissant.jpg",
    options: { serving: SERVING }
  },

  // Coffee
  {
    id: "buttercream-latte",
    categoryId: "coffee",
    name: "Buttercream Latte",
    price: 19.10,
    description: "Espresso and milk topped with sweet buttercream foam.",
    badge: "Bestseller",
    image: "assets/images/menu/buttercream-latte.jpg",
    options: { temp: [{ label: "Iced" }, { label: "Hot" }], milk: MILK, bean: BEAN, sweetness: SWEETNESS }
  },
  {
    id: "spanish-latte",
    categoryId: "coffee",
    name: "Spanish Latte",
    price: 17.60,
    description: "Espresso with fresh milk and condensed milk.",
    image: "assets/images/menu/spanish-latte.jpg",
    options: { temp: [{ label: "Iced" }, { label: "Hot" }], milk: MILK, bean: BEAN, sweetness: SWEETNESS.slice(0, 2) }
  },
  {
    id: "sogno-americano",
    categoryId: "coffee",
    name: "Sogno Americano",
    price: 11.00,
    description: "Double espresso topped up with water. Clean and bold.",
    image: "assets/images/menu/sogno-americano.jpg",
    options: { temp: [{ label: "Iced" }, { label: "Hot" }], bean: BEAN }
  },
  {
    id: "caramel-macchiato",
    categoryId: "coffee",
    name: "Caramel Macchiato",
    price: 18.50,
    description: "Vanilla milk marked with espresso and finished with caramel.",
    image: "assets/images/menu/caramel-macchiato.jpg",
    options: { temp: [{ label: "Iced" }, { label: "Hot" }], milk: MILK, sweetness: SWEETNESS.slice(0, 2) }
  },

  // Frappe
  {
    id: "biscoff-frappe",
    categoryId: "frappe",
    name: "Biscoff Frappe",
    price: 23.50,
    description: "Blended with Lotus Biscoff and caramel, topped with whipped cream.",
    image: "assets/images/menu/biscoff-frappe.jpg",
    options: { sweetness: SWEETNESS.slice(0, 2), whippedCream: WHIPPED }
  },
  {
    id: "matcha-cream-frappe",
    categoryId: "frappe",
    name: "Matcha Cream Frappe",
    price: 22.00,
    description: "Matcha blended with milk and vanilla, topped with whipped cream.",
    image: "assets/images/menu/matcha-cream-frappe.jpg",
    options: { sweetness: SWEETNESS.slice(0, 2), whippedCream: WHIPPED }
  },
  {
    id: "dark-chocolate-mocha-frappe",
    categoryId: "frappe",
    name: "Dark Chocolate Mocha Frappe",
    price: 22.50,
    description: "Chocolate and espresso blended with ice, topped with whipped cream.",
    image: "assets/images/menu/dark-chocolate-mocha-frappe.jpg",
    options: { sweetness: SWEETNESS.slice(0, 2), whippedCream: WHIPPED }
  },

  // Milk Series
  {
    id: "pink-lady-milk",
    categoryId: "milk-series",
    name: "Pink Lady Milk",
    price: 19.10,
    description: "Milk blended with Pink Lady apple and a hint of cinnamon.",
    image: "assets/images/menu/pink-lady-milk.jpg",
    options: { temp: [{ label: "Blended" }, { label: "Chilled" }], sweetness: SWEETNESS.slice(0, 2) }
  },
  {
    id: "strawberry-dream-milk",
    categoryId: "milk-series",
    name: "Strawberry Dream Milk",
    price: 18.00,
    description: "Strawberry purée layered with fresh milk.",
    image: "assets/images/menu/strawberry-dream-milk.jpg",
    options: { temp: [{ label: "Iced" }, { label: "Warm" }], sweetness: SWEETNESS.slice(0, 2) }
  },
  {
    id: "pistachio-cream-milk",
    categoryId: "milk-series",
    name: "Pistachio Cream Milk",
    price: 19.50,
    description: "Pistachio milk with a creamy finish. Caffeine-free.",
    image: "assets/images/menu/pistachio-cream-milk.jpg",
    options: { temp: [{ label: "Iced" }, { label: "Warm" }], sweetness: SWEETNESS.slice(0, 2) }
  }
];

const SOGNO_VOUCHERS = [
  { code: "SOGNO20", type: "percent", value: 0.20, label: "20% off your order", minSpend: 15.00 },
  { code: "FREESHIP", type: "delivery", value: 5.00, label: "RM 5 off delivery", minSpend: 30.00 }
];

const SOGNO_CLUB = { stamps: 6, goal: 10, reward: "Buttercream Latte" };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SOGNO_BRAND, SOGNO_OUTLETS, SOGNO_CATEGORIES, SOGNO_OPTION_GROUPS, SOGNO_MENU, SOGNO_VOUCHERS, SOGNO_CLUB };
}
