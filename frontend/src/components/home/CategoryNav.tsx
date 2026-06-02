"use client";

import Link from "next/link";
import { SHOP_CATEGORIES } from "@/lib/homeContent";

export function CategoryNav() {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 py-2" aria-label="Categories">
          {SHOP_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-primary-50 hover:text-primary-700"
            >
              <span aria-hidden>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
