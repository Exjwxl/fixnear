import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  MapPin,
  Pencil,
  ShieldCheck,
  Star,
} from "lucide-react";

import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function ProviderDashboard() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6">
        <div className="text-center">
          <ShieldCheck
            size={42}
            className="mx-auto text-zinc-400"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Sign in required
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Sign in to access your provider dashboard.
          </p>

          <Link
            href="/auth"
            className="mt-6 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

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
      categories (
        name
      )
    `)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Provider dashboard error:",
      error
    );
  }

  if (!provider) {
    return (
      <main className="min-h-screen bg-[#fafaf9] text-zinc-950">
        <nav className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
                <ShieldCheck size={18} />
              </div>

              <span className="text-xl font-bold">
                FixNear
              </span>
            </Link>

            <Link
              href="/account"
              className="text-sm font-medium text-zinc-500"
            >
              My account
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
              <MapPin
                size={27}
                className="text-zinc-500"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Become a FixNear provider
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Create a provider profile and let customers
              discover your services.
            </p>

            <Link
              href="/provider/register"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Create provider profile
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const categoryData = provider.categories as
    | { name: string }
    | { name: string }[]
    | null;

  const category = Array.isArray(categoryData)
    ? categoryData[0]?.name
    : categoryData?.name;

  const { count: pendingRequests } =
    await supabase
      .from("service_requests")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("provider_id", provider.id)
      .eq("status", "pending");

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950">
      {/* NAVBAR */}

      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <ShieldCheck size={18} />
            </div>

            <span className="text-xl font-bold">
              FixNear
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link
              href={`/providers/${provider.id}`}
              className="flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
            >
              View profile
              <ExternalLink size={15} />
            </Link>

            <Link
              href="/account"
              className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
            >
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* DASHBOARD */}

      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Back to account
        </Link>

        {/* HEADER */}

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Provider dashboard
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome, {provider.name}
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Manage your FixNear provider profile.
              </p>
            </div>

            <Link
              href={`/providers/${provider.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              View public profile
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>

        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <Star
              size={20}
              fill="currentColor"
              className="text-amber-400"
            />

            <p className="mt-4 text-3xl font-bold">
              {provider.rating?.toFixed(1) ??
                "New"}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Average rating
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-3xl font-bold">
              {provider.review_count ?? 0}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Customer reviews
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <BadgeCheck
              size={20}
              className={
                provider.verified
                  ? "text-emerald-600"
                  : "text-zinc-400"
              }
            />

            <p className="mt-4 text-sm font-bold">
              {provider.verified
                ? "Verified"
                : "Verification pending"}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Provider status
            </p>
          </div>
        </div>

        {/* REQUESTS */}

        <Link
          href="/provider/requests"
          className="group mt-8 block rounded-[2rem] border border-zinc-200 bg-zinc-950 p-7 text-white transition hover:-translate-y-0.5 hover:shadow-xl sm:p-9"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Customer requests
                </p>

                {pendingRequests &&
                  pendingRequests > 0 ? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-950">
                      {pendingRequests} new
                    </span>
                  ) : null}
              </div>

              <h2 className="mt-2 text-2xl font-bold">
                Manage service requests
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                Review customer problems, accept jobs, and
                keep track of your active and completed work.
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950 transition group-hover:translate-x-1">
              <ArrowRight size={20} />
            </div>
          </div>
        </Link>

        {/* PROFILE */}

        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-9">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Your listing
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {provider.name}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {category ?? "Local service"}
              </p>
            </div>

            <Link
              href="/provider/edit"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              <Pencil size={15} />
              Edit profile
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Service area
              </p>

              <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                <MapPin size={16} />
                {provider.location},{" "}
                {provider.city}
              </p>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Contact
              </p>

              <p className="mt-2 text-sm font-semibold">
                {provider.phone}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {provider.email}
              </p>
            </div>
          </div>

          {provider.description && (
            <div className="mt-5 rounded-2xl bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                About
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {provider.description}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}