"use client";

import React from "react";
import { TrendingUp, Target, CheckCircle2, CalendarClock, ArrowUpRight } from "lucide-react";
import { formatCurrency } from "../utils";
import { SavingsGoal } from "../types";

interface NabungKpiSummaryProps {
  goals: SavingsGoal[];
}

export default function NabungKpiSummary({ goals }: NabungKpiSummaryProps) {
  const totalCollected = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const completionRate = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;
  
  const completedGoalsCount = goals.filter((g) => g.status === "tercapai" || g.currentAmount >= g.targetAmount).length;
  
  const totalActiveAutoSave = goals
    .filter((g) => g.autoSave.enabled && g.status === "aktif")
    .reduce((acc, g) => acc + g.autoSave.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Total Terkumpul */}
      <div
        className="rounded-2xl p-4 sm:p-5 border border-slate-800 bg-[#161c28] hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          {totalTarget > 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> {completionRate}% Tercapai
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-full">
              {goals.length} Pos
            </span>
          )}
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">Total Terkumpul</p>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white mt-0.5 tabular-nums tracking-tight">
            {formatCurrency(totalCollected)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Dari {goals.length} pos tabungan aktif & arsip
          </p>
        </div>
      </div>

      {/* 2. Target Akumulasi */}
      <div
        className="rounded-2xl p-4 sm:p-5 border border-slate-800 bg-[#161c28] hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
            Tujuan Global
          </span>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">Akumulasi Target</p>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white mt-0.5 tabular-nums tracking-tight">
            {formatCurrency(totalTarget)}
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            Sisa kebutuhan: {formatCurrency(Math.max(0, totalTarget - totalCollected))}
          </p>
        </div>
      </div>

      {/* 3. Tingkat Capaian Global */}
      <div
        className="rounded-2xl p-4 sm:p-5 border border-slate-800 bg-[#161c28] hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            {completedGoalsCount} Target Lunas
          </span>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-slate-400 font-medium tracking-wide">Persentase Capaian</p>
            <span className="text-xs font-bold text-purple-400 tabular-nums">{completionRate}%</span>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white mt-0.5 tabular-nums tracking-tight">
            {completionRate}% Tercapai
          </h3>
          <div className="mt-2 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(100, completionRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Alokasi Auto-Save Rutin */}
      <div
        className="rounded-2xl p-4 sm:p-5 border border-slate-800 bg-[#161c28] hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between"
        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            Debit Terjadwal
          </span>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">Auto-Save Bulanan</p>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white mt-0.5 tabular-nums tracking-tight">
            {formatCurrency(totalActiveAutoSave)}
            <span className="text-xs font-normal text-slate-400 ml-1">/bln</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-1 truncate">
            {goals.filter((g) => g.autoSave.enabled).length} pos terhubung debit otomatis
          </p>
        </div>
      </div>
    </div>
  );
}
