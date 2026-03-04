"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ColorOption {
  hex: string;
  name: string;
}

export interface ColorPickerProps {
  colors: ColorOption[];
  selected: string;
  onChange: (hex: string) => void;
  className?: string;
}

export function ColorPicker({
  colors,
  selected,
  onChange,
  className,
}: ColorPickerProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {colors.map((color) => {
        const isSelected = selected === color.hex;
        return (
          <button
            key={color.hex}
            type="button"
            onClick={() => onChange(color.hex)}
            className="group flex flex-col items-center gap-3 focus-visible:outline-none"
            aria-pressed={isSelected}>
            <div
              className={cn(
                "h-16 w-full transition-all duration-200",
                "border border-gray-2/50",
                isSelected &&
                  "ring-2 ring-white ring-offset-2 ring-offset-black scale-[1.04]",
                !isSelected && "group-hover:scale-[1.04]",
              )}
              style={{ backgroundColor: color.hex }}>
              {isSelected && (
                <div className="flex h-full w-full items-center justify-center mix-blend-difference">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="font-medium text-sm text-white">
                {color.name}
              </span>
              <span className="font-mono text-xs text-gray-3">{color.hex}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
