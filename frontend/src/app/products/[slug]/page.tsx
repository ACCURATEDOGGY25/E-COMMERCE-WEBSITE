import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Truck } from "lucide-react";
import { ProductActions } from "@/components/products/ProductActions";
import { ProductCard } from "@/components/products/ProductCard";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null = null;
  let related: Product[] = [];

  try {
    const res = await api<{
      data: Product & {
        reviews: Array<{
          id: string;
          rating: number;
          title?: string | null;
          comment?: string | null;
          user: { name: string; avatar?: string | null };
        }>;
        vendor: {
          id: string;
          storeName: string;
          slug: string;
          description?: string | null;
        };
      };
      related: Product[];
    }>(`/api/products/${slug}`);
    product = res.data;
    related = res.related;
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-4 inline-block text-primary-600 hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  const p = product as Product & {
    reviews: Array<{
      id: string;
      rating: number;
      title?: string | null;
      comment?: string | null;
      user: { name: string };
    }>;
    vendor: { storeName: string; slug: string; description?: string | null };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {p.images[0] && (
              <Image
                src={p.images[0].url}
                alt={p.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          {p.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {p.images.slice(0, 4).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image src={img.url} alt="" fill className="object-cover" sizes="100px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {p.vendor && (
            <Link
              href={`/vendors/${p.vendor.slug}`}
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              {p.vendor.storeName}
            </Link>
          )}
          <h1 className="mt-2 text-3xl font-bold">{p.name}</h1>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{p.rating.toFixed(1)}</span>
              <span className="text-gray-500">({p.reviewCount} reviews)</span>
            </div>
            {p.brand && <span className="text-gray-500">Brand: {p.brand}</span>}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(p.price)}</span>
            {p.comparePrice && Number(p.comparePrice) > Number(p.price) && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(p.comparePrice)}
              </span>
            )}
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed">{p.description}</p>

          <div className="mt-6 space-y-3 text-sm text-gray-600">
            {p.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Ships from {p.location}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Free shipping on orders over $50
            </div>
            <p>
              <span className="font-medium text-gray-900">
                {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
              </span>
            </p>
          </div>

          <ProductActions product={p} />
        </div>
      </div>

      {/* Reviews */}
      {p.reviews?.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">Customer Reviews</h2>
          <div className="mt-6 space-y-4">
            {p.reviews.map((review) => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.user.name}</span>
                </div>
                {review.title && <p className="mt-2 font-medium">{review.title}</p>}
                {review.comment && (
                  <p className="mt-1 text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">Related Products</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
