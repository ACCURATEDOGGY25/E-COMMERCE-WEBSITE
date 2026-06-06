"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");
  const { token } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push(`/login?redirect=/orders/${id}`);
      return;
    }
    if (!id) return;
    setLoading(true);
    setError("");
    api<{ data: Order }>(`/api/orders/${id}`, { token })
      .then((res) => setOrder(res.data))
      .catch((err) => {
        setOrder(null);
        setError(err instanceof ApiError ? err.message : "Order not found");
      })
      .finally(() => setLoading(false));
  }, [token, id, router]);

  if (!token) return null;

  if (loading) {
    return <p className="p-16 text-center text-gray-500">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-600">{error || "Order not found"}</p>
        <Link href="/account" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to account
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700">
          Order placed successfully! Thank you for your purchase.
        </div>
      )}

      <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
      <p className="mt-2 text-gray-500">
        Placed on {new Date(order.createdAt).toLocaleString()}
      </p>

      <div className="card mt-8 p-6">
        <div className="flex justify-between">
          <span className="font-medium">Status</span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
            {order.status}
          </span>
        </div>
        {order.trackingNumber && (
          <p className="mt-4 text-sm">
            Tracking: <span className="font-mono">{order.trackingNumber}</span>
          </p>
        )}
        <p className="mt-4 text-lg font-bold">
          Total: {formatPrice(order.total)}
        </p>
      </div>

      <div className="card mt-6 divide-y">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between px-6 py-4">
            <div>
              <p className="font-medium">{item.name || item.product?.name}</p>
              <p className="text-sm text-gray-500">Qty {item.quantity}</p>
            </div>
            <p className="font-medium">{formatPrice(item.price)}</p>
          </div>
        ))}
      </div>

      <Link href="/account" className="mt-6 inline-block text-primary-600 hover:underline">
        ← Back to account
      </Link>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<p className="p-16 text-center">Loading...</p>}>
      <OrderDetail />
    </Suspense>
  );
}
