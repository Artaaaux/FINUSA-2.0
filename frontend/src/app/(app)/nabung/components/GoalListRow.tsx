"use client";

import React from "react";
import {
  ShieldCheck,
  Store,
  Laptop,
  GraduationCap,
  Home,
  Car,
  Plane,
  TrendingUp,
  Target,
  Plus,
  ArrowRight,
  Zap,
} from "lucide-react";
import { SavingsGoal } from "../types";
import {
  formatCurrency,
  formatDateIndo,
  calculateDaysRemaining,
} from "../utils";

interface GoalListRowProps {
  goal: SavingsGoal;
  onQuickDeposit: (goalId: string, amount: number) => void;
  onOpenDetail: (goal: SavingsGoal) => void;
  onOpenDepositModal: (goal: SavingsGoal) => void;
  onOpenAutoSaveModal: (goal: SavingsGoal) => void;
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "ShieldCheck":
      return <ShieldCheck className="w-4 h-4" />;
    case "Store":
      return <Store className="w-4 h-4" />;
    case "Laptop":
      return <Laptop className="w-4 h-4" />;
    case "GraduationCap":
      return <GraduationCap className="w-4 h-4" />;
    case "Home":
      return <Home className="w-4 h-4" />;
    case "Car":
      return <Car className="w-4 h-4" />;
    case "Plane":
      return <Plane className="w-4 h-4" />;
    case "TrendingUp":
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Target className="w-4 h-4" />;
  }
}

export default function GoalListRow({
  goal,
  onQuickDeposit,
  onOpenDetail,
  onOpenDepositModal,
  onOpenAutoSaveModal,
}: GoalListRowProps) {
  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const daysLeft = calculateDaysRemaining(goal.targetDate);
  const isDone = goal.currentAmount >= goal.targetAmount || goal.status === "tercapai";

  return (
    <div className="group bg-[#161c28] border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 sm:p-4 transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
      {/* Left: Icon, Name, Category */}
      <div className="flex items-center gap-3 min-w-[240px]">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${goal.iconContainerClass}`}
        >
          {getIconComponent(goal.iconName)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4
              onClick={() => onOpenDetail(goal)}
              className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors cursor-pointer truncate"
            >
              {goal.name}
            </h4>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
              {goal.categoryLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
            <span>Target: {formatDateIndo(goal.targetDate)}</span>
            <span>•</span>
            <span className="text-slate-300">{daysLeft} hari tersisa</span>
            {goal.autoSave.enabled && (
              <>
                <span>•</span>
                <span className="text-amber-400 inline-flex items-center gap-0.5">
                  <Zap className="w-3 h-3" /> Auto-Save
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center: Progress & Figures */}
      <div className="flex-1 max-w-xs space-y-1.5">
        <div className="flex justify-between items-baseline text-xs">
          <span className="text-white font-bold tabular-nums">
            {formatCurrency(goal.currentAmount)}
          </span>
          <span className="text-slate-400 text-[11px] tabular-nums">
            {formatCurrency(goal.targetAmount)} ({progress}%)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${goal.gradient}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
        <button
          type="button"
          onClick={() => onQuickDeposit(goal.id, 500000)}
          disabled={isDone}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>+500rb</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenDepositModal(goal)}
          disabled={isDone}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-[#1f2534] hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
        >
          Setor Lain
        </button>

        <button
          type="button"
          onClick={() => onOpenAutoSaveModal(goal)}
          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
            goal.autoSave.enabled
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
              : "bg-[#1f2534] border-slate-700 text-slate-400 hover:text-white"
          }`}
          title="Atur Auto-Save"
        >
          <Zap className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onOpenDetail(goal)}
          className="p-1.5 rounded-xl bg-[#1f2534] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Detail Pos"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
