"use client";

import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MousePointerClick,
  Copy,
  Save,
  ArrowRight,
} from "lucide-react";

const TEMPLATE_URL =
  "https://docs.google.com/spreadsheets/d/1tQITQfMo7DjHAGspY_pJZUWWIoKq7KZnyLKomjntXe8/edit?usp=sharing";

const GUIDE_STEPS = [
  {
    step: 1,
    icon: MousePointerClick,
    title: 'Buka menu "File"',
    description:
      'Klik menu "File" di toolbar kiri atas Google Sheets.',
    image: "/Assets/sheets-guide/BukaFile.webp",
  },
  {
    step: 2,
    icon: Copy,
    title: 'Klik "Buat salinan"',
    description:
      'Pilih "Buat salinan" untuk menyalin template ke Google Drive kamu.',
    image: "/Assets/sheets-guide/BuatSalinan.webp",
  },
  {
    step: 3,
    icon: Save,
    title: "Simpan & mulai isi data",
    description:
      'Ganti nama file jika perlu, pilih folder, lalu klik "Buat salinan". Siap digunakan!',
    image: "/Assets/sheets-guide/Save.webp",
  },
];

export default function TemplatePage() {
  const [showGuide, setShowGuide] = useState(false);

  // Adaptive: default open on desktop, closed on mobile
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setShowGuide(mq.matches);
  }, []);

  return (
    <div className="space-y-4 pb-6 max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">
            Template Keuangan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Rekap bulanan & tahunan via Google Sheets
          </p>
        </div>
      </div>

      {/* ── CTA Button — Primary action, always visible ── */}
      <a
        href={TEMPLATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full px-5 py-3.5 rounded-2xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
      >
        <ExternalLink className="w-4 h-4" />
        <span>Buka Template di Google Sheets</span>
        <ArrowRight className="w-4 h-4 opacity-60" />
      </a>

      {/* ── Panduan Cara Pakai ── */}
      <div className="rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 overflow-hidden">
        {/* Toggle Header */}
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-800/20 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-white">
              📖 Cara Pakai
            </span>
            <span className="text-[10px] font-medium text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-full">
              3 langkah
            </span>
          </div>
          <div className="text-slate-500">
            {showGuide ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {/* Steps */}
        {showGuide && (
          <div className="px-4 pb-5 space-y-4">
            <div className="border-t border-slate-800/60" />

            {GUIDE_STEPS.map((step) => (
              <div key={step.step} className="space-y-2.5">
                {/* Step Header */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                    <span className="text-[11px] font-bold">{step.step}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <step.icon className="w-3.5 h-3.5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed ml-[38px]">
                  {step.description}
                </p>

                {/* Screenshot */}
                <div className="ml-[38px] rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/30">
                  <img
                    src={step.image}
                    alt={`Langkah ${step.step}: ${step.title}`}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
