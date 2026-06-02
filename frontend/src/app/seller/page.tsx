"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, DollarSign, ShoppingBag, Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

interface DashboardData {
  vendor: { storeName: string; slug: string; status: string };
  stats: {
    productCount: number;
    totalRevenue: string | number;
    pendingOrders: number;
  };
  recentOrders: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: string | number;
    orderStatus: string;
    createdAt: string;
  }>;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/seller");
      return;
    }
    if (user && user.role !== "SELLER" && user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    api<{ data: DashboardData }>("/api/seller/dashboard", { token })
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, [token, user, router]);

  if (!token) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          {data?.vendor && (
            <p className="text-gray-500">{data.vendor.storeName}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/seller/products/new" className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
          <Link href="/seller/products" className="btn-secondary">
            Manage Products
          </Link>
        </div>
      </div>

      {!data ? (
        <p className="mt-8 text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="card flex items-center gap-4 p-6">
              <div className="rounded-lg bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold">{data.stats.productCount}</p>
              </div>
            </div>
            <div className="card flex items-center gap-4 p-6">
              <div className="rounded-lg bg-green-100 p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold">
                  {formatPrice(data.stats.totalRevenue)}
                </p>
              </div>
            </div>
            <div className="card flex items-center gap-4 p-6">
              <div className="rounded-lg bg-amber-100 p-3">
                <ShoppingBag className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold">{data.stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="card mt-8">
            <div className="border-b px-6 py-4">
              <h2 className="font-semibold">Recent Orders</h2>
            </div>
            {data.recentOrders.length === 0 ? (
              <p className="p-6 text-gray-500">No orders yet</p>
            ) : (
              <div className="divide-y">
                {data.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div>
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-sm text-gray-500">
                        Qty {order.quantity} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.price)}</p>
                      <span className="text-xs text-gray-500">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href={`/vendors/${data.vendor.slug}`}
            className="mt-4 inline-block text-sm text-primary-600 hover:underline"
          >
            View your storefront →
          </Link>
        </>
      )}
    </div>
  );
}
