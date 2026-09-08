"use client";

import React from "react";
import { 
  X, 
  Table, 
  TrendingUp, 
  Calculator, 
  ArrowRight, 
  FileSpreadsheet,
  CheckCircle2
} from "lucide-react";
import { SheetTemplate } from "../../types";

interface TemplatePreviewModalProps {
  template: SheetTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: SheetTemplate) => void;
}

export default function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {template.name}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {template.categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pratinjau struktur kolom, formula bawaan, dan grafik analitik.
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

        {/* Template Overview */}
        <div className="py-4 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            {template.longDescription}
          </p>

          {/* Formulas & Charts Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-blue-400" />
                <span>Formula Tersemat:</span>
              </div>
              <ul className="space-y-1">
                {template.formulas.map((f, idx) => (
                  <li key={idx} className="text-[11px] font-mono text-slate-400 truncate">
                    • {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Grafik & Visualisasi:</span>
              </div>
              <ul className="space-y-1">
                {template.chartTypes.map((c, idx) => (
                  <li key={idx} className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Spreadsheet Sample Grid */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5 text-teal-400" />
                <span>Format Sel Spreadsheet Google:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Auto-Format Currency & Headers</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-emerald-950/40 text-emerald-300 border-b border-emerald-900/50">
                  <tr>
                    <th className="px-2.5 py-2 text-[10px] text-slate-500 border-r border-slate-800 w-8">#</th>
                    {template.sampleColumns.map((col, idx) => (
                      <th key={idx} className="px-3 py-2 text-[11px] font-bold whitespace-nowrap border-r border-slate-800/80 last:border-0">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {template.sampleRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30">
                      <td className="px-2.5 py-2 text-[10px] text-slate-500 border-r border-slate-800">
                        {rIdx + 1}
                      </td>
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3 py-2 text-[11px] text-slate-300 whitespace-nowrap border-r border-slate-800/60 last:border-0"
                        >
                          {typeof cell === "number" ? `Rp ${cell.toLocaleString("id-ID")}` : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onUseTemplate(template);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <span>Gunakan Templat Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
