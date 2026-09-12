"use client";

import React from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { GoalFilterState } from "../types";

interface NabungFilterBarProps {
  filters: GoalFilterState;
  onFilterChange: (updates: Partial<GoalFilterState>) => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function NabungFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  filteredCount,
  totalCount,
}: NabungFilterBarProps) {
  const isFiltered =
    Boolean(filters.search) ||
    filters.category !== "all" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  const categories = [
    { key: "all", label: "Semua Kategori" },
    { key: "darurat", label: "Dana Darurat" },
    { key: "usaha", label: "Usaha Mandiri" },
    { key: "gadget", label: "Gadget & Belajar" },
    { key: "pendidikan", label: "Pendidikan" },
    { key: "properti", label: "Properti" },
    { key: "kendaraan", label: "Kendaraan" },
    { key: "liburan", label: "Ibadah & Liburan" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#161c28] p-3 sm:p-4 rounded-2xl border border-slate-800">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari target tabungan (contoh: Darurat, Laptop, Ekspansi)..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 bg-[#1a1f2e] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns & View Mode Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="bg-[#1a1f2e] border border-slate-700/80 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Pos Aktif</option>
            <option value="tercapai">Sudah Tercapai (100%)</option>
            <option value="tertunda">Perlu Perhatian</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="bg-[#1a1f2e] border border-slate-700/80 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Semua Prioritas</option>
            <option value="tinggi">Prioritas Tinggi</option>
            <option value="sedang">Prioritas Sedang</option>
            <option value="rendah">Prioritas Rendah</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-[#1a1f2e] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as GoalFilterState["sortBy"],
                })
              }
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer pr-1"
            >
              <option value="deadline" className="bg-[#1a1f2e] text-white">
                Deadline Terdekat
              </option>
              <option value="progress_desc" className="bg-[#1a1f2e] text-white">
                Progres Tertinggi
              </option>
              <option value="progress_asc" className="bg-[#1a1f2e] text-white">
                Progres Terendah
              </option>
              <option value="amount_desc" className="bg-[#1a1f2e] text-white">
                Nominal Terbesar
              </option>
              <option value="priority" className="bg-[#1a1f2e] text-white">
                Tingkat Prioritas
              </option>
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-2 rounded-xl text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#1a1f2e] border border-slate-700/80 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: "grid" })}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filters.viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ viewMode: "list" })}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filters.viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Tampilan Daftar Baris"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = filters.category === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onFilterChange({ category: cat.key })}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-sm border border-blue-400/40"
                  : "bg-[#161c28] hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
        <div className="text-[11px] text-slate-500 whitespace-nowrap pl-2 ml-auto self-center">
          Menampilkan <strong className="text-slate-300">{filteredCount}</strong> dari {totalCount} pos
        </div>
      </div>
    </div>
  );
}
