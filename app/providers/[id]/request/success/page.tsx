"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Home,
  ShieldCheck,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function RequestSuccessPage() {
  const params = useParams();

  const providerId = params.id;

  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950">
      {/* HEADER */}

      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
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
            href="/account"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            My account
          </Link>
        </div>
      </nav>

      {/* SUCCESS */}

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-[0_20px_70px_-40px_rgba(0,0,0,0.25)] sm:p-12">
          {/* ICON */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2
              size={42}
              className="text-emerald-600"
            />
          </div>

          {/* HEADING */}

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Request sent
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Your request is on its way.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-500">
            Your service request has been sent to the
            provider. They can now review your problem and
            contact you using the details you provided.
          </p>

          {/* STATUS */}

          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-zinc-50 p-5 text-left">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <ClipboardCheck
                  size={19}
                  className="text-zinc-600"
                />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Request submitted
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  The provider will review your request and
                  decide whether they can take the job.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <Home size={16} />
              Back to home
            </Link>

            <Link
              href={`/providers/${providerId}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <ArrowLeft size={16} />
              Back to provider
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}