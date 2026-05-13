import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";
import esMessages from "@/messages/es.json";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  if (!code) {
    return <ErrorState />;
  }

  const supabase = await createClient();

  // Exchange the code for a session on the server
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth Code Exchange Error:", error);
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col relative overflow-hidden selection:bg-[#00E5A0] selection:text-black">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,20,20,1)_0%,rgba(8,8,8,1)_100%)]" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="p-8 flex justify-center lg:justify-start">
          <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z"
              fill="white"
            />
            <path
              d="M50 20L75.9808 35V65L50 80L24.0192 65V35L50 20Z"
              fill="black"
            />
          </svg>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-[400px]">
            <NextIntlClientProvider locale="es" messages={esMessages}>
              <ResetPasswordForm />
            </NextIntlClientProvider>
          </div>
        </main>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,20,20,1)_0%,rgba(8,8,8,1)_100%)]" />

      <div className="relative z-10 space-y-8 max-w-sm">
        <div className="w-16 h-16 bg-red-500/10 flex items-center justify-center border border-red-500/20 mx-auto animate-in zoom-in duration-500">
          <span className="text-red-500 font-black text-4xl">!</span>
        </div>

        <div className="space-y-4">
          <h1 className="font-black text-[40px] md:text-5xl text-white tracking-tight uppercase">
            Link expirado.
          </h1>
          <p className="text-[#555] text-[13px] leading-relaxed font-light">
            Este link para restablecer contraseña ya no es válido o ha expirado.
            Los links de recuperación tienen una validez de 1 hora.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <Link
            href="/admin/forgot-password"
            className="w-full block bg-white text-black font-medium py-3 text-sm uppercase tracking-[0.08em] hover:bg-[#00E5A0] transition-colors text-center">
            Solicitar nuevo link →
          </Link>
          <Link
            href="/admin/login"
            className="block font-medium text-[10px] tracking-[0.18em] text-[#555] hover:text-white transition-colors uppercase">
            ← Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
