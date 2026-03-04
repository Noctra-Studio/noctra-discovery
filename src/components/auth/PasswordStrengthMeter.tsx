"use client";

import { useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";

interface PasswordStrengthMeterProps {
  password: string;
  onValidChange: (isValid: boolean) => void;
}

// 100 most common passwords to block outright.
const commonPasswords = new Set([
  "123456",
  "password",
  "12345678",
  "qwerty",
  "123456789",
  "12345",
  "1234",
  "111111",
  "1234567",
  "dragon",
  "123123",
  "baseball",
  "monkey",
  "Letmein1!",
  "football",
  "shadow",
  "mustang",
  "superman",
  "1234567890",
  "michael",
  "master",
  "cheese",
  "joshua",
  "batman",
  "princess",
  "iloveyou",
  "daniel",
  "12345678910",
  "12301230",
  "test",
  "amigo",
  "amigos",
  "amigos12-",
  "Amigos12-",
  "admin",
  "admin123",
  "admin1234",
  "admin12345",
  "admin123456",
]);

type Requirement = {
  id: string;
  labelKey: string;
  test: (p: string) => boolean;
};

const requirements: Requirement[] = [
  { id: "length", labelKey: "length", test: (p) => p.length >= 12 },
  { id: "uppercase", labelKey: "uppercase", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", labelKey: "lowercase", test: (p) => /[a-z]/.test(p) },
  { id: "number", labelKey: "number", test: (p) => /[0-9]/.test(p) },
  {
    id: "special",
    labelKey: "special",
    test: (p) => /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/~\\]/.test(p),
  },
  {
    id: "noSpaces",
    labelKey: "noSpaces",
    test: (p) => p.length > 0 && !/\s/.test(p),
  },
];

type StrengthLevel =
  | "empty"
  | "weak"
  | "fair"
  | "good"
  | "strong"
  | "very-strong";

const getStrengthLevel = (score: number): StrengthLevel => {
  if (score === 0) return "empty";
  if (score <= 1) return "weak";
  if (score <= 2) return "fair";
  if (score <= 3) return "good";
  if (score <= 4) return "strong";
  return "very-strong";
};

const strengthColors: Record<StrengthLevel, string> = {
  empty: "bg-transparent",
  weak: "bg-red-500",
  fair: "bg-orange-500",
  good: "bg-yellow-500",
  strong: "bg-lime-500",
  "very-strong": "bg-green-500",
};

const strengthWidths: Record<StrengthLevel, string> = {
  empty: "w-0",
  weak: "w-1/5",
  fair: "w-2/5",
  good: "w-3/5",
  strong: "w-4/5",
  "very-strong": "w-full",
};

export default function PasswordStrengthMeter({
  password,
  onValidChange,
}: PasswordStrengthMeterProps) {
  const t = useTranslations("auth.resetPassword");

  const results = useMemo(() => {
    const res = requirements.map((req) => ({
      ...req,
      passed: req.test(password),
    }));

    const isCommon = commonPasswords.has(password.toLowerCase());

    let baseScore = res.filter((r) => r.passed).length;

    // Penalize if common
    if (isCommon) baseScore = Math.max(0, baseScore - 3);

    // Bonus points
    if (password.length >= 16) baseScore += 1;
    const specialMatch = password.match(
      /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/~\\]/g,
    );
    if (specialMatch && specialMatch.length >= 2) baseScore += 1;

    // Cap score at 5
    const finalScore = Math.min(5, baseScore);
    const level =
      password.length === 0 ? "empty" : getStrengthLevel(finalScore);

    // Validate overall: all standard requirements + not a common password
    const allReqsMet = res.every((r) => r.passed) && !isCommon;

    return {
      checklist: res,
      isCommon,
      level,
      score: finalScore,
      allReqsMet,
    };
  }, [password]);

  // Notify parent of validity changes
  useEffect(() => {
    onValidChange(results.allReqsMet);
  }, [results.allReqsMet, onValidChange]);

  return (
    <div className="space-y-3 w-full animate-in fade-in duration-300">
      {/* Strength Bar */}
      <div className="flex items-center gap-3">
        <div className="h-[3px] flex-1 bg-[#141414] relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${
              strengthWidths[results.level]
            } ${strengthColors[results.level]}`}
          />
        </div>
        {results.level !== "empty" && (
          <span
            className={`text-xs font-mono uppercase tracking-wider transition-colors duration-300 ${strengthColors[
              results.level
            ].replace("bg-", "text-")}`}>
            {results.level === "very-strong"
              ? t(`strength.veryStrong`)
              : t(
                  `strength.${results.level as "weak" | "fair" | "good" | "strong"}`,
                )}
          </span>
        )}
      </div>

      {/* Constraints Checklist */}
      <ul className="space-y-1.5 pt-1">
        {results.checklist.map((req) => {
          const isPending = password.length === 0;
          const isFailed = password.length > 0 && !req.passed;
          const isPassed = req.passed;

          return (
            <li
              key={req.id}
              className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-[#888] transition-colors duration-200">
              <span className="w-3 flex justify-center">
                {isPending && <span className="text-[#555]">○</span>}
                {isPassed && <span className="text-[#00E5A0]">✓</span>}
                {isFailed && <span className="text-red-500">✗</span>}
              </span>
              <span
                className={`${isPassed ? "text-[#ccc]" : isFailed ? "text-red-400" : ""}`}>
                {t(`requirements.${req.labelKey as any}`)}
              </span>
            </li>
          );
        })}

        {/* Anti-common password hidden requirement feedback */}
        {results.isCommon && (
          <li className="flex items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-red-500 transition-colors duration-200 animate-in fade-in">
            <span className="w-3 flex justify-center">✗</span>
            <span>Esta contraseña es muy común. Elige otra.</span>
          </li>
        )}
      </ul>
    </div>
  );
}
