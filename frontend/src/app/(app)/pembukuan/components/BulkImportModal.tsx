"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Download,
  Check,
} from "lucide-react";
import { PembukuanTransaction, CategoryItem } from "../types";
import { AccountOption, formatCurrency } from "../constants";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmImport: (transactions: Partial<PembukuanTransaction>[]) => void;
  categories: CategoryItem[];
  accounts: AccountOption[];
}

export default function BulkImportModal({
  isOpen,
  onClose,
  onConfirmImport,
  categories,
  accounts,
}: BulkImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Partial<PembukuanTransaction>[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || "acc-mandiri");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    // Read CSV sample content
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
    if (lines.length < 2) return;

    const rows: Partial<PembukuanTransaction>[] = [];
    const today = new Date().toISOString().split("T")[0];

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/[,;]/);
      if (parts.length >= 3) {
        const dateRaw = parts[0]?.trim() || today;
        const descRaw = parts[1]?.trim() || "Transaksi Impor";
        const amountRaw = parseFloat(parts[2]?.replace(/[^0-9.]/g, "")) || 0;
        const typeRaw = parts[3]?.trim().toLowerCase().includes("in") ? "income" : "expense";
        const catNameRaw = parts[4]?.trim() || (typeRaw === "income" ? "Penjualan & Omset Usaha" : "Bahan Baku & Kulakan");

        const matchedCat = categories.find((c) => c.name.toLowerCase() === catNameRaw.toLowerCase()) || categories[0];

        rows.push({
          date: dateRaw,
          description: descRaw,
          amount: amountRaw,
          type: typeRaw,
          categoryId: matchedCat?.id || "cat-exp-raw",
          categoryName: matchedCat?.name || "Bahan Baku & Kulakan",
          accountId: selectedAccountId,
          accountName: accounts.find((a) => a.id === selectedAccountId)?.name || "Mandiri Bisnis Utama",
          status: "completed",
        });
      }
    }

    setParsedRows(rows);
    setStep(2);
  };

  const handleDownloadSample = () => {
    const sampleCsv = `Tanggal,Deskripsi,Nominal,Tipe,Kategori\n2026-08-25,Penjualan Paket Catering,3500000,income,Penjualan & Omset Usaha\n2026-08-25,Kulakan Bahan Dapur,850000,expense,Bahan Baku & Kulakan\n2026-08-24,Listrik PLN Token,200000,expense,Listrik, Air & Internet`;
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Template_Impor_Pembukuan_FINUSA.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFinish = () => {
    onConfirmImport(parsedRows);
    onClose();
    setStep(1);
    setSelectedFile(null);
    setParsedRows([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-2xl bg-[#161c28] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121721]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Impor Transaksi Massal (CSV)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Langkah {step} dari 2 • Unggah dan tinjau mutasi pembukuan
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Upload File */}
            {step === 1 && (
              <div className="p-6 space-y-5 text-xs">
                {/* Target Account */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">
                    Pilih Metode Pembayaran Tujuan Impor
                  </label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.accountNumber})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Drag and Drop Zone */}
                <label className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500 bg-[#0F1419] cursor-pointer transition-colors space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">
                      Klik untuk memilih file CSV
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Mendukung format file .csv dan .txt berkoma
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Template Download */}
                <div className="p-3.5 rounded-xl bg-[#0F1419] border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-300">Belum punya format file?</p>
                    <p className="text-[11px] text-slate-500">Unduh contoh template kolom CSV yang kompatibel</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Template CSV</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Preview & Validation */}
            {step === 2 && (
              <div className="p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">
                      {parsedRows.length} Transaksi Ditemukan & Siap Diimpor
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedFile?.name}
                  </span>
                </div>

                {/* Preview Table */}
                <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 bg-[#0F1419]">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#121721] text-slate-400 border-b border-slate-800 font-semibold sticky top-0">
                      <tr>
                        <th className="p-2.5">Tanggal</th>
                        <th className="p-2.5">Deskripsi</th>
                        <th className="p-2.5">Kategori</th>
                        <th className="p-2.5 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {parsedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-2.5 text-slate-300 whitespace-nowrap">{row.date}</td>
                          <td className="p-2.5 font-medium text-white">{row.description}</td>
                          <td className="p-2.5 text-slate-400">{row.categoryName}</td>
                          <td className="p-2.5 text-right font-bold tabular-nums text-emerald-400 whitespace-nowrap">
                            {formatCurrency(row.amount || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                  >
                    Ganti File
                  </button>

                  <button
                    type="button"
                    onClick={handleFinish}
                    className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Konfirmasi Impor ({parsedRows.length})</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
