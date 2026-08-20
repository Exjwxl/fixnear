"use client";

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  MapPin,
  Phone,
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

type Provider = {
  id: number;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  city: string | null;
  category_id: number | null;
};

export default function EditProviderPage() {
  const router = useRouter();

  const [provider, setProvider] =
    useState<Provider | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] =
    useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    loadProvider();
  }, []);

  async function loadProvider() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth");
      return;
    }

    const { data: providerData, error: providerError } =
      await supabase
        .from("service_providers")
        .select(`
          id,
          name,
          description,
          phone,
          email,
          location,
          city,
          category_id
        `)
        .eq("owner_id", user.id)
        .maybeSingle();

    if (providerError) {
      console.error(
        "Provider loading failed:",
        providerError
      );

      setError(
        "Unable to load your provider profile."
      );

      setLoading(false);
      return;
    }

    if (!providerData) {
      router.replace("/provider/register");
      return;
    }

    const provider =
      providerData as Provider;

    setProvider(provider);

    setName(provider.name ?? "");
    setDescription(
      provider.description ?? ""
    );
    setPhone(provider.phone ?? "");
    setEmail(provider.email ?? "");
    setLocation(provider.location ?? "");
    setCity(provider.city ?? "");

    setCategoryId(
      provider.category_id
        ? String(provider.category_id)
        : ""
    );

    const { data: categoryData, error: categoryError } =
      await supabase
        .from("categories")
        .select("id, name")
        .order("name");

    if (categoryError) {
      console.error(
        "Categories loading failed:",
        categoryError
      );
    } else {
      setCategories(
        (categoryData ?? []) as Category[]
      );
    }

    setLoading(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!provider) {
      setError(
        "Provider profile could not be found."
      );
      return;
    }

    const cleanName = name.trim();
    const cleanDescription =
      description.trim();
    const cleanPhone = phone.trim();
    const cleanEmail =
      email.trim().toLowerCase();
    const cleanLocation =
      location.trim();
    const cleanCity = city.trim();

    if (!cleanName) {
      setError(
        "Please enter your business name."
      );
      return;
    }

    if (!categoryId) {
      setError(
        "Please select a service category."
      );
      return;
    }

    if (!cleanDescription) {
      setError(
        "Please describe your service."
      );
      return;
    }

    if (cleanDescription.length < 20) {
      setError(
        "Please provide a little more detail about your service."
      );
      return;
    }

    if (!cleanPhone) {
      setError(
        "Please enter a phone number."
      );
      return;
    }

    if (!cleanEmail) {
      setError(
        "Please enter a contact email."
      );
      return;
    }

    if (!cleanLocation) {
      setError(
        "Please enter your service location."
      );
      return;
    }

    if (!cleanCity) {
      setError(
        "Please enter your city."
      );
      return;
    }

    setSaving(true);

    const { error: updateError } =
      await supabase
        .from("service_providers")
        .update({
          name: cleanName,
          category_id: Number(categoryId),
          description: cleanDescription,
          phone: cleanPhone,
          email: cleanEmail,
          location: cleanLocation,
          city: cleanCity,
        })
        .eq("id", provider.id);

    if (updateError) {
      console.error(
        "Provider update failed:",
        updateError
      );

      setError(
        updateError.message ||
          "Unable to update your profile."
      );

      setSaving(false);
      return;
    }

    setSuccess(
      "Your provider profile has been updated."
    );

    setSaving(false);

    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9]">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading your provider profile...
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
            href="/provider/dashboard"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* CONTENT */}

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <Link
          href="/provider/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* INTRO */}

        <div className="mt-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
            <Store size={25} />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Provider settings
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Edit your profile
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Keep your business information accurate so
            customers know exactly what you offer.
          </p>
        </div>

        {/* FORM */}

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
                  Update what customers see.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {/* NAME */}

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
                  maxLength={100}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
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
                    setCategoryId(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                >
                  <option value="">
                    Select a service
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}
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
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={6}
                  maxLength={600}
                  className="w-full resize-none rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm leading-6 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
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
                  Where customers can find you.
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
                    setLocation(
                      event.target.value
                    )
                  }
                  maxLength={100}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
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
                  maxLength={80}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3.5 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
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
                  How customers can reach you.
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
                      setPhone(
                        event.target.value
                      )
                    }
                    maxLength={20}
                    className="w-full rounded-2xl border border-zinc-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
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
                      setEmail(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-zinc-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STATUS */}

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700">
              {success}
            </div>
          )}

          {/* ACTIONS */}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/provider/dashboard"
              className="flex items-center justify-center rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving changes...
                </>
              ) : (
                <>
                  Save changes
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