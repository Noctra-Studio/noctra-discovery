import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspaceContext } from "@/lib/workspace";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, FileSignature, TrendingUp } from "lucide-react";
import type { Contract } from "@/types";
import { ContractRowActions } from "@/components/admin/ContractRowActions";
import { formatCurrency } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-[#141414] text-[#888] border-[#222]",
    sent: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    signed: "bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/20",
    cancelled: "bg-red-500/10 text-red-300 border-red-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${styles[status] || styles.draft}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}

export default async function ContractsPage({
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
    .from("contracts")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  const contracts = ((data as any[]) ?? []) as Contract[];
  const signedCount = contracts.filter((contract) => contract.status === "signed").length;
  const totalValue = contracts.reduce(
    (acc, contract) => acc + Number(contract.total_price ?? 0),
    0,
  );

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-0 lg:py-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight">
          Contracts
        </h1>
        <p className="mt-2 text-sm text-[#555]">
          Da seguimiento a los acuerdos ya formalizados dentro del mismo workspace.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-[#222] bg-[#141414] p-6">
          <div className="text-[48px] font-black leading-none text-white">
            {contracts.length}
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#555]">
            Total Contracts
          </div>
        </div>
        <div className="rounded-3xl border border-[#222] bg-[#141414] p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-[#00E5A0]" />
            <div className="text-[48px] font-black leading-none text-[#00E5A0]">
              {signedCount}
            </div>
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#555]">
            Firmados
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
            Valor contractual
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#222] bg-[#141414]">
        <div className="border-b border-[#222] px-6 py-4">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Contratos emitidos
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
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#555]">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <FileSignature className="text-[#333]" size={28} />
                      <p>No hay contracts todavía en este workspace.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id} className="group hover:bg-[#111]">
                    <td className="px-6 py-4 font-medium text-white">
                      {contract.project_name ?? "--"}
                    </td>
                    <td className="px-6 py-4 text-[#999]">
                      {contract.client_name}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {formatCurrency(Number(contract.total_price ?? 0))}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={contract.status ?? "draft"} />
                    </td>
                    <td className="px-6 py-4 text-[#777]">
                      {contract.created_at
                        ? format(new Date(contract.created_at), "dd MMM, yyyy", {
                            locale: es,
                          })
                        : "--"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ContractRowActions
                        locale={locale}
                        proposalId={contract.proposal_id}
                      />
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
