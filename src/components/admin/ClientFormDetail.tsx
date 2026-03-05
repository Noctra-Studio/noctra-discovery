"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Download,
  Calendar,
  User,
  Clock,
  Sparkles,
  Link as LinkIcon,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";
import { regeneratePDFAction } from "@/app/[locale]/admin/(authenticated)/forms/actions";
import { useToast } from "@/components/ui/Toast";

/* --- HELPERS --- */

const questionLabels: Record<string, { es: string; en: string }> = {
  // Common
  q_origin: {
    es: "¿Por qué existe la empresa? ¿Cuál fue la frustración original o la oportunidad que nadie estaba aprovechando?",
    en: "Why does the company exist? What was the original frustration or opportunity that no one was taking advantage of?",
  },
  q_ideal_client: {
    es: "¿Quién es exactamente el cliente con el que MÁS disfrutan trabajar?",
    en: "Who exactly is the client you MOST enjoy working with?",
  },
  q_concrete_result: {
    es: "¿Cuál es el resultado más concreto y medible que le entregan a un cliente?",
    en: "What is the most concrete and measurable result you deliver to a client?",
  },
  q_differentiator: {
    es: "¿Por qué un cliente que cotizó con la competencia terminó eligiéndolos a ustedes?",
    en: "Why did a client who got a quote from the competition end up choosing you?",
  },
  q_previous_attempts: {
    es: "¿Han intentado resolver este problema antes?",
    en: "Have you tried to solve this problem before?",
  },
  q_internal_obstacle: {
    es: "Si tuvieran una varita mágica, ¿qué proceso interno eliminarían?",
    en: "If you had a magic wand, what internal process would you eliminate?",
  },
  q_business_stage: {
    es: "¿En qué momento está la empresa hoy?",
    en: "What stage is the company in today?",
  },
  // Branding
  q_perception_rank: {
    es: "Atributos de marca (orden de importancia)",
    en: "Brand attributes (order of importance)",
  },
  q_visual_inspiration: {
    es: "Inspiración visual de marcas externas",
    en: "Visual inspiration from external brands",
  },
  q_visual_avoid: {
    es: "Estilos visuales a EVITAR",
    en: "Visual styles to AVOID",
  },
  q_visual_style: {
    es: "Estilo visual preferido",
    en: "Preferred visual style",
  },
  q_voice_attrs: {
    es: "¿Cómo comunica la marca? (Personalidad verbal)",
    en: "How does the brand communicate? (Verbal personality)",
  },
  q_concrete_result_brand: {
    es: "¿Qué tiene que lograr esta nueva identidad visual?",
    en: "What does this new visual identity need to achieve?",
  },
  q_tone_avoid: {
    es: "Estilos de comunicación rechazados",
    en: "Rejected communication styles",
  },
  q_never: {
    es: "¿Qué tipo de empresa o reputación sería un FRACASO total?",
    en: "What kind of company or reputation would be a total FAILURE?",
  },
  q_accent_color: {
    es: "Colores representativos a conservar o explorar",
    en: "Representative colors to keep or explore",
  },
  // Web
  web_current_site: {
    es: "Sitio web actual y frustraciones",
    en: "Current website and frustrations",
  },
  web_goal: {
    es: "Objetivo principal de la nueva web (Call to Action)",
    en: "Main goal of the new website (Call to Action)",
  },
  web_type: {
    es: "Tipo de sitio que necesitan",
    en: "Type of site needed",
  },
  web_content_owner: {
    es: "¿Quién se encargará del contenido?",
    en: "Who will handle the content?",
  },
  web_features: {
    es: "Funcionalidades técnicas necesarias",
    en: "Necessary technical features",
  },
  web_pages: {
    es: "Secciones/páginas del sitio",
    en: "Site sections/pages",
  },
  web_references: {
    es: "Referencias de otros sitios web",
    en: "Other website references",
  },
  web_deadline: {
    es: "Fecha límite o evento crítico",
    en: "Deadline or critical event",
  },
  // SEO
  seo_target_keywords: {
    es: "¿Qué frases escribe tu cliente ideal en Google?",
    en: "What phrases does your ideal client type in Google?",
  },
  seo_competitors: {
    es: "Competidores orgánicos directos",
    en: "Direct organic competitors",
  },
  seo_previous_attempts: {
    es: "Experiencias previas con inversión en SEO",
    en: "Previous experiences with SEO investment",
  },
  seo_geo: {
    es: "Mercado geográfico objetivo",
    en: "Target geographic market",
  },
  seo_goal: {
    es: "Impacto esperado de rankear #1",
    en: "Expected impact of ranking #1",
  },
  // AI
  ai_processes: {
    es: "Procesos principales a automatizar",
    en: "Main processes to automate",
  },
  ai_first_priority: {
    es: "Prioridad #1 de automatización esta semana",
    en: "Priority #1 for automation this week",
  },
  ai_tech_level: {
    es: "Nivel de resistencia al cambio tecnológico",
    en: "Level of resistance to technological change",
  },
  ai_budget_range: {
    es: "Presupuesto contemplado para el proyecto",
    en: "Contemplated budget for the project",
  },
  // CRM
  crm_main_goal: {
    es: "Objetivo principal de implementar el CRM",
    en: "Main goal of implementing the CRM",
  },
  crm_pipeline: {
    es: "Proceso de ventas actual (etapas)",
    en: "Current sales process (stages)",
  },
  crm_previous_attempt: {
    es: "¿Intentos fallidos previos con otros CRMs?",
    en: "Previous failed attempts with other CRMs?",
  },
  crm_team_size: {
    es: "Cantidad de vendedores que usarán el CRM",
    en: "Number of sales reps who will use the CRM",
  },
};

const translateValue = (key: string, value: any) => {
  if (!value) return value;

  const mappings: Record<string, Record<string, string>> = {
    q_business_stage: {
      starting:
        "Estoy iniciando — llevo menos de 1 año ofreciendo mis servicios",
      established:
        "Ya llevo tiempo — tengo clientes pero quiero crecer o mejorar",
      struggling: "Llevo tiempo pero no he visto los resultados que esperaba",
      relaunching:
        "Estoy relanzando — tuve operaciones antes y estoy volviendo a empezar",
    },
    web_type: {
      brand: "Sitio Web de Marca / Corporativo",
      lp: "Landing Page de Conversión",
      ecommerce: "Tienda Online / E-commerce",
      custom: "Plataforma / Desarrollo a la medida",
    },
    web_content_owner: {
      client: "Yo tengo todo el contenido (textos y fotos) listo",
      noctra: "Necesito que Noctra Studio cree el contenido por mí",
      shared: "Tengo una base pero necesito ayuda profesional para pulirlo",
    },
    seo_geo: {
      local: "Local (Ciudad/Región)",
      national: "Nacional (País completo)",
      international: "Internacional (Varios países)",
    },
    ai_tech_level: {
      low: "Bajo (Usamos herramientas básicas, mucha resistencia)",
      medium: "Medio (Usamos algunas apps, abiertos a aprender)",
      high: "Alto (Estamos tecnificados, buscamos optimizar al máximo)",
    },
  };

  if (mappings[key]) {
    return mappings[key][value] || value;
  }

  return value;
};

export default function ClientFormDetail({
  form,
  submission,
  locale,
}: {
  form: any;
  submission: any;
  locale: string;
}) {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { addToast } = useToast();
  const dateLocale = locale === "es" ? es : enUS;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(form.form_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleRegenerate = async () => {
    if (!submission?.id) return;
    setIsRegenerating(true);
    try {
      const res = await regeneratePDFAction(submission.id, locale, form.id);
      if (res.success) {
        addToast({ title: "PDF generado correctamente", type: "success" });
        // Refresh page to get new URL
        window.location.reload();
      } else {
        addToast({
          title: "Error al generar PDF",
          description: res.error,
          type: "error",
        });
      }
    } catch (err) {
      addToast({ title: "Error inesperado", type: "error" });
    } finally {
      setIsRegenerating(false);
    }
  };

  const isCompleted = form.status === "completed";

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <Link
            href={`/${locale}/admin`}
            className="flex items-center gap-2 text-[#555] hover:text-white transition-colors font-medium text-[10px] uppercase tracking-[0.18em] mb-4">
            <ArrowLeft size={14} /> Volver al dashboard
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black uppercase tracking-tight">
              {form.client_name}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-[0.18em] ${
                isCompleted
                  ? "bg-[#00E5A0]/10 text-[#00E5A0] border border-[#00E5A0]/20"
                  : "bg-[#141414] text-[#333] border border-[#222]"
              }`}>
              {isCompleted ? "Completado" : "Pendiente"}
            </span>
          </div>
        </div>

        {isCompleted && (
          <div className="flex items-center gap-3">
            {submission?.pdf_url ? (
              <div className="flex items-center gap-2">
                <a
                  href={submission.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-8 py-4 rounded-full font-medium tracking-[0.08em] uppercase text-sm hover:bg-[#00E5A0] transition-colors flex items-center gap-3">
                  <Download size={18} /> Descargar PDF
                </a>
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-[#222] bg-[#141414] text-[#555] hover:text-white transition-colors disabled:opacity-50"
                  title="Regenerar PDF">
                  <RefreshCcw
                    size={18}
                    className={isRegenerating ? "animate-spin" : ""}
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="bg-[#141414] text-[#F5F5F0] border border-[#222] px-8 py-4 rounded-full font-medium tracking-[0.08em] uppercase text-sm flex items-center gap-3 hover:border-[#444] transition-colors disabled:opacity-50 group">
                <RefreshCcw
                  size={18}
                  className={`${isRegenerating ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
                />
                {isRegenerating ? "Generando PDF..." : "Generar PDF"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {!isCompleted ? (
            /* PENDING STATE */
            <div className="bg-[#141414] border border-[#222] rounded-2xl p-8 lg:p-12 space-y-10">
              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">
                  Formulario listo para enviar
                </h2>
                <p className="text-[#555] text-sm leading-relaxed max-w-md">
                  Comparte el link o el código QR con el cliente para que
                  comience su discovery.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 items-center bg-[#080808] border border-[#222] rounded-2xl p-8">
                <div className="bg-white rounded-xl p-4">
                  <QRCodeSVG value={form.form_url} size={160} level="H" />
                </div>
                <div className="flex-1 space-y-6 w-full text-center sm:text-left">
                  <div className="space-y-2">
                    <span className="font-medium text-[9px] text-[#333] uppercase tracking-[0.18em]">
                      Link de acceso
                    </span>
                    <div className="flex items-center gap-3 bg-[#111] border border-[#222] rounded-lg p-3 group">
                      <span className="font-medium text-[11px] text-[#555] truncate flex-1">
                        {form.form_url}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="text-[#555] hover:text-[#00E5A0] transition-colors">
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <a
                    href={form.form_url}
                    target="_blank"
                    className="inline-flex items-center gap-2 text-white font-medium text-[10px] uppercase tracking-[0.18em] hover:text-[#00E5A0] transition-colors bg-[#222] px-4 py-2 rounded-full">
                    Probar link <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* COMPLETED STATE - Submissions */
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Respuestas del cliente
              </h2>
              <div className="space-y-8">
                {(() => {
                  const responses = submission?.responses || {};

                  // Helper to group flat responses into sections
                  const sections = [
                    {
                      id: "Estrategia y Negocio",
                      keys: [
                        "q_origin",
                        "q_ideal_client",
                        "q_concrete_result",
                        "q_differentiator",
                        "q_previous_attempts",
                        "q_internal_obstacle",
                        "q_business_stage",
                      ],
                    },
                    {
                      id: "Branding y Visual",
                      keys: [
                        "q_perception_rank",
                        "q_visual_inspiration",
                        "q_visual_avoid",
                        "q_visual_style",
                        "q_voice_attrs",
                        "q_concrete_result_brand",
                        "q_tone_avoid",
                        "q_never",
                        "q_accent_color",
                      ],
                    },
                    {
                      id: "Digital / Web",
                      keys: [
                        "web_type",
                        "web_current_site",
                        "web_goal",
                        "web_content_owner",
                        "web_features",
                        "web_pages",
                        "web_references",
                        "web_deadline",
                      ],
                    },
                    {
                      id: "SEO",
                      keys: [
                        "seo_target_keywords",
                        "seo_previous_attempts",
                        "seo_competitors",
                        "seo_geo",
                        "seo_goal",
                      ],
                    },
                    {
                      id: "AI y Automatización",
                      keys: [
                        "ai_processes",
                        "ai_first_priority",
                        "ai_team_size",
                        "ai_tech_level",
                        "ai_budget_range",
                      ],
                    },
                    {
                      id: "CRM y Ventas",
                      keys: [
                        "crm_main_goal",
                        "crm_pipeline",
                        "crm_previous_attempt",
                        "crm_team_size",
                      ],
                    },
                  ];

                  return sections.map((section, sIdx) => {
                    const sectionResponses = Object.entries(responses).filter(
                      ([key, value]) => {
                        const isRelevant = section.keys.includes(key);
                        if (!isRelevant) return false;

                        // Exclude empty values
                        if (
                          value === null ||
                          value === undefined ||
                          value === ""
                        )
                          return false;
                        if (Array.isArray(value) && value.length === 0)
                          return false;

                        return true;
                      },
                    );

                    if (sectionResponses.length === 0) return null;

                    return (
                      <div
                        key={sIdx}
                        className="bg-[#141414] border border-[#222] rounded-2xl overflow-hidden">
                        <div className="bg-[#080808] px-6 py-4 border-b border-[#222]">
                          <h3 className="font-medium text-[10px] text-[#555] uppercase tracking-[0.18em]">
                            {section.id}
                          </h3>
                        </div>
                        <div className="p-6 space-y-6">
                          {sectionResponses.map(([q, a], qIdx) => {
                            const label =
                              questionLabels[q]?.["es"] ||
                              q.replace(/_/g, " ").replace(/^q /, "");

                            const displayValue = translateValue(q, a);

                            return (
                              <div key={qIdx} className="space-y-3">
                                <p className="text-[#555] text-[10px] font-bold uppercase tracking-[0.15em] leading-[1.6] border-l-2 border-[#222] pl-3">
                                  {label}
                                </p>
                                <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-5 text-sm text-[#F5F5F0] leading-relaxed whitespace-pre-wrap">
                                  {Array.isArray(a) ? (
                                    <div className="flex flex-wrap gap-2">
                                      {a.map((item, i) => (
                                        <span
                                          key={i}
                                          className="bg-[#111] border border-[#222] px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#00E5A0] uppercase tracking-wide">
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    String(displayValue)
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 space-y-8">
            <h3 className="font-medium text-[10px] text-[#333] uppercase tracking-[0.18em]">
              Detalles del proyecto
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-[#222] bg-[#080808] rounded-xl flex items-center justify-center text-[#555]">
                  <User size={18} />
                </div>
                <div>
                  <span className="block font-medium text-[9px] text-[#333] uppercase tracking-[0.18em] mb-1">
                    Dirigido a
                  </span>
                  <p className="text-sm text-white">{form.directed_to}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-[#222] bg-[#080808] rounded-xl flex items-center justify-center text-[#555]">
                  <LinkIcon size={18} />
                </div>
                <div>
                  <span className="block font-medium text-[9px] text-[#333] uppercase tracking-[0.18em] mb-1">
                    Slug único
                  </span>
                  <p className="font-medium text-[11px] text-[#555]">
                    /f/{form.slug}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-[#222] bg-[#080808] rounded-xl flex items-center justify-center text-[#555]">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="block font-medium text-[9px] text-[#333] uppercase tracking-[0.18em] mb-1">
                    Expiración
                  </span>
                  <p className="text-sm text-white">
                    {form.expires_at
                      ? format(new Date(form.expires_at), "dd MMM, yyyy", {
                          locale: dateLocale,
                        })
                      : "Sin fecha de expiración"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-[#222] bg-[#080808] rounded-xl flex items-center justify-center text-[#555]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="block font-medium text-[9px] text-[#333] uppercase tracking-[0.18em] mb-1">
                    Creado
                  </span>
                  <p className="text-sm text-white">
                    {format(new Date(form.created_at), "dd MMM, yyyy", {
                      locale: dateLocale,
                    })}
                  </p>
                </div>
              </div>

              {isCompleted && submission?.submitted_at && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-[#222] bg-[#080808] rounded-xl flex items-center justify-center text-[#00E5A0]">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="block font-medium text-[9px] text-[#00E5A0] uppercase tracking-[0.18em] mb-1">
                      Completado
                    </span>
                    <p className="text-sm text-[#00E5A0]">
                      {format(
                        new Date(submission.submitted_at),
                        "dd MMM, yyyy · HH:mm",
                        { locale: dateLocale },
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border border-[#222] bg-[#141414] rounded-2xl text-center space-y-4">
            <p className="font-medium text-[9px] text-[#333] uppercase tracking-[0.18em]">
              Estado del link
            </p>
            <div className="flex justify-center gap-2">
              <div
                className={`w-2 h-2 ${isCompleted ? "bg-[#555]" : "bg-[#00E5A0] pulse"}`}
              />
              <span className="font-medium text-[10px] text-white">
                {isCompleted
                  ? "DESACTIVADO (COMPLETADO)"
                  : "ACTIVO · ESPERANDO RESPUESTAS"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
