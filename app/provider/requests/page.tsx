import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  UserRound,
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
  customer_id: string;
  provider_id: number;
  title: string;
  description: string;
  preferred_date: string | null;
  preferred_time: string | null;
  customer_phone: string | null;
  status: RequestStatus;
  created_at: string;
};

function formatDate(date: string | null) {
  if (!date) return "Not specified";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(time: string | null) {
  if (!time) return "Not specified";

  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function statusLabel(status: RequestStatus) {
  switch (status) {
    case "pending":
      return "New request";

    case "accepted":
      return "Accepted";

    case "rejected":
      return "Rejected";

    case "completed":
      return "Completed";

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

export default async function ProviderRequestsPage() {
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
            Sign in to access your requests.
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

  const { data: provider } = await supabase
    .from("service_providers")
    .select("id, name")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!provider) {
    return (
      <main className="min-h-screen bg-[#fafaf9] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-zinc-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold">
            No provider profile
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Create your provider profile before managing
            service requests.
          </p>

          <Link
            href="/provider/register"
            className="mt-6 inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white"
          >
            Become a provider
          </Link>
        </div>
      </main>
    );
  }

  const {
    data: requests,
    error,
  } = await supabase
    .from("service_requests")
    .select(
      `
        id,
        customer_id,
        provider_id,
        title,
        description,
        preferred_date,
        preferred_time,
        customer_phone,
        status,
        created_at
      `
    )
    .eq("provider_id", provider.id)
    .order("created_at", {
      ascending: false,
    });

  const serviceRequests =
    (requests ?? []) as ServiceRequest[];

  const pendingRequests =
    serviceRequests.filter(
      (request) =>
        request.status === "pending"
    );

  const activeRequests =
    serviceRequests.filter(
      (request) =>
        request.status === "accepted"
    );

  const completedRequests =
    serviceRequests.filter(
      (request) =>
        request.status === "completed"
    );

  const previousRequests =
    serviceRequests.filter(
      (request) =>
        request.status === "rejected" ||
        request.status === "cancelled"
    );

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

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* BACK */}

        <Link
          href="/provider/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* HEADER */}

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Provider workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Service requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Review customer requests, respond to new jobs,
            and keep track of completed work.
          </p>
        </div>

        {/* STATS */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-3xl font-bold">
              {pendingRequests.length}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              New requests
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-3xl font-bold">
              {activeRequests.length}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Active jobs
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6">
            <p className="text-3xl font-bold">
              {completedRequests.length}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Completed jobs
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Unable to load your service requests.
          </div>
        )}

        {/* NEW REQUESTS */}

        <section className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Needs attention
              </p>

              <h2 className="mt-1 text-xl font-bold">
                New requests
              </h2>
            </div>

            {pendingRequests.length > 0 && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                {pendingRequests.length} waiting
              </span>
            )}
          </div>

          <div className="mt-5">
            {pendingRequests.length === 0 ? (
              <EmptyState
                icon="check"
                title="You're all caught up."
                description="New customer requests will appear here."
              />
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ACTIVE */}

        <section className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            In progress
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Active jobs
          </h2>

          <div className="mt-5">
            {activeRequests.length === 0 ? (
              <EmptyState
                icon="clock"
                title="No active jobs."
                description="Accepted service requests will appear here."
              />
            ) : (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* COMPLETED */}

        <section className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            History
          </p>

          <h2 className="mt-1 text-xl font-bold">
            Completed jobs
          </h2>

          <div className="mt-5">
            {completedRequests.length === 0 ? (
              <EmptyState
                icon="check"
                title="No completed jobs yet."
                description="Completed work will appear here."
              />
            ) : (
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PREVIOUS */}

        {previousRequests.length > 0 && (
          <section className="mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Previous
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Rejected or cancelled
            </h2>

            <div className="mt-5 space-y-4">
              {previousRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function RequestCard({
  request,
}: {
  request: ServiceRequest;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white">
      <div className="p-6 sm:p-7">
        {/* TOP */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold">
                {request.title}
              </h3>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                  request.status
                )}`}
              >
                {statusLabel(request.status)}
              </span>
            </div>

            <p className="mt-1 text-xs text-zinc-400">
              Request #{request.id}
            </p>
          </div>

          <p className="text-xs text-zinc-400">
            {new Date(
              request.created_at
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        {/* CUSTOMER */}

        <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                <UserRound
                  size={19}
                  className="text-zinc-500"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Customer
                </p>

                <p className="mt-1 text-sm font-semibold">
                  Customer #
                  {request.customer_id.slice(0, 8)}
                </p>
              </div>
            </div>

            {request.customer_phone && (
              <a
                href={`tel:${request.customer_phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <Phone size={15} />
                Call customer
              </a>
            )}
          </div>
        </div>

        {/* PROBLEM */}

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Problem description
          </p>

          <div className="mt-2 rounded-2xl border border-zinc-100 bg-white p-5">
            <p className="text-sm leading-7 text-zinc-600">
              {request.description}
            </p>
          </div>
        </div>

        {/* DETAILS */}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
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

          <div className="rounded-2xl border border-zinc-100 p-4">
            <div className="flex items-center gap-2 text-zinc-400">
              <Phone size={15} />

              <span className="text-xs font-semibold uppercase tracking-wider">
                Customer phone
              </span>
            </div>

            <p className="mt-2 text-sm font-semibold">
              {request.customer_phone ||
                "Not provided"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}

        {request.status === "pending" && (
          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row">
            <form
              action={`/api/provider/requests/${request.id}/accept`}
              method="POST"
              className="flex-1"
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <CheckCircle2 size={17} />
                Accept request
              </button>
            </form>

            <form
              action={`/api/provider/requests/${request.id}/reject`}
              method="POST"
              className="flex-1"
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              >
                <XCircle size={17} />
                Reject request
              </button>
            </form>
          </div>
        )}

        {request.status === "accepted" && (
          <div className="mt-6 border-t border-zinc-100 pt-5">
            <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-800">
                Job accepted
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-600">
                Contact the customer and arrange the service
                using their preferred date and time.
              </p>
            </div>

            <form
              action={`/api/provider/requests/${request.id}/complete`}
              method="POST"
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={17} />
                Mark job as completed
              </button>
            </form>
          </div>
        )}

        {request.status === "completed" && (
          <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2
                size={18}
                className="text-emerald-600"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Service completed
              </p>

              <p className="mt-0.5 text-xs text-zinc-400">
                This job has been successfully completed.
              </p>
            </div>
          </div>
        )}

        {request.status === "rejected" && (
          <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
              <XCircle
                size={18}
                className="text-red-500"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-red-600">
                Request rejected
              </p>

              <p className="mt-0.5 text-xs text-zinc-400">
                This request was not accepted.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: "check" | "clock";
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
        {icon === "check" ? (
          <CheckCircle2
            size={22}
            className="text-zinc-500"
          />
        ) : (
          <Clock
            size={22}
            className="text-zinc-500"
          />
        )}
      </div>

      <h3 className="mt-4 text-base font-bold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-zinc-500">
        {description}
      </p>
    </div>
  );
}