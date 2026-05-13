"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

// Intentionally using anon key since we have an active session established via the `code` exchange on server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isStrengthValid, setIsStrengthValid] = useState(false);
  const [hasConfirmBlurred, setHasConfirmBlurred] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordsMatch = password === confirmPassword;

  // Show error only if they have blurred the confirm field at least once
  const showMismatchError =
    hasConfirmBlurred && !passwordsMatch && confirmPassword.length > 0;

  // Submit is enabled only when strength is 100% compliant AND passwords match
  const canSubmit =
    isStrengthValid &&
    passwordsMatch &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      // Force sign out just in case, redirecting to login should re-evaluate session cleanly
      await supabase.auth.signOut();

      router.push("/admin/login?reset=true");
    } catch (err) {
      console.error("Failed to update password:", err);
      setIsSubmitting(false);
    }
  };

  const handleStrengthValidChange = useCallback((isValid: boolean) => {
    setIsStrengthValid(isValid);
  }, []);

  const EyeIcon = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button
      type="button"
      onClick={toggle}
      className="absolute right-3 top-3 text-[#555] hover:text-white transition-colors"
      aria-label={show ? "Hide password" : "Show password"}>
      {show ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 mb-4">
        <p className="font-medium text-[10px] tracking-[0.18em] text-[#00E5A0] uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="font-black text-5xl md:text-6xl text-white tracking-tight uppercase">
          {t("title")}
        </h1>
        <p className="text-[13px] text-[#888] font-light leading-relaxed max-w-[280px] mx-auto">
          {t("description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div className="space-y-2">
          <label
            htmlFor="new-pwd"
            className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#333]">
            {t("newPasswordLabel")}
          </label>
          <div className="relative">
            <input
              id="new-pwd"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              spellCheck="false"
              autoCorrect="off"
              required
              className="w-full bg-[#141414] border border-[#222] rounded-xl pl-4 pr-10 py-3 text-white text-base md:text-sm placeholder:text-[#555] focus:border-white focus:outline-none transition-colors"
            />
            <EyeIcon
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>

        {/* Strength Meter */}
        <div className="-mt-2 mb-4">
          <PasswordStrengthMeter
            password={password}
            onValidChange={handleStrengthValidChange}
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="confirm-pwd"
            className="block text-[10px] font-medium uppercase tracking-[0.18em] text-[#333]">
            {t("confirmPasswordLabel")}
          </label>
          <div className="relative">
            <input
              id="confirm-pwd"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setHasConfirmBlurred(true)}
              autoComplete="new-password"
              spellCheck="false"
              autoCorrect="off"
              required
              // Border logic dynamically responding to mismatch
              className={`w-full bg-[#141414] border rounded-xl pl-4 pr-10 py-3 text-white text-base md:text-sm placeholder:text-[#555] focus:outline-none transition-colors ${
                showMismatchError
                  ? "border-red-500 focus:border-red-500"
                  : confirmPassword.length > 0 && passwordsMatch
                    ? "border-[#00E5A0]"
                    : "border-[#222] focus:border-white"
              }`}
            />
            <EyeIcon
              show={showConfirm}
              toggle={() => setShowConfirm(!showConfirm)}
            />

            {/* Inline checkmark if exactly matching and not empty */}
            {confirmPassword.length > 0 && passwordsMatch && (
              <div className="absolute right-10 top-[14px]">
                <span className="text-[#00E5A0]">✓</span>
              </div>
            )}
          </div>

          {showMismatchError && (
            <p className="text-red-500 font-medium text-[10px] tracking-[0.12em] uppercase mt-1">
              {t("mismatch")}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full relative min-h-[48px] flex items-center justify-center bg-white text-black font-medium py-3 text-base md:text-sm uppercase tracking-[0.08em] hover:bg-[#00E5A0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{t("updating")}</span>
              </div>
            ) : (
              t("submitBtn")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
