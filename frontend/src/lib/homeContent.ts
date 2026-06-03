import type { Product, Category } from "@/types";

export interface ShopCategory {
  slug: string;
  name: string;
  tagline: string;
  image: string;
  gradient: string;
  icon: string;
  productCount?: number;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: "electronics",
    name: "Electronics",
    tagline: "Laptops, audio & gadgets",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
    gradient: "from-blue-600 to-indigo-700",
    icon: "💻",
    productCount: 2400,
  },
  {
    slug: "fashion",
    name: "Fashion",
    tagline: "Trending styles for everyone",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
    gradient: "from-fuchsia-600 to-pink-600",
    icon: "👗",
    productCount: 5200,
  },
  {
    slug: "gaming",
    name: "Games & Gaming",
    tagline: "Consoles, games & gear",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
    gradient: "from-violet-600 to-purple-800",
    icon: "🎮",
    productCount: 1800,
  },
  {
    slug: "phones",
    name: "Phones & Tablets",
    tagline: "Latest smartphones & accessories",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    gradient: "from-cyan-600 to-blue-700",
    icon: "📱",
    productCount: 960,
  },
  {
    slug: "home",
    name: "Home & Living",
    tagline: "Furniture, décor & kitchen",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    gradient: "from-amber-600 to-orange-700",
    icon: "🏠",
    productCount: 3100,
  },
  {
    slug: "beauty",
    name: "Beauty & Health",
    tagline: "Skincare, makeup & wellness",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    gradient: "from-rose-500 to-red-600",
    icon: "💄",
    productCount: 1450,
  },
  {
    slug: "sports",
    name: "Sports & Outdoors",
    tagline: "Fitness, camping & activewear",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
    gradient: "from-emerald-600 to-green-700",
    icon: "⚽",
    productCount: 890,
  },
  {
    slug: "audio",
    name: "Audio & Headphones",
    tagline: "Premium sound experiences",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    gradient: "from-slate-700 to-gray-900",
    icon: "🎧",
    productCount: 620,
  },
];

export const PROMO_ITEMS = [
  { text: "🔥 Flash Sale — Up to 50% off today", href: "/products?featured=true" },
  { text: "🚚 Free shipping on orders over $50", href: "/products" },
  { text: "✨ New vendors joining daily", href: "/vendors" },
  { text: "💳 Secure checkout with Stripe", href: "/products" },
];

export const TRUST_BADGES = [
  { icon: "🛡️", label: "Buyer Protection" },
  { icon: "🚚", label: "Fast Delivery" },
  { icon: "↩️", label: "Easy Returns" },
  { icon: "⭐", label: "Verified Sellers" },
];

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800",
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    name: "Wireless Noise-Cancelling Headphones",
    slug: "demo-headphones",
    description: "",
    price: 249.99,
    comparePrice: 299.99,
    brand: "SoundMax",
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    isFeatured: true,
    images: [{ id: "1", url: DEMO_IMAGES[0], sortOrder: 0 }],
    category: { id: "c1", name: "Audio", slug: "audio" },
    vendor: { id: "v1", storeName: "TechHub Electronics", slug: "techhub-electronics" },
  },
  {
    id: "demo-2",
    name: "Smart Watch Pro — Fitness Tracker",
    slug: "demo-smartwatch",
    description: "",
    price: 199.99,
    brand: "TechHub",
    stock: 75,
    rating: 4.3,
    reviewCount: 89,
    isFeatured: true,
    images: [{ id: "2", url: DEMO_IMAGES[1], sortOrder: 0 }],
    category: { id: "c2", name: "Electronics", slug: "electronics" },
    vendor: { id: "v1", storeName: "TechHub Electronics", slug: "techhub-electronics" },
  },
  {
    id: "demo-3",
    name: "Running Sneakers Elite Edition",
    slug: "demo-sneakers",
    description: "",
    price: 129.99,
    comparePrice: 159.99,
    brand: "RunFast",
    stock: 100,
    rating: 4.4,
    reviewCount: 203,
    images: [{ id: "3", url: DEMO_IMAGES[2], sortOrder: 0 }],
    category: { id: "c3", name: "Fashion", slug: "fashion" },
    vendor: { id: "v2", storeName: "Style Avenue", slug: "style-avenue" },
  },
  {
    id: "demo-4",
    name: "Classic Denim Jacket",
    slug: "demo-denim",
    description: "",
    price: 79.99,
    brand: "Style Avenue",
    stock: 60,
    rating: 4.2,
    reviewCount: 45,
    isFeatured: true,
    images: [{ id: "4", url: DEMO_IMAGES[3], sortOrder: 0 }],
    category: { id: "c3", name: "Fashion", slug: "fashion" },
    vendor: { id: "v2", storeName: "Style Avenue", slug: "style-avenue" },
  },
  {
    id: "demo-5",
    name: "Gaming Controller Pro X",
    slug: "demo-controller",
    description: "",
    price: 69.99,
    comparePrice: 89.99,
    brand: "GameZone",
    stock: 120,
    rating: 4.6,
    reviewCount: 312,
    images: [{ id: "5", url: DEMO_IMAGES[4], sortOrder: 0 }],
    category: { id: "c4", name: "Gaming", slug: "gaming" },
    vendor: { id: "v3", storeName: "GameZone Store", slug: "gamezone" },
  },
  {
    id: "demo-6",
    name: "Portable Bluetooth Speaker",
    slug: "demo-speaker",
    description: "",
    price: 59.99,
    brand: "SoundMax",
    stock: 200,
    rating: 4.1,
    reviewCount: 178,
    images: [{ id: "6", url: DEMO_IMAGES[5], sortOrder: 0 }],
    category: { id: "c1", name: "Audio", slug: "audio" },
    vendor: { id: "v1", storeName: "TechHub Electronics", slug: "techhub-electronics" },
  },
  {
    id: "demo-7",
    name: "Designer Sunglasses UV400",
    slug: "demo-sunglasses",
    description: "",
    price: 89.99,
    comparePrice: 120,
    brand: "Style Avenue",
    stock: 45,
    rating: 4.0,
    reviewCount: 67,
    images: [{ id: "7", url: DEMO_IMAGES[6], sortOrder: 0 }],
    category: { id: "c3", name: "Fashion", slug: "fashion" },
    vendor: { id: "v2", storeName: "Style Avenue", slug: "style-avenue" },
  },
  {
    id: "demo-8",
    name: "Premium Running Shoes",
    slug: "demo-shoes",
    description: "",
    price: 149.99,
    brand: "RunFast",
    stock: 80,
    rating: 4.7,
    reviewCount: 94,
    images: [{ id: "8", url: DEMO_IMAGES[7], sortOrder: 0 }],
    category: { id: "c5", name: "Sports", slug: "sports" },
    vendor: { id: "v2", storeName: "Style Avenue", slug: "style-avenue" },
  },
];

export const DEMO_VENDORS = [
  {
    id: "v1",
    storeName: "TechHub Electronics",
    slug: "techhub-electronics",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    _count: { products: 1240 },
  },
  {
    id: "v2",
    storeName: "Style Avenue",
    slug: "style-avenue",
    logo: null,
    _count: { products: 890 },
  },
  {
    id: "v3",
    storeName: "GameZone Store",
    slug: "gamezone",
    logo: null,
    _count: { products: 456 },
  },
  {
    id: "v4",
    storeName: "Home Comfort Co.",
    slug: "home-comfort",
    logo: null,
    _count: { products: 320 },
  },
];

export function toCategoryList(apiCategories: Category[]): ShopCategory[] {
  if (apiCategories.length === 0) return SHOP_CATEGORIES;

  return apiCategories.map((cat) => {
    const fallback = SHOP_CATEGORIES.find((s) => s.slug === cat.slug);
    return {
      slug: cat.slug,
      name: cat.name,
      tagline: fallback?.tagline ?? "Browse collection",
      image: cat.image || fallback?.image || SHOP_CATEGORIES[0].image,
      gradient: fallback?.gradient ?? "from-primary-600 to-primary-700",
      icon: fallback?.icon ?? "🛍️",
      productCount: cat._count?.products ?? fallback?.productCount,
    };
  });
}

export function isDemoProduct(product: Product): boolean {
  return product.id.startsWith("demo-");
}
