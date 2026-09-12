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
  ArrowUpRight
} from "lucide-react";

// Sesuai fitur utama FINUSA di FinusaPRD.md
const finusaFeatures = [
  {
    id: "receipt-scanner",
    title: "Scan AI",
    tag: "OCR AI",
    action: "Pindai Pengeluaran",
    desc: "Scan pengeluaran otomatis catat ke pembukuan",
    icon: <ScanLine className="w-5 h-5 text-blue-400" aria-hidden="true" />,
    badgeClass: "text-blue-400 bg-blue-500/10 border-blue-500/25",
    iconBg: "bg-blue-500/15 border-blue-500/30",
    href: "/receipt-scanner",
  },
  {
    id: "monitor",
    title: "Monitor Kas",
    tag: "Tracking",
    action: "Arus Kas & Analisis",
    desc: "Pantau pengeluaran & grafik anggaran bulanan",
    icon: <TrendingUp className="w-5 h-5 text-emerald-400" aria-hidden="true" />,
    badgeClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    iconBg: "bg-emerald-500/15 border-emerald-500/30",
    href: "/monitor",
  },
  {
    id: "nabung",
    title: "Target Tabungan",
    tag: "Goals",
    action: "Rencana Impian",
    desc: "Kelola pos tabungan & pantau progres celengan",
    icon: <Target className="w-5 h-5 text-teal-400" aria-hidden="true" />,
    badgeClass: "text-teal-400 bg-teal-500/10 border-teal-500/25",
    iconBg: "bg-teal-500/15 border-teal-500/30",
    href: "/nabung",
  },
  {
    id: "catat",
    title: "Catat",
    tag: "Kas Masuk & Keluar",
    action: "Catat Transaksi",
    desc: "Catat transaksi pemasukan & pengeluaran usaha",
    icon: <FolderKanban className="w-5 h-5 text-amber-400" aria-hidden="true" />,
    badgeClass: "text-amber-400 bg-amber-500/10 border-amber-500/25",
    iconBg: "bg-amber-500/15 border-amber-500/30",
    href: "/catat",
  },
  {
    id: "sheets",
    title: "Google Sheets",
    tag: "Sync",
    action: "Integrasi Data",
    desc: "Sinkronisasi otomatis pembukuan ke spreadsheet",
    icon: <FileSpreadsheet className="w-5 h-5 text-sky-400" aria-hidden="true" />,
    badgeClass: "text-sky-400 bg-sky-500/10 border-sky-500/25",
    iconBg: "bg-sky-500/15 border-sky-500/30",
    href: "/sheets",
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

      {/* Grid of 5 FINUSA Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {finusaFeatures.map((feat, i) => (
          <Link
            href={feat.href}
            key={feat.id}
            className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="h-full rounded-xl border border-slate-800 bg-[#161c28] p-4 transition-all duration-200 hover:border-slate-600 hover:bg-[#1a2130] hover:-translate-y-1 flex flex-col justify-between"
              style={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            >
              {/* Top Row: Icon + Tag Badge + Link Arrow */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${feat.iconBg}`}>
                    {feat.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${feat.badgeClass}`}>
                      {feat.tag}
                    </span>
                    <ArrowUpRight
                      className="w-4 h-4 text-slate-500 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Title & Action Label */}
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-[11px] font-semibold text-slate-300 mt-0.5">
                  {feat.action}
                </p>

                {/* Description */}
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {feat.desc}
                </p>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-slate-200">
                <span className="font-medium">Buka Modul</span>
                <span className="font-bold">→</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
