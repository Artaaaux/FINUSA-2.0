"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  Calendar,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Zap,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { SavingsGoal } from "../types";
import {
  formatCurrency,
  formatDateIndo,
  calculateDaysRemaining,
  calculateMonthlyRecommendation,
} from "../utils";

interface GoalCardProps {
  goal: SavingsGoal;
  onQuickDeposit: (goalId: string, amount: number) => void;
  onOpenDetail: (goal: SavingsGoal) => void;
  onOpenDepositModal: (goal: SavingsGoal) => void;
  onOpenAutoSaveModal: (goal: SavingsGoal) => void;
  onEditGoal: (goal: SavingsGoal) => void;
  onDeleteGoal: (goalId: string) => void;
}

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "ShieldCheck":
      return <ShieldCheck className="w-5 h-5" />;
    case "Store":
      return <Store className="w-5 h-5" />;
    case "Laptop":
      return <Laptop className="w-5 h-5" />;
    case "GraduationCap":
      return <GraduationCap className="w-5 h-5" />;
    case "Home":
      return <Home className="w-5 h-5" />;
    case "Car":
      return <Car className="w-5 h-5" />;
    case "Plane":
      return <Plane className="w-5 h-5" />;
    case "TrendingUp":
      return <TrendingUp className="w-5 h-5" />;
    default:
      return <Target className="w-5 h-5" />;
  }
}

function CircularProgress({ progress, strokeColor }: { progress: number; strokeColor: string }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, progress) / 100) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3.5"
        />
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[11px] font-bold text-white tabular-nums leading-none">
          {progress}%
        </span>
      </div>
    </div>
  );
}

export default function GoalCard({
  goal,
  onQuickDeposit,
  onOpenDetail,
  onOpenDepositModal,
  onOpenAutoSaveModal,
  onEditGoal,
  onDeleteGoal,
}: GoalCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [justDeposited, setJustDeposited] = useState(false);

  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const daysLeft = calculateDaysRemaining(goal.targetDate);
  const isDone = goal.currentAmount >= goal.targetAmount || goal.status === "tercapai";
  const monthlyRec = calculateMonthlyRecommendation(
    goal.currentAmount,
    goal.targetAmount,
    goal.targetDate
  );

  const priorityStyles = {
    tinggi: "text-rose-400 bg-rose-500/10 border-rose-500/25",
    sedang: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    rendah: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  };

  const handleQuickSave = () => {
    if (isDone) return;
    setJustDeposited(true);
    // default quick save 500k or sisa jika kurang
    const saveAmount = Math.min(500000, remaining);
    onQuickDeposit(goal.id, saveAmount > 0 ? saveAmount : 500000);
    setTimeout(() => setJustDeposited(false), 1200);
  };

  return (
    <div
      className="group relative rounded-2xl border border-slate-800 bg-[#161c28] p-4 sm:p-5 hover:border-slate-700/90 transition-all duration-200 flex flex-col justify-between"
      style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
    >
      <div>
        {/* Top Badges Bar & Options Menu */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80">
              {goal.categoryLabel}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${
                priorityStyles[goal.priority] || priorityStyles.sedang
              }`}
            >
              Prioritas {goal.priority}
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Menu opsi pos"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-7 w-40 rounded-xl bg-[#1f2534] border border-slate-700 shadow-xl z-30 py-1 text-xs">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenDetail(goal);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
                  >
                    <Target className="w-3.5 h-3.5 text-blue-400" />
                    <span>Lihat Detail</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAutoSaveModal(goal);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Atur Auto-Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onEditGoal(goal);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700/80 flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ubah Target</span>
                  </button>
                  <div className="border-t border-slate-700 my-1" />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeleteGoal(goal.id);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Pos</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card Header: Icon + Title + Circular Gauge */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${goal.iconContainerClass}`}
            >
              {getIconComponent(goal.iconName)}
            </div>
            <div className="min-w-0">
              <h3
                onClick={() => onOpenDetail(goal)}
                className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug cursor-pointer line-clamp-1"
                title={goal.name}
              >
                {goal.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Target:</span>
                <span className="text-slate-300 font-medium">{formatDateIndo(goal.targetDate)}</span>
              </p>
            </div>
          </div>

          <CircularProgress progress={progress} strokeColor={goal.ringStrokeColor} />
        </div>

        {/* Progress Container & Amounts */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 mb-3.5">
          <div className="flex justify-between items-baseline text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Terkumpul</span>
              <span className="text-sm font-extrabold text-white tabular-nums tracking-tight">
                {formatCurrency(goal.currentAmount)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-medium">Target Akhir</span>
              <span className="text-xs font-semibold text-slate-300 tabular-nums">
                {formatCurrency(goal.targetAmount)}
              </span>
            </div>
          </div>

          {/* Progress Bar with Milestone Markers */}
          <div className="relative">
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${goal.gradient}`}
              />
            </div>
            {/* Milestone Markers */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-0.5">
              {[25, 50, 75, 100].map((m) => (
                <div
                  key={m}
                  className={`w-2 h-2 rounded-full border border-slate-900 ${
                    progress >= m ? "bg-white shadow-[0_0_8px_white]" : "bg-slate-700"
                  }`}
                  style={{ left: `${m}%` }}
                />
              ))}
            </div>
          </div>

          {/* Sisa & Rekomendasi Setor */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5 flex-wrap gap-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {isDone ? (
                <span className="text-emerald-400 font-semibold">Tercapai Sempurna!</span>
              ) : (
                <>
                  <strong className="text-slate-300 tabular-nums">{daysLeft}</strong> hari lagi
                </>
              )}
            </span>
            <span>
              {isDone ? (
                <span className="text-slate-500">Selesai</span>
              ) : (
                <>
                  Rekom: <strong className="text-slate-300 tabular-nums">{formatCurrency(monthlyRec)}/bln</strong>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Auto-Save Status Pill */}
        <div className="flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-lg bg-[#1a1f2e] border border-slate-800/80 mb-3">
          <div className="flex items-center gap-1.5">
            <Zap
              className={`w-3 h-3 ${
                goal.autoSave.enabled ? "text-amber-400 fill-amber-400/30" : "text-slate-500"
              }`}
            />
            <span className="text-slate-400">
              {goal.autoSave.enabled ? "Auto-Save Aktif:" : "Auto-Save Nonaktif"}
            </span>
            {goal.autoSave.enabled && (
              <span className="font-semibold text-slate-200 tabular-nums">
                {formatCurrency(goal.autoSave.amount)}/bln
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenAutoSaveModal(goal)}
            className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            {goal.autoSave.enabled ? "Ubah" : "Aktifkan"}
          </button>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={handleQuickSave}
          disabled={isDone}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isDone
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 cursor-default"
              : justDeposited
              ? "bg-emerald-500 text-white shadow-sm"
              : "bg-[#1f2534] hover:bg-slate-700 text-slate-200 border border-slate-700"
          }`}
        >
          {isDone ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Target Selesai
            </>
          ) : justDeposited ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              +Rp 500k Masuk!
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              + Setor Rp 500rb
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onOpenDepositModal(goal)}
          disabled={isDone}
          className="px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-[#1f2534] hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          title="Setor nominal kustom"
        >
          Nominal Lain
        </button>

        <button
          type="button"
          onClick={() => onOpenDetail(goal)}
          className="p-2 rounded-xl border border-slate-800 bg-[#1f2534] hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label={`Buka detail pos ${goal.name}`}
          title="Lihat Detail & Analisis"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
