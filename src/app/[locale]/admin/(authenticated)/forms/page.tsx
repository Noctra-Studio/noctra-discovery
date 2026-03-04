import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import FormsClient from "./FormsClient";

export const metadata = {
  title: "Formularios | Noctra Discovery",
};

export default async function FormsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  const t = await getTranslations("forms");

  const currentPage = parseInt(page || "1");
  const pageSize = 15;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();

  // 1. Fetch forms with their submission status
  const {
    data: forms,
    count,
    error,
  } = await supabase
    .from("discovery_forms")
    .select(
      `
      *,
      submission:discovery_submissions(id, submitted_at)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching forms:", error);
  }

  // 2. Calculate summary stats
  // We need the total count of completed forms across all pages
  const { count: completedCount } = await supabase
    .from("discovery_submissions")
    .select("*", { count: "exact", head: true });

  const totalForms = count || 0;

  return (
    <div className="p-6 md:p-14">
      <FormsClient
        initialForms={forms || []}
        totalCount={totalForms}
        completedCount={completedCount || 0}
        pageSize={pageSize}
        currentPage={currentPage}
        locale={locale}
        dict={{
          title: t("title"),
          eyebrow: t("eyebrow"),
          subtitle: t("subtitle"),
          newForm: t("newForm"),
          search: t("search"),
          filterAll: t("filterAll"),
          filterPending: t("filterPending"),
          filterCompleted: t("filterCompleted"),
          filterService: t("filterService"),
          sortNewest: t("sortNewest"),
          sortOldest: t("sortOldest"),
          sortAZ: t("sortAZ"),
          sortCompleted: t("sortCompleted"),
          colClient: t("colClient"),
          colServices: t("colServices"),
          colLanguage: t("colLanguage"),
          colStatus: t("colStatus"),
          colCreated: t("colCreated"),
          colActions: t("colActions"),
          statusCompleted: t("statusCompleted"),
          statusPending: t("statusPending"),
          statusExpired: t("statusExpired"),
          copyUrl: t("copyUrl"),
          urlCopied: t("urlCopied"),
          viewDetail: t("viewDetail"),
          delete: t("delete"),
          emptyTitle: t("emptyTitle"),
          emptyDesc: t("emptyDesc"),
          emptyFilter: t("emptyFilter"),
          clearFilters: t("clearFilters"),
          showing: t("showing"),
          deleteModal: {
            title: t("deleteModal.title"),
            desc: t("deleteModal.desc"),
            cancel: t("deleteModal.cancel"),
            confirm: t("deleteModal.confirm"),
          },
        }}
      />
    </div>
  );
}
