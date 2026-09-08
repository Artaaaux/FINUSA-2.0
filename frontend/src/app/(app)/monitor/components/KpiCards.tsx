"use client";

import React from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Percent,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardSummary } from "../types";
import { formatCurrency, formatPercentage } from "../constants";
import { cn } from "@/shared/lib/utils";

interface KpiCardsProps {
  summary: DashboardSummary;
}

export default function KpiCards({ summary }: KpiCardsProps) {
  const { kpis, netCashflow } = summary;

  const cardItems = [
    {
      id: "balance",
      label: kpis.balance.title,
      value: formatCurrency(kpis.balance.value),
      rawAmount: kpis.balance.value,
      icon: Wallet,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      accentBorder: "hover:border-blue-500/40",
      trendPercent: kpis.balance.changePercentage,
      isPositive: kpis.balance.isPositive,
      trendText: kpis.balance.trendText,
      subInfo: netCashflow >= 0 ? `Sisa Bersih: +${formatCurrency(netCashflow)}` : `Defisit Bersih: -${formatCurrency(Math.abs(netCashflow))}`,
      subInfoPositive: netCashflow >= 0,
    },
    {
      id: "income",
      label: kpis.income.title,
      value: formatCurrency(kpis.income.value),
      rawAmount: kpis.income.value,
      icon: ArrowDownLeft,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      accentBorder: "hover:border-emerald-500/40",
      trendPercent: kpis.income.changePercentage,
      isPositive: kpis.income.isPositive,
      trendText: kpis.income.trendText,
      subInfo: "Total uang masuk periode ini",
    },
    {
      id: "expense",
      label: kpis.expense.title,
      value: formatCurrency(kpis.expense.value),
      rawAmount: kpis.expense.value,
      icon: ArrowUpRight,
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border-rose-500/20",
      accentBorder: "hover:border-rose-500/40",
      trendPercent: Math.abs(kpis.expense.changePercentage),
      isPositive: kpis.expense.isPositive,
      trendText: kpis.expense.trendText,
      subInfo: "Total uang keluar periode ini",
    },
    {
      id: "savingRate",
      label: kpis.savingRate.title,
      value: formatPercentage(kpis.savingRate.value),
      rawAmount: kpis.savingRate.value,
      icon: Percent,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      accentBorder: "hover:border-amber-500/40",
      trendPercent: kpis.savingRate.changePercentage,
      isPositive: kpis.savingRate.isPositive,
      trendText: kpis.savingRate.trendText,
      subInfo: "Batas ideal: min. 20% pendapatan",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4">
      {cardItems.map((item, index) => {
        const IconComponent = item.icon;
        const isTrendPositive = item.isPositive;
        const isHero = index === 0;

        return (
          <div
            key={item.id}
            className={cn(
              "relative overflow-hidden rounded-xl sm:rounded-2xl",
              "bg-[#151B26] border border-slate-800/90 shadow-lg shadow-black/20",
              "transition-all duration-200 hover:-translate-y-0.5",
              item.accentBorder,
              // Hero card: full width on mobile, taller, more padding
              isHero
                ? "col-span-2 lg:col-span-1 p-4 sm:p-5"
                : "p-3 sm:p-5"
            )}
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
              <span className={cn(
                "font-medium text-slate-400",
                isHero ? "text-xs sm:text-sm" : "text-[11px] sm:text-sm"
              )}>
                {item.label}
              </span>
              <div
                className={cn(
                  "rounded-xl flex items-center justify-center border",
                  item.iconBg,
                  isHero ? "w-8 h-8 sm:w-9 sm:h-9" : "w-7 h-7 sm:w-9 sm:h-9"
                )}
              >
                <IconComponent className={cn(
                  item.iconColor,
                  isHero ? "w-4 h-4" : "w-3.5 h-3.5 sm:w-4 sm:h-4"
                )} />
              </div>
            </div>

            {/* Main Metric Value */}
            <div className={cn("space-y-1.5 sm:space-y-2")}>
              <div className={cn(
                "font-bold tracking-tight text-white tabular-nums",
                isHero ? "text-xl sm:text-2xl" : "text-base sm:text-2xl"
              )}>
                {item.value}
              </div>

              {/* Trend Badge & Comparison Text */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold tabular-nums",
                    isTrendPositive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                  )}
                >
                  {isTrendPositive ? (
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  )}
                  {item.trendPercent > 0 ? `+${item.trendPercent.toFixed(1)}%` : `${item.trendPercent.toFixed(1)}%`}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 truncate">
                  {item.trendText}
                </span>
              </div>

              {/* Context Note — hidden on mobile for non-hero, visible for hero */}
              <div className={cn(
                "pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between",
                isHero ? "block" : "hidden sm:flex"
              )}>
                <span>{item.subInfo}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
