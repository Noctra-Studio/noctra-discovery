"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { login, type LoginState } from "@/app/[locale]/admin/login/actions";

export default function LoginForm() {
  const t = useTranslations("admin.login");
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    login,
    { error: "" }
  );

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="text-red-500 text-sm font-mono text-center">
          {t("error")}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-xs font-mono uppercase tracking-widest text-[#888]"
        >
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full bg-[#141414] border border-[#222] px-4 py-3 text-white font-body text-sm placeholder:text-[#555] focus:border-white focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-xs font-mono uppercase tracking-widest text-[#888]"
        >
          {t("passwordLabel")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full bg-[#141414] border border-[#222] px-4 py-3 text-white font-body text-sm placeholder:text-[#555] focus:border-white focus:outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-white text-black font-body font-medium py-3 text-sm uppercase tracking-wider hover:bg-[#00E5A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "..." : t("submitButton")}
      </button>
    </form>
  );
}
