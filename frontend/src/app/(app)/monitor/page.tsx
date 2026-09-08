"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PeriodType, BudgetCategory, DashboardSummary, Transaction, CashflowPoint, CategoryBreakdownPoint } from "./types";
import MonitorHeader from "./components/MonitorHeader";
import KpiCards from "./components/KpiCards";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import CategoryBreakdown from "./components/CategoryBreakdown";
import BudgetProgress from "./components/BudgetProgress";
import TransactionTable from "./components/TransactionTable";
import BudgetModal from "./components/BudgetModal";
import ExportModal from "./components/ExportModal";
import { PembukuanService } from "@/lib/services/pembukuan.service";
import { AnalyticsService } from "@/lib/services/analytics.service";

const staggered = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
});

const INITIAL_EMPTY_SUMMARY: DashboardSummary = {
  period: "this_month",
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
  netCashflow: 0,
  savingRate: 0,
  kpis: {
    balance: {
      title: "Total Saldo Kas",
      value: 0,
      previousValue: 0,
      changePercentage: 0,
      isPositive: true,
      trendText: "dari seluruh rekening",
    },
    income: {
      title: "Total Pemasukan",
      value: 0,
      previousValue: 0,
      changePercentage: 0,
      isPositive: true,
      trendText: "periode berjalan",
    },
    expense: {
      title: "Total Pengeluaran",
      value: 0,
      previousValue: 0,
      changePercentage: 0,
      isPositive: true,
      trendText: "pengeluaran operasional",
    },
    savingRate: {
      title: "Tingkat Tabungan",
      value: 0,
      previousValue: 0,
      changePercentage: 0,
      isPositive: true,
      trendText: "dari total pemasukan",
    },
  },
};

function MonitorFooter() {
  return (
    <footer className="mt-8 sm:mt-12 -mx-3.5 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-800/80 bg-[#0F1419]/90">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} FINUSA. All rights reserved.
        </p>
        <div className="flex items-center gap-4 sm:gap-5">
          {[
            { label: "Bantuan", href: "/help" },
            { label: "Privasi", href: "/help" },
            { label: "Syarat & Ketentuan", href: "/help" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-xs text-slate-400 font-mono">v2.0</span>
        </div>
      </div>
    </footer>
  );
}

export default function MonitorPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("this_month");
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [liveTransactions, setLiveTransactions] = useState<Transaction[]>([]);
  const [liveSummary, setLiveSummary] = useState<DashboardSummary>(INITIAL_EMPTY_SUMMARY);
  const [monthlyTrend, setMonthlyTrend] = useState<CashflowPoint[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdownPoint[]>([]);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        await PembukuanService.recalibrateAccountBalances();
        const [dbTx, , dbCat, summaryData] = await Promise.all([
          PembukuanService.getTransactions(),
          PembukuanService.getAccounts(),
          PembukuanService.getCategories(),
          AnalyticsService.getDashboardSummary(selectedPeriod),
        ]);

        if (dbTx) {
          const mappedTx: Transaction[] = dbTx.map((t) => ({
            id: t.id,
            date: t.date,
            description: t.description || t.merchant || "Transaksi",
            category: t.categoryName || "Lainnya",
            categoryId: t.categoryId,
            account: t.accountName || "Kas Primer",
            accountId: t.accountId,
            amount: t.amount,
            type: (t.type === "income" ? "income" : "expense") as "income" | "expense",
            status: (t.status === "completed" ? "completed" : "pending") as "completed" | "pending",
            merchant: t.merchant,
          }));
          setLiveTransactions(mappedTx);
        }

        if (dbCat) {
          const mappedBudgets: BudgetCategory[] = dbCat
            .filter((c) => c.type === "expense" && c.budgetLimit && c.budgetLimit > 0)
            .map((c) => {
              // Calculate spent amount from dbTx
              const spent = (dbTx || [])
                .filter((tx) => tx.categoryId === c.id && tx.type === "expense")
                .reduce((acc, curr) => acc + curr.amount, 0);

              return {
                id: c.id,
                categoryId: c.id,
                categoryName: c.name,
                budgetAmount: c.budgetLimit || 0,
                spentAmount: spent,
                iconName: c.iconName || "Briefcase",
                color: c.color || "#4B7BFF",
                period: "monthly",
              };
            });
          setBudgets(mappedBudgets);
        }

        if (summaryData) {
          const periodLabel = selectedPeriod === "this_month" ? "bulan ini" : selectedPeriod === "last_month" ? "bulan lalu" : "tahun ini";
          const compareLabel = selectedPeriod === "this_year" ? "tahun lalu" : "bulan lalu";

          const incomeChange = summaryData.incomeGrowthPercent;
          const expenseChange = summaryData.expenseGrowthPercent;
          const savingChange = summaryData.savingRateChangePercent;

          const updatedSummary: DashboardSummary = {
            period: selectedPeriod,
            totalBalance: summaryData.totalAccountBalance,
            totalIncome: summaryData.totalIncome,
            totalExpense: summaryData.totalExpense,
            netCashflow: summaryData.netSavings,
            savingRate: summaryData.savingsRatePercent,
            kpis: {
              balance: {
                title: "Total Saldo Kas",
                value: summaryData.totalAccountBalance,
                previousValue: summaryData.totalAccountBalance - summaryData.netSavings,
                changePercentage: Math.abs(summaryData.balanceChangePercent),
                isPositive: summaryData.netSavings >= 0,
                trendText: summaryData.netSavings >= 0 
                  ? `+${summaryData.balanceChangePercent}% surplus kas ${periodLabel}` 
                  : `${summaryData.balanceChangePercent}% defisit kas ${periodLabel}`,
              },
              income: {
                title: "Total Pemasukan",
                value: summaryData.totalIncome,
                previousValue: summaryData.previousIncome,
                changePercentage: Math.abs(incomeChange),
                isPositive: incomeChange >= 0,
                trendText: summaryData.previousIncome > 0
                  ? (incomeChange >= 0 ? `naik ${incomeChange}% dari ${compareLabel}` : `turun ${Math.abs(incomeChange)}% dari ${compareLabel}`)
                  : `uang masuk ${periodLabel}`,
              },
              expense: {
                title: "Total Pengeluaran",
                value: summaryData.totalExpense,
                previousValue: summaryData.previousExpense,
                changePercentage: Math.abs(expenseChange),
                isPositive: expenseChange <= 0,
                trendText: summaryData.previousExpense > 0
                  ? (expenseChange <= 0 ? `lebih hemat ${Math.abs(expenseChange)}% dari ${compareLabel}` : `naik ${expenseChange}% dari ${compareLabel}`)
                  : `uang keluar ${periodLabel}`,
              },
              savingRate: {
                title: "Uang Tersimpan (Tabungan)",
                value: summaryData.savingsRatePercent,
                previousValue: summaryData.previousSavingsRatePercent,
                changePercentage: Math.abs(savingChange),
                isPositive: summaryData.savingsRatePercent >= 20,
                trendText: summaryData.savingsRatePercent >= 20
                  ? "Kondisi sehat (ideal min 20%)"
                  : "Perlu ditingkatkan (ideal min 20%)",
              },
            },
          };
          setLiveSummary(updatedSummary);

          // Monthly trend for chart
          const mappedTrend: CashflowPoint[] = summaryData.monthlyTrend.map((t) => ({
            label: t.month,
            income: t.income,
            expense: t.expense,
            net: t.net,
          }));
          setMonthlyTrend(mappedTrend);

          const mappedCats: CategoryBreakdownPoint[] = summaryData.categoryBreakdown.map((c) => ({
            name: c.name,
            value: c.amount,
            percentage: c.percentage,
            color: c.color || "#4B7BFF",
            iconName: "ShoppingBag",
          }));
          setCategoryBreakdown(mappedCats);
        }
      } catch (err) {
        console.warn("Failed to load monitor data from Supabase:", err);
      }
    }

    loadData();
  }, [selectedPeriod]);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* 1. Header with Period Selector & Actions */}
      <motion.div {...staggered(0)}>
        <MonitorHeader
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onOpenExport={() => setIsExportModalOpen(true)}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
        />
      </motion.div>

      {/* 2. KPI Cards Grid */}
      <motion.div {...staggered(0.04)}>
        <KpiCards summary={liveSummary} />
      </motion.div>

      {/* 3. Visualizations: Cashflow Bar Chart & Expense Donut */}
      <motion.div
        {...staggered(0.08)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
      >
        <div className="lg:col-span-7">
          <IncomeExpenseChart data={monthlyTrend} />
        </div>
        <div className="lg:col-span-5">
          <CategoryBreakdown data={categoryBreakdown} />
        </div>
      </motion.div>

      {/* 4. Controls: Budget Progress */}
      <motion.div
        {...staggered(0.12)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
      >
        <div className="lg:col-span-12">
          <BudgetProgress
            budgets={budgets}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          />
        </div>
      </motion.div>

      {/* 5. Complete Transaction Ledger Table */}
      <motion.div {...staggered(0.16)}>
        <TransactionTable transactions={liveTransactions} />
      </motion.div>

      {/* Modals */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        budgets={budgets}
        onSaveBudgets={setBudgets}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={liveTransactions}
      />

      <div className="hidden lg:block">
        <MonitorFooter />
      </div>
    </div>
  );
}
