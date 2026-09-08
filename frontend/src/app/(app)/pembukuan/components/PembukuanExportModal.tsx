"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  FileSpreadsheet,
  Printer,
  CheckCircle2,
} from "lucide-react";
import { PembukuanTransaction } from "../types";
import { cn } from "@/shared/lib/utils";

interface PembukuanExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: PembukuanTransaction[];
}

export default function PembukuanExportModal({
  isOpen,
  onClose,
  transactions,
}: PembukuanExportModalProps) {
  const [format, setFormat] = useState<"csv" | "print">("csv");
  const [includePending, setIncludePending] = useState(true);

  const filteredToExport = transactions.filter((t) => {
    if (!includePending && t.status === "pending") return false;
    return true;
  });

  const handleExport = () => {
    if (format === "csv") {
      const headers = "ID,Tanggal,Waktu,Tipe,Nominal,Kategori,Akun,Deskripsi,Merchant,Status,Tag\n";
      const rows = filteredToExport
        .map((t) =>
          `"${t.id}","${t.date}","${t.time || ""}","${t.type}",${t.amount},"${t.categoryName}","${t.accountName}","${t.description.replace(/"/g, '""')}","${(t.merchant || "").replace(/"/g, '""')}","${t.status}","${t.tags.join("; ")}"`
        )
        .join("\n");

      const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Laporan_Pembukuan_FINUSA_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onClose();
    } else {
      // Print window
      window.print();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-lg bg-[#161c28] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121721]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Ekspor Laporan Pembukuan
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Unduh data kas & ledger transaksi untuk pembukuan eksternal
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Format Choices */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">
                  Pilih Format Berkas
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormat("csv")}
                    className={cn(
                      "p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer",
                      format === "csv"
                        ? "bg-blue-600/15 border-blue-500 text-white"
                        : "bg-[#0F1419] border-slate-800 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      {format === "csv" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-white">CSV (Excel Compatible)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Format standar data tabel</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat("print")}
                    className={cn(
                      "p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer",
                      format === "print"
                        ? "bg-blue-600/15 border-blue-500 text-white"
                        : "bg-[#0F1419] border-slate-800 text-slate-400 hover:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Printer className="w-5 h-5 text-sky-400" />
                      {format === "print" && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-white">Cetak / PDF Ringkasan</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Format cetak halaman web</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="p-3.5 rounded-xl bg-[#0F1419] border border-slate-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={includePending}
                    onChange={(e) => setIncludePending(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                  <span>Sertakan transaksi dengan status Pending</span>
                </label>
              </div>

              {/* Summary Stats */}
              <div className="p-3.5 rounded-xl bg-[#0F1419] border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Data yang Diekspor:</span>
                <span className="font-bold text-white tabular-nums">
                  {filteredToExport.length} Transaksi
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{format === "csv" ? "Unduh File CSV" : "Buka Dialog Cetak"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
