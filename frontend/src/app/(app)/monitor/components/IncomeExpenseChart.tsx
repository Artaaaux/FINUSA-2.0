"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CashflowPoint } from "../types";
import { formatCurrency, formatShortCurrency } from "../constants";
import { BarChart2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const income = payload.find((p) => p.dataKey === "income")?.value || 0;
  const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;
  const net = income - expense;

  return (
    <div className="rounded-xl p-3.5 bg-slate-900 border border-slate-700/80 shadow-2xl min-w-[200px] text-xs">
      <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-2.5 flex items-center justify-between">
        <span>Periode: {label}</span>
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded font-medium",
            net >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
          )}
        >
          {net >= 0 ? "Surplus" : "Defisit"}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" />
            <span>Pemasukan:</span>
          </div>
          <span className="font-bold text-white tabular-nums">
            {formatCurrency(income)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#F43F5E]" />
            <span>Pengeluaran:</span>
          </div>
          <span className="font-bold text-white tabular-nums">
            {formatCurrency(expense)}
          </span>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="font-medium text-slate-300">Sisa Uang Bersih:</span>
          <span
            className={cn(
              "font-bold tabular-nums",
              net >= 0 ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {net >= 0 ? `+${formatCurrency(net)}` : `-${formatCurrency(Math.abs(net))}`}
          </span>
        </div>
      </div>
    </div>
  );
}

interface IncomeExpenseChartProps {
  data?: CashflowPoint[];
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData: CashflowPoint[] = data && data.length > 0
    ? data
    : [
        { label: "Bulan 1", income: 0, expense: 0, net: 0 },
        { label: "Bulan 2", income: 0, expense: 0, net: 0 },
        { label: "Bulan 3", income: 0, expense: 0, net: 0 },
        { label: "Bulan 4", income: 0, expense: 0, net: 0 },
        { label: "Bulan 5", income: 0, expense: 0, net: 0 },
        { label: "Bulan 6", income: 0, expense: 0, net: 0 },
      ];

  const totalIncome = chartData.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = chartData.reduce((acc, curr) => acc + curr.expense, 0);
  const avgIncome = chartData.length > 0 ? totalIncome / chartData.length : 0;
  const avgExpense = chartData.length > 0 ? totalExpense / chartData.length : 0;

  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-[#151B26] border border-slate-800/90 shadow-lg shadow-black/20 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-3 border-b border-slate-800/60 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Grafik Uang Masuk & Keluar
            </h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Perbandingan uang masuk dan uang keluar tiap bulan
          </p>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[260px] sm:h-[300px]">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E293B"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => formatShortCurrency(val)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12, fontSize: 11 }}
                formatter={(value) => (
                  <span className="text-slate-300 text-[11px] font-medium mr-2">
                    {value === "income" ? "Pemasukan" : "Pengeluaran"}
                  </span>
                )}
              />
              <Bar
                dataKey="income"
                name="income"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="expense"
                name="expense"
                fill="#F43F5E"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-48 bg-slate-900/50 rounded-lg animate-pulse" />
          </div>
        )}
      </div>

      {/* Footer Metrics */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block mb-0.5">Rata-rata Masuk</span>
          <span className="font-bold text-blue-400 tabular-nums">
            {formatShortCurrency(avgIncome)}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 block mb-0.5">Rata-rata Keluar</span>
          <span className="font-bold text-rose-400 tabular-nums">
            {formatShortCurrency(avgExpense)}
          </span>
        </div>
      </div>
    </div>
  );
}
