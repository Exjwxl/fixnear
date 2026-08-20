"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import ReviewForm from "@/components/ReviewForm";

type Review = {
  id: number;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

type ProviderReviewsProps = {
  providerId: number;
  initialReviews: Review[];
  initialRating: number | null;
  initialReviewCount: number | null;
};

export default function ProviderReviews({
  providerId,
  initialReviews,
  initialRating,
  initialReviewCount,
}: ProviderReviewsProps) {
  const [reviews, setReviews] =
    useState<Review[]>(initialReviews);

  const [rating, setRating] =
    useState<number | null>(initialRating);

  const [reviewCount, setReviewCount] =
    useState<number | null>(initialReviewCount);

  async function loadReviews() {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        "id, user_name, rating, comment, created_at"
      )
      .eq("provider_id", providerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Failed to load reviews:",
        error
      );

      return;
    }

    const newReviews = (data ?? []) as Review[];

    setReviews(newReviews);

    if (newReviews.length > 0) {
      const total = newReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      const average = total / newReviews.length;

      setRating(average);
      setReviewCount(newReviews.length);
    } else {
      setRating(null);
      setReviewCount(0);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-10">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Customer feedback
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Reviews
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Star
            size={18}
            fill="currentColor"
            className="text-amber-400"
          />

          <span className="font-bold">
            {rating !== null
              ? rating.toFixed(1)
              : "New"}
          </span>

          <span className="text-sm text-zinc-400">
            from {reviewCount ?? 0} reviews
          </span>
        </div>
      </div>

      {/* REVIEW LIST */}

      {reviews.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 py-12 text-center">
          <Star
            className="mx-auto text-zinc-300"
            size={28}
          />

          <p className="mt-3 text-sm font-medium">
            No reviews yet
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            Be the first person to leave a review.
          </p>
        </div>
      ) : (
        <div className="mt-8 divide-y divide-zinc-100">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="py-6 first:pt-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-semibold">
                    {review.user_name}
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map(
                      (_, index) => {
                        const filled =
                          index < review.rating;

                        return (
                          <Star
                            key={index}
                            size={13}
                            fill={
                              filled
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              filled
                                ? "text-amber-400"
                                : "text-zinc-300"
                            }
                          />
                        );
                      }
                    )}
                  </div>
                </div>

                <span className="text-xs text-zinc-400">
                  {new Date(
                    review.created_at
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {review.comment && (
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  {review.comment}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      {/* REVIEW FORM */}

      <ReviewForm
        providerId={providerId}
        onReviewSubmitted={loadReviews}
      />
    </section>
  );
}