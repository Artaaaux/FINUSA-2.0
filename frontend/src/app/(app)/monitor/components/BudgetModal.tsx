"use client";

import React, { useState } from "react";
import { X, SlidersHorizontal, Check } from "lucide-react";
import { BudgetCategory } from "../types";
import { formatCurrency } from "../constants";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgets: BudgetCategory[];
  onSaveBudgets: (updated: BudgetCategory[]) => void;
}

export default function BudgetModal({
  isOpen,
  onClose,
  budgets,
  onSaveBudgets,
}: BudgetModalProps) {
  const [formData, setFormData] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    budgets.forEach((b) => {
      initial[b.id] = b.budgetAmount;
    });
    return initial;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (id: string, value: string) => {
    const numeric = parseInt(value.replace(/\D/g, ""), 10) || 0;
    setFormData((prev) => ({ ...prev, [id]: numeric }));
    setSavedSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = budgets.map((b) => ({
      ...b,
      budgetAmount: formData[b.id] || b.budgetAmount,
    }));
    onSaveBudgets(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#151B26] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-slate-200 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Pengaturan Limit Anggaran
              </h2>
              <span className="text-[11px] text-slate-400">
                Atur plafon maksimal pengeluaran bulanan per pos
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1">
            {budgets.map((b) => {
              const currentVal = formData[b.id] ?? b.budgetAmount;

              return (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">
                      {b.categoryName}
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      Realisasi saat ini: {formatCurrency(b.spentAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <span className="text-xs text-slate-400 font-medium">Rp</span>
                    <input
                      type="text"
                      value={currentVal.toLocaleString("id-ID")}
                      onChange={(e) => handleInputChange(b.id, e.target.value)}
                      className="w-32 px-2.5 py-1.5 text-right rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white tabular-nums focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2563EB] hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
