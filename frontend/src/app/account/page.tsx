"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

export default function AccountPage() {
  const router = useRouter();
  const { user, token, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push("/login?redirect=/account");
      return;
    }
    fetchUser();
  }, [token, fetchUser, router]);

  if (!token || !user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold">My Account</h1>

      <div className="card mt-8 p-6">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="font-medium capitalize">{user.role.toLowerCase()}</dd>
          </div>
          {user.vendor && (
            <div>
              <dt className="text-sm text-gray-500">Store</dt>
              <dd className="font-medium">
                {user.vendor.storeName}{" "}
                <span className="text-sm text-gray-500">
                  ({user.vendor.status})
                </span>
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/orders" className="card p-4 hover:shadow-md transition">
          <h3 className="font-semibold">Order History</h3>
          <p className="text-sm text-gray-500">View and track your orders</p>
        </Link>
        <Link href="/wishlist" className="card p-4 hover:shadow-md transition">
          <h3 className="font-semibold">Wishlist</h3>
          <p className="text-sm text-gray-500">Saved items for later</p>
        </Link>
      </div>
    </div>
  );
}
