"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import type { Product } from "@/types";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAddToCart(buyNow = false) {
    if (!token) {
      router.push("/login?redirect=" + encodeURIComponent(`/products/${product.slug}`));
      return;
    }
    if (product.stock < 1) return;

    setLoading(true);
    setMessage("");
    try {
      await addItem(product.id, quantity);
      setMessage("Added to cart!");
      if (buyNow) router.push("/checkout");
    } catch {
      setMessage("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }

  if (product.stock < 1) {
    return (
      <div className="mt-8">
        <button disabled className="btn-primary w-full opacity-50">
          Out of Stock
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Quantity</label>
        <div className="flex items-center rounded-lg border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-gray-50"
          >
            −
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-2 hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => handleAddToCart(false)}
          disabled={loading}
          className="btn-secondary flex-1 gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </button>
        <button
          onClick={() => handleAddToCart(true)}
          disabled={loading}
          className="btn-primary flex-1 gap-2"
        >
          <Zap className="h-4 w-4" />
          Buy Now
        </button>
      </div>

      {message && (
        <p className="text-sm text-green-600">{message}</p>
      )}
    </div>
  );
}
