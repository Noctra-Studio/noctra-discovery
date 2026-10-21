import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types";

const PUBLIC_FORM_COLUMNS =
  "id, slug, client_name, client_logo_url, directed_to, language, services, status, expires_at" as const;

export type PublicDiscoveryForm = Pick<
  Database["public"]["Tables"]["discovery_forms"]["Row"],
  | "id"
  | "slug"
  | "client_name"
  | "client_logo_url"
  | "directed_to"
  | "language"
  | "services"
  | "status"
  | "expires_at"
>;

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

export async function getPublicFormBySlug(
  slug: string,
): Promise<PublicDiscoveryForm | null> {
  const { data, error } = await supabaseAdmin
    .from("discovery_forms")
    .select(PUBLIC_FORM_COLUMNS)
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[getPublicFormBySlug]", error.message);
    }
    return null;
  }

  return data;
}
