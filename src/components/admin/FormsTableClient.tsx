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
        "¿Estás seguro que deseas eliminar este formulario? Esta acción no se puede deshacer.",
      )
    ) {
      setDeletingId(id);
      await deleteForm(id);
      setDeletingId(null);
    }
  };

  const dateLocale = locale === "es" ? es : enUS;

  const StatusBadge = ({ status }: { status: string }) => {
    const isCompleted = status === "completed";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.15em] rounded-full ${
          isCompleted
            ? "bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/20"
            : "bg-[#555]/10 text-[#555] border border-[#222]"
        }`}>
        {isCompleted ? "Completado" : "Pendiente"}
      </span>
    );
  };

  const LangBadge = ({ lang }: { lang: string }) => (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#888] bg-[#080808] px-2 py-1 border border-[#222] tracking-widest rounded-md">
      <Globe size={10} />
      {lang}
    </span>
  );

  return (
    <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden flex flex-col">
      {/* Mobile view: Stacked cards */}
      <div className="block lg:hidden divide-y divide-[#222]">
        {forms.map((f) => (
          <div key={f.id} className="p-5 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#080808] border border-[#222] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {f.client_logo_url ? (
                    <img
                      src={f.client_logo_url}
                      alt={f.client_name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-xl font-black text-[#333]">
                      {f.client_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-black text-white uppercase tracking-tight">
                    {f.client_name}
                  </p>
                  <p className="text-[10px] text-[#555] font-mono tracking-widest uppercase mt-1">
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
                <span className="text-[#333] block text-[9px] font-mono uppercase tracking-widest mb-1.5">
                  Dirigido a
                </span>
                <span className="text-[#888] text-sm font-body">
                  {f.directed_to}
                </span>
              </div>
              <div>
                <span className="text-[#333] block text-[9px] font-mono uppercase tracking-widest mb-1.5">
                  Idioma
                </span>
                <LangBadge lang={f.language} />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#222]">
              <div className="flex gap-1">
                <button
                  onClick={() => handleCopy(f.form_url, f.id)}
                  className="p-2.5 text-[#555] hover:text-[#00E5A0] transition-colors">
                  {copiedId === f.id ? <Check size={18} /> : <Copy size={18} />}
                </button>
                <Link
                  href={`/${locale}/admin/forms/${f.id}`}
                  className="p-2.5 text-[#555] hover:text-white transition-colors">
                  <Eye size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                  className="p-2.5 text-[#555] hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <a
                href={f.form_url}
                target="_blank"
                className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#333] hover:text-white transition-colors flex items-center gap-2">
                Link <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left font-body">
          <thead className="bg-[#080808] border-b border-[#222]">
            <tr>
              <th className="px-6 py-5 text-[10px] font-mono uppercase tracking-[0.3em] text-[#333]">
                Cliente
              </th>
              <th className="px-6 py-5 text-[10px] font-mono uppercase tracking-[0.3em] text-[#333]">
                Dirigido a
              </th>
              <th className="px-6 py-5 text-[10px] font-mono uppercase tracking-[0.3em] text-[#333]">
                Idioma
              </th>
              <th className="px-6 py-5 text-[10px] font-mono uppercase tracking-[0.3em] text-[#333]">
                Estado
              </th>
              <th className="px-6 py-5 text-[10px] font-mono uppercase tracking-[0.3em] text-[#333]">
                Fecha
              </th>
              <th className="px-6 py-5 text-[10px] font-mono uppercase tracking-[0.3em] text-[#333] text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222] whitespace-nowrap">
            {forms.map((f) => (
              <tr
                key={f.id}
                className={`${deletingId === f.id ? "opacity-30" : ""} hover:bg-[#0A0A0A] transition-colors group`}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#080808] border border-[#222] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-[#444] transition-colors">
                      {f.client_logo_url ? (
                        <img
                          src={f.client_logo_url}
                          alt={f.client_name}
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-xl font-black text-[#333]">
                          {f.client_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-black text-white uppercase tracking-tight">
                      {f.client_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[#888] text-[13px] font-normal">
                  {f.directed_to}
                </td>
                <td className="px-6 py-5">
                  <LangBadge lang={f.language} />
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={f.status} />
                </td>
                <td className="px-6 py-5 text-[#555] font-mono text-[11px] tracking-widest">
                  {format(new Date(f.created_at), "dd MMM, yyyy", {
                    locale: dateLocale,
                  })}
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleCopy(f.form_url, f.id)}
                      className="p-2 text-[#555] hover:text-[#00E5A0] transition-colors"
                      title="Copiar URL">
                      {copiedId === f.id ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    <Link
                      href={`/${locale}/admin/forms/${f.id}`}
                      className="p-2 text-[#555] hover:text-white transition-colors"
                      title="Ver detalle">
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(f.id)}
                      disabled={deletingId === f.id}
                      className="p-2 text-[#555] hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Eliminar">
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
        <div className="p-5 border-t border-[#222] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-[#555] bg-[#0A0A0A]">
          <span>
            PAG {currentPage} / {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                router.push(`/${locale}/admin?page=${currentPage - 1}`)
              }
              className="p-2 border border-[#222] rounded-lg hover:bg-[#141414] hover:text-white disabled:opacity-20 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                router.push(`/${locale}/admin?page=${currentPage + 1}`)
              }
              className="p-2 border border-[#222] rounded-lg hover:bg-[#141414] hover:text-white disabled:opacity-20 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
