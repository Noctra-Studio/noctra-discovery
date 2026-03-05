import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { NextIntlClientProvider } from "next-intl";
import esMessages from "@/messages/es.json";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${locale}/admin`);
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Logo + Branding */}
        <div className="w-56 mb-8 relative flex justify-center">
          <img
            src="/noctra-logo-white.png"
            alt="Noctra Logo"
            className="w-full h-auto object-contain"
          />
        </div>
        <span className="font-medium text-[#111] text-[10px] tracking-[0.3em] uppercase mb-10 text-center">
          Panel Administrativo
        </span>

        {/* Login Card */}
        <div className="w-full border border-[#222] p-8 bg-[#080808]">
          <NextIntlClientProvider locale="es" messages={esMessages}>
            <LoginForm />
          </NextIntlClientProvider>
        </div>
      </div>
    </div>
  );
}
