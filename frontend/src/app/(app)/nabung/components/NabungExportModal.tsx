"use client";

import React, { useState } from "react";
import { X, Download, FileSpreadsheet, Copy, Check } from "lucide-react";
import { SavingsGoal } from "../types";
import { formatCurrency, formatDateIndo } from "../utils";

interface NabungExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: SavingsGoal[];
}

export default function NabungExportModal({
  isOpen,
  onClose,
  goals,
}: NabungExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const headers = [
      "ID",
      "Nama Pos",
      "Kategori",
      "Segmen",
      "Target Nominal (IDR)",
      "Terkumpul (IDR)",
      "Persentase (%)",
      "Target Batas Waktu",
      "Prioritas",
      "Status",
      "Auto-Save Aktif",
      "Nominal Auto-Save",
    ];

    const rows = goals.map((g) => [
      g.id,
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.categoryLabel}"`,
      g.userType,
      g.targetAmount,
      g.currentAmount,
      Math.round((g.currentAmount / g.targetAmount) * 100),
      g.targetDate,
      g.priority,
      g.status,
      g.autoSave.enabled ? "Ya" : "Tidak",
      g.autoSave.enabled ? g.autoSave.amount : 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `FINUSA-Target-Tabungan-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = () => {
    const totalCollected = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const rate = Math.round((totalCollected / totalTarget) * 100);

    const summaryText = `📊 Laporan Target Tabungan FINUSA (${new Date().toLocaleDateString("id-ID")}):
Total Terkumpul: ${formatCurrency(totalCollected)}
Akumulasi Target: ${formatCurrency(totalTarget)} (${rate}%)
Jumlah Pos: ${goals.length} pos

Rincian Pos:
${goals
  .map(
    (g, i) =>
      `${i + 1}. ${g.name} (${g.categoryLabel}): ${formatCurrency(
        g.currentAmount
      )} / ${formatCurrency(g.targetAmount)} [${Math.round(
        (g.currentAmount / g.targetAmount) * 100
      )}%] - Target: ${formatDateIndo(g.targetDate)}`
  )
  .join("\n")}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#161c28] border border-slate-700 shadow-2xl overflow-hidden my-auto"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
      >
        <div className="p-5 sm:p-6 bg-[#1a1f2e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Ekspor Data Tabungan
              </h2>
              <p className="text-xs text-slate-400">
                Unduh file spreadsheet atau salin ringkasan berkas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="p-4 rounded-2xl bg-[#1a1f2e] border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Total Pos Siap Ekspor:</span>
              <strong className="text-white">{goals.length} Pos</strong>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Format Ekspor:</span>
              <strong className="text-emerald-400">CSV (Excel Compatible)</strong>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas CSV (.csv)</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-[#1f2534] hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Ringkasan Disalin ke Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Salin Teks Ringkasan Tabungan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
