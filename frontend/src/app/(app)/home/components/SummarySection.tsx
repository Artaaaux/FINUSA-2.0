"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, PiggyBank, AlertTriangle } from "lucide-react";
import { SummaryCard } from "./SummaryCard";
import { AnalyticsService, MonthlyFinancialSummary } from "@/lib/services/analytics.service";

export function SummarySection() {
  const [summary, setSummary] = useState<MonthlyFinancialSummary | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await AnalyticsService.getDashboardSummary();
        setSummary(data);
      } catch (err) {
        console.warn("Failed to load dashboard summary:", err);
      }
    }
    loadData();
  }, []);

  const formatShortRupiah = (num: number) => {
    if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
    if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}Jt`;
    if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(0)}Rb`;
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  const highestExpenseCategory = summary?.categoryBreakdown?.[0]?.name || "Terkendali";
  const pemasukanFormatted = summary ? formatShortRupiah(summary.totalIncome) : "Rp 0";
  const pengeluaranFormatted = summary ? formatShortRupiah(summary.totalExpense) : "Rp 0";
  const savingsRateFormatted = summary ? `${summary.savingsRatePercent}%` : "0%";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
          Ringkasan Keuangan
        </h2>
        <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-emerald-400 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" aria-hidden="true" />
          Tersinkron Cloud
        </span>
      </div>

      {/* 2-column on mobile, 4-column on desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
        <SummaryCard
          title="Pemasukan"
          value={pemasukanFormatted}
          description="Total bulan ini"
          icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          color="green"
          cardNumber="Kas Masuk"
          validThru="Bulan Ini"
        />
        <SummaryCard
          title="Pengeluaran"
          value={pengeluaranFormatted}
          description="Total bulan ini"
          icon={<ArrowDownRight className="w-3.5 h-3.5" />}
          color="red"
          cardNumber="Kas Keluar"
          validThru="Bulan Ini"
        />
        <SummaryCard
          title="Rasio Tabungan"
          value={savingsRateFormatted}
          description="Tersimpan dari omzet"
          icon={<PiggyBank className="w-3.5 h-3.5" />}
          color="blue"
          cardNumber="Tingkat Tabung"
          validThru="Bulan Ini"
        />
        <SummaryCard
          title="Pos Terbesar"
          value={highestExpenseCategory}
          description="Fokus efisiensi"
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          color="yellow"
          cardNumber="Kategori Utama"
          validThru="Bulan Ini"
        />
      </div>
    </div>
  );
}
