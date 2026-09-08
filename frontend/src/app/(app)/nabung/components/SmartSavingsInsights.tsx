"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { SavingsInsight } from "../types";
import { formatCurrency } from "../utils";

interface SmartSavingsInsightsProps {
  insights: SavingsInsight[];
  onActionClick: (insight: SavingsInsight) => void;
}

export default function SmartSavingsInsights({
  insights,
  onActionClick,
}: SmartSavingsInsightsProps) {
  const [activeInsights, setActiveInsights] = useState<SavingsInsight[]>(insights);

  const handleDismiss = (id: string) => {
    setActiveInsights((prev) => prev.filter((item) => item.id !== id));
  };

  if (activeInsights.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-4 sm:p-5 border border-slate-800 bg-[#161c28] space-y-4"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
    >
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Smart Savings Insights
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
                AI Rekomendasi
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Analisis cerdas untuk mengoptimalkan alokasi kas dan mempercepat tercapainya target
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {activeInsights.map((insight) => (
          <div
            key={insight.id}
            className="p-3.5 rounded-xl bg-[#1a1f2e] border border-slate-800/90 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {insight.categoryTag}
                </span>
                <button
                  type="button"
                  onClick={() => handleDismiss(insight.id)}
                  className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
                  title="Abaikan saran"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-xs font-bold text-white leading-snug mb-1">
                {insight.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {insight.description}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="text-[10px] text-slate-400">
                Potensi: <strong className="text-emerald-400 tabular-nums">{formatCurrency(insight.potentialSavings)}</strong>
              </div>
              <button
                type="button"
                onClick={() => onActionClick(insight)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <span>{insight.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
