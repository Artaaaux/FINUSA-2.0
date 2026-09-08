"use client";

import React from "react";
import { 
  FileSpreadsheet, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { GoogleAccountInfo } from "../types";

interface SheetsHeaderProps {
  accountInfo: GoogleAccountInfo;
  isSyncingAll: boolean;
  onSyncAll: () => void;
  onOpenCreateWizard: () => void;
  onScrollToTemplates: () => void;
  onOpenHistory: () => void;
}

export default function SheetsHeader({
  accountInfo,
  isSyncingAll,
  onSyncAll,
  onOpenCreateWizard,
  onScrollToTemplates,
  onOpenHistory,
}: SheetsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60 mb-6">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            Integrasi Google Sheets
          </h1>
          {accountInfo.isConnected ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terhubung: {accountInfo.email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/25">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Belum Terhubung</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
          Sinkronkan pembukuan, target tabungan, dan rekap keuangan Finusa ke Google Sheets secara dua arah untuk analisis mendalam, kolaborasi tim, dan pelaporan kustom.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={onScrollToTemplates}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Templat Cepat</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-[#1a1f2e] hover:bg-slate-800 border border-slate-700/80 transition-all shadow-sm cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>Log Audit</span>
        </button>

        <button
          type="button"
          onClick={onSyncAll}
          disabled={isSyncingAll || !accountInfo.isConnected}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? "animate-spin text-blue-400" : ""}`} />
          <span>{isSyncingAll ? "Menyinkronkan..." : "Sync Semua"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenCreateWizard}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/30 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Spreadsheet</span>
        </button>
      </div>
    </div>
  );
}
