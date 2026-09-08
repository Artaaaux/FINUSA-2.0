"use client";

import React from "react";
import {
  BookOpen,
  Tags,
  CalendarClock,
  Plus,
  Download,
} from "lucide-react";
import { PembukuanTab } from "../types";
import { cn } from "@/shared/lib/utils";

interface PembukuanHeaderProps {
  activeTab: PembukuanTab;
  onTabChange: (tab: PembukuanTab) => void;
  onOpenAddModal: () => void;
  onOpenImportModal?: () => void;
  onOpenExportModal: () => void;
  totalTransactionsCount: number;
  pendingCount?: number;
}

export default function PembukuanHeader({
  activeTab,
  onTabChange,
  onOpenAddModal,
  onOpenExportModal,
  totalTransactionsCount,
}: PembukuanHeaderProps) {
  const tabs: { id: PembukuanTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "ledger", label: "Buku Transaksi", icon: BookOpen, badge: totalTransactionsCount },
    { id: "categories", label: "Kategori Pos", icon: Tags },
    { id: "recurring", label: "Jadwal Berulang", icon: CalendarClock },
  ];

  return (
    <div className="space-y-4">
      {/* Top Title & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Catat
            </h1>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400">
              Pemasukan & Pengeluaran
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pencatatan arus uang masuk dan keluar usaha secara cepat dan praktis.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161c28] border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Ekspor</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#141923] border border-slate-800 rounded-2xl overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-slate-400")} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-md text-[10px] font-bold tabular-nums",
                    isActive
                      ? "bg-blue-500/25 text-blue-300"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
