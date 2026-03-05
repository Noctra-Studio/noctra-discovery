"use client";

import * as React from "react";
import { Modal } from "./Modal";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-md p-0 overflow-hidden border border-[#222] bg-[#0A0A0A] rounded-2xl shadow-2xl">
      <div className="p-8">
        <div className="flex items-start gap-5">
          <div
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border",
              variant === "danger" &&
                "bg-red-500/10 border-red-500/20 text-red-500",
              variant === "warning" &&
                "bg-orange-500/10 border-orange-500/20 text-orange-500",
              variant === "info" && "bg-accent/10 border-accent/20 text-accent",
            )}>
            {variant === "danger" || variant === "warning" ? (
              <AlertTriangle size={24} />
            ) : (
              <Info size={24} />
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-[#F5F5F0] uppercase tracking-tight leading-none">
              {title}
            </h3>
            <p className="text-[14px] text-[#888] font-light leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-all border border-transparent hover:border-[#333]">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "px-8 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-[0.12em] transition-all flex items-center gap-2",
              variant === "danger" &&
                "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]",
              variant === "warning" &&
                "bg-orange-500 hover:bg-orange-400 text-white",
              variant === "info" &&
                "bg-accent hover:bg-[#00f5ab] text-black shadow-[0_0_20px_rgba(0,229,160,0.2)]",
              isLoading && "opacity-50 cursor-not-allowed",
            )}>
            {isLoading ? (
              <>
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
