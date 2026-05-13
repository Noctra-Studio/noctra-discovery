import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceContext } from "@/lib/workspace";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BriefcaseBusiness, CheckCircle2, Plus, TrendingUp } from "lucide-react";
import type { Proposal } from "@/types";
import { ProposalRowActions } from "@/components/admin/ProposalRowActions";
import { formatCurrency } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-[#141414] text-[#888] border-[#222]",
    sent: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    accepted: "bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/20",
    changes_requested: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-300 border-red-500/20",
    cancelled: "bg-red-500/10 text-red-300 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${styles[status] || styles.draft}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default async function ProposalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { user, workspaceId } = await getCurrentWorkspaceContext(supabase as any);

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  if (!workspaceId) {
    redirect(`/${locale}/admin`);
  }

  const { data } = await supabase
    .from("proposals")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  const proposals = ((data as any[]) ?? []) as Proposal[];
  const acceptedCount = proposals.filter((proposal) => proposal.status === "accepted").length;
  const totalValue = proposals.reduce(
    (acc, proposal) => acc + Number(proposal.total ?? 0),
    0,
  );

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-0 lg:py-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">
            Proposals
          </h1>
          <p className="mt-2 text-sm text-[#555]">
            Gestiona propuestas comerciales dentro del mismo panel operativo.
          </p>
        </div>
        <Link
          href={`/${locale}/admin/proposals/new`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#00E5A0]">
          <Plus size={14} />
          Nueva Proposal
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#222] bg-[#141414] p-6">
          <div className="text-[48px] font-black leading-none text-white">
            {proposals.length}
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#555]">
            Total Proposals
          </div>
        </div>
        <div className="rounded-3xl border border-[#222] bg-[#141414] p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#00E5A0]" />
            <div className="text-[48px] font-black leading-none text-[#00E5A0]">
              {acceptedCount}
            </div>
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#555]">
            Aceptadas
          </div>
        </div>
        <div className="rounded-3xl border border-[#222] bg-[#141414] p-6">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-white" />
            <div className="text-[36px] font-black leading-none text-white">
              {formatCurrency(totalValue)}
            </div>
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#555]">
            Valor acumulado
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#222] bg-[#141414]">
        <div className="border-b border-[#222] px-6 py-4">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Pipeline comercial
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#222] text-[10px] uppercase tracking-[0.18em] text-[#555]">
              <tr>
                <th className="px-6 py-4 font-medium">Proyecto</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#555]">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <BriefcaseBusiness className="text-[#333]" size={28} />
                      <p>No hay proposals todavía en este workspace.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                proposals.map((proposal) => (
                  <tr key={proposal.id} className="group hover:bg-[#111]">
                    <td className="px-6 py-4 font-medium text-white">
                      {proposal.project_name}
                    </td>
                    <td className="px-6 py-4 text-[#999]">
                      {proposal.client_name}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatCurrency(Number(proposal.total ?? 0))}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={proposal.status} />
                    </td>
                    <td className="px-6 py-4 text-[#777]">
                      {proposal.created_at
                        ? format(new Date(proposal.created_at), "dd MMM, yyyy", {
                            locale: es,
                          })
                        : "--"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProposalRowActions locale={locale} proposalId={proposal.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
