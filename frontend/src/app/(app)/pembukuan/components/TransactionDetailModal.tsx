"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Scale,
  Edit3,
  Trash2,
  Copy,
} from "lucide-react";
import { PembukuanTransaction } from "../types";
import { formatCurrency, formatDateIndo } from "../constants";
import { cn } from "@/shared/lib/utils";

interface TransactionDetailModalProps {
  transaction: PembukuanTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (tx: PembukuanTransaction) => void;
  onDelete: (id: string) => void;
  onDuplicate: (tx: PembukuanTransaction) => void;
}

export default function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const isIncome = transaction.type === "income";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-lg bg-[#161c28] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121721]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Transaksi
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {transaction.id}
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Amount Display */}
              <div className="p-4 rounded-xl bg-[#0F1419] border border-slate-800 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">
                  {isIncome ? "Total Pemasukan" : "Total Pengeluaran"}
                </span>
                <p
                  className={cn(
                    "text-2xl font-extrabold tracking-tight tabular-nums",
                    isIncome ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {transaction.status === "completed" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Selesai (Lunas)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-semibold">
                      <AlertCircle className="w-3 h-3" />
                      <span>Pending (Tertunda)</span>
                    </span>
                  )}

                  {transaction.isReconciled && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-semibold">
                      <Scale className="w-3 h-3" />
                      <span>Terekonsiliasi Bank</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Transaction Key Details */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Deskripsi</span>
                  <span className="font-bold text-white text-right max-w-xs">
                    {transaction.description}
                  </span>
                </div>

                {transaction.merchant && (
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400 font-medium">Pihak / Toko</span>
                    <span className="font-semibold text-slate-200">
                      {transaction.merchant}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Kategori Pos</span>
                  <span className="font-semibold text-slate-200">
                    {transaction.categoryName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Metode Pembayaran</span>
                  <span className="font-semibold text-slate-200">
                    {transaction.accountName}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 font-medium">Waktu Transaksi</span>
                  <span className="font-semibold text-slate-200">
                    {formatDateIndo(transaction.date)} {transaction.time && `• ${transaction.time}`}
                  </span>
                </div>

                {transaction.notes && (
                  <div className="py-2 border-b border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium">Catatan Tambahan</span>
                    <p className="text-slate-300 font-normal leading-relaxed">
                      {transaction.notes}
                    </p>
                  </div>
                )}

                {transaction.tags && transaction.tags.length > 0 && (
                  <div className="py-2 space-y-1.5">
                    <span className="text-slate-400 font-medium">Label / Tag</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {transaction.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {transaction.attachments && transaction.attachments.length > 0 && (
                  <div className="py-2 space-y-1.5">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      Bukti Struk ({transaction.attachments.length})
                    </span>
                    <div className="space-y-1">
                      {transaction.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="p-2 rounded-xl bg-[#0F1419] border border-slate-800 flex items-center justify-between"
                        >
                          <span className="text-slate-300 truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {(att.size / 1024).toFixed(0)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(transaction.id);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onDuplicate(transaction);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplikasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onEdit(transaction);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Transaksi</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
