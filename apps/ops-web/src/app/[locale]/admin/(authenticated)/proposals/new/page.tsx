import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceContext } from "@/lib/workspace";
import type { ServiceId, ServiceItem } from "@/types";
import { ProposalWizard } from "@/components/admin/ProposalWizard";
import { SERVICE_LABELS } from "@/types";

export default async function NewProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ formId?: string }>;
}) {
  const { locale } = await params;
  const { formId } = await searchParams;
  const supabase = await createClient();
  const { user, workspaceId } = await getCurrentWorkspaceContext(supabase as any);

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  if (!workspaceId) {
    redirect(`/${locale}/admin`);
  }

  let initialData = undefined as
    | {
        client_name?: string;
        client_email?: string;
        client_company?: string;
        language?: "es" | "en";
        project_name?: string;
        project_description?: string;
        estimated_weeks?: number;
        payment_terms?: string;
        notes?: string;
        service_type?: ServiceId | string;
        services?: ServiceItem[];
      }
    | undefined;

  if (formId) {
    const { data: form } = await supabase
      .from("discovery_forms")
      .select("*")
      .eq("id", formId)
      .eq("workspace_id", workspaceId)
      .single();

    const { data: submission } = await supabase
      .from("discovery_submissions")
      .select("*")
      .eq("form_id", formId)
      .maybeSingle();

    if (form) {
      const primaryService = (form.services?.[0] ?? "branding") as ServiceId;
      const serviceLabel = SERVICE_LABELS[primaryService] ?? "Discovery";
      const summary = [
        submission?.q_concrete_result
          ? `Resultado esperado: ${submission.q_concrete_result}`
          : null,
        submission?.q_differentiator
          ? `Diferenciador: ${submission.q_differentiator}`
          : null,
        submission?.q_internal_obstacle
          ? `Obstáculo interno: ${submission.q_internal_obstacle}`
          : null,
      ]
        .filter(Boolean)
        .join("\n");

      initialData = {
        client_name: form.client_name,
        language: form.language as "es" | "en",
        project_name: `${form.client_name} — ${serviceLabel}`,
        project_description: summary,
        estimated_weeks: 4,
        service_type: primaryService,
        notes: `Proposal creada desde discovery form ${form.slug}.`,
        services: [
          {
            name: serviceLabel,
            quantity: 1,
            unit_price: 0,
            total: 0,
          },
        ],
      };
    }
  }

  return <ProposalWizard locale={locale} initialData={initialData} />;
}
