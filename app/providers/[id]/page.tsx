import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from "lucide-react";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import ProviderReviews from "@/components/ProviderReviews";
import ProviderLiveRating from "@/components/ProviderLiveRating";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type CategoryData =
  | {
      name: string;
    }
  | {
      name: string;
    }[]
  | null;

type Review = {
  id: number;
  user_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function ProviderPage({
  params,
}: PageProps) {
  const { id } = await params;

  const providerId = Number(id);

  if (Number.isNaN(providerId)) {
    return <NotFound />;
  }

  // IMPORTANT:
  // createServerSupabaseClient is now async
  const supabase =
    await createServerSupabaseClient();

  const { data: provider, error } = await supabase
    .from("service_providers")
    .select(`
      id,
      name,
      description,
      phone,
      email,
      location,
      city,
      rating,
      review_count,
      verified,
      image_url,
      categories (
        name
      )
    `)
    .eq("id", providerId)
    .single();

  if (error || !provider) {
    console.error("Provider error:", error);
    return <NotFound />;
  }

  const { data: reviews, error: reviewsError } =
    await supabase
      .from("reviews")
      .select(
        "id, user_name, rating, comment, created_at"
      )
      .eq("provider_id", providerId)
      .order("created_at", {
        ascending: false,
      });

  if (reviewsError) {
    console.error(
      "Reviews error:",
      reviewsError
    );
  }

  const categoryData =
    provider.categories as unknown as CategoryData;

  const category = Array.isArray(categoryData)
    ? categoryData[0]?.name
    : categoryData?.name;

  const providerReviews =
    (reviews ?? []) as Review[];

  const initials = provider.name
    .split(" ")
    .map((word: string) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950">
      {/* NAVBAR */}

      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <ShieldCheck size={18} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              FixNear
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            Find another provider
          </Link>
        </div>
      </nav>

      {/* CONTENT */}

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* BACK */}

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Back to providers
        </Link>

        {/* PROVIDER PROFILE */}

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white">
          {/* COVER */}

          <div className="relative h-56 bg-gradient-to-br from-zinc-100 to-zinc-200 sm:h-72">
            {provider.image_url ? (
              <img
                src={provider.image_url}
                alt={provider.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white text-3xl font-bold text-zinc-700 shadow-sm">
                  {initials}
                </div>
              </div>
            )}

            {provider.verified && (
              <div className="absolute right-6 top-6 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-600 shadow-sm">
                <BadgeCheck size={15} />
                Verified
              </div>
            )}
          </div>

          {/* DETAILS */}

          <div className="p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              {category ?? "Local service"}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {provider.name}
            </h1>

            {/* LOCATION + LIVE RATING */}

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />

                {provider.location}

                {provider.city
                  ? `, ${provider.city}`
                  : ""}
              </span>

              <ProviderLiveRating
                providerId={providerId}
                initialRating={provider.rating}
                initialReviewCount={
                  provider.review_count
                }
              />
            </div>

            {/* PRIMARY ACTION */}

            <Link
              href={`/providers/${providerId}/request`}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:w-fit"
            >
              Request Service
              <ArrowRight size={17} />
            </Link>

            {/* CONTACT ACTIONS */}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {provider.phone && (
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  <Phone size={16} />
                  Call provider
                </a>
              )}

              {provider.email && (
                <a
                  href={`mailto:${provider.email}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  <Mail size={16} />
                  Email provider
                </a>
              )}
            </div>

            {/* ABOUT */}

            {provider.description && (
              <div className="mt-10 border-t border-zinc-100 pt-8">
                <h2 className="text-lg font-bold">
                  About this provider
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500">
                  {provider.description}
                </p>
              </div>
            )}

            {/* TRUST CARDS */}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 p-5">
                <BadgeCheck
                  className="text-emerald-600"
                  size={20}
                />

                <p className="mt-3 text-sm font-semibold">
                  Verified provider
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Profile verification completed
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-5">
                <Star
                  className="text-amber-400"
                  fill="currentColor"
                  size={20}
                />

                <p className="mt-3 text-sm font-semibold">
                  {provider.rating?.toFixed(1) ??
                    "New"}{" "}
                  rating
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Based on customer reviews
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-5">
                <ShieldCheck
                  className="text-zinc-700"
                  size={20}
                />

                <p className="mt-3 text-sm font-semibold">
                  Local professional
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  Serving{" "}
                  {provider.city ?? "your area"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}

        <ProviderReviews
          providerId={providerId}
          initialReviews={providerReviews}
          initialRating={provider.rating}
          initialReviewCount={provider.review_count}
        />
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
          <MapPin className="text-zinc-400" />
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          Provider not found
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          This provider doesn't exist or may have been
          removed.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to FixNear
        </Link>
      </div>
    </main>
  );
}