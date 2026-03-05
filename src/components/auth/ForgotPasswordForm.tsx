"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || countdown > 0) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // We don't check for errors because the API always returns 200 generic success for anti-enumeration
      await res.json();

      setIsSent(true);
      setCountdown(60);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSent) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#141414] border border-[#222] rounded-2xl flex items-center justify-center relative">
            <svg
              className="w-8 h-8 text-[#555]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#00E5A0] rounded-full flex items-center justify-center animate-in zoom-in spin-in-12 duration-500 delay-300">
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="font-black text-4xl text-white tracking-tight uppercase">
            {t("auth.forgotPassword.sent.title")}
          </h2>
          <p className="text-[13px] text-[#888] font-light leading-relaxed max-w-[280px] mx-auto">
            {t("auth.forgotPassword.sent.description", { email })}
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <button
            onClick={handleSubmit}
            disabled={countdown > 0 || isSubmitting}
            className="w-full min-h-[48px] bg-[#141414] border border-[#222] rounded-full text-white font-medium py-3 text-base md:text-sm tracking-wider hover:bg-[#222] hover:border-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting
              ? "..."
              : countdown > 0
                ? t("auth.forgotPassword.sent.resendCountdown", {
                    seconds: countdown,
                  })
                : t("auth.forgotPassword.sent.resendBtn")}
          </button>

          <div className="text-center">
            <Link
              href="/admin/login"
              className="font-medium text-[10px] tracking-[0.18em] text-[#555] hover:text-white transition-colors uppercase">
              {t("auth.forgotPassword.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-10">
        <p className="font-medium text-[10px] tracking-[0.18em] text-[#00E5A0] uppercase">
          {t("auth.forgotPassword.eyebrow")}
        </p>
        <h1 className="font-black text-5xl md:text-6xl text-white tracking-tight uppercase">
          {t("auth.forgotPassword.title")}
        </h1>
        <p className="text-[13px] text-[#888] font-light leading-relaxed max-w-[280px] mx-auto">
          {t("auth.forgotPassword.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#333]">
            {t("auth.forgotPassword.emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#141414] border border-[#222] rounded-xl px-4 py-3 text-white text-base md:text-sm placeholder:text-[#555] focus:border-white focus:outline-none transition-colors"
          />
        </div>

        <div className="space-y-4 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="w-full min-h-[48px] bg-white text-black rounded-full font-medium py-3 text-base md:text-sm uppercase tracking-[0.08em] hover:bg-[#00E5A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "..." : t("auth.forgotPassword.submitBtn")}
          </button>

          <div className="text-center mt-4">
            <Link
              href="/admin/login"
              className="font-medium text-[10px] tracking-[0.18em] text-[#555] hover:text-white transition-colors uppercase">
              {t("auth.forgotPassword.backToLogin")}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
