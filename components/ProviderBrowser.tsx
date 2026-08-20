"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Droplets,
  Hammer,
  Loader2,
  MapPin,
  Paintbrush,
  Search,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

const categories = [
  {
    name: "Electricians",
    icon: Zap,
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    name: "Plumbers",
    icon: Droplets,
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Mechanics",
    icon: Wrench,
    color: "bg-orange-50 text-orange-600",
  },
  {
    name: "Tutors",
    icon: BookOpen,
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "AC Repair",
    icon: Sparkles,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "Carpenters",
    icon: Hammer,
    color: "bg-amber-50 text-amber-700",
  },
  {
    name: "Cleaning",
    icon: Sparkles,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Painters",
    icon: Paintbrush,
    color: "bg-pink-50 text-pink-600",
  },
];

type Provider = {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  city: string | null;
  rating: number | null;
  review_count: number | null;
  verified: boolean | null;
  image_url: string | null;
  categories:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

export default function ProviderBrowser() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Kochi");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);

      const { data, error } = await supabase
        .from("service_providers")
        .select(`
          id,
          name,
          description,
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
        .order("rating", { ascending: false });

      if (error) {
        console.error("Failed to load providers:", error);
        setProviders([]);
      } else {
        setProviders((data ?? []) as Provider[]);
      }

      setLoading(false);
    }

    loadProviders();
  }, []);

  function getCategoryName(provider: Provider) {
    if (!provider.categories) {
      return "";
    }

    if (Array.isArray(provider.categories)) {
      return provider.categories[0]?.name ?? "";
    }

    return provider.categories.name ?? "";
  }

  const filteredProviders = providers.filter((provider) => {
    const categoryName = getCategoryName(provider);
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      provider.name.toLowerCase().includes(searchTerm) ||
      provider.description?.toLowerCase().includes(searchTerm) ||
      provider.location?.toLowerCase().includes(searchTerm) ||
      provider.city?.toLowerCase().includes(searchTerm) ||
      categoryName.toLowerCase().includes(searchTerm);

    const matchesLocation =
      location === "All locations" ||
      provider.city?.toLowerCase() === location.toLowerCase();

    const matchesCategory =
      selectedCategory === "" ||
      categoryName.toLowerCase() === selectedCategory.toLowerCase();

    return (
      matchesSearch &&
      matchesLocation &&
      matchesCategory
    );
  });

  function handleCategory(category: string) {
    setSelectedCategory((current) =>
      current === category ? "" : category
    );

    setTimeout(() => {
      document.getElementById("providers")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }

  function handleSearch() {
    document.getElementById("providers")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function resetFilters() {
    setSearch("");
    setLocation("Kochi");
    setSelectedCategory("");
  }

  return (
    <>
      {/* SEARCH */}
      <section className="border-b border-zinc-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="rounded-3xl border border-zinc-200 bg-white p-2 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.15)] sm:flex">
            <div className="flex flex-1 items-center gap-3 px-4 py-3">
              <Search
                className="shrink-0 text-zinc-400"
                size={21}
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch();
                  }
                }}
                placeholder="Search electricians, plumbers, tutors..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400 sm:text-base"
              />
            </div>

            <div className="hidden w-px bg-zinc-200 sm:block" />

            <div className="flex items-center gap-3 border-t border-zinc-100 px-4 py-3 sm:w-52 sm:border-t-0">
              <MapPin
                className="shrink-0 text-zinc-400"
                size={20}
              />

              <select
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                className="w-full bg-transparent text-sm font-medium outline-none sm:text-base"
              >
                <option value="Kochi">Kochi</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Thrissur">Thrissur</option>
                <option value="Kottayam">Kottayam</option>
                <option value="Trivandrum">Trivandrum</option>
                <option value="All locations">
                  All locations
                </option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:mt-0 sm:w-auto"
            >
              Search
              <ArrowRight size={17} />
            </button>
          </div>

          {(search ||
            selectedCategory ||
            location !== "Kochi") && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {search && (
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
                  Search: {search}
                </span>
              )}

              {selectedCategory && (
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
                  Category: {selectedCategory}
                </span>
              )}

              {location !== "Kochi" && (
                <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700">
                  Location: {location}
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-zinc-500 underline underline-offset-4 transition hover:text-zinc-950"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        id="services"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Explore services
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What do you need help with?
            </h2>
          </div>

          <p className="text-sm text-zinc-400">
            Select a category to filter providers
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const active =
              selectedCategory === category.name;

            return (
              <button
                key={category.name}
                onClick={() =>
                  handleCategory(category.name)
                }
                className={`group rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  active
                    ? "border-zinc-950 bg-zinc-950 text-white shadow-lg"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    active
                      ? "bg-white/10 text-white"
                      : category.color
                  }`}
                >
                  <Icon size={20} />
                </div>

                <p
                  className={`mt-4 text-sm font-semibold ${
                    active
                      ? "text-white"
                      : "text-zinc-800"
                  }`}
                >
                  {category.name}
                </p>

                <ArrowRight
                  size={15}
                  className={`mt-3 transition group-hover:translate-x-1 ${
                    active
                      ? "text-zinc-400"
                      : "text-zinc-300 group-hover:text-zinc-700"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* RESULTS */}
      <section
        id="providers"
        className="border-y border-zinc-200/70 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Search results
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Professionals near you
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {loading
                ? "Finding professionals..."
                : `${filteredProviders.length} professional${
                    filteredProviders.length === 1
                      ? ""
                      : "s"
                  } found`}
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Finding local professionals...
              </div>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-zinc-300 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                <Search
                  className="text-zinc-400"
                  size={25}
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No professionals found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Try a different service, location or search term.
              </p>

              <button
                onClick={resetFilters}
                className="mt-6 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProviders.map((provider) => {
                const categoryName =
                  getCategoryName(provider);

                const initials = provider.name
                  .split(" ")
                  .map((word: string) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <article
                    key={provider.id}
                    className="group overflow-hidden rounded-3xl border border-zinc-200 bg-[#fafaf9] transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl"
                  >
                    <Link
                      href={`/providers/${provider.id}`}
                      className="block"
                    >
                      <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                        {provider.image_url ? (
                          <img
                            src={provider.image_url}
                            alt={provider.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-xl font-bold text-zinc-700 shadow-sm">
                            {initials}
                          </div>
                        )}

                        {provider.verified && (
                          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-600 shadow-sm">
                            <BadgeCheck size={14} />
                            Verified
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                          {categoryName || "Local service"}
                        </p>

                        <h3 className="mt-1 text-lg font-bold tracking-tight text-zinc-950">
                          {provider.name}
                        </h3>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500">
                          {provider.description}
                        </p>

                        <div className="mt-4 flex items-center gap-1.5 text-sm text-zinc-500">
                          <MapPin size={15} />

                          <span>
                            {provider.location}
                            {provider.city
                              ? `, ${provider.city}`
                              : ""}
                          </span>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
                          <div className="flex items-center gap-1.5">
                            <Star
                              size={16}
                              fill="currentColor"
                              className="text-amber-400"
                            />

                            <span className="text-sm font-bold text-zinc-950">
                              {provider.rating?.toFixed(1) ??
                                "New"}
                            </span>

                            <span className="text-xs text-zinc-400">
                              ({provider.review_count ?? 0})
                            </span>
                          </div>

                          <span
                            aria-hidden="true"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-white transition group-hover:scale-105"
                          >
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function getCategoryName(provider: Provider) {
  if (!provider.categories) {
    return "";
  }

  if (Array.isArray(provider.categories)) {
    return provider.categories[0]?.name ?? "";
  }

  return provider.categories.name ?? "";
}