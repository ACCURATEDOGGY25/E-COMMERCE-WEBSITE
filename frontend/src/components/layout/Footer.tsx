"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-white">MarketHub</h3>
            <p className="mt-2 text-sm">
              Your trusted multi-vendor marketplace. Shop from thousands of sellers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="hover:text-white">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-white">
                  Vendors
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Account</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/register?role=seller" className="hover:text-white">
                  Sell on MarketHub
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Newsletter</h4>
            <p className="mt-2 text-sm">Get deals and updates in your inbox.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="input flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <button type="submit" className="btn-primary shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          © {new Date().getFullYear()} MarketHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
