"use client";

import React from "react";
import {
  Briefcase,
  Utensils,
  ShoppingCart,
  Car,
  Zap,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { BudgetCategory } from "../types";
import { formatCurrency, formatPercentage } from "../constants";
import { cn } from "@/shared/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  Utensils,
  ShoppingCart,
  Car,
  Zap,
};

interface BudgetProgressProps {
  budgets: BudgetCategory[];
  onOpenBudgetModal: () => void;
}

export default function BudgetProgress({
  budgets,
  onOpenBudgetModal,
}: BudgetProgressProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-[#151B26] border border-slate-800/90 shadow-lg shadow-black/20 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Batas Anggaran Belanja
            </h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Pantau pengeluaran agar tetap hemat dan tidak melebihi rencana
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBudgetModal}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Atur Anggaran</span>
        </button>
      </div>

      {/* Budget Items List */}
      {budgets.length === 0 ? (
        <div className="p-6 text-center text-slate-400 text-xs">
          <p>Belum ada pos anggaran dengan limit aktif.</p>
          <button
            type="button"
            onClick={onOpenBudgetModal}
            className="mt-2 text-blue-400 hover:text-blue-300 font-semibold inline-block cursor-pointer"
          >
            + Atur Limit Anggaran
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((item) => {
            const IconComp = ICON_MAP[item.iconName] || HelpCircle;
            const ratio = item.budgetAmount > 0 ? (item.spentAmount / item.budgetAmount) * 100 : 0;
            const remaining = item.budgetAmount - item.spentAmount;

            let statusBadge = {
              label: "Aman",
              colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
              barClass: "bg-emerald-500",
              icon: CheckCircle2,
            };

            if (ratio >= 90) {
              statusBadge = {
                label: ratio > 100 ? "Melebihi Limit" : "Batas Kritis",
                colorClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
                barClass: "bg-rose-500",
                icon: AlertCircle,
              };
            } else if (ratio >= 75) {
              statusBadge = {
                label: "Waspada",
                colorClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                barClass: "bg-amber-500",
                icon: AlertTriangle,
              };
            }

            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 leading-tight">
                        {item.categoryName}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        Sisa: {remaining >= 0 ? formatCurrency(remaining) : `-${formatCurrency(Math.abs(remaining))}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border",
                        statusBadge.colorClass
                      )}
                    >
                      <StatusIcon className="w-2.5 h-2.5" />
                      {statusBadge.label}
                    </span>
                    <span className="text-xs font-bold text-white tabular-nums">
                      {formatPercentage(ratio)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={cn("h-full rounded-full transition-all duration-300", statusBadge.barClass)}
                    style={{ width: `${Math.min(ratio, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 tabular-nums">
                  <span>Terpakai: {formatCurrency(item.spentAmount)}</span>
                  <span>Limit: {formatCurrency(item.budgetAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
