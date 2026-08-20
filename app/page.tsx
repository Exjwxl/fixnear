import {
  ArrowRight,
  BadgeCheck,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ProviderBrowser from "@/components/ProviderBrowser";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-zinc-950">
      {/* NAVBAR */}
      <nav className="border-b border-zinc-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white">
              <Sparkles size={18} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              FixNear
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#services"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Services
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              How it works
            </a>

            <a
              href="#providers"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Find a provider
            </a>
          </div>

          <button className="hidden rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 sm:block">
            Join as a provider
          </button>

          <button className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium sm:hidden">
            Menu
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200/70 bg-white">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Trusted local services, made simple
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Find the right
              <span className="block text-zinc-400">
                person for the job.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
              Discover reliable electricians, plumbers, mechanics, tutors
              and other local professionals — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* REAL SEARCH + PROVIDERS */}
      <ProviderBrowser />

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Simple by design
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Get help in three steps.
          </h2>

          <p className="mt-4 text-sm leading-6 text-zinc-500">
            No endless searching. No guessing. Just find the right
            professional and get the job done.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Tell us what you need",
              description:
                "Search for a service and choose your location.",
              icon: Search,
            },
            {
              number: "02",
              title: "Compare professionals",
              description:
                "Check profiles, ratings, reviews and verification.",
              icon: ShieldCheck,
            },
            {
              number: "03",
              title: "Get the job done",
              description:
                "Contact the professional and get the help you need.",
              icon: BadgeCheck,
            },
          ].map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-3xl border border-zinc-200 bg-white p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                    <Icon size={21} />
                  </div>

                  <span className="text-sm font-bold text-zinc-200">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROVIDER CTA */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-zinc-950 px-7 py-14 text-white sm:px-12 lg:px-16 lg:py-16">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                For professionals
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Grow your local business with FixNear.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Create your professional profile, showcase your work and
                connect with people who are looking for your services.
              </p>
            </div>

            <button className="flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-200">
              Become a provider
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-white">
              <Sparkles size={15} />
            </div>

            <span className="font-bold">FixNear</span>
          </div>

          <p className="text-xs text-zinc-400">
            Find trusted local services, without the hassle.
          </p>

          <p className="text-xs text-zinc-400">
            © 2026 FixNear
          </p>
        </div>
      </footer>
    </main>
  );
}