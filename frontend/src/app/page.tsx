import Link from "next/link";
import Image from "next/image";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DealStrip } from "@/components/home/DealStrip";
import { TrustBar } from "@/components/home/TrustBar";
import { ProductCard } from "@/components/products/ProductCard";
import { api } from "@/lib/api";
import {
  DEMO_PRODUCTS,
  DEMO_VENDORS,
  toCategoryList,
} from "@/lib/homeContent";
import type { Product, Category } from "@/types";

async function getHomeData() {
  try {
    const [featured, newest, categories, vendors] = await Promise.all([
      api<{ data: Product[] }>("/api/products?featured=true&limit=8"),
      api<{ data: Product[] }>("/api/products?sort=newest&limit=8"),
      api<{ data: Category[] }>("/api/categories"),
      api<{
        data: Array<{
          id: string;
          storeName: string;
          slug: string;
          logo?: string | null;
          _count: { products: number };
        }>;
      }>("/api/vendors"),
    ]);
    return {
      featured: featured.data.length > 0 ? featured.data : DEMO_PRODUCTS.filter((p) => p.isFeatured),
      newest: newest.data.length > 0 ? newest.data : DEMO_PRODUCTS,
      categories: toCategoryList(categories.data),
      vendors: vendors.data.length > 0 ? vendors.data : DEMO_VENDORS,
      usingDemo: featured.data.length === 0,
    };
  } catch {
    return {
      featured: DEMO_PRODUCTS.filter((p) => p.isFeatured),
      newest: DEMO_PRODUCTS,
      categories: toCategoryList([]),
      vendors: DEMO_VENDORS,
      usingDemo: true,
    };
  }
}

export default async function HomePage() {
  const { featured, newest, categories, vendors, usingDemo } = await getHomeData();

  return (
    <div>
      {/* Hero + quick deals */}
      <section className="bg-gradient-to-b from-primary-50/80 to-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <HeroCarousel />
          <div className="mt-8">
            <DealStrip />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TrustBar />

        {/* Categories */}
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Browse
              </p>
              <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="mt-1 text-gray-600">
                Fashion, gaming, electronics, home & more — all in one place
              </p>
            </div>
            <Link
              href="/products"
              className="rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
            >
              View all products
            </Link>
          </div>
          <div className="mt-8">
            <CategoryGrid categories={categories} />
          </div>
        </section>

        {/* Featured */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-accent">Hot picks</p>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            </div>
            <Link
              href="/products?featured=true"
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              See all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Promo banner mid-page */}
        <section className="mt-14 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-primary-600 to-violet-600 p-8 text-white shadow-lg sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Weekend Mega Sale</h2>
              <p className="mt-2 max-w-md text-white/90">
                Save big on electronics, fashion & gaming. Hundreds of deals from trusted vendors.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-8 py-3 font-bold text-primary-700 transition hover:bg-gray-100"
            >
              Shop the sale
            </Link>
          </div>
        </section>

        {/* New arrivals */}
        <section className="mt-14">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-600">Just landed</p>
              <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-sm font-medium text-primary-600 hover:underline"
            >
              See all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {newest.slice(0, 8).map((p) => (
              <ProductCard key={`new-${p.id}`} product={p} />
            ))}
          </div>
        </section>

        {/* Top vendors */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-gray-900">Top Vendors</h2>
          <p className="mt-1 text-gray-600">Shop from our most popular sellers</p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {vendors.map((v) => (
              <Link
                key={v.id}
                href={`/vendors/${v.slug}`}
                className="card group flex items-center gap-4 p-5 transition hover:border-primary-200 hover:shadow-lg"
              >
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-indigo-100 text-2xl font-bold text-primary-600">
                  {v.logo ? (
                    <Image src={v.logo} alt="" fill className="object-cover" sizes="64px" />
                  ) : (
                    v.storeName.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-600">
                    {v.storeName}
                  </h3>
                  <p className="text-sm text-gray-500">{v._count.products}+ products</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {usingDemo && (
          <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
            Showing preview products. Connect your database with{" "}
            <code className="rounded bg-amber-100 px-1">npm run setup</code> for live inventory.
          </p>
        )}

        {/* Testimonials */}
        <section className="mt-14 rounded-2xl bg-gray-900 p-8 text-white sm:p-12">
          <h2 className="text-center text-2xl font-bold">What Customers Say</h2>
          <p className="mt-2 text-center text-gray-400">
            Join thousands of happy shoppers on MarketHub
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "Fast delivery and great prices. I shop here every week!",
                author: "Sarah M.",
                role: "Verified buyer",
              },
              {
                quote: "Love buying from multiple vendors in one checkout.",
                author: "James K.",
                role: "Power shopper",
              },
              {
                quote: "Quality products and excellent customer support.",
                author: "Emily R.",
                role: "Fashion fan",
              },
            ].map((t, i) => (
              <blockquote
                key={i}
                className="rounded-xl border border-gray-700 bg-gray-800/50 p-6"
              >
                <p className="text-gray-200">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4">
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
