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
import { X, ExternalLink } from "lucide-react";
import { ServiceId, SERVICE_LABELS } from "@/types";

const SERVICES_CONFIG: Record<
  ServiceId,
  { icon: string; desc: string; duration: number }
> = {
  branding: {
    icon: "◈",
    desc: "Propósito, personalidad, color, tipografía y voz de marca",
    duration: 5,
  },
  web: {
    icon: "▣",
    desc: "Estructura, referencias visuales, contenido y funcionalidades",
    duration: 4,
  },
  seo: {
    icon: "↑",
    desc: "Keywords, competencia, objetivos de posicionamiento orgánico",
    duration: 4,
  },
  "ai-automations": {
    icon: "⬡",
    desc: "Procesos a automatizar, herramientas actuales, equipo y presupuesto",
    duration: 5,
  },
  crm: {
    icon: "◎",
    desc: "Pipeline, equipo, CRM actual e integraciones necesarias",
    duration: 5,
  },
};

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
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([
    "branding",
  ]);

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
    formData.append("services", JSON.stringify(selectedServices));

    const result = await createDiscoveryFormAction(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else if (result.success && result.formUrl && result.formId) {
      setSuccessData({ url: result.formUrl, id: result.formId });
      try {
        await navigator.clipboard.writeText(result.formUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {}
      setIsSubmitting(false);
    }
  };

  // --- SUCCESS MODAL ---
  const SuccessModal = () => {
    if (!successData) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-[#141414] border border-[#222] p-8 max-w-md w-full relative animate-in zoom-in-95 duration-300">
          <button
            onClick={() => setSuccessData(null)}
            className="absolute top-4 right-4 text-[#555] hover:text-white transition-colors">
            <X size={20} />
          </button>

          <div className="mb-6">
            <h2 className="font-display text-28px text-white mb-2 uppercase tracking-wide">
              ✓ Formulario creado
            </h2>
            <p className="font-body text-[13px] text-[#555]">
              Comparte este link con {clientName}
            </p>
          </div>

          <div className="bg-[#080808] border border-[#222] px-4 py-3 mb-6 group relative">
            <span className="font-mono text-[12px] text-[#F5F5F0] break-all block pr-8">
              discovery.noctra.studio/f/{slug}
            </span>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(successData.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="absolute right-3 top-3 text-[#555] hover:text-[#00E5A0] transition-colors">
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          <div className="space-y-3">
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(successData.url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full py-3 bg-white text-black font-semibold tracking-[0.08em] uppercase text-sm hover:bg-[#00E5A0] transition-colors">
              {copied ? "✓ Copiado" : "Copiar link"}
            </button>
            <a
              href={successData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border border-[#222] text-white font-semibold tracking-[0.08em] uppercase text-sm hover:bg-[#222] transition-colors flex items-center justify-center gap-2">
              Abrir en nueva pestaña <ExternalLink size={14} />
            </a>
          </div>

          <button
            onClick={() => router.push(`/${locale}/admin`)}
            className="w-full mt-6 text-center font-mono text-[11px] text-[#555] hover:text-white transition-colors uppercase tracking-widest">
            Ir al dashboard →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto p-4 lg:p-10 relative">
      <SuccessModal />

      <div className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Client Name */}
          <div>
            <label className="block text-[11px] text-[#555] mb-2 font-mono uppercase tracking-[0.2em]">
              {t("clientName")} *
            </label>
            <input
              required
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-3 bg-[#141414] border border-[#222] text-white font-body focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* 2. Logo Upload */}
          <div>
            <label className="block text-[11px] text-[#555] mb-2 font-mono uppercase tracking-[0.2em]">
              Logo (Opcional)
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border border-[#222] bg-[#141414] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#444] transition-colors relative min-h-[160px]">
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
                <div className="relative group">
                  <img
                    src={logoPreviewUrl}
                    className="max-h-24 max-w-full object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLogoFile(null);
                      setLogoPreviewUrl(null);
                    }}
                    className="absolute -top-4 -right-4 bg-red-500 text-white p-1 hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadCloud size={32} className="mb-4 text-[#333] mx-auto" />
                  <p className="font-sans text-[13px] text-[#555] mb-1">
                    Arrastra el logo aquí
                  </p>
                  <p className="font-mono text-[10px] text-[#333] uppercase tracking-wider">
                    o haz clic para seleccionar
                  </p>
                </div>
              )}
            </div>
            <p className="mt-2 font-body text-[11px] text-[#555] leading-relaxed">
              PNG, SVG, JPG · Máx 2MB · Fondo transparente recomendado
            </p>
          </div>

          {/* 3. Directed To */}
          <div>
            <label className="block text-[11px] text-[#555] mb-2 font-mono uppercase tracking-[0.2em]">
              {t("directedTo")} *
            </label>
            <input
              required
              type="text"
              value={directedTo}
              onChange={(e) => setDirectedTo(e.target.value)}
              className="w-full px-4 py-3 bg-[#141414] border border-[#222] text-white font-body focus:outline-none focus:border-white transition-colors"
            />
            <p className="mt-2 font-body text-[11px] text-[#555]">
              Nombre de quien llenará el formulario. Aparece en el saludo.
            </p>
          </div>

          {/* 4. Language & Expires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] text-[#555] mb-2 font-mono uppercase tracking-[0.2em]">
                {t("language")}
              </label>
              <div className="flex bg-[#080808] border border-[#222] p-1">
                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`flex-1 py-2 text-[11px] font-mono tracking-wider ${language === "es" ? "bg-[#222] text-[#00E5A0]" : "text-[#555]"}`}>
                  ESPAÑOL
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-2 text-[11px] font-mono tracking-wider ${language === "en" ? "bg-[#222] text-[#00E5A0]" : "text-[#555]"}`}>
                  ENGLISH
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-[#555] mb-2 font-mono uppercase tracking-[0.2em]">
                Vence
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2 border border-[#222] bg-[#141414] text-white focus:outline-none focus:border-white transition-colors"
                style={{ colorScheme: "dark" }}
              />
              <p className="mt-2 font-body text-[11px] text-[#555]">
                Dejar vacío para que el link no expire.
              </p>
            </div>
          </div>

          {/* 5. Services Selection */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="block text-[11px] text-[#555] font-mono uppercase tracking-[0.2em]">
                SERVICIOS DEL PROYECTO *
              </label>
              <p className="font-body text-[11px] text-[#333]">
                Selecciona los servicios contratados. El form incluirá las
                preguntas correspondientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                Object.entries(SERVICES_CONFIG) as [
                  ServiceId,
                  (typeof SERVICES_CONFIG)["branding"],
                ][]
              ).map(([id, config]) => {
                const isSelected = selectedServices.includes(id);
                return (
                  <div
                    key={id}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedServices.length > 1) {
                          setSelectedServices((prev) =>
                            prev.filter((s) => s !== id),
                          );
                        }
                      } else {
                        setSelectedServices((prev) => [...prev, id]);
                      }
                    }}
                    className={`relative p-5 border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#00E5A0]/5 border-[#00E5A0]"
                        : "bg-[#141414] border-[#222] hover:border-[#444]"
                    }`}>
                    {isSelected && (
                      <span className="absolute top-4 right-4 font-mono text-[10px] text-[#00E5A0]">
                        ✓
                      </span>
                    )}
                    <div className="font-display text-xl text-white mb-2 leading-none">
                      {config.icon}
                    </div>
                    <div className="font-sans text-[13px] font-medium text-white mb-1 uppercase tracking-tight">
                      {SERVICE_LABELS[id]}
                    </div>
                    <div className="font-mono text-[9px] text-[#555] leading-relaxed tracking-wider uppercase">
                      {config.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slug / Link URL */}
          <div>
            <label className="text-[11px] text-[#555] mb-2 font-mono uppercase tracking-[0.2em] flex justify-between">
              URL DEL FORMULARIO *
              {isCheckingSlug && <Loader2 size={12} className="animate-spin" />}
            </label>
            <div className="relative group">
              <input
                required
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                className={`w-full px-4 py-3 bg-[#141414] border text-white font-mono text-sm focus:outline-none transition-colors ${slugAvailable === false ? "border-red-500" : slugAvailable === true ? "border-[#00E5A0]" : "border-[#222]"}`}
              />
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `discovery.noctra.studio/f/${slug}`,
                  );
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="absolute right-3 top-3 text-[#333] hover:text-[#00E5A0] transition-colors">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="font-mono text-[11px] text-[#555] tracking-tight">
                discovery.noctra.studio/f/
                <span className="text-[#888]">{slug || "..."}</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-[13px] font-body flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || slugAvailable === false}
            className="w-full py-4 bg-white text-black font-semibold tracking-[0.08em] uppercase text-sm hover:bg-[#00E5A0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3">
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creando...
              </>
            ) : (
              "Crear formulario →"
            )}
          </button>
        </form>
      </div>

      <div className="hidden lg:block lg:pl-10 lg:border-l border-[#222]">
        <h3 className="text-[9px] uppercase font-mono tracking-[0.3em] text-[#555] mb-8 flex justify-between">
          <span>
            PREVIEW EN VIVO · {language === "es" ? "ESPAÑOL" : "ENGLISH"}
          </span>
          <span className="text-white">
            ~
            {selectedServices.reduce(
              (acc, id) => acc + SERVICES_CONFIG[id].duration,
              3,
            )}{" "}
            MINUTOS
          </span>
        </h3>

        <div className="sticky top-10 transform scale-[0.65] origin-top border border-[#222] overflow-hidden">
          <div className="bg-[#080808] p-10 min-h-[600px] flex flex-col relative">
            {/* Mock Header */}
            <div className="h-10 border-b border-[#222] -mx-10 -mt-10 mb-10 bg-[#080808] flex items-center px-6">
              <div className="w-1/3 h-[1px] bg-[#00E5A0]" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {logoPreviewUrl ? (
                <img
                  src={logoPreviewUrl}
                  className="max-h-12 object-contain mb-8"
                />
              ) : (
                <div className="font-display text-2xl text-white tracking-widest mb-8 uppercase">
                  {clientName || "[CLIENTE]"}
                </div>
              )}

              <div className="font-mono text-[8px] tracking-[0.4em] text-[#333] uppercase mb-4">
                {selectedServices.length > 1
                  ? "DISCOVERY MULTI-SERVICIO"
                  : `${SERVICE_LABELS[selectedServices[0]]} DISCOVERY`}
              </div>

              <h2 className="text-4xl font-display text-white mb-6 uppercase leading-none">
                <span className="text-[#333] block">
                  Hola {directedTo || "[Persona]"},
                </span>
                cuéntanos tu marca.
              </h2>

              <div className="space-y-2 mb-8 text-left w-full max-w-[240px] mx-auto">
                <p className="font-mono text-[7px] text-[#333] uppercase tracking-widest border-b border-[#222] pb-1">
                  Secciones del form:
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[8px] font-mono text-white">
                    <span className="text-[#00E5A0]">✓</span> EMPRESA & CONTEXTO
                  </div>
                  {selectedServices.map((id) => (
                    <div
                      key={id}
                      className="flex items-center gap-2 text-[8px] font-mono text-white">
                      <span className="text-[#00E5A0]">✓</span>{" "}
                      {SERVICE_LABELS[id].split(" ")[0].toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>

              <button className="bg-white text-black text-[10px] px-6 py-3 font-semibold uppercase tracking-widest mt-4">
                Comenzar →
              </button>
            </div>

            <div className="mt-auto text-center font-mono text-[8px] text-[#222] tracking-widest uppercase">
              Powered by Noctra Studio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
