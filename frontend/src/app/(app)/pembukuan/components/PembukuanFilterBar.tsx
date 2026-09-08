"use client";

import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  X,
  Trash2,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { FilterState, DatePreset, CategoryItem, TransactionStatus } from "../types";
import { AccountOption } from "../constants";
import { cn } from "@/shared/lib/utils";

interface PembukuanFilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  categories: CategoryItem[];
  accounts: AccountOption[];
  totalFilteredCount: number;
  totalCount: number;
  selectedIds: string[];
  onClearSelection: () => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkUpdateStatus: (ids: string[], status: TransactionStatus) => void;
}

export default function PembukuanFilterBar({
  filters,
  onFilterChange,
  categories,
  accounts,
  totalFilteredCount,
  totalCount,
  selectedIds,
  onClearSelection,
  onBulkDelete,
  onBulkUpdateStatus,
}: PembukuanFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const datePresets: { id: DatePreset; label: string }[] = [
    { id: "all", label: "Semua Waktu" },
    { id: "today", label: "Hari Ini" },
    { id: "this_week", label: "7 Hari" },
    { id: "this_month", label: "Bulan Ini" },
    { id: "last_month", label: "Bulan Lalu" },
    { id: "custom", label: "Kustom" },
  ];

  const resetAllFilters = () => {
    onFilterChange({
      searchQuery: "",
      datePreset: "all",
      startDate: "",
      endDate: "",
      type: "all",
      status: "all",
      categoryIds: [],
      accountIds: [],
      minAmount: undefined,
      maxAmount: undefined,
      hasAttachment: undefined,
      isReconciled: "all",
    });
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    filters.datePreset !== "all" ||
    filters.type !== "all" ||
    filters.status !== "all" ||
    filters.categoryIds.length > 0 ||
    filters.accountIds.length > 0 ||
    filters.minAmount !== undefined ||
    filters.maxAmount !== undefined ||
    filters.hasAttachment !== undefined ||
    filters.isReconciled !== "all";

  return (
    <div className="space-y-3">
      {/* Bulk Actions Banner (When items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 sm:p-4 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-white">
              {selectedIds.length} Transaksi Terpilih
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onBulkUpdateStatus(selectedIds, "completed")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tandai Selesai</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkUpdateStatus(selectedIds, "pending")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Tandai Pending</span>
            </button>

            <button
              type="button"
              onClick={() => onBulkDelete(selectedIds)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>

            <button
              type="button"
              onClick={onClearSelection}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Batal Pilih"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Filter Bar Container */}
      <div className="p-4 rounded-2xl bg-[#161c28] border border-slate-800 shadow-sm space-y-3.5">
        {/* Row 1: Search & View Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi berdasarkan nama, kategori, merchant, nominal, atau tag..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value, page: 1 })}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: "" })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Advanced Filter & View Mode */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer",
                showAdvanced || hasActiveFilters
                  ? "bg-blue-600/15 border-blue-500/30 text-blue-400"
                  : "bg-[#0F1419] border-slate-700 text-slate-300 hover:text-white"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter Lanjutan</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#0F1419] p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => onFilterChange({ viewMode: "table" })}
                className={cn(
                  "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                  filters.viewMode === "table"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                )}
                title="Tampilan Tabel"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onFilterChange({ viewMode: "cards" })}
                className={cn(
                  "p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                  filters.viewMode === "cards"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                )}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Date Presets & Type Pills */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
          {/* Date Presets */}
          <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto [&::-webkit-scrollbar]:hidden pb-1 lg:pb-0">
            {datePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onFilterChange({ datePreset: preset.id, page: 1 })}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                  filters.datePreset === preset.id
                    ? "bg-slate-700 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Type & Status Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type Selector */}
            <div className="flex items-center bg-[#0F1419] p-1 rounded-xl border border-slate-700 text-xs">
              {(["all", "income", "expense"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onFilterChange({ type: t, page: 1 })}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer",
                    filters.type === t
                      ? "bg-slate-700 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {t === "all" ? "Semua Tipe" : t === "income" ? "Masuk" : "Keluar"}
                </button>
              ))}
            </div>

            {/* Results Count & Reset */}
            <div className="flex items-center gap-2 pl-1">
              <span className="text-[11px] text-slate-400">
                Menampilkan <strong className="text-white">{totalFilteredCount}</strong> dari {totalCount}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer pl-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Custom Date Range Picker when 'custom' is active */}
        {filters.datePreset === "custom" && (
          <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400">Dari Tanggal</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => onFilterChange({ startDate: e.target.value, page: 1 })}
                className="px-3 py-1.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-slate-400">Sampai Tanggal</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => onFilterChange({ endDate: e.target.value, page: 1 })}
                className="px-3 py-1.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Advanced Filters Expandable Drawer */}
        {showAdvanced && (
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Filter by Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Kategori</label>
              <select
                value={filters.categoryIds[0] || ""}
                onChange={(e) =>
                  onFilterChange({
                    categoryIds: e.target.value ? [e.target.value] : [],
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type === "income" ? "Masuk" : "Keluar"})
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Account */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Metode Pembayaran</label>
              <select
                value={filters.accountIds[0] || ""}
                onChange={(e) =>
                  onFilterChange({
                    accountIds: e.target.value ? [e.target.value] : [],
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Semua Metode</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Status Transaksi</label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value as "all" | TransactionStatus, page: 1 })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="completed">Selesai (Completed)</option>
                <option value="pending">Tertunda (Pending)</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Urutkan Berdasarkan</label>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState["sortBy"] })}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="date_desc">Tanggal Terbaru</option>
                <option value="date_asc">Tanggal Terlama</option>
                <option value="amount_desc">Nominal Terbesar</option>
                <option value="amount_asc">Nominal Terkecil</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
