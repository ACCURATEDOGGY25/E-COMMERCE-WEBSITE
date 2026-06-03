"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Bell,
  User,
  Menu,
  X,
  Store,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { SearchBar } from "@/components/search/SearchBar";
import { api } from "@/lib/api";

export function Header() {
  const { user, token, logout, fetchUser } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (token) {
      fetchUser();
      fetchCart();
      api<{ unreadCount: number }>("/api/notifications", { token })
        .then((res) => setUnreadNotifications(res.unreadCount))
        .catch(() => {});
    }
  }, [token, fetchUser, fetchCart]);

  const cartCount = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 text-sm font-bold text-white shadow-md">
              M
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
              MarketHub
            </span>
          </Link>

          <div className="hidden flex-1 max-w-xl md:block">
            <SearchBar />
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/products"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Shop
            </Link>
            <Link
              href="/vendors"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Vendors
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {token ? (
              <>
                <Link
                  href="/account"
                  className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Link>
                <Link
                  href="/wishlist"
                  className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Link>
                <Link
                  href="/cart"
                  className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="hidden text-sm font-medium sm:inline">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      {(user?.role === "SELLER" || user?.role === "ADMIN") && (
                        <Link
                          href="/seller"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Store className="h-4 w-4" />
                          Seller Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary hidden sm:inline-flex">
                  Sign in
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
            <button
              className="rounded-lg p-2 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <SearchBar />
            <nav className="mt-4 flex flex-col gap-1">
              <Link href="/products" className="rounded-lg px-3 py-2 hover:bg-gray-100">
                Shop
              </Link>
              <Link href="/vendors" className="rounded-lg px-3 py-2 hover:bg-gray-100">
                Vendors
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
