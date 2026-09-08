"use client";

import React from "react";
import { 
  Sparkles, 
  TrendingUp, 
  PieChart, 
  FileText, 
  Calculator, 
  ArrowRight, 
  Eye 
} from "lucide-react";
import { SheetTemplate } from "../types";
import { SHEET_TEMPLATES } from "../constants";

interface TemplateShowcaseProps {
  onSelectTemplate: (template: SheetTemplate) => void;
  onPreviewTemplate: (template: SheetTemplate) => void;
}

export default function TemplateShowcase({
  onSelectTemplate,
  onPreviewTemplate,
}: TemplateShowcaseProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "income_expense": return TrendingUp;
      case "budget": return PieChart;
      case "cashflow": return Sparkles;
      case "tax": return Calculator;
      case "pnl": return FileText;
      default: return Sparkles;
    }
  };

  return (
    <div id="templates-section" className="space-y-4 mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Templat Keuangan Google Sheets Siap Pakai
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Didesain khusus dengan formula otomatis, visualisasi pivot, dan format standar UMKM Indonesia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHEET_TEMPLATES.map((tpl) => {
          const Icon = getCategoryIcon(tpl.category);
          return (
            <div
              key={tpl.id}
              className="rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 p-5 shadow-md hover:border-blue-500/40 hover:bg-[#1a1f2e] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with Icon & Category */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tpl.isPopular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Populer
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                      {tpl.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Template Name & Description */}
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {tpl.description}
                </p>

                {/* Formula pills */}
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-semibold text-slate-400">Formula & Analisis:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tpl.formulas.slice(0, 2).map((formula, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2 py-0.5 rounded-md bg-slate-900/90 text-[10px] font-mono text-slate-300 border border-slate-800 truncate max-w-full"
                      >
                        {formula}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => onPreviewTemplate(tpl)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/70 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pratinjau</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTemplate(tpl)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  <span>Gunakan Templat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
