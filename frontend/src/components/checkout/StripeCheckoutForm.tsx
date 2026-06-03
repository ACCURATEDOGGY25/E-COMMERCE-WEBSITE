"use client";

import { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { api, ApiError } from "@/lib/api";

interface Props {
  orderId: string;
  token: string;
  onSuccess: () => void;
}

export function StripeCheckoutForm({ orderId, token, onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/${orderId}?success=1`,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        return;
      }

      await api(`/api/orders/${orderId}/confirm-payment`, {
        method: "POST",
        token,
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePay} className="card space-y-4 p-6">
      <h2 className="font-semibold">Payment</h2>
      <PaymentElement />
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}
      <button type="submit" disabled={!stripe || loading} className="btn-primary w-full">
        {loading ? "Processing..." : "Pay now"}
      </button>
    </form>
  );
}
