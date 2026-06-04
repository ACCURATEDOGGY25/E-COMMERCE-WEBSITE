import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCategoryBar } from "@/components/products/ProductCategoryBar";
import { api } from "@/lib/api";
import { DEMO_PRODUCTS, filterLocalDemoProducts } from "@/lib/homeContent";
import { getCategoryDisplayName } from "@/lib/categoryFilter";
import type { Product, Pagination } from "@/types";

export const dynamic = "force-dynamic";

interface SearchParams {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  location?: string;
  featured?: string;
  sort?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) query.set(k, v);
  });
  const limit = params.category ? "48" : "20";
  query.set("limit", query.get("limit") || limit);

  let products: Product[] = [];
  let pagination: Pagination | null = null;
  let isDemo = false;

  try {
    const res = await api<{
      data: Product[];
      pagination: Pagination;
      demo?: boolean;
    }>(`/api/products?${query.toString()}`);
    products = res.data;
    pagination = res.pagination;
    isDemo = !!res.demo;
  } catch {
    products = filterLocalDemoProducts(DEMO_PRODUCTS, params);
    isDemo = true;
    const page = Number(params.page) || 1;
    const lim = Number(limit);
    const total = products.length;
    pagination = {
      page,
      limit: lim,
      total,
      totalPages: Math.max(1, Math.ceil(total / lim)),
    };
    products = products.slice((page - 1) * lim, page * lim);
  }

  const pageTitle = params.search
    ? `Results for "${params.search}"`
    : params.category
      ? getCategoryDisplayName(params.category)
      : "All Products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary-600">
          Products
        </Link>
        {params.category && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{pageTitle}</span>
          </>
        )}
      </nav>

      <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{pageTitle}</h1>
      {params.category && (
        <p className="mt-1 text-gray-600">
          Browse {pageTitle.toLowerCase()} from verified sellers
        </p>
      )}

      <Suspense fallback={null}>
        <ProductCategoryBar />
      </Suspense>

      {isDemo && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Preview mode — run{" "}
          <code className="rounded bg-amber-100 px-1">bash scripts/seed-catalog.sh</code>{" "}
          with API online for full catalog.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="shrink-0 lg:w-64">
          <Suspense fallback={<div className="card h-64 animate-pulse bg-gray-100" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="card p-12 text-center text-gray-500">
              <p>No products in this category yet.</p>
              {params.category && (
                <Link
                  href="/products"
                  className="mt-4 inline-block text-primary-600 hover:underline"
                >
                  View all products
                </Link>
              )}
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {pagination?.total ?? products.length} product
                {(pagination?.total ?? products.length) !== 1 ? "s" : ""}
                {params.category ? ` in ${pageTitle}` : ""}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .slice(0, 10)
                    .map((page) => {
                      const q = new URLSearchParams(query);
                      q.set("page", String(page));
                      return (
                        <a
                          key={page}
                          href={`/products?${q.toString()}`}
                          className={`rounded-lg px-3 py-1 text-sm ${
                            page === pagination!.page
                              ? "bg-primary-600 text-white"
                              : "border hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </a>
                      );
                    })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
