"use client";

import React from "react";
import { 
  X, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle 
} from "lucide-react";
import { SyncHistoryEntry } from "../../types";

interface SyncLogDetailModalProps {
  entry: SyncHistoryEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SyncLogDetailModal({
  entry,
  isOpen,
  onClose,
}: SyncLogDetailModalProps) {
  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Rincian Log Sinkronisasi
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Log ID: #{entry.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          {/* Status summary banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            entry.status === "success"
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
              : entry.status === "partial"
              ? "bg-amber-500/10 border-amber-500/25 text-amber-300"
              : "bg-rose-500/10 border-rose-500/25 text-rose-300"
          }`}>
            {entry.status === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : entry.status === "partial" ? (
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold text-sm text-white">
                {entry.status === "success"
                  ? "Sinkronisasi Berhasil Sempurna"
                  : entry.status === "partial"
                  ? "Sinkronisasi Berhasil dengan Peringatan"
                  : "Sinkronisasi Gagal Dieksekusi"}
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                {entry.errorMessage || "Semua baris data terverifikasi dan berhasil diselaraskan dengan Google Sheets API v4."}
              </p>
            </div>
          </div>

          {/* Audit parameters table */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Target Spreadsheet:</span>
              <span className="font-semibold text-white">{entry.sheetTitle}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Waktu Mulai:</span>
              <span className="font-mono text-slate-300">{new Date(entry.timestamp).toLocaleString("id-ID")} WIB</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Durasi Eksekusi:</span>
              <span className="font-mono text-slate-300">{(entry.durationMs / 1000).toFixed(2)} detik ({entry.durationMs}ms)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400">Pemicu Sinkronisasi:</span>
              <span className="font-mono text-blue-400 uppercase font-semibold">{entry.triggeredBy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Integritas Hash:</span>
              <span className="font-mono text-[10px] text-slate-500">SHA256-VALIDATED</span>
            </div>
          </div>

          {/* Records Delta */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-emerald-400 font-bold text-lg">+{entry.rowsAdded}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-0.5">Baris Baru</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-blue-400 font-bold text-lg">~{entry.rowsUpdated}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-0.5">Diperbarui</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-rose-400 font-bold text-lg">-{entry.rowsDeleted}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-0.5">Dihapus</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
