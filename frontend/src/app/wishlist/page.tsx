"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/products/ProductCard";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import type { Product } from "@/types";

export default function WishlistPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [items, setItems] = useState<Array<{ product: Product }>>([]);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/wishlist");
      return;
    }
    api<{ data: Array<{ product: Product }> }>("/api/wishlist", { token })
      .then((res) => setItems(res.data))
      .catch(() => setItems([]));
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Wishlist</h1>

      {items.length === 0 ? (
        <div className="card mt-8 p-12 text-center text-gray-500">
          Your wishlist is empty.{" "}
          <Link href="/products" className="text-primary-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.product.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
