"use client";

import React from "react";
import { Sparkles, ShieldCheck, Database, X, Cpu } from "lucide-react";

interface AdminInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminInfoModal({ isOpen, onClose }: AdminInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Glass Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#090F21]/95 backdrop-blur-2xl border border-white/[0.12] p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.12)] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup Dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Pusat Kendali FINUSA Admin
            </h3>
            <p className="text-xs text-slate-400">
              Arsitektur & Manajemen Platform Finansial Nusantara
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-5 space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <p>
            Dashboard Admin FINUSA dirancang dengan filosofi desain modern berbasis <em>macOS Apple Glassmorphism</em>, mengedepankan keterbacaan tinggi, hierarki informasi yang jernih, dan kendali data yang presisi.
          </p>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Keamanan Berlapis (Dual-Check RBAC)</strong>
                <span className="text-slate-400 text-[11px]">
                  Verifikasi hak akses berbasis PostgreSQL Row-Level Security (RLS) serta variabel lingkungan sistem.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">AI Vision Engine Cerdas</strong>
                <span className="text-slate-400 text-[11px]">
                  Didukung integrasi MeCutinAI Qwen 3.8 Flash Vision dan NVIDIA NIM Llama 3.2 11B untuk pemrosesan struk belanja instan.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Database className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Sinkronisasi Database Supabase</strong>
                <span className="text-slate-400 text-[11px]">
                  Seluruh transaksi, tabungan, dan profil akun disinkronkan langsung secara aman melalui Supabase DB.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md active:scale-95"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
