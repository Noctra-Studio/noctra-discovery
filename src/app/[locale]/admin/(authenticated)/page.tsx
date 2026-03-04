import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import FormsTableClient from "@/components/admin/FormsTableClient";

export default async function AdminDashboard({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin.dashboard");
  const pParams = await searchParams;
  const page =
    typeof pParams.page === "string" ? parseInt(pParams.page, 10) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch Stats in parallel
  const [
    { count: totalForms },
    { count: pendingForms },
    { count: completedForms },
    { data: lastSubmission },
  ] = await Promise.all([
    supabase
      .from("discovery_forms")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id),
    supabase
      .from("discovery_forms")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id)
      .eq("status", "pending"),
    supabase
      .from("discovery_forms")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id)
      .eq("status", "completed"),
    supabase
      .from("discovery_submissions")
      .select("submitted_at, discovery_forms!inner(created_by)")
      .eq("discovery_forms.created_by", user.id)
      .order("submitted_at", { ascending: false })
      .limit(1),
  ]);

  const dateLocale = locale === "es" ? es : enUS;
  let lastCompletedRel = "--";

  if (
    lastSubmission &&
    lastSubmission.length > 0 &&
    lastSubmission[0].submitted_at
  ) {
    lastCompletedRel = formatDistanceToNow(
      new Date(lastSubmission[0].submitted_at as string),
      {
        addSuffix: true,
        locale: dateLocale,
      },
    );
  }

  // Fetch paginated table data
  const { data: forms, count: totalCount } = await supabase
    .from("discovery_forms")
    .select("*", { count: "exact" })
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;

  const stats = [
    { label: "Total forms", value: totalForms || 0 },
    { label: "Completados", value: completedForms || 0 },
    { label: "Pendientes", value: pendingForms || 0 },
    { label: "Último completado", value: lastCompletedRel },
  ];

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display mb-1">{t("title")}</h1>
          <p className="font-body text-gray-500">{t("subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/admin/forms/new`}
          className="bg-white text-black px-6 py-3 rounded-full font-body hover:bg-gray-200 transition-colors flex items-center gap-2 flex-shrink-0">
          <Plus size={18} />
          {t("createNew")}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-[#0E0E0E] rounded-xl border border-[#222] flex flex-col justify-center">
            <span className="font-display text-4xl mb-2 text-white">
              {stat.value}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#666]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Forms Table Wrapper */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl">Tus Formularios</h2>
        {forms && forms.length > 0 ? (
          <FormsTableClient
            forms={forms}
            locale={locale}
            totalPages={totalPages}
            currentPage={page}
          />
        ) : (
          <div className="p-10 text-center bg-[#0E0E0E] rounded-xl border border-[#222]">
            <p className="text-gray-500 font-body">
              No has creado ningún formulario aún.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
