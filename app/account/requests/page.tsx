import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type RequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

type ServiceRequest = {
  id: number;
  provider_id: number;
  title: string;
  description: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: RequestStatus;
  created_at: string;
};

type Provider = {
  id: number;
  name: string;
  city: string | null;
  location: string | null;
};

function statusLabel(status: RequestStatus) {
  switch (status) {
    case "pending":
      return "Waiting for provider";

    case "accepted":
      return "Accepted";

    case "completed":
      return "Completed";

    case "rejected":
      return "Rejected";

    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
}

function statusClass(status: RequestStatus) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "accepted":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "rejected":
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-600";
  }
}

function statusIcon(status: RequestStatus) {
  if (status === "completed") {
    return (
      <CheckCircle2
        size={18}
        className="text-emerald-600"
      />
    );
  }

  if (
    status === "rejected" ||
    status === "cancelled"
  ) {
    return (
      <XCircle
        size={18}
        className="text-red-500"
      />
    );
  }

  return (
    <Clock
      size={18}
      className={
        status === "accepted"
          ? "text-blue-600"
          : "text-amber-600"
      }
    />
  );
}

function formatDate(date: string | null) {
  if (!date) return "Not specified";

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time: string | null) {
  if (!time) return "Not specified";

  const [hours, minutes] =
    time.split(":");

  const date = new Date();

  date.setHours(
    Number(hours),
    Number(minutes)
  );

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCreatedAt(date: string) {
  return new Date(
    date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CustomerRequestsPage() {
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
            Sign in to view your service requests.
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

  const {
    data: requests,
    error: requestsError,
  } = await supabase
    .from("service_requests")
    .select(
      `
        id,
        provider_id,
        title,
        description,
        preferred_date,
        preferred_time,
        status,
        created_at
      `
    )
    .eq("customer_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (requestsError) {
    console.error(
      "Customer requests error:",
      requestsError
    );
  }

  const serviceRequests =
    (requests ?? []) as ServiceRequest[];

  const providerIds = Array.from(
    new Set(
      serviceRequests.map(
        (request) => request.provider_id
      )
    )
  );

  let providers: Provider[] = [];

  if (providerIds.length > 0) {
    const { data: providerData } =
      await supabase
        .from("service_providers")
        .select(
          "id, name, city, location"
        )
        .in("id", providerIds);

    providers =
      (providerData ?? []) as Provider[];
  }

  const providerMap = new Map(
    providers.map((provider) => [
      provider.id,
      provider,
    ])
  );

  const pendingCount =
    serviceRequests.filter(
      (request) =>
        request.status === "pending"
    ).length;

  const activeCount =
    serviceRequests.filter(
      (request) =>
        request.status === "accepted"
    ).length;

  const completedCount =
    serviceRequests.filter(
      (request) =>
        request.status === "completed"
    ).length;

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
            href="/account"
            className="text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            My account
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* BACK */}

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
            Customer workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My service requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Keep track of the services you've requested
            and see what happens next.
          </p>
        </div>

        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-3xl font-bold">
              {pendingCount}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Waiting for response
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-3xl font-bold">
              {activeCount}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Active jobs
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-3xl font-bold">
              {completedCount}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Completed
            </p>
          </div>
        </div>

        {/* REQUESTS */}

        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Your activity
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Requests
              </h2>
            </div>

            {serviceRequests.length > 0 && (
              <span className="text-xs font-medium text-zinc-400">
                {serviceRequests.length} total
              </span>
            )}
          </div>

          {serviceRequests.length === 0 ? (
            <div className="mt-5 rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100">
                <Clock
                  size={23}
                  className="text-zinc-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No service requests yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Find a local provider and send your first
                service request.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Find a provider
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {serviceRequests.map(
                (request) => {
                  const provider =
                    providerMap.get(
                      request.provider_id
                    );

                  return (
                    <div
                      key={request.id}
                      className="rounded-[2rem] border border-zinc-200 bg-white p-6 sm:p-7"
                    >
                      {/* TOP */}

                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold">
                              {request.title}
                            </h3>

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                                request.status
                              )}`}
                            >
                              {statusIcon(
                                request.status
                              )}

                              {statusLabel(
                                request.status
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-zinc-400">
                            Request #
                            {request.id} · Submitted{" "}
                            {formatCreatedAt(
                              request.created_at
                            )}
                          </p>
                        </div>

                        {provider && (
                          <Link
                            href={`/providers/${provider.id}`}
                            className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-950"
                          >
                            View provider →
                          </Link>
                        )}
                      </div>

                      {/* PROVIDER */}

                      {provider && (
                        <div className="mt-5 rounded-2xl bg-zinc-50 p-5">
                          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Provider
                          </p>

                          <p className="mt-2 text-sm font-bold">
                            {provider.name}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                            <MapPin size={14} />

                            {provider.location ||
                              "Location not specified"}

                            {provider.city
                              ? `, ${provider.city}`
                              : ""}
                          </p>
                        </div>
                      )}

                      {/* DESCRIPTION */}

                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Problem
                        </p>

                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          {request.description}
                        </p>
                      </div>

                      {/* DATE/TIME */}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-zinc-100 p-4">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <CalendarDays size={15} />

                            <span className="text-xs font-semibold uppercase tracking-wider">
                              Preferred date
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold">
                            {formatDate(
                              request.preferred_date
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-100 p-4">
                          <div className="flex items-center gap-2 text-zinc-400">
                            <Clock size={15} />

                            <span className="text-xs font-semibold uppercase tracking-wider">
                              Preferred time
                            </span>
                          </div>

                          <p className="mt-2 text-sm font-semibold">
                            {formatTime(
                              request.preferred_time
                            )}
                          </p>
                        </div>
                      </div>

                      {/* STATUS MESSAGE */}

                      <div className="mt-5 border-t border-zinc-100 pt-5">
                        {request.status ===
                          "pending" && (
                          <p className="text-sm text-zinc-500">
                            Your request has been sent.
                            The provider will review it
                            and decide whether they can
                            take the job.
                          </p>
                        )}

                        {request.status ===
                          "accepted" && (
                          <p className="text-sm text-blue-600">
                            The provider accepted your
                            request. They can now contact
                            you to arrange the service.
                          </p>
                        )}

                        {request.status ===
                          "completed" && (
                          <p className="text-sm text-emerald-600">
                            This service request has been
                            marked as completed.
                          </p>
                        )}

                        {request.status ===
                          "rejected" && (
                          <p className="text-sm text-red-600">
                            The provider was unable to
                            accept this request.
                          </p>
                        )}

                        {request.status ===
                          "cancelled" && (
                          <p className="text-sm text-red-600">
                            This request was cancelled.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}