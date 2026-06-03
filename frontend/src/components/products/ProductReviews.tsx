"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { api, ApiError } from "@/lib/api";
import Link from "next/link";

interface ReviewUser {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface ProductReview {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  user: ReviewUser;
  createdAt?: string;
}

interface Props {
  productId: string;
  productSlug?: string;
  initialReviews: ProductReview[];
}

export function ProductReviews({ productId, productSlug, initialReviews }: Props) {
  const { token } = useAuthStore();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api("/api/reviews", {
        method: "POST",
        token,
        body: JSON.stringify({ productId, rating, title: title || undefined, comment: comment || undefined }),
      });

      const res = await api<{ data: ProductReview[] }>(
        `/api/reviews?productId=${productId}`
      );
      setReviews(res.data);
      setMessage("Thank you for your review!");
      setTitle("");
      setComment("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold">Customer Reviews</h2>

      {token ? (
        <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
          <h3 className="font-medium">Write a review</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="rounded p-1 hover:bg-amber-50"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-6 w-6 ${
                    n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <input
            className="input"
            placeholder="Review title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input min-h-[80px]"
            placeholder="Your experience with this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Submitting..." : "Submit review"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-gray-600">
          <Link
            href={`/login?redirect=/products/${productSlug || ""}`}
            className="text-primary-600 hover:underline"
          >
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
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
          ))
        )}
      </div>
    </section>
  );
}
