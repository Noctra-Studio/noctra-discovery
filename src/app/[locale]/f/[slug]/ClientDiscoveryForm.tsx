"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ExternalLink,
  Palette,
  Plus,
  Sparkles,
  Layout,
  TrendingUp,
  Cpu,
  Database,
  Info,
} from "lucide-react";
import { submitDiscoveryForm } from "./actions";
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* --- HELPER COMPONENTS --- */

// Auto-resizing Textarea
const AutoTextarea = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0A0A0A] border border-white/5 rounded-xl px-[18px] py-[14px] text-[#F5F5F0] font-body text-sm placeholder:text-[#333] focus:outline-none focus:border-[#00E5A0]/50 transition-all resize-y min-h-[96px] leading-[1.6]"
      placeholder={placeholder}
    />
  );
};

// Multi-select Chips
const ChipSelector = ({
  options,
  selected,
  onChange,
  max = 3,
}: {
  options: string[];
  selected: string[];
  onChange: (s: string[]) => void;
  max?: number;
}) => {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
    else if (selected.length < max) onChange([...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            disabled={!active && selected.length >= max}
            className={`min-h-[44px] px-[22px] py-2 border rounded-full font-sans text-xs transition-all duration-200 ${
              active
                ? "border-[#00E5A0] text-[#00E5A0] bg-[#00E5A0]/5"
                : "border-white/5 text-[#555] hover:border-white/20 hover:text-white bg-[#0A0A0A]"
            } disabled:opacity-40 disabled:cursor-not-allowed`}>
            {opt}
          </button>
        );
      })}
    </div>
  );
};

// Drag Sortable Item
const SortableItem = ({
  id,
  text,
  index,
}: {
  id: string;
  text: string;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-4 bg-[#0A0A0A] border border-white/5 rounded-xl px-[18px] py-[13px] cursor-grab active:cursor-grabbing touch-none mb-3 transition-all hover:border-white/10 ${
        isDragging ? "opacity-35 scale-[0.98]" : ""
      }`}>
      <div className="font-mono text-[10px] text-[#00E5A0] w-4 flex-shrink-0">
        {(index + 1).toString().padStart(2, "0")}
      </div>
      <span className="font-body text-gray-200 text-[13px] font-light flex-1">
        {text}
      </span>
      <div className="text-[#333] text-sm">⋮⋮</div>
    </div>
  );
};

// Toggle Switch
const Toggle = ({
  value,
  onChange,
  labels = ["Sí", "No"],
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  labels?: [string, string];
}) => (
  <div className="flex gap-2">
    {labels.map((label, idx) => {
      const active = idx === 0 ? value : !value;
      return (
        <button
          key={label}
          type="button"
          onClick={() => onChange(idx === 0)}
          className={`flex-1 min-h-[44px] border first:rounded-l-full last:rounded-r-full font-sans text-xs transition-all ${
            active
              ? "border-[#00E5A0] text-[#00E5A0] bg-[#00E5A0]/5"
              : "border-white/5 text-[#555] hover:border-white/20 bg-[#0A0A0A]"
          }`}>
          {label}
        </button>
      );
    })}
  </div>
);

// Add Option Item (for ranking)
const AddOptionItem = ({
  onAdd,
  placeholder,
  addLabel,
}: {
  onAdd: (text: string) => void;
  placeholder: string;
  addLabel: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (text.trim()) {
      onAdd(text.trim());
      setText("");
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-4 bg-[#0A0A0A] border border-[#00E5A0]/30 rounded-xl px-[18px] py-[13px] mb-3 animate-in fade-in duration-300">
        <div className="w-4 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") setIsEditing(false);
          }}
          onBlur={handleConfirm}
          placeholder={placeholder}
          className="bg-transparent border-none text-[13px] text-white focus:outline-none flex-1 font-body font-normal"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="w-full flex items-center gap-4 bg-transparent border border-white/5 border-dashed rounded-xl px-[18px] py-[13px] mb-3 hover:border-[#00E5A0]/30 transition-all group animate-in fade-in duration-300">
      <div className="text-[#333] group-hover:text-[#00E5A0] transition-colors">
        <Plus size={16} />
      </div>
      <span className="font-body text-[#555] text-[13px] font-normal group-hover:text-gray-300 transition-colors">
        {addLabel}
      </span>
    </button>
  );
};

// Question Box Wrapper
const QBox = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10 last:mb-0">
    <label className="block text-[13px] font-medium text-[#F5F5F0] mb-1 uppercase tracking-wider">
      {label}
    </label>
    <p className="font-body text-[12px] font-light text-[#555] mb-3 leading-[1.6]">
      {hint}
    </p>
    {children}
  </div>
);

/* --- MAIN COMPONENT --- */

export default function ClientDiscoveryForm({
  formId,
  clientName,
  clientLogoUrl,
  directedTo,
  formLocale,
  dict,
  services = ["branding"],
}: {
  formId: string;
  clientName: string;
  clientLogoUrl: string | null;
  directedTo: string;
  formLocale: string;
  dict: any;
  services: string[];
}) {
  const [view, setView] = useState<"intro" | "form" | "submitting" | "success">(
    "intro",
  );

  // Form State
  const [payload, setPayload] = useState<any>({
    language: formLocale,
    // Common
    q_company_one_liner: "",
    q_company_why: "",
    q_company_adjectives: "",
    q_ideal_client: "",
    q_differentiator: "",
    // Branding
    q_perception_rank: dict.chips.branding?.perception || [],
    q_visual_refs: [],
    q_accent_color: "",
    q_accent_color_name: "",
    q_visual_style: [],
    q_keep_elements: "",
    q_voice_attrs: [],
    q_tagline: "",
    q_tone_avoid: "",
    q_never: "",
    // Web
    web_type: "",
    web_pages: [],
    web_references: "",
    web_has_content: false,
    web_features: [],
    web_integrations: [],
    web_deadline: "",
    web_goal: "",
    // SEO
    seo_current_site: "",
    seo_target_keywords: "",
    seo_competitors: "",
    seo_geo: "",
    seo_content_capacity: "",
    seo_current_traffic: "",
    seo_goal: "",
    // AI
    ai_current_tools: "",
    ai_pain_points: "",
    ai_processes: [],
    ai_data_sources: "",
    ai_team_size: "",
    ai_tech_level: "",
    ai_budget_range: "",
    ai_timeline: "",
    // CRM
    crm_current_crm: "",
    crm_pain_points: "",
    crm_team_size: "",
    crm_pipeline: "",
    crm_avg_deals: "",
    crm_integrations: [],
    crm_ai_features: [],
    crm_main_goal: "",
  });

  // Submission Progress State
  const [subStatus, setSubStatus] = useState("Preparando...");

  // Custom Color Ref
  const colorInputRef = useRef<HTMLInputElement>(null);

  // DND Sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPayload((prev: any) => {
        const oldIndex = prev.q_perception_rank.indexOf(active.id as string);
        const newIndex = prev.q_perception_rank.indexOf(over.id as string);
        return {
          ...prev,
          q_perception_rank: arrayMove(
            prev.q_perception_rank,
            oldIndex,
            newIndex,
          ),
        };
      });
    }
  };

  const submitForm = async () => {
    setView("submitting");
    setTimeout(() => setSubStatus("Generando PDF..."), 1500);
    setTimeout(() => setSubStatus("Enviando..."), 3000);

    // Simulate extra delay for animation UX
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await submitDiscoveryForm(formId, payload);
    if (res.success) {
      setView("success");
    } else {
      alert(res.error || "Error al enviar");
      setView("form");
    }
  };

  /* --- RENDER VIEWS --- */

  if (view === "intro") {
    return (
      <div
        className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
        style={{ backgroundColor: "#080808" }}>
        {/* Grid Background */}
        <div
          className="absolute inset-0 bg-[#080808] pointer-events-none"
          style={{ backgroundColor: "#080808" }}>
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {clientLogoUrl ? (
            <img
              src={clientLogoUrl}
              alt={clientName}
              className="max-h-16 max-w-[200px] object-contain mb-10 mx-auto"
            />
          ) : (
            <div className="font-display text-[28px] tracking-[0.1em] text-white mb-10 uppercase">
              {clientName}
            </div>
          )}

          <div className="font-mono text-[10px] tracking-[0.4em] text-[#555] uppercase mb-6">
            BRAND DISCOVERY · {clientName}
          </div>

          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-[-0.04em] text-white">
              {dict.intro.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              {dict.intro.subtitle}
            </p>
          </div>

          <p className="font-mono text-[10px] text-[#555] tracking-[0.15em] mb-12 uppercase">
            ~{services.length * 5 + 5} MINUTOS · SOLO SE PUEDE ENVIAR UNA VEZ
          </p>

          <button
            type="button"
            onClick={() => setView("form")}
            className="group px-10 py-5 bg-white text-black font-semibold rounded-full tracking-[0.08em] uppercase text-sm hover:bg-[#00E5A0] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mx-auto relative z-20 cursor-pointer">
            {dict.intro.cta} <Plus size={18} />
          </button>
        </div>

        <footer className="absolute bottom-8 left-0 right-0 text-center">
          <div className="font-mono text-[9px] text-[#333] tracking-[0.2em] uppercase">
            Powered by Noctra Studio
          </div>
        </footer>
      </div>
    );
  }

  if (view === "submitting") {
    // Changed 'view' to 'step'
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0.5;
            }
          }
          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>

        {/* Mocking the 4All Logo Pulse */}
        <div className="w-16 h-16 relative mb-8 animate-[pulse_2s_ease-in-out_infinite] flex items-center justify-center">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[26px] border-b-white" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          {dict.states.submitting.title}
        </h2>

        <div className="w-[200px] h-[1px] bg-[#222] overflow-hidden relative mb-6">
          <div className="absolute top-0 left-0 w-full h-full bg-[#00E5A0] animate-[shimmer_1.2s_ease-in-out_infinite]" />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5A0]">
          {subStatus}
        </p>
      </div>
    );
  }

  if (view === "success") {
    // Changed 'view' to 'step'
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <style jsx>{`
          @keyframes drawCheck {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>

        <div className="mb-12">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="38"
              fill="none"
              stroke="#00E5A0"
              strokeWidth="1"
              strokeOpacity="0.1"
            />
            <path
              d="M25 40 L35 50 L55 30"
              fill="none"
              stroke="#00E5A0"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset="100"
              className="animate-[drawCheck_0.6s_ease_forwards_0.2s]"
            />
          </svg>
        </div>

        <h1 className="font-display text-[clamp(48px,8vw,96px)] leading-[0.9] uppercase mb-8">
          <span className="text-white block">Listo.</span>
          <span className="text-[#555] block">Gracias.</span>
        </h1>

        <div className="inline-block bg-[#00E5A0]/8 border border-[#00E5A0]/20 px-6 py-2.5 mb-8">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#00E5A0] uppercase">
            DISCOVERY ENVIADO
          </span>
        </div>

        <p className="font-body text-[14px] font-light text-[#555] max-w-[420px] mx-auto mb-12">
          {dict.states.success.message}
        </p>

        <div className="font-mono text-[9px] text-[#333] tracking-[0.15em] uppercase">
          noctra.studio
        </div>
      </div>
    );
  }

  // --- FORM VIEW ---

  const calculateProgress = () => {
    const countFilled = (vals: any[]) =>
      vals.filter((v) => (Array.isArray(v) ? v.length > 0 : !!v)).length;

    let totalPoints = 5; // Common section has 5 q's
    let filledPoints = countFilled([
      payload.q_company_one_liner,
      payload.q_company_why,
      payload.q_company_adjectives,
      payload.q_ideal_client,
      payload.q_differentiator,
    ]);

    if (services.includes("branding")) {
      totalPoints += 5;
      filledPoints += countFilled([
        payload.q_visual_refs,
        payload.q_accent_color,
        payload.q_visual_style,
        payload.q_voice_attrs,
        payload.q_tagline,
      ]);
    }
    if (services.includes("web")) {
      totalPoints += 4;
      filledPoints += countFilled([
        payload.web_type,
        payload.web_pages,
        payload.web_goal,
        payload.web_deadline,
      ]);
    }

    return Math.min(100, Math.max(5, (filledPoints / totalPoints) * 100));
  };

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col animate-in slide-in-from-bottom-5 duration-700">
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#080808]/95 backdrop-blur border-b border-[#222] z-40 flex items-center px-5 md:px-14">
        <div className="flex-1 flex items-center gap-3">
          {clientLogoUrl ? (
            <img
              src={clientLogoUrl}
              alt="Logo"
              className="max-h-6 object-contain"
            />
          ) : (
            <div className="font-display text-base text-white tracking-widest uppercase">
              {clientName}
            </div>
          )}
        </div>

        <div className="absolute left-0 bottom-0 w-full h-[1px] bg-[#222]">
          <div
            className="h-full bg-[#00E5A0] transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        <div className="hidden md:block flex-1 text-right">
          <span className="font-mono text-[9px] text-[#333] tracking-[0.2em] uppercase">
            {clientName} · Discovery
          </span>
        </div>
      </header>

      {/* Progress label (desktop) */}
      <div className="fixed top-[58px] left-0 right-0 flex justify-center z-30 hidden md:flex pointer-events-none">
        <span className="font-mono text-[9px] text-[#555] tracking-[0.2em] uppercase">
          {Math.round(calculateProgress())}% COMPLETADO
        </span>
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto pt-24 pb-40 px-4 sm:px-8">
        {/* --- COMMON SECTION --- */}
        <section className="mb-20">
          <div className="p-8 lg:p-12 border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-xl relative overflow-hidden rounded-2xl">
            {" "}
            {/* Updated className */}
            <div className="flex items-center gap-3 mb-2">
              <span className="p-1.5 bg-[#00E5A0]/10 rounded-lg text-[#00E5A0]">
                <Info size={14} />
              </span>
              <span className="font-mono text-[#00E5A0] text-[9px] uppercase tracking-[0.4em] font-medium">
                {dict.sections.common.eyebrow}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              {dict.sections.common.title}
            </h2>
            <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
              {dict.sections.common.desc}
            </p>
          </div>

          <QBox
            label={dict.sections.common.questions.q_company_one_liner.label.replace(
              "{clientName}",
              clientName,
            )}
            hint={dict.sections.common.questions.q_company_one_liner.hint}>
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_company_one_liner.placeholder
              }
              value={payload.q_company_one_liner}
              onChange={(val) =>
                setPayload({ ...payload, q_company_one_liner: val })
              }
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_company_why.label.replace(
              "{clientName}",
              clientName,
            )}
            hint={dict.sections.common.questions.q_company_why.hint}>
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_company_why.placeholder
              }
              value={payload.q_company_why}
              onChange={(val) => setPayload({ ...payload, q_company_why: val })}
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_company_adjectives.label.replace(
              "{clientName}",
              clientName,
            )}
            hint={dict.sections.common.questions.q_company_adjectives.hint}>
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_company_adjectives.placeholder
              }
              value={payload.q_company_adjectives}
              onChange={(val) =>
                setPayload({ ...payload, q_company_adjectives: val })
              }
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_ideal_client.label}
            hint={dict.sections.common.questions.q_ideal_client.hint}>
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_ideal_client.placeholder
              }
              value={payload.q_ideal_client}
              onChange={(val) =>
                setPayload({ ...payload, q_ideal_client: val })
              }
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_differentiator.label}
            hint={dict.sections.common.questions.q_differentiator.hint}>
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_differentiator.placeholder
              }
              value={payload.q_differentiator}
              onChange={(val) =>
                setPayload({ ...payload, q_differentiator: val })
              }
            />
          </QBox>
        </section>

        {/* --- BRANDING SECTION --- */}
        {services.includes("branding") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 rounded-lg text-[#00E5A0]">
                  <Sparkles size={14} />
                </span>
                <span className="font-mono text-[#00E5A0] text-[9px] uppercase tracking-[0.4em] font-medium">
                  01 {dict.sections.branding.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-[clamp(36px,5vw,52px)] text-white mb-2 leading-none uppercase">
                {dict.sections.branding.title.replace(
                  "{clientName}",
                  clientName,
                )}
              </h2>
              <p className="font-body text-[13px] font-light text-[#555]">
                {dict.sections.branding.desc.replace(
                  "{clientName}",
                  clientName,
                )}
              </p>
            </div>

            <QBox
              label={dict.sections.branding.questions.q_perception_rank.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={dict.sections.branding.questions.q_perception_rank.hint}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}>
                <SortableContext
                  items={payload.q_perception_rank}
                  strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {payload.q_perception_rank.map(
                      (item: string, i: number) => (
                        <SortableItem
                          key={item}
                          id={item}
                          text={item}
                          index={i}
                        />
                      ),
                    )}
                    <AddOptionItem
                      addLabel={
                        dict.sections.branding.questions.q_perception_rank
                          .addLabel
                      }
                      placeholder={
                        dict.sections.branding.questions.q_perception_rank
                          .customPlaceholder
                      }
                      onAdd={(text) =>
                        setPayload({
                          ...payload,
                          q_perception_rank: [
                            ...payload.q_perception_rank,
                            text,
                          ],
                        })
                      }
                    />
                  </div>
                </SortableContext>
              </DndContext>
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_visual_refs.label}
              hint={dict.sections.branding.questions.q_visual_refs.hint}>
              <ChipSelector
                options={dict.chips.branding.refs}
                selected={payload.q_visual_refs}
                onChange={(s) => setPayload({ ...payload, q_visual_refs: s })}
              />
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_accent_color.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={dict.sections.branding.questions.q_accent_color.hint}>
              <div className="grid grid-cols-3 gap-2">
                {dict.colors.map((c: any) => {
                  const isSelected = payload.q_accent_color === c.hex;
                  const isLight = c.hex === "#F5F5F0" || c.hex === "#EAFF00"; // Simple check for known light colors
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() =>
                        setPayload({
                          ...payload,
                          q_accent_color: c.hex,
                          q_accent_color_name: c.name,
                        })
                      }
                      className={`aspect-square relative flex flex-col items-center justify-end p-2 border-2 transition-transform hover:scale-[1.04] ${isSelected ? "border-white" : "border-transparent"}`}
                      style={{ backgroundColor: c.hex }}>
                      {isSelected && (
                        <div
                          className={`absolute top-1.5 right-2 text-xs font-bold drop-shadow-md ${isLight ? "text-black" : "text-white"}`}>
                          ✓
                        </div>
                      )}
                      <span
                        className={`font-mono text-[8px] uppercase tracking-tighter truncate w-full text-center ${isLight ? "text-black/50" : "text-white/50"}`}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}

                {/* 9th Box: Custom Color Picker */}
                <div className="relative">
                  <input
                    ref={colorInputRef}
                    type="color"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-0"
                    onChange={(e) => {
                      const newColor = e.target.value.toUpperCase();
                      setPayload({
                        ...payload,
                        q_accent_color: newColor,
                        q_accent_color_name: dict.customColor.customLabel,
                      });
                    }}
                  />
                  {(() => {
                    const isPredefined = dict.colors.some(
                      (c: any) => c.hex === payload.q_accent_color,
                    );
                    const isCustomSelected =
                      payload.q_accent_color !== "" && !isPredefined;

                    return (
                      <button
                        type="button"
                        onClick={() => colorInputRef.current?.click()}
                        className={`w-full aspect-square relative flex flex-col items-center justify-end p-2 border-2 transition-transform hover:scale-[1.04] ${isCustomSelected ? "border-white" : "border-transparent"}`}
                        style={{
                          background: isCustomSelected
                            ? payload.q_accent_color
                            : "conic-gradient(from 0deg, #FF3D00, #EAFF00, #00FF88, #00E5B8, #0057FF, #A855F7, #FF3D00)",
                        }}>
                        {!isCustomSelected && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <Palette className="w-8 h-8 text-white" />
                          </div>
                        )}

                        {isCustomSelected && (
                          <div className="absolute top-1.5 right-2 text-xs font-bold text-white drop-shadow-md">
                            ✓
                          </div>
                        )}
                        <span className="font-mono text-[8px] text-white/50 uppercase tracking-tighter truncate w-full text-center">
                          {isCustomSelected
                            ? payload.q_accent_color
                            : dict.customColor.label}
                        </span>
                      </button>
                    );
                  })()}
                </div>
              </div>
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_visual_style.label}
              hint={dict.sections.branding.questions.q_visual_style.hint}>
              <ChipSelector
                options={dict.chips.branding.style}
                selected={payload.q_visual_style}
                onChange={(s) => setPayload({ ...payload, q_visual_style: s })}
              />
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_voice_attrs.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={dict.sections.branding.questions.q_voice_attrs.hint}>
              <ChipSelector
                options={dict.chips.branding.voice}
                selected={payload.q_voice_attrs}
                onChange={(s) => setPayload({ ...payload, q_voice_attrs: s })}
              />
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_tagline.label}
              hint={dict.sections.branding.questions.q_tagline.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.branding.questions.q_tagline.placeholder
                }
                value={payload.q_tagline}
                onChange={(v) => setPayload({ ...payload, q_tagline: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_tone_avoid.label}
              hint={dict.sections.branding.questions.q_tone_avoid.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.branding.questions.q_tone_avoid.placeholder
                }
                value={payload.q_tone_avoid}
                onChange={(v) => setPayload({ ...payload, q_tone_avoid: v })}
              />
            </QBox>
          </section>
        )}

        {/* --- WEB SECTION --- */}
        {services.includes("web") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 rounded-lg text-[#00E5A0]">
                  <Layout size={14} />
                </span>
                <span className="font-mono text-[#00E5A0] text-[9px] uppercase tracking-[0.4em] font-medium">
                  02 {dict.sections.web.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-[clamp(36px,5vw,52px)] text-white mb-2 leading-none uppercase">
                {dict.sections.web.title.replace("{clientName}", clientName)}
              </h2>
              <p className="font-body text-[13px] font-light text-[#555]">
                {dict.sections.web.desc.replace("{clientName}", clientName)}
              </p>
            </div>

            <QBox
              label={dict.sections.web.questions.web_type.label}
              hint={dict.sections.web.questions.web_type.hint}>
              <ChipSelector
                options={dict.chips.web.type}
                selected={[payload.web_type]}
                onChange={(s) =>
                  setPayload({ ...payload, web_type: s[s.length - 1] || "" })
                }
                max={1}
              />
            </QBox>

            <QBox
              label={dict.sections.web.questions.web_pages.label}
              hint={dict.sections.web.questions.web_pages.hint}>
              <ChipSelector
                options={dict.chips.web.pages}
                selected={payload.web_pages}
                onChange={(s) => setPayload({ ...payload, web_pages: s })}
                max={10}
              />
            </QBox>

            <QBox
              label={dict.sections.web.questions.web_has_content.label}
              hint={dict.sections.web.questions.web_has_content.hint}>
              <Toggle
                value={payload.web_has_content}
                onChange={(v) => setPayload({ ...payload, web_has_content: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.web.questions.web_goal.label}
              hint={dict.sections.web.questions.web_goal.hint}>
              <AutoTextarea
                placeholder={dict.sections.web.questions.web_goal.placeholder}
                value={payload.web_goal}
                onChange={(v) => setPayload({ ...payload, web_goal: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.web.questions.web_deadline.label}
              hint={dict.sections.web.questions.web_deadline.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.web.questions.web_deadline.placeholder
                }
                value={payload.web_deadline}
                onChange={(v) => setPayload({ ...payload, web_deadline: v })}
              />
            </QBox>
          </section>
        )}

        {/* --- SEO SECTION --- */}
        {services.includes("seo") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 rounded-lg text-[#00E5A0]">
                  <TrendingUp size={14} />
                </span>
                <span className="font-mono text-[#00E5A0] text-[9px] uppercase tracking-[0.4em] font-medium">
                  03 {dict.sections.seo.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-[clamp(36px,5vw,52px)] text-white mb-2 leading-none uppercase">
                {dict.sections.seo.title.replace("{clientName}", clientName)}
              </h2>
              <p className="font-body text-[13px] font-light text-[#555]">
                {dict.sections.seo.desc}
              </p>
            </div>

            <QBox
              label={dict.sections.seo.questions.seo_current_site.label}
              hint={dict.sections.seo.questions.seo_current_site.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.seo.questions.seo_current_site.placeholder
                }
                value={payload.seo_current_site}
                onChange={(v) =>
                  setPayload({ ...payload, seo_current_site: v })
                }
              />
            </QBox>

            <QBox
              label={dict.sections.seo.questions.seo_target_keywords.label}
              hint={dict.sections.seo.questions.seo_target_keywords.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.seo.questions.seo_target_keywords.placeholder
                }
                value={payload.seo_target_keywords}
                onChange={(v) =>
                  setPayload({ ...payload, seo_target_keywords: v })
                }
              />
            </QBox>

            <QBox
              label={dict.sections.seo.questions.seo_competitors.label}
              hint={dict.sections.seo.questions.seo_competitors.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.seo.questions.seo_competitors.placeholder
                }
                value={payload.seo_competitors}
                onChange={(v) => setPayload({ ...payload, seo_competitors: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.seo.questions.seo_goal.label}
              hint={dict.sections.seo.questions.seo_goal.hint}>
              <AutoTextarea
                placeholder={dict.sections.seo.questions.seo_goal.placeholder}
                value={payload.seo_goal}
                onChange={(v) => setPayload({ ...payload, seo_goal: v })}
              />
            </QBox>
          </section>
        )}

        {/* --- AI AUTOMATIONS SECTION --- */}
        {services.includes("ai-automations") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 rounded-lg text-[#00E5A0]">
                  <Cpu size={14} />
                </span>
                <span className="font-mono text-[#00E5A0] text-[9px] uppercase tracking-[0.4em] font-medium">
                  04 {dict.sections.ai.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-[clamp(36px,5vw,52px)] text-white mb-2 leading-none uppercase">
                {dict.sections.ai.title.replace("{clientName}", clientName)}
              </h2>
              <p className="font-body text-[13px] font-light text-[#555]">
                {dict.sections.ai.desc}
              </p>
            </div>

            <QBox
              label={dict.sections.ai.questions.ai_pain_points.label}
              hint={dict.sections.ai.questions.ai_pain_points.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.ai.questions.ai_pain_points.placeholder
                }
                value={payload.ai_pain_points}
                onChange={(v) => setPayload({ ...payload, ai_pain_points: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.ai.questions.ai_processes.label}
              hint={dict.sections.ai.questions.ai_processes.hint}>
              <ChipSelector
                options={dict.chips.ai.processes}
                selected={payload.ai_processes}
                onChange={(s) => setPayload({ ...payload, ai_processes: s })}
              />
            </QBox>

            <QBox
              label={dict.sections.ai.questions.ai_tech_level.label}
              hint={dict.sections.ai.questions.ai_tech_level.hint}>
              <ChipSelector
                options={dict.chips.ai.level}
                selected={[payload.ai_tech_level]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    ai_tech_level: s[s.length - 1] || "",
                  })
                }
                max={1}
              />
            </QBox>

            <QBox
              label={dict.sections.ai.questions.ai_timeline.label}
              hint={dict.sections.ai.questions.ai_timeline.hint}>
              <AutoTextarea
                placeholder={dict.sections.ai.questions.ai_timeline.placeholder}
                value={payload.ai_timeline}
                onChange={(v) => setPayload({ ...payload, ai_timeline: v })}
              />
            </QBox>
          </section>
        )}

        {/* --- CRM SECTION --- */}
        {services.includes("crm") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 rounded-lg text-[#00E5A0]">
                  <Database size={14} />
                </span>
                <span className="font-mono text-[#00E5A0] text-[9px] uppercase tracking-[0.4em] font-medium">
                  05 {dict.sections.crm.eyebrow}
                </span>
              </div>
              <h2 className="font-display text-[clamp(36px,5vw,52px)] text-white mb-2 leading-none uppercase">
                {dict.sections.crm.title.replace("{clientName}", clientName)}
              </h2>
              <p className="font-body text-[13px] font-light text-[#555]">
                {dict.sections.crm.desc}
              </p>
            </div>

            <QBox
              label={dict.sections.crm.questions.crm_current_crm.label}
              hint={dict.sections.crm.questions.crm_current_crm.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.crm.questions.crm_current_crm.placeholder
                }
                value={payload.crm_current_crm}
                onChange={(v) => setPayload({ ...payload, crm_current_crm: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.crm.questions.crm_pipeline.label}
              hint={dict.sections.crm.questions.crm_pipeline.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.crm.questions.crm_pipeline.placeholder
                }
                value={payload.crm_pipeline}
                onChange={(v) => setPayload({ ...payload, crm_pipeline: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.crm.questions.crm_integrations.label}
              hint={dict.sections.crm.questions.crm_integrations.hint}>
              <ChipSelector
                options={dict.chips.crm.integrations}
                selected={payload.crm_integrations}
                onChange={(s) =>
                  setPayload({ ...payload, crm_integrations: s })
                }
              />
            </QBox>

            <QBox
              label={dict.sections.crm.questions.crm_main_goal.label}
              hint={dict.sections.crm.questions.crm_main_goal.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.crm.questions.crm_main_goal.placeholder
                }
                value={payload.crm_main_goal}
                onChange={(v) => setPayload({ ...payload, crm_main_goal: v })}
              />
            </QBox>
          </section>
        )}
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-40">
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
          style={{
            background: "linear-gradient(to top, #080808 0%, transparent 100%)",
          }}
        />
        <div className="relative px-5 md:px-14 pb-8 pt-4 flex justify-end max-w-7xl mx-auto">
          <button
            onClick={submitForm}
            disabled={!payload.q_company_one_liner}
            className="bg-white hover:bg-[#00E5A0] text-black px-10 py-4 rounded-full font-semibold tracking-[0.08em] uppercase text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
            {dict.submit} →
          </button>
        </div>
      </footer>
    </div>
  );
}
