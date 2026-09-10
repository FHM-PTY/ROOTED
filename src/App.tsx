import { useState, useEffect, useMemo } from "react";

export type Gender = "ALL" | "WOMEN" | "MEN" | "UNISEX";
export type Category = "all" | "kicks" | "outerwear" | "workwear" | "accessories" | "thrift";

export interface Vendor {
  id: number;
  name: string;
  tagline: string;
  origin: string;
  gender: Gender[];
  categories: Category[];
  priceRange: string;
  featured: boolean;
  color: string;
  productCount: number;
  coordinates: string;
  isThrift?: boolean;
  specialty?: string;
  conditionStandard?: string;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  category: Category;
  gender: Gender[];
  price: number;
  originalPrice?: number | null;
  image: string;
  secondaryImage: string;
  badge: string;
  origin: string;
  fabric: string;
  sizes: string[];
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  isThrift?: boolean;
  condition?: string;
  measurements?: string;
  rarity?: string;
}

export interface LockerStation {
  id: string;
  name: string;
  address: string;
  hours: string;
  type: string;
  distance: string;
  commuterTag: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

const lockerStations: LockerStation[] = [
  {
    id: "loc-1",
    name: "Diepkloof Zone 4 Spaza Hub",
    address: "Mthembu Superette, 1248 Immink Dr, Diepkloof, Soweto",
    hours: "07:00 – 21:00 Daily",
    type: "Concierge Spaza Station",
    distance: "0.6 km",
    commuterTag: "🏪 Private Concierge • 🚕 Zone 4 Rank",
  },
  {
    id: "loc-2",
    name: "Braamfontein Juta Smart Locker",
    address: "68 Juta Street (Adjacent to The Playground), Braamfontein",
    hours: "24/7 Smart Access PIN",
    type: "Automated Smart Vault",
    distance: "Central JHB",
    commuterTag: "⚡ 24/7 Smart PIN • 🚆 350m Park Station",
  },
  {
    id: "loc-3",
    name: "Maponya Mall PEP Paxi Station",
    address: "Chris Hani Rd, Klipspruit, Soweto (Lower Level Entrance 3)",
    hours: "09:00 – 18:00 Mon-Sun",
    type: "Paxi Heritage Counter",
    distance: "1.4 km",
    commuterTag: "📦 Dedicated Counter • 🚌 Central Bus Terminal",
  },
  {
    id: "loc-4",
    name: "Tembisa Plaza Pargo Hub",
    address: "Shop 14, Andrew Mapheto Dr, Tembisa",
    hours: "08:00 – 18:00 Daily",
    type: "Pargo Collection Salon",
    distance: "East Rand",
    commuterTag: "📍 Pargo Salon • 🏬 Main Lower Plaza",
  },
  {
    id: "loc-5",
    name: "Umlazi Mega City Station",
    address: "50 Mangosuthu Hwy, Umlazi V, Durban",
    hours: "08:30 – 17:30 Mon-Sun",
    type: "Smart Locker Vault",
    distance: "KZN South",
    commuterTag: "⚡ Smart Locker • 🚕 Mega City Rank 2",
  },
];

const vendors: Vendor[] = [
  // 1. Haute Streetwear Fashion Houses
  {
    id: 1,
    name: "Soweto Threads",
    tagline: "Heritage raw denim, chainstitched kasi tailoring & pleated formalwear",
    origin: "Orlando West, Soweto",
    gender: ["MEN", "WOMEN", "UNISEX"],
    categories: ["workwear", "outerwear"],
    priceRange: "R 780 - R 1,800",
    featured: true,
    color: "#C59B63",
    productCount: 48,
    coordinates: "26.2415° S, 27.9157° E",
    isThrift: false,
  },
  {
    id: 2,
    name: "Braam District",
    tagline: "480 GSM heavy fleece & commuter technical silhouettes",
    origin: "Braamfontein, Johannesburg",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["outerwear", "accessories"],
    priceRange: "R 520 - R 1,200",
    featured: true,
    color: "#1D1D1B",
    productCount: 64,
    coordinates: "26.1929° S, 28.0345° E",
    isThrift: false,
  },
  {
    id: 3,
    name: "Gusheshe Classics",
    tagline: "Vulcanized footwear inspired by South African spinning heritage",
    origin: "Pinetown, KwaZulu-Natal",
    gender: ["UNISEX", "MEN"],
    categories: ["kicks"],
    priceRange: "R 1,450 - R 2,200",
    featured: true,
    color: "#C59B63",
    productCount: 32,
    coordinates: "29.8167° S, 30.8500° E",
    isThrift: false,
  },
  {
    id: 4,
    name: "Amapiano Dept",
    tagline: "Nocturnal festival silhouettes & reversible archival jacquards",
    origin: "Salt River, Cape Town",
    gender: ["UNISEX", "WOMEN", "MEN"],
    categories: ["accessories", "outerwear"],
    priceRange: "R 360 - R 950",
    featured: false,
    color: "#787774",
    productCount: 41,
    coordinates: "33.9317° S, 18.4632° E",
    isThrift: false,
  },
  {
    id: 5,
    name: "NORR",
    tagline: "Scandinavian minimalism redefined with architectural virgin wools",
    origin: "Copenhagen",
    gender: ["WOMEN"],
    categories: ["outerwear", "accessories"],
    priceRange: "R 1,800 - R 4,900",
    featured: false,
    color: "#2C3E50",
    productCount: 42,
    coordinates: "55.6761° N, 12.5683° E",
    isThrift: false,
  },
  {
    id: 6,
    name: "VOLT",
    tagline: "Technical tailored streetwear engineered for high-velocity urban motion",
    origin: "London",
    gender: ["MEN", "WOMEN"],
    categories: ["workwear", "accessories"],
    priceRange: "R 1,200 - R 2,600",
    featured: false,
    color: "#1D1D1B",
    productCount: 55,
    coordinates: "51.5074° N, 0.1278° W",
    isThrift: false,
  },
  {
    id: 7,
    name: "STRATA",
    tagline: "Layered denim silhouettes cut with geological precision",
    origin: "Los Angeles",
    gender: ["MEN", "UNISEX"],
    categories: ["workwear", "outerwear"],
    priceRange: "R 1,500 - R 2,800",
    featured: false,
    color: "#2B3A5C",
    productCount: 38,
    coordinates: "34.0522° N, 118.2437° W",
    isThrift: false,
  },
  {
    id: 8,
    name: "GROUNDWORK",
    tagline: "Utilitarian heavy canvas workwear built for rugged terrain",
    origin: "Detroit",
    gender: ["MEN"],
    categories: ["outerwear", "workwear"],
    priceRange: "R 1,400 - R 3,200",
    featured: false,
    color: "#3D3328",
    productCount: 29,
    coordinates: "42.3314° N, 83.0458° W",
    isThrift: false,
  },

  // 2. Specialized Dunusa & Vintage Vault Curators (Savoir-Faire)
  {
    id: 9,
    name: "Dunusa Archive Co.",
    tagline: "Hand-hunted 90s sportswear, crinkle nylon windbreakers & vintage track tops",
    origin: "Small Street CBD, Johannesburg",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["thrift", "outerwear"],
    priceRange: "R 380 - R 950",
    featured: true,
    color: "#C59B63",
    productCount: 36,
    coordinates: "26.2023° S, 28.0436° E",
    isThrift: true,
    specialty: "90s Sportswear & Windbreakers",
    conditionStandard: "Triple-Washed & Steam-Restored",
  },
  {
    id: 10,
    name: "Kasi Vintage Vault",
    tagline: "Archival Sophiatown leather bombers, retro knit polos & pleated trousers",
    origin: "Diepkloof Zone 2, Soweto",
    gender: ["MEN", "UNISEX", "WOMEN"],
    categories: ["thrift", "workwear", "outerwear"],
    priceRange: "R 450 - R 1,600",
    featured: true,
    color: "#C59B63",
    productCount: 24,
    coordinates: "26.2482° S, 27.9311° E",
    isThrift: true,
    specialty: "80s Sophiatown Leathers & Knits",
    conditionStandard: "Grade A+ Handpicked Vault",
  },
  {
    id: 11,
    name: "Bree St. Reworks",
    tagline: "1-of-1 upcycled work jackets, custom patched denim & distressed canvas gear",
    origin: "Bree Taxi Interchange, JHB",
    gender: ["UNISEX", "MEN"],
    categories: ["thrift", "workwear"],
    priceRange: "R 550 - R 1,250",
    featured: true,
    color: "#1D1D1B",
    productCount: 19,
    coordinates: "26.2001° S, 28.0389° E",
    isThrift: true,
    specialty: "1-of-1 Reworked Canvas & Denim",
    conditionStandard: "Hand-Reinforced & Upcycled",
  },
  {
    id: 12,
    name: "South Beach Retro",
    tagline: "Surf & skater vintage, retro graphic tees & washed corduroy overshirts",
    origin: "The Workshop, Durban",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["thrift", "accessories", "outerwear"],
    priceRange: "R 280 - R 650",
    featured: false,
    color: "#787774",
    productCount: 28,
    coordinates: "29.8587° S, 31.0218° E",
    isThrift: true,
    specialty: "90s Coastal Surf & Skate",
    conditionStandard: "Grade A Soft-Wash Restored",
  },
];

const catalogData: Product[] = [
  {
    id: 1,
    title: "Highveld 480 GSM Heavy Fleece",
    brand: "Braam District",
    category: "outerwear",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 890,
    originalPrice: 1100,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
    badge: "01 / BRAAMFONTEIN",
    origin: "Milled in Ladysmith, cut in Braam",
    fabric: "100% Brushed French Terry (480 GSM)",
    sizes: ["S", "M", "L", "XL", "2XL"],
    description: "Engineered specifically for biting Highveld winter mornings. Boxy drop-shoulder silhouette, double-layered hood with blind seam finish and concealed side handwarmers.",
    isNew: true,
    isSale: true,
    isThrift: false,
  },
  {
    id: 2,
    title: "Gusheshe '325iS' Low Trainer",
    brand: "Gusheshe Classics",
    category: "kicks",
    gender: ["MEN", "UNISEX"],
    price: 1850,
    originalPrice: 2200,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    badge: "02 / ICONIC WHEEL",
    origin: "Vulcanized in Pinetown, KZN",
    fabric: "Full-grain calf leather + tire-siping tread",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    description: "Homage to South Africa's legendary spinning culture and the classic 325iS shadowline. Reinforced toe wrap with slip-resistant asphalt grip cupsole.",
    isNew: false,
    isSale: true,
    isThrift: false,
  },
  {
    id: 3,
    title: "Orlando 14oz Raw Workwear Dungaree",
    brand: "Soweto Threads",
    category: "workwear",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 1250,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    badge: "03 / ATELIER DENIM",
    origin: "Sewn in Orlando West, Soweto",
    fabric: "14oz Unwashed Raw Selvedge Denim",
    sizes: ["30", "32", "34", "36", "38"],
    description: "Cut for daily motion. Triple-needle chainstitching, antiqued brass buckles, and deep reinforced cargo utility sleeves that age uniquely with wear.",
    isNew: true,
    isSale: false,
    isThrift: false,
  },
  {
    id: 4,
    title: "Taxi Rank Crossbody Security Sling",
    brand: "Braam District",
    category: "accessories",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 520,
    originalPrice: 650,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    badge: "04 / ANTI-THEFT",
    origin: "Manufactured in Durban Central",
    fabric: "Cordura 500D Water-Repellent Nylon",
    sizes: ["Standard"],
    description: "Engineered for moving through dense transport interchanges like Bree and Noord. Snug body-hug contour with shielded zipper runs and quick-release buckle.",
    isNew: false,
    isSale: true,
    isThrift: false,
  },
  {
    id: 5,
    title: "Pantsula Pleated Chino Trouser",
    brand: "Soweto Threads",
    category: "workwear",
    gender: ["MEN", "UNISEX"],
    price: 780,
    originalPrice: 920,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop",
    badge: "05 / HERITAGE PLEAT",
    origin: "Cut in Meadowlands Zone 2",
    fabric: "Heavy Cotton Twill with Mercerized Finish",
    sizes: ["30", "32", "34", "36"],
    description: "Twin deep front pleats with tapered break specifically tailored to highlight low sneakers without stacking or fraying at the hem.",
    isNew: false,
    isSale: true,
    isThrift: false,
  },
  {
    id: 6,
    title: "Vilakazi Minimalist Corduroy Overshirt",
    brand: "Soweto Threads",
    category: "outerwear",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 980,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    badge: "06 / SOWETO CORD",
    origin: "Tailored in Orlando East",
    fabric: "8-Wale Chunky Cotton Corduroy",
    sizes: ["S", "M", "L", "XL"],
    description: "Versatile overlayer inspired by Sophiatown jazz pioneers and modern Sunday gatherings. Horn buttons with concealed chest utility pocket.",
    isNew: true,
    isSale: false,
    isThrift: false,
  },
  {
    id: 7,
    title: "Spaza Speed Trainer V2",
    brand: "Gusheshe Classics",
    category: "kicks",
    gender: ["MEN", "WOMEN", "UNISEX"],
    price: 1450,
    originalPrice: 1700,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
    badge: "07 / COMMUTE CUSHION",
    origin: "Assembled in Pietermaritzburg",
    fabric: "Engineered spacer mesh + dual-density EVA",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"],
    description: "Built for the daily pedestrian hustle across railway bridges and taxi ranks. Ultra-light responsiveness with reinforced TPU heel counter.",
    isNew: false,
    isSale: true,
    isThrift: false,
  },
  {
    id: 8,
    title: "Amapiano Nocturnal Reversible Bucket",
    brand: "Amapiano Dept",
    category: "accessories",
    gender: ["UNISEX", "WOMEN", "MEN"],
    price: 360,
    originalPrice: 420,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=800&auto=format&fit=crop",
    badge: "08 / LOGHOUSE ESSENTIAL",
    origin: "Stitched in Salt River, Cape Town",
    fabric: "Matte Technical Poly + Woven Jacquard",
    sizes: ["One Size"],
    description: "Double-sided water-resistant festival headwear. Clean unbranded black on exterior, archival taxi route graphic on flipside.",
    isNew: false,
    isSale: true,
    isThrift: false,
  },

  // 3. Authentic 1-of-1 Dunusa Vault Archive (Maison Savoir-Faire)
  {
    id: 13,
    title: "90s Italian Colorblock Retro Windbreaker",
    brand: "Dunusa Archive Co.",
    category: "thrift",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 480,
    originalPrice: 750,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    badge: "DUNUSA 01 / 1-OF-1",
    origin: "Hunted at Small Street CBD",
    fabric: "100% Crinkle Nylon Taffeta (Steam Cleaned)",
    sizes: ["Fits L (1-of-1)"],
    description: "Authentic 1990s colorblocked track windbreaker sourced from the heart of Johannesburg's wholesale garment district. Mint elastic cuffs and functional stowaway hood.",
    isNew: false,
    isSale: true,
    isThrift: true,
    condition: "Grade A+ (Flawless Mint)",
    measurements: "Pit-to-Pit: 60cm | Length: 72cm",
    rarity: "1-OF-1 ARCHIVE PIECE",
  },
  {
    id: 14,
    title: "Archival Sophiatown Leather Bomber",
    brand: "Kasi Vintage Vault",
    category: "thrift",
    gender: ["MEN", "UNISEX"],
    price: 1350,
    originalPrice: 1680,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
    badge: "VAULT 02 / 1-OF-1",
    origin: "Diepkloof Zone 2 Private Vault",
    fabric: "Full-Grain Saddle Cowhide + Quilted Satin",
    sizes: ["Fits M (1-of-1)"],
    description: "Timeless heavy leather flight jacket with decades of natural patina. Heavy brass YKK zippers, storm-flap front closure, and authentic jazz-era silhouette.",
    isNew: false,
    isSale: true,
    isThrift: true,
    condition: "Vintage Distressed (Natural Patina)",
    measurements: "Pit-to-Pit: 56cm | Length: 67cm",
    rarity: "1-OF-1 ARCHIVE PIECE",
  },
  {
    id: 15,
    title: "Reworked Duck Canvas Utility Vest",
    brand: "Bree St. Reworks",
    category: "thrift",
    gender: ["UNISEX", "MEN"],
    price: 820,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop",
    badge: "REWORK 03 / 1-OF-1",
    origin: "Reconstructed at Bree Taxi Rank Workshop",
    fabric: "12oz Repurposed Heavy Canvas + Brass Rivets",
    sizes: ["Fits M-L (1-of-1)"],
    description: "Crafted from salvaged Detroit duck workwear and upcycled into an ultra-functional commuter tactical vest. Features 6 utility compartments and reinforced chainstitch hems.",
    isNew: true,
    isSale: false,
    isThrift: true,
    condition: "1-of-1 Upcycled & Reconstructed",
    measurements: "Pit-to-Pit: 54cm | Length: 65cm",
    rarity: "1-OF-1 CUSTOM REWORK",
  },
  {
    id: 16,
    title: "1994 Durban Surf Corduroy Overshirt",
    brand: "South Beach Retro",
    category: "thrift",
    gender: ["UNISEX", "WOMEN", "MEN"],
    price: 420,
    originalPrice: 520,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=800&auto=format&fit=crop",
    badge: "RETRO 04 / 1-OF-1",
    origin: "Sourced from South Beach Arcade Vault",
    fabric: "Washed Wide-Wale Cotton Corduroy",
    sizes: ["Fits L (1-of-1)"],
    description: "Sun-faded forest green corduroy overlayer from the mid-90s coastal skate and surf community. Tortoise shell button accents and relaxed boxy drape.",
    isNew: false,
    isSale: true,
    isThrift: true,
    condition: "Grade A Soft-Wash (Sanitized)",
    measurements: "Pit-to-Pit: 58cm | Length: 74cm",
    rarity: "1-OF-1 ARCHIVE PIECE",
  },
  {
    id: 17,
    title: "Vintage Highveld Racing Team Track Top",
    brand: "Dunusa Archive Co.",
    category: "thrift",
    gender: ["UNISEX", "MEN"],
    price: 560,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?q=80&w=800&auto=format&fit=crop",
    secondaryImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
    badge: "DUNUSA 05 / 1-OF-1",
    origin: "Small Street CBD Deadstock Stash",
    fabric: "Heavyweight Poly-Cotton Tricot Knit",
    sizes: ["Fits M (1-of-1)"],
    description: "Unworn deadstock archival track jacket with contrast raglan piping, funnel neck zip, and embroidered motorsport insignia from the late 80s Kyalami era.",
    isNew: false,
    isSale: false,
    isThrift: true,
    condition: "Deadstock (Unworn Vintage)",
    measurements: "Pit-to-Pit: 55cm | Length: 68cm",
    rarity: "1-OF-1 DEADSTOCK ARCHIVE",
  },
];

export default function App() {
  // Navigation & Filtering
  const [activeSection, setActiveSection] = useState<"shop" | "vendors">("shop");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [activeGender, setActiveGender] = useState<Gender>("ALL");
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<"curated" | "price-asc" | "price-desc" | "popular">("curated");
  const [vendorTypeFilter, setVendorTypeFilter] = useState<"all" | "ateliers" | "thrift">("all");

  // Interactive Overlays
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLockerModalOpen, setIsLockerModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocker, setSelectedLocker] = useState<LockerStation>(lockerStations[0]);

  // Quick Detail Modal
  const [quickDetailProduct, setQuickDetailProduct] = useState<Product | null>(null);
  const [selectedModalSize, setSelectedModalSize] = useState<string>("");

  // Order Success Modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [orderToken, setOrderToken] = useState<string>("EKASI-7921-ZA");

  // Commerce State
  const [cart, setCart] = useState<CartItem[]>([
    { product: catalogData[0], size: "L", quantity: 1 },
  ]);
  const [wishlist, setWishlist] = useState<number[]>([1, 13]);
  const [appliedVoucher, setAppliedVoucher] = useState<boolean>(false);
  const [voucherInput, setVoucherInput] = useState<string>("");
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Active Hotspot Hover in Hero
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<{ title: string; message: string; visible: boolean } | null>(null);

  const showToast = (title: string, message: string) => {
    setToast({ title, message, visible: true });
    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 3500);
  };

  // Keyboard shortcut (Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
        setIsLockerModalOpen(false);
        setIsSearchModalOpen(false);
        setQuickDetailProduct(null);
        setIsSuccessModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...catalogData];

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (activeGender !== "ALL") {
      result = result.filter((p) => p.gender.includes(activeGender));
    }

    if (activeBrand !== "all") {
      result = result.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase());
    }

    if (activeSort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (activeSort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (activeSort === "popular") {
      result.sort((a, b) => (b.isThrift ? 1 : 0) - (a.isThrift ? 1 : 0));
    }

    return result;
  }, [activeCategory, activeGender, activeBrand, activeSort]);

  // Thrift specific products for the Dunusa Vault
  const thriftProducts = useMemo(() => {
    return catalogData.filter((p) => p.isThrift);
  }, []);

  const thriftVendors = useMemo(() => {
    return vendors.filter((v) => v.isThrift);
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return catalogData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        (item.condition && item.condition.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const freeThreshold = 650;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));
  const qualifiesFreeLocker = cartSubtotal >= freeThreshold;
  const discountAmount = appliedVoucher ? Math.round(cartSubtotal * 0.15) : 0;
  const totalPayable = Math.max(0, cartSubtotal - discountAmount);

  // Cart actions
  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === size);
      if (idx > -1) {
        if (product.isThrift) {
          showToast("Maison 1-of-1 Vault", "This rare archive silhouette exists as a single unique piece.");
          return prev;
        }
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    showToast("Ajouté au Panier", `${product.title} (${size}) placed in your selection.`);
  };

  const addCapsuleBundleToCart = () => {
    const p1 = catalogData[0]; // Fleece
    const p2 = catalogData[4]; // Chino
    const p3 = catalogData[1]; // Trainer

    setCart((prev) => {
      let next = [...prev];
      const itemsToAdd = [
        { product: p1, size: "L" },
        { product: p2, size: "32" },
        { product: p3, size: "UK 8" },
      ];
      for (const item of itemsToAdd) {
        const idx = next.findIndex((i) => i.product.id === item.product.id && i.size === item.size);
        if (idx > -1) {
          next[idx].quantity += 1;
        } else {
          next.push({ product: item.product, size: item.size, quantity: 1 });
        }
      }
      return next;
    });

    setAppliedVoucher(true);
    showToast("L'Ensemble Ajouté", "The 3-Piece Commuter Capsule has been added with privilege savings.");
    setIsCartOpen(true);
  };

  const adjustCartQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const item = prev[index];
      if (item.product.isThrift && delta > 0) {
        showToast("Maison Archive", "Single edition: only 1 unit exists in our inventory.");
        return prev;
      }
      const next = [...prev];
      next[index].quantity += delta;
      if (next[index].quantity <= 0) {
        next.splice(index, 1);
      }
      return next;
    });
  };

  const removeCartItem = (index: number) => {
    const item = cart[index];
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast("Pièce Retirée", `${item.product.title} removed from selection.`);
  };

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase();
    if (code === "DELVAUX" || code === "KASIDRIP" || code === "MZANSI" || code === "DUNUSA") {
      setAppliedVoucher(true);
      setVoucherMessage({ text: "Privilege code applied: 15% Maison courtesy discount.", isError: false });
    } else {
      setVoucherMessage({ text: "Code unverified. Try code: DELVAUX", isError: true });
    }
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Archive Privée", "Piece removed from saved list.");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Archive Privée", "Piece preserved in your personal collection.");
        return [...prev, productId];
      }
    });
  };

  const openQuickDetail = (product: Product) => {
    setQuickDetailProduct(product);
    setSelectedModalSize(product.sizes[0]);
  };

  const handleTriggerCheckout = () => {
    if (cart.length === 0) {
      showToast("Panier Vide", "Select items before initiating concierge checkout.");
      return;
    }
    setIsCartOpen(false);
    const randomToken = "LB-" + Math.floor(1000 + Math.random() * 9000) + "-ZA";
    setOrderToken(randomToken);
    setIsSuccessModalOpen(true);
    setCart([]);
  };

  const clearAllFilters = () => {
    setActiveCategory("all");
    setActiveGender("ALL");
    setActiveBrand("all");
    setActiveSort("curated");
  };

  const isFilterActive = activeCategory !== "all" || activeGender !== "ALL" || activeBrand !== "all";

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1D1D1B] flex flex-col font-sans selection:bg-[#1D1D1B] selection:text-[#FBF9F5]">
      {/* 1. Delvaux-Style House Announcement Bar */}
      <aside aria-label="Announcement" className="bg-[#FFFFFF] text-[#1D1D1B] text-[10px] tracking-[0.2em] font-sans border-b border-[#1D1D1B]/8 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left text-[#787774]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59B63] inline-block"></span>
            <span className="uppercase tracking-[0.2em]">"Time rejects anything made in haste"</span>
            <span className="text-[#1D1D1B]/20 hidden md:inline">&middot;</span>
            <span className="hidden md:inline">Complimentary Concierge Locker Collection over R650</span>
          </div>
          <div className="flex items-center gap-4 text-[#787774] text-[9px] font-mono tracking-widest">
            <span>CAPITEC 1-TAP</span>
            <span>&middot;</span>
            <span>PAYFLEX PAY IN 4</span>
            <span>&middot;</span>
            <span className="text-[#1D1D1B] font-bold">ZAR (R)</span>
          </div>
        </div>
      </aside>

      {/* 2. Delvaux Iconic Header: Centered Maison Logotype with Quiet Luxury Symmetry */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#1D1D1B]/8 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="h-20 flex items-center justify-between gap-4">
            {/* Left Navigation: Delvaux Minimalist Monospaced & Spaced Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-[11px] font-medium tracking-[0.2em] uppercase text-[#1D1D1B]">
              <button
                onClick={() => {
                  setActiveSection("shop");
                  clearAllFilters();
                }}
                className={`transition-colors py-1 cursor-pointer border-b ${
                  activeSection === "shop" && activeCategory === "all"
                    ? "border-[#1D1D1B] text-[#1D1D1B]"
                    : "border-transparent text-[#787774] hover:text-[#1D1D1B]"
                }`}
              >
                La Collection
              </button>
              <button
                onClick={() => {
                  setActiveSection("shop");
                  setActiveCategory("thrift");
                }}
                className={`transition-colors py-1 cursor-pointer border-b flex items-center gap-1.5 ${
                  activeCategory === "thrift"
                    ? "border-[#C59B63] text-[#C59B63]"
                    : "border-transparent text-[#787774] hover:text-[#C59B63]"
                }`}
              >
                <span>Dunusa Vault</span>
                <span className="text-[8px] bg-[#C59B63]/15 text-[#C59B63] px-1 rounded tracking-normal font-mono">1-of-1</span>
              </button>
              <button
                onClick={() => setActiveSection("vendors")}
                className={`transition-colors py-1 cursor-pointer border-b ${
                  activeSection === "vendors"
                    ? "border-[#1D1D1B] text-[#1D1D1B]"
                    : "border-transparent text-[#787774] hover:text-[#1D1D1B]"
                }`}
              >
                Les Ateliers
              </button>
            </nav>

            {/* Center: Delvaux-Inspired Centered Architectural Monogram & Logotype */}
            <div className="flex flex-col items-center justify-center text-center cursor-pointer select-none"
              onClick={() => {
                setActiveSection("shop");
                clearAllFilters();
              }}
            >
              <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-[#C59B63] font-semibold mb-0.5">
                MAISON
              </span>
              <span
                className="text-2xl sm:text-3xl font-normal tracking-[-0.01em] text-[#1D1D1B]"
                style={{ fontFamily: "'Cormorant Garamond', 'Libre Baskerville', serif" }}
              >
                LE BENKELENG
              </span>
              <span className="text-[8px] font-mono tracking-[0.25em] text-[#787774] uppercase mt-0.5">
                BRUXELLES &middot; SOWETO &middot; JOHANNESBURG
              </span>
            </div>

            {/* Right: Concierge Locker, Search, Saved & Bag */}
            <div className="flex items-center gap-3 sm:gap-5 text-[11px] tracking-[0.15em] uppercase text-[#1D1D1B]">
              {/* Concierge Locker Location */}
              <button
                onClick={() => setIsLockerModalOpen(true)}
                className="hidden xl:flex items-center gap-2 text-left px-3 py-1.5 border border-[#1D1D1B]/10 hover:border-[#1D1D1B] transition-colors rounded-sm bg-[#FBF9F5]"
                title="Select delivery hub"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#C59B63]"></div>
                <div className="text-[10px] leading-tight">
                  <span className="text-[#787774] block text-[8px] font-mono uppercase">Locker Concierge</span>
                  <span className="font-medium text-[#1D1D1B] max-w-[120px] truncate block">{selectedLocker.name}</span>
                </div>
              </button>

              {/* Search trigger */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="p-1 text-[#1D1D1B] hover:text-[#C59B63] transition-colors cursor-pointer flex items-center gap-1.5"
                aria-label="Recherche"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                </svg>
                <span className="hidden sm:inline text-[10px] font-sans">Search</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => {
                  if (wishlist.length === 0) {
                    showToast("Archive Privée", "Your collection wishlist is currently empty.");
                  } else {
                    setActiveSection("shop");
                    showToast("Archive Privée", `Viewing ${wishlist.length} preserved silhouettes.`);
                  }
                }}
                className="relative p-1 text-[#1D1D1B] hover:text-[#C59B63] transition-colors cursor-pointer flex items-center gap-1.5"
                aria-label="Saved"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"></path>
                </svg>
                <span className="hidden sm:inline text-[10px] font-sans">Saved</span>
                {wishlist.length > 0 && (
                  <span className="text-[9px] font-mono text-[#C59B63] font-bold">({wishlist.length})</span>
                )}
              </button>

              {/* Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 border border-[#1D1D1B] px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] rounded-sm hover:bg-[#1D1D1B] hover:text-[#FBF9F5] transition-all cursor-pointer"
              >
                <span>Panier</span>
                <span className="text-[#C59B63] font-mono font-bold">({totalCartCount})</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Luxury Experience */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 sm:py-16">
        {/* 3. Hero: Delvaux Quiet Luxury Editorial (L'Architecture du Vêtement) */}
        <section className="border-b border-[#1D1D1B]/8 pb-16 sm:pb-24 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left 6 Columns: Delvaux Poetic Typography & Storytelling */}
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C59B63] border-b border-[#C59B63] pb-0.5">
                    COLLECTION HIVER &middot; AUTUMN/WINTER '26
                  </span>
                </div>

                <h1
                  className="text-4xl sm:text-6xl lg:text-7xl font-light text-[#1D1D1B] leading-[1.05]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Libre Baskerville', serif" }}
                >
                  L'Architecture<br />
                  <span className="italic font-normal">du Vêtement.</span>
                </h1>

                <p className="text-[#787774] text-sm sm:text-base leading-relaxed font-light max-w-lg">
                  Where South African urban street culture is elevated by the architectural discipline of the haute leather goods house. Heavyweight French terry, raw selvedge denim, and 1-of-1 Dunusa archival discoveries curated without haste.
                </p>
              </div>

              {/* Delvaux House Quote */}
              <div className="border-l border-[#C59B63] pl-4 py-1 italic font-serif text-[#1D1D1B] text-sm">
                "Time rejects anything made in haste."
                <span className="block not-italic font-mono text-[9px] text-[#787774] uppercase tracking-widest mt-1">
                  Maison House Motto &middot; Provenance 100% Gauteng &amp; KZN
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setActiveSection("shop");
                    clearAllFilters();
                  }}
                  className="px-6 py-3.5 bg-[#1D1D1B] text-[#FBF9F5] hover:bg-[#C59B63] text-[11px] font-sans tracking-[0.2em] uppercase rounded-sm transition-colors cursor-pointer"
                >
                  Découvrir La Collection →
                </button>
                <button
                  onClick={() => {
                    setActiveSection("shop");
                    setActiveCategory("thrift");
                  }}
                  className="px-6 py-3.5 border border-[#1D1D1B] text-[#1D1D1B] hover:border-[#C59B63] hover:text-[#C59B63] text-[11px] font-sans tracking-[0.2em] uppercase rounded-sm transition-colors cursor-pointer bg-transparent"
                >
                  L'Archive Dunusa (1-of-1)
                </button>
              </div>
            </div>

            {/* Right 6 Columns: Luxury Lookbook Framing with Subtle Brass Hotspots */}
            <div className="lg:col-span-6 relative aspect-[4/5] rounded-sm overflow-hidden bg-[#FFFFFF] border border-[#1D1D1B]/8 p-4 shadow-sm group">
              <div className="relative w-full h-full overflow-hidden bg-[#F8F6F1]">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
                  alt="Maison Editorial Lookbook"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-1000"
                />
              </div>

              {/* Discreet Editorial Tag */}
              <div className="absolute top-8 left-8 bg-[#FFFFFF]/90 backdrop-blur-xs text-[#1D1D1B] text-[9px] font-mono tracking-[0.2em] px-3 py-1 uppercase border border-[#1D1D1B]/10">
                LOOKBOOK ÉDITORIAL &middot; NO. 084
              </div>

              {/* Brass Hotspot 1 */}
              <div
                className="absolute"
                style={{ top: "35%", left: "46%" }}
                onMouseEnter={() => setHoveredHotspot(1)}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <button
                  onClick={() => openQuickDetail(catalogData[0])}
                  className="w-6 h-6 rounded-full bg-[#C59B63] text-white flex items-center justify-center font-serif text-xs brass-beacon cursor-pointer shadow-md hover:scale-110 transition-transform"
                  aria-label="Inspect Highveld Fleece"
                >
                  &middot;
                </button>
                <div
                  onClick={() => openQuickDetail(catalogData[0])}
                  className={`absolute left-8 -top-3 w-60 bg-[#FFFFFF] p-3.5 shadow-xl border border-[#1D1D1B]/10 font-sans text-xs cursor-pointer transition-all duration-300 z-20 ${
                    hoveredHotspot === 1 ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-2 pointer-events-none"
                  }`}
                >
                  <span className="text-[8px] font-mono text-[#C59B63] uppercase tracking-[0.2em] block">SÉLECTION 01 / BRAAMFONTEIN</span>
                  <div className="font-serif text-sm text-[#1D1D1B] mt-0.5">{catalogData[0].title}</div>
                  <div className="flex justify-between items-baseline mt-2 text-[11px] font-mono">
                    <span className="font-bold text-[#1D1D1B]">R {catalogData[0].price}</span>
                    <span className="text-[#C59B63] text-[10px] underline">Examiner la Pièce &rarr;</span>
                  </div>
                </div>
              </div>

              {/* Brass Hotspot 2 */}
              <div
                className="absolute"
                style={{ top: "80%", left: "52%" }}
                onMouseEnter={() => setHoveredHotspot(2)}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                <button
                  onClick={() => openQuickDetail(catalogData[1])}
                  className="w-6 h-6 rounded-full bg-[#C59B63] text-white flex items-center justify-center font-serif text-xs brass-beacon cursor-pointer shadow-md hover:scale-110 transition-transform"
                  aria-label="Inspect Gusheshe Trainer"
                >
                  &middot;
                </button>
                <div
                  onClick={() => openQuickDetail(catalogData[1])}
                  className={`absolute left-8 -top-8 w-60 bg-[#FFFFFF] p-3.5 shadow-xl border border-[#1D1D1B]/10 font-sans text-xs cursor-pointer transition-all duration-300 z-20 ${
                    hoveredHotspot === 2 ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-2 pointer-events-none"
                  }`}
                >
                  <span className="text-[8px] font-mono text-[#C59B63] uppercase tracking-[0.2em] block">SÉLECTION 02 / GUSHESHE</span>
                  <div className="font-serif text-sm text-[#1D1D1B] mt-0.5">{catalogData[1].title}</div>
                  <div className="flex justify-between items-baseline mt-2 text-[11px] font-mono">
                    <span className="font-bold text-[#1D1D1B]">R {catalogData[1].price}</span>
                    <span className="text-[#C59B63] text-[10px] underline">Examiner la Pièce &rarr;</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-8 right-8 text-[9px] font-mono tracking-[0.2em] text-[#787774] bg-[#FFFFFF]/90 backdrop-blur-xs px-3 py-2 flex justify-between border border-[#1D1D1B]/5">
                <span>GESTES ARTISANAUX &middot; TOUCH HOTSPOT</span>
                <span className="text-[#C59B63]">2 PIÈCES RÉPERTORIÉES</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The Dunusa Vault: Reinterpreted as Maison Savoir-Faire (Livre d'Or) */}
        <section className="mb-24 p-8 sm:p-14 bg-[#FFFFFF] rounded-sm border border-[#1D1D1B]/8 shadow-xs relative overflow-hidden">
          <div className="space-y-10">
            {/* Savoir-Faire Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1D1D1B]/8 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C59B63] bg-[#C59B63]/10 px-2 py-0.5 rounded-xs">
                    SAVOIR-FAIRE &middot; LE LIVRE D'OR
                  </span>
                  <span className="text-[9px] font-mono text-[#787774] tracking-widest">
                    L'ARCHIVE DUNUSA 1-OF-1
                  </span>
                </div>
                <h2
                  className="text-3xl sm:text-5xl font-light text-[#1D1D1B]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  L'Art de la Récupération.
                </h2>
                <p className="text-xs sm:text-sm text-[#787774] max-w-2xl font-light leading-relaxed">
                  Single-inventory vintage discoveries hand-hunted across the historic wholesale vaults of Small Street CBD, Bree Interchange, and Sophiatown jazz collections. Sanitized, steam-restored, and authenticated with precision.
                </p>
              </div>

              <div>
                <button
                  onClick={() => {
                    setActiveSection("shop");
                    setActiveCategory("thrift");
                  }}
                  className="px-5 py-3 border border-[#C59B63] text-[#C59B63] hover:bg-[#C59B63] hover:text-[#FFFFFF] text-[10px] font-sans tracking-[0.2em] uppercase rounded-sm transition-colors cursor-pointer"
                >
                  Consulter L'Archive ({thriftProducts.length} Pièces) &rarr;
                </button>
              </div>
            </div>

            {/* Quality Standard Pillars in Harvest Gold */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#FBF9F5] border border-[#1D1D1B]/5 rounded-sm">
                <span className="text-[#C59B63] block font-bold mb-1 tracking-wider">★ GRADE A+ FLUX</span>
                <span className="text-[10px] text-[#787774]">Strict manual condition appraisal</span>
              </div>
              <div className="p-4 bg-[#FBF9F5] border border-[#1D1D1B]/5 rounded-sm">
                <span className="text-[#1D1D1B] block font-bold mb-1 tracking-wider">⚡ 1-OF-1 ARCHIVE</span>
                <span className="text-[10px] text-[#787774]">Single unique piece nationwide</span>
              </div>
              <div className="p-4 bg-[#FBF9F5] border border-[#1D1D1B]/5 rounded-sm">
                <span className="text-[#C59B63] block font-bold mb-1 tracking-wider">🧼 VAPEUR &amp; HYGIÈNE</span>
                <span className="text-[10px] text-[#787774]">Triple-steamed &amp; sanitized</span>
              </div>
              <div className="p-4 bg-[#FBF9F5] border border-[#1D1D1B]/5 rounded-sm">
                <span className="text-[#1D1D1B] block font-bold mb-1 tracking-wider">📏 MESURES PRÉCISES</span>
                <span className="text-[10px] text-[#787774]">Centimeter chest &amp; length specs</span>
              </div>
            </div>

            {/* Curator Houses Grid */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-[#787774] uppercase">
                <span>LES MAISONS CURATRICES DE L'ARCHIVE:</span>
                <span className="text-[#C59B63]">4 ATELIERS CERTIFIÉS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {thriftVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-5 bg-[#FBF9F5] border border-[#1D1D1B]/8 rounded-sm hover:border-[#C59B63] transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-[#C59B63] block">
                        {vendor.specialty}
                      </span>
                      <h3
                        className="text-xl font-normal text-[#1D1D1B]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {vendor.name}
                      </h3>
                      <p className="text-[11px] text-[#787774] leading-relaxed font-light">{vendor.tagline}</p>
                    </div>

                    <div className="pt-3 border-t border-[#1D1D1B]/8 font-mono text-[9px] space-y-1.5 text-[#787774]">
                      <div className="flex justify-between">
                        <span>ORIGINE:</span>
                        <span className="text-[#1D1D1B] font-medium">{vendor.origin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PIÈCES DISPONIBLES:</span>
                        <span className="text-[#C59B63] font-bold">{vendor.productCount} pièces</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveBrand(vendor.name);
                          setActiveCategory("thrift");
                          setActiveSection("shop");
                        }}
                        className="w-full mt-3 py-2 bg-[#FFFFFF] border border-[#1D1D1B]/10 hover:border-[#1D1D1B] text-[#1D1D1B] text-[9px] font-sans tracking-[0.2em] uppercase transition-colors text-center cursor-pointer"
                      >
                        Consulter {vendor.name} &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live 1-of-1 Pieces */}
            <div className="space-y-4 pt-4 border-t border-[#1D1D1B]/8">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-[#787774] uppercase">
                <span>PIÈCES UNIQUES EN ÉDITION SIMPLE:</span>
                <span>CERTIFIÉ CONCIERGE LOCKER DISPATCH</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {thriftProducts.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openQuickDetail(item)}
                    className="p-3.5 bg-[#FFFFFF] border border-[#1D1D1B]/8 rounded-sm hover:border-[#C59B63] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-[#F8F6F1] mb-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700"
                      />
                      <div className="absolute top-2 left-2 bg-[#C59B63] text-[#FFFFFF] text-[8px] font-mono font-bold px-1.5 py-0.5 tracking-wider">
                        1-OF-1 VAULT
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-[#C59B63] uppercase tracking-[0.2em] block">{item.brand}</span>
                      <h4
                        className="text-sm font-normal text-[#1D1D1B] truncate"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {item.title}
                      </h4>
                      <p className="text-[10px] font-mono text-[#787774]">{item.measurements}</p>
                      
                      <div className="flex justify-between items-baseline pt-2 border-t border-[#1D1D1B]/6 text-xs font-mono">
                        <span className="font-bold text-[#1D1D1B]">R {item.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item, item.sizes[0]);
                          }}
                          className="px-2.5 py-1 bg-[#1D1D1B] hover:bg-[#C59B63] text-white text-[9px] font-sans tracking-widest uppercase transition-colors cursor-pointer"
                        >
                          Acquérir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. SHOP CATALOG: Delvaux Quiet Luxury Product Grid */}
        {activeSection === "shop" && (
          <section id="catalog" className="space-y-8 mb-24">
            {/* Minimalist Delvaux Department Filters */}
            <div className="space-y-6 border-b border-[#1D1D1B]/8 pb-6">
              {/* Category Pills */}
              <div className="flex items-center justify-center flex-wrap gap-3 text-[11px] font-sans tracking-[0.2em] uppercase">
                {[
                  { label: "Toutes Les Créations", val: "all" },
                  { label: "L'Archive Dunusa (1-of-1)", val: "thrift" },
                  { label: "Souliers Gusheshe", val: "kicks" },
                  { label: "Manteaux & Outerwear", val: "outerwear" },
                  { label: "Denim & Workwear", val: "workwear" },
                  { label: "Accessoires & Maroquinerie", val: "accessories" },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    onClick={() => setActiveCategory(tab.val as Category)}
                    className={`px-4 py-2 transition-all cursor-pointer border rounded-xs ${
                      activeCategory === tab.val
                        ? "bg-[#1D1D1B] text-[#FBF9F5] border-[#1D1D1B]"
                        : "bg-[#FFFFFF] text-[#787774] border-[#1D1D1B]/10 hover:text-[#1D1D1B] hover:border-[#1D1D1B]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Secondary Refinement Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest pt-2">
                {/* Gender Fit Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-[#787774]">COUPE:</span>
                  <div className="flex border border-[#1D1D1B]/10 rounded-xs bg-[#FFFFFF] overflow-hidden">
                    {(["ALL", "MEN", "WOMEN", "UNISEX"] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => setActiveGender(g)}
                        className={`px-2.5 py-1.5 transition-colors cursor-pointer ${
                          activeGender === g ? "bg-[#1D1D1B] text-[#FFFFFF]" : "text-[#787774] hover:text-[#1D1D1B]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[#787774]">ATELIER:</span>
                    <select
                      value={activeBrand}
                      onChange={(e) => setActiveBrand(e.target.value)}
                      className="bg-[#FFFFFF] border border-[#1D1D1B]/10 text-[#1D1D1B] text-[10px] font-mono uppercase px-3 py-1.5 rounded-xs focus:outline-none focus:border-[#1D1D1B] cursor-pointer"
                    >
                      <option value="all">Tous les Ateliers ({vendors.length})</option>
                      <optgroup label="L'Archive Dunusa">
                        {thriftVendors.map((v) => (
                          <option key={v.id} value={v.name}>
                            ★ {v.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Maisons de Prêt-à-Porter">
                        {vendors
                          .filter((v) => !v.isThrift)
                          .map((v) => (
                            <option key={v.id} value={v.name}>
                              {v.name}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#787774]">TRI:</span>
                    <select
                      value={activeSort}
                      onChange={(e) => setActiveSort(e.target.value as any)}
                      className="bg-[#FFFFFF] border border-[#1D1D1B]/10 text-[#1D1D1B] text-[10px] font-mono uppercase px-3 py-1.5 rounded-xs focus:outline-none focus:border-[#1D1D1B] cursor-pointer"
                    >
                      <option value="curated">Sélection Maison</option>
                      <option value="price-asc">Prix: Croissant</option>
                      <option value="price-desc">Prix: Décroissant</option>
                      <option value="popular">Pièces d'Archive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filter Badges */}
              {isFilterActive && (
                <div className="flex flex-wrap items-center gap-2 pt-2 text-[9px] font-mono uppercase">
                  <span className="text-[#787774]">Filtres Actifs:</span>
                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-[#FFFFFF] border border-[#1D1D1B]/10 px-2 py-0.5 rounded-xs">
                      Catégorie: <strong>{activeCategory}</strong>
                      <button onClick={() => setActiveCategory("all")} className="hover:text-[#C59B63] ml-1">×</button>
                    </span>
                  )}
                  {activeGender !== "ALL" && (
                    <span className="inline-flex items-center gap-1 bg-[#FFFFFF] border border-[#1D1D1B]/10 px-2 py-0.5 rounded-xs">
                      Coupe: <strong>{activeGender}</strong>
                      <button onClick={() => setActiveGender("ALL")} className="hover:text-[#C59B63] ml-1">×</button>
                    </span>
                  )}
                  {activeBrand !== "all" && (
                    <span className="inline-flex items-center gap-1 bg-[#FFFFFF] border border-[#1D1D1B]/10 px-2 py-0.5 rounded-xs">
                      Maison: <strong>{activeBrand}</strong>
                      <button onClick={() => setActiveBrand("all")} className="hover:text-[#C59B63] ml-1">×</button>
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-[#C59B63] hover:underline font-bold ml-2 cursor-pointer"
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </div>

            {/* Product Grid with Generous White Space */}
            {filteredProducts.length === 0 ? (
              <div className="col-span-full py-24 text-center space-y-3 font-serif">
                <span className="text-4xl block text-[#787774] italic">∅</span>
                <p className="text-xl text-[#1D1D1B]">Aucune création ne correspond aux critères sélectionnés.</p>
                <p className="text-xs font-mono text-[#787774]">Réinitialisez les filtres pour découvrir l'intégralité du vestiaire.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-5 py-2.5 bg-[#1D1D1B] text-[#FFFFFF] text-[10px] font-sans tracking-[0.2em] uppercase rounded-xs cursor-pointer"
                >
                  Réinitialiser
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => {
                  const isSaved = wishlist.includes(product.id);
                  return (
                    <article key={product.id} className="group flex flex-col justify-between cursor-pointer">
                      {/* Product Presentation in Delvaux Studio Container */}
                      <div
                        className="product-image-container aspect-[3/4] overflow-hidden rounded-xs border border-[#1D1D1B]/6 p-4 bg-[#FFFFFF] mb-4 relative"
                        onClick={() => openQuickDetail(product)}
                      >
                        <div className="relative w-full h-full overflow-hidden bg-[#FBF9F5]">
                          <img
                            src={product.image}
                            alt={product.title}
                            loading="lazy"
                            className="main-img w-full h-full object-cover object-center absolute inset-0"
                          />
                          <img
                            src={product.secondaryImage}
                            alt={`${product.title} back angle`}
                            loading="lazy"
                            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          />
                        </div>

                        {/* Rarity or Origin Tag */}
                        <div className="absolute top-6 left-6 text-[8px] font-mono tracking-[0.2em] uppercase text-[#787774] z-10 bg-[#FFFFFF]/90 px-2 py-0.5 border border-[#1D1D1B]/5">
                          {product.badge}
                        </div>

                        {/* Wishlist Heart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className={`absolute top-6 right-6 p-2 bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] rounded-full transition-all z-10 cursor-pointer ${
                            isSaved ? "text-[#C59B63]" : "text-[#787774] hover:text-[#1D1D1B]"
                          }`}
                          title="Preserve piece"
                        >
                          <svg
                            className={`w-3.5 h-3.5 ${isSaved ? "fill-current text-[#C59B63]" : "stroke-current fill-none"}`}
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            ></path>
                          </svg>
                        </button>

                        {/* Subtle Size Selector on Hover */}
                        <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-[#FFFFFF]/95 backdrop-blur-xs p-2 border border-[#1D1D1B]/10">
                          <div className="text-[8px] font-mono text-[#787774] uppercase tracking-widest mb-1.5 flex justify-between items-center px-1">
                            <span>{product.isThrift ? "Édition Unique:" : "Sélectionner la Taille:"}</span>
                            <span className="text-[#C59B63] font-bold">{product.isThrift ? "1-of-1 Vault" : "En Stock"}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(product, s);
                                }}
                                className="flex-1 py-1 px-1 text-center text-[9px] font-mono uppercase border border-[#1D1D1B]/10 hover:border-[#1D1D1B] hover:bg-[#1D1D1B] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Product Details with Delvaux Architectural Centering */}
                      <div className="space-y-1 text-center px-2">
                        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#C59B63] block">
                          {product.brand}
                        </span>

                        <h3
                          onClick={() => openQuickDetail(product)}
                          className="text-lg font-normal text-[#1D1D1B] hover:text-[#C59B63] transition-colors leading-snug cursor-pointer"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          {product.title}
                        </h3>

                        {product.measurements && (
                          <p className="text-[9px] font-mono text-[#787774] tracking-wider">
                            {product.measurements}
                          </p>
                        )}

                        <div className="flex items-center justify-center gap-3 pt-1 font-mono text-xs">
                          <span className="font-semibold text-[#1D1D1B]">R {product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-[#787774] line-through">
                              R {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] font-mono text-[#787774]">
                          Payflex 4x R {Math.round(product.price / 4)} / mois
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* "L'Ensemble Commuter" Capsule in Delvaux Luxury Framing */}
            <div className="mt-28 p-8 sm:p-12 bg-[#FFFFFF] border border-[#1D1D1B]/8 rounded-sm">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#1D1D1B]/8">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C59B63] block">
                    CAPSULE ÉDITORIALE PRIVÉE
                  </span>
                  <h2
                    className="text-3xl sm:text-4xl font-light text-[#1D1D1B]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    L'Ensemble Commuter Braamfontein
                  </h2>
                  <p className="text-xs text-[#787774] font-light max-w-xl">
                    A harmonic three-piece winter silhouette: Highveld 480 GSM Fleece + Pleated Pantsula Chinos + Vulcanized Gusheshe 325iS Low Trainers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="font-mono text-right">
                    <span className="text-[10px] text-[#787774] block line-through">Valeur: R 3,520</span>
                    <span className="text-xl font-bold text-[#1D1D1B]">Privilège: R 3,270</span>
                  </div>
                  <button
                    onClick={addCapsuleBundleToCart}
                    className="py-3 px-6 bg-[#1D1D1B] hover:bg-[#C59B63] text-[#FFFFFF] text-[10px] font-sans tracking-[0.2em] uppercase rounded-xs transition-colors cursor-pointer"
                  >
                    Acquérir L'Ensemble (Save R250) &rarr;
                  </button>
                </div>
              </div>

              {/* 3 Capsule Items */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 text-xs font-mono">
                <div
                  onClick={() => openQuickDetail(catalogData[0])}
                  className="flex gap-4 items-center p-4 bg-[#FBF9F5] rounded-xs border border-[#1D1D1B]/5 hover:border-[#1D1D1B] cursor-pointer transition-colors"
                >
                  <img src={catalogData[0].image} alt="" className="w-16 h-20 object-cover bg-white" />
                  <div>
                    <span className="text-[8px] text-[#C59B63] font-bold uppercase tracking-wider block">PIÈCE I</span>
                    <h4 className="font-serif text-sm text-[#1D1D1B] mt-0.5">{catalogData[0].title}</h4>
                    <p className="text-[10px] text-[#787774] mt-1">R 890 &middot; Taille L</p>
                  </div>
                </div>

                <div
                  onClick={() => openQuickDetail(catalogData[4])}
                  className="flex gap-4 items-center p-4 bg-[#FBF9F5] rounded-xs border border-[#1D1D1B]/5 hover:border-[#1D1D1B] cursor-pointer transition-colors"
                >
                  <img src={catalogData[4].image} alt="" className="w-16 h-20 object-cover bg-white" />
                  <div>
                    <span className="text-[8px] text-[#C59B63] font-bold uppercase tracking-wider block">PIÈCE II</span>
                    <h4 className="font-serif text-sm text-[#1D1D1B] mt-0.5">{catalogData[4].title}</h4>
                    <p className="text-[10px] text-[#787774] mt-1">R 780 &middot; Taille 32</p>
                  </div>
                </div>

                <div
                  onClick={() => openQuickDetail(catalogData[1])}
                  className="flex gap-4 items-center p-4 bg-[#FBF9F5] rounded-xs border border-[#1D1D1B]/5 hover:border-[#1D1D1B] cursor-pointer transition-colors"
                >
                  <img src={catalogData[1].image} alt="" className="w-16 h-20 object-cover bg-white" />
                  <div>
                    <span className="text-[8px] text-[#C59B63] font-bold uppercase tracking-wider block">PIÈCE III</span>
                    <h4 className="font-serif text-sm text-[#1D1D1B] mt-0.5">{catalogData[1].title}</h4>
                    <p className="text-[10px] text-[#787774] mt-1">R 1,850 &middot; Taille UK 8</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. ATELIERS & VENDORS NETWORK SECTION */}
        {activeSection === "vendors" && (
          <section className="space-y-12 mb-24">
            <div className="border-b border-[#1D1D1B]/8 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C59B63] block">
                  ANNUAIRE DES MAISONS &amp; CURATEURS
                </span>
                <h2
                  className="text-4xl sm:text-5xl font-light text-[#1D1D1B]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Les Ateliers de la Maison.
                </h2>
                <p className="text-[#787774] text-sm max-w-xl font-light leading-relaxed">
                  Discover verified South African sartorial houses and specialized Dunusa vintage curators.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex border border-[#1D1D1B]/10 rounded-xs bg-[#FFFFFF] overflow-hidden text-[10px] font-mono uppercase">
                <button
                  onClick={() => setVendorTypeFilter("all")}
                  className={`px-4 py-2 transition-colors cursor-pointer ${
                    vendorTypeFilter === "all" ? "bg-[#1D1D1B] text-white" : "text-[#787774] hover:text-[#1D1D1B]"
                  }`}
                >
                  Tous ({vendors.length})
                </button>
                <button
                  onClick={() => setVendorTypeFilter("ateliers")}
                  className={`px-4 py-2 transition-colors cursor-pointer ${
                    vendorTypeFilter === "ateliers" ? "bg-[#1D1D1B] text-white" : "text-[#787774] hover:text-[#1D1D1B]"
                  }`}
                >
                  Maisons Prêt-à-Porter (8)
                </button>
                <button
                  onClick={() => setVendorTypeFilter("thrift")}
                  className={`px-4 py-2 transition-colors cursor-pointer ${
                    vendorTypeFilter === "thrift" ? "bg-[#C59B63] text-white font-bold" : "text-[#C59B63] hover:bg-[#C59B63]/10"
                  }`}
                >
                  ★ L'Archive Dunusa (4)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendors
                .filter((v) => {
                  if (vendorTypeFilter === "ateliers") return !v.isThrift;
                  if (vendorTypeFilter === "thrift") return v.isThrift;
                  return true;
                })
                .map((v) => (
                  <div
                    key={v.id}
                    className="p-8 bg-[#FFFFFF] border border-[#1D1D1B]/8 rounded-xs hover:border-[#1D1D1B] transition-all flex flex-col justify-between space-y-6 shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#787774]">
                          {v.origin}
                        </span>
                        {v.isThrift ? (
                          <span className="text-[8px] font-mono uppercase px-2 py-0.5 bg-[#C59B63]/15 text-[#C59B63] font-bold rounded-xs">
                            DUNUSA ARCHIVE
                          </span>
                        ) : v.featured ? (
                          <span className="text-[8px] font-mono uppercase px-2 py-0.5 bg-[#1D1D1B] text-white font-medium rounded-xs">
                            SÉLECTION
                          </span>
                        ) : null}
                      </div>

                      <h3
                        className="text-2xl font-normal text-[#1D1D1B]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {v.name}
                      </h3>
                      <p className="text-xs text-[#787774] leading-relaxed font-light">{v.tagline}</p>
                    </div>

                    <div className="pt-4 border-t border-[#1D1D1B]/6 space-y-2 font-mono text-[10px] text-[#787774]">
                      <div className="flex justify-between">
                        <span>COORDINATES:</span>
                        <span className="text-[#1D1D1B] font-medium">{v.coordinates}</span>
                      </div>
                      {v.specialty && (
                        <div className="flex justify-between">
                          <span>SPÉCIALITÉ:</span>
                          <span className="text-[#C59B63] font-bold">{v.specialty}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>PRIX:</span>
                        <span>{v.priceRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PIÈCES RÉPERTORIÉES:</span>
                        <span className="text-[#1D1D1B] font-bold">{v.productCount} créations</span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveBrand(v.name);
                          if (v.isThrift) {
                            setActiveCategory("thrift");
                          } else {
                            setActiveCategory("all");
                          }
                          setActiveSection("shop");
                        }}
                        className="w-full mt-4 py-2.5 border border-[#1D1D1B]/15 hover:border-[#1D1D1B] text-[#1D1D1B] text-[10px] font-sans tracking-[0.2em] uppercase transition-colors text-center cursor-pointer"
                      >
                        Consulter {v.name} &rarr;
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* 7. Delvaux Luxury Services & Concierge Pillars */}
        <section className="mt-24 pt-16 border-t border-[#1D1D1B]/8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-[#1D1D1B]">
            {/* Pillar 1 */}
            <div className="space-y-3">
              <div className="font-mono text-[10px] text-[#C59B63] tracking-[0.25em] uppercase font-bold">
                01 / SERVICE CONCIERGE LOCKER
              </div>
              <h2
                className="text-2xl font-normal text-[#1D1D1B]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                1,400+ Salons &amp; Stations Sécurisées
              </h2>
              <p className="text-xs text-[#787774] leading-relaxed font-light">
                Discreet collection at verified Smart Vaults, PEP Paxi counters, and partner spaza salons along your commuter route. Zero missed couriers.
              </p>
              <button
                onClick={() => setIsLockerModalOpen(true)}
                className="text-[10px] font-mono tracking-widest text-[#1D1D1B] hover:text-[#C59B63] underline block pt-1 cursor-pointer"
              >
                CHOISIR VOTRE STATION CONCIERGE &rarr;
              </button>
            </div>

            {/* Pillar 2 */}
            <div className="space-y-3">
              <div className="font-mono text-[10px] text-[#C59B63] tracking-[0.25em] uppercase font-bold">
                02 / PAIEMENTS PRIVILÈGE
              </div>
              <h2
                className="text-2xl font-normal text-[#1D1D1B]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Capitec 1-Tap &amp; Payflex 4x
              </h2>
              <p className="text-xs text-[#787774] leading-relaxed font-light">
                Direct Capitec app authorization, Ozow verified instant EFT, or divide your seasonal wardrobe across 4 interest-free monthly installments.
              </p>
              <span className="inline-block text-[10px] font-mono text-[#787774] border-b border-[#1D1D1B]/10 pb-0.5">
                AUCUNE CARTE DE CRÉDIT REQUISE
              </span>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-3">
              <div className="font-mono text-[10px] text-[#C59B63] tracking-[0.25em] uppercase font-bold">
                03 / SAVOIR-FAIRE &amp; PROVENANCE
              </div>
              <h2
                className="text-2xl font-normal text-[#1D1D1B]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Certificat d'Authenticité Atelier
              </h2>
              <p className="text-xs text-[#787774] leading-relaxed font-light">
                Every silhouette carries authentic workshop coordinates or Small Street archival hunt certification. Restored with dignity and passion.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#C59B63]">
                <span>★</span>
                <span>MAISON LE BENKELENG &middot; SCEAU OFFICIEL</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Delvaux-Inspired Minimalist Footer */}
      <footer className="mt-24 border-t border-[#1D1D1B]/8 bg-[#FFFFFF] text-[#1D1D1B] py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
            <div className="space-y-4 md:col-span-2">
              <span
                className="text-2xl font-normal tracking-wide text-[#1D1D1B]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                MAISON LE BENKELENG
              </span>
              <p className="text-[#787774] max-w-sm leading-relaxed text-xs font-light">
                Fine South African urban craftsmanship, curated multi-brand fashion houses, and the 1-of-1 Dunusa vintage archive.
              </p>
              <div className="flex items-center gap-4 text-[10px] font-mono text-[#787774] uppercase tracking-widest">
                <span>BRUXELLES</span>
                <span>&middot;</span>
                <span>SOWETO</span>
                <span>&middot;</span>
                <span>JOHANNESBURG</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#787774] uppercase block tracking-[0.2em]">
                Services &amp; Conciergerie
              </span>
              <ul className="space-y-2 text-[#1D1D1B] text-[11px] font-light">
                <li>
                  <button onClick={() => setIsLockerModalOpen(true)} className="hover:text-[#C59B63] cursor-pointer">
                    Stations Concierge Spaza
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast("Retours Concierge", "Free 30-day drop-off at any partner counter nationwide.")}
                    className="hover:text-[#C59B63] cursor-pointer"
                  >
                    Retours Gratuits 30 Jours
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => showToast("Suivi Stoko", "Present your SMS PIN at the designated locker counter.")}
                    className="hover:text-[#C59B63] cursor-pointer"
                  >
                    Suivi de Livraison
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#787774] uppercase block tracking-[0.2em]">
                Paiements Sécurisés
              </span>
              <ul className="space-y-2 text-[#787774] text-[11px] font-mono">
                <li>Capitec Pay Partner API</li>
                <li>Payflex (Pay in 4 Zero-Interest)</li>
                <li>Ozow Instant EFT Verified</li>
                <li>3D Secure Encrypted</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1D1D1B]/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono text-[#787774] tracking-wider">
            <div>&copy; 2026 MAISON LE BENKELENG RETAIL GROUP (PTY) LTD. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#1D1D1B]">MENTIONS LÉGALES</a>
              <a href="#" className="hover:text-[#1D1D1B]">CONFIDENTIALITÉ</a>
              <a href="#" className="hover:text-[#1D1D1B]">CHARTE SAVOIR-FAIRE</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 9. Delvaux-Style Slide-Over Bag Drawer (Votre Sélection) */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 flex justify-end"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#FFFFFF] border-l border-[#1D1D1B]/8 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-8 border-b border-[#1D1D1B]/8 flex items-center justify-between bg-[#FBF9F5]">
              <div>
                <span className="font-mono text-[9px] text-[#C59B63] uppercase tracking-[0.25em] block">
                  VOTRE SÉLECTION PRIVÉE
                </span>
                <h2
                  className="text-2xl font-normal text-[#1D1D1B] mt-0.5"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Panier d'Achat
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-[#787774] hover:text-[#1D1D1B] cursor-pointer"
                aria-label="Close bag"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Threshold Progress */}
            <div className="px-8 py-3 bg-[#FFFFFF] border-b border-[#1D1D1B]/6 font-mono text-[10px]">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[#1D1D1B]">
                  {qualifiesFreeLocker ? (
                    <span className="text-[#C59B63] font-bold">★ Livraison Concierge Offerte Active</span>
                  ) : (
                    <span>
                      Ajoutez <strong>R {freeThreshold - cartSubtotal}</strong> pour la livraison offerte
                    </span>
                  )}
                </span>
                <span className="font-bold text-[#1D1D1B]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#F4F0E8] h-1 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 bg-[#C59B63]"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Itemized List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 divide-y divide-[#1D1D1B]/6">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-[#787774]">
                  <span className="font-serif text-3xl italic">∅</span>
                  <p className="font-serif text-lg text-[#1D1D1B]">Votre sélection est vide</p>
                  <p className="text-[10px] font-mono">Explorez nos créations et l'archive Dunusa.</p>
                </div>
              ) : (
                cart.map((line, idx) => (
                  <div key={`${line.product.id}-${line.size}-${idx}`} className="pt-6 first:pt-0 flex gap-4 items-center">
                    <img
                      src={line.product.image}
                      alt={line.product.title}
                      className="w-16 h-20 object-cover bg-[#FBF9F5] border border-[#1D1D1B]/8 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline font-mono text-[10px]">
                        <span className="text-[#C59B63] uppercase tracking-wider">{line.product.brand}</span>
                        <span className="font-bold text-[#1D1D1B]">R {line.product.price * line.quantity}</span>
                      </div>
                      <p
                        className="text-sm font-normal text-[#1D1D1B] truncate mt-0.5"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {line.product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[9px] font-mono">
                        <span className="bg-[#FBF9F5] px-1.5 py-0.5 border border-[#1D1D1B]/8 text-[#1D1D1B]">
                          {line.size}
                        </span>
                        {line.product.isThrift && (
                          <span className="text-[#C59B63] font-bold">1-of-1</span>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-[#1D1D1B]/10 rounded-xs bg-white text-xs font-mono">
                      <button
                        onClick={() => adjustCartQuantity(idx, -1)}
                        className="px-2 py-1 text-[#787774] hover:text-[#1D1D1B] cursor-pointer"
                      >
                        −
                      </button>
                      <span className="px-2 font-bold text-[#1D1D1B]">{line.quantity}</span>
                      <button
                        onClick={() => adjustCartQuantity(idx, 1)}
                        className="px-2 py-1 text-[#787774] hover:text-[#1D1D1B] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeCartItem(idx)}
                      className="text-[#787774] hover:text-[#1D1D1B] p-1 text-xs cursor-pointer"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-8 border-t border-[#1D1D1B]/8 bg-[#FBF9F5] space-y-4">
              {/* Voucher */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="CODE PRIVILÈGE (TRY 'DELVAUX')"
                  className="bg-[#FFFFFF] border border-[#1D1D1B]/15 text-[#1D1D1B] text-[10px] font-mono uppercase tracking-wider px-3 py-2 flex-1 rounded-xs focus:outline-none focus:border-[#1D1D1B]"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="bg-[#1D1D1B] hover:bg-[#C59B63] text-[#FFFFFF] px-4 py-2 text-[10px] font-sans tracking-widest uppercase rounded-xs cursor-pointer transition-colors"
                >
                  Valider
                </button>
              </div>
              {voucherMessage && (
                <div className={`text-[10px] font-mono ${voucherMessage.isError ? "text-red-700" : "text-[#C59B63]"}`}>
                  {voucherMessage.text}
                </div>
              )}

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-[#1D1D1B] font-mono">
                <div className="flex justify-between text-[#787774]">
                  <span>Sous-total</span>
                  <span>R {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#787774]">
                  <span>Livraison Concierge Locker</span>
                  <span className="text-[#C59B63] font-medium">
                    {qualifiesFreeLocker ? "OFFERTE" : "R 55"}
                  </span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-[#C59B63]">
                    <span>Courtoisie Maison (15%)</span>
                    <span>-R {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#1D1D1B] pt-3 border-t border-[#1D1D1B]/8">
                  <span className="font-serif font-normal">Total Estimé</span>
                  <span>R {(totalPayable + (qualifiesFreeLocker ? 0 : 55)).toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout */}
              <button
                onClick={handleTriggerCheckout}
                className="w-full py-4 bg-[#1D1D1B] hover:bg-[#C59B63] text-[#FFFFFF] text-[10px] font-sans tracking-[0.25em] uppercase rounded-xs transition-colors cursor-pointer"
              >
                Paiement Sécurisé &middot; Capitec / Ozow &rarr;
              </button>

              <div className="text-[9px] font-mono text-[#787774] text-center space-y-0.5">
                <div>STATION DÉSIGNÉE: <strong className="text-[#1D1D1B]">{selectedLocker.name}</strong></div>
                <div>PIN ENVOYÉ PAR SMS &middot; RETOURS 30 JOURS GRATUITS</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Delvaux Quick Detail Modal */}
      {quickDetailProduct && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setQuickDetailProduct(null)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#1D1D1B]/10 max-w-3xl w-full rounded-xs shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuickDetailProduct(null)}
              className="absolute top-6 right-6 z-10 p-2 text-[#787774] hover:text-[#1D1D1B] cursor-pointer"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-[#F8F6F1] relative aspect-square sm:aspect-auto p-4 flex items-center justify-center">
                <img
                  src={quickDetailProduct.image}
                  alt={quickDetailProduct.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-6 left-6 text-[8px] font-mono tracking-widest text-[#1D1D1B] bg-[#FFFFFF]/90 px-2 py-0.5 uppercase border border-[#1D1D1B]/5">
                  {quickDetailProduct.badge}
                </div>
              </div>

              <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[9px] font-mono text-[#787774] tracking-widest uppercase">
                    <span className="text-[#C59B63] font-bold">{quickDetailProduct.brand}</span>
                    <span>{quickDetailProduct.origin}</span>
                  </div>

                  {quickDetailProduct.isThrift && (
                    <div className="p-2.5 bg-[#FBF9F5] border border-[#C59B63]/30 rounded-xs text-[10px] font-mono text-[#1D1D1B] flex justify-between items-center">
                      <span className="font-bold text-[#C59B63]">⚡ 1-OF-1 DUNUSA ARCHIVE</span>
                      <span className="text-[#1D1D1B]">{quickDetailProduct.condition}</span>
                    </div>
                  )}

                  <h2
                    className="text-2xl sm:text-3xl font-normal text-[#1D1D1B] leading-snug"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {quickDetailProduct.title}
                  </h2>

                  <div className="flex items-baseline gap-3 pt-1 font-mono">
                    <span className="text-xl font-bold text-[#1D1D1B]">
                      R {quickDetailProduct.price.toLocaleString()}
                    </span>
                    {quickDetailProduct.originalPrice && (
                      <span className="text-xs text-[#787774] line-through">
                        R {quickDetailProduct.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[9px] text-[#787774] ml-auto">
                      Payflex 4x R {Math.round(quickDetailProduct.price / 4)}
                    </span>
                  </div>

                  <p className="text-xs text-[#787774] leading-relaxed font-light pt-1">
                    {quickDetailProduct.description}
                  </p>

                  {/* Size pills */}
                  <div className="pt-2">
                    <span className="font-mono text-[9px] text-[#787774] uppercase tracking-widest block mb-2">
                      {quickDetailProduct.isThrift ? "Taille Disponible:" : "Tailles de l'Atelier:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickDetailProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedModalSize(s)}
                          className={`px-3 py-1.5 text-[10px] font-mono uppercase transition-colors cursor-pointer border rounded-xs ${
                            selectedModalSize === s
                              ? "bg-[#1D1D1B] text-[#FFFFFF] border-[#1D1D1B]"
                              : "bg-[#FFFFFF] text-[#1D1D1B] border-[#1D1D1B]/15 hover:border-[#1D1D1B]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Material Specs */}
                  <div className="p-3.5 bg-[#FBF9F5] border border-[#1D1D1B]/8 rounded-xs space-y-1 font-mono text-[10px] text-[#1D1D1B]">
                    <div className="flex justify-between">
                      <span className="text-[#787774]">MATIÈRE / COMPOSITION:</span>
                      <span className="font-medium">{quickDetailProduct.fabric}</span>
                    </div>
                    {quickDetailProduct.measurements && (
                      <div className="flex justify-between">
                        <span className="text-[#787774]">MESURES DU BUSTE:</span>
                        <span className="text-[#C59B63] font-bold">{quickDetailProduct.measurements}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[#787774]">EXPÉDITION CONCIERGE:</span>
                      <span className="text-[#1D1D1B]">Prêt pour expédition aujourd'hui</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      addToCart(quickDetailProduct, selectedModalSize || quickDetailProduct.sizes[0]);
                      setQuickDetailProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 py-3.5 bg-[#1D1D1B] hover:bg-[#C59B63] text-[#FFFFFF] text-[10px] font-sans tracking-[0.25em] uppercase rounded-xs transition-colors cursor-pointer"
                  >
                    {quickDetailProduct.isThrift ? "Acquérir la Pièce Unique &rarr;" : "Ajouter au Panier"}
                  </button>
                  <button
                    onClick={() => toggleWishlist(quickDetailProduct.id)}
                    className="px-4 border border-[#1D1D1B]/15 hover:border-[#1D1D1B] rounded-xs transition-colors text-[#1D1D1B] cursor-pointer"
                    aria-label="Preserve"
                  >
                    <svg
                      className={`w-4 h-4 ${
                        wishlist.includes(quickDetailProduct.id)
                          ? "fill-current text-[#C59B63]"
                          : "stroke-current fill-none"
                      }`}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 11. Locker Picker Modal */}
      {isLockerModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setIsLockerModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#1D1D1B]/10 max-w-lg w-full rounded-xs p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1D1D1B]/8 pb-4 mb-4">
              <div>
                <span className="font-mono text-[9px] text-[#C59B63] uppercase tracking-[0.25em] block">
                  SERVICE CONCIERGE LOCKER
                </span>
                <h3
                  className="text-2xl font-normal text-[#1D1D1B]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Sélectionnez Votre Station
                </h3>
              </div>
              <button
                onClick={() => setIsLockerModalOpen(false)}
                className="text-[#787774] hover:text-[#1D1D1B] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#787774] mb-6 font-light leading-relaxed">
              Receive your order securely at private smart locker hubs and boutique spaza salons. A confidential SMS PIN is generated upon delivery.
            </p>

            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-1">
              {lockerStations.map((loc) => {
                const isSelected = selectedLocker.id === loc.id;
                return (
                  <label
                    key={loc.id}
                    onClick={() => setSelectedLocker(loc)}
                    className={`block p-4 rounded-xs border ${
                      isSelected ? "border-[#1D1D1B] bg-[#FBF9F5]" : "border-[#1D1D1B]/10 bg-[#FFFFFF] hover:border-[#787774]"
                    } cursor-pointer transition-all`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="lockerRadio"
                          checked={isSelected}
                          onChange={() => setSelectedLocker(loc)}
                          className="text-[#1D1D1B] focus:ring-0 cursor-pointer"
                        />
                        <span className="font-serif text-base text-[#1D1D1B]">{loc.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#C59B63] font-bold">{loc.distance}</span>
                    </div>
                    <p className="text-[11px] text-[#787774] pl-6 mt-1">{loc.address}</p>
                    <div className="pl-6 mt-2 flex flex-wrap items-center gap-2 text-[9px] font-mono">
                      <span className="bg-[#F4F0E8] text-[#1D1D1B] px-2 py-0.5 rounded-xs">
                        {loc.commuterTag}
                      </span>
                      <span className="text-[#787774]">🕒 {loc.hours}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <button
              onClick={() => {
                setIsLockerModalOpen(false);
                showToast("Station Confirmée", `Locker concierge set to: ${selectedLocker.name}`);
              }}
              className="w-full py-3.5 bg-[#1D1D1B] hover:bg-[#C59B63] text-[#FFFFFF] text-[10px] font-sans tracking-[0.25em] uppercase rounded-xs transition-colors cursor-pointer"
            >
              Confirmer Cette Station &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 12. Search Modal */}
      {isSearchModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-start justify-center p-4 sm:pt-28 transition-opacity duration-300"
          onClick={() => setIsSearchModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#1D1D1B]/10 max-w-2xl w-full rounded-xs shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border-b border-[#1D1D1B]/15 pb-4">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher: windbreaker, fleece, dunusa, cuir, dungaree..."
                className="w-full text-lg font-serif text-[#1D1D1B] placeholder-[#787774] focus:outline-none bg-transparent"
              />
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="absolute right-0 top-1 text-[#787774] hover:text-[#1D1D1B] text-xs font-mono cursor-pointer"
              >
                [ESC]
              </button>
            </div>

            <div className="mt-4">
              <span className="text-[9px] font-mono text-[#787774] uppercase tracking-widest block mb-2">
                RECHERCHES FRÉQUENTES:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: "⚡ Dunusa 1-of-1", term: "Dunusa" },
                  { label: "🧥 Manteaux Coupe-Vent", term: "Windbreaker" },
                  { label: "🧥 Cuir Sophiatown", term: "Leather" },
                  { label: "👟 Gusheshe 325i", term: "325i" },
                  { label: "🧥 Fleece 480 GSM", term: "Fleece" },
                ].map((s) => (
                  <button
                    key={s.term}
                    onClick={() => setSearchQuery(s.term)}
                    className="px-3 py-1 bg-[#FBF9F5] hover:bg-[#F4F0E8] border border-[#1D1D1B]/5 rounded-xs font-mono text-[10px] text-[#1D1D1B] cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="mt-6 space-y-2 max-h-60 overflow-y-auto">
              {searchQuery.trim() && searchResults.length === 0 ? (
                <p className="text-xs font-mono text-[#787774] p-2">
                  Aucune création trouvée pour "{searchQuery}".
                </p>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsSearchModalOpen(false);
                      openQuickDetail(item);
                    }}
                    className="p-3 border border-[#1D1D1B]/6 rounded-xs hover:border-[#1D1D1B] flex items-center justify-between cursor-pointer bg-[#FBF9F5] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.title} className="w-10 h-12 object-cover bg-white" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-serif text-[#1D1D1B]">{item.title}</p>
                          {item.isThrift && (
                            <span className="text-[8px] bg-[#C59B63] text-white px-1.5 py-0.2 rounded-xs font-mono">1-of-1</span>
                          )}
                        </div>
                        <p className="text-[9px] font-mono text-[#787774]">
                          {item.brand} &middot; {item.badge}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#1D1D1B]">R {item.price.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 13. Order Success Modal */}
      {isSuccessModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          <div
            className="bg-[#FFFFFF] border border-[#1D1D1B]/10 max-w-md w-full rounded-xs p-8 sm:p-10 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-[#FBF9F5] border border-[#C59B63] text-[#C59B63] rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-xl">
              ✓
            </div>

            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#C59B63] bg-[#C59B63]/10 px-2.5 py-0.5 rounded-xs">
              COMMANDE CONFIRMÉE &middot; MAISON CONCIERGE
            </span>

            <h2
              className="text-3xl font-normal text-[#1D1D1B] mt-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Votre Commande est Scellée.
            </h2>
            <p className="text-xs text-[#787774] mt-2 leading-relaxed font-light">
              Your parcel dispatch slip has been logged with our central atelier. A confidential SMS PIN will be delivered when your order reaches your designated station.
            </p>

            <div className="mt-6 p-4 bg-[#FBF9F5] border border-[#1D1D1B]/8 rounded-xs text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#787774]">RÉFÉRENCE MAISON:</span>
                <span className="font-bold text-[#1D1D1B]">{orderToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787774]">STATION CONCIERGE:</span>
                <span className="font-bold text-[#1D1D1B]">{selectedLocker.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#787774]">EXPÉDITION:</span>
                <span className="text-[#C59B63] font-bold">Kasi-Dash Concierge 🚕</span>
              </div>
            </div>

            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full mt-6 py-3.5 bg-[#1D1D1B] hover:bg-[#C59B63] text-[#FFFFFF] text-[10px] font-sans tracking-[0.25em] uppercase rounded-xs transition-colors cursor-pointer"
            >
              Retour à la Collection
            </button>
          </div>
        </div>
      )}

      {/* 14. Luxury Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-[#FFFFFF] text-[#1D1D1B] border border-[#1D1D1B]/15 px-5 py-3.5 rounded-xs shadow-2xl flex items-center gap-3 transition-all duration-300 max-w-sm ${
            toast.visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#C59B63]"></span>
          <div>
            <div className="text-xs font-serif font-bold text-[#1D1D1B]">{toast.title}</div>
            <div className="text-[10px] text-[#787774] font-mono">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
