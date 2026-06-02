import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = `/products/${product.slug}`;
  const image = product.images?.[0]?.url;
  const hasDiscount =
    product.comparePrice &&
    Number(product.comparePrice) > Number(product.price);

  return (
    <Link href={href} className="card group overflow-hidden transition hover:shadow-md hover:ring-2 hover:ring-primary-100">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        {product.vendor && (
          <p className="text-xs text-gray-500">{product.vendor.storeName}</p>
        )}
        <h3 className="mt-1 line-clamp-2 font-medium text-gray-900 group-hover:text-primary-600">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-600">
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
