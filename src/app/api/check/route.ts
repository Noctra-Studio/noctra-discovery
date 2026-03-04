import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Make sure to use the service role key for admin tasks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const { data: form, error } = await supabaseAdmin
      .from("discovery_forms")
      .select("status, expires_at")
      .eq("slug", slug)
      .single();

    if (error || !form) {
      return NextResponse.json({ status: "not_found" });
    }

    if (form.expires_at && new Date(form.expires_at) < new Date()) {
      return NextResponse.json({ status: "expired" });
    }

    return NextResponse.json({ status: form.status });
  } catch (error) {
    console.error("Error checking form status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
