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
  Globe,
} from "lucide-react";
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
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
          isCompleted
            ? "bg-green-500/10 text-green-400 border border-green-500/20"
            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
        }`}>
        {isCompleted ? "Completado" : "Pendiente"}
      </span>
    );
  };

  const LangBadge = ({ lang }: { lang: string }) => (
    <span className="inline-flex items-center gap-1 text-xs font-mono uppercase bg-[#1A1A1A] text-gray-300 px-2 py-1 rounded-md border border-[#333]">
      <Globe size={12} />
      {lang}
    </span>
  );

  return (
    <div className="bg-[#0E0E0E] border border-[#222] rounded-xl overflow-hidden flex flex-col">
      {/* Mobile view: Stacked cards */}
      <div className="block lg:hidden divide-y divide-[#222]">
        {forms.map((f) => (
          <div key={f.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#222] border border-[#333] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {f.client_logo_url ? (
                    <img
                      src={f.client_logo_url}
                      alt={f.client_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-gray-400">
                      {f.client_name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-body font-medium text-white">
                    {f.client_name}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {format(new Date(f.created_at), "dd MMM, yyyy", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>
              <StatusBadge status={f.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              <div>
                <span className="text-gray-500 block text-xs mb-1">
                  Dirigido a
                </span>
                <span className="text-gray-300">{f.directed_to}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-1">Idioma</span>
                <LangBadge lang={f.language} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222]">
              <button
                onClick={() => handleCopy(f.form_url, f.id)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Copiar URL">
                {copiedId === f.id ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
              <Link
                href={`/${locale}/admin/forms/${f.id}`}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Ver detalle">
                <Eye size={18} />
              </Link>
              <button
                onClick={() => handleDelete(f.id)}
                disabled={deletingId === f.id}
                className="p-2 text-red-500/70 hover:text-red-400 transition-colors disabled:opacity-50"
                title="Eliminar">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left font-body">
          <thead className="bg-[#111] border-b border-[#222]">
            <tr>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#666]">
                Cliente
              </th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#666]">
                Dirigido a
              </th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#666]">
                Idioma
              </th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#666]">
                Estado
              </th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#666]">
                Fecha
              </th>
              <th className="px-6 py-4 text-xs font-mono uppercase tracking-wider text-[#666] text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222] whitespace-nowrap">
            {forms.map((f) => (
              <tr
                key={f.id}
                className={`${deletingId === f.id ? "opacity-50" : ""} hover:bg-[#151515] transition-colors`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#222] border border-[#333] flex items-center justify-center overflow-hidden flex-shrink-0">
                      {f.client_logo_url ? (
                        <img
                          src={f.client_logo_url}
                          alt={f.client_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-display text-gray-400 text-sm">
                          {f.client_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-white">
                      {f.client_name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300">{f.directed_to}</td>
                <td className="px-6 py-4">
                  <LangBadge lang={f.language} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={f.status} />
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  {format(new Date(f.created_at), "dd MMM, yyyy", {
                    locale: dateLocale,
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopy(f.form_url, f.id)}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#222]"
                      title="Copiar URL">
                      {copiedId === f.id ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                    <Link
                      href={`/${locale}/admin/forms/${f.id}`}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#222]"
                      title="Ver detalle">
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(f.id)}
                      disabled={deletingId === f.id}
                      className="p-2 text-red-500/70 hover:text-red-400 transition-colors rounded-lg hover:bg-[#222] disabled:opacity-50"
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
        <div className="p-4 border-t border-[#222] flex items-center justify-between font-mono text-xs text-gray-400 bg-[#0A0A0A]">
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                router.push(`/${locale}/admin?page=${currentPage - 1}`)
              }
              className="p-2 border border-[#333] rounded-md hover:bg-[#222] disabled:opacity-50 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                router.push(`/${locale}/admin?page=${currentPage + 1}`)
              }
              className="p-2 border border-[#333] rounded-md hover:bg-[#222] disabled:opacity-50 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
