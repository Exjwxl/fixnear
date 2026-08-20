import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/auth", request.url)
    );
  }

  const { id } = await context.params;

  const requestId = Number(id);

  if (!Number.isInteger(requestId)) {
    return NextResponse.redirect(
      new URL("/provider/requests", request.url)
    );
  }

  const { data: provider } = await supabase
    .from("service_providers")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!provider) {
    return NextResponse.redirect(
      new URL("/provider/dashboard", request.url)
    );
  }

  await supabase
    .from("service_requests")
    .update({
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("provider_id", provider.id)
    .eq("status", "accepted");

  return NextResponse.redirect(
    new URL("/provider/requests", request.url)
  );
}