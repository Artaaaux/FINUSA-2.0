"use client";

import React from "react";
import { X, Calendar, Building2, Tag, FileText, CheckCircle2, User, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Transaction } from "../types";
import { formatCurrency, formatDateIndo } from "../constants";
import { cn } from "@/shared/lib/utils";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailModal({
  transaction,
  onClose,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const isIncome = transaction.type === "income";

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#151B26] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-slate-200 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center border",
                isIncome
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              )}
            >
              {isIncome ? (
                <ArrowDownLeft className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Rincian Transaksi
              </h2>
              <span className="text-[11px] text-slate-400">
                ID: {transaction.id}
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

        {/* Amount Box */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium">
            {isIncome ? "Total Dana Masuk" : "Total Dana Keluar"}
          </span>
          <div
            className={cn(
              "text-2xl font-extrabold tabular-nums tracking-tight",
              isIncome ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {isIncome ? `+${formatCurrency(transaction.amount)}` : `-${formatCurrency(transaction.amount)}`}
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Transaksi Berhasil</span>
          </div>
        </div>

        {/* Metadata Details */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start justify-between gap-3 py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Deskripsi
            </span>
            <span className="font-semibold text-white text-right">
              {transaction.description}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Pihak / Merchant
            </span>
            <span className="font-medium text-slate-200">
              {transaction.merchant || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              Tanggal
            </span>
            <span className="font-medium text-slate-200">
              {formatDateIndo(transaction.date)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              Kategori Pos
            </span>
            <span className="font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {transaction.category}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Akun Pembayaran
            </span>
            <span className="font-medium text-slate-200">
              {transaction.account}
            </span>
          </div>

          {transaction.notes && (
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/70 text-[11px] space-y-1">
              <span className="text-slate-400 font-semibold block">Catatan Tambahan:</span>
              <p className="text-slate-300 italic">{transaction.notes}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
