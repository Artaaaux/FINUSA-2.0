"use client";

import React, { useState } from "react";
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react";
import { Transaction } from "../types";
import { cn } from "@/shared/lib/utils";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export default function ExportModal({
  isOpen,
  onClose,
  transactions,
}: ExportModalProps) {
  const [format, setFormat] = useState<"csv" | "pdf">("csv");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      if (format === "csv") {
        // Generate CSV Data
        const headers = ["ID", "Tanggal", "Deskripsi", "Kategori", "Akun", "Tipe", "Nominal (IDR)", "Pihak/Merchant", "Catatan"];
        const rows = transactions.map((t) => [
          t.id,
          t.date,
          `"${t.description.replace(/"/g, '""')}"`,
          `"${t.category}"`,
          `"${t.account}"`,
          t.type === "income" ? "Pemasukan" : "Pengeluaran",
          t.amount,
          `"${t.merchant || ""}"`,
          `"${t.notes || ""}"`,
        ]);

        const csvContent =
          "data:text/csv;charset=utf-8," +
          [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `FINUSA_Laporan_Keuangan_${new Date().toISOString().slice(0, 10)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setIsExporting(false);
      setExportComplete(true);

      setTimeout(() => {
        setExportComplete(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#151B26] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-slate-200 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Ekspor Laporan Keuangan
              </h2>
              <span className="text-[11px] text-slate-400">
                Unduh rekap transaksi untuk pembukuan dan audit
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-slate-300 block">
            Pilih Format Berkas:
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={cn(
                "p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all",
                format === "csv"
                  ? "bg-blue-500/10 border-blue-500/50 text-white shadow-sm"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                {format === "csv" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <div>
                <span className="text-xs font-bold block text-white">CSV (Excel)</span>
                <span className="text-[10px] text-slate-400">Data tabel terstruktur</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={cn(
                "p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all",
                format === "pdf"
                  ? "bg-blue-500/10 border-blue-500/50 text-white shadow-sm"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              )}
            >
              <div className="flex items-center justify-between">
                <FileText className="w-5 h-5 text-rose-400" />
                {format === "pdf" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <div>
                <span className="text-xs font-bold block text-white">PDF Dokumen</span>
                <span className="text-[10px] text-slate-400">Laporan siap cetak</span>
              </div>
            </button>
          </div>
        </div>

        {/* Dataset Summary */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>Total Baris Transaksi:</span>
            <span className="font-bold text-white tabular-nums">{transactions.length} item</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Cakupan Status:</span>
            <span className="font-semibold text-emerald-400">Semua Data Valid</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isExporting || exportComplete}
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            {isExporting ? (
              <span>Memproses...</span>
            ) : exportComplete ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Berhasil Diunduh</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
