"use client";

import React, { useState } from "react";
import { 
  X, 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  FileText 
} from "lucide-react";
import { SettingsService } from "@/lib/services/settings.service";

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DataExportModal({
  isOpen,
  onClose,
}: DataExportModalProps) {
  const [format, setFormat] = useState<"json" | "csv" | "pdf">("json");
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeGoals, setIncludeGoals] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const realData = await SettingsService.getUserExportData();

      // Filter by date range if specified
      let filteredTransactions = realData.transactions;
      if (dateRange !== "all") {
        const days = parseInt(dateRange, 10);
        if (!isNaN(days)) {
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          filteredTransactions = filteredTransactions.filter((t) => {
            const dateVal = (t.date || t.created_at) as string | undefined;
            return dateVal ? new Date(dateVal) >= cutoff : true;
          });
        }
      }

      const exportData: Record<string, unknown> = {};

      if (includeTransactions) {
        exportData.transactions = filteredTransactions;
        exportData.transactionsCount = filteredTransactions.length;
      }
      if (includeGoals) {
        exportData.savingsGoals = realData.savingsGoals;
        exportData.savingsGoalsCount = realData.savingsGoals.length;
      }
      if (includeSettings) {
        exportData.userPreferences = realData.preferences;
      }

      const exportPayload = {
        meta: {
          app: "FINUSA - Finance Nusantara",
          version: "2.0.0",
          exportedAt: new Date().toISOString(),
          format: format,
          dateRange: dateRange,
        },
        data: exportData,
      };

      let dataStr = "";
      let fileExt: string = format;

      if (format === "json") {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      } else if (format === "csv") {
        const headers = ["Tanggal", "Deskripsi", "Kategori", "Tipe", "Nominal", "Status", "Merchant"].join(",");
        const rows = filteredTransactions.map((t) => [
          `"${String(t.date || "")}"`,
          `"${String(t.description || "").replace(/"/g, '""')}"`,
          `"${String(t.category || "")}"`,
          `"${String(t.type || "")}"`,
          Number(t.amount) || 0,
          `"${String(t.status || "completed")}"`,
          `"${String(t.merchant || "").replace(/"/g, '""')}"`,
        ].join(","));
        dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([headers, ...rows].join("\n"));
      } else {
        // PDF / text summary fallback
        fileExt = "txt";
        const totalIncome = filteredTransactions
          .filter((t) => String(t.type) === "income")
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalExpense = filteredTransactions
          .filter((t) => String(t.type) === "expense")
          .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

        const summaryText = [
          "=========================================",
          "FINUSA - RINGKASAN ARSIP KEUANGAN",
          `Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID")}`,
          "=========================================",
          `Total Transaksi: ${filteredTransactions.length}`,
          `Total Pemasukan: Rp ${totalIncome.toLocaleString("id-ID")}`,
          `Total Pengeluaran: Rp ${totalExpense.toLocaleString("id-ID")}`,
          `Surplus/Defisit: Rp ${(totalIncome - totalExpense).toLocaleString("id-ID")}`,
          `Total Target Tabungan: ${realData.savingsGoals.length}`,
          "=========================================",
        ].join("\n");
        dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(summaryText);
      }

      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute(
        "download",
        `finusa-backup-${new Date().toISOString().split("T")[0]}.${fileExt}`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      onClose();
    } catch (e) {
      console.warn("Export failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Ekspor & Cadangkan Data
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Unduh seluruh arsip keuangan Anda tanpa batasan.
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
          {/* Format Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Pilih Format Berkas:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat("json")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  format === "json"
                    ? "bg-blue-500/15 border-blue-500/60 text-white font-bold"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <FileJson className="w-5 h-5 text-blue-400" />
                <span>JSON (Lengkap)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("csv")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  format === "csv"
                    ? "bg-blue-500/15 border-blue-500/60 text-white font-bold"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>CSV (Excel)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  format === "pdf"
                    ? "bg-blue-500/15 border-blue-500/60 text-white font-bold"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <FileText className="w-5 h-5 text-rose-400" />
                <span>PDF (Ringkasan)</span>
              </button>
            </div>
          </div>

          {/* Scope selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Pilih Data yang Disertakan:
            </label>
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTransactions}
                onChange={(e) => setIncludeTransactions(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <span className="text-slate-200">Riwayat Pembukuan & Transaksi Finusa</span>
            </label>
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGoals}
                onChange={(e) => setIncludeGoals(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <span className="text-slate-200">Pos Target Tabungan & Alokasi Nabung</span>
            </label>
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSettings}
                onChange={(e) => setIncludeSettings(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-700"
              />
              <span className="text-slate-200">Preferensi & Konfigurasi Pengaturan Akun</span>
            </label>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Rentang Waktu:
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Semua Waktu (Seluruh Riwayat)</option>
              <option value="this_year">Tahun 2024 Berjalan</option>
              <option value="this_month">Bulan Ini</option>
              <option value="last_30_days">30 Hari Terakhir</option>
            </select>
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
            onClick={handleExport}
            disabled={isExporting || (!includeTransactions && !includeGoals && !includeSettings)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`} />
            <span>{isExporting ? "Membuat Berkas..." : "Unduh Berkas"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
