"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Wallet,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { SavingsGoal } from "../types";
import { ACCOUNT_OPTIONS } from "../constants";
import { formatCurrency } from "../utils";

interface AddMoneyModalProps {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitDeposit: (
    goalId: string,
    amount: number,
    sourceAccount: string,
    notes: string
  ) => void;
}

export default function AddMoneyModal({
  goal,
  isOpen,
  onClose,
  onSubmitDeposit,
}: AddMoneyModalProps) {
  const [amount, setAmount] = useState<number>(500000);
  const [sourceAccount, setSourceAccount] = useState<string>(ACCOUNT_OPTIONS[0].name);
  const [notes, setNotes] = useState<string>("Setoran Tabungan");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (goal) {
      const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
      setAmount(remaining > 0 && remaining < 500000 ? remaining : 500000);
      setNotes("Setoran rutin ke pos " + goal.name);
      setError("");
    }
  }, [goal, isOpen]);

  if (!isOpen || !goal) return null;

  const quickPresets = [100000, 250000, 500000, 1000000, 2500000, 5000000];

  const currentAmount = goal.currentAmount;
  const newAmount = currentAmount + (amount || 0);
  const newProgress = Math.min(100, Math.round((newAmount / goal.targetAmount) * 100));
  const oldProgress = Math.min(100, Math.round((currentAmount / goal.targetAmount) * 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError("Masukkan nominal setoran yang valid");
      return;
    }
    onSubmitDeposit(goal.id, amount, sourceAccount, notes);
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
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Setor Dana Tabungan
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
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Quick Amount Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Pilih Nominal Cepat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    amount === preset
                      ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm"
                      : "bg-[#1a1f2e] border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  +{formatCurrency(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nominal Setoran (Rp)
            </label>
            <input
              type="number"
              min={10000}
              step={10000}
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-[#1a1f2e] border border-slate-700 rounded-xl text-base font-bold text-white focus:outline-none focus:border-emerald-500 tabular-nums transition-colors"
            />
          </div>

          {/* Source Account Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              <span>Pilih Rekening / Sumber Dana</span>
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

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Catatan Setoran (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Sisa uang saku, Omzet bazar akhir pekan..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1a1f2e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Progress Impact Preview */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-medium block">
              Pratinjau Dampak Setoran:
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Saldo: <strong className="text-slate-300 tabular-nums">{formatCurrency(currentAmount)}</strong> ({oldProgress}%)
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-emerald-400 font-bold tabular-nums">
                {formatCurrency(newAmount)} ({newProgress}%)
              </span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${newProgress}%` }}
              />
            </div>
            {newProgress >= 100 && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Target tabungan akan tercapai 100% dengan setoran ini!</span>
              </div>
            )}
          </div>

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
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Konfirmasi Setoran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
