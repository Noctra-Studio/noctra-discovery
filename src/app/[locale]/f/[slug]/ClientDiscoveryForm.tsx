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
import { useToast } from "@/components/ui/Toast";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";
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
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  error?: boolean;
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
      className={cn(
        "w-full bg-[#0A0A0A] border rounded-2xl px-4 py-3 md:py-[14px] text-[#F5F5F0] text-base md:text-sm placeholder:text-[#333] focus:outline-none focus:border-[#00E5A0]/50 transition-all resize-y min-h-[96px] leading-[1.6]",
        error ? "border-[#FFB800]/50" : "border-white/5",
      )}
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
            className={`min-h-[44px] px-4 py-2.5 border rounded-full text-base md:text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-200 ${
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
      className={`flex items-center gap-4 bg-[#0A0A0A] border border-white/5 rounded-2xl px-4 py-3 min-h-[52px] cursor-grab active:cursor-grabbing touch-none mb-3 transition-all hover:border-white/10 ${
        isDragging ? "opacity-35 scale-[0.98]" : ""
      }`}>
      <div className="font-medium text-[10px] tracking-[0.18em] uppercase text-[#00E5A0] w-4 flex-shrink-0">
        {(index + 1).toString().padStart(2, "0")}
      </div>
      <span className="text-[#F5F5F0] text-base md:text-[13px] font-light flex-1">
        {text}
      </span>
      <div className="text-[#333] text-sm flex-shrink-0">⋮⋮</div>
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
          className={`flex-1 min-h-[44px] border rounded-full text-[11px] font-medium tracking-[0.12em] uppercase transition-all ${
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

const STAGE_FOLLOWUP = {
  es: {
    starting: {
      label: "¿Qué te hizo dar el paso ahora?",
      hint: "¿Hubo algo que te dio el empujón para empezar? ¿O hay una fecha o meta concreta que te estás poniendo?",
      placeholder:
        "Ej: Renuncié a mi trabajo corporativo y decidí apostar por esto. Quiero tener mis primeros 5 clientes antes de que acabe el año.",
    },
    established: {
      label: "¿Qué está funcionando bien y qué sientes que le falta?",
      hint: "No hace falta que sea perfecto — queremos saber qué ya tiene tracción y dónde sientes que hay un techo.",
      placeholder:
        "Ej: Los clientes que llegan por referido cierran bien, pero no tenemos forma de atraer clientes nuevos sin depender de que alguien nos recomiende.",
    },
    struggling: {
      label:
        "¿Cuál sería el resultado que, si lo lograras en los próximos 6 meses, haría que valió la pena?",
      hint: "A veces los resultados no llegaron porque la estrategia no era la correcta, otras veces porque las expectativas no eran realistas. Cuéntanos qué esperabas y qué encontraste.",
      placeholder:
        "Ej: Esperaba tener flujo constante de clientes a los 6 meses de lanzar el sitio. Tenemos tráfico pero nadie convierte. Algo no está funcionando en el mensaje o en la propuesta.",
    },
    relaunching: {
      label: "¿Qué cambió? ¿Por qué ahora y no antes?",
      hint: "Entender qué pasó en la primera etapa nos ayuda a no repetir los mismos errores y construir sobre lo que sí funcionó.",
      placeholder:
        "Ej: La primera vez lo intenté solo y no pude con todo. Ahora tengo un socio y queremos hacerlo bien desde el inicio, con una identidad clara y un proceso definido.",
    },
  },
  en: {
    starting: {
      label: "What made you take the step now?",
      hint: "Was there something that pushed you to start? Or is there a specific date or goal you're setting for yourself?",
      placeholder:
        "E.g.: I left my corporate job and decided to bet on this. I want my first 5 clients before the end of the year.",
    },
    established: {
      label: "What's working well and what do you feel is missing?",
      hint: "It doesn't have to be perfect — we want to know what already has traction and where you feel there's a ceiling.",
      placeholder:
        "E.g.: Clients who come through referrals close well, but we have no way to attract new clients without depending on someone recommending us.",
    },
    struggling: {
      label:
        "What result, if achieved in the next 6 months, would make it all worth it?",
      hint: "Sometimes results didn't come because the strategy wasn't right, other times because expectations weren't realistic. Tell us what you expected and what you found.",
      placeholder:
        "E.g.: I expected a steady flow of clients within 6 months of launching the site. We have traffic but nobody converts. Something isn't working in the message or the offer.",
    },
    relaunching: {
      label: "What changed? Why now and not before?",
      hint: "Understanding what happened in the first phase helps us avoid repeating the same mistakes and build on what did work.",
      placeholder:
        "E.g.: The first time I tried it alone and couldn't handle everything. Now I have a partner and we want to do it right from the start, with a clear identity and a defined process.",
    },
  },
} as const;

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
          className="bg-transparent border-none text-[13px] text-white focus:outline-none flex-1 font-normal"
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
      <span className="text-[#555] text-[13px] font-normal group-hover:text-[#F5F5F0] transition-colors">
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
  error,
  id,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
  error?: string;
  id?: string;
}) => (
  <div className="mb-10 last:mb-0" id={id}>
    <label className="block text-[13px] font-medium text-[#F5F5F0] mb-1 uppercase tracking-wider">
      {label}
    </label>
    <p className="text-[12px] font-light text-[#555] mb-3 leading-[1.6]">
      {hint}
    </p>
    {children}
    <FieldError message={error} />
  </div>
);

/* --- MAIN COMPONENT --- */

export default function ClientDiscoveryForm({
  formId,
  slug,
  clientName,
  clientLogoUrl,
  directedTo,
  formLocale,
  dict,
  services = ["branding"],
}: {
  formId: string;
  slug: string;
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
  const { addToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [payload, setPayload] = useState<any>({
    language: formLocale,
    // Common
    q_origin: "",
    q_ideal_client: "",
    q_concrete_result: "",
    q_differentiator: "",
    q_previous_attempts: "",
    q_internal_obstacle: "",
    q_business_stage: null as
      | "starting"
      | "established"
      | "struggling"
      | "relaunching"
      | null,
    q_business_stage_detail: "",
    // Branding
    q_perception_rank: dict.chips.branding?.perception || [],
    q_visual_inspiration: "",
    q_visual_avoid: [],
    q_accent_color: "",
    q_accent_color_name: "",
    q_visual_style: [],
    q_voice_attrs: [],
    q_concrete_result_brand: "",
    q_tone_avoid: "",
    q_never: "",
    // Web
    web_current_site: "",
    web_goal: "",
    web_type: "",
    web_content_owner: "",
    web_features: [],
    web_deadline: "",
    // SEO
    seo_current_site: "",
    seo_target_keywords: "",
    seo_competitors: "",
    seo_previous_attempts: "",
    seo_content_capacity: "",
    seo_geo: "",
    seo_goal: "",
    // AI
    ai_current_tools: "",
    ai_pain_points: "",
    ai_first_priority: "",
    ai_processes: [],
    ai_team_size: "",
    ai_tech_level: "",
    ai_budget_range: "",
    // CRM
    crm_current_crm: "",
    crm_previous_attempt: "",
    crm_pain_points: "",
    crm_pipeline: "",
    crm_team_size: "",
    crm_integrations: [],
    crm_ai_features: [],
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
    // Validation
    const req = dict.common.required;
    const newErrors: Record<string, string> = {};
    if (!payload.q_origin.trim()) newErrors.q_origin = req;
    if (!payload.q_ideal_client.trim()) newErrors.q_ideal_client = req;
    if (!payload.q_concrete_result.trim()) newErrors.q_concrete_result = req;
    if (!payload.q_differentiator.trim()) newErrors.q_differentiator = req;
    if (!payload.q_previous_attempts.trim())
      newErrors.q_previous_attempts = req;
    if (!payload.q_internal_obstacle.trim())
      newErrors.q_internal_obstacle = req;
    if (!payload.q_business_stage) newErrors.q_business_stage = req;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast({
        title: "Atención",
        description:
          "Por favor revisa que hayas respondido todas las preguntas de la sección Empresa & Contexto",
        type: "info",
      });
      // Scroll to first error
      const firstError = Object.keys(newErrors)[0];
      const element = document.getElementById(`field-${firstError}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setView("submitting");
    setTimeout(() => setSubStatus("Generando PDF..."), 1500);
    setTimeout(() => setSubStatus("Enviando..."), 3000);

    // Simulate extra delay for animation UX
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const res = await submitDiscoveryForm(formId, slug, payload);
    if (!res.success) {
      addToast({
        title: "Error",
        description: res.error || "Error al enviar",
        type: "error",
      });
      setView("form");
      return;
    }

    if (res.emailSent === false || res.emailError) {
      console.error("===== ATENCIÓN: ERROR DE RESEND (EMAIL NO ENVIADO) =====");
      console.error(res.emailError);
      console.error("======================================================");
    }

    setView("success");
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
            <div className="font-black text-[28px] tracking-tight text-white mb-10 uppercase">
              {clientName}
            </div>
          )}

          <div className="font-medium text-[10px] tracking-[0.18em] text-[#555] uppercase mb-6">
            {dict.intro.eyebrow} · {clientName}
          </div>

          <div className="relative z-10 text-center max-w-4xl px-6">
            <h1 className="text-[52px] md:text-[86px] font-black mb-8 leading-[1.1] text-white uppercase">
              {directedTo ? (
                <>
                  <span className="block text-[#555] text-[32px] md:text-[52px] tracking-normal mb-2">
                    {dict.intro.title_hola.replace(
                      "{directedTo}",
                      directedTo.split(" ")[0],
                    )}
                  </span>
                  {dict.intro.title_cta}
                </>
              ) : (
                dict.intro.title
              )}
            </h1>
            <p className="text-lg md:text-xl text-[#555] font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              {dict.intro.description}
            </p>
          </div>

          <p className="font-medium text-[10px] text-[#555] tracking-[0.18em] mb-12 uppercase">
            {dict.intro.duration.replace(
              "{minutes}",
              (services.length * 5 + 5).toString(),
            )}
          </p>

          <button
            type="button"
            onClick={() => setView("form")}
            className="group min-h-[48px] rounded-full px-8 py-3.5 md:px-10 md:py-5 bg-white text-black font-medium tracking-[0.08em] uppercase text-base md:text-sm hover:bg-[#00E5A0] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 mx-auto relative z-20 cursor-pointer">
            {dict.intro.cta} <Plus size={18} />
          </button>
        </div>

        <footer className="absolute bottom-8 left-0 right-0 text-center">
          <div className="font-medium text-[9px] text-[#333] tracking-[0.18em] uppercase">
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

        <p className="font-medium text-[11px] uppercase tracking-[0.18em] text-[#00E5A0]">
          {subStatus === "Generando PDF..."
            ? dict.states?.submitting?.generatingPdf || "Generando PDF..."
            : subStatus === "Enviando..."
              ? dict.states?.submitting?.sending || "Enviando..."
              : dict.states?.submitting?.preparing || "Preparando..."}
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

        <h1 className="text-[clamp(48px,8vw,86px)] font-black leading-[0.95] tracking-tight uppercase mb-8">
          <span className="text-white block">
            {dict.states.success.title_1 || "Listo."}
          </span>
          <span className="text-[#333] block">
            {dict.states.success.title_2 || "Gracias."}
          </span>
        </h1>

        <div className="inline-block bg-[#00E5A0]/8 border border-[#00E5A0]/20 px-6 py-2.5 mb-8">
          <span className="font-medium text-[10px] tracking-[0.18em] text-[#00E5A0] uppercase">
            {dict.states.success.badge || "DISCOVERY ENVIADO"}
          </span>
        </div>

        <p className="text-[14px] font-light text-[#555] max-w-[420px] mx-auto mb-12 leading-relaxed">
          {dict.states.success.message}
        </p>

        <div className="font-medium text-[9px] text-[#333] tracking-[0.18em] uppercase">
          noctra.studio
        </div>
      </div>
    );
  }

  // --- FORM VIEW ---

  const calculateProgress = () => {
    const countFilled = (vals: any[]) =>
      vals.filter((v) => (Array.isArray(v) ? v.length > 0 : !!v)).length;

    let totalPoints = 6; // Common section has 6 required q's (+ business stage which is different)
    let filledPoints = countFilled([
      payload.q_origin,
      payload.q_ideal_client,
      payload.q_concrete_result,
      payload.q_differentiator,
      payload.q_previous_attempts,
      payload.q_internal_obstacle,
    ]);
    if (payload.q_business_stage) filledPoints++;
    totalPoints++;

    if (services.includes("branding")) {
      totalPoints += 8;
      filledPoints += countFilled([
        payload.q_visual_inspiration,
        payload.q_visual_avoid,
        payload.q_accent_color,
        payload.q_visual_style,
        payload.q_voice_attrs,
        payload.q_concrete_result_brand,
        payload.q_tone_avoid,
        payload.q_never,
      ]);
    }
    if (services.includes("web")) {
      totalPoints += 6;
      filledPoints += countFilled([
        payload.web_current_site,
        payload.web_goal,
        payload.web_type,
        payload.web_content_owner,
        payload.web_features,
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
            <div className="font-black text-base text-white tracking-widest uppercase">
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
          <span className="font-medium text-[9px] text-[#333] tracking-[0.18em] uppercase">
            {clientName} · Discovery
          </span>
        </div>
      </header>
      {/* Progress label (desktop) */}
      <div className="fixed top-[58px] left-0 right-0 flex justify-center z-30 hidden md:flex pointer-events-none">
        <span className="font-medium text-[9px] text-[#555] tracking-[0.18em] uppercase">
          {dict.percentageComplete.replace(
            "{percentage}",
            Math.round(calculateProgress()).toString(),
          )}
        </span>
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto pt-24 pb-40 px-5 md:px-10">
        {/* --- COMMON SECTION --- */}
        <section className="mb-20">
          <div className="p-8 lg:p-12 border border-white/5 bg-[#0A0A0A]/50 rounded-2xl md:rounded-3xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-1.5 bg-[#00E5A0]/10 text-[#00E5A0]">
                <Info size={14} />
              </span>
              <span className="font-medium text-[#00E5A0] text-[10px] uppercase tracking-[0.18em]">
                {dict.sections.common.eyebrow}
              </span>
            </div>
            <h2 className="text-[40px] md:text-[52px] font-black leading-none tracking-tight text-white mb-6 uppercase">
              {dict.sections.common.title}
            </h2>
            <p className="text-[#555] max-w-xl text-lg font-light leading-relaxed">
              {dict.sections.common.desc}
            </p>
          </div>

          <QBox
            label={dict.sections.common.questions.q_origin.label.replace(
              "{clientName}",
              clientName,
            )}
            hint={dict.sections.common.questions.q_origin.hint}
            error={errors.q_origin}
            id="field-q_origin">
            <AutoTextarea
              placeholder={dict.sections.common.questions.q_origin.placeholder}
              value={payload.q_origin}
              onChange={(val) => {
                setPayload({ ...payload, q_origin: val });
                if (errors.q_origin)
                  setErrors((prev) => {
                    const { q_origin, ...rest } = prev;
                    return rest;
                  });
              }}
              error={!!errors.q_origin}
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_ideal_client.label}
            hint={dict.sections.common.questions.q_ideal_client.hint}
            error={errors.q_ideal_client}
            id="field-q_ideal_client">
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_ideal_client.placeholder
              }
              value={payload.q_ideal_client}
              onChange={(val) => {
                setPayload({ ...payload, q_ideal_client: val });
                if (errors.q_ideal_client)
                  setErrors((prev) => {
                    const { q_ideal_client, ...rest } = prev;
                    return rest;
                  });
              }}
              error={!!errors.q_ideal_client}
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_concrete_result.label}
            hint={dict.sections.common.questions.q_concrete_result.hint}
            error={errors.q_concrete_result}
            id="field-q_concrete_result">
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_concrete_result.placeholder
              }
              value={payload.q_concrete_result}
              onChange={(val) => {
                setPayload({ ...payload, q_concrete_result: val });
                if (errors.q_concrete_result)
                  setErrors((prev) => {
                    const { q_concrete_result, ...rest } = prev;
                    return rest;
                  });
              }}
              error={!!errors.q_concrete_result}
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_differentiator.label}
            hint={dict.sections.common.questions.q_differentiator.hint}
            error={errors.q_differentiator}
            id="field-q_differentiator">
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_differentiator.placeholder
              }
              value={payload.q_differentiator}
              onChange={(val) => {
                setPayload({ ...payload, q_differentiator: val });
                if (errors.q_differentiator)
                  setErrors((prev) => {
                    const { q_differentiator, ...rest } = prev;
                    return rest;
                  });
              }}
              error={!!errors.q_differentiator}
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_previous_attempts.label}
            hint={dict.sections.common.questions.q_previous_attempts.hint}
            error={errors.q_previous_attempts}
            id="field-q_previous_attempts">
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_previous_attempts.placeholder
              }
              value={payload.q_previous_attempts}
              onChange={(val) => {
                setPayload({ ...payload, q_previous_attempts: val });
                if (errors.q_previous_attempts)
                  setErrors((prev) => {
                    const { q_previous_attempts, ...rest } = prev;
                    return rest;
                  });
              }}
              error={!!errors.q_previous_attempts}
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_internal_obstacle.label}
            hint={dict.sections.common.questions.q_internal_obstacle.hint}
            error={errors.q_internal_obstacle}
            id="field-q_internal_obstacle">
            <AutoTextarea
              placeholder={
                dict.sections.common.questions.q_internal_obstacle.placeholder
              }
              value={payload.q_internal_obstacle}
              onChange={(val) => {
                setPayload({ ...payload, q_internal_obstacle: val });
                if (errors.q_internal_obstacle)
                  setErrors((prev) => {
                    const { q_internal_obstacle, ...rest } = prev;
                    return rest;
                  });
              }}
              error={!!errors.q_internal_obstacle}
            />
          </QBox>

          <QBox
            label={dict.sections.common.questions.q_business_stage.label.replace(
              "{clientName}",
              clientName,
            )}
            error={errors.q_business_stage}
            id="field-q_business_stage"
            hint={dict.sections.common.questions.q_business_stage.hint}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  dict.sections.common.questions.q_business_stage.options,
                ).map(([key, label]: [any, any]) => {
                  const active = payload.q_business_stage === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setPayload({ ...payload, q_business_stage: key });
                        if (errors.q_business_stage)
                          setErrors((prev) => {
                            const { q_business_stage, ...rest } = prev;
                            return rest;
                          });
                      }}
                      className={cn(
                        "min-h-[44px] px-4 py-2.5 border rounded-2xl text-base md:text-[11px] font-medium tracking-[0.12em] uppercase transition-all duration-200 text-left md:text-center",
                        active
                          ? "border-[#00E5A0] text-[#00E5A0] bg-[#00E5A0]/5"
                          : errors.q_business_stage
                            ? "border-[#FFB800]/30 text-[#555] bg-red-500/5 hover:border-[#FFB800]/50"
                            : "border-white/5 text-[#555] hover:border-white/20 hover:text-white bg-[#0A0A0A]",
                      )}>
                      {label}
                    </button>
                  );
                })}
              </div>

              {payload.q_business_stage && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <QBox
                    label={
                      (STAGE_FOLLOWUP as any)[formLocale][
                        payload.q_business_stage
                      ].label
                    }
                    hint={
                      (STAGE_FOLLOWUP as any)[formLocale][
                        payload.q_business_stage
                      ].hint
                    }>
                    <AutoTextarea
                      placeholder={
                        (STAGE_FOLLOWUP as any)[formLocale][
                          payload.q_business_stage
                        ].placeholder
                      }
                      value={payload.q_business_stage_detail}
                      onChange={(val) =>
                        setPayload({ ...payload, q_business_stage_detail: val })
                      }
                    />
                  </QBox>
                </div>
              )}
            </div>
          </QBox>
        </section>

        {/* --- BRANDING SECTION --- */}
        {services.includes("branding") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 text-[#00E5A0]">
                  <Sparkles size={14} />
                </span>
                <span className="font-medium text-[#00E5A0] text-[10px] uppercase tracking-[0.18em]">
                  01 {dict.sections.branding.eyebrow}
                </span>
              </div>
              <h2 className="text-[40px] md:text-[52px] font-black leading-none tracking-tight text-white mb-6 uppercase">
                {dict.sections.branding.title.replace(
                  "{clientName}",
                  clientName,
                )}
              </h2>
              <p className="text-[#555] max-w-xl text-lg font-light leading-relaxed">
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
              label={dict.sections.branding.questions.q_visual_inspiration.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={dict.sections.branding.questions.q_visual_inspiration.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.branding.questions.q_visual_inspiration
                    .placeholder
                }
                value={payload.q_visual_inspiration}
                onChange={(val) =>
                  setPayload({ ...payload, q_visual_inspiration: val })
                }
              />
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_visual_avoid.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={dict.sections.branding.questions.q_visual_avoid.hint}>
              <ChipSelector
                options={dict.chips.branding.refs}
                selected={payload.q_visual_avoid}
                onChange={(s) => setPayload({ ...payload, q_visual_avoid: s })}
                max={5}
              />
              <div className="mt-3">
                <AddOptionItem
                  placeholder={
                    dict.sections.branding.questions.q_perception_rank
                      .customPlaceholder
                  }
                  addLabel={
                    dict.sections.branding.questions.q_perception_rank.addLabel
                  }
                  onAdd={(text) =>
                    setPayload({
                      ...payload,
                      q_visual_avoid: [...payload.q_visual_avoid, text],
                    })
                  }
                />
              </div>
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
                      className={`aspect-square rounded-2xl relative flex flex-col items-center justify-end p-2 border-2 transition-transform hover:scale-[1.04] ${isSelected ? "border-white" : "border-transparent"}`}
                      style={{ backgroundColor: c.hex }}>
                      {isSelected && (
                        <div
                          className={`absolute top-1.5 right-2 text-[10px] font-black drop-shadow-md ${isLight ? "text-black" : "text-white"}`}>
                          ✓
                        </div>
                      )}
                      <span
                        className={`font-medium text-[9px] uppercase tracking-[0.12em] truncate w-full text-center ${isLight ? "text-black/50" : "text-white/50"}`}>
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
                        className={`w-full aspect-square rounded-2xl relative flex flex-col items-center justify-end p-2 border-2 transition-transform hover:scale-[1.04] ${isCustomSelected ? "border-white" : "border-transparent"}`}
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
                        <span className="font-medium text-[9px] text-white/50 uppercase tracking-[0.12em] truncate w-full text-center">
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
              label={dict.sections.branding.questions.q_concrete_result_brand.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={
                dict.sections.branding.questions.q_concrete_result_brand.hint
              }>
              <AutoTextarea
                placeholder={
                  dict.sections.branding.questions.q_concrete_result_brand
                    .placeholder
                }
                value={payload.q_concrete_result_brand}
                onChange={(v) =>
                  setPayload({ ...payload, q_concrete_result_brand: v })
                }
              />
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_tone_avoid.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={dict.sections.branding.questions.q_tone_avoid.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.branding.questions.q_tone_avoid.placeholder
                }
                value={payload.q_tone_avoid}
                onChange={(v) => setPayload({ ...payload, q_tone_avoid: v })}
              />
            </QBox>

            <QBox
              label={dict.sections.branding.questions.q_never.label.replace(
                "{clientName}",
                clientName,
              )}
              hint={dict.sections.branding.questions.q_never.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.branding.questions.q_never.placeholder
                }
                value={payload.q_never}
                onChange={(v) => setPayload({ ...payload, q_never: v })}
              />
            </QBox>
          </section>
        )}

        {/* --- WEB SECTION --- */}
        {services.includes("web") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 text-[#00E5A0]">
                  <Layout size={14} />
                </span>
                <span className="font-medium text-[#00E5A0] text-[10px] uppercase tracking-[0.18em]">
                  02 {dict.sections.web.eyebrow}
                </span>
              </div>
              <h2 className="text-[40px] md:text-[52px] font-black leading-none tracking-tight text-white mb-6 uppercase">
                {dict.sections.web.title.replace("{clientName}", clientName)}
              </h2>
              <p className="text-[#555] max-w-xl text-lg font-light leading-relaxed">
                {dict.sections.web.desc.replace("{clientName}", clientName)}
              </p>
            </div>

            <QBox
              label={dict.sections.web.questions.web_current_site.label}
              hint={dict.sections.web.questions.web_current_site.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.web.questions.web_current_site.placeholder
                }
                value={payload.web_current_site}
                onChange={(v) =>
                  setPayload({ ...payload, web_current_site: v })
                }
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
              label={dict.sections.web.questions.web_content_owner.label}
              hint={dict.sections.web.questions.web_content_owner.hint}>
              <ChipSelector
                options={dict.chips.web.contentOwner}
                selected={[payload.web_content_owner]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    web_content_owner: s[s.length - 1] || "",
                  })
                }
                max={1}
              />
            </QBox>

            <QBox
              label={dict.sections.web.questions.web_features.label}
              hint={dict.sections.web.questions.web_features.hint}>
              <ChipSelector
                options={dict.chips.web.features}
                selected={payload.web_features}
                onChange={(s) => setPayload({ ...payload, web_features: s })}
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
                <span className="p-1.5 bg-[#00E5A0]/10 text-[#00E5A0]">
                  <TrendingUp size={14} />
                </span>
                <span className="font-medium text-[#00E5A0] text-[10px] uppercase tracking-[0.18em]">
                  03 {dict.sections.seo.eyebrow}
                </span>
              </div>
              <h2 className="text-[40px] md:text-[52px] font-black leading-none tracking-tight text-white mb-6 uppercase">
                {dict.sections.seo.title.replace("{clientName}", clientName)}
              </h2>
              <p className="text-[#555] max-w-xl text-lg font-light leading-relaxed">
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
              label={dict.sections.seo.questions.seo_previous_attempts.label}
              hint={dict.sections.seo.questions.seo_previous_attempts.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.seo.questions.seo_previous_attempts.placeholder
                }
                value={payload.seo_previous_attempts}
                onChange={(v) =>
                  setPayload({ ...payload, seo_previous_attempts: v })
                }
              />
            </QBox>

            <QBox
              label={dict.sections.seo.questions.seo_content_capacity.label}
              hint={dict.sections.seo.questions.seo_content_capacity.hint}>
              <ChipSelector
                options={dict.chips.seo.content}
                selected={[payload.seo_content_capacity]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    seo_content_capacity: s[s.length - 1] || "",
                  })
                }
                max={1}
              />
            </QBox>

            <QBox
              label={dict.sections.seo.questions.seo_geo.label}
              hint={dict.sections.seo.questions.seo_geo.hint}>
              <ChipSelector
                options={dict.chips.seo.geo}
                selected={[payload.seo_geo]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    seo_geo: s[s.length - 1] || "",
                  })
                }
                max={1}
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
                <span className="p-1.5 bg-[#00E5A0]/10 text-[#00E5A0]">
                  <Cpu size={14} />
                </span>
                <span className="font-medium text-[#00E5A0] text-[10px] uppercase tracking-[0.18em]">
                  04 {dict.sections.ai.eyebrow}
                </span>
              </div>
              <h2 className="text-[40px] md:text-[52px] font-black leading-none tracking-tight text-white mb-6 uppercase">
                {dict.sections.ai.title.replace("{clientName}", clientName)}
              </h2>
              <p className="text-[#555] max-w-xl text-lg font-light leading-relaxed">
                {dict.sections.ai.desc}
              </p>
            </div>

            <QBox
              label={
                dict.sections["ai-automations"].questions.ai_current_tools.label
              }
              hint={
                dict.sections["ai-automations"].questions.ai_current_tools.hint
              }>
              <AutoTextarea
                placeholder={
                  dict.sections["ai-automations"].questions.ai_current_tools
                    .placeholder
                }
                value={payload.ai_current_tools}
                onChange={(v) =>
                  setPayload({ ...payload, ai_current_tools: v })
                }
              />
            </QBox>

            <QBox
              label={
                dict.sections["ai-automations"].questions.ai_pain_points.label
              }
              hint={
                dict.sections["ai-automations"].questions.ai_pain_points.hint
              }>
              <AutoTextarea
                placeholder={
                  dict.sections["ai-automations"].questions.ai_pain_points
                    .placeholder
                }
                value={payload.ai_pain_points}
                onChange={(v) => setPayload({ ...payload, ai_pain_points: v })}
              />
            </QBox>

            <QBox
              label={
                dict.sections["ai-automations"].questions.ai_first_priority
                  .label
              }
              hint={
                dict.sections["ai-automations"].questions.ai_first_priority.hint
              }>
              <AutoTextarea
                placeholder={
                  dict.sections["ai-automations"].questions.ai_first_priority
                    .placeholder
                }
                value={payload.ai_first_priority}
                onChange={(v) =>
                  setPayload({ ...payload, ai_first_priority: v })
                }
              />
            </QBox>

            <QBox
              label={
                dict.sections["ai-automations"].questions.ai_processes.label
              }
              hint={
                dict.sections["ai-automations"].questions.ai_processes.hint
              }>
              <ChipSelector
                options={dict.chips.ai.processes}
                selected={payload.ai_processes}
                onChange={(s) => setPayload({ ...payload, ai_processes: s })}
              />
            </QBox>

            <QBox
              label={
                dict.sections["ai-automations"].questions.ai_team_size.label
              }
              hint={
                dict.sections["ai-automations"].questions.ai_team_size.hint
              }>
              <ChipSelector
                options={dict.chips.ai.team}
                selected={[payload.ai_team_size]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    ai_team_size: s[s.length - 1] || "",
                  })
                }
                max={1}
              />
            </QBox>

            <QBox
              label={
                dict.sections["ai-automations"].questions.ai_tech_level.label
              }
              hint={
                dict.sections["ai-automations"].questions.ai_tech_level.hint
              }>
              <ChipSelector
                options={dict.chips.ai.tech}
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
              label={
                dict.sections["ai-automations"].questions.ai_budget_range.label
              }
              hint={
                dict.sections["ai-automations"].questions.ai_budget_range.hint
              }>
              <ChipSelector
                options={dict.chips.ai.budget}
                selected={[payload.ai_budget_range]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    ai_budget_range: s[s.length - 1] || "",
                  })
                }
                max={1}
              />
            </QBox>
          </section>
        )}

        {/* --- CRM SECTION --- */}
        {services.includes("crm") && (
          <section className="mb-20">
            <div className="mb-16 pt-16 border-t border-[#1a1a1a]">
              <div className="flex items-center gap-3 mb-2">
                <span className="p-1.5 bg-[#00E5A0]/10 text-[#00E5A0]">
                  <Database size={14} />
                </span>
                <span className="font-medium text-[#00E5A0] text-[10px] uppercase tracking-[0.18em]">
                  05 {dict.sections.crm.eyebrow}
                </span>
              </div>
              <h2 className="text-[40px] md:text-[52px] font-black leading-none tracking-tight text-white mb-6 uppercase">
                {dict.sections.crm.title.replace("{clientName}", clientName)}
              </h2>
              <p className="text-[#555] max-w-xl text-lg font-light leading-relaxed">
                {dict.sections.crm.desc}
              </p>
            </div>

            <QBox
              label={dict.sections.crm.questions.crm_current_crm.label}
              hint={dict.sections.crm.questions.crm_current_crm.hint}>
              <ChipSelector
                options={dict.chips.crm.current}
                selected={[payload.crm_current_crm]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    crm_current_crm: s[s.length - 1] || "",
                  })
                }
                max={1}
              />
            </QBox>

            <QBox
              label={dict.sections.crm.questions.crm_previous_attempt.label}
              hint={dict.sections.crm.questions.crm_previous_attempt.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.crm.questions.crm_previous_attempt.placeholder
                }
                value={payload.crm_previous_attempt}
                onChange={(v) =>
                  setPayload({ ...payload, crm_previous_attempt: v })
                }
              />
            </QBox>

            <QBox
              label={dict.sections.crm.questions.crm_pain_points.label}
              hint={dict.sections.crm.questions.crm_pain_points.hint}>
              <AutoTextarea
                placeholder={
                  dict.sections.crm.questions.crm_pain_points.placeholder
                }
                value={payload.crm_pain_points}
                onChange={(v) => setPayload({ ...payload, crm_pain_points: v })}
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
              label={dict.sections.crm.questions.crm_team_size.label}
              hint={dict.sections.crm.questions.crm_team_size.hint}>
              <ChipSelector
                options={dict.chips.crm.team}
                selected={[payload.crm_team_size]}
                onChange={(s) =>
                  setPayload({
                    ...payload,
                    crm_team_size: s[s.length - 1] || "",
                  })
                }
                max={1}
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
              label={dict.sections.crm.questions.crm_ai_features.label}
              hint={dict.sections.crm.questions.crm_ai_features.hint}>
              <ChipSelector
                options={dict.chips.crm.ai}
                selected={payload.crm_ai_features}
                onChange={(s) => setPayload({ ...payload, crm_ai_features: s })}
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
            disabled={Math.round(calculateProgress()) < 100}
            className="bg-white hover:bg-[#00E5A0] text-black rounded-full px-10 py-4 font-medium tracking-[0.08em] uppercase text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">
            {dict.submit} →
          </button>
        </div>
      </footer>
    </div>
  );
}
