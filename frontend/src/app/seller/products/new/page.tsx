"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useSellerGuard } from "@/hooks/useSellerGuard";
import { api, ApiError } from "@/lib/api";
import { ImageUploadField } from "@/components/seller/ImageUploadField";
import type { Category } from "@/types";

export default function NewProductPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { allowed } = useSellerGuard("/seller/products/new");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    comparePrice: "",
    categoryId: "",
    brand: "",
    stock: "10",
    location: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!token || !allowed) return;
    api<{ data: Category[] }>("/api/categories")
      .then((res) => {
        const flat: Category[] = [];
        res.data.forEach((c) => {
          flat.push(c);
          c.children?.forEach((child) => flat.push(child));
        });
        setCategories(flat);
        if (flat[0]) setForm((f) => ({ ...f, categoryId: flat[0].id }));
      })
      .catch(() => {});
  }, [token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      await api("/api/seller/products", {
        method: "POST",
        token,
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          comparePrice: form.comparePrice
            ? parseFloat(form.comparePrice)
            : undefined,
          categoryId: form.categoryId,
          brand: form.brand || undefined,
          stock: parseInt(form.stock, 10),
          location: form.location || undefined,
          images: form.imageUrl
            ? [{ url: form.imageUrl, alt: form.name }]
            : undefined,
        }),
      });
      router.push("/seller/products");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Add New Product</h1>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <div>
          <label className="text-sm font-medium">Product name</label>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="input mt-1 min-h-[120px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Price ($)</label>
            <input
              type="number"
              step="0.01"
              className="input mt-1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Compare price ($)</label>
            <input
              type="number"
              step="0.01"
              className="input mt-1"
              value={form.comparePrice}
              onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            className="input mt-1"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Brand</label>
            <input
              className="input mt-1"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Stock</label>
            <input
              type="number"
              className="input mt-1"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </div>
        </div>
        <ImageUploadField
          value={form.imageUrl}
          onChange={(imageUrl) => setForm({ ...form, imageUrl })}
        />
        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            className="input mt-1"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. New York, USA"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Creating..." : "Create Product"}
          </button>
          <Link href="/seller/products" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
