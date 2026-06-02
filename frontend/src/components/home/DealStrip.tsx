import Link from "next/link";
import { Zap, Tag, Gift } from "lucide-react";

const deals = [
  {
    icon: Zap,
    title: "Flash Deals",
    desc: "Limited-time offers",
    href: "/products?featured=true",
    color: "bg-amber-500",
  },
  {
    icon: Tag,
    title: "Daily Deals",
    desc: "New discounts every day",
    href: "/products?sort=price_asc",
    color: "bg-rose-500",
  },
  {
    icon: Gift,
    title: "Gift Ideas",
    desc: "Perfect picks for any occasion",
    href: "/products?category=fashion",
    color: "bg-emerald-500",
  },
];

export function DealStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {deals.map((deal) => (
        <Link
          key={deal.title}
          href={deal.href}
          className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md"
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${deal.color} text-white`}
          >
            <deal.icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 group-hover:text-primary-600">
              {deal.title}
            </h3>
            <p className="text-sm text-gray-500">{deal.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
