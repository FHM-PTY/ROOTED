import { useState, useEffect, useMemo } from "react";

export type Gender = "ALL" | "WOMEN" | "MEN" | "UNISEX";
export type Category = "all" | "kicks" | "outerwear" | "workwear" | "accessories" | "thrift" | "pretoria";

export interface Vendor {
  id: number;
  name: string;
  tagline: string;
  origin: string;
  city: "Pretoria" | "Johannesburg" | "Soweto" | "Durban";
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
  city: "Pretoria" | "Johannesburg" | "Soweto" | "Durban";
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
  isPretoria?: boolean;
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
  city: string;
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
    type: "Spaza Collection Counter",
    distance: "0.6 km",
    city: "Soweto",
    commuterTag: "🏪 Local Spaza Concierge • 🚕 Zone 4 Rank",
  },
  {
    id: "loc-2",
    name: "Braamfontein Juta Smart Locker",
    address: "68 Juta Street (Next to The Playground), Braamfontein",
    hours: "24/7 Smart PIN Access",
    type: "Automated Smart Vault",
    distance: "Central JHB",
    city: "Johannesburg",
    commuterTag: "⚡ 24/7 Smart PIN • 🚆 350m Park Station",
  },
  {
    id: "loc-3",
    name: "Hatfield Plaza Smart Vault (012)",
    address: "1122 Burnett St, Hatfield, Pretoria (Near Gautrain)",
    hours: "06:00 – 22:00 Mon-Sun",
    type: "Pargo Campus Vault",
    distance: "Pretoria East",
    city: "Pretoria",
    commuterTag: "🎓 Hatfield Campus • 🚆 200m Gautrain Station",
  },
  {
    id: "loc-4",
    name: "Maponya Mall PEP Paxi Counter",
    address: "Chris Hani Rd, Klipspruit, Soweto (Lower Level Entrance 3)",
    hours: "09:00 – 18:00 Mon-Sun",
    type: "PEP Paxi Hub",
    distance: "1.4 km",
    city: "Soweto",
    commuterTag: "📦 Dedicated Counter • 🚌 Central Bus Terminal",
  },
  {
    id: "loc-5",
    name: "Tembisa Plaza Pargo Hub",
    address: "Shop 14, Andrew Mapheto Dr, Tembisa",
    hours: "08:00 – 18:00 Daily",
    type: "Pargo Collection Salon",
    distance: "East Rand",
    city: "Gauteng East",
    commuterTag: "📍 Pargo Station • 🏬 Main Lower Plaza",
  },
  {
    id: "loc-6",
    name: "Umlazi Mega City Station",
    address: "50 Mangosuthu Hwy, Umlazi V, Durban",
    hours: "08:30 – 17:30 Mon-Sun",
    type: "Smart Locker Vault",
    distance: "KZN South",
    city: "Durban",
    commuterTag: "⚡ Smart Locker • 🚕 Mega City Rank 2",
  },
];

const vendors: Vendor[] = [
  // 1. Pretoria (012) Streetwear Labels
  {
    id: 1,
    name: "Lesupa Atelier",
    tagline: "Pretoria minimalist luxury, 280 GSM heavyweight tees & architectural embroidery",
    origin: "Arcadia / Hatfield, Pretoria",
    city: "Pretoria",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["pretoria", "outerwear", "workwear"],
    priceRange: "R 550 - R 1,400",
    featured: true,
    color: "#C88A35",
    productCount: 42,
    coordinates: "25.7479° S, 28.2293° E",
    isThrift: false,
    specialty: "High-GSM Combed Cotton & Pitori Cut",
  },
  {
    id: 2,
    name: "Mokasi Streetwear",
    tagline: "Pitori kasi silhouettes, oversized double-knit tracksuits & bold vernacular prints",
    origin: "Mamelodi & Soshanguve, Pretoria",
    city: "Pretoria",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["pretoria", "outerwear"],
    priceRange: "R 650 - R 1,650",
    featured: true,
    color: "#C45434",
    productCount: 38,
    coordinates: "25.7069° S, 28.3275° E",
    isThrift: false,
    specialty: "Kasi Drip & Oversized Street Cuts",
  },
  {
    id: 3,
    name: "Galxboy Heritage Drop",
    tagline: "Pretoria's pioneer streetwear legacy — iconic graphic silhouettes & statement headwear",
    origin: "Menlyn / Pretoria, 012",
    city: "Pretoria",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["pretoria", "accessories", "outerwear"],
    priceRange: "R 450 - R 1,950",
    featured: true,
    color: "#0E0E10",
    productCount: 56,
    coordinates: "25.7825° S, 28.2755° E",
    isThrift: false,
    specialty: "Iconic SA Pop Culture & Bold Typography",
  },

  // 2. Soweto & Johannesburg Ateliers
  {
    id: 4,
    name: "Soweto Threads",
    tagline: "Heritage raw selvage denim, chainstitched kasi tailoring & formal pleats",
    origin: "Orlando West, Soweto",
    city: "Soweto",
    gender: ["MEN", "WOMEN", "UNISEX"],
    categories: ["workwear", "outerwear"],
    priceRange: "R 780 - R 1,800",
    featured: true,
    color: "#C88A35",
    productCount: 48,
    coordinates: "26.2415° S, 27.9157° E",
    isThrift: false,
    specialty: "14oz Raw Denim & Chainstitching",
  },
  {
    id: 5,
    name: "Braam District",
    tagline: "480 GSM heavy fleece & commuter technical silhouettes",
    origin: "Braamfontein, Johannesburg",
    city: "Johannesburg",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["outerwear", "accessories"],
    priceRange: "R 520 - R 1,200",
    featured: true,
    color: "#0E0E10",
    productCount: 64,
    coordinates: "26.1929° S, 28.0345° E",
    isThrift: false,
    specialty: "Heavy Cotton & Tactile Cargo Details",
  },
  {
    id: 6,
    name: "Gusheshe Classics",
    tagline: "Vulcanized footwear inspired by South African motorsport & spinning heritage",
    origin: "Pinetown, KwaZulu-Natal",
    city: "Durban",
    gender: ["UNISEX", "MEN"],
    categories: ["kicks"],
    priceRange: "R 1,450 - R 2,200",
    featured: true,
    color: "#C88A35",
    productCount: 32,
    coordinates: "29.8167° S, 30.8500° E",
    isThrift: false,
    specialty: "Vulcanized Waffle Sole & Suede Overlays",
  },

  // 3. Dunusa Vintage & 1-of-1 Curators
  {
    id: 7,
    name: "Dunusa Archive Co.",
    tagline: "Curated 1-of-1 90s sportswear, crinkle nylon windbreakers & motorsport track tops",
    origin: "Small Street CBD, Johannesburg",
    city: "Johannesburg",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["thrift", "outerwear"],
    priceRange: "R 380 - R 890",
    featured: true,
    color: "#C88A35",
    productCount: 26,
    coordinates: "26.2023° S, 28.0471° E",
    isThrift: true,
    specialty: "90s Sportswear & Technical Windbreakers",
    conditionStandard: "Grade A+ Flawless Mint (Steam Cleaned)",
  },
  {
    id: 8,
    name: "Kasi Vintage Vault",
    tagline: "Sophiatown heavy leather flight jackets, vintage knit polos & pleated trousers",
    origin: "Diepkloof Zone 2, Soweto",
    city: "Soweto",
    gender: ["MEN", "UNISEX"],
    categories: ["thrift", "workwear", "outerwear"],
    priceRange: "R 420 - R 1,450",
    featured: true,
    color: "#C45434",
    productCount: 19,
    coordinates: "26.2482° S, 27.9401° E",
    isThrift: true,
    specialty: "Heavy Leathers & 70s Sophiatown Knits",
    conditionStandard: "Grade A Mint (Conditioned Leather)",
  },
  {
    id: 9,
    name: "Bree St. Reworks",
    tagline: "1-of-1 upcycled workwear vests, patched raw denim & commuter canvas gear",
    origin: "Bree Taxi Interchange, Johannesburg",
    city: "Johannesburg",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["thrift", "workwear"],
    priceRange: "R 480 - R 920",
    featured: true,
    color: "#6B6964",
    productCount: 22,
    coordinates: "26.1989° S, 28.0380° E",
    isThrift: true,
    specialty: "Reworked Duck Canvas & Patchwork",
    conditionStandard: "Upcycled Heritage Grade (Triple Reinforced)",
  },
  {
    id: 10,
    name: "South Beach Retro",
    tagline: "Coastal 90s washed corduroy overshirts, graphic tees & vintage surf wear",
    origin: "The Workshop / South Beach, Durban",
    city: "Durban",
    gender: ["UNISEX", "MEN", "WOMEN"],
    categories: ["thrift", "outerwear"],
    priceRange: "R 350 - R 750",
    featured: true,
    color: "#C88A35",
    productCount: 17,
    coordinates: "29.8587° S, 31.0218° E",
    isThrift: true,
    specialty: "Sun-Drenched Corduroys & 90s Graphic Tees",
    conditionStandard: "Grade A+ Vintage Mint (Pre-shrunk & Washed)",
  },
];

const products: Product[] = [
  // Pretoria (012) Labels
  {
    id: 1,
    title: "Lesupa 280 GSM Boxy Heavyweight Tee",
    brand: "Lesupa Atelier",
    category: "pretoria",
    city: "Pretoria",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 620,
    originalPrice: 750,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    badge: "PRETORIA 012",
    origin: "Arcadia, Pretoria",
    fabric: "280 GSM Combed Ring-Spun Cotton",
    sizes: ["S", "M", "L", "XL"],
    description: "Architecturally cut with a high ribbed collar, dropped shoulder seams, and subtle tone-on-tone embroidery. Designed for the modern Pitori aesthete.",
    isNew: true,
    isPretoria: true,
  },
  {
    id: 2,
    title: "Mokasi Pitori Signature Oversized Tracksuit",
    brand: "Mokasi Streetwear",
    category: "pretoria",
    city: "Pretoria",
    gender: ["UNISEX", "MEN"],
    price: 1450,
    originalPrice: 1750,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=900&q=80",
    badge: "PITORI DRIP",
    origin: "Mamelodi, Pretoria",
    fabric: "420 GSM Double-Knit Cotton Interlock",
    sizes: ["M", "L", "XL"],
    description: "Cut with extreme volume through the sleeve and stacked hem trousers. Embroidered with Mokasi's signature township stamp in antique ochre thread.",
    isNew: true,
    isPretoria: true,
  },
  {
    id: 3,
    title: "Galxboy Heritage 2008 Varsity Jacket",
    brand: "Galxboy Heritage Drop",
    category: "pretoria",
    city: "Pretoria",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 1850,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
    badge: "HERITAGE ARCHIVE",
    origin: "Menlyn, Pretoria",
    fabric: "Heavy Melton Wool & Contrast Vegan Leather Sleeves",
    sizes: ["S", "M", "L", "XL"],
    description: "An archival tribute to Pretoria's greatest streetwear pioneer. Heavyweight chenille patch branding with ribbed striped trim.",
    isPretoria: true,
  },

  // Soweto & Johannesburg Ateliers
  {
    id: 4,
    title: "Soweto Raw Selvage Denim Jacket",
    brand: "Soweto Threads",
    category: "workwear",
    city: "Soweto",
    gender: ["MEN", "UNISEX"],
    price: 1280,
    originalPrice: 1450,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
    badge: "SOWETO CUT",
    origin: "Orlando West, Soweto",
    fabric: "14oz Unwashed Red-Line Selvage Denim",
    sizes: ["S", "M", "L", "XL"],
    description: "Handcrafted in Orlando West using Japanese shuttle-loom shuttle selvage. Unwashed, deep indigo with copper hardware that patinas uniquely over time.",
    isNew: true,
  },
  {
    id: 5,
    title: "Braam 480 GSM Thermal Fleece Hoodie",
    brand: "Braam District",
    category: "outerwear",
    city: "Johannesburg",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 890,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=900&q=80",
    badge: "BRAAM EXCLUSIVE",
    origin: "Braamfontein, JHB",
    fabric: "480 GSM Heavy French Terry Cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Cut with a boxy, dropped-shoulder silhouette built for chilly Highveld evenings and early morning metro commutes.",
    isNew: true,
  },
  {
    id: 6,
    title: "Gusheshe Low-Top 325i Vulcanized Sneakers",
    brand: "Gusheshe Classics",
    category: "kicks",
    city: "Durban",
    gender: ["UNISEX", "MEN"],
    price: 1650,
    originalPrice: 1950,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
    badge: "SPINNING HERITAGE",
    origin: "Pinetown, KZN",
    fabric: "Full-Grain Cowhide Leather & High-Density Vulcanized Waffle Rubber",
    sizes: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    description: "Inspired by South Africa's motorsport culture. Double-stitched toe cap, custom tire-tread outsole, and memory-foam insole.",
    isSale: true,
  },

  // Dunusa 1-of-1 Vault (South African Curated Vintage)
  {
    id: 7,
    title: "90s Italian Colorblock Retro Windbreaker",
    brand: "Dunusa Archive Co.",
    category: "thrift",
    city: "Johannesburg",
    gender: ["UNISEX"],
    price: 480,
    originalPrice: 650,
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80",
    badge: "1-OF-1 DUNUSA ARCHIVE",
    origin: "Small Street CBD, JHB",
    fabric: "Crinkle Taslan Nylon & Mesh Lining",
    sizes: ["L (Boxy 90s Fit)"],
    description: "Hand-picked from Small Street CBD wholesale stashes. Vibrant turquoise and cadmium orange blocking with brass YKK pulls. Steam-cleaned & sanitized.",
    isThrift: true,
    condition: "★ Grade A+ Flawless Mint",
    measurements: "Pit-to-Pit: 62cm | Length: 70cm | Raglan Sleeve",
    rarity: "Unique Single Item",
  },
  {
    id: 8,
    title: "Archival Sophiatown Leather Flight Bomber",
    brand: "Kasi Vintage Vault",
    category: "thrift",
    city: "Soweto",
    gender: ["MEN", "UNISEX"],
    price: 1350,
    originalPrice: 1800,
    image: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80",
    badge: "1-OF-1 DUNUSA ARCHIVE",
    origin: "Diepkloof Zone 2, Soweto",
    fabric: "Heavy Aniline Calfskin Leather & Quilted Lining",
    sizes: ["XL (Tailored Swenka Cut)"],
    description: "Authentic Sophiatown jazz-era silhouette. Deep aged espresso patina with original shearling collar and heavy Talon zipper. Triple conditioned.",
    isThrift: true,
    condition: "★ Grade A (Rich Natural Patina)",
    measurements: "Pit-to-Pit: 64cm | Shoulder: 52cm | Length: 68cm",
    rarity: "Unique Single Item",
  },
  {
    id: 9,
    title: "Reworked Duck Canvas Commuter Vest",
    brand: "Bree St. Reworks",
    category: "thrift",
    city: "Johannesburg",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 820,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=900&q=80",
    badge: "1-OF-1 DUNUSA ARCHIVE",
    origin: "Bree Taxi Interchange, JHB",
    fabric: "16oz Repurposed Carhartt Duck Canvas",
    sizes: ["M / L Adjustable"],
    description: "Reconstructed from decommissioned South African transit overalls and workwear jackets. Multi-pocket commuter layout with brass D-rings.",
    isThrift: true,
    condition: "★ Upcycled Grade (Triple Stitched)",
    measurements: "Pit-to-Pit: 58cm | Length: 64cm",
    rarity: "Unique Single Item",
  },
  {
    id: 10,
    title: "1994 Durban Surf Corduroy Overshirt",
    brand: "South Beach Retro",
    category: "thrift",
    city: "Durban",
    gender: ["UNISEX", "MEN", "WOMEN"],
    price: 420,
    originalPrice: 550,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
    badge: "1-OF-1 DUNUSA ARCHIVE",
    origin: "South Beach, Durban",
    fabric: "100% Cotton 8-Wale Vintage Corduroy",
    sizes: ["L (Relaxed Fit)"],
    description: "Sun-drenched honey corduroy from Durban's 90s coastal surf era. Features tortoise-shell buttons and dual flap pockets. Sanitized and steam-ironed.",
    isThrift: true,
    condition: "★ Grade A+ Mint",
    measurements: "Pit-to-Pit: 60cm | Shoulder: 49cm | Length: 74cm",
    rarity: "Unique Single Item",
  },
  {
    id: 11,
    title: "Vintage Highveld Racing Team Track Top",
    brand: "Dunusa Archive Co.",
    category: "thrift",
    city: "Johannesburg",
    gender: ["UNISEX"],
    price: 560,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80",
    badge: "1-OF-1 DUNUSA ARCHIVE",
    origin: "Small Street CBD, JHB",
    fabric: "Brushed Tricot Poly-Cotton Blend",
    sizes: ["M (Slim Vintage Track Cut)"],
    description: "Sourced from a private collector in Turffontein. Embroidered chest insignia with gold piping along the raglan sleeves. Mint original condition.",
    isThrift: true,
    condition: "★ Grade A+ Mint",
    measurements: "Pit-to-Pit: 54cm | Length: 67cm",
    rarity: "Unique Single Item",
  },
  {
    id: 12,
    title: "Soweto Double-Pleated Tailored Chinos",
    brand: "Soweto Threads",
    category: "workwear",
    city: "Soweto",
    gender: ["MEN", "UNISEX"],
    price: 950,
    originalPrice: 1100,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=900&q=80",
    badge: "SWENKA FORMAL",
    origin: "Orlando West, Soweto",
    fabric: "100% Heavy Twill Cotton (320 GSM)",
    sizes: ["30", "32", "34", "36"],
    description: "Engineered with deep double front pleats, high-rise waistband with side tab adjusters, and a clean tapered break.",
  },
  {
    id: 13,
    title: "Lesupa Minimalist Pitori Waxed Tote",
    brand: "Lesupa Atelier",
    category: "accessories",
    city: "Pretoria",
    gender: ["UNISEX"],
    price: 450,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    badge: "PRETORIA 012",
    origin: "Hatfield, Pretoria",
    fabric: "16oz Waxed Canvas & Full Grain Leather Handles",
    sizes: ["One Size (18L)"],
    description: "Clean architectural carryall engineered for laptop commuting between Hatfield, Menlyn, and Jozi. Weather-resistant finish.",
    isPretoria: true,
  },
  {
    id: 14,
    title: "Braam Tactical Crossbody Messenger",
    brand: "Braam District",
    category: "accessories",
    city: "Johannesburg",
    gender: ["UNISEX"],
    price: 520,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=900&q=80",
    badge: "COMMUTER GEAR",
    origin: "Braamfontein, JHB",
    fabric: "1000D Ballistic Cordura Nylon & Fidlock Magnetic Buckle",
    sizes: ["One Size (5L)"],
    description: "Built for hands-free mobility across the Nelson Mandela Bridge and MetroRail carriages. Rapid magnetic release clasp.",
  },
  {
    id: 15,
    title: "Kasi Archive Hand-Tooled Leather Belt",
    brand: "Kasi Vintage Vault",
    category: "accessories",
    city: "Soweto",
    gender: ["MEN", "UNISEX"],
    price: 380,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80",
    badge: "SOLID BRASS",
    origin: "Diepkloof, Soweto",
    fabric: "Vegetable-Tanned Saddle Leather & Solid Brass Hardware",
    sizes: ["32", "34", "36", "38"],
    description: "Hand-burnished edges with custom brass buckle. Built to last a lifetime, softening with every wear.",
  },
  {
    id: 16,
    title: "Gusheshe Suede Track High-Tops",
    brand: "Gusheshe Classics",
    category: "kicks",
    city: "Durban",
    gender: ["UNISEX", "MEN"],
    price: 1890,
    originalPrice: 2200,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80",
    secondaryImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80",
    badge: "LIMITED RUN",
    origin: "Pinetown, KZN",
    fabric: "Perforated Suede, Padded Collar & Gum Rubber Outsole",
    sizes: ["UK 7", "UK 8", "UK 9", "UK 10"],
    description: "High-top ankle support built with reinforced heel counter and authentic motorsport race striping.",
    isSale: true,
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedGender, setSelectedGender] = useState<Gender>("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<LockerStation>(lockerStations[0]);
  const [currency, setCurrency] = useState<"ZAR" | "USD" | "EUR">("ZAR");
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [vendorFilter, setVendorFilter] = useState<"all" | "pretoria" | "streetwear" | "thrift">("all");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [voucherMessage, setVoucherMessage] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [buyerPhone, setBuyerPhone] = useState("+27 ");

  // Drop countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 38,
    seconds: 45,
  });
  const [isDropNotified, setIsDropNotified] = useState(false);
  const [dropWhatsapp, setDropWhatsapp] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const exchangeRates = {
    ZAR: 1,
    USD: 0.054,
    EUR: 0.051,
  };

  const currencySymbols = {
    ZAR: "R ",
    USD: "$ ",
    EUR: "€ ",
  };

  const formatPrice = (zarAmount: number) => {
    const converted = zarAmount * exchangeRates[currency];
    if (currency === "ZAR") {
      return `R ${zarAmount.toLocaleString()}`;
    }
    return `${currencySymbols[currency]}${converted.toFixed(0)}`;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "all"
          ? true
          : selectedCategory === "pretoria"
          ? p.city === "Pretoria"
          : selectedCategory === "thrift"
          ? p.isThrift
          : p.category === selectedCategory;

      const matchGender = selectedGender === "ALL" ? true : p.gender.includes(selectedGender);

      const matchCity = selectedCity === "ALL" ? true : p.city === selectedCity;

      const matchSearch =
        searchQuery === ""
          ? true
          : p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.origin.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchGender && matchCity && matchSearch;
    });
  }, [selectedCategory, selectedGender, selectedCity, searchQuery]);

  const filteredVendors = useMemo(() => {
    if (vendorFilter === "all") return vendors;
    if (vendorFilter === "pretoria") return vendors.filter((v) => v.city === "Pretoria");
    if (vendorFilter === "streetwear") return vendors.filter((v) => !v.isThrift);
    if (vendorFilter === "thrift") return vendors.filter((v) => v.isThrift);
    return vendors;
  }, [vendorFilter]);

  const addToCart = (product: Product, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.size === size);
      if (existing) {
        if (product.isThrift) {
          alert("Notice: This is a 1-of-1 Dunusa Archival item. Only one unit exists in South Africa.");
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: number, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            if (item.product.isThrift && delta > 0) {
              alert("Notice: 1-of-1 Dunusa items are limited to single inventory.");
              return item;
            }
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 650 || cart.length === 0 ? 0 : 75;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const applyVoucher = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "SWENKA10") {
      setAppliedDiscount(10);
      setVoucherMessage("✓ 'SWENKA10' applied: 10% off your entire order");
    } else if (clean === "DUNUSA") {
      setAppliedDiscount(15);
      setVoucherMessage("✓ 'DUNUSA' applied: 15% off Dunusa Archival pieces");
    } else if (clean === "PITORI") {
      setAppliedDiscount(12);
      setVoucherMessage("✓ 'PITORI' applied: 12% off Pretoria labels (Lesupa/Mokasi)");
    } else {
      setVoucherMessage("✕ Invalid code. Try SWENKA10, DUNUSA, or PITORI");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E0E10] font-sans antialiased selection:bg-[#0E0E10] selection:text-[#FAF7F2]">
      {/* 1. TOP ANNOUNCEMENT MARQUEE — PITORI TO JOZI CULTURE */}
      <aside aria-label="Announcement banner" className="bg-[#0E0E10] text-[#FAF7F2] border-b border-[#FAF7F2]/10 py-2.5 overflow-hidden select-none text-[11px] tracking-[0.22em] uppercase font-mono">
        <div className="flex marquee-track whitespace-nowrap gap-12 items-center">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C88A35] inline-block animate-ping"></span>
            PRETORIA (012) TO JOZI STREETWEAR DROP
          </span>
          <span className="text-[#C88A35]">✦</span>
          <span>FREE LOCKER & SPAZA HUB PICKUP NATIONWIDE ON ORDERS OVER R 650</span>
          <span className="text-[#C88A35]">✦</span>
          <span>FEATURING LESUPA ATELIER, MOKASI & SOWETO THREADS</span>
          <span className="text-[#C88A35]">✦</span>
          <span>100% AUTHENTIC 1-OF-1 DUNUSA ARCHIVE</span>
          <span className="text-[#C88A35]">✦</span>
          <span>PAY IN 4 INTEREST-FREE WITH PAYFLEX · CAPITEC 1-TAP QR</span>
          <span className="text-[#C88A35]">✦</span>
          <span>DISPATCH SLA: 48 HOURS VIA BOB GO (THE COURIER GUY & PARGO)</span>
        </div>
      </aside>

      {/* 2. MAIN HEADER — SYMMETRICAL SARTORIAL MASTHEAD */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#0E0E10]/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-[12px] uppercase tracking-[0.18em] font-medium text-[#0E0E10]/80">
            <a
              href="#catalog"
              onClick={() => setSelectedCategory("all")}
              className="hover:text-[#C88A35] transition-colors py-1"
            >
              Catalog
            </a>
            <a
              href="#drop-calendar"
              className="hover:text-[#C88A35] transition-colors py-1 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF5500] pulse-drop"></span>
              Drop Calendar
            </a>
            <a
              href="#dunusa-vault"
              onClick={() => setSelectedCategory("thrift")}
              className="text-[#C88A35] font-semibold hover:text-[#0E0E10] transition-colors py-1"
            >
              Dunusa Vault (1-of-1)
            </a>
            <a
              href="#vendors"
              className="hover:text-[#C88A35] transition-colors py-1"
            >
              Founding Brands
            </a>
            <a
              href="#lockers"
              className="hover:text-[#C88A35] transition-colors py-1"
            >
              Locker Stations
            </a>
          </nav>

          {/* Centered Brand Masthead */}
          <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className="text-2xl md:text-3xl font-serif font-bold tracking-[0.14em] uppercase text-[#0E0E10]">
              LE BENKELENG
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-[#6B6964] font-mono mt-0.5">
              EST. 2026 · PRETORIA · SOWETO · JOZI · DURBAN
            </span>
          </div>

          {/* Right Utility Bar */}
          <div className="flex items-center gap-5">
            {/* Currency Selector */}
            <div className="hidden sm:flex items-center border border-[#0E0E10]/15 rounded-none px-2.5 py-1 text-[11px] font-mono tracking-wider bg-white">
              {(["ZAR", "USD", "EUR"] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-1.5 py-0.5 transition-colors ${
                    currency === curr ? "font-bold text-[#0E0E10] bg-[#FAF7F2]" : "text-[#6B6964] hover:text-[#0E0E10]"
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Vendor Onboarding Link */}
            <button
              onClick={() => setIsVendorModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 border border-[#0E0E10]/20 px-3.5 py-1.5 text-[11px] tracking-[0.18em] uppercase font-mono hover:bg-[#0E0E10] hover:text-[#FAF7F2] transition-colors"
            >
              <span>✦</span> Sell With Us (13%)
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#0E0E10] hover:text-[#C88A35] transition-colors"
              aria-label="Search Catalog"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-[#0E0E10] text-[#FAF7F2] px-4 py-2 text-[12px] uppercase tracking-[0.18em] font-medium hover:bg-[#C88A35] transition-colors"
              aria-label="View Cart"
            >
              <span>Isikhwama</span>
              <span className="bg-[#FAF7F2] text-[#0E0E10] font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>

        {/* Collapsible Search Drawer */}
        {isSearchOpen && (
          <div className="bg-white border-t border-[#0E0E10]/10 px-6 py-4 animate-in slide-in-from-top duration-300">
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              <span className="text-[#6B6964] font-mono text-sm">SEARCH:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pretoria drip, Soweto raw denim, 1-of-1 Dunusa windbreakers, sizes..."
                className="w-full bg-transparent border-b border-[#0E0E10]/30 py-2 text-sm focus:outline-none focus:border-[#C88A35]"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs uppercase font-mono text-[#6B6964] hover:text-[#0E0E10]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION — "UBUCIKO BASE KASI: PRETORIA TO JOZI" */}
      <section className="relative border-b border-[#0E0E10]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-7">
              <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#F2EDE4] border border-[#0E0E10]/10 text-[11px] font-mono uppercase tracking-[0.2em] text-[#C88A35]">
                <span className="w-2 h-2 rounded-full bg-[#C88A35]"></span>
                The Home for Independent Streetwear Labels
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light leading-[1.08] tracking-tight text-[#0E0E10]">
                Ubuciko <span className="italic font-normal text-[#C88A35]">Base Kasi</span>.
                <br />
                Pretoria to Jozi.
              </h1>

              <p className="text-base sm:text-lg text-[#6B6964] font-light leading-relaxed max-w-xl">
                From Arcadia boxy heavyweight tees (Lesupa) and Mamelodi tracksuits (Mokasi) to Orlando West selvage denim and Small Street 1-of-1 Dunusa vintage grails. All local labels on one unified platform with 48h smart locker pickup.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#catalog"
                  className="bg-[#0E0E10] text-[#FAF7F2] px-7 py-3.5 text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-[#C88A35] transition-colors"
                >
                  Shop Kasi Drip
                </a>
                <a
                  href="#dunusa-vault"
                  className="border border-[#0E0E10] text-[#0E0E10] px-7 py-3.5 text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-[#0E0E10] hover:text-[#FAF7F2] transition-colors"
                >
                  Dunusa 1-of-1 Vault
                </a>
              </div>

              {/* Trust Metadata Grid from Business Plan */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#0E0E10]/10 font-mono text-left">
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#0E0E10]">10+</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B6964]">Curated Labels</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#C88A35]">48h</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B6964]">Dispatch SLA</span>
                </div>
                <div>
                  <span className="block text-2xl font-serif font-bold text-[#0E0E10]">1,400+</span>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B6964]">Locker & Spaza Hubs</span>
                </div>
              </div>
            </div>

            {/* Right Editorial Lookbook with Interactive Garment Hotspots */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] bg-white border border-[#0E0E10]/15 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85"
                  alt="Le Benkeleng Mzansi Streetwear Lookbook"
                  className="w-full h-full object-cover"
                />

                {/* Hotspot 1: Lesupa Heavyweight Tee */}
                <div
                  className="absolute top-[32%] left-[48%] cursor-pointer group"
                  onMouseEnter={() => setActiveHotspot(1)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => addToCart(products[0], "L")}
                >
                  <div className="w-7 h-7 rounded-full bg-[#C88A35] text-white flex items-center justify-center text-xs font-mono font-bold kasi-beacon shadow-lg">
                    +
                  </div>
                  {activeHotspot === 1 && (
                    <div className="absolute left-8 top-0 bg-[#0E0E10] text-[#FAF7F2] p-3.5 rounded-none shadow-2xl w-60 z-30 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C88A35] block">Pretoria 012 Cut</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mt-0.5">Lesupa 280 GSM Tee</h4>
                      <p className="text-[11px] text-[#FAF7F2]/70 mt-1 font-mono">R 620 · Dropped Shoulder</p>
                      <button className="mt-2 text-[10px] uppercase tracking-widest text-[#C88A35] font-mono underline block">
                        + Add Size L to Bag
                      </button>
                    </div>
                  )}
                </div>

                {/* Hotspot 2: Soweto Raw Denim */}
                <div
                  className="absolute top-[64%] left-[42%] cursor-pointer group"
                  onMouseEnter={() => setActiveHotspot(2)}
                  onMouseLeave={() => setActiveHotspot(null)}
                  onClick={() => addToCart(products[3], "L")}
                >
                  <div className="w-7 h-7 rounded-full bg-[#C88A35] text-white flex items-center justify-center text-xs font-mono font-bold kasi-beacon shadow-lg">
                    +
                  </div>
                  {activeHotspot === 2 && (
                    <div className="absolute left-8 top-0 bg-[#0E0E10] text-[#FAF7F2] p-3.5 rounded-none shadow-2xl w-64 z-30 animate-in fade-in zoom-in-95 duration-200">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C88A35] block">Soweto Heritage</span>
                      <h4 className="text-xs font-semibold uppercase tracking-wider mt-0.5">14oz Selvage Denim Jacket</h4>
                      <p className="text-[11px] text-[#FAF7F2]/70 mt-1 font-mono">R 1,280 · Chainstitched</p>
                      <button className="mt-2 text-[10px] uppercase tracking-widest text-[#C88A35] font-mono underline block">
                        + Add Size L to Bag
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0E0E10]/90 backdrop-blur-md text-[#FAF7F2] p-3.5 flex items-center justify-between font-mono text-[11px]">
                  <span>LOOK 01 · PITORI STREETWEAR ESSENTIALS</span>
                  <span className="text-[#C88A35]">COORDINATES 25.7479° S, 28.2293° E</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Transit Route Ticker */}
        <div className="bg-[#F2EDE4] border-t border-[#0E0E10]/10 py-3 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-[#6B6964]">
            <span className="font-bold text-[#0E0E10] flex items-center gap-1.5">
              <span>🚕</span> TRANSIT ARTERY:
            </span>
            <span className="hidden md:inline">Hatfield Plaza ⇄ Pretoria CBD ⇄ Bree Taxi Interchange ⇄ Braamfontein Juta ⇄ Orlando West ⇄ Umlazi Mega City</span>
            <span className="text-[#C88A35] font-bold">ALL HUB SHIPMENTS COVERED VIA BOB GO</span>
          </div>
        </div>
      </section>

      {/* 4. HYPE DROP CALENDAR & LIVE COUNTDOWN (FROM BUSINESS PLAN SECTION 07) */}
      <section id="drop-calendar" className="bg-[#0E0E10] text-[#FAF7F2] py-12 border-b border-[#FAF7F2]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Countdown Metadata */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#FF5500]/20 text-[#FF5500] border border-[#FF5500]/40 text-[10px] font-mono uppercase tracking-[0.25em]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] pulse-drop"></span>
                Next Limited Capsule Drop
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-tight">
                Lesupa × Mokasi: <span className="italic text-[#C88A35]">The 012 Autumn Drop</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/70 font-light max-w-lg">
                Exclusive 50-piece numbered capsule engineered in Pretoria. Heavyweight fleece, stacked corduroy pants, and 3M reflective embroidery. Will not be restocked.
              </p>
            </div>

            {/* Live Clock & WhatsApp Opt-In */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center font-mono">
                <div className="bg-white/10 py-2.5">
                  <span className="block text-2xl font-bold text-[#C88A35]">{String(timeLeft.days).padStart(2, "0")}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#FAF7F2]/60">Days</span>
                </div>
                <div className="bg-white/10 py-2.5">
                  <span className="block text-2xl font-bold text-[#C88A35]">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#FAF7F2]/60">Hours</span>
                </div>
                <div className="bg-white/10 py-2.5">
                  <span className="block text-2xl font-bold text-[#C88A35]">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#FAF7F2]/60">Mins</span>
                </div>
                <div className="bg-white/10 py-2.5">
                  <span className="block text-2xl font-bold text-[#C88A35]">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="text-[9px] uppercase tracking-widest text-[#FAF7F2]/60">Secs</span>
                </div>
              </div>

              {/* WhatsApp Notification Form */}
              <div className="space-y-2">
                {isDropNotified ? (
                  <div className="bg-[#25D366]/20 border border-[#25D366]/40 p-2.5 text-center text-[11px] font-mono text-[#25D366]">
                    ✓ VIP Drop Alert Registered on WhatsApp! You will get the direct link 15 mins early.
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={dropWhatsapp}
                      onChange={(e) => setDropWhatsapp(e.target.value)}
                      placeholder="+27 WhatsApp Number"
                      className="bg-white/10 border border-white/20 text-xs px-3 py-2 flex-1 focus:outline-none focus:border-[#C88A35] font-mono"
                    />
                    <button
                      onClick={() => {
                        if (dropWhatsapp.length >= 10) {
                          setIsDropNotified(true);
                        } else {
                          alert("Please enter a valid South African WhatsApp number (e.g. +27 82 123 4567)");
                        }
                      }}
                      className="bg-[#25D366] text-black text-[11px] font-mono uppercase tracking-wider font-bold px-4 py-2 hover:bg-[#20bd5a] transition-colors whitespace-nowrap"
                    >
                      Notify on WhatsApp
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-[#FAF7F2]/50 font-mono block">
                  Zero spam. Strictly one WhatsApp drop alert before public release.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE DUNUSA VAULT — 1-OF-1 CURATED VINTAGE & THRIFT */}
      <section id="dunusa-vault" className="py-16 bg-[#FAF7F2] border-b border-[#0E0E10]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#0E0E10]/10 gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C88A35]/15 border border-[#C88A35]/30 text-[#C88A35] text-[10px] font-mono uppercase tracking-[0.2em] font-semibold">
                <span>⚡</span> ZERO DUPLICATES · SINGLE PIECES
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-[#0E0E10]">
                The Dunusa Vault <span className="italic text-[#C88A35]">(1-of-1 Stash)</span>
              </h2>
              <p className="text-sm text-[#6B6964] font-light max-w-2xl">
                Hand-hunted across Small Street CBD wholesale stashes, Sophiatown private archives, and Durban beachfront arcades. Every piece is triple steam-cleaned, measured to the centimeter, and guaranteed 1-of-1 in South Africa.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCategory("thrift")}
                className="bg-[#0E0E10] text-[#FAF7F2] px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] font-mono hover:bg-[#C88A35] transition-colors"
              >
                Filter All Dunusa ({products.filter((p) => p.isThrift).length})
              </button>
            </div>
          </div>

          {/* Dunusa Curators Showcase Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {vendors.filter((v) => v.isThrift).map((curator) => (
              <div key={curator.id} className="bg-white border border-[#0E0E10]/10 p-5 hover:border-[#C88A35] transition-colors">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C88A35] block">
                  {curator.origin}
                </span>
                <h3 className="font-serif text-lg font-bold mt-1 text-[#0E0E10]">{curator.name}</h3>
                <p className="text-[11px] text-[#6B6964] mt-1.5 line-clamp-2 leading-relaxed">
                  {curator.tagline}
                </p>
                <div className="mt-3 pt-3 border-t border-[#0E0E10]/5 text-[10px] font-mono text-[#6B6964] flex items-center justify-between">
                  <span>{curator.conditionStandard}</span>
                  <span className="font-bold text-[#0E0E10]">{curator.productCount} pcs</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dunusa 1-of-1 Item Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.filter((p) => p.isThrift).map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-[#0E0E10]/10 flex flex-col justify-between hover:shadow-xl transition-all"
              >
                <div className="relative aspect-square overflow-hidden bg-[#F2EDE4]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#0E0E10] text-[#FAF7F2] text-[9px] font-mono uppercase px-2 py-1 tracking-widest font-bold">
                    1-OF-1 GRAIL
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/80 backdrop-blur-sm text-[#FAF7F2] text-[9px] font-mono px-2 py-1">
                    {item.measurements}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#C88A35] block">
                      {item.brand} · {item.origin}
                    </span>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#0E0E10] mt-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#6B6964] font-mono mt-1">
                      {item.condition}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#0E0E10]/5 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-serif font-bold text-[#0E0E10]">{formatPrice(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-[10px] text-[#6B6964] line-through ml-1.5">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(item, item.sizes[0])}
                      className="bg-[#0E0E10] text-[#FAF7F2] px-3 py-1.5 text-[10px] uppercase font-mono tracking-widest hover:bg-[#C88A35] transition-colors"
                    >
                      Cop 1-of-1
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MAIN MULTI-BRAND CATALOG */}
      <section id="catalog" className="py-16 max-w-7xl mx-auto px-6">
        <div className="space-y-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C88A35] block">
                CURATED MULTI-BRAND DISCOVERY
              </span>
              <h2 className="text-3xl font-serif tracking-tight text-[#0E0E10]">
                Streetwear & Apparel Catalog
              </h2>
            </div>

            {/* City / Hub Quick Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
              <span className="text-[#6B6964] uppercase text-[10px]">Filter Origin:</span>
              {["ALL", "Pretoria", "Soweto", "Johannesburg", "Durban"].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3 py-1 uppercase tracking-wider text-[11px] transition-colors ${
                    selectedCity === city
                      ? "bg-[#0E0E10] text-[#FAF7F2] font-semibold"
                      : "bg-white border border-[#0E0E10]/15 text-[#6B6964] hover:text-[#0E0E10]"
                  }`}
                >
                  {city === "Pretoria" ? "Pretoria (012)" : city}
                </button>
              ))}
            </div>
          </div>

          {/* Department Category Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-b border-[#0E0E10]/10 pb-4 text-[11px] uppercase tracking-[0.16em] font-medium">
            {[
              { id: "all", label: "All Drops" },
              { id: "pretoria", label: "⚡ Pretoria Drip (012)" },
              { id: "thrift", label: "Dunusa 1-of-1 Grails" },
              { id: "outerwear", label: "Hoodies & Jackets" },
              { id: "workwear", label: "Denim & Workwear" },
              { id: "kicks", label: "Kicks (Iteki)" },
              { id: "accessories", label: "Accessories" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as Category)}
                className={`px-4 py-2 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#0E0E10] text-[#FAF7F2] font-semibold shadow-sm"
                    : "bg-white border border-[#0E0E10]/10 text-[#6B6964] hover:border-[#0E0E10]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-[#0E0E10]/10 flex flex-col justify-between hover:shadow-2xl transition-all"
            >
              {/* Product Visual Container */}
              <div className="relative aspect-[4/5] product-image-container cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover main-img"
                />
                <img
                  src={product.secondaryImage}
                  alt={`${product.title} Detail`}
                  className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-[#0E0E10] text-[#FAF7F2] text-[9px] font-mono px-2 py-0.5 uppercase tracking-widest font-bold">
                    {product.badge}
                  </span>
                  {product.city === "Pretoria" && (
                    <span className="bg-[#C88A35] text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold">
                      012 PRIDE
                    </span>
                  )}
                  {product.isThrift && (
                    <span className="bg-[#C45434] text-white text-[9px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold">
                      1-OF-1 PIECE
                    </span>
                  )}
                </div>

                {/* Quick Size Overlay on Hover */}
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-[#0E0E10]/10">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#6B6964] block mb-1.5 text-center">
                    Select Size to Bag:
                  </span>
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, sz);
                        }}
                        className="border border-[#0E0E10]/20 px-2 py-1 text-[10px] font-mono uppercase hover:bg-[#0E0E10] hover:text-[#FAF7F2] transition-colors"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6964]">
                    <span className="text-[#C88A35] font-semibold uppercase">{product.brand}</span>
                    <span>{product.origin}</span>
                  </div>
                  <h3
                    className="font-serif text-sm font-semibold tracking-tight text-[#0E0E10] mt-1 group-hover:text-[#C88A35] transition-colors cursor-pointer"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    {product.title}
                  </h3>
                  <p className="text-[11px] text-[#6B6964] line-clamp-1 mt-0.5 font-light">
                    {product.fabric}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#0E0E10]/5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-base font-serif font-bold text-[#0E0E10]">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#6B6964] line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#6B6964]">
                      Or 4x {formatPrice(Math.round(product.price / 4))} Payflex
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PRIVATE CLIENT CAPSULE — "THE COMMUTER UNIFORM" (INGUBO EPHELELE) */}
      <section className="py-16 bg-[#0E0E10] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C88A35] block">
                CURATED CAPSULE BUNDLE
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif font-light leading-tight">
                The Commuter Uniform.
                <br />
                <span className="italic font-normal text-[#C88A35]">Ingubo Ephelele</span>.
              </h2>
              <p className="text-sm sm:text-base text-[#FAF7F2]/70 font-light leading-relaxed">
                Save R 350 when acquiring the full 3-piece uniform: The Soweto Raw Selvage Denim Jacket, Lesupa Pitori Waxed Messenger Tote, and Soweto Double-Pleated Tailored Chinos.
              </p>

              <div className="space-y-3 font-mono text-xs border-y border-white/10 py-4">
                <div className="flex justify-between">
                  <span>1. Soweto Raw Selvage Denim Jacket (14oz)</span>
                  <span className="text-[#C88A35]">R 1,280</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Soweto Double-Pleated Chinos (High-Rise)</span>
                  <span className="text-[#C88A35]">R 950</span>
                </div>
                <div className="flex justify-between">
                  <span>3. Lesupa Minimalist Pitori Waxed Tote (18L)</span>
                  <span className="text-[#C88A35]">R 450</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-white/10 text-sm">
                  <span>Bundle Price (Save R 350):</span>
                  <span className="text-[#25D366]">R 2,330</span>
                </div>
              </div>

              <button
                onClick={() => {
                  addToCart(products[3], "L");
                  addToCart(products[11], "32");
                  addToCart(products[12], "One Size");
                }}
                className="bg-[#C88A35] text-black px-8 py-4 text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors block text-center"
              >
                + Add Full 3-Piece Fit to Bag (Save R 350)
              </button>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
                alt="Denim detail"
                className="w-full aspect-[4/5] object-cover border border-white/10"
              />
              <img
                src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
                alt="Chinos detail"
                className="w-full aspect-[4/5] object-cover border border-white/10 mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOUNDING BRANDS & ATELIERS DIRECTORY */}
      <section id="vendors" className="py-16 max-w-7xl mx-auto px-6 border-b border-[#0E0E10]/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#0E0E10]/10 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C88A35] block">
              SUPPLY-SIDE ROSTER
            </span>
            <h2 className="text-3xl font-serif tracking-tight text-[#0E0E10]">
              Founding Brands & Curators
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            {[
              { id: "all", label: `All (${vendors.length})` },
              { id: "pretoria", label: "Pretoria 012 Labels (3)" },
              { id: "streetwear", label: "New Streetwear (6)" },
              { id: "thrift", label: "Dunusa Curators (4)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setVendorFilter(f.id as any)}
                className={`px-3 py-1.5 transition-colors ${
                  vendorFilter === f.id
                    ? "bg-[#0E0E10] text-[#FAF7F2] font-semibold"
                    : "bg-white border border-[#0E0E10]/10 text-[#6B6964] hover:text-[#0E0E10]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white border border-[#0E0E10]/10 p-6 flex flex-col justify-between space-y-4 hover:border-[#0E0E10] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#C88A35] font-semibold uppercase">{vendor.origin}</span>
                  <span className="text-[#6B6964]">{vendor.coordinates}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-[#0E0E10] mt-2">{vendor.name}</h3>
                <p className="text-xs text-[#6B6964] mt-1.5 leading-relaxed font-light">
                  {vendor.tagline}
                </p>
                {vendor.specialty && (
                  <div className="mt-3 bg-[#FAF7F2] p-2 text-[10px] font-mono text-[#0E0E10] border-l-2 border-[#C88A35]">
                    Specialty: {vendor.specialty}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#0E0E10]/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#6B6964]">Price: {vendor.priceRange}</span>
                <span className="font-semibold text-[#0E0E10]">{vendor.productCount} active styles</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. SMART LOCKER & LOGISTICS AGGREGATOR (BOB GO + SPAZA HUBS) */}
      <section id="lockers" className="py-16 bg-[#F2EDE4] border-b border-[#0E0E10]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C88A35] block font-semibold">
                LOGISTICS & ORDER FULFILMENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-[#0E0E10]">
                1,400+ Smart Lockers & Spaza Hubs.
              </h2>
              <p className="text-sm text-[#6B6964] font-light leading-relaxed">
                Aggregated via **Bob Go** (The Courier Guy, Pargo, PEP Paxi) with decentralized vendor dispatch. Pick up your drops on your daily commute with zero home-delivery stress.
              </p>

              <div className="space-y-2.5 font-mono text-xs pt-2">
                <div className="flex items-center gap-3 bg-white p-3 border border-[#0E0E10]/10">
                  <span className="text-lg">⚡</span>
                  <div>
                    <span className="font-bold block">48-Hour Dispatch SLA</span>
                    <span className="text-[#6B6964] text-[11px]">Vendors must hand over to Bob Go courier within 48h.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 border border-[#0E0E10]/10">
                  <span className="text-lg">📲</span>
                  <div>
                    <span className="font-bold block">WhatsApp Pickup PIN</span>
                    <span className="text-[#6B6964] text-[11px]">Locker one-time PIN and QR code delivered via WhatsApp.</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 border border-[#0E0E10]/10">
                  <span className="text-lg">🏪</span>
                  <div>
                    <span className="font-bold block">Spaza & Taxi Rank Proximity</span>
                    <span className="text-[#6B6964] text-[11px]">Convenient collection stations at major transit interchanges.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Station Selector */}
            <div className="lg:col-span-7 bg-white p-6 border border-[#0E0E10]/15 space-y-4">
              <div className="flex items-center justify-between border-b border-[#0E0E10]/10 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  Select Your Pickup Hub:
                </span>
                <span className="text-[11px] font-mono text-[#C88A35]">
                  Selected: {selectedStation.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {lockerStations.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStation(st)}
                    className={`p-3.5 border cursor-pointer transition-all ${
                      selectedStation.id === st.id
                        ? "border-[#0E0E10] bg-[#FAF7F2] ring-1 ring-[#0E0E10]"
                        : "border-[#0E0E10]/10 hover:border-[#C88A35]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#6B6964]">
                      <span className="font-bold text-[#C88A35]">{st.city}</span>
                      <span>{st.distance}</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#0E0E10] mt-1">{st.name}</h4>
                    <p className="text-[11px] text-[#6B6964] mt-0.5 line-clamp-1">{st.address}</p>
                    <div className="mt-2 text-[10px] font-mono text-[#0E0E10] bg-white p-1.5 border border-[#0E0E10]/5">
                      {st.commuterTag}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#0E0E10]/10 flex items-center justify-between font-mono text-xs text-[#6B6964]">
                <span>✓ Locker selection saved to your cart</span>
                <span className="font-bold text-[#0E0E10]">Free over R 650</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. VENDOR ONBOARDING CALLOUT — "SELL WITH US (13% COMMISSION)" */}
      <section className="py-16 bg-[#0E0E10] text-[#FAF7F2] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#C88A35] block">
            FOR RISING PRETORIA & GAUTENG STREETWEAR LABELS
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif tracking-tight max-w-3xl mx-auto">
            Stop Fighting for Visibility Alone in the DMs.
          </h2>
          <p className="text-sm sm:text-base text-[#FAF7F2]/75 font-light max-w-2xl mx-auto leading-relaxed">
            List your brand alongside Lesupa, Mokasi, and Soweto Threads. A clean 13% commission model, no upfront listing fees, professional photography support, and weekly automated payouts.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-left font-mono text-xs">
            <div className="bg-white/5 p-4 border border-white/10">
              <span className="block text-[#C88A35] font-bold text-base">12–15%</span>
              <span className="text-[11px] text-[#FAF7F2]/70">Pure commission. We only make money when you sell.</span>
            </div>
            <div className="bg-white/5 p-4 border border-white/10">
              <span className="block text-[#C88A35] font-bold text-base">R 0</span>
              <span className="text-[11px] text-[#FAF7F2]/70">Zero flat listing or sign-up fees for founding brands.</span>
            </div>
            <div className="bg-white/5 p-4 border border-white/10">
              <span className="block text-[#C88A35] font-bold text-base">Weekly</span>
              <span className="text-[11px] text-[#FAF7F2]/70">Automated payouts net of commission directly to bank.</span>
            </div>
            <div className="bg-white/5 p-4 border border-white/10">
              <span className="block text-[#C88A35] font-bold text-base">Shared Traffic</span>
              <span className="text-[11px] text-[#FAF7F2]/70">Cheaper per-brand acquisition with culture-first buyers.</span>
            </div>
          </div>

          <button
            onClick={() => setIsVendorModalOpen(true)}
            className="bg-[#C88A35] text-black px-8 py-3.5 text-xs font-mono uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors"
          >
            Apply to Join as a Founding Brand →
          </button>
        </div>
      </section>

      {/* 11. FOOTER — LOCAL SOUTH AFRICAN VERNACULAR & PAYMENT RAILS */}
      <footer className="bg-[#FAF7F2] border-t border-[#0E0E10]/10 py-16 text-[#0E0E10]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#0E0E10]/10">
            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-bold uppercase tracking-wider">Le Benkeleng</h3>
              <p className="text-xs text-[#6B6964] font-light leading-relaxed">
                The home for Pretoria & Gauteng local streetwear labels and 1-of-1 Dunusa vintage archives.
              </p>
              <div className="text-[11px] font-mono text-[#C88A35]">
                Pitori · Soweto · Braam · Durban
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <span className="font-bold text-[#0E0E10] uppercase tracking-wider block">Platform</span>
              <a href="#catalog" className="block text-[#6B6964] hover:text-[#0E0E10]">Streetwear Catalog</a>
              <a href="#dunusa-vault" className="block text-[#6B6964] hover:text-[#0E0E10]">The Dunusa Vault (1-of-1)</a>
              <a href="#drop-calendar" className="block text-[#6B6964] hover:text-[#0E0E10]">Hype Drop Calendar</a>
              <a href="#lockers" className="block text-[#6B6964] hover:text-[#0E0E10]">Locker & Spaza Hubs</a>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <span className="font-bold text-[#0E0E10] uppercase tracking-wider block">Founding Labels</span>
              <span className="block text-[#6B6964]">Lesupa Atelier (Pretoria 012)</span>
              <span className="block text-[#6B6964]">Mokasi Streetwear (Pitori)</span>
              <span className="block text-[#6B6964]">Soweto Threads (Orlando West)</span>
              <span className="block text-[#6B6964]">Braam District (JHB)</span>
              <span className="block text-[#6B6964]">Dunusa Archive Co. (Small St)</span>
            </div>

            <div className="space-y-3">
              <span className="font-bold text-xs font-mono text-[#0E0E10] uppercase tracking-wider block">
                Mzansi Payment Rails
              </span>
              <p className="text-xs text-[#6B6964] font-light">
                Capitec 1-Tap QR, Payflex 4-part 0% interest, Ozow Instant EFT, SnapScan, and Cards.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] font-mono text-[#0E0E10]">
                <span className="bg-white border border-[#0E0E10]/15 px-2 py-1 font-bold">CAPITEC</span>
                <span className="bg-white border border-[#0E0E10]/15 px-2 py-1 font-bold">PAYFLEX</span>
                <span className="bg-white border border-[#0E0E10]/15 px-2 py-1 font-bold">OZOW</span>
                <span className="bg-white border border-[#0E0E10]/15 px-2 py-1 font-bold">SNAPSCAN</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6B6964] gap-4">
            <span>© 2026 LE BENKELENG™ · ALL RIGHTS RESERVED · FICA & POPIA COMPLIANT</span>
            <span>DESIGNED WITH SOUTH AFRICAN SARTORIAL PRIDE</span>
          </div>
        </div>
      </footer>

      {/* 12. SLIDE-OUT CART DRAWER (ISIKHWAMA) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#0E0E10]/15 shadow-2xl flex flex-col justify-between">
              {/* Cart Header */}
              <div className="p-6 border-b border-[#0E0E10]/10 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold uppercase tracking-wider text-[#0E0E10]">
                    Isikhwama (Cart)
                  </h3>
                  <span className="text-[11px] font-mono text-[#6B6964]">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)} Items across South African Labels
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-[#6B6964] hover:text-[#0E0E10]"
                >
                  ✕
                </button>
              </div>

              {/* Cart Items List */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <span className="text-3xl">🛍️</span>
                    <h4 className="font-serif text-lg font-bold text-[#0E0E10]">Your Bag is Empty</h4>
                    <p className="text-xs text-[#6B6964] font-light max-w-xs mx-auto">
                      Explore Pretoria streetwear from Lesupa & Mokasi or unique 1-of-1 Dunusa grails.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-2 bg-[#0E0E10] text-[#FAF7F2] px-6 py-2.5 text-xs uppercase font-mono tracking-wider"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={`${item.product.id}-${item.size}-${idx}`} className="flex gap-4 pb-4 border-b border-[#0E0E10]/5">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-16 h-20 object-cover bg-[#F2EDE4] border border-[#0E0E10]/10 flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0E0E10] line-clamp-1">
                              {item.product.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.size)}
                              className="text-[10px] text-[#6B6964] hover:text-[#C45434] ml-2"
                            >
                              ✕
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-[#C88A35] block">
                            {item.product.brand} · Size {item.size}
                          </span>
                          {item.product.isThrift && (
                            <span className="text-[9px] font-mono text-[#C45434] block font-bold">
                              1-of-1 Single Piece
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-[#0E0E10]/20 font-mono text-xs">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, -1)}
                              className="px-2 py-0.5 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, 1)}
                              className="px-2 py-0.5 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-serif font-bold text-sm text-[#0E0E10]">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-6 bg-[#FAF7F2] border-t border-[#0E0E10]/10 space-y-4">
                  {/* Selected Locker Summary */}
                  <div className="bg-white p-3 border border-[#0E0E10]/10 text-xs font-mono space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B6964] text-[10px] uppercase">Locker Destination:</span>
                      <a href="#lockers" onClick={() => setIsCartOpen(false)} className="text-[#C88A35] text-[10px] underline">
                        Change
                      </a>
                    </div>
                    <span className="font-bold text-[#0E0E10] block">{selectedStation.name}</span>
                    <span className="text-[10px] text-[#6B6964] block">{selectedStation.commuterTag}</span>
                  </div>

                  {/* Voucher Input */}
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Voucher Code (SWENKA10, DUNUSA, PITORI)"
                        className="bg-white border border-[#0E0E10]/20 text-xs px-3 py-1.5 flex-1 font-mono uppercase focus:outline-none focus:border-[#C88A35]"
                      />
                      <button
                        onClick={() => applyVoucher(voucherCode)}
                        className="bg-[#0E0E10] text-[#FAF7F2] text-[10px] uppercase font-mono px-3 py-1.5 hover:bg-[#C88A35] transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {voucherMessage && (
                      <span className={`text-[10px] font-mono block ${voucherMessage.startsWith("✓") ? "text-[#25D366]" : "text-[#C45434]"}`}>
                        {voucherMessage}
                      </span>
                    )}
                  </div>

                  {/* Subtotal / Shipping / Total */}
                  <div className="space-y-1.5 font-mono text-xs pt-2 border-t border-[#0E0E10]/10">
                    <div className="flex justify-between text-[#6B6964]">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-[#25D366]">
                        <span>Discount ({appliedDiscount}%)</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#6B6964]">
                      <span>Locker Dispatch</span>
                      <span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-base font-serif font-bold text-[#0E0E10] pt-1.5 border-t border-[#0E0E10]/10">
                      <span>Total Due</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutModalOpen(true);
                    }}
                    className="w-full bg-[#0E0E10] text-[#FAF7F2] py-3.5 text-xs uppercase font-mono tracking-[0.2em] font-bold hover:bg-[#C88A35] transition-colors"
                  >
                    Bhadala / Proceed to Checkout →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 13. QUICK VIEW / PRODUCT DETAILS MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full border border-[#0E0E10]/15 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black font-mono text-sm"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.title}
                  className="w-full aspect-[4/5] object-cover bg-[#F2EDE4] border border-[#0E0E10]/10"
                />
                <img
                  src={quickViewProduct.secondaryImage}
                  alt="Detail"
                  className="w-full aspect-[4/3] object-cover bg-[#F2EDE4] border border-[#0E0E10]/10"
                />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#C88A35] uppercase">
                    <span>{quickViewProduct.brand}</span>
                    <span>•</span>
                    <span>{quickViewProduct.origin}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0E0E10] mt-1">{quickViewProduct.title}</h3>
                  <div className="text-lg font-serif font-bold text-[#0E0E10] mt-2">
                    {formatPrice(quickViewProduct.price)}
                  </div>
                  <p className="text-xs text-[#6B6964] mt-3 leading-relaxed font-light">
                    {quickViewProduct.description}
                  </p>

                  <div className="mt-4 bg-[#FAF7F2] p-3 border border-[#0E0E10]/10 font-mono text-[11px] space-y-1">
                    <div><span className="font-bold">Fabric:</span> {quickViewProduct.fabric}</div>
                    {quickViewProduct.measurements && (
                      <div><span className="font-bold text-[#C45434]">Pit-to-Pit:</span> {quickViewProduct.measurements}</div>
                    )}
                    {quickViewProduct.condition && (
                      <div><span className="font-bold">Condition:</span> {quickViewProduct.condition}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#0E0E10]/10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B6964] block">
                    Available Sizes:
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          addToCart(quickViewProduct, s);
                          setQuickViewProduct(null);
                        }}
                        className="border border-[#0E0E10] px-3 py-1.5 text-xs font-mono uppercase hover:bg-[#0E0E10] hover:text-[#FAF7F2] transition-colors"
                      >
                        Add {s} to Bag
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Yo! Check out this ${quickViewProduct.title} on Le Benkeleng: ${window.location.origin}`
                      );
                      window.open(`https://wa.me/?text=${text}`, "_blank");
                    }}
                    className="w-full flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] py-2 text-xs font-mono uppercase tracking-wider hover:bg-[#25D366] hover:text-black transition-colors"
                  >
                    <span>💬</span> Share via WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. VENDOR ONBOARDING MODAL ("SELL WITH US") */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full border border-[#0E0E10]/20 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsVendorModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black font-mono text-sm"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C88A35] block">
              SUPPLY-SIDE ONBOARDING
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#0E0E10] mt-1">
              List Your Label on Le Benkeleng
            </h3>
            <p className="text-xs text-[#6B6964] mt-1.5 font-light leading-relaxed">
              We operate on a transparent 13% commission model. No upfront listing fees, free inclusion in our shared marketing drops, and weekly automated payouts.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Sharp! Your brand application has been received. Our curator team will review your lookbook on Instagram/WhatsApp within 24 hours.");
                setIsVendorModalOpen(false);
              }}
              className="mt-6 space-y-3.5 font-mono text-xs"
            >
              <div>
                <label className="block text-[#0E0E10] uppercase text-[10px] font-bold mb-1">
                  Brand / Label Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pretoria Heavy Co."
                  className="w-full border border-[#0E0E10]/20 p-2.5 focus:outline-none focus:border-[#C88A35]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0E0E10] uppercase text-[10px] font-bold mb-1">
                    City / Township *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pretoria (012), Soweto"
                    className="w-full border border-[#0E0E10]/20 p-2.5 focus:outline-none focus:border-[#C88A35]"
                  />
                </div>
                <div>
                  <label className="block text-[#0E0E10] uppercase text-[10px] font-bold mb-1">
                    Instagram Handle / Website *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@yourbrand"
                    className="w-full border border-[#0E0E10]/20 p-2.5 focus:outline-none focus:border-[#C88A35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0E0E10] uppercase text-[10px] font-bold mb-1">
                  Founder WhatsApp Contact *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+27 82 000 0000"
                  className="w-full border border-[#0E0E10]/20 p-2.5 focus:outline-none focus:border-[#C88A35]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0E0E10] text-[#FAF7F2] py-3 text-xs uppercase font-mono tracking-[0.2em] font-bold hover:bg-[#C88A35] transition-colors"
                >
                  Submit Brand for Curation Review →
                </button>
              </div>

              <span className="text-[10px] text-[#6B6964] block text-center">
                Strict quality vetting: We evaluate fabric GSM, stitching, and product photography standards.
              </span>
            </form>
          </div>
        </div>
      )}

      {/* 15. CHECKOUT & MZANSI PAYMENT MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white max-w-lg w-full border border-[#0E0E10]/20 shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black font-mono text-sm"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C88A35] block font-semibold">
              SECURE MZANSI CHECKOUT
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#0E0E10] mt-1">
              Select Payment Method
            </h3>
            <p className="text-xs text-[#6B6964] mt-1 font-light">
              Total Order Value: <span className="font-bold text-[#0E0E10]">{formatPrice(total)}</span> · Dispatched to <span className="text-[#C88A35]">{selectedStation.name}</span>
            </p>

            <div className="mt-5 space-y-3 font-mono text-xs">
              {/* Capitec 1-Tap */}
              <div className="p-3.5 border border-[#0E0E10]/20 hover:border-[#0E0E10] cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-[#0E0E10]"></span>
                  <div>
                    <span className="font-bold block text-sm">Capitec 1-Tap Pay</span>
                    <span className="text-[10px] text-[#6B6964]">Scan QR with Capitec Banking App or enter Cell Number</span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#0E0E10] text-white px-2 py-0.5">INSTANT</span>
              </div>

              {/* Payflex BNPL */}
              <div className="p-3.5 border border-[#0E0E10]/20 hover:border-[#0E0E10] cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></span>
                  <div>
                    <span className="font-bold block text-sm">Payflex (Pay in 4)</span>
                    <span className="text-[10px] text-[#6B6964]">4 equal interest-free installments of {formatPrice(Math.round(total / 4))}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-[#C88A35] text-white px-2 py-0.5">0% INTEREST</span>
              </div>

              {/* Ozow Instant EFT */}
              <div className="p-3.5 border border-[#0E0E10]/20 hover:border-[#0E0E10] cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300"></span>
                  <div>
                    <span className="font-bold block text-sm">Ozow Instant EFT</span>
                    <span className="text-[10px] text-[#6B6964]">FNB, Standard Bank, Nedbank, Absa, Capitec, TymeBank</span>
                  </div>
                </div>
                <span className="text-[10px] text-[#6B6964]">ZERO FEES</span>
              </div>

              {/* WhatsApp Notification Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                    className="accent-[#0E0E10]"
                  />
                  <span className="text-[11px] text-[#0E0E10]">
                    Send dispatch updates and locker collection PIN to WhatsApp
                  </span>
                </label>
                {whatsappUpdates && (
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="mt-2 w-full border border-[#0E0E10]/20 p-2 text-xs font-mono focus:outline-none focus:border-[#C88A35]"
                  />
                )}
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    const pin = Math.floor(100000 + Math.random() * 900000);
                    alert(
                      `Order Confirmed!\n\nWaybill: BOB-GO-${Math.floor(100000 + Math.random() * 900000)}\nDestination: ${selectedStation.name}\nLocker PIN: ${pin}\n\nThank you for supporting independent South African streetwear labels.`
                    );
                    setCart([]);
                    setIsCheckoutModalOpen(false);
                  }}
                  className="w-full bg-[#0E0E10] text-[#FAF7F2] py-3.5 text-xs uppercase font-mono tracking-[0.2em] font-bold hover:bg-[#C88A35] transition-colors"
                >
                  Confirm & Pay {formatPrice(total)} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
