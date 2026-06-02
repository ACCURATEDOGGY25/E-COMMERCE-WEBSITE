"use client";

import Link from "next/link";
import { PROMO_ITEMS } from "@/lib/homeContent";

export function PromoBar() {
  return (
    <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-600 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-1 px-4 py-2 text-xs font-medium sm:text-sm">
        {PROMO_ITEMS.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="whitespace-nowrap transition hover:text-white/80"
          >
            {item.text}
          </Link>
        ))}
      </div>
    </div>
  );
}
