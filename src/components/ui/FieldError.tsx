"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-2 text-[#FFB800] animate-in fade-in slide-in-from-top-1 duration-300",
        className,
      )}>
      <AlertCircle size={12} className="flex-shrink-0" />
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] leading-none">
        {message}
      </span>
    </div>
  );
}
