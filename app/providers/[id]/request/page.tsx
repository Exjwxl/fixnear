"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Provider = {
  id: number;
  name: string;
  location: string | null;
  city: string | null;
};

export default function ServiceRequestPage() {
  const params = useParams();
  const router = useRouter();

  const providerId = Number(params.id);

  const [provider, setProvider] =
    useState<Provider | null>(null);

  const [userId, setUserId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [preferredDate, setPreferredDate] =
    useState("");

  const [preferredTime, setPreferredTime] =
    useState("");

  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    loadPage();
  }, [providerId]);

  async function loadPage() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace(
        `/auth?redirect=/providers/${providerId}/request`
      );
      return;
    }

    setUserId(user.id);

    const { data: providerData, error: providerError } =
      await supabase
        .from("service_providers")
        .select(
          "id, name, location, city"
        )
        .eq("id", providerId)
        .single();

    if (providerError || !providerData) {
      console.error(
        "Provider loading failed:",
        providerError
      );

      setError(
        "This provider could not be found."
      );

      setLoading(false);
      return;
    }

    setProvider(
      providerData as Provider
    );

    setLoading(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!userId) {
      setError(
        "Please log in before requesting a service."
      );
      return;
    }

    const cleanTitle = title.trim();
    const cleanDescription =
      description.trim();
    const cleanPhone = phone.trim();

    if (!cleanTitle) {
      setError(
        "Please describe what you need help with."
      );
      return;
    }

    if (cleanTitle.length < 5) {
      setError(
        "Please provide a little more detail."
      );
      return;
    }

    if (!cleanDescription) {
      setError(
        "Please explain the problem."
      );
      return;
    }

    if (cleanDescription.length < 15) {
      setError(
        "Please provide more detail about the problem."
      );
      return;
    }

    if (!cleanPhone) {
      setError(
        "Please provide a phone number so the provider can contact you."
      );
      return;
    }

    setSubmitting(true);

    const { error: insertError } =
      await supabase
        .from("service_requests")
        .insert({
          customer_id: userId,
          provider_id: providerId,
          title: cleanTitle,
          description: cleanDescription,
          preferred_date:
            preferredDate || null,
          preferred_time:
            preferredTime || null,
          customer_phone: cleanPhone,
          status: "pending",
        });

    if (insertError) {
      console.error(
        "Service request failed:",
        insertError
      );

      setError(
        insertError.message ||
          "Unable to send your service request."
      );

      setSubmitting(false);
      return;
    }

    router.push(
      `/providers/${providerId}/request/success`
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9]">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Preparing your request...
        </div>
      </main>
    );
  }

  if (!provider) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Provider not found
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            We couldn't find the provider you're looking for.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Back to FixNear
          </Link>
        </div>
      </main>
    );
  }

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
            href={`/providers/${providerId}`}
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            Provider profile
          </Link>
        </div>
      </nav>

      {/* CONTENT */}

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <Link
          href={`/providers/${providerId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Back to provider
        </Link>

        {/* PROVIDER */}

        <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Request a service
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Contact {provider.name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />

              {provider.location ||
                "Location not specified"}

              {provider.city
                ? `, ${provider.city}`
                : ""}
            </span>
          </div>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-9"
        >
          <div>
            <h2 className="text-xl font-bold">
              Tell them what you need
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Give the provider enough information to
              understand your problem before contacting you.
            </p>
          </div>

          <div className="mt-7 space-y-6">
            {/* TITLE */}

            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold"
              >
                What do you need help with?
              </label>

              <input
                id="title"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Kitchen power keeps tripping"
                maxLength={120}
                className="w-full rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold"
              >
                Describe the problem
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Explain what happened, where the problem is, and anything else the provider should know."
                rows={6}
                maxLength={1000}
                className="w-full resize-none rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
              />

              <div className="mt-1 text-right text-xs text-zinc-400">
                {description.length}/1000
              </div>
            </div>

            {/* DATE + TIME */}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="preferred-date"
                  className="mb-2 block text-sm font-semibold"
                >
                  Preferred date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="preferred-date"
                    type="date"
                    value={preferredDate}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(event) =>
                      setPreferredDate(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="preferred-time"
                  className="mb-2 block text-sm font-semibold"
                >
                  Preferred time
                </label>

                <div className="relative">
                  <Clock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="preferred-time"
                    type="time"
                    value={preferredTime}
                    onChange={(event) =>
                      setPreferredTime(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                  />
                </div>
              </div>
            </div>

            {/* PHONE */}

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+91 98765 43210"
                  maxLength={20}
                  className="w-full rounded-2xl border border-zinc-200 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                />
              </div>
            </div>
          </div>

          {/* INFO */}

          <div className="mt-8 rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs leading-5 text-zinc-500">
              Your request will be sent directly to the
              provider. They can review your request and
              contact you using the details you provided.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Sending request...
              </>
            ) : (
              <>
                Send service request
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}