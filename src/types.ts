export type Gender = "ALL" | "WOMEN" | "MEN" | "UNISEX";
export type Category = "all" | "kicks" | "outerwear" | "workwear" | "accessories" | "thrift" | "pretoria";

export interface Vendor {
  id: number;
  slug: string;
  name: string;
  letter: string;
  tagline: string;
  origin: string;
  city: "Pretoria" | "Johannesburg" | "Soweto" | "Durban";
  gender: Gender[];
  categories: Category[];
  priceRange: string;
  featured: boolean;
  color: string;
  coverImage: string;
  productCount: number;
  coordinates: string;
  isThrift?: boolean;
  specialty?: string;
  conditionStandard?: string;
  aboutStory: string;
  establishedYear: string;
  dispatchHub: string;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  brandSlug: string;
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
