"use client";

import React from "react";
import { 
  FileSpreadsheet, 
  Layers, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { SyncedSheetItem } from "../types";

interface QuickSyncStatsProps {
  sheets: SyncedSheetItem[];
  autoSyncEnabled: boolean;
}

export default function QuickSyncStats({ sheets, autoSyncEnabled }: QuickSyncStatsProps) {
  const activeSheetsCount = sheets.filter((s) => s.isActive).length;
  const totalRows = sheets.reduce((acc, curr) => acc + curr.rowCount, 0);
  const errorSheetsCount = sheets.filter((s) => s.syncStatus === "error").length;
  const successRate = sheets.length > 0 
    ? (((sheets.length - errorSheetsCount) / sheets.length) * 100).toFixed(1) 
    : "100";

  const stats = [
    {
      label: "Spreadsheet Terhubung",
      value: `${activeSheetsCount}`,
      sublabel: `dari total ${sheets.length} konfigurasi`,
      icon: FileSpreadsheet,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Total Baris Keuangan",
      value: totalRows.toLocaleString("id-ID"),
      sublabel: "transaksi & rumus tersinkron",
      icon: Layers,
      color: "text-teal-400",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20",
    },
    {
      label: "Tingkat Keberhasilan",
      value: `${successRate}%`,
      sublabel: errorSheetsCount === 0 ? "Seluruh sheet optimal" : `${errorSheetsCount} butuh perbaikan`,
      icon: CheckCircle2,
      color: errorSheetsCount === 0 ? "text-emerald-400" : "text-amber-400",
      bgColor: errorSheetsCount === 0 ? "bg-emerald-500/10" : "bg-amber-500/10",
      borderColor: errorSheetsCount === 0 ? "border-emerald-500/20" : "border-amber-500/20",
    },
    {
      label: "Mode Sinkronisasi",
      value: autoSyncEnabled ? "Real-time & Cron" : "Manual Saja",
      sublabel: autoSyncEnabled ? "Buffer 5 menit berkala" : "Klik untuk trigger sync",
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-[#1a1f2e]/60 border border-slate-800/80 p-4 shadow-sm hover:border-slate-700/80 transition-all hover:bg-[#1a1f2e]/90 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">{stat.label}</span>
            <div className={`w-8 h-8 rounded-xl ${stat.bgColor} ${stat.borderColor} border flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
              {stat.value}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>{stat.sublabel}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
