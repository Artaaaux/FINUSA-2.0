"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Calendar, 
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Target,
} from "lucide-react";
import { SavingsService } from "@/lib/services/savings.service";

interface GoalItem {
  id: string;
  name: string;
  category: string;
  userType: "Pelajar" | "Umum";
  target: number;
  current: number;
  deadline: string;
  monthlyRec: number;
  statusText: string;
  icon: React.ReactNode;
  accentColor: string;
  barGradient: string;
  badgeClass: string;
  iconContainerClass: string;
  ringStrokeColor: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function CircularProgressRing({ progress, strokeColor }: { progress: number; strokeColor: string }) {
  const radius = 20;
  const strokeWidth = 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-white tabular-nums leading-none">
          {progress}%
        </span>
      </div>
    </div>
  );
}

export default function SavingsGoals() {
  const [savingsList, setSavingsList] = useState<GoalItem[]>([]);
  const [depositedId, setDepositedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadGoals() {
      try {
        const dbGoals = await SavingsService.getSavingsGoals();
        if (dbGoals) {
          const mapped: GoalItem[] = dbGoals.slice(0, 3).map((g) => ({
            id: g.id,
            name: g.name,
            category: g.categoryLabel || g.category,
            userType: g.userType || "Pelajar",
            target: g.targetAmount,
            current: g.currentAmount,
            deadline: g.targetDate || "Des 2026",
            monthlyRec: Math.round(g.targetAmount / 6),
            statusText: g.currentAmount >= g.targetAmount ? "Tercapai" : "Sedang Berjalan",
            icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
            accentColor: "text-teal-400",
            barGradient: "from-teal-500 via-blue-400 to-teal-400",
            badgeClass: "text-teal-400 bg-teal-500/10 border-teal-500/25",
            iconContainerClass: "bg-teal-500/15 border-teal-500/30 text-teal-400",
            ringStrokeColor: g.ringStrokeColor || "#10B981",
          }));
          setSavingsList(mapped);
        }
      } catch (err) {
        console.warn("Failed to load savings goals from Supabase:", err);
      }
    }
    loadGoals();
  }, []);

  const totalTarget = savingsList.reduce((acc, curr) => acc + curr.target, 0);
  const totalCollected = savingsList.reduce((acc, curr) => acc + curr.current, 0);
  const totalPercentage = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;

  const handleQuickSave = (id: string) => {
    setDepositedId(id);
    const added = 500000;
    setSavingsList((prev) =>
      prev.map((item) => {
        if (item.id === id && item.current < item.target) {
          return {
            ...item,
            current: Math.min(item.target, item.current + added),
          };
        }
        return item;
      })
    );
    setTimeout(() => setDepositedId(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* ── Section Header + Global Progress Bar ── */}
      <div
        className="rounded-2xl p-5 sm:p-6 border border-slate-800 bg-[#161c28]"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400" aria-hidden="true" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Target Tabungan (Celengan Digital)
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/25">
                <Sparkles className="w-3 h-3" /> {savingsList.length} Pos Aktif
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rencana alokasi dana dan target finansial masa depan pelajar & umum
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/nabung"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Plus className="w-3.5 h-3.5" />
              Kelola Target
            </Link>
          </div>
        </div>

        {/* Global summary stats banner */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Total Terkumpul</p>
              <p className="text-sm sm:text-base font-bold text-white tabular-nums">
                {formatCurrency(totalCollected)}
              </p>
            </div>
          </div>

          <div className="sm:text-center">
            <p className="text-[11px] text-slate-400 font-medium">Akumulasi Target</p>
            <p className="text-sm sm:text-base font-bold text-slate-300 tabular-nums">
              {formatCurrency(totalTarget)}
            </p>
          </div>

          <div className="sm:text-right">
            <div className="flex items-center justify-between sm:justify-end gap-2 mb-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Progres Akumulasi</span>
              <span className="text-xs font-bold text-teal-400 tabular-nums">{totalPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-500"
                style={{ width: `${totalPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Goal Cards or Empty State ── */}
      {savingsList.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#161c28] p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto text-teal-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Belum Ada Target Tabungan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Mulai rencanakan pos dana darurat, pembelian alat kerja, atau tabungan impian Anda sekarang.
          </p>
          <Link
            href="/nabung"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Target Tabungan</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4.5">
          {savingsList.map((goal, i) => {
            const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
            const remaining = Math.max(0, goal.target - goal.current);
            const isDone = goal.current >= goal.target;
            const isJustDeposited = depositedId === goal.id;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group relative rounded-2xl border border-slate-800 bg-[#161c28] p-5 hover:border-slate-600 transition-all duration-200 flex flex-col justify-between"
                style={{
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {goal.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${goal.badgeClass}`}>
                      {goal.statusText}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${goal.iconContainerClass}`}>
                        {goal.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                          {goal.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Target: <span className="text-slate-300 font-medium">{goal.deadline}</span>
                        </p>
                      </div>
                    </div>

                    <CircularProgressRing
                      progress={progress}
                      strokeColor={goal.ringStrokeColor}
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2.5 mb-4">
                    <div className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Terkumpul</span>
                        <span className="text-sm font-bold text-white tabular-nums">
                          {formatCurrency(goal.current)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Target Akhir</span>
                        <span className="text-xs font-semibold text-slate-300 tabular-nums">
                          {formatCurrency(goal.target)}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${goal.barGradient} transition-all duration-700`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                      <span>{isDone ? "Target Selesai!" : `Sisa ${formatCurrency(remaining)}`}</span>
                      <span>Rekom: {formatCurrency(goal.monthlyRec)}/bln</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => handleQuickSave(goal.id)}
                    disabled={isDone}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isJustDeposited
                        ? "bg-emerald-600 text-white"
                        : isDone
                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    }`}
                  >
                    {isJustDeposited ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Tersimpan!</span>
                      </>
                    ) : isDone ? (
                      <span>Lunas Sempurna</span>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Setor Rp 500rb</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/nabung"
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Rincian target ${goal.name}`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
