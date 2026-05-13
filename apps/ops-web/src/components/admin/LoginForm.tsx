"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { login, type LoginState } from "@/app/[locale]/admin/login/actions";

export default function LoginForm() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  useEffect(() => {
    if (searchParams.get("reset") === "true") {
      addToast({
        title: t("auth.login.resetSuccess"),
        type: "success",
      });
      // Optionally clean the URL
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [searchParams, addToast, t]);

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    { error: "" },
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="text-red-500 text-[11px] font-medium tracking-[0.05em] uppercase text-center">
          {t("admin.login.error")}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#555]">
          {t("admin.login.emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full bg-[#141414] border border-[#222] rounded-xl px-4 py-3 text-white text-base md:text-sm placeholder:text-[#555] focus:border-white focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#555]">
          {t("admin.login.passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full bg-[#141414] border border-[#222] rounded-xl px-4 py-3 text-white text-base md:text-sm placeholder:text-[#555] focus:border-white focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full min-h-[48px] bg-white text-black rounded-full font-medium py-3 text-base md:text-sm uppercase tracking-[0.08em] hover:bg-[#00E5A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isPending ? "..." : t("admin.login.submitButton")}
        </button>

        <div className="text-center mt-4">
          <Link
            href="/admin/forgot-password"
            className="font-medium text-[10px] tracking-[0.18em] text-[#333] hover:text-white transition-colors uppercase">
            {t("auth.login.forgotPasswordLink")}
          </Link>
        </div>
      </div>
    </form>
  );
}
