"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type ProviderLiveRatingProps = {
  providerId: number;
  initialRating: number | null;
  initialReviewCount: number | null;
};

export default function ProviderLiveRating({
  providerId,
  initialRating,
  initialReviewCount,
}: ProviderLiveRatingProps) {
  const [rating, setRating] = useState<number | null>(
    initialRating
  );

  const [reviewCount, setReviewCount] = useState(
    initialReviewCount ?? 0
  );

  async function refreshRating() {
    const { data, error } = await supabase
      .from("service_providers")
      .select("rating, review_count")
      .eq("id", providerId)
      .single();

    if (error) {
      console.error(
        "Failed to refresh provider rating:",
        error
      );

      return;
    }

    setRating(data.rating);
    setReviewCount(data.review_count ?? 0);
  }

  useEffect(() => {
    function handleReviewSubmitted(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent<{
          providerId: number;
        }>;

      if (
        customEvent.detail?.providerId ===
        providerId
      ) {
        refreshRating();
      }
    }

    window.addEventListener(
      "fixnear:review-submitted",
      handleReviewSubmitted
    );

    return () => {
      window.removeEventListener(
        "fixnear:review-submitted",
        handleReviewSubmitted
      );
    };
  }, [providerId]);

  return (
    <span className="flex items-center gap-1.5">
      <Star
        size={16}
        fill="currentColor"
        className="text-amber-400"
      />

      <strong className="text-zinc-800">
        {rating !== null
          ? rating.toFixed(1)
          : "New"}
      </strong>

      <span>
        ({reviewCount}{" "}
        {reviewCount === 1 ? "review" : "reviews"})
      </span>
    </span>
  );
}