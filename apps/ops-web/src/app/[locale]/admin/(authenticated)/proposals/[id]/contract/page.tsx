import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceContext } from "@/lib/workspace";
import type { Proposal } from "@/types";
import { ContractBuilder } from "@/components/admin/ContractBuilder";

export default async function ProposalContractPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const { user, workspaceId } = await getCurrentWorkspaceContext(supabase as any);

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  if (!workspaceId) {
    redirect(`/${locale}/admin`);
  }

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .eq("workspace_id", workspaceId)
    .single();

  if (!proposal) {
    notFound();
  }

  const { data: existingContract } = await supabase
    .from("contracts")
    .select("id")
    .eq("proposal_id", id)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (existingContract) {
    redirect(`/${locale}/admin/proposals/${id}`);
  }

  return <ContractBuilder locale={locale} proposal={proposal as any as Proposal} />;
}
