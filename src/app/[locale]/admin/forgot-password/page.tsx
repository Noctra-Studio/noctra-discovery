import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#080808] flexflex-col relative overflow-hidden selection:bg-[#00E5A0] selection:text-black">
      {/* Background elements (matching LoginForm) */}
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
            <ForgotPasswordForm />
          </div>
        </main>
      </div>
    </div>
  );
}
