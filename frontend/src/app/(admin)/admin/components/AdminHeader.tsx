"use client";

import React from "react";
import { Sparkles, RefreshCw } from "lucide-react";

interface AdminHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function AdminHeader({ onRefresh, isLoading }: AdminHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D1630]/80 via-[#091024]/70 to-[#0E1B3D]/80 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all">
      {/* Soft Ambient Glows */}
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25 mb-3 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Admin Mode &bull; FINUSA Executive</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pusat Manajemen & Hak Akses
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Kelola peran admin, tinjau ringkasan metrik platform, dan pastikan konfigurasi akun terhubung dengan benar.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] hover:text-white border border-white/[0.1] hover:border-blue-400/30 transition-all shadow-md active:scale-95 disabled:opacity-60"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-blue-400 transition-transform ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            <span>Segarkan Data</span>
          </button>
        </div>
      </div>

      {/* System Status Indicators Row */}
      <div className="mt-5 pt-4 border-t border-white/[0.07] flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
        {/* Supabase DB Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-slate-400">Supabase DB:</span>
          <span className="text-emerald-400 font-medium">Terhubung</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">&bull;</span>

        {/* AI Vision Engine Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-slate-400">AI Vision Engine:</span>
          <span className="text-slate-200 font-medium">MeCutinAI + NVIDIA NIM</span>
        </div>

        <span className="text-slate-600 hidden sm:inline">&bull;</span>

        {/* Admin Guard Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
          <span className="text-slate-400">Admin Guard:</span>
          <span className="text-blue-400 font-medium">Aktif</span>
        </div>
      </div>
    </div>
  );
}
