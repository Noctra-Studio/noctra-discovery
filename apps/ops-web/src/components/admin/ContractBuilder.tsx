"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import type { PaymentScheduleItem, Proposal } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function ContractBuilder({
  locale,
  proposal,
}: {
  locale: string;
  proposal: Proposal;
}) {
  const router = useRouter();
  const [clientRfc, setClientRfc] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [estimatedWeeks, setEstimatedWeeks] = useState(
    proposal.delivery_weeks ?? proposal.estimated_weeks ?? 4,
  );
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [paymentTerms, setPaymentTerms] = useState(
    proposal.payment_terms ?? "Pago contra entregables según calendario acordado.",
  );
  const [payments, setPayments] = useState<PaymentScheduleItem[]>([
    {
      description: "Anticipo",
      percentage: 50,
      amount: proposal.total * 0.5,
    },
    {
      description: "Pago final",
      percentage: 50,
      amount: proposal.total * 0.5,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentTotal = useMemo(
    () => payments.reduce((acc, payment) => acc + Number(payment.amount || 0), 0),
    [payments],
  );

  const updatePayment = (
    index: number,
    field: keyof PaymentScheduleItem,
    value: string | number,
  ) => {
    setPayments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposal_id: proposal.id,
          language: proposal.language ?? "es",
          client_name: proposal.client_name,
          client_company: proposal.client_company ?? null,
          client_email: proposal.client_email,
          client_rfc: clientRfc || null,
          client_address: clientAddress || null,
          project_name: proposal.project_name,
          services: proposal.services,
          total: proposal.total,
          total_price: proposal.total,
          payment_schedule: payments,
          payment_terms: paymentTerms,
          estimated_weeks: estimatedWeeks,
          start_date: startDate,
          service_type: proposal.service_type ?? "branding",
          status: "draft",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo crear el contrato");
      }

      router.push(`/${locale}/admin/proposals/${proposal.id}`);
      router.refresh();
    } catch (submitError: any) {
      setError(submitError.message || "No se pudo crear el contrato");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-0 space-y-8">
      <div className="space-y-3">
        <Link
          href={`/${locale}/admin/proposals/${proposal.id}`}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#555] hover:text-white">
          <ArrowLeft size={14} />
          Volver a la proposal
        </Link>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">
            Generar Contract
          </h1>
          <p className="text-sm text-[#555] mt-2">
            Formaliza el acuerdo para {proposal.project_name}.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className="rounded-3xl border border-[#222] bg-[#111] p-6 space-y-5">
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
              Cliente
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={proposal.client_name}
                disabled
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-[#777]"
              />
              <input
                value={proposal.client_email}
                disabled
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-[#777]"
              />
              <input
                value={proposal.client_company ?? ""}
                disabled
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-[#777]"
              />
              <input
                value={clientRfc}
                onChange={(event) => setClientRfc(event.target.value)}
                placeholder="RFC"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>
            <textarea
              value={clientAddress}
              onChange={(event) => setClientAddress(event.target.value)}
              placeholder="Dirección fiscal"
              rows={3}
              className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
            />
          </section>

          <section className="rounded-3xl border border-[#222] bg-[#111] p-6 space-y-5">
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
              Calendario de pagos
            </h2>
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div
                  key={`${payment.description}-${index}`}
                  className="grid gap-3 rounded-2xl border border-[#222] bg-[#080808] p-4 md:grid-cols-[1.4fr_0.6fr_0.8fr_auto]">
                  <input
                    value={payment.description}
                    onChange={(event) =>
                      updatePayment(index, "description", event.target.value)
                    }
                    placeholder="Descripción"
                    className="w-full rounded-2xl border border-[#222] bg-[#111] px-4 py-3 text-white outline-none focus:border-white"
                  />
                  <input
                    type="number"
                    min={0}
                    value={payment.percentage}
                    onChange={(event) =>
                      updatePayment(index, "percentage", Number(event.target.value))
                    }
                    placeholder="%"
                    className="w-full rounded-2xl border border-[#222] bg-[#111] px-4 py-3 text-white outline-none focus:border-white"
                  />
                  <input
                    type="number"
                    min={0}
                    value={payment.amount}
                    onChange={(event) =>
                      updatePayment(index, "amount", Number(event.target.value))
                    }
                    placeholder="Monto"
                    className="w-full rounded-2xl border border-[#222] bg-[#111] px-4 py-3 text-white outline-none focus:border-white"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPayments((prev) => prev.filter((_, item) => item !== index))
                    }
                    disabled={payments.length === 1}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#222] text-[#555] hover:text-white disabled:opacity-30">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setPayments((prev) => [
                  ...prev,
                  { description: "", percentage: 0, amount: 0 },
                ])
              }
              className="inline-flex items-center gap-2 rounded-full border border-[#222] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white hover:border-[#444]">
              <Plus size={14} />
              Agregar pago
            </button>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-[#222] bg-[#111] p-6 space-y-5 sticky top-8">
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
              Resumen
            </h2>

            <div className="space-y-3 text-sm text-[#555]">
              <div className="flex items-center justify-between">
                <span>Total proposal</span>
                <span>{formatCurrency(proposal.total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total pagos</span>
                <span>{formatCurrency(paymentTotal)}</span>
              </div>
            </div>

            <div className="grid gap-3">
              <input
                type="number"
                min={1}
                value={estimatedWeeks}
                onChange={(event) => setEstimatedWeeks(Number(event.target.value))}
                placeholder="Semanas estimadas"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
              <textarea
                value={paymentTerms}
                onChange={(event) => setPaymentTerms(event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>

            {error && (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#00E5A0] disabled:opacity-50">
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
              Crear contract
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
