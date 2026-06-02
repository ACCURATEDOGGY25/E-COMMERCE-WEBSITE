"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { api, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { cart, subtotal, fetchCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingCountry: "USA",
    shippingZip: "",
  });

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }
    fetchCart();
  }, [token, fetchCart, router]);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !cart?.items.length) return;

    setLoading(true);
    setError("");

    try {
      const res = await api<{
        data: Order;
        payment: { clientSecret: string | null; mockMode: boolean };
      }>("/api/orders/checkout", {
        method: "POST",
        token,
        body: JSON.stringify(form),
      });

      if (res.payment.mockMode) {
        await api(`/api/orders/${res.data.id}/confirm-payment`, {
          method: "POST",
          token,
        });
      }

      router.push(`/orders/${res.data.id}?success=1`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {!cart?.items.length ? (
        <p className="mt-8 text-gray-500">Your cart is empty.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <div className="card space-y-4 p-6">
            <h2 className="font-semibold">Shipping Address</h2>
            <div>
              <label className="text-sm font-medium">Street address</label>
              <input
                className="input mt-1"
                value={form.shippingStreet}
                onChange={(e) =>
                  setForm({ ...form, shippingStreet: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">City</label>
                <input
                  className="input mt-1"
                  value={form.shippingCity}
                  onChange={(e) =>
                    setForm({ ...form, shippingCity: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">State</label>
                <input
                  className="input mt-1"
                  value={form.shippingState}
                  onChange={(e) =>
                    setForm({ ...form, shippingState: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Country</label>
                <input
                  className="input mt-1"
                  value={form.shippingCountry}
                  onChange={(e) =>
                    setForm({ ...form, shippingCountry: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">ZIP code</label>
                <input
                  className="input mt-1"
                  value={form.shippingZip}
                  onChange={(e) =>
                    setForm({ ...form, shippingZip: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold">Order Total</h2>
            <p className="mt-2 text-2xl font-bold">{formatPrice(total)}</p>
            <p className="mt-1 text-sm text-gray-500">
              {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                ? "You will complete payment with Stripe."
                : "Mock payment mode — order will be confirmed automatically."}
            </p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>
      )}
    </div>
  );
}
