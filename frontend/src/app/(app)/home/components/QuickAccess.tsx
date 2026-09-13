"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ScanLine, 
  TrendingUp, 
  Target, 
  FolderKanban, 
  FileSpreadsheet,
  ArrowUpRight,
  ArrowRight,
  Sparkles
} from "lucide-react";

// Featured Main Card (Card 1: Scan AI)
const featuredFeature = {
  id: "receipt-scanner",
  title: "Scan Struk AI",
  tag: "OCR AI",
  action: "Pindai & Catat Otomatis",
  desc: "Foto atau upload struk belanjaan kamu. AI FINUSA akan memindai toko, tanggal, dan total pengeluaran secara otomatis ke pembukuan.",
  icon: <ScanLine className="w-6 h-6 text-blue-400" aria-hidden="true" />,
  badgeClass: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  iconBg: "bg-blue-500/15 border-blue-500/30",
  href: "/receipt-scanner",
};

// 4 Secondary Stacked Cards (Card 2 - 5)
const secondaryFeatures = [
  {
    id: "monitor",
    title: "Monitor Keuangan",
    tag: "Analisis",
    desc: "Pantau arus kas, grafik, dan saldo rekening",
    icon: <TrendingUp className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
    badgeClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    href: "/monitor",
  },
  {
    id: "nabung",
    title: "Target Tabungan",
    tag: "Impian",
    desc: "Kelola pos tabungan dan celengan impian",
    icon: <Target className="w-4 h-4 text-teal-400" aria-hidden="true" />,
    badgeClass: "text-teal-400 bg-teal-500/10 border-teal-500/25",
    iconBg: "bg-teal-500/15 border-teal-500/30",
    href: "/nabung",
  },
  {
    id: "catat",
    title: "Catat Transaksi",
    tag: "Kas",
    desc: "Catat uang masuk dan keluar secara cepat",
    icon: <FolderKanban className="w-4 h-4 text-amber-400" aria-hidden="true" />,
    badgeClass: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    href: "/catat",
  },
  {
    id: "sheets",
    title: "Template Sheets",
    tag: "Spreadsheet",
    desc: "Export dan rekap data di Google Sheets",
    icon: <FileSpreadsheet className="w-4 h-4 text-sky-400" aria-hidden="true" />,
    badgeClass: "text-sky-400 bg-sky-500/10 border-sky-500/25",
    iconBg: "bg-sky-500/15 border-sky-500/30",
    href: "/template",
  },
];

export default function QuickAccess() {
  return (
    <div className="space-y-3.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />
            Akses Cepat Fitur FINUSA
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Modul utama pengelolaan finansial pelajar & umum</p>
        </div>
      </div>

      {/* Main Layout Matching User Sketch: 1 Big Card on Left + 4 Stacked Horizontal Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        
        {/* LEFT COLUMN: Main Featured Card (Scan AI) */}
        <div className="lg:col-span-5 flex">
          <Link
            href={featuredFeature.href}
            className="group w-full block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="h-full rounded-2xl border border-blue-500/30 bg-gradient-to-b from-[#182235] to-[#121722] p-5 sm:p-6 transition-all duration-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Subtle background glow element */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-300"
                aria-hidden="true"
              />

              <div>
                {/* Top Row: Icon + Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${featuredFeature.iconBg}`}>
                    {featuredFeature.icon}
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider flex items-center gap-1 ${featuredFeature.badgeClass}`}>
                    <Sparkles className="w-3 h-3" />
                    {featuredFeature.tag}
                  </span>
                </div>

                {/* Title & Action Label */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                  {featuredFeature.title}
                </h3>
                <p className="text-xs font-semibold text-blue-400 mt-0.5">
                  {featuredFeature.action}
                </p>

                {/* Detailed Description */}
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  {featuredFeature.desc}
                </p>
              </div>

              {/* Bottom CTA Button */}
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <div className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between shadow-md transition-all duration-200 group-hover:shadow-blue-500/25">
                  <span>Pindai Struk Sekarang</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* RIGHT COLUMN: 4 Stacked Cards */}
        <div className="lg:col-span-7 flex flex-col gap-2.5 justify-between">
          {secondaryFeatures.map((feat, i) => (
            <Link
              href={feat.href}
              key={feat.id}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 flex-1"
            >
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="h-full rounded-xl border border-slate-800 bg-[#161c28] p-3.5 sm:p-4 transition-all duration-200 hover:border-slate-600 hover:bg-[#1a2130] hover:-translate-y-0.5 flex items-center justify-between gap-3 shadow-sm"
              >
                {/* Left: Icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${feat.iconBg}`}>
                  {feat.icon}
                </div>

                {/* Middle: Title & Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                      {feat.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {feat.desc}
                  </p>
                </div>

                {/* Right: Tag Badge & Arrow */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`hidden xs:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${feat.badgeClass}`}>
                    {feat.tag}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-200">
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
