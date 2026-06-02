import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types";

export default async function VendorStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const res = await api<{
      data: {
        storeName: string;
        slug: string;
        description?: string | null;
        products: Product[];
      };
    }>(`/api/vendors/${slug}`);

    const vendor = res.data;

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-indigo-700 p-8 text-white">
          <h1 className="text-3xl font-bold">{vendor.storeName}</h1>
          {vendor.description && (
            <p className="mt-2 max-w-2xl text-white/90">{vendor.description}</p>
          )}
          <p className="mt-4 text-sm text-white/80">
            {vendor.products.length} products available
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {vendor.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {vendor.products.length === 0 && (
          <p className="mt-8 text-center text-gray-500">No products listed yet.</p>
        )}
      </div>
    );
  } catch {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Vendor not found</h1>
        <Link href="/vendors" className="mt-4 inline-block text-primary-600 hover:underline">
          Browse all vendors
        </Link>
      </div>
    );
  }
}
