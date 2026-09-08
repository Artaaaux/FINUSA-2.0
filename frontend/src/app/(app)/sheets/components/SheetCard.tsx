"use client";

import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  Settings, 
  SlidersHorizontal, 
  Users, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowLeftRight, 
  MoreVertical,
  Layers
} from "lucide-react";
import { SyncedSheetItem, SyncStatus } from "../types";

interface SheetCardProps {
  sheet: SyncedSheetItem;
  onSyncNow: (sheetId: string) => void;
  onOpenSettings: (sheet: SyncedSheetItem) => void;
  onOpenColumnMapper: (sheet: SyncedSheetItem) => void;
  onOpenShare: (sheet: SyncedSheetItem) => void;
  onDelete: (sheetId: string) => void;
}

export default function SheetCard({
  sheet,
  onSyncNow,
  onOpenSettings,
  onOpenColumnMapper,
  onOpenShare,
  onDelete,
}: SheetCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getStatusBadge = (status: SyncStatus) => {
    switch (status) {
      case "synced":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            <CheckCircle2 className="w-3 h-3" />
            <span>Tersinkron</span>
          </span>
        );
      case "syncing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Menyinkronkan...</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            <Clock className="w-3 h-3" />
            <span>Menunggu Antrean</span>
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
            <AlertTriangle className="w-3 h-3" />
            <span>Ada Masalah</span>
          </span>
        );
    }
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case "realtime": return "Real-time (5 min buffer)";
      case "hourly": return "Tiap 1 Jam";
      case "daily": return "Harian (08:00 WIB)";
      case "weekly": return "Mingguan (Minggu)";
      case "manual": return "Manual Trigger";
      default: return freq;
    }
  };

  return (
    <div className="relative rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/90 p-4 sm:p-5 shadow-md hover:border-slate-700/80 hover:bg-[#1a1f2e] transition-all flex flex-col justify-between group">
      <div>
        {/* Card Header: Icon, Title & Menu */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                {sheet.sheetTitle}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-mono text-slate-300">Tab: {sheet.sheetTabName}</span>
                {sheet.bidirectional && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-400 font-medium" title="Sinkronisasi Dua Arah Aktif">
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>Dua Arah</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Popover or Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Menu Opsi Sheet"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-slate-900 border border-slate-700/90 shadow-2xl py-1 text-xs text-slate-300 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); onOpenSettings(sheet); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Filter & Frekuensi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); onOpenColumnMapper(sheet); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Petakan Kolom</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); onOpenShare(sheet); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-white flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kelola Kolaborator</span>
                  </button>
                  <a
                    href={sheet.sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 hover:text-blue-400 flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka di Google Sheets</span>
                  </a>
                  <div className="border-t border-slate-800 my-1" />
                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); onDelete(sheet.id); }}
                    className="w-full px-3 py-2 text-left hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Sinkronisasi</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status & Details Banner */}
        <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            {getStatusBadge(sheet.syncStatus)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {sheet.syncFrequency.toUpperCase()}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block mb-0.5">Baris Data Tersinkron</span>
            <span className="text-sm font-bold text-slate-200 tabular-nums flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              {sheet.rowCount.toLocaleString("id-ID")} baris
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block mb-0.5">Jadwal Sync</span>
            <span className="text-xs font-semibold text-slate-300 truncate block">
              {getFrequencyLabel(sheet.syncFrequency)}
            </span>
          </div>
        </div>

        {/* Sync Timestamps */}
        <div className="space-y-1 text-[11px] text-slate-400 mb-4">
          <div className="flex items-center justify-between">
            <span>Terakhir sinkron:</span>
            <span className="text-slate-300 font-mono">
              {sheet.lastSyncAt 
                ? new Date(sheet.lastSyncAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
                : "Belum pernah"}
            </span>
          </div>
          {sheet.nextSyncAt && (
            <div className="flex items-center justify-between">
              <span>Sync berikutnya:</span>
              <span className="text-slate-400 font-mono">
                {new Date(sheet.nextSyncAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
              </span>
            </div>
          )}
        </div>

        {/* Error message if any */}
        {sheet.lastError && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] mb-4 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="leading-snug">{sheet.lastError}</span>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => onSyncNow(sheet.id)}
          disabled={sheet.syncStatus === "syncing"}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600/90 hover:bg-blue-500 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${sheet.syncStatus === "syncing" ? "animate-spin" : ""}`} />
          <span>{sheet.syncStatus === "syncing" ? "Sinkronisasi..." : "Sync Sekarang"}</span>
        </button>

        <a
          href={sheet.sheetUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700 border border-slate-700/80 transition-colors cursor-pointer"
          title="Buka Spreadsheet di Tab Baru"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
