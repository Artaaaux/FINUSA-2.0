"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Zap,
  Wallet,
  Clock,
} from "lucide-react";
import { SavingsGoal, AutoSaveSettings } from "../types";
import { ACCOUNT_OPTIONS } from "../constants";
import { formatCurrency, calculateMonthlyRecommendation } from "../utils";

interface AutoSaveModalProps {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAutoSave: (goalId: string, settings: AutoSaveSettings) => void;
}

export default function AutoSaveModal({
  goal,
  isOpen,
  onClose,
  onSaveAutoSave,
}: AutoSaveModalProps) {
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState<"harian" | "mingguan" | "bulanan">("bulanan");
  const [amount, setAmount] = useState<number>(1000000);
  const [sourceAccount, setSourceAccount] = useState<string>(ACCOUNT_OPTIONS[0].name);
  const [dayOfMonth, setDayOfMonth] = useState<number>(25);

  useEffect(() => {
    if (goal) {
      setEnabled(goal.autoSave.enabled);
      setFrequency(goal.autoSave.frequency || "bulanan");
      const rec = calculateMonthlyRecommendation(
        goal.currentAmount,
        goal.targetAmount,
        goal.targetDate
      );
      setAmount(goal.autoSave.amount > 0 ? goal.autoSave.amount : rec || 500000);
      setSourceAccount(goal.autoSave.sourceAccount || ACCOUNT_OPTIONS[0].name);
      setDayOfMonth(goal.autoSave.dayOfMonth || 25);
    }
  }, [goal, isOpen]);

  if (!isOpen || !goal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nextDate = new Date();
    if (frequency === "bulanan") {
      nextDate.setDate(dayOfMonth);
      if (nextDate < new Date()) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
    } else if (frequency === "mingguan") {
      nextDate.setDate(nextDate.getDate() + 7);
    } else {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    const settings: AutoSaveSettings = {
      enabled,
      frequency,
      amount,
      sourceAccount,
      nextDebitDate: nextDate.toISOString().split("T")[0],
      dayOfMonth,
    };

    onSaveAutoSave(goal.id, settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#161c28] border border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1a1f2e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Konfigurasi Auto-Save
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">
                Pos: <strong className="text-slate-200">{goal.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Toggle Enable */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1a1f2e] border border-slate-700">
            <div>
              <span className="text-xs font-bold text-white block">Status Debit Otomatis</span>
              <span className="text-[11px] text-slate-400">
                {enabled ? "Aktif (Auto-debit berjalan)" : "Nonaktif (Tabungan manual saja)"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                enabled ? "bg-amber-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  enabled ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              {/* Frequency */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Frekuensi Pemotongan
                </label>
                <div className="flex bg-[#1a1f2e] border border-slate-700 rounded-xl p-1">
                  {(["harian", "mingguan", "bulanan"] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`flex-1 py-1.5 text-xs rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                        frequency === freq
                          ? "bg-amber-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nominal per Pemotongan (Rp)
                </label>
                <input
                  type="number"
                  min={50000}
                  step={50000}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-[#1a1f2e] border border-slate-700 rounded-xl text-base font-bold text-white focus:outline-none focus:border-amber-500 tabular-nums transition-colors"
                />
                <div className="text-[11px] text-slate-400 mt-1 font-medium">
                  {formatCurrency(amount)} / {frequency}
                </div>
              </div>

              {/* Source Account */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-blue-400" />
                  <span>Rekening Sumber Debit</span>
                </label>
                <select
                  value={sourceAccount}
                  onChange={(e) => setSourceAccount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1f2e] border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {ACCOUNT_OPTIONS.map((acc) => (
                    <option key={acc.id} value={acc.name} className="bg-[#1a1f2e]">
                      {acc.name} — Saldo: {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day of Month Selection (if monthly) */}
              {frequency === "bulanan" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tanggal Eksekusi Bulanan (1 - 28)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(Number(e.target.value) || 25)}
                    className="w-full px-3.5 py-2 bg-[#1a1f2e] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 transition-colors tabular-nums"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    Disarankan tanggal 25-28 (setelah tanggal gajian / terima omzet rutin).
                  </span>
                </div>
              )}

              {/* Schedule Timeline Preview */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Jadwal 3 Pemotongan Berikutnya:</span>
                </div>
                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Siklus 1 (Terdekat)</span>
                    <strong className="text-white tabular-nums">
                      {formatCurrency(amount)} • Tanggal {dayOfMonth} bln depan
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Siklus 2</span>
                    <strong className="text-white tabular-nums">
                      {formatCurrency(amount)} • Tanggal {dayOfMonth} (+2 bln)
                    </strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Siklus 3</span>
                    <strong className="text-white tabular-nums">
                      {formatCurrency(amount)} • Tanggal {dayOfMonth} (+3 bln)
                    </strong>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              Simpan Konfigurasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
