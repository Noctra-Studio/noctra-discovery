import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, hint, error, icon, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-white flex justify-between">
            {label}
            {hint && <span className="text-gray-3">{hint}</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              "flex h-11 w-full border border-gray-2 bg-gray-1 px-3 py-2 text-sm text-white transition-colors focus-visible:outline-none focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:border-red-500",
              icon && "pl-10",
              className,
            )}
            ref={ref}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-3">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
