"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  ScanLine,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import type { ExtractedReceiptData } from "@/shared/lib/receipt/types";
import { formatCurrency } from "@/app/(app)/home/constants";
import { getCategoryMeta } from "@/shared/lib/receipt/categorize";

interface SuccessScreenProps {
  data: ExtractedReceiptData;
  expenseId?: string | null;
  onScanAnother: () => void;
}

export default function SuccessScreen({
  data,
  expenseId,
  onScanAnother,
}: SuccessScreenProps) {
  const categoryMeta = getCategoryMeta(data.category);

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center justify-center text-center space-y-3 pt-4"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 text-amber-400"
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Pengeluaran Berhasil Dicatat!
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Data struk belanja telah diverifikasi & tersimpan rapi
          </p>
        </div>
      </motion.div>

      {/* Digital Receipt Summary Voucher Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative rounded-2xl bg-[#161c28] border border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Top Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="p-6 space-y-5">
          {/* Merchant & Category */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Merchant / Toko
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                {data.merchant}
              </h3>
              {data.merchantAddress && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {data.merchantAddress}
                </p>
              )}
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex-shrink-0 ${categoryMeta.badgeClass}`}
            >
              {data.category}
            </span>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Tanggal</span>
              <span className="text-slate-200 font-semibold mt-0.5 block">
                {data.date} {data.time ? `· ${data.time}` : ""}
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block">Pembayaran</span>
              <span className="text-slate-200 font-semibold mt-0.5 block">
                {data.paymentMethod || "QRIS"}
              </span>
            </div>
          </div>

          {/* Items Summary */}
          {data.items.length > 0 && (
            <div className="pt-3 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Rincian Pembelian ({data.items.length} item)
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {data.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs text-slate-300"
                  >
                    <span className="truncate pr-2">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="tabular-nums font-semibold flex-shrink-0 text-slate-200">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Box */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between bg-[#0F172A] p-4 rounded-xl">
            <span className="text-xs font-bold text-slate-400 uppercase">
              Total Pembayaran
            </span>
            <span className="text-xl font-black text-emerald-400 tabular-nums">
              {formatCurrency(data.total)}
            </span>
          </div>

          {expenseId && (
            <p className="text-[10px] text-slate-500 text-center font-mono">
              ID Transaksi: {expenseId}
            </p>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onScanAnother}
          className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
        >
          <ScanLine className="w-4 h-4" />
          Scan Struk Lainnya
        </button>

        <Link
          href="/catat"
          className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all"
        >
          <FolderKanban className="w-4 h-4" />
          Buka Catat Transaksi
        </Link>
      </div>
    </div>
  );
}
