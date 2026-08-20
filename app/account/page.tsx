import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  LogIn,
  ShieldCheck,
  User,
} from "lucide-react";

import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
            <LogIn
              className="text-zinc-500"
              size={26}
            />
          </div>

          <h1 className="mt-6 text-2xl font-bold">
            You're not signed in
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Sign in to access your FixNear account.
          </p>

          <Link
            href="/auth"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  const fullName =
    user.user_metadata?.full_name ??
    "FixNear user";

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
            Home
          </Link>
        </div>
      </nav>

      {/* ACCOUNT */}

      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Back to FixNear
        </Link>

        <section className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-8 sm:p-10">
          {/* PROFILE */}

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100">
              <User
                size={32}
                className="text-zinc-500"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Your account
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight">
                {fullName}
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                {user.email}
              </p>
            </div>
          </div>

          {/* MY REQUESTS */}

          <div className="mt-10 border-t border-zinc-100 pt-8">
            <h2 className="text-lg font-bold">
              Your activity
            </h2>

            <Link
              href="/account/requests"
              className="group mt-4 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 transition group-hover:bg-zinc-200">
                  <ClipboardList
                    size={20}
                    className="text-zinc-600"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    My Service Requests
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    View your requests and track their status.
                  </p>
                </div>
              </div>

              <span className="text-lg text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-700">
                →
              </span>
            </Link>
          </div>

          {/* ACCOUNT STATUS */}

          <div className="mt-8 border-t border-zinc-100 pt-8">
            <h2 className="text-lg font-bold">
              Account status
            </h2>

            <div className="mt-4 rounded-2xl bg-zinc-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Account active
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-400">
                    Your FixNear account is ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}