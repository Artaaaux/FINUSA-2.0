"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import {
  Briefcase,
  ShoppingCart,
  Utensils,
  Zap,
  Car,
  PieChart as PieChartIcon,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "../constants";
import { CategoryBreakdownPoint } from "../types";
import { cn } from "@/shared/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  Briefcase,
  ShoppingCart,
  Utensils,
  Zap,
  Car,
  ShoppingBag,
};

interface TooltipPayload {
  name: string;
  value: number;
  payload: CategoryBreakdownPoint;
}

function CustomDonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="rounded-xl p-3 bg-slate-900 border border-slate-700/80 shadow-2xl min-w-[160px] text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <span>{item.name}</span>
      </div>
      <div className="flex items-center justify-between gap-3 text-slate-300 font-bold tabular-nums">
        <span>{formatCurrency(item.value)}</span>
        <span className="text-blue-400">({formatPercentage(item.percentage)})</span>
      </div>
    </div>
  );
}

interface CategoryBreakdownProps {
  data?: CategoryBreakdownPoint[];
}

export default function CategoryBreakdown({ data = [] }: CategoryBreakdownProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalExpense = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-[#151B26] border border-slate-800/90 shadow-lg shadow-black/20 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <PieChartIcon className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Pengeluaran Berdasarkan Kategori
            </h2>
          </div>
          <p className="text-[11px] text-slate-400">
            Kemana saja uang Anda dibelanjakan berdasarkan pos kategori
          </p>
        </div>

        <span className="text-[11px] font-medium text-slate-400 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 tabular-nums">
          Total: {formatCurrency(totalExpense)}
        </span>
      </div>

      {/* Main Content: Donut + Detailed List */}
      {data.length === 0 ? (
        <div className="h-[220px] flex flex-col items-center justify-center text-center p-4">
          <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 mb-2">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-300">Belum Ada Data Pengeluaran</p>
          <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
            Pengeluaran yang dicatat di Buku Kas atau AI Scan akan dikelompokkan secara visual di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Left: Donut Chart */}
          <div className="sm:col-span-5 relative w-full h-[180px] sm:h-[200px] flex items-center justify-center">
            {isMounted ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomDonutTooltip />} />
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#0F172A"
                      strokeWidth={2}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={
                            activeIndex === null || activeIndex === index ? 1 : 0.4
                          }
                          className="transition-opacity duration-200 cursor-pointer"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text in donut */}
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                    Kategori
                  </span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {data.length} Pos
                  </span>
                </div>
              </>
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 border-t-teal-500 animate-spin" />
            )}
          </div>

          {/* Right: Legend Breakdown List */}
          <div className="sm:col-span-7 space-y-2">
            {data.slice(0, 5).map((item, index) => {
              const Icon = (item.iconName && ICON_MAP[item.iconName]) || HelpCircle;
              const isHovered = activeIndex === index;

              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer",
                    isHovered
                      ? "bg-slate-800/80 border-slate-700 translate-x-1"
                      : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/40"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${item.color}15`,
                        borderColor: `${item.color}30`,
                      }}
                    >
                      <Icon
                        className="w-3.5 h-3.5"
                        style={{ color: item.color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {item.name}
                      </p>
                      <div className="w-20 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <p className="text-xs font-bold text-white tabular-nums">
                      {formatCurrency(item.value)}
                    </p>
                    <p
                      className="text-[10px] font-semibold tabular-nums"
                      style={{ color: item.color }}
                    >
                      {formatPercentage(item.percentage)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
