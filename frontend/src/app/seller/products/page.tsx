"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useSellerGuard } from "@/hooks/useSellerGuard";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function SellerProductsPage() {
  const { token, allowed } = useSellerGuard("/seller/products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  function loadProducts() {
    if (!token) return;
    setLoading(true);
    setError("");
    api<{ data: Product[] }>("/api/seller/products", { token })
      .then((res) => setProducts(res.data))
      .catch((err) => {
        setProducts([]);
        setError(err instanceof ApiError ? err.message : "Failed to load products");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (token && allowed) loadProducts();
  }, [token, allowed]);

  async function handleDelete(id: string, name: string) {
    if (!token) return;
    if (!confirm(`Deactivate "${name}"? It will be hidden from the store.`)) return;
    setDeleting(id);
    try {
      await api(`/api/seller/products/${id}`, { method: "DELETE", token });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete product");
    } finally {
      setDeleting(null);
    }
  }

  if (!allowed) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link href="/seller/products/new" className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            No products yet. Create your first product!
          </div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="card flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {p.images[0] && (
                  <Image src={p.images[0].url} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {formatPrice(p.price)} · Stock: {p.stock}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/seller/products/${p.id}/edit`}
                  className="btn-secondary gap-1"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={deleting === p.id}
                  className="btn-secondary gap-1 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/seller" className="mt-6 inline-block text-sm text-primary-600 hover:underline">
        ← Back to dashboard
      </Link>
    </div>
  );
}
