"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SHOP_CATEGORIES } from "@/lib/homeContent";

export function ProductCategoryBar() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Link
        href="/products"
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          !active
            ? "bg-primary-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </Link>
      {SHOP_CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/products?category=${cat.slug}`}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            active === cat.slug
              ? "bg-primary-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <span aria-hidden>{cat.icon}</span>
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
