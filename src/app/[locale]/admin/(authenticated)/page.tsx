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
    { label: "TOTAL FORMS", value: totalForms || 0, color: "text-white" },
    {
      label: "COMPLETADOS",
      value: completedForms || 0,
      color: "text-[#00E5A0]",
    },
    { label: "PENDIENTES", value: pendingForms || 0, color: "text-[#555]" },
    {
      label: "ÚLTIMO COMPLETADO",
      value: lastCompletedRel,
      color: "text-white",
    },
  ];

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-display mb-1 uppercase tracking-tight">
            {t("title")}
          </h1>
          <p className="font-body text-[#555] text-sm font-light">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/forms/new`}
          className="bg-white text-black px-6 py-3 font-semibold tracking-[0.08em] uppercase text-sm hover:bg-[#00E5A0] transition-colors flex items-center gap-2 flex-shrink-0">
          <Plus size={16} />
          {t("createNew")}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 bg-[#141414] border border-[#222] flex flex-col justify-center">
            <span
              className={`font-display text-5xl leading-none mb-2 ${stat.color}`}>
              {stat.value}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#555]">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Forms Table Wrapper */}
      <div className="space-y-6">
        <h2 className="font-display text-2xl uppercase tracking-tight">
          Tus Formularios
        </h2>
        {forms && forms.length > 0 ? (
          <FormsTableClient
            forms={forms}
            locale={locale}
            totalPages={totalPages}
            currentPage={page}
          />
        ) : (
          <div className="p-20 text-center bg-[#141414] border border-[#222]">
            <div className="w-16 h-16 bg-[#080808] border border-[#222] flex items-center justify-center mx-auto mb-6">
              <Plus size={32} className="text-[#222]" />
            </div>
            <h3 className="font-display text-2xl text-[#333] mb-2 uppercase">
              Sin formularios todavía
            </h3>
            <p className="text-[#555] font-body text-sm font-light mb-8 max-w-xs mx-auto">
              Crea el primero para comenzar.
            </p>
            <Link
              href={`/${locale}/admin/forms/new`}
              className="inline-flex bg-white text-black px-8 py-3 font-semibold tracking-[0.08em] uppercase text-sm hover:bg-[#00E5A0] transition-colors">
              Crear primer formulario →
            </Link>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <Link
        href={`/${locale}/admin/forms/new`}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-white text-black flex items-center justify-center shadow-lg shadow-black/50 hover:bg-[#00E5A0] transition-colors">
        <Plus size={32} />
      </Link>
    </div>
  );
}
