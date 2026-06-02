"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { ApiError } from "@/lib/api";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("role") === "seller";
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">(
    isSeller ? "SELLER" : "CUSTOMER"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await register({
        name,
        email,
        password,
        role,
        storeName: role === "SELLER" ? storeName : undefined,
      });
      router.push(role === "SELLER" ? "/seller" : "/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold">Create account</h1>

        <div className="mt-4 flex rounded-lg border p-1">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              role === "CUSTOMER" ? "bg-primary-600 text-white" : "text-gray-600"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("SELLER")}
            className={`flex-1 rounded-md py-2 text-sm font-medium ${
              role === "SELLER" ? "bg-primary-600 text-white" : "text-gray-600"
            }`}
          >
            Seller
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-1"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-1"
              minLength={8}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
          </div>
          {role === "SELLER" && (
            <div>
              <label className="text-sm font-medium">Store name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="input mt-1"
                required
              />
            </div>
          )}
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
