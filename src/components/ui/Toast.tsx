"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto dismiss after 4s
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastViewport toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Actual rendered toasts
function ToastViewport({
  toasts,
  removeToast,
}: {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed right-0 top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px] gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body,
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) {
  // Simple progress bar animation using CSS transitions
  const [progress, setProgress] = React.useState(100);

  React.useEffect(() => {
    // Start depleting immediately
    const timer = setTimeout(() => {
      setProgress(0);
    }, 50); // slight delay to allow transition to register
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col overflow-hidden bg-gray-1 border border-gray-2 rounded-xl text-white shadow-lg pointer-events-auto",
        "animate-in slide-in-from-right-full fade-in duration-300",
      )}
      role="alert">
      <div className="flex w-full justify-between gap-4 p-4 pr-10">
        <div className="flex flex-col gap-0.5">
          <h3
            className={cn(
              "text-[14px] font-black uppercase tracking-tight",
              toast.type === "error" && "text-red-500",
              toast.type === "success" && "text-accent",
            )}>
            {toast.title}
          </h3>
          {toast.description && (
            <p className="text-[13px] opacity-80 font-light leading-tight">
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 p-1 opacity-0 transition-opacity rounded-full group-hover:opacity-100 hover:bg-white/10">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-2">
        <div
          className={cn(
            "h-full transition-all ease-linear",
            toast.type === "error"
              ? "bg-red-500"
              : toast.type === "success"
                ? "bg-accent"
                : "bg-white",
          )}
          style={{
            width: `${progress}%`,
            // Exact match for the 4s auto-dismiss minus fade time
            transitionDuration: "3900ms",
          }}
        />
      </div>
    </div>
  );
}
