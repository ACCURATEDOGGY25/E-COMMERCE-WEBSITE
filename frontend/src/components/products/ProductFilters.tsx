"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") || "");
  const sort = searchParams.get("sort") || "newest";

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    if (brand) params.set("brand", brand);
    else params.delete("brand");
    if (location) params.set("location", location);
    else params.delete("location");
    if (minRating) params.set("minRating", minRating);
    else params.delete("minRating");
    params.delete("page");
    router.push(`/products?${params.toString()}`);
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="card space-y-6 p-6">
      <h2 className="font-semibold">Filters</h2>

      <div>
        <label className="text-sm font-medium text-gray-700">Sort by</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input mt-1"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Price range</label>
        <div className="mt-1 flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="input mt-1"
          placeholder="e.g. SoundMax"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input mt-1"
          placeholder="e.g. California"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Min rating</label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="input mt-1"
        >
          <option value="">Any</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
        </select>
      </div>

      <button onClick={applyFilters} className="btn-primary w-full">
        Apply Filters
      </button>
    </div>
  );
}
