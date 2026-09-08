"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Zap,
  TrendingUp,
  History,
  Clock,
  Plus,
  Edit2,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { SavingsGoal } from "../types";
import {
  formatCurrency,
  formatShortCurrency,
  formatDateIndo,
  calculateDaysRemaining,
  calculateMonthlyRecommendation,
  calculateDailyRecommendation,
  generateSavingsProjection,
} from "../utils";

interface GoalDetailModalProps {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit: (goal: SavingsGoal) => void;
  onOpenEdit: (goal: SavingsGoal) => void;
  onOpenAutoSave: (goal: SavingsGoal) => void;
}

export default function GoalDetailModal({
  goal,
  isOpen,
  onClose,
  onOpenDeposit,
  onOpenEdit,
  onOpenAutoSave,
}: GoalDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "autosave">("overview");

  if (!isOpen || !goal) return null;

  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
  const daysLeft = calculateDaysRemaining(goal.targetDate);
  const isDone = goal.currentAmount >= goal.targetAmount || goal.status === "tercapai";

  const monthlyRec = calculateMonthlyRecommendation(
    goal.currentAmount,
    goal.targetAmount,
    goal.targetDate
  );
  const dailyRec = calculateDailyRecommendation(
    goal.currentAmount,
    goal.targetAmount,
    goal.targetDate
  );

  const projectionData = generateSavingsProjection(
    goal.currentAmount,
    goal.targetAmount,
    goal.autoSave.enabled && goal.autoSave.amount > 0 ? goal.autoSave.amount : monthlyRec,
    goal.targetDate
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-[#161c28] border border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-[#1a1f2e] border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${goal.iconContainerClass}`}
            >
              <span className="text-sm font-bold">{goal.categoryLabel.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {goal.categoryLabel}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {goal.userType}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize ${
                    goal.priority === "tinggi"
                      ? "text-rose-400 bg-rose-500/10 border-rose-500/25"
                      : "text-amber-400 bg-amber-500/10 border-amber-500/25"
                  }`}
                >
                  Prioritas {goal.priority}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                {goal.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{goal.description}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#121721] px-5 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
          {[
            { id: "overview", label: "Ringkasan & Proyeksi", icon: TrendingUp },
            { id: "history", label: `Riwayat (${goal.transactions.length})`, icon: History },
            { id: "autosave", label: "Debit Otomatis (Auto-Save)", icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* Progress Big Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1a1f2e] border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Akumulasi Saldo</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight mt-0.5">
                      {formatCurrency(goal.currentAmount)}
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-xs text-slate-400 font-medium">Target Akhir</span>
                    <div className="text-xl sm:text-2xl font-bold text-slate-300 tabular-nums mt-0.5">
                      {formatCurrency(goal.targetAmount)}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Capaian</span>
                    <span className="text-emerald-400 font-bold tabular-nums">{progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${goal.gradient} transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* 4 Milestones */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {goal.milestones.map((m) => {
                    const isUnlocked = progress >= m.percentage;
                    return (
                      <div
                        key={m.level}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isUnlocked
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                            : "bg-slate-900/60 border-slate-800 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                          {isUnlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-600" />
                          )}
                          <span>{m.level}% Milestone</span>
                        </div>
                        <p className="text-[10px] mt-1 truncate">{m.label}</p>
                        {m.reachedAt && (
                          <p className="text-[9px] text-slate-400 mt-0.5">{formatDateIndo(m.reachedAt)}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#1a1f2e] border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Target Waktu</span>
                  </div>
                  <div className="text-sm font-bold text-white">{formatDateIndo(goal.targetDate)}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{daysLeft} hari tersisa</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1a1f2e] border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sisa Kebutuhan</span>
                  </div>
                  <div className="text-sm font-bold text-white tabular-nums">
                    {formatCurrency(remaining)}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isDone ? "Selesai penuh" : "Perlu dikumpulkan"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1a1f2e] border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rekomendasi Setor</span>
                  </div>
                  <div className="text-sm font-bold text-white tabular-nums">
                    {formatCurrency(monthlyRec)}
                    <span className="text-[10px] font-normal text-slate-400">/bln</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    atau {formatCurrency(dailyRec)}/hari
                  </p>
                </div>
              </div>

              {/* Projection Chart */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1a1f2e] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-teal-400" />
                      Simulasi Pertumbuhan Saldo
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Proyeksi akumulasi tabungan hingga batas target dengan alokasi saat ini
                    </p>
                  </div>
                </div>

                <div className="h-48 sm:h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="bulan"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => formatShortCurrency(val)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2534",
                          borderColor: "#334155",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                        }}
                        formatter={(value) => [formatCurrency(Number(value) || 0), "Akumulasi"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="akumulasi"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#goalGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Daftar transaksi setoran yang masuk ke pos <strong>{goal.name}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => onOpenDeposit(goal)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Setor Dana Baru</span>
                </button>
              </div>

              {goal.transactions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-[#1a1f2e] border border-slate-800 text-slate-400">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p className="text-xs">Belum ada transaksi setoran pada pos ini.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800 rounded-2xl bg-[#1a1f2e] border border-slate-800 overflow-hidden">
                  {goal.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{tx.notes || "Setoran Tabungan"}</span>
                            {tx.isAutoSave && (
                              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                Auto-Save
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {formatDateIndo(tx.date)} • Rekening: {tx.sourceAccount}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-emerald-400 tabular-nums">
                          +{formatCurrency(tx.amount)}
                        </div>
                        <span className="text-[10px] text-slate-500">{tx.method}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "autosave" && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1a1f2e] border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Status Debit Otomatis</h4>
                      <p className="text-xs text-slate-400">
                        {goal.autoSave.enabled
                          ? "Auto-Save aktif dan menyisihkan dana otomatis sesuai jadwal"
                          : "Auto-Save saat ini dinonaktifkan"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      goal.autoSave.enabled
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                        : "text-slate-400 bg-slate-800 border-slate-700"
                    }`}
                  >
                    {goal.autoSave.enabled ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-500 block mb-0.5">Nominal per Siklus</span>
                    <strong className="text-sm text-white tabular-nums">
                      {formatCurrency(goal.autoSave.amount)}
                    </strong>
                    <span className="text-slate-400 ml-1">/{goal.autoSave.frequency}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="text-slate-500 block mb-0.5">Rekening Sumber</span>
                    <strong className="text-sm text-white truncate block">
                      {goal.autoSave.sourceAccount}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAutoSave(goal)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Konfigurasi Ulang Jadwal & Akun Auto-Save</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#1a1f2e] border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => onOpenEdit(goal)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Ubah Target</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => onOpenDeposit(goal)}
              disabled={isDone}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-[0_0_16px_rgba(37,99,235,0.25)] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Setor Dana Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
