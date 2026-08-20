"use client";

import {
  Loader2,
  Send,
  Star,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

type ReviewFormProps = {
  providerId: number;
  onReviewSubmitted: () => void;
};

export default function ReviewForm({
  providerId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<string | null>(
    null
  );

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [hoverRating, setHoverRating] = useState(0);

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [alreadyReviewed, setAlreadyReviewed] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadUser();
  }, [providerId]);

  async function loadUser() {
    setLoadingUser(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      setUserName("");
      setLoadingUser(false);
      return;
    }

    setUserId(user.id);

    const name =
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "FixNear User";

    setUserName(name);

    const { data: existingReview, error } =
      await supabase
        .from("reviews")
        .select("id")
        .eq("provider_id", providerId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to check existing review:",
        error
      );
    }

    setAlreadyReviewed(Boolean(existingReview));

    setLoadingUser(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!userId) {
      setError(
        "Please log in before leaving a review."
      );
      return;
    }

    if (alreadyReviewed) {
      setError(
        "You have already reviewed this provider."
      );
      return;
    }

    const trimmedComment = comment.trim();

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!trimmedComment) {
      setError("Please write a short review.");
      return;
    }

    if (trimmedComment.length < 10) {
      setError(
        "Your review should be at least 10 characters."
      );
      return;
    }

    setSubmitting(true);

    const { error: insertError } =
      await supabase.from("reviews").insert({
        provider_id: providerId,
        user_id: userId,
        user_name: userName,
        rating,
        comment: trimmedComment,
      });

    if (insertError) {
      console.error(
        "Review submission failed:",
        insertError
      );

      if (insertError.code === "23505") {
        setAlreadyReviewed(true);

        setError(
          "You have already reviewed this provider."
        );
      } else {
        setError(
          "Unable to submit your review. Please try again."
        );
      }

      setSubmitting(false);
      return;
    }

    setRating(0);
    setComment("");
    setHoverRating(0);

    setAlreadyReviewed(true);
    setSuccess(true);

    setSubmitting(false);

    window.dispatchEvent(
      new CustomEvent("fixnear:review-submitted", {
        detail: {
          providerId,
        },
      })
    );

    onReviewSubmitted();
  }

  if (loadingUser) {
    return (
      <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2
            size={16}
            className="animate-spin"
          />

          Checking your account...
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Customer feedback
        </p>

        <h3 className="mt-2 text-xl font-bold">
          Want to leave a review?
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Log in to your FixNear account to share your
          experience.
        </p>

        <a
          href="/auth"
          className="mt-6 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Log in to review
        </a>
      </div>
    );
  }

  if (alreadyReviewed) {
    return (
      <div className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
          Review submitted
        </p>

        <h3 className="mt-2 text-xl font-bold text-zinc-950">
          Thanks for your feedback, {userName}.
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-600">
          You have already reviewed this provider.
          Each customer can leave one review per provider.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Share your experience
        </p>

        <h3 className="mt-2 text-xl font-bold">
          Leave a review
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          Reviewing as{" "}
          <span className="font-semibold text-zinc-700">
            {userName}
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 space-y-6"
      >
        {/* RATING */}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Your rating
          </label>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map(
              (_, index) => {
                const starNumber = index + 1;

                const active =
                  starNumber <=
                  (hoverRating || rating);

                return (
                  <button
                    key={starNumber}
                    type="button"
                    onClick={() =>
                      setRating(starNumber)
                    }
                    onMouseEnter={() =>
                      setHoverRating(starNumber)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    aria-label={`${starNumber} star${
                      starNumber > 1 ? "s" : ""
                    }`}
                    className="rounded-lg p-1 transition hover:scale-110"
                  >
                    <Star
                      size={28}
                      fill={
                        active
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        active
                          ? "text-amber-400"
                          : "text-zinc-300"
                      }
                    />
                  </button>
                );
              }
            )}

            {rating > 0 && (
              <span className="ml-2 text-sm font-medium text-zinc-500">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        {/* COMMENT */}

        <div>
          <label
            htmlFor="review-comment"
            className="mb-2 block text-sm font-semibold"
          >
            Your experience
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            placeholder="How was your experience with this provider?"
            rows={5}
            maxLength={500}
            className="w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
          />

          <div className="mt-1 text-right text-xs text-zinc-400">
            {comment.length}/500
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Your review was submitted successfully.
          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Submitting...
            </>
          ) : (
            <>
              <Send size={17} />
              Submit review
            </>
          )}
        </button>
      </form>
    </div>
  );
}