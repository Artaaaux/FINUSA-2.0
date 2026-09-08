"use client";

import React from "react";
import { Download, SlidersHorizontal } from "lucide-react";
import { PeriodType } from "../types";
import { cn } from "@/shared/lib/utils";

interface MonitorHeaderProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  onOpenExport: () => void;
  onOpenBudgetModal: () => void;
}

export default function MonitorHeader({
  selectedPeriod,
  onPeriodChange,
  onOpenExport,
  onOpenBudgetModal,
}: MonitorHeaderProps) {
  const periods: { id: PeriodType; label: string }[] = [
    { id: "this_month", label: "Bulan Ini" },
    { id: "last_month", label: "Bulan Lalu" },
    { id: "this_year", label: "Tahun Ini (YTD)" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4 pb-2 sm:border-b sm:border-slate-800/80">
      {/* Title — hidden on mobile since navbar says "Monitor Keuangan" */}
      <div className="hidden sm:block space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Monitor Keuangan
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Real-time
          </span>
        </div>
        <p className="text-sm text-slate-400">
          Pantau ringkasan pemasukan, pengeluaran, dan kondisi keuangan usaha Anda secara mudah dan jelas.
        </p>
      </div>

      {/* Controls row: Period tabs + Action buttons */}
      <div className="flex items-center justify-between gap-2">
        {/* Period Selector Tabs — full width on mobile */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner flex-1 sm:flex-initial">
          {periods.map((p) => {
            const isActive = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onPeriodChange(p.id)}
                className={cn(
                  "flex-1 sm:flex-initial px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 min-h-[36px] sm:min-h-0",
                  isActive
                    ? "bg-[#2563EB] text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons — icon-only on mobile, labeled on desktop */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenBudgetModal}
            className="inline-flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label="Atur Anggaran"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Atur Anggaran</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="inline-flex items-center justify-center gap-1.5 w-9 h-9 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            aria-label="Ekspor"
          >
            <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Ekspor</span>
          </button>
        </div>
      </div>
    </div>
  );
}
