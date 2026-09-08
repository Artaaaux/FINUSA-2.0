"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Settings, 
  Save, 
  ArrowLeftRight 
} from "lucide-react";
import { SyncedSheetItem, SyncFrequency, SheetDataFilters } from "../../types";

interface SheetSettingsModalProps {
  sheet: SyncedSheetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (sheetId: string, updates: Partial<SyncedSheetItem>) => void;
}

export default function SheetSettingsModal({
  sheet,
  isOpen,
  onClose,
  onSaveSettings,
}: SheetSettingsModalProps) {
  const [title, setTitle] = useState("");
  const [tabName, setTabName] = useState("");
  const [frequency, setFrequency] = useState<SyncFrequency>("realtime");
  const [bidirectional, setBidirectional] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [filters, setFilters] = useState<SheetDataFilters>({
    dateRange: "this_year",
    categories: ["Semua"],
    accounts: ["Semua Rekening"],
    transactionStatus: "all",
  });

  useEffect(() => {
    if (sheet) {
      setTitle(sheet.sheetTitle);
      setTabName(sheet.sheetTabName);
      setFrequency(sheet.syncFrequency);
      setBidirectional(sheet.bidirectional);
      setIsActive(sheet.isActive);
      setFilters(sheet.filters);
    }
  }, [sheet]);

  if (!isOpen || !sheet) return null;

  const handleSave = () => {
    onSaveSettings(sheet.id, {
      sheetTitle: title.trim(),
      sheetTabName: tabName.trim(),
      syncFrequency: frequency,
      bidirectional,
      isActive,
      filters,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Pengaturan Sinkronisasi Sheet
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi jadwal, filter kategori, dan arah transfer data.
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

        {/* Settings Body */}
        <div className="py-4 space-y-4">
          {/* Active Status Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white">Status Integrasi</div>
              <p className="text-[11px] text-slate-400">
                {isActive ? "Sinkronisasi otomatis aktif berjalan" : "Sinkronisasi dinonaktifkan sementara"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                isActive ? "bg-emerald-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Title and Tab */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Judul Spreadsheet
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Nama Tab Sheet
                </label>
                <input
                  type="text"
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Jadwal Sinkronisasi
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as SyncFrequency)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="realtime">Real-time (Tiap 5 Menit)</option>
                  <option value="hourly">Tiap 1 Jam</option>
                  <option value="daily">Harian (Pukul 08:00 WIB)</option>
                  <option value="weekly">Mingguan (Tiap Minggu)</option>
                  <option value="manual">Manual Saja</option>
                </select>
              </div>
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Filter Rentang Transaksi
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value as SheetDataFilters["dateRange"] })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="this_year">Semua Transaksi Tahun Berjalan</option>
              <option value="this_month">Bulan Berjalan</option>
              <option value="last_30_days">30 Hari Terakhir</option>
              <option value="all">Semua Riwayat (Semua Waktu)</option>
            </select>
          </div>

          {/* Bi-directional toggle */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
                <span>Sinkronisasi Dua Arah</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Edit baris di Google Sheets untuk otomatis update ke Finusa.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBidirectional(!bidirectional)}
              className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                bidirectional ? "bg-teal-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  bidirectional ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
