import Link from "next/link";
import Image from "next/image";
import type { ShopCategory } from "@/lib/homeContent";

interface CategoryGridProps {
  categories: ShopCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/products?category=${cat.slug}`}
          className="group relative overflow-hidden rounded-2xl shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative aspect-[4/3]">
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-80 mix-blend-multiply`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <span className="text-2xl" aria-hidden>
                {cat.icon}
              </span>
              <h3 className="mt-1 text-lg font-bold">{cat.name}</h3>
              <p className="text-xs text-white/85">{cat.tagline}</p>
              {cat.productCount != null && (
                <p className="mt-1 text-xs font-medium text-white/70">
                  {cat.productCount.toLocaleString()}+ items
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
