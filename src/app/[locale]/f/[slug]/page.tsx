import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import ClientDiscoveryForm from "./ClientDiscoveryForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return { title: `Brand Discovery - ${slug}` };
}

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();

  const { data: form, error } = await supabase
    .from("discovery_forms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !form) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-black text-8xl text-white/5 mb-4 uppercase">404</h1>
        <p className="text-[#555] text-lg font-light">Este link no existe.</p>
        <div className="mt-12 text-[#333] font-medium text-[10px] tracking-[0.18em] uppercase">
          noctra.studio
        </div>
      </div>
    );
  }

  // Rule 2: Use form.language strictly
  const formLocale = form.language || "es";
  const dateLocale = formLocale === "es" ? es : enUS;

  if (form.status === "completed") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Simplified Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 relative flex-shrink-0">
              <img
                src="/noctra-logo-white.png"
                alt="Noctra"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-gray-600 text-2xl">×</span>
            <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <span className="text-green-500 font-black text-2xl">✓</span>
            </div>
          </div>

          <h1 className="font-black text-[40px] md:text-5xl text-white mb-6 tracking-tight uppercase">
            Ya enviado.
          </h1>

          <p className="text-[#555] text-lg mb-8 leading-relaxed font-light">
            {form.directed_to} ya completó el Brand Discovery para{" "}
            <span className="text-white font-medium">{form.client_name}</span>.
          </p>

          <div className="inline-flex items-center px-4 py-1.5 font-medium text-[10px] tracking-[0.18em] uppercase bg-green-500/10 text-green-400 border border-green-500/20">
            PROCESO COMPLETADO
          </div>
        </div>

        <div className="absolute bottom-8 text-[#222] font-medium text-[10px] tracking-[0.18em] uppercase">
          noctra.studio
        </div>
      </div>
    );
  }

  if (form.expires_at && new Date(form.expires_at) < new Date()) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative">
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-8">
            <span className="text-red-500 font-black text-3xl">!</span>
          </div>
          <h1 className="font-black text-4xl text-white mb-4 tracking-tight uppercase">
            Link expirado.
          </h1>
          <p className="text-[#555] mb-2 font-light">
            Este enlace prescribió el{" "}
            {format(new Date(form.expires_at), "PPP", { locale: dateLocale })}.
          </p>
          <p className="text-[#555] text-sm font-light">
            Contacta a Noctra Studio para generar uno nuevo.
          </p>
        </div>
        <div className="absolute bottom-8 text-[#222] font-medium text-[10px] tracking-[0.18em] uppercase">
          noctra.studio
        </div>
      </div>
    );
  }

  // Pass raw dictionary to avoid next-intl locale conflicts
  const messages = (await import(`../../../../messages/${formLocale}.json`))
    .default;
  const dict = {
    ...messages.discoveryForm,
    common: messages.common,
  };

  // OK -> Render Form
  return (
    <ClientDiscoveryForm
      formId={form.id}
      slug={form.slug}
      clientName={form.client_name}
      clientLogoUrl={form.client_logo_url}
      directedTo={form.directed_to}
      formLocale={formLocale}
      dict={dict}
      services={form.services}
    />
  );
}
