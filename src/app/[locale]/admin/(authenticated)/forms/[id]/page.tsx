import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ClientFormDetail from "@/components/admin/ClientFormDetail";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/admin/login`);

  // Fetch form
  const { data: form, error: formError } = await supabase
    .from("discovery_forms")
    .select("*")
    .eq("id", id)
    .single();

  if (formError || !form) notFound();
  if (form.created_by !== user.id) redirect(`/${locale}/admin`);

  // If completed, fetch submission
  let submission = null;
  if (form.status === "completed") {
    const { data } = await supabase
      .from("discovery_submissions")
      .select("*")
      .eq("form_id", id)
      .single();
    submission = data;
  }

  return (
    <ClientFormDetail form={form} submission={submission} locale={locale} />
  );
}
