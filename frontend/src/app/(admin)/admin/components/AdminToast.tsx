"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface AdminToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function AdminToast({ toasts, onDismiss }: AdminToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-[#090F21]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.1)] animate-in slide-in-from-bottom-5 duration-200"
        >
          {toast.type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          {toast.type === "error" && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          {toast.type === "info" && (
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-white tracking-tight">
              {toast.title}
            </h5>
            {toast.message && (
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Tutup notifikasi"
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
