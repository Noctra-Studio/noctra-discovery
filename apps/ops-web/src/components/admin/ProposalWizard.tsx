"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { DiscountType, ServiceId, ServiceItem } from "@/types";
import { SERVICE_LABELS } from "@/types";
import { formatCurrency, generateSlug } from "@/lib/utils";

interface ProposalWizardProps {
  locale: string;
  initialData?: {
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
  };
}

const EMPTY_SERVICE: ServiceItem = {
  name: "",
  quantity: 1,
  unit_price: 0,
  total: 0,
};

export function ProposalWizard({
  locale,
  initialData,
}: ProposalWizardProps) {
  const router = useRouter();
  const [clientName, setClientName] = useState(initialData?.client_name ?? "");
  const [clientEmail, setClientEmail] = useState(
    initialData?.client_email ?? "",
  );
  const [clientCompany, setClientCompany] = useState(
    initialData?.client_company ?? "",
  );
  const [clientPhone, setClientPhone] = useState("");
  const [language, setLanguage] = useState(initialData?.language ?? "es");
  const [projectName, setProjectName] = useState(
    initialData?.project_name ?? "",
  );
  const [projectDescription, setProjectDescription] = useState(
    initialData?.project_description ?? "",
  );
  const [estimatedWeeks, setEstimatedWeeks] = useState(
    initialData?.estimated_weeks ?? 4,
  );
  const [paymentTerms, setPaymentTerms] = useState(
    initialData?.payment_terms ??
      "50% de anticipo para iniciar el proyecto, 50% restante al entregar el proyecto terminado.",
  );
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [serviceType, setServiceType] = useState(
    initialData?.service_type ?? "branding",
  );
  const [discountType, setDiscountType] = useState<DiscountType | "none">(
    "none",
  );
  const [discountValue, setDiscountValue] = useState(0);
  const [applyIva, setApplyIva] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>(
    initialData?.services?.length ? initialData.services : [EMPTY_SERVICE],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const subtotal = services.reduce((acc, service) => acc + service.total, 0);
    let subtotalAfterDiscount = subtotal;

    if (discountType === "percentage") {
      subtotalAfterDiscount =
        subtotal - subtotal * Math.max(0, discountValue) / 100;
    } else if (discountType === "fixed") {
      subtotalAfterDiscount = Math.max(0, subtotal - Math.max(0, discountValue));
    }

    const discountAmount = subtotal - subtotalAfterDiscount;
    const ivaAmount = applyIva ? subtotalAfterDiscount * 0.16 : 0;
    const total = subtotalAfterDiscount + ivaAmount;

    return { subtotal, subtotalAfterDiscount, discountAmount, ivaAmount, total };
  }, [applyIva, discountType, discountValue, services]);

  const updateService = (
    index: number,
    field: keyof ServiceItem,
    value: string | number,
  ) => {
    setServices((prev) => {
      const next = [...prev];
      const current = { ...next[index], [field]: value };
      current.total = Number(current.quantity) * Number(current.unit_price);
      next[index] = current;
      return next;
    });
  };

  const handleSubmit = async (status: "draft" | "sent" = "draft") => {
    setError(null);

    if (!clientName || !clientEmail || !projectName) {
      setError("Cliente, email y nombre del proyecto son requeridos.");
      return;
    }

    const cleanedServices = services.filter((service) => service.name.trim());
    if (!cleanedServices.length) {
      setError("Agrega al menos un servicio.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        slug: generateSlug(projectName),
        status,
        language,
        client_name: clientName,
        client_email: clientEmail,
        client_company: clientCompany || null,
        client_phone: clientPhone || null,
        project_name: projectName,
        project_description: projectDescription || null,
        title: projectName,
        service_type: serviceType,
        services: cleanedServices,
        subtotal: totals.subtotal,
        discount_type: discountType === "none" ? null : discountType,
        discount_value: discountValue,
        discount_amount: totals.discountAmount,
        subtotal_after_discount: totals.subtotalAfterDiscount,
        iva_percentage: applyIva ? 16 : 0,
        iva_amount: totals.ivaAmount,
        total: totals.total,
        total_price: totals.total,
        payment_terms: paymentTerms,
        delivery_weeks: estimatedWeeks,
        estimated_weeks: estimatedWeeks,
        valid_until: new Date(
          Date.now() + 15 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        notes: notes || null,
      };

      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "No se pudo crear la propuesta");
      }

      const proposal = await response.json();
      router.push(`/${locale}/admin/proposals/${proposal.id}`);
      router.refresh();
    } catch (submitError: any) {
      setError(submitError.message || "No se pudo crear la propuesta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-0 space-y-8">
      <div className="space-y-3">
        <Link
          href={`/${locale}/admin/proposals`}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#555] hover:text-white">
          <ArrowLeft size={14} />
          Volver a proposals
        </Link>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight">
            Nueva Proposal
          </h1>
          <p className="text-sm text-[#555] mt-2">
            Crea una propuesta comercial sin salir del flujo operativo.
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
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                placeholder="Nombre del cliente"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
              <input
                value={clientEmail}
                onChange={(event) => setClientEmail(event.target.value)}
                placeholder="Email"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
              <input
                value={clientCompany}
                onChange={(event) => setClientCompany(event.target.value)}
                placeholder="Empresa"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
              <input
                value={clientPhone}
                onChange={(event) => setClientPhone(event.target.value)}
                placeholder="Teléfono"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>
          </section>

          <section className="rounded-3xl border border-[#222] bg-[#111] p-6 space-y-5">
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
              Proyecto
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Nombre del proyecto"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white md:col-span-2"
              />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as "es" | "en")}
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <select
                value={serviceType}
                onChange={(event) => setServiceType(event.target.value)}
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white">
                {Object.entries(SERVICE_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={estimatedWeeks}
                onChange={(event) => setEstimatedWeeks(Number(event.target.value))}
                placeholder="Semanas estimadas"
                className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
              />
            </div>
            <textarea
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
              placeholder="Descripción del proyecto"
              rows={5}
              className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
            />
            <textarea
              value={paymentTerms}
              onChange={(event) => setPaymentTerms(event.target.value)}
              placeholder="Términos de pago"
              rows={3}
              className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
            />
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Notas internas"
              rows={4}
              className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
            />
          </section>

          <section className="rounded-3xl border border-[#222] bg-[#111] p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
                Servicios
              </h2>
              <button
                type="button"
                onClick={() => setServices((prev) => [...prev, EMPTY_SERVICE])}
                className="inline-flex items-center gap-2 rounded-full border border-[#222] px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white hover:border-[#444]">
                <Plus size={14} />
                Agregar servicio
              </button>
            </div>

            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={`${service.name}-${index}`}
                  className="grid gap-3 rounded-2xl border border-[#222] bg-[#080808] p-4 md:grid-cols-[1.6fr_0.6fr_0.8fr_0.7fr_auto]">
                  <input
                    value={service.name}
                    onChange={(event) =>
                      updateService(index, "name", event.target.value)
                    }
                    placeholder="Servicio"
                    className="w-full rounded-2xl border border-[#222] bg-[#111] px-4 py-3 text-white outline-none focus:border-white"
                  />
                  <input
                    type="number"
                    min={1}
                    value={service.quantity}
                    onChange={(event) =>
                      updateService(index, "quantity", Number(event.target.value))
                    }
                    placeholder="Qty"
                    className="w-full rounded-2xl border border-[#222] bg-[#111] px-4 py-3 text-white outline-none focus:border-white"
                  />
                  <input
                    type="number"
                    min={0}
                    value={service.unit_price}
                    onChange={(event) =>
                      updateService(index, "unit_price", Number(event.target.value))
                    }
                    placeholder="Precio unitario"
                    className="w-full rounded-2xl border border-[#222] bg-[#111] px-4 py-3 text-white outline-none focus:border-white"
                  />
                  <div className="flex items-center rounded-2xl border border-[#222] bg-[#111] px-4 py-3 text-sm text-[#F5F5F0]">
                    {formatCurrency(service.total)}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setServices((prev) => prev.filter((_, item) => item !== index))
                    }
                    disabled={services.length === 1}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#222] text-[#555] hover:text-white disabled:opacity-30">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-[#222] bg-[#111] p-6 space-y-5 sticky top-8">
            <h2 className="text-lg font-bold uppercase tracking-[0.12em] text-white">
              Resumen financiero
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-[#555]">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>

              <div className="grid gap-3">
                <select
                  value={discountType}
                  onChange={(event) =>
                    setDiscountType(event.target.value as DiscountType | "none")
                  }
                  className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white">
                  <option value="none">Sin descuento</option>
                  <option value="percentage">Descuento %</option>
                  <option value="fixed">Descuento fijo</option>
                </select>
                {discountType !== "none" && (
                  <input
                    type="number"
                    min={0}
                    value={discountValue}
                    onChange={(event) =>
                      setDiscountValue(Number(event.target.value))
                    }
                    placeholder="Valor del descuento"
                    className="w-full rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-white outline-none focus:border-white"
                  />
                )}
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-[#222] bg-[#080808] px-4 py-3 text-sm text-white">
                <input
                  type="checkbox"
                  checked={applyIva}
                  onChange={(event) => setApplyIva(event.target.checked)}
                />
                Aplicar IVA
              </label>

              <div className="flex items-center justify-between text-sm text-[#555]">
                <span>Descuento</span>
                <span>-{formatCurrency(totals.discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-[#555]">
                <span>IVA</span>
                <span>{formatCurrency(totals.ivaAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-[#222] pt-4 text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>

            {error && (
              <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#00E5A0] disabled:opacity-50">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
                Guardar proposal
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
