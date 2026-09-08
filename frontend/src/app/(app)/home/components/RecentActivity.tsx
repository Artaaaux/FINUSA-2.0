"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingCart,
  Car,
  Clapperboard,
  Briefcase,
  Layers,
  Receipt,
} from "lucide-react";
import { PembukuanService } from "@/lib/services/pembukuan.service";
import { PembukuanTransaction } from "@/app/(app)/pembukuan/types";
import { formatCurrency } from "../constants";

const categoryMeta: Record<string, { icon: React.ReactNode; colorClass: string }> = {
  Makanan:   { icon: <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  Income:    { icon: <Briefcase    className="w-3.5 h-3.5" aria-hidden="true" />, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  Transport: { icon: <Car          className="w-3.5 h-3.5" aria-hidden="true" />, colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  Hiburan:   { icon: <Clapperboard className="w-3.5 h-3.5" aria-hidden="true" />, colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  Belanja:   { icon: <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />, colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
};

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function RecentActivity() {
  const [liveTransactions, setLiveTransactions] = useState<PembukuanTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await PembukuanService.getTransactions();
        if (data) {
          setLiveTransactions(data.slice(0, 5));
        }
      } catch (err) {
        console.warn("Failed to load recent transactions from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const displayList = liveTransactions.map((t) => ({
    id: t.id,
    description: t.description || t.merchant || "Transaksi",
    category: t.categoryName || "Lainnya",
    amount: t.type === "income" ? t.amount : -t.amount,
    date: t.date,
  }));

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(26,31,46,0.75) 0%, rgba(21,26,36,0.55) 100%)",
        border: "1px solid rgba(75,123,255,0.15)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid rgba(75,123,255,0.1)" }}
      >
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden="true" />
            Transaksi Terbaru
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Catatan aktivitas pemasukan dan pengeluaran</p>
        </div>
        <Link
          href="/catat"
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1"
        >
          Buka Catat <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-500 text-xs">Memuat riwayat transaksi...</div>
      ) : displayList.length === 0 ? (
        <div className="p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <Receipt className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-300">Belum Ada Transaksi Tercatat</p>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            Gunakan fitur Scan AI untuk scan struk otomatis atau catat transaksi manual di Catat.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Link
              href="/receipt-scanner"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
            >
              Scan Struk AI
            </Link>
            <Link
              href="/catat"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              Catat Manual
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(75,123,255,0.08)" }}>
                  {["Tanggal", "Kategori", "Deskripsi", "Jumlah"].map((col, i) => (
                    <th
                      key={col}
                      className={`py-3 ${i === 3 ? "px-6 text-right" : i === 0 ? "px-6 text-left" : "px-4 text-left"} text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900/40`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayList.map((tx, i) => {
                  const meta = categoryMeta[tx.category] || {
                    icon: <Layers className="w-3.5 h-3.5" aria-hidden="true" />,
                    colorClass: "text-slate-400 bg-slate-500/10 border-slate-500/20",
                  };
                  const isIncome = tx.amount > 0;

                  return (
                    <tr
                      key={tx.id || i}
                      className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/40 last:border-0"
                    >
                      <td className="px-6 py-3.5 text-xs text-slate-400 font-mono whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.colorClass}`}
                        >
                          {meta.icon}
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-slate-200">
                        {tx.description}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-xs tabular-nums whitespace-nowrap">
                        <span className={isIncome ? "text-emerald-400" : "text-rose-400"}>
                          {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(Math.abs(tx.amount))}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden divide-y divide-slate-800/60">
            {displayList.map((tx, i) => {
              const meta = categoryMeta[tx.category] || {
                icon: <Layers className="w-3.5 h-3.5" aria-hidden="true" />,
                colorClass: "text-slate-400 bg-slate-500/10 border-slate-500/20",
              };
              const isIncome = tx.amount > 0;

              return (
                <div key={tx.id || i} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-800/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${meta.colorClass}`}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{tx.description}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(tx.date)} • {tx.category}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold tabular-nums ${isIncome ? "text-emerald-400" : "text-rose-400"}`}>
                      {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(Math.abs(tx.amount))}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
