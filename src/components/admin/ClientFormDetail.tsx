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
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { QRCodeSVG } from "qrcode.react";

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
  const dateLocale = locale === "es" ? es : enUS;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(form.form_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
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

        {isCompleted && submission?.pdf_url && (
          <a
            href={submission.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-8 py-4 rounded-full font-medium tracking-[0.08em] uppercase text-sm hover:bg-[#00E5A0] transition-colors flex items-center gap-3">
            <Download size={18} /> Descargar PDF
          </a>
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
                      ([key]) => section.keys.includes(key),
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
                          {sectionResponses.map(([q, a], qIdx) => (
                            <div key={qIdx} className="space-y-3">
                              <p className="text-[#333] text-[9px] uppercase tracking-[0.12em]">
                                {q.replace(/_/g, " ").replace(/^q /, "")}
                              </p>
                              <div className="bg-[#0A0A0A] border border-[#222] rounded-xl p-4 text-sm text-[#F5F5F0] leading-relaxed whitespace-pre-wrap">
                                {Array.isArray(a) ? (
                                  <div className="flex flex-wrap gap-2">
                                    {a.map((item, i) => (
                                      <span
                                        key={i}
                                        className="bg-[#111] border border-[#222] px-2 py-1 rounded text-[10px] uppercase tracking-wide">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  String(a)
                                )}
                              </div>
                            </div>
                          ))}
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
