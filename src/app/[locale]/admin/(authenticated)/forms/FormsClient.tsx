"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Copy,
  ArrowRight,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { deleteForm } from "./actions";
import { ServiceId } from "@/types";

interface FormsClientProps {
  initialForms: any[];
  totalCount: number;
  completedCount: number;
  pageSize: number;
  currentPage: number;
  locale: string;
  dict: any;
}

const SERVICE_ICONS: Record<ServiceId, string> = {
  branding: "◈",
  web: "▣",
  seo: "↑",
  "ai-automations": "⬡",
  crm: "◎",
};

export default function FormsClient({
  initialForms,
  totalCount,
  completedCount,
  pageSize,
  currentPage,
  locale,
  dict,
}: FormsClientProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Filter and Sort logic (Client Side)
  const filteredForms = useMemo(() => {
    let result = [...initialForms];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (f) =>
          f.client_name.toLowerCase().includes(term) ||
          f.slug.toLowerCase().includes(term),
      );
    }

    // Status
    if (statusFilter !== "all") {
      result = result.filter((f) => {
        const isCompleted = !!f.submission;
        return statusFilter === "completed" ? isCompleted : !isCompleted;
      });
    }

    // Service
    if (serviceFilter !== "all") {
      result = result.filter((f) => f.services?.includes(serviceFilter));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      if (sortBy === "az") return a.client_name.localeCompare(b.client_name);
      if (sortBy === "completed") {
        const aComp = !!a.submission;
        const bComp = !!b.submission;
        if (aComp === bComp)
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        return aComp ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [initialForms, searchTerm, statusFilter, serviceFilter, sortBy]);

  // 2. Helper for Relative Time
  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat("es", { numeric: "always" });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, "second");
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return rtf.format(-diffInMinutes, "minute");
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return rtf.format(-diffInHours, "hour");
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return rtf.format(-diffInDays, "day");
    const diffInMonths = Math.floor(diffInDays / 30);
    return rtf.format(-diffInMonths, "month");
  };

  const formatExactDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 3. Actions
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast({ title: dict.urlCopied, type: "success" });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deleteForm(deleteId, locale);
    if (res.success) {
      addToast({ title: "Formulario eliminado", type: "success" });
      setDeleteId(null);
    } else {
      addToast({
        title: "Error al eliminar",
        description: res.error,
        type: "error",
      });
    }
    setIsDeleting(false);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <p className="font-medium text-[9px] tracking-[0.18em] text-[#555] uppercase mb-2">
            NOCTRA DISCOVERY · FORMULARIOS
          </p>
          <h1 className="text-[36px] md:text-[52px] font-black leading-none text-[#F5F5F0] uppercase">
            {dict.title}
          </h1>
          <p className="text-[13px] font-light text-[#555] mt-1">
            {dict.subtitle
              .replace("{total}", totalCount)
              .replace("{completed}", completedCount)}
          </p>
        </div>
        <Link
          href={`/${locale}/admin/forms/new`}
          className="bg-white text-black hover:bg-[#00E5A0] px-6 py-3 rounded-full font-medium text-[10px] tracking-[0.18em] uppercase transition-colors flex items-center gap-2">
          <Plus size={14} />
          {dict.newForm}
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]"
            size={14}
          />
          <input
            type="text"
            placeholder={dict.search}
            value={searchTerm}
            className="w-full bg-[#141414] border border-[#222] rounded-full pl-11 pr-4 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#444] transition-colors font-light"
          />
        </div>

        <div className="flex border border-[#222] bg-[#141414] rounded-xl p-1 gap-1">
          {[
            { id: "all", label: dict.filterAll },
            { id: "pending", label: dict.filterPending },
            { id: "completed", label: dict.filterCompleted },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-1.5 rounded-lg font-medium text-[10px] tracking-[0.18em] uppercase transition-colors ${
                statusFilter === tab.id
                  ? "bg-[#333] text-white"
                  : "text-[#555] hover:text-white"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service Filter */}
        <div className="relative">
          <select
            value={serviceFilter}
            className="bg-[#141414] border border-[#222] rounded-xl text-[#F5F5F0] pl-4 pr-10 py-2.5 text-[13px] focus:outline-none focus:border-[#444] cursor-pointer appearance-none">
            <option value="all">{dict.filterService}</option>
            <option value="branding">Branding</option>
            <option value="web">Diseño Web</option>
            <option value="seo">SEO</option>
            <option value="ai-automations">AI Automations</option>
            <option value="crm">CRM</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">
            <ArrowRight size={12} className="rotate-90" />
          </div>
        </div>

        {/* Sort Filter */}
        <div className="relative ml-auto">
          <select
            value={sortBy}
            className="bg-[#141414] border border-[#222] rounded-xl text-[#F5F5F0] pl-4 pr-10 py-2.5 text-[13px] focus:outline-none focus:border-[#444] cursor-pointer appearance-none">
            <option value="newest">{dict.sortNewest}</option>
            <option value="oldest">{dict.sortOldest}</option>
            <option value="az">{dict.sortAZ}</option>
            <option value="completed">{dict.sortCompleted}</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]">
            <ArrowRight size={12} className="rotate-90" />
          </div>
        </div>
      </div>

      {/* Table / Cards */}
      {filteredForms.length > 0 ? (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto border border-[#222]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#0d0d0d] border-b border-[#1a1a1a] h-10">
                  <th className="px-4 text-left font-medium text-[8px] tracking-[0.18em] text-[#555] uppercase">
                    {dict.colClient}
                  </th>
                  <th className="px-4 text-left font-medium text-[8px] tracking-[0.18em] text-[#555] uppercase w-[180px]">
                    {dict.colServices}
                  </th>
                  <th className="px-4 text-left font-medium text-[8px] tracking-[0.18em] text-[#555] uppercase w-[80px]">
                    {dict.colLanguage}
                  </th>
                  <th className="px-4 text-left font-medium text-[8px] tracking-[0.18em] text-[#555] uppercase w-[100px]">
                    {dict.colStatus}
                  </th>
                  <th className="px-4 text-left font-medium text-[8px] tracking-[0.18em] text-[#555] uppercase w-[130px]">
                    {dict.colCreated}
                  </th>
                  <th className="px-4 text-right font-medium text-[8px] tracking-[0.18em] text-[#555] uppercase w-[100px]">
                    {dict.colActions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111]">
                {filteredForms.map((form) => {
                  const isCompleted = !!form.submission;
                  return (
                    <tr
                      key={form.id}
                      className="h-14 hover:bg-[#141414]/60 transition-colors group">
                      <td className="px-4">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-[#222] flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#333]">
                            {form.client_logo_url ? (
                              <img
                                src={form.client_logo_url}
                                alt={form.client_name}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <span className="font-black text-[14px] text-white">
                                {form.client_name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex flex-col">
                            <span className="text-[13px] font-medium text-[#F5F5F0]">
                              {form.client_name}
                            </span>
                            <span className="font-medium text-[9px] text-[#333] tracking-tight">
                              /f/{form.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4">
                        <div className="flex gap-1 flex-wrap">
                          {form.services?.map((sid: ServiceId) => (
                            <span
                              key={sid}
                              className="bg-[#141414] border border-[#222] px-2 py-0.5 font-medium text-[7px] tracking-[0.12em] text-[#555] uppercase flex items-center gap-1">
                              <span>{SERVICE_ICONS[sid]}</span>
                              <span>{sid.split("-")[0]}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4">
                        {form.language === "es" ? (
                          <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#080808] text-[#555] border border-[#222]">
                            ES
                          </span>
                        ) : (
                          <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#141414] text-[#00E5A0] border border-[#00E5A0]/20">
                            EN
                          </span>
                        )}
                      </td>
                      <td className="px-4">
                        {isCompleted ? (
                          <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#0a1f14] text-[#00E5A0] border border-[#00E5A0]/20">
                            {dict.statusCompleted}
                          </span>
                        ) : (
                          <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#141414] text-[#333] border border-[#222]">
                            {dict.statusPending}
                          </span>
                        )}
                      </td>
                      <td className="px-4 text-[#555]">
                        <span
                          className="font-medium text-[10px] cursor-default uppercase"
                          title={formatExactDate(form.created_at)}>
                          {getRelativeTime(form.created_at)}
                        </span>
                      </td>
                      <td className="px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleCopy(form.form_url)}
                            className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-[#333] text-[#555] hover:text-white transition-colors"
                            title={dict.copyUrl}>
                            <Copy size={14} />
                          </button>
                          <Link
                            href={`/${locale}/admin/forms/${form.id}`}
                            className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-[#333] text-[#555] hover:text-white transition-colors"
                            title={dict.viewDetail}>
                            <ArrowRight size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(form.id)}
                            className="w-8 h-8 flex items-center justify-center border border-transparent hover:border-[#333] text-[#555] hover:text-red-400 hover:border-red-900 transition-colors"
                            title={dict.delete}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-2">
            {filteredForms.map((form) => {
              const isCompleted = !!form.submission;
              return (
                <div
                  key={form.id}
                  className="bg-[#141414] border border-[#222] p-4 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#222] flex items-center justify-center overflow-hidden border border-[#333]">
                        {form.client_logo_url ? (
                          <img
                            src={form.client_logo_url}
                            alt={form.client_name}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="font-black text-[14px] text-white">
                            {form.client_name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <span className="font-black text-[14px] text-[#F5F5F0] uppercase tracking-tight">
                        {form.client_name}
                      </span>
                    </div>
                    {isCompleted ? (
                      <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#0a1f14] text-[#00E5A0] border border-[#00E5A0]/20">
                        {dict.statusCompleted}
                      </span>
                    ) : (
                      <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#141414] text-[#333] border border-[#222]">
                        {dict.statusPending}
                      </span>
                    )}
                  </div>
                  <div className="font-medium text-[9px] text-[#333] break-all uppercase tracking-tight">
                    /f/{form.slug}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {form.services?.map((sid: ServiceId) => (
                      <span
                        key={sid}
                        className="bg-[#141414] border border-[#222] px-2 py-0.5 font-medium text-[7px] tracking-[0.12em] text-[#555] uppercase flex items-center gap-1">
                        <span>{SERVICE_ICONS[sid]}</span>
                        <span>{sid.split("-")[0]}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#111]">
                    <div className="flex items-center gap-3">
                      {form.language === "es" ? (
                        <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#080808] text-[#555] border border-[#222]">
                          ES
                        </span>
                      ) : (
                        <span className="font-medium text-[8px] tracking-[0.18em] uppercase px-2 py-0.5 bg-[#141414] text-[#00E5A0] border border-[#00E5A0]/20">
                          EN
                        </span>
                      )}
                      <span className="font-medium text-[9px] text-[#555] uppercase">
                        {getRelativeTime(form.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(form.form_url)}
                        className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-white border border-[#222] transition-colors">
                        <Copy size={14} />
                      </button>
                      <Link
                        href={`/${locale}/admin/forms/${form.id}`}
                        className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-white border border-[#222] transition-colors">
                        <ArrowRight size={14} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(form.id)}
                        className="w-8 h-8 flex items-center justify-center text-[#555] hover:text-red-400 border border-[#222] transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 border border-[#222] bg-[#141414] flex items-center justify-center mb-6">
            <Plus size={32} className="text-[#1a1a1a]" />
          </div>
          {initialForms.length === 0 ? (
            <>
              <h3 className="text-[32px] font-black text-[#333] uppercase mb-2">
                {dict.emptyTitle}
              </h3>
              <p className="text-[13px] font-light text-[#555] mb-8">
                {dict.emptyDesc}
              </p>
              <Link
                href={`/${locale}/admin/forms/new`}
                className="bg-white text-black hover:bg-[#00E5A0] px-8 py-3 font-medium text-[10px] tracking-[0.18em] uppercase transition-colors">
                {dict.newForm} →
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-[24px] font-black text-[#333] uppercase mb-4">
                {dict.emptyFilter}
              </h3>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setServiceFilter("all");
                }}
                className="text-[#00E5A0] font-medium text-[10px] uppercase tracking-[0.18em] hover:underline">
                {dict.clearFilters}
              </button>
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#111]">
          <span className="font-medium text-[9px] text-[#555] uppercase tracking-[0.18em]">
            {dict.showing
              .replace("{from}", (currentPage - 1) * pageSize + 1)
              .replace("{to}", Math.min(currentPage * pageSize, totalCount))
              .replace("{total}", totalCount)}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                router.push(`/${locale}/admin/forms?page=${currentPage - 1}`)
              }
              className="w-10 h-10 flex items-center justify-center bg-transparent border border-[#222] text-[#555] hover:border-[#444] hover:text-white transition-colors disabled:opacity-20">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => router.push(`/${locale}/admin/forms?page=${p}`)}
                className={`w-10 h-10 font-medium text-[10px] transition-colors ${
                  currentPage === p
                    ? "bg-white text-black"
                    : "bg-transparent border border-[#222] text-[#555] hover:border-[#444] hover:text-white"
                }`}>
                {p}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                router.push(`/${locale}/admin/forms?page=${currentPage + 1}`)
              }
              className="w-10 h-10 flex items-center justify-center bg-transparent border border-[#222] text-[#555] hover:border-[#444] hover:text-white transition-colors disabled:opacity-20">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none transition-all animate-in fade-in duration-200">
          <div className="bg-[#141414] border border-[#222] p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
            <div className="text-[#333] mb-6 flex justify-center">
              <Trash2 size={48} strokeWidth={1} />
            </div>
            <h2 className="text-[32px] font-black text-[#F5F5F0] uppercase mb-2 text-center leading-none">
              {dict.deleteModal.title}
            </h2>
            <p className="text-[13px] font-light text-[#555] text-center mb-8 leading-relaxed">
              {dict.deleteModal.desc.replace(
                "{clientName}",
                initialForms.find((f) => f.id === deleteId)?.client_name ||
                  "este cliente",
              )}
            </p>
            <div className="flex gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteId(null)}
                className="flex-1 px-5 py-3 border border-[#222] text-[#555] hover:border-[#444] hover:text-[#F5F5F0] font-medium text-[10px] tracking-[0.18em] uppercase transition-colors">
                {dict.deleteModal.cancel}
              </button>
              <button
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 px-5 py-3 bg-red-950 border border-red-800 text-red-400 hover:bg-red-900 font-medium text-[10px] tracking-[0.18em] uppercase transition-colors flex items-center justify-center gap-2">
                {isDeleting ? "..." : dict.deleteModal.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
