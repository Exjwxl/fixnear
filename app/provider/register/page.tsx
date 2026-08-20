"use client";

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Category = {
  id: number;
  name: string;
};

export default function ProviderRegisterPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [checkingAccount, setCheckingAccount] =
    useState(true);

  const [userId, setUserId] = useState<string | null>(
    null
  );

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setCheckingAccount(true);
    setLoadingCategories(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    setUserId(user.id);

    if (user.email) {
      setEmail(user.email);
    }

    const { data: existingProvider, error: providerError } =
      await supabase
        .from("service_providers")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

    if (providerError) {
      console.error(
        "Provider check failed:",
        providerError
      );
    }

    if (existingProvider) {
      router.replace(
        `/provider/dashboard`
      );
      return;
    }

    const { data: categoryData, error: categoryError } =
      await supabase
        .from("categories")
        .select("id, name")
        .order("name");

    if (categoryError) {
      console.error(
        "Category loading failed:",
        categoryError
      );

      setError(
        "Unable to load service categories."
      );
    } else {
      setCategories(
        (categoryData ?? []) as Category[]
      );
    }

    setCheckingAccount(false);
    setLoadingCategories(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!userId) {
      setError(
        "Your session has expired. Please log in again."
      );
      return;
    }

    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanLocation = location.trim();
    const cleanCity = city.trim();

    if (!cleanName) {
      setError("Please enter your business name.");
      return;
    }

    if (!categoryId) {
      setError("Please select a service category.");
      return;
    }

    if (!cleanDescription) {
      setError(
        "Please describe the services you provide."
      );
      return;
    }

    if (cleanDescription.length < 20) {
      setError(
        "Please provide a little more detail about your services."
      );
      return;
    }

    if (!cleanPhone) {
      setError("Please enter a phone number.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter a contact email.");
      return;
    }

    if (!cleanLocation) {
      setError(
        "Please enter your service location."
      );
      return;
    }

    if (!cleanCity) {
      setError("Please enter your city.");
      return;
    }

    setSubmitting(true);

    const { data, error: insertError } =
      await supabase
        .from("service_providers")
        .insert({
          owner_id: userId,
          name: cleanName,
          category_id: Number(categoryId),
          description: cleanDescription,
          phone: cleanPhone,
          email: cleanEmail,
          location: cleanLocation,
          city: cleanCity,
          rating: null,
          review_count: 0,
          verified: false,
        })
        .select("id")
        .single();

    if (insertError) {
      console.error(
        "Provider registration failed:",
        insertError
      );

      if (insertError.code === "23505") {
        setError(
          "You already have a provider profile."
        );
      } else {
        setError(
          insertError.message ||
            "Unable to create your provider profile."
        );
      }

      setSubmitting(false);
      return;
    }

    if (!data) {
      setError(
        "The provider profile could not be created."
      );

      setSubmitting(false);
      return;
    }

    router.push("/provider/dashboard");
    router.refresh();
  }

  if (checkingAccount || loadingCategories) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9]">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Preparing your provider profile...
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
            href="/account"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            My account
          </Link>
        </div>
      </nav>

      {/* PAGE */}

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Back to account
        </Link>

        {/* INTRO */}

        <div className="mt-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
            <Store size={25} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Provider registration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Put your business on FixNear.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Tell customers what you do, where you work,
            and how they can reach you.
          </p>
        </div>

        {/* FORM CARD */}

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.25)] sm:p-9"
        >
          {/* BUSINESS */}

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
                <Store size={17} />
              </div>

              <div>
                <h2 className="font-bold">
                  Business information
                </h2>

                <p className="text-xs text-zinc-400">
                  Tell customers what you offer.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {/* BUSINESS NAME */}

              <div>
                <label
                  htmlFor="business-name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Business or professional name
                </label>

                <input
                  id="business-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="e.g. Arun Electrical Services"
                  maxLength={100}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold"
                >
                  Service category
                </label>

                <select
                  id="category"
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                  className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                >
                  <option value="">
                    Select a service
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                >
                  About your service
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the services you provide, your experience, and what customers can expect."
                  rows={5}
                  maxLength={600}
                  className="w-full resize-none rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                />

                <div className="mt-1 text-right text-xs text-zinc-400">
                  {description.length}/600
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION */}

          <div className="mt-10 border-t border-zinc-100 pt-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
                <MapPin size={17} />
              </div>

              <div>
                <h2 className="font-bold">
                  Service location
                </h2>

                <p className="text-xs text-zinc-400">
                  Let customers know where you operate.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold"
                >
                  Area / location
                </label>

                <input
                  id="location"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="e.g. Kakkanad"
                  maxLength={100}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold"
                >
                  City
                </label>

                <input
                  id="city"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  placeholder="e.g. Kochi"
                  maxLength={80}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                />
              </div>
            </div>
          </div>

          {/* CONTACT */}

          <div className="mt-10 border-t border-zinc-100 pt-10">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
                <UserRound size={17} />
              </div>

              <div>
                <h2 className="font-bold">
                  Contact details
                </h2>

                <p className="text-xs text-zinc-400">
                  Customers will use these details to reach you.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
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
                    size={16}
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

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold"
                >
                  Contact email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="business@example.com"
                    className="w-full rounded-2xl border border-zinc-200 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VERIFICATION NOTICE */}

          <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Your profile will be reviewed
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  New provider profiles are not automatically
                  verified. Your profile will be marked as
                  unverified until FixNear verification is
                  completed.
                </p>
              </div>
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/account"
              className="flex items-center justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Creating profile...
                </>
              ) : (
                <>
                  Create provider profile
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}