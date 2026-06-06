"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Heart } from "lucide-react";
import type { Product } from "@/types";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { api, ApiError } from "@/lib/api";
import { isDemoProduct } from "@/lib/homeContent";

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
  const [inWishlist, setInWishlist] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const previewOnly = isDemoProduct(product);

  useEffect(() => {
    if (!token || previewOnly) return;
    api<{ data: Array<{ product: { id: string } }> }>("/api/wishlist", { token })
      .then((res) =>
        setInWishlist(res.data.some((i) => i.product.id === product.id))
      )
      .catch(() => {});
  }, [token, product.id, previewOnly]);

  async function handleAddToCart(buyNow = false) {
    if (previewOnly) {
      setMessage("Connect the database to add items to cart.");
      return;
    }
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
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  }

  async function toggleWishlist() {
    if (previewOnly) {
      setMessage("Connect the database to use wishlist.");
      return;
    }
    if (!token) {
      router.push("/login?redirect=" + encodeURIComponent(`/products/${product.slug}`));
      return;
    }
    setWishLoading(true);
    setMessage("");
    try {
      if (inWishlist) {
        await api(`/api/wishlist/${product.id}`, { method: "DELETE", token });
        setInWishlist(false);
        setMessage("Removed from wishlist");
      } else {
        await api("/api/wishlist", {
          method: "POST",
          token,
          body: JSON.stringify({ productId: product.id }),
        });
        setInWishlist(true);
        setMessage("Added to wishlist");
      }
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Wishlist update failed");
    } finally {
      setWishLoading(false);
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

  if (previewOnly) {
    return (
      <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Preview product — cart and checkout are disabled until the API is connected to
        Supabase.
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
        <button
          type="button"
          onClick={toggleWishlist}
          disabled={wishLoading}
          className={`rounded-lg border p-2 transition ${
            inWishlist ? "border-red-300 bg-red-50 text-red-600" : "hover:bg-gray-50"
          }`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
        </button>
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
        <p
          className={`text-sm ${
            message.includes("Failed") || message.includes("Connect")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
