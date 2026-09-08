"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { Wifi } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon?: React.ReactNode;
  color: "green" | "red" | "blue" | "yellow";
  cardNumber?: string;
  validThru?: string;
  className?: string;
}

const colorConfig = {
  green: {
    bgGradient: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-950",
    border: "border-emerald-400/40 hover:border-emerald-300",
    shadow: "shadow-emerald-950/40 hover:shadow-emerald-500/25",
    textPrimary: "text-white",
    textSecondary: "text-emerald-100/85",
    badgeBg: "bg-emerald-500/25 text-emerald-100 border-emerald-400/35",
    chipBorder: "border-amber-600/50",
    chipBg: "from-amber-200 via-yellow-400 to-amber-500",
    textEmboss: "emboss-light",
  },
  red: {
    bgGradient: "bg-gradient-to-br from-rose-600 via-red-700 to-rose-950",
    border: "border-rose-400/40 hover:border-rose-300",
    shadow: "shadow-rose-950/40 hover:shadow-rose-500/25",
    textPrimary: "text-white",
    textSecondary: "text-rose-100/85",
    badgeBg: "bg-rose-500/25 text-rose-100 border-rose-400/35",
    chipBorder: "border-amber-600/50",
    chipBg: "from-amber-200 via-yellow-400 to-amber-500",
    textEmboss: "emboss-light",
  },
  blue: {
    bgGradient: "bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-950",
    border: "border-blue-400/40 hover:border-blue-300",
    shadow: "shadow-blue-950/40 hover:shadow-blue-500/25",
    textPrimary: "text-white",
    textSecondary: "text-blue-100/85",
    badgeBg: "bg-blue-500/25 text-blue-100 border-blue-400/35",
    chipBorder: "border-amber-600/50",
    chipBg: "from-amber-200 via-yellow-400 to-amber-500",
    textEmboss: "emboss-light",
  },
  yellow: {
    bgGradient: "bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600",
    border: "border-amber-300/60 hover:border-amber-200",
    shadow: "shadow-amber-950/30 hover:shadow-amber-500/35",
    textPrimary: "text-slate-950",
    textSecondary: "text-amber-950/90",
    badgeBg: "bg-slate-950/15 text-slate-950 border-slate-950/25",
    chipBorder: "border-amber-800/50",
    chipBg: "from-amber-100 via-yellow-300 to-amber-500",
    textEmboss: "emboss-dark",
  },
};

export function SummaryCard({
  title,
  value,
  description,
  color,
  cardNumber = "5412 •••• •••• 9872",
  validThru = "12/28",
  className,
}: SummaryCardProps) {
  const config = colorConfig[color];
  const isLongValue = value.length > 10;

  return (
    <div
      className={cn(
        "relative aspect-[1.62] w-full rounded-lg sm:rounded-2xl p-2.5 sm:p-3.5 lg:p-4 transition-all duration-300 group cursor-pointer overflow-hidden border shadow-md sm:shadow-lg hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col justify-between select-none",
        config.bgGradient,
        config.border,
        config.shadow,
        className
      )}
    >
      {/* Metallic Card Watermark Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />

      {/* Shimmer Light Reflection Effect on Hover */}
      <div className="absolute inset-0 transition-transform duration-1000 ease-out -translate-x-full pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full" />

      {/* Decorative Guilloche Wave SVG Accent */}
      <svg
        className="absolute pointer-events-none -right-4 -bottom-4 sm:-right-6 sm:-bottom-6 w-24 h-24 sm:w-36 sm:h-36 opacity-10"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M0,40 Q25,20 50,40 T100,40"
          stroke="currentColor"
          strokeWidth="2.5"
          className={config.textPrimary}
        />
        <path
          d="M0,58 Q25,38 50,58 T100,58"
          stroke="currentColor"
          strokeWidth="2"
          className={config.textPrimary}
        />
        <path
          d="M0,76 Q25,56 50,76 T100,76"
          stroke="currentColor"
          strokeWidth="1.5"
          className={config.textPrimary}
        />
      </svg>

      {/* Card Content Wrapper */}
      <div className="relative z-10 flex flex-col justify-between h-full gap-0.5 sm:gap-1">
        {/* TOP ROW: Section Name (Left) & FINUSA Debit Brand (Right) */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded text-[8px] sm:text-[10px] font-atm-card font-extrabold uppercase tracking-wider border flex items-center gap-1 shadow-xs",
                config.badgeBg
              )}
            >
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className={cn("text-[8px] sm:text-xs font-atm-card font-black tracking-tight opacity-90", config.textPrimary)}>
              FINUSA
            </span>
            <span className={cn("text-[7px] sm:text-[8px] font-atm-card font-bold uppercase tracking-widest opacity-75 hidden sm:inline-block", config.textPrimary)}>
              DEBIT
            </span>
            <Wifi className={cn("w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rotate-90 opacity-80", config.textPrimary)} />
          </div>
        </div>

        {/* MIDDLE ROW: Information / Main Value & Description */}
        <div className="my-auto py-0.5">
          <p className={cn("text-[7px] sm:text-[10px] font-atm-card uppercase tracking-wider mb-0.5 opacity-85 truncate", config.textSecondary)}>
            {description}
          </p>
          {isLongValue ? (
            <p className={cn("text-[10px] sm:text-sm font-atm-card font-bold tracking-tight uppercase leading-tight line-clamp-2", config.textPrimary, config.textEmboss)}>
              {value}
            </p>
          ) : (
            <p className={cn("text-xs sm:text-lg lg:text-xl font-atm-card font-bold tracking-wider drop-shadow-sm", config.textPrimary, config.textEmboss)}>
              {value}
            </p>
          )}
        </div>

        {/* BOTTOM ROW: 3D EMV Smart Chip (Left) & Account / Expiry Details (Right) */}
        <div className="flex items-end justify-between pt-0.5">
          {/* Authentic 3D EMV Gold Smart Chip */}
          <div
            className={cn(
              "w-6 h-4 sm:w-9 sm:h-6 bg-gradient-to-br rounded border p-0.5 flex flex-col justify-between shadow-xs relative overflow-hidden shrink-0",
              config.chipBg,
              config.chipBorder
            )}
          >
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-70" />
            <div className="grid grid-cols-3 gap-0.5 h-full">
              <div className="border-r border-amber-700/50 bg-yellow-500/25 rounded-l-xs" />
              <div className="border-r border-amber-700/50 bg-yellow-500/20" />
              <div className="bg-yellow-500/25 rounded-r-xs" />
            </div>
          </div>

          {/* Masked Card Number & Expiry */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-[6px] sm:text-[8px] font-atm-card uppercase tracking-wider opacity-85">
              <span className={config.textSecondary}>EXP</span>
              <span className={cn("font-bold font-atm-card", config.textPrimary)}>{validThru}</span>
            </div>
            <p className={cn("font-atm-card text-[8px] sm:text-xs font-bold tracking-widest mt-0.5 whitespace-nowrap", config.textPrimary, config.textEmboss)}>
              {cardNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
