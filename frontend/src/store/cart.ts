import { create } from "zustand";
import type { Cart } from "@/types";
import { api } from "@/lib/api";
import { useAuthStore } from "./auth";

interface CartState {
  cart: Cart | null;
  subtotal: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  subtotal: 0,
  isLoading: false,

  fetchCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await api<{ data: Cart; summary: { subtotal: number } }>(
        "/api/cart",
        { token }
      );
      set({ cart: res.data, subtotal: res.summary.subtotal });
    } catch {
      set({ cart: null, subtotal: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("Login required");
    set({ isLoading: true });
    try {
      const res = await api<{ data: Cart }>("/api/cart/items", {
        method: "POST",
        token,
        body: JSON.stringify({ productId, quantity }),
      });
      const subtotal = res.data.items.reduce(
        (sum, i) => sum + Number(i.product.price) * i.quantity,
        0
      );
      set({ cart: res.data, subtotal });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    const res = await api<{ data: Cart }>(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ quantity }),
    });
    const subtotal = res.data.items.reduce(
      (sum, i) => sum + Number(i.product.price) * i.quantity,
      0
    );
    set({ cart: res.data, subtotal });
  },

  removeItem: async (itemId) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    const res = await api<{ data: Cart }>(`/api/cart/items/${itemId}`, {
      method: "DELETE",
      token,
    });
    const subtotal = res.data.items.reduce(
      (sum, i) => sum + Number(i.product.price) * i.quantity,
      0
    );
    set({ cart: res.data, subtotal });
  },

  clearCart: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    await api("/api/cart", { method: "DELETE", token });
    set({ cart: null, subtotal: 0 });
  },
}));
