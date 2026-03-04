"use client";

import { useState, useEffect, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { checkSlugAvailability, createDiscoveryFormAction } from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ClientFormNew({ locale }: { locale: string }) {
  const router = useRouter();
  const t = useTranslations("admin.newForm");

  // Form State
  const [clientName, setClientName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [directedTo, setDirectedTo] = useState("");
  const [language, setLanguage] = useState("es");
  const [expiresAt, setExpiresAt] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  // Status State
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    url: string;
    id: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  useEffect(() => {
    if (!slugEdited && clientName) setSlug(generateSlug(clientName));
    else if (!slugEdited && !clientName) {
      setSlug("");
      setSlugAvailable(null);
    }
  }, [clientName, slugEdited]);

  useEffect(() => {
    if (!slug) {
      setSlugAvailable(null);
      return;
    }
    const checkAvailability = async (s: string) => {
      setIsCheckingSlug(true);
      const isAvail = await checkSlugAvailability(s);
      setSlugAvailable(isAvail);
      setIsCheckingSlug(false);
    };
    const timer = setTimeout(() => checkAvailability(slug), 500);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setFile(file);
  };
  const setFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Máx 2MB");
      return;
    }
    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!slugAvailable) return setError("Problemas con el slug.");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("clientName", clientName);
    formData.append("slug", slug);
    formData.append("directedTo", directedTo);
    formData.append("language", language);
    if (expiresAt) formData.append("expiresAt", expiresAt);
    if (logoFile) formData.append("logo", logoFile);

    const result = await createDiscoveryFormAction(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else if (result.success && result.formUrl && result.formId) {
      setSuccessData({ url: result.formUrl, id: result.formId });
      try {
        await navigator.clipboard.writeText(result.formUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {}
      setIsSubmitting(false);
    }
  };

  if (successData)
    return (
      <div className="flex flex-col items-center justify-center p-10 mt-10 max-w-xl mx-auto text-center bg-[#111] rounded-2xl border border-[#222]">
        <CheckCircle2 size={32} className="text-green-500 mb-6" />
        <h2 className="text-2xl text-white mb-2">{t("success")}</h2>
        <div className="w-full bg-[#080808] p-4 rounded-xl flex items-center justify-between gap-4 mb-4">
          <span className="font-mono text-sm text-gray-300 truncate select-all">
            {successData.url}
          </span>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(successData.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="text-sm flex items-center gap-2 bg-[#222] hover:bg-[#333] px-3 py-1.5 rounded-lg text-white">
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} />
            )}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
        <div className="flex gap-4 w-full mt-6">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-3 bg-[#1A1A1A] hover:bg-[#222] text-white rounded-lg">
            Crear otro
          </button>
          <Link
            href={`/${locale}/admin/forms/${successData.id}`}
            className="flex-1 px-4 py-3 bg-white text-black hover:bg-gray-200 rounded-lg">
            Ir al detalle
          </Link>
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto p-4 lg:p-10">
      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-mono uppercase">
              {t("clientName")} *
            </label>
            <input
              required
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white font-body"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 font-mono uppercase flex justify-between">
              {t("slug")} *{" "}
              {isCheckingSlug && <Loader2 size={14} className="animate-spin" />}
            </label>
            <input
              required
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              className={`w-full px-4 py-3 bg-[#0A0A0A] border rounded-lg text-white font-mono ${slugAvailable === false ? "border-red-500" : slugAvailable === true ? "border-green-500" : "border-[#333]"}`}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-mono uppercase">
              {t("directedTo")} *
            </label>
            <input
              required
              type="text"
              value={directedTo}
              onChange={(e) => setDirectedTo(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#333] rounded-lg text-white font-body"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-mono uppercase">
              Logo (Opcional)
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#333] rounded-xl p-8 flex flex-col items-center cursor-pointer hover:border-[#666]">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && setFile(e.target.files[0])
                }
              />
              {logoPreviewUrl ? (
                <img
                  src={logoPreviewUrl}
                  className="w-24 h-24 object-contain mb-4"
                />
              ) : (
                <UploadCloud size={24} className="mb-4 text-gray-400" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-mono uppercase">
                {t("language")}
              </label>
              <div className="flex bg-[#0A0A0A] border border-[#333] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`flex-1 py-2 text-sm rounded ${language === "es" ? "bg-[#222] text-white" : "text-gray-500"}`}>
                  ES 🇲🇽
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-2 text-sm rounded ${language === "en" ? "bg-[#222] text-white" : "text-gray-500"}`}>
                  EN 🇺🇸
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-mono uppercase">
                Vence
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2 border border-[#333] bg-[#0A0A0A] rounded-lg text-white"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
          {error && <div className="text-red-400 text-sm mt-4">{error}</div>}
          <button
            type="submit"
            disabled={isSubmitting || slugAvailable === false}
            className="w-full py-4 mt-4 bg-white text-black rounded-lg font-display text-lg hover:bg-gray-200">
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin mx-auto" />
            ) : (
              t("submitButton")
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 lg:mt-0 lg:pl-10 lg:border-l border-[#222]">
        <h3 className="text-xs uppercase font-mono tracking-widest text-[#555] mb-8">
          Preview en vivo
        </h3>
        <div className="bg-[#050505] border border-[#222] rounded-2xl flex flex-col aspect-[4/3]">
          <div className="flex-1 p-8 flex flex-col items-center text-center justify-center">
            {logoPreviewUrl ? (
              <img
                src={logoPreviewUrl}
                className="w-16 h-16 object-contain mb-8"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-[#222] flex items-center justify-center mb-8">
                <span className="text-gray-500 text-xl">
                  {clientName?.[0] || "?"}
                </span>
              </div>
            )}
            <h2 className="text-3xl font-display text-white">
              {language === "es"
                ? `Hola ${directedTo || "[Nombre]"}, cuéntanos tu marca.`
                : `Hello ${directedTo || "[Name]"}, tell us about your brand.`}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
