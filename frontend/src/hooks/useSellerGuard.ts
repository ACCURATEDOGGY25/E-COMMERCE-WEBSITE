"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

/** Redirect non-sellers away from seller routes. */
export function useSellerGuard(redirectPath: string) {
  const router = useRouter();
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }
    if (user && user.role !== "SELLER" && user.role !== "ADMIN") {
      router.push("/");
    }
  }, [token, user, router, redirectPath]);

  const allowed =
    !!token && (!user || user.role === "SELLER" || user.role === "ADMIN");

  return { token, user, allowed };
}
