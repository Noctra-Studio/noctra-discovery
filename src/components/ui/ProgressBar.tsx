"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  label?: string;
}

export function ProgressBar({
  value,
  label,
  className,
  ...props
}: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full flex flex-col gap-2", className)} {...props}>
      {label && (
        <div className="flex justify-between font-medium text-[10px] tracking-[0.18em] uppercase text-gray-400">
          <span>{label}</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className="h-[2px] w-full bg-gray-2 overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-400 ease-out"
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
