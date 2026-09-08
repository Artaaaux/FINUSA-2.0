"use client";

import React, { useState } from "react";
import { RefreshCw, ScanLine, Lightbulb } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Tip {
  title: string;
  content: string;
  source: string;
}

const tips: Tip[] = [
  {
    title: "Aturan 50/30/20",
    content: "Alokasikan 50% untuk kebutuhan, 30% untuk keinginan, dan 20% untuk tabungan. Metode ini membantu menjaga keseimbangan finansial jangka panjang.",
    source: "Prinsip Keuangan Dasar",
  },
  {
    title: "Dana Darurat",
    content: "Idealnya simpan 3–6 bulan pengeluaran sebagai dana darurat. Ini melindungi kamu dari kejadian tak terduga tanpa harus berutang.",
    source: "Perencanaan Keuangan",
  },
  {
    title: "Investasi Sejak Dini",
    content: "Mulai investasi sedini mungkin untuk memanfaatkan compounding interest. Bahkan investasi kecil yang konsisten bisa tumbuh signifikan dalam 10–20 tahun.",
    source: "Literasi Investasi",
  },
  {
    title: "Catat Setiap Pengeluaran",
    content: "Melacak setiap transaksi membantu kamu mengenali pola pengeluaran yang tidak disadari dan membuat keputusan finansial yang lebih baik.",
    source: "Manajemen Keuangan Harian",
  },
];

export default function DailyTip() {
  const [index, setIndex] = useState(0);
  const tip = tips[index];
  const next = () => setIndex((i) => (i + 1) % tips.length);

  return (
    <div
      className="rounded-2xl overflow-hidden h-full flex flex-col justify-between"
      style={{
        background: "linear-gradient(135deg, rgba(26,31,46,0.75) 0%, rgba(21,26,36,0.55) 100%)",
        border: "1px solid rgba(75,123,255,0.15)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-500/60 to-teal-500/60" aria-hidden="true" />

      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid rgba(75,123,255,0.1)" }}
      >
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" aria-hidden="true" />
          Tips Hari Ini
        </h2>
        <button
          onClick={next}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 px-2 py-1 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Ganti tip keuangan"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Ganti
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-col gap-2.5"
          >
            <h3 className="text-sm font-bold text-white leading-snug">{tip.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {tip.content}
            </p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-amber-400/80 mt-1">
              {tip.source}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA & Pagination */}
      <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
        <Link
          href="/receipt-scanner"
          className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 hover:text-white transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <ScanLine className="w-3.5 h-3.5" aria-hidden="true" />
          Scan Pengeluaran
        </Link>

        {/* Dot pagination */}
        <div className="flex justify-center gap-1.5" role="tablist" aria-label="Navigasi tips">
          {tips.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Lihat tip ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1 rounded-full transition-all duration-200 cursor-pointer"
              style={{
                width: i === index ? "18px" : "6px",
                background: i === index ? "#4B7BFF" : "#334155",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
