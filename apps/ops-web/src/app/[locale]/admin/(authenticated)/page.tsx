import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import FormsTableClient from "@/components/admin/FormsTableClient";

function getRelativeTime(date: Date): { short: string; exact: string } {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let short: string;
  if (diffMins < 60) short = `Hace ${diffMins}min`;
  else if (diffHours < 24) short = `Hace ${diffHours}h`;
  else if (diffDays < 7) short = `Hace ${diffDays}d`;
  else
    short = date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
    });

  const exact = date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return { short, exact };
}

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

  let lastCompletedShort = "--";
  let lastCompletedExact = "";

  if (
    lastSubmission &&
    lastSubmission.length > 0 &&
    lastSubmission[0].submitted_at
  ) {
    const rel = getRelativeTime(
      new Date(lastSubmission[0].submitted_at as string),
    );
    lastCompletedShort = rel.short;
    lastCompletedExact = rel.exact;
  }

  // Fetch paginated table data
  const { data: forms, count: totalCount } = await supabase
    .from("discovery_forms")
    .select("*", { count: "exact" })
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-0 lg:py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-1 uppercase tracking-tight">
            {t("title")}
          </h1>
          <p className="text-[#555] text-sm font-normal">{t("subtitle")}</p>
        </div>
        <Link
          href={`/${locale}/admin/forms/new`}
          className="bg-white text-black px-6 py-3 rounded-full font-medium text-[10px] tracking-[0.18em] uppercase hover:bg-[#00E5A0] transition-colors flex items-center justify-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <Plus size={14} />
          {t("createNew")}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-10 px-0">
        {/* TOTAL */}
        <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-[100px] md:min-h-[130px]">
          <div className="text-[48px] md:text-[56px] font-black leading-none text-white">
            {totalForms || 0}
          </div>
          <div className="font-medium text-[10px] tracking-[0.18em] text-[#555] uppercase mt-2">
            {t("statsTotal")}
          </div>
        </div>

        {/* COMPLETADOS */}
        <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-[100px] md:min-h-[130px]">
          <div className="text-[48px] md:text-[56px] font-black leading-none text-[#00E5A0]">
            {completedForms || 0}
          </div>
          <div className="font-medium text-[10px] tracking-[0.18em] text-[#555] uppercase mt-2">
            {t("statsCompleted")}
          </div>
        </div>

        {/* PENDIENTES */}
        <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-[100px] md:min-h-[130px]">
          <div className="text-[48px] md:text-[56px] font-black leading-none text-[#333]">
            {pendingForms || 0}
          </div>
          <div className="font-medium text-[10px] tracking-[0.18em] text-[#555] uppercase mt-2">
            {t("statsPending")}
          </div>
        </div>

        {/* ÚLTIMO COMPLETADO */}
        <div className="bg-[#141414] border border-[#222] rounded-2xl p-5 md:p-6 flex flex-col justify-between min-h-[100px] md:min-h-[130px]">
          <div>
            <div className="text-[40px] md:text-[48px] font-black leading-none text-white">
              {lastCompletedShort}
            </div>
            {lastCompletedExact && (
              <div className="font-medium text-[9px] text-[#555] tracking-[0.1em] mt-1">
                {lastCompletedExact}
              </div>
            )}
          </div>
          <div className="font-medium text-[10px] tracking-[0.18em] text-[#555] uppercase mt-3">
            Último completado
          </div>
        </div>
      </div>

      {/* Forms Table Wrapper */}
      <div className="mt-8 md:mt-10 space-y-4">
        <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
          {t("tableTitle")}
        </h2>
        {forms && forms.length > 0 ? (
          <FormsTableClient
            forms={forms}
            locale={locale}
            totalPages={totalPages}
            currentPage={page}
          />
        ) : (
          <div className="p-20 text-center bg-[#141414] border border-[#222] rounded-2xl">
            <div className="w-16 h-16 bg-[#080808] border border-[#222] rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={32} className="text-[#222]" />
            </div>
            <h3 className="text-2xl font-black text-[#333] mb-2 uppercase">
              Sin formularios todavía
            </h3>
            <p className="text-[#555] text-sm font-normal mb-8 max-w-xs mx-auto">
              Crea el primero para comenzar.
            </p>
            <Link
              href={`/${locale}/admin/forms/new`}
              className="inline-flex bg-white text-black px-8 py-3 rounded-full font-medium text-[10px] tracking-[0.18em] uppercase hover:bg-[#00E5A0] transition-colors">
              Crear primer formulario →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
