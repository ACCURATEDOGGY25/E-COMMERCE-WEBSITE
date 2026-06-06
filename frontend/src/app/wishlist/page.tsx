"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { useAuthStore } from "@/store/auth";
import { api, ApiError } from "@/lib/api";
import type { Product } from "@/types";

export default function WishlistPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [items, setItems] = useState<Array<{ product: Product }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  function loadWishlist() {
    if (!token) return;
    setLoading(true);
    api<{ data: Array<{ product: Product }> }>("/api/wishlist", { token })
      .then((res) => setItems(res.data))
      .catch((err) => {
        setItems([]);
        setError(err instanceof ApiError ? err.message : "Failed to load wishlist");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/wishlist");
      return;
    }
    loadWishlist();
  }, [token, router]);

  async function remove(productId: string) {
    if (!token) return;
    setRemoving(productId);
    try {
      await api(`/api/wishlist/${productId}`, { method: "DELETE", token });
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to remove item");
    } finally {
      setRemoving(null);
    }
  }

  if (!token) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Wishlist</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <p className="mt-8 text-gray-500">Loading wishlist...</p>
      ) : items.length === 0 ? (
        <div className="card mt-8 p-12 text-center text-gray-500">
          Your wishlist is empty.{" "}
          <Link href="/products" className="text-primary-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.product.id} className="relative">
              <button
                type="button"
                onClick={() => remove(item.product.id)}
                disabled={removing === item.product.id}
                className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1.5 shadow hover:bg-red-50"
                aria-label="Remove from wishlist"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
              <ProductCard product={item.product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
