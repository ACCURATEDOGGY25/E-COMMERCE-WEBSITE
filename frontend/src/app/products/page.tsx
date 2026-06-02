import { Suspense } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { api } from "@/lib/api";
import { DEMO_PRODUCTS } from "@/lib/homeContent";
import type { Product, Pagination } from "@/types";

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
  if (!query.has("limit")) query.set("limit", "20");

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
    products = DEMO_PRODUCTS;
    isDemo = true;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">
        {params.search ? `Results for "${params.search}"` : "All Products"}
      </h1>

      {isDemo && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Preview mode — connect Supabase in <code className="rounded bg-amber-100 px-1">backend/.env</code> and run{" "}
          <code className="rounded bg-amber-100 px-1">bash scripts/setup.sh</code> for login and checkout.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64 shrink-0">
          <Suspense fallback={<div className="card h-64 animate-pulse bg-gray-100" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="card p-12 text-center text-gray-500">
              No products found. Try adjusting your filters.
            </div>
          ) : (
            <>
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
