"use client";

import React from "react";
import { Users, Activity, Receipt, PiggyBank } from "lucide-react";
import { AdminStatsSummary } from "@/lib/services/admin.service";

interface AdminMetricsProps {
  stats: AdminStatsSummary;
  onCardClick?: (metricType: string) => void;
}

export function AdminMetrics({ stats, onCardClick }: AdminMetricsProps) {
  const cards = [
    {
      type: "users",
      label: "Total Pengguna",
      value: stats.totalUsers ?? 21,
      description: "Akun terdaftar di database",
      icon: Users,
      badge: "Realtime",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15 border-blue-500/30",
      accentGradient: "from-blue-500/10 to-transparent",
    },
    {
      type: "transactions",
      label: "Buku Transaksi",
      value: stats.totalTransactions ?? 7,
      description: "Mutasi kas tercatat",
      icon: Activity,
      badge: "Tercatat",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
      accentGradient: "from-emerald-500/10 to-transparent",
    },
    {
      type: "receipts",
      label: "Scan Struk AI",
      value: stats.totalReceiptPhotos ?? 0,
      description: "Struk belanja tersimpan",
      icon: Receipt,
      badge: "AI Vision",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/30",
      accentGradient: "from-amber-500/10 to-transparent",
    },
    {
      type: "savings",
      label: "Target Nabung",
      value: stats.totalSavingsGoals ?? 2,
      description: "Celengan aktif pengguna",
      icon: PiggyBank,
      badge: "Target Aktif",
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15 border-purple-500/30",
      accentGradient: "from-purple-500/10 to-transparent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.type}
            onClick={() => onCardClick?.(card.type)}
            className="group relative overflow-hidden rounded-2xl bg-[#090F21]/65 hover:bg-[#0D1630]/80 backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/35 p-5 min-h-[130px] flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.08)] cursor-pointer"
          >
            {/* Subtle Top Ambient Gradient */}
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.accentGradient} rounded-full blur-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity`}
            />

            {/* Top row: Label + Icon Container */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                {card.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${card.iconBg} ${card.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle & Bottom: Numeric Value + Description */}
            <div className="mt-3 relative z-10">
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-extrabold text-white tracking-tight font-sans">
                  {card.value.toLocaleString("id-ID")}
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06] group-hover:text-slate-200 transition-colors">
                  {card.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
