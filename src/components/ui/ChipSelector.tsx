"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  className?: string;
}

export function ChipSelector({
  options,
  selected,
  onChange,
  multiple = false,
  className,
}: ChipSelectorProps) {
  const toggleSelection = (option: string) => {
    if (multiple) {
      if (selected.includes(option)) {
        onChange(selected.filter((item) => item !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange(selected.includes(option) ? [] : [option]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggleSelection(option)}
            className={cn(
              "inline-flex min-h-[44px] items-center justify-center px-4 py-2 text-sm font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
              // Dark mode basic styling
              "border border-gray-2 bg-transparent text-gray-3",
              isSelected &&
                "border-accent bg-accent/10 text-accent scale-[1.02]",
              !isSelected && "hover:border-gray-3 hover:text-white",
            )}
            aria-pressed={isSelected}>
            {option}
          </button>
        );
      })}
    </div>
  );
}
