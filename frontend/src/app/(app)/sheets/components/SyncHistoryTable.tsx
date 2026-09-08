"use client";

import React, { useState } from "react";
import { 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  Filter, 
  Info,
  Clock,
  Sparkles
} from "lucide-react";
import { SyncHistoryEntry } from "../types";

interface SyncHistoryTableProps {
  history: SyncHistoryEntry[];
  onOpenLogDetail: (entry: SyncHistoryEntry) => void;
}

export default function SyncHistoryTable({
  history,
  onOpenLogDetail,
}: SyncHistoryTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLogs = history.filter((log) => {
    if (statusFilter === "all") return true;
    return log.status === statusFilter;
  });

  const exportAuditLog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `finusa-sheets-audit-log-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: "success" | "partial" | "failed") => {
    switch (status) {
      case "success":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Sukses</span>
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span>Sebagian</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            <span>Gagal</span>
          </span>
        );
    }
  };

  return (
    <div id="history-section" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Log Audit & Riwayat Sinkronisasi
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Catatan transaksi yang ditambahkan, diubah, serta laporan validasi format sheet secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="success">Sukses</option>
              <option value="partial">Sebagian (Warning)</option>
              <option value="failed">Gagal</option>
            </select>
          </div>

          <button
            type="button"
            onClick={exportAuditLog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-[#1a1f2e] hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Ekspor Log</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 overflow-x-auto shadow-md">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3.5">Waktu Eksekusi</th>
              <th className="px-4 py-3.5">Nama Spreadsheet</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Perubahan Baris</th>
              <th className="px-4 py-3.5">Durasi</th>
              <th className="px-4 py-3.5">Pemicu</th>
              <th className="px-4 py-3.5 text-right">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 text-xs">
                  Tidak ada catatan riwayat sinkronisasi untuk filter ini.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-slate-300 text-[11px]">
                    {new Date(log.timestamp).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })} WIB
                  </td>
                  <td className="px-4 py-3.5 font-medium text-white max-w-[200px] truncate">
                    {log.sheetTitle}
                  </td>
                  <td className="px-4 py-3.5">
                    {getStatusBadge(log.status)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="text-emerald-400 font-semibold">+{log.rowsAdded}</span>
                      <span className="text-blue-400 font-semibold">~{log.rowsUpdated}</span>
                      <span className="text-rose-400 font-semibold">-{log.rowsDeleted}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                    {(log.durationMs / 1000).toFixed(2)}s
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                    {log.triggeredBy === "auto_cron" ? (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" /> Auto Cron
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-400">
                        <Sparkles className="w-3 h-3" /> Manual
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenLogDetail(log)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Lihat Rincian Log"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
