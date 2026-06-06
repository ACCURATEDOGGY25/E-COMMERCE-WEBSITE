"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSellerGuard } from "@/hooks/useSellerGuard";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface SellerOrderItem {
  id: string;
  quantity: number;
  price: string | number;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
  };
  product: { name: string; slug: string };
}

const STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED"] as const;

export default function SellerOrdersPage() {
  const { token, allowed } = useSellerGuard("/seller/orders");
  const [items, setItems] = useState<SellerOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !allowed) return;
    setLoading(true);
    setError("");
    api<{ data: SellerOrderItem[] }>("/api/seller/orders", { token })
      .then((res) => setItems(res.data))
      .catch((err) => {
        setItems([]);
        setError(err instanceof ApiError ? err.message : "Failed to load orders");
      })
      .finally(() => setLoading(false));
  }, [token, allowed]);

  async function updateStatus(orderId: string, status: string) {
    if (!token) return;
    setUpdating(orderId);
    try {
      await api(`/api/seller/orders/${orderId}/status`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status }),
      });
      setItems((prev) =>
        prev.map((item) =>
          item.order.id === orderId
            ? { ...item, order: { ...item.order, status } }
            : item
        )
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setUpdating(null);
    }
  }

  if (!allowed) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href="/seller" className="text-sm text-primary-600 hover:underline">
          ← Dashboard
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <p className="mt-8 text-gray-500">Loading orders...</p>
      ) : items.length === 0 ? (
        <div className="card mt-8 p-12 text-center text-gray-500">No orders yet.</div>
      ) : (
        <div className="card mt-8 divide-y">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  Order {item.order.orderNumber} · Qty {item.quantity} ·{" "}
                  {formatPrice(item.price)}
                </p>
                <p className="text-sm text-gray-500">
                  {item.order.user.name} ({item.order.user.email}) ·{" "}
                  {new Date(item.order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <select
                value={item.order.status}
                disabled={updating === item.order.id}
                onChange={(e) => updateStatus(item.order.id, e.target.value)}
                className="input w-full max-w-[180px]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
