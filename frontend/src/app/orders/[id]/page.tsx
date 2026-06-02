"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const { token } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    api<{ data: Order }>(`/api/orders/${id}`, { token })
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null));
  }, [token, id]);

  if (!order) {
    return <p className="p-16 text-center text-gray-500">Loading...</p>;
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
            Tracking: <strong>{order.trackingNumber}</strong>
          </p>
        )}
      </div>

      <div className="card mt-6 divide-y">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">{formatPrice(item.price)}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>{formatPrice(order.tax)}</dd>
          </div>
          <div className="flex justify-between border-t pt-2 text-lg font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      <Link href="/orders" className="btn-secondary mt-8 inline-flex">
        Back to Orders
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
