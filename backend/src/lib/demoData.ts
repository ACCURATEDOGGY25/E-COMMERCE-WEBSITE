/** Demo catalog when database is not configured (local preview). */

const IMG = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  "https://images.unsplash.com/photo-1572635196233-14f2503ffd19?w=800",
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800",
  "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800",
];

export const DEMO_CATEGORIES = [
  { id: "c-electronics", name: "Electronics", slug: "electronics", image: IMG[0], _count: { products: 24 } },
  { id: "c-fashion", name: "Fashion", slug: "fashion", image: IMG[3], _count: { products: 52 } },
  { id: "c-gaming", name: "Games & Gaming", slug: "gaming", image: IMG[4], _count: { products: 18 } },
  { id: "c-phones", name: "Phones & Tablets", slug: "phones", _count: { products: 12 } },
  { id: "c-home", name: "Home & Living", slug: "home", _count: { products: 31 } },
  { id: "c-beauty", name: "Beauty & Health", slug: "beauty", _count: { products: 14 } },
  { id: "c-sports", name: "Sports & Outdoors", slug: "sports", _count: { products: 9 } },
  { id: "c-audio", name: "Audio", slug: "audio", _count: { products: 6 } },
];

export const DEMO_PRODUCTS = [
  {
    id: "demo-1",
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.",
    price: 249.99,
    comparePrice: 299.99,
    brand: "SoundMax",
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    isFeatured: true,
    isActive: true,
    location: "New York, USA",
    categoryId: "c-audio",
    category: { id: "c-audio", name: "Audio", slug: "audio" },
    vendorId: "v1",
    vendor: { id: "v1", storeName: "TechHub Electronics", slug: "techhub-electronics" },
    images: [{ id: "i1", url: IMG[0], alt: null, sortOrder: 0 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Smart Watch Pro",
    slug: "smart-watch-pro",
    description: "Advanced fitness tracking, heart rate monitor, GPS, and 7-day battery life.",
    price: 199.99,
    brand: "TechHub",
    stock: 75,
    rating: 4.3,
    reviewCount: 89,
    isFeatured: true,
    isActive: true,
    location: "California, USA",
    categoryId: "c-phones",
    category: { id: "c-phones", name: "Phones", slug: "phones" },
    vendorId: "v1",
    vendor: { id: "v1", storeName: "TechHub Electronics", slug: "techhub-electronics" },
    images: [{ id: "i2", url: IMG[1], alt: null, sortOrder: 0 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    name: "Running Sneakers Elite",
    slug: "running-sneakers-elite",
    description: "Lightweight performance running shoes with responsive cushioning.",
    price: 129.99,
    brand: "RunFast",
    stock: 100,
    rating: 4.4,
    reviewCount: 203,
    isActive: true,
    location: "Oregon, USA",
    categoryId: "c-sports",
    category: { id: "c-sports", name: "Sports", slug: "sports" },
    vendorId: "v2",
    vendor: { id: "v2", storeName: "Style Avenue", slug: "style-avenue" },
    images: [{ id: "i3", url: IMG[2], alt: null, sortOrder: 0 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    name: "Classic Denim Jacket",
    slug: "classic-denim-jacket",
    description: "Timeless denim jacket with modern fit. 100% cotton.",
    price: 79.99,
    comparePrice: 99.99,
    brand: "Style Avenue",
    stock: 60,
    rating: 4.2,
    reviewCount: 45,
    isFeatured: true,
    isActive: true,
    location: "Los Angeles, USA",
    categoryId: "c-fashion",
    category: { id: "c-fashion", name: "Fashion", slug: "fashion" },
    vendorId: "v2",
    vendor: { id: "v2", storeName: "Style Avenue", slug: "style-avenue" },
    images: [{ id: "i4", url: IMG[3], alt: null, sortOrder: 0 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-5",
    name: "Gaming Controller Pro X",
    slug: "gaming-controller-pro-x",
    description: "Wireless controller with haptic feedback and 40-hour battery.",
    price: 69.99,
    comparePrice: 89.99,
    brand: "GameZone",
    stock: 120,
    rating: 4.6,
    reviewCount: 312,
    isActive: true,
    categoryId: "c-gaming",
    category: { id: "c-gaming", name: "Gaming", slug: "gaming" },
    vendorId: "v3",
    vendor: { id: "v3", storeName: "GameZone Store", slug: "gamezone" },
    images: [{ id: "i5", url: IMG[4], alt: null, sortOrder: 0 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-6",
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description: "Waterproof speaker with 360° sound and 12-hour playtime.",
    price: 59.99,
    brand: "SoundMax",
    stock: 200,
    rating: 4.1,
    reviewCount: 178,
    isActive: true,
    categoryId: "c-audio",
    category: { id: "c-audio", name: "Audio", slug: "audio" },
    vendorId: "v1",
    vendor: { id: "v1", storeName: "TechHub Electronics", slug: "techhub-electronics" },
    images: [{ id: "i6", url: IMG[5], alt: null, sortOrder: 0 }],
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_VENDORS = [
  {
    id: "v1",
    storeName: "TechHub Electronics",
    slug: "techhub-electronics",
    description: "Premium electronics and gadgets at great prices.",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    status: "APPROVED",
    _count: { products: 1240 },
  },
  {
    id: "v2",
    storeName: "Style Avenue",
    slug: "style-avenue",
    description: "Trendy fashion for every occasion.",
    logo: null,
    status: "APPROVED",
    _count: { products: 890 },
  },
  {
    id: "v3",
    storeName: "GameZone Store",
    slug: "gamezone",
    description: "Games, consoles, and accessories.",
    logo: null,
    status: "APPROVED",
    _count: { products: 456 },
  },
];

export function filterDemoProducts(query: {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  let list = [...DEMO_PRODUCTS];

  if (query.search) {
    const s = query.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        (p.brand?.toLowerCase().includes(s) ?? false)
    );
  }
  if (query.category) {
    list = list.filter(
      (p) =>
        p.category.slug === query.category ||
        p.categoryId === query.category
    );
  }
  if (query.brand) {
    list = list.filter(
      (p) => p.brand?.toLowerCase() === query.brand!.toLowerCase()
    );
  }
  if (query.featured) list = list.filter((p) => p.isFeatured);
  if (query.minRating) list = list.filter((p) => p.rating >= query.minRating!);
  if (query.minPrice !== undefined)
    list = list.filter((p) => Number(p.price) >= query.minPrice!);
  if (query.maxPrice !== undefined)
    list = list.filter((p) => Number(p.price) <= query.maxPrice!);

  switch (query.sort) {
    case "price_asc":
      list.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price_desc":
      list.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const data = list.slice(start, start + limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export function findDemoProduct(slug: string) {
  return DEMO_PRODUCTS.find(
    (p) => p.slug === slug || p.id === slug
  );
}
