import Link from "next/link";
import { api } from "@/lib/api";

export default async function VendorsPage() {
  let vendors: Array<{
    id: string;
    storeName: string;
    slug: string;
    description?: string | null;
    _count: { products: number };
  }> = [];

  try {
    const res = await api<{ data: typeof vendors }>("/api/vendors");
    vendors = res.data;
  } catch {
    vendors = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">Our Vendors</h1>
      <p className="mt-2 text-gray-600">
        Shop from trusted sellers across the marketplace
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((v) => (
          <Link
            key={v.id}
            href={`/vendors/${v.slug}`}
            className="card p-6 transition hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-600">
              {v.storeName.charAt(0)}
            </div>
            <h2 className="mt-4 text-lg font-semibold">{v.storeName}</h2>
            {v.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                {v.description}
              </p>
            )}
            <p className="mt-4 text-sm text-primary-600">
              {v._count.products} products →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
