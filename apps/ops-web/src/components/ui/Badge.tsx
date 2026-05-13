import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "pending" | "error" | "info";
}

function Badge({ className, variant = "info", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border px-2.5 py-0.5 font-medium text-[10px] tracking-[0.18em] uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-accent",
        {
          "bg-green-950 text-green-400 border-green-800": variant === "success",
          "bg-gray-800 text-gray-400 border-gray-700": variant === "pending",
          "bg-red-950 text-red-400 border-red-800": variant === "error",
          "bg-gray-1 text-white border-gray-2": variant === "info",
        },
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
