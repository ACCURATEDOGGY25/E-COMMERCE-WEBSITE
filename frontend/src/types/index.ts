export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string | null;
  vendor?: {
    id: string;
    storeName: string;
    slug: string;
    status: string;
    logo?: string | null;
  } | null;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  comparePrice?: string | number | null;
  brand?: string | null;
  stock: number;
  rating: number;
  reviewCount: number;
  location?: string | null;
  isFeatured?: boolean;
  images: ProductImage[];
  category?: { id: string; name: string; slug: string };
  vendor?: { id: string; storeName: string; slug: string };
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  children?: Category[];
  _count?: { products: number };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string | number;
  shipping: string | number;
  tax: string | number;
  total: string | number;
  trackingNumber?: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: string | number;
    product?: Product;
  }>;
  payment?: { status: string } | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
