"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  FileSpreadsheet, 
  Plus, 
  ExternalLink, 
  RefreshCw,
  SlidersHorizontal,
  ArrowLeftRight
} from "lucide-react";
import { SyncedSheetItem } from "../types";
import SheetCard from "./SheetCard";

interface SyncedSheetsGridProps {
  sheets: SyncedSheetItem[];
  onSyncNow: (sheetId: string) => void;
  onOpenSettings: (sheet: SyncedSheetItem) => void;
  onOpenColumnMapper: (sheet: SyncedSheetItem) => void;
  onOpenShare: (sheet: SyncedSheetItem) => void;
  onDelete: (sheetId: string) => void;
  onOpenCreate: () => void;
}

export default function SyncedSheetsGrid({
  sheets,
  onSyncNow,
  onOpenSettings,
  onOpenColumnMapper,
  onOpenShare,
  onDelete,
  onOpenCreate,
}: SyncedSheetsGridProps) {
  const [search, setSearch] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredSheets = sheets.filter((sheet) => {
    const matchesSearch = 
      sheet.sheetTitle.toLowerCase().includes(search.toLowerCase()) ||
      sheet.sheetTabName.toLowerCase().includes(search.toLowerCase());
    const matchesFreq = frequencyFilter === "all" || sheet.syncFrequency === frequencyFilter;
    return matchesSearch && matchesFreq;
  });

  return (
    <div className="space-y-4 mb-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#1a1f2e]/60 border border-slate-800/80">
        <div className="flex items-center gap-2.5 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul spreadsheet atau nama tab..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Frequency Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Semua Frekuensi</option>
              <option value="realtime">Real-time</option>
              <option value="hourly">Tiap Jam</option>
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Tampilan Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
              title="Tampilan List Tabel"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List View */}
      {filteredSheets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-[#1a1f2e]/30 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-white">Tidak ada spreadsheet yang cocok</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {search || frequencyFilter !== "all"
              ? "Coba ubah kata kunci pencarian atau reset filter frekuensi sinkronisasi Anda."
              : "Anda belum memiliki spreadsheet yang terhubung. Mulai dengan membuat spreadsheet baru dari templat keuangan atau sambungkan spreadsheet yang sudah ada."}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Spreadsheet Baru</span>
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSheets.map((sheet) => (
            <SheetCard
              key={sheet.id}
              sheet={sheet}
              onSyncNow={onSyncNow}
              onOpenSettings={onOpenSettings}
              onOpenColumnMapper={onOpenColumnMapper}
              onOpenShare={onOpenShare}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* List Mode Table */
        <div className="rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 overflow-x-auto shadow-md">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Nama Spreadsheet & Tab</th>
                <th className="px-4 py-3.5">Status & Frekuensi</th>
                <th className="px-4 py-3.5">Baris Data</th>
                <th className="px-4 py-3.5">Terakhir Sinkron</th>
                <th className="px-4 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSheets.map((sheet) => (
                <tr key={sheet.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-100">{sheet.sheetTitle}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>Tab: {sheet.sheetTabName}</span>
                          {sheet.bidirectional && (
                            <span className="text-teal-400 flex items-center gap-0.5">
                              <ArrowLeftRight className="w-3 h-3" /> Dua Arah
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        sheet.syncStatus === "synced"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : sheet.syncStatus === "syncing"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {sheet.syncStatus.toUpperCase()}
                      </span>
                      <div className="text-[11px] text-slate-400 capitalize">{sheet.syncFrequency}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums font-mono text-slate-200">
                    {sheet.rowCount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                    {sheet.lastSyncAt
                      ? new Date(sheet.lastSyncAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB"
                      : "-"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSyncNow(sheet.id)}
                        disabled={sheet.syncStatus === "syncing"}
                        className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600/30 transition-colors cursor-pointer"
                        title="Sync Sekarang"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${sheet.syncStatus === "syncing" ? "animate-spin" : ""}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenColumnMapper(sheet)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Petakan Kolom"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={sheet.sheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Buka Spreadsheet"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
