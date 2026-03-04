"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, autoResize = true, ...props }, ref) => {
    const defaultRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef =
      (ref as React.RefObject<HTMLTextAreaElement>) || defaultRef;

    React.useEffect(() => {
      if (!autoResize) return;
      const textarea = textareaRef.current;
      if (textarea) {
        const adjustHeight = () => {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
        };
        textarea.addEventListener("input", adjustHeight);
        // Initial adjust
        adjustHeight();
        return () => textarea.removeEventListener("input", adjustHeight);
      }
    }, [autoResize, textareaRef, props.value]);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-white flex justify-between">
            {label}
            {hint && <span className="text-gray-3">{hint}</span>}
          </label>
        )}
        <textarea
          ref={textareaRef}
          className={cn(
            "flex min-h-[80px] w-full border border-gray-2 bg-gray-1 px-3 py-2 text-sm text-white transition-colors focus-visible:outline-none focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            error && "border-red-500 focus-visible:border-red-500",
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
