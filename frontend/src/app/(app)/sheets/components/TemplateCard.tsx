"use client";

import React, { useState } from "react";
import {
  Download,
  Eye,
  EyeOff,
  TrendingUp,
  PieChart,
  Sparkles,
  Calculator,
  FileText,
  Check,
} from "lucide-react";
import { SheetTemplate } from "../types";
import { downloadTemplate } from "../lib/generate-xlsx";

interface TemplateCardProps {
  template: SheetTemplate;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "income_expense": return TrendingUp;
      case "budget": return PieChart;
      case "cashflow": return Sparkles;
      case "tax": return Calculator;
      case "pnl": return FileText;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "income_expense": return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" };
      case "budget": return { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/25" };
      case "cashflow": return { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/25" };
      case "tax": return { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/25" };
      case "pnl": return { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/25" };
      default: return { text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/25" };
    }
  };

  const Icon = getCategoryIcon(template.category);
  const color = getCategoryColor(template.category);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadTemplate(template);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatValue = (val: string | number): string => {
    if (typeof val === "number" && val >= 1000) {
      return val.toLocaleString("id-ID");
    }
    return String(val);
  };

  return (
    <div className="rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 overflow-hidden shadow-md hover:border-slate-700/60 transition-all group">
      {/* Card Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color.bg} ${color.border} border flex items-center justify-center ${color.text} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
                {template.name}
              </h3>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${color.bg} ${color.text} ${color.border} border`}>
                {template.categoryLabel}
              </span>
            </div>
          </div>

          {template.isPopular && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 shrink-0">
              Populer
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-3">
          {template.description}
        </p>

        {/* Formula tags */}
        <div className="flex flex-wrap gap-1.5 mb-1">
          {template.formulas.map((formula, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] font-mono text-slate-400 border border-slate-800"
            >
              {formula}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable Preview Table */}
      <div className="border-t border-slate-800/60">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="w-full px-5 py-2.5 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-medium">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPreview ? "Sembunyikan pratinjau" : "Lihat pratinjau data"}
          </span>
          <span className="text-[10px] text-slate-500">
            {template.sampleColumns.length} kolom · {template.sampleRows.length} baris
          </span>
        </button>

        {showPreview && (
          <div className="overflow-x-auto border-t border-slate-800/40">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-slate-900/60">
                  {template.sampleColumns.map((col, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 text-left font-semibold text-slate-300 whitespace-nowrap border-b border-slate-800/60"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {template.sampleRows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={rowIdx % 2 === 0 ? "bg-slate-900/20" : "bg-transparent"}
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-3 py-1.5 text-slate-400 whitespace-nowrap border-b border-slate-800/30 tabular-nums"
                      >
                        {formatValue(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Download Button */}
      <div className="p-4 pt-3 border-t border-slate-800/60">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer active:scale-[0.98] disabled:cursor-wait ${
            downloaded
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
          }`}
        >
          {isDownloading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Membuat file...</span>
            </>
          ) : downloaded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Berhasil diunduh</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Download .xlsx</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
