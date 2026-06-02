import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { api } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role?: "CUSTOMER" | "SELLER";
    storeName?: string;
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  setAuth: (token: string, user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: (token, user) => set({ token, user }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api<{
            token: string;
            user: User;
          }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });
          set({ token: res.token, user: res.user });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api<{
            token: string;
            user: User;
          }>("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
          });
          set({ token: res.token, user: res.user });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => set({ user: null, token: null }),

      fetchUser: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const res = await api<{ user: User }>("/api/auth/me", { token });
          set({ user: res.user });
        } catch {
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: "marketplace-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
