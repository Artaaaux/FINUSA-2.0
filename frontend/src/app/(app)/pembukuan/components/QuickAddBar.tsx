"use client";

import React, { useState } from "react";
import {
  Zap,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { CategoryItem, TransactionType } from "../types";
import { AccountOption } from "../constants";
import { cn } from "@/shared/lib/utils";

interface QuickAddBarProps {
  categories: CategoryItem[];
  accounts: AccountOption[];
  onAddTransaction: (data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    categoryName: string;
    accountId: string;
    accountName: string;
    description: string;
    notes?: string;
  }) => void;
}

export default function QuickAddBar({
  categories,
  accounts,
  onAddTransaction,
}: QuickAddBarProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amountStr, setAmountStr] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter categories by selected type and deduplicate by name
  const availableCategories = React.useMemo(() => {
    const filtered = categories.filter((c) => c.type === type);
    const seen = new Set<string>();
    return filtered.filter((c) => {
      const lower = c.name.trim().toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [categories, type]);
  const activeCategory = availableCategories.find((c) => c.id === selectedCategoryId) || availableCategories[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr.replace(/[^0-9]/g, ""));
    if (!parsedAmount || parsedAmount <= 0) return;

    const chosenCat = activeCategory || availableCategories[0] || { id: "", name: type === "income" ? "Pemasukan" : "Pengeluaran" };
    const chosenAcc = accounts.find((a) => a.id === selectedAccountId) || accounts[0] || { id: "", name: "Rekening Kas" };

    setIsSubmitting(true);
    onAddTransaction({
      type,
      amount: parsedAmount,
      categoryId: chosenCat.id,
      categoryName: chosenCat.name,
      accountId: chosenAcc.id,
      accountName: chosenAcc.name,
      description: description.trim() || `${chosenCat.name}`,
    });

    setAmountStr("");
    setDescription("");
    setTimeout(() => setIsSubmitting(false), 200);
  };

  const quickAmounts = type === "expense" ? [25000, 50000, 100000, 250000, 500000] : [500000, 1000000, 2500000, 5000000];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#161c28] border border-slate-800 shadow-md space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <Zap className="w-3.5 h-3.5 fill-amber-400/20" />
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Input Cepat Transaksi
          </span>
        </div>

        {/* Type Toggle */}
        <div className="flex items-center gap-1 bg-[#0F1419] p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setType("expense");
              setSelectedCategoryId("");
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              type === "expense"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            )}
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Pengeluaran</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setType("income");
              setSelectedCategoryId("");
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              type === "income"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent"
            )}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pemasukan</span>
          </button>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        {/* Nominal Amount */}
        <div className="sm:col-span-3 space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">
            Nominal (Rp)
          </label>
          <input
            type="text"
            required
            placeholder="0"
            value={amountStr ? Number(amountStr.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              setAmountStr(raw);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-bold text-sm tabular-nums focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Select */}
        <div className="sm:col-span-3 space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">
            Kategori
          </label>
          <select
            value={selectedCategoryId || activeCategory?.id}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            {availableCategories.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#161c28] text-white">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description / Note */}
        <div className="sm:col-span-3 space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">
            Deskripsi / Catatan
          </label>
          <input
            type="text"
            placeholder="Keterangan transaksi..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Account Select */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">
            Metode Pembayaran
          </label>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer truncate"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id} className="bg-[#161c28] text-white">
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-1">
          <button
            type="submit"
            disabled={!amountStr || isSubmitting}
            className={cn(
              "w-full h-[42px] rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed",
              type === "expense"
                ? "bg-rose-600 hover:bg-rose-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            )}
            title="Simpan Transaksi"
          >
            {isSubmitting ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Quick Amount Chips */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
          Pintasan:
        </span>
        {quickAmounts.map((amt) => (
          <button
            key={amt}
            type="button"
            onClick={() => setAmountStr(String(amt))}
            className="px-2.5 py-1 rounded-lg bg-[#0F1419] border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-mono tabular-nums transition-colors cursor-pointer"
          >
            {amt.toLocaleString("id-ID")}
          </button>
        ))}
      </div>
    </div>
  );
}
