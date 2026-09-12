"use client";

import { Plus, Download, Target } from "lucide-react";

interface NabungHeaderProps {
  activeGoalsCount: number;
  totalGoalsCount: number;
  onOpenCreate: () => void;
  onOpenExport: () => void;
}

export default function NabungHeader({
  activeGoalsCount,
  totalGoalsCount,
  onOpenCreate,
  onOpenExport,
}: NabungHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Target Tabungan
          </h1>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{activeGoalsCount} Pos Aktif</span>
            <span className="text-slate-500">/ {totalGoalsCount} Total</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
          Rencanakan pos tabungan untuk keperluan belajar, proteksi darurat, dan kebutuhan masa depan dengan simulasi realistis serta alokasi debit otomatis.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-[#1a1f2e] hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm cursor-pointer"
          title="Ekspor data tabungan"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Ekspor</span>
        </button>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/30 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Target</span>
        </button>
      </div>
    </div>
  );
}
