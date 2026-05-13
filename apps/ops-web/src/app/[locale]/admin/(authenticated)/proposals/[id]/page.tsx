import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, FileSignature } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceContext } from "@/lib/workspace";
import type { Contract, Proposal, ServiceItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

function statusStyles(status: string) {
  switch (status) {
    case "accepted":
      return "bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/20";
    case "sent":
      return "bg-blue-500/10 text-blue-300 border-blue-500/20";
    case "rejected":
      return "bg-red-500/10 text-red-300 border-red-500/20";
    default:
      return "bg-[#141414] text-[#999] border-[#222]";
  }
}

export default async function ProposalDetailPage({
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

  const { data: contract } = await supabase
    .from("contracts")
    .select("*")
    .eq("proposal_id", id)
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  const proposalData = proposal as any as Proposal;
  const contractData = (contract as any as Contract | null) ?? null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-0 space-y-8">
      <div className="space-y-3">
        <Link
          href={`/${locale}/admin/proposals`}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#555] hover:text-white">
          <ArrowLeft size={14} />
          Volver a proposals
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black uppercase tracking-tight">
                {proposalData.project_name}
              </h1>
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${statusStyles(proposalData.status)}`}>
                {proposalData.status.replaceAll("_", " ")}
              </span>
            </div>
            <p className="mt-2 text-sm text-[#555]">
              {proposalData.client_name} · {proposalData.client_company || "Cliente"}
            </p>
          </div>

          {!contractData && (
            <Link
              href={`/${locale}/admin/proposals/${proposalData.id}/contract`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#00E5A0]">
              <FileSignature size={14} />
              Generar Contract
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-[#222] bg-[#141414] overflow-hidden">
            <div className="border-b border-[#222] px-6 py-4">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Servicios
              </h2>
            </div>
            <div className="divide-y divide-[#222]">
              {(proposalData.services ?? []).map((service: ServiceItem, index) => (
                <div
                  key={`${service.name}-${index}`}
                  className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <div className="font-medium text-white">{service.name}</div>
                    <div className="text-sm text-[#555]">
                      {service.quantity} x {formatCurrency(service.unit_price)}
                    </div>
                  </div>
                  <div className="text-white">{formatCurrency(service.total)}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#222] bg-[#141414] p-6 space-y-4">
            <h2 className="text-xl font-black uppercase tracking-tight">
              Contexto del proyecto
            </h2>
            {proposalData.project_description ? (
              <p className="text-sm leading-7 text-[#D6D6D0]">
                {proposalData.project_description}
              </p>
            ) : (
              <p className="text-sm text-[#555]">Sin descripción capturada.</p>
            )}
            {proposalData.notes ? (
              <div className="rounded-2xl border border-[#222] bg-[#080808] p-4 text-sm text-[#999] whitespace-pre-wrap">
                {proposalData.notes}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-[#222] bg-[#141414] p-6 space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
              Resumen financiero
            </h2>
            <div className="space-y-3 text-sm text-[#555]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(Number(proposalData.subtotal ?? 0))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>IVA</span>
                <span>{formatCurrency(Number(proposalData.iva_amount ?? 0))}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#222] pt-3 text-base font-bold text-white">
                <span>Total</span>
                <span>{formatCurrency(Number(proposalData.total ?? 0))}</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#222] bg-[#141414] p-6 space-y-4">
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
              Contract
            </h2>
            {contractData ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#222] bg-[#080808] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#555]">
                    Estado
                  </div>
                  <div className="mt-2 text-sm text-white">
                    {contractData.status ?? "draft"}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#222] bg-[#080808] p-4">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#555]">
                    Total
                  </div>
                  <div className="mt-2 text-sm text-white">
                    {formatCurrency(Number(contractData.total_price ?? 0))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#555]">
                Todavía no existe un contract para esta proposal.
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
