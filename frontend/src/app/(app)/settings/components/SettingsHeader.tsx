"use client";

import React from "react";
import { 
  Settings, 
  Search, 
  Download, 
  Keyboard, 
  CheckCircle2 
} from "lucide-react";

interface SettingsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
}

export default function SettingsHeader({
  searchQuery,
  onSearchChange,
  onOpenExport,
  onOpenShortcuts,
}: SettingsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60 mb-6">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Pengaturan Aplikasi
          </h1>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tersinkron Cloud</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
          Pusat pengelolaan akun, otentikasi keamanan, preferensi visual, kontrol notifikasi, dan integrasi eksternal Finusa.
        </p>
      </div>

      {/* Actions & Search */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari pengaturan..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="button"
          onClick={onOpenShortcuts}
          className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#1a1f2e] hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
          title="Pintasan Keyboard (⌘K)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-[#1a1f2e] hover:bg-slate-800 border border-slate-700/80 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Ekspor Data</span>
        </button>
      </div>
    </div>
  );
}
