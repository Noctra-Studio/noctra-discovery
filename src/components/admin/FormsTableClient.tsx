"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import Link from "next/link";
import {
  Copy,
  Eye,
  Trash2,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ServiceId } from "@/types";

const SERVICE_ICONS: Record<ServiceId, string> = {
  branding: "◈",
  web: "▣",
  seo: "↑",
  "ai-automations": "⬡",
  crm: "◎",
};
import { deleteForm } from "@/app/[locale]/admin/actions";
import { useRouter } from "next/navigation";

interface FormsTableClientProps {
  forms: any[];
  locale: string;
  totalPages: number;
  currentPage: number;
}

export default function FormsTableClient({
  forms,
  locale,
  totalPages,
  currentPage,
}: FormsTableClientProps) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const t = useTranslations();

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        t("common.deleteConfirm") ||
          "¿Estás seguro que deseas eliminar este formulario? Esta acción no se puede deshacer.",
      )
    ) {
      setDeletingId(id);
      await deleteForm(id);
      setDeletingId(null);
    }
  };

  const dateLocale = es;

  const StatusBadge = ({ status }: { status: string }) => {
    const isCompleted = status === "completed";
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-medium tracking-[0.18em] uppercase ${
          isCompleted
            ? "bg-[#0a1f14] text-[#00E5A0] border border-[#00E5A0]/20"
            : "bg-[#141414] text-[#333] border border-[#222]"
        }`}>
        {isCompleted
          ? t("admin.dashboard.statusSubmitted")
          : t("admin.dashboard.statusPending")}
      </span>
    );
  };

  const LangBadge = ({ lang }: { lang: string }) => (
    <span
      className={`inline-flex items-center gap-1.5 text-[8px] font-medium uppercase px-2 py-0.5 rounded-full border tracking-[0.18em] ${
        lang.toLowerCase() === "es"
          ? "bg-[#080808] text-[#555] border-[#222]"
          : "bg-[#080808] text-[#00E5A0] border-[#00E5A0]/20"
      }`}>
      {lang}
    </span>
  );

  return (
    <div className="bg-[#141414] border border-[#222] rounded-2xl flex flex-col overflow-hidden">
      {/* Mobile view: Stacked cards */}
      <div className="block lg:hidden divide-y divide-[#111]">
        {forms.map((f) => (
          <div key={f.id} className="p-5 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#222] border border-[#333] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {f.client_logo_url ? (
                    <img
                      src={f.client_logo_url}
                      alt={f.client_name}
                      className="w-full h-full object-contain p-1.5"
                    />
                  ) : (
                    <span className="text-xl font-black text-white">
                      {f.client_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-base font-black text-[#F5F5F0] uppercase tracking-tight">
                    {f.client_name}
                  </p>
                  <p className="text-[9px] text-[#555] font-medium tracking-[0.18em] uppercase mt-1">
                    {format(new Date(f.created_at), "dd MMM, yyyy", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
              <StatusBadge status={f.status} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#333] block text-[8px] font-medium uppercase tracking-[0.18em] mb-1.5">
                  Dirigido a
                </span>
                <span className="text-[#555] text-[13px] font-light">
                  {f.directed_to}
                </span>
              </div>
              <div>
                <span className="text-[#333] block text-[8px] font-medium uppercase tracking-[0.18em] mb-1.5">
                  {t("common.language")}
                </span>
                <LangBadge lang={f.language} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#111]">
              <div className="flex gap-1">
                <button
                  onClick={() => handleCopy(f.form_url, f.id)}
                  className="p-2.5 text-[#555] hover:text-[#00E5A0] rounded-lg border border-transparent hover:border-[#222] transition-colors">
                  {copiedId === f.id ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <Link
                  href={`/${locale}/admin/forms/${f.id}`}
                  className="p-2.5 text-[#555] hover:text-white rounded-lg border border-transparent hover:border-[#222] transition-colors">
                  <Eye size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                  className="p-2.5 text-[#555] hover:text-red-500 rounded-lg border border-transparent hover:border-[#222] transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <a
                href={f.form_url}
                target="_blank"
                className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#333] hover:text-white transition-colors flex items-center gap-2">
                Forms <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#0d0d0d] border-b border-[#1a1a1a]">
            <tr>
              <th className="px-6 py-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[#555]">
                {t("common.client")}
              </th>
              <th className="px-6 py-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[#555]">
                {t("common.directedTo")}
              </th>
              <th className="px-6 py-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[#555]">
                {t("common.language")}
              </th>
              <th className="px-6 py-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[#555]">
                {t("common.status")}
              </th>
              <th className="px-6 py-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[#555]">
                {t("common.createdAt")}
              </th>
              <th className="px-6 py-4 text-[8px] font-medium uppercase tracking-[0.18em] text-[#555] text-right">
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111] whitespace-nowrap">
            {forms.map((f) => (
              <tr
                key={f.id}
                className={`${deletingId === f.id ? "opacity-30" : ""} hover:bg-[#141414]/60 transition-colors group`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#222] border border-[#333] flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-[#444] transition-colors">
                      {f.client_logo_url ? (
                        <img
                          src={f.client_logo_url}
                          alt={f.client_name}
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-sm font-black text-white">
                          {f.client_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-base font-black text-[#F5F5F0] uppercase tracking-tight">
                      {f.client_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[#555] text-[13px] font-light">
                  {f.directed_to}
                </td>
                <td className="px-6 py-5">
                  <LangBadge lang={f.language} />
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={f.status} />
                </td>
                <td className="px-6 py-5 text-[#555] font-medium text-[9px] tracking-[0.18em] uppercase">
                  {format(new Date(f.created_at), "dd MMM, yyyy", {
                    locale: dateLocale,
                  })}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleCopy(f.form_url, f.id)}
                      className="p-2 text-[#555] hover:text-[#00E5A0] border border-transparent hover:border-[#222] transition-colors"
                      title="Copiar URL">
                      {copiedId === f.id ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    <Link
                      href={`/${locale}/admin/forms/${f.id}`}
                      className="p-2 text-[#555] hover:text-white border border-transparent hover:border-[#222] transition-colors"
                      title="Ver detalle">
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(f.id)}
                      disabled={deletingId === f.id}
                      className="p-2 text-[#555] hover:text-red-500 border border-transparent hover:border-[#222] transition-colors disabled:opacity-50"
                      title={t("common.delete")}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination component (footer) */}
      {totalPages > 1 && (
        <div className="p-5 border-t border-[#111] flex items-center justify-between font-medium text-[9px] uppercase tracking-[0.18em] text-[#333] bg-[#0d0d0d]">
          <span>
            PAG {currentPage} / {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                router.push(`/${locale}/admin?page=${currentPage - 1}`)
              }
              className="w-10 h-10 flex items-center justify-center border border-[#222] hover:bg-[#141414] hover:text-white disabled:opacity-20 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                router.push(`/${locale}/admin?page=${currentPage + 1}`)
              }
              className="w-10 h-10 flex items-center justify-center border border-[#222] hover:bg-[#141414] hover:text-white disabled:opacity-20 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
