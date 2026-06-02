"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function SellerProductsPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/seller/products");
      return;
    }
    api<{ data: Product[] }>("/api/seller/products", { token })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [token, router]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link href="/seller/products/new" className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {products.length === 0 ? (
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
              <Link
                href={`/seller/products/${p.id}/edit`}
                className="btn-secondary gap-1"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
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
