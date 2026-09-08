"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Scale,
  Clock,
} from "lucide-react";
import { PembukuanKpiData } from "../types";
import { formatCurrency } from "../constants";
import { cn } from "@/shared/lib/utils";

interface PembukuanKpiCardsProps {
  kpiData: PembukuanKpiData;
}

export default function PembukuanKpiCards({ kpiData }: PembukuanKpiCardsProps) {
  const isNetPositive = kpiData.netCashflow >= 0;

  const cards = [
    {
      title: "Total Pemasukan",
      value: kpiData.totalIncome,
      icon: TrendingUp,
      accentColor: "text-emerald-400",
      containerClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      description: "Kas masuk periode ini",
    },
    {
      title: "Total Pengeluaran",
      value: kpiData.totalExpense,
      icon: TrendingDown,
      accentColor: "text-rose-400",
      containerClass: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      description: "Beban & operasional usaha",
    },
    {
      title: "Arus Kas Bersih",
      value: kpiData.netCashflow,
      icon: Scale,
      accentColor: isNetPositive ? "text-blue-400" : "text-amber-400",
      containerClass: isNetPositive
        ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
        : "bg-amber-500/10 border-amber-500/20 text-amber-400",
      description: isNetPositive ? "Surplus kas operasional" : "Defisit periode terpilih",
    },
    {
      title: "Transaksi Pending",
      value: kpiData.pendingTotal,
      icon: Clock,
      accentColor: "text-amber-400",
      containerClass: "bg-amber-500/10 border-amber-500/20 text-amber-400",
      description: `${kpiData.pendingCount} transaksi belum selesai`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-[#161c28] border border-slate-800/90 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {card.title}
              </span>
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border", card.containerClass)}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <p className="text-lg sm:text-xl font-bold text-white tracking-tight tabular-nums">
                {formatCurrency(card.value)}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
