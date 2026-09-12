"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  BookOpen,
  TrendingUp,
  Calendar,
  BarChart3,
  MousePointerClick,
  Copy,
  Save,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const TEMPLATE_URL =
  "https://docs.google.com/spreadsheets/d/1tQITQfMo7DjHAGspY_pJZUWWIoKq7KZnyLKomjntXe8/edit?usp=sharing";

const GUIDE_STEPS = [
  {
    step: 1,
    icon: MousePointerClick,
    title: "Buka menu File",
    description:
      'Setelah membuka template, klik menu "File" di toolbar bagian kiri atas Google Sheets.',
    image: "/Assets/sheets-guide/step-1-file-menu.png",
    tip: 'Menu "File" ada di pojok kiri atas, tepat di bawah judul spreadsheet.',
  },
  {
    step: 2,
    icon: Copy,
    title: 'Klik "Buat salinan"',
    description:
      'Dari dropdown menu File, pilih "Buat salinan" untuk menyalin template ke Google Drive kamu sendiri.',
    image: "/Assets/sheets-guide/step-2-buat-salinan.png",
    tip: "Opsi ini akan membuat salinan template yang bisa kamu edit secara bebas tanpa mengubah template aslinya.",
  },
  {
    step: 3,
    icon: Save,
    title: "Simpan ke Google Drive kamu",
    description:
      'Akan muncul dialog "Salin dokumen". Kamu bisa mengganti nama file sesuai keinginan, pilih folder penyimpanan, lalu klik tombol "Buat salinan".',
    image: "/Assets/sheets-guide/step-3-save.png",
    tip: "Setelah disalin, file akan langsung terbuka dan siap diisi. Semua perubahan otomatis tersimpan di Google Drive kamu.",
  },
];

const FEATURES = [
  {
    icon: Calendar,
    title: "Pencatatan Bulanan",
    desc: "Catat pemasukan & pengeluaran tiap bulan secara terperinci dengan kategori otomatis.",
  },
  {
    icon: BarChart3,
    title: "Rekap Tahunan",
    desc: "Lihat ringkasan keuangan setahun penuh di tab Rekap 1 Tahun dengan grafik & total.",
  },
  {
    icon: TrendingUp,
    title: "Investasi & Hutang",
    desc: "Pantau alokasi investasi bulanan dan pelacak cicilan/hutang berjalan di satu tempat.",
  },
];

export default function SheetsPage() {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ── */}
      <div className="pb-2 border-b border-slate-800/60 mb-2">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Template Google Sheets
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
          Template keuangan Finusa via{" "}
          <span className="text-emerald-400 font-medium">Google Sheets</span>{" "}
          — pantau keuangan kamu secara{" "}
          <span className="text-white font-medium">bulanan</span> dan{" "}
          <span className="text-white font-medium">tahunan</span>. Cocok
          sebagai pelengkap pencatatan harian di aplikasi Finusa.
        </p>
      </div>

      {/* ── Info Banner ── */}
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-400 leading-relaxed">
            <span className="text-slate-200 font-medium">
              Apa bedanya dengan Finusa?
            </span>{" "}
            Di aplikasi Finusa, pencatatan dilakukan{" "}
            <span className="text-emerald-400 font-medium">per hari</span>.
            Template Sheets ini dirancang untuk{" "}
            <span className="text-emerald-400 font-medium">
              rekap bulanan & tahunan
            </span>{" "}
            — kamu bisa melihat gambaran besar keuangan, alokasi investasi,
            dan tracking cicilan/hutang dalam satu spreadsheet yang rapi.
          </div>
        </div>
      </div>

      {/* ── Template Card ── */}
      <div className="rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 overflow-hidden shadow-lg">
        {/* Card Header */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                  Financial Freedom Management
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Executive Personal & Family Financial Hub
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0 hidden sm:inline-block">
              Google Sheets
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
            Template lengkap untuk mengelola keuangan pribadi & keluarga.
            Tersedia sheet untuk setiap bulan (Januari – Desember) dilengkapi
            tab Rekap 1 Tahun. Mencakup pemasukan, pengeluaran, investasi,
            cicilan/hutang, dan grafik proporsi otomatis.
          </p>

          {/* Feature pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <f.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 mb-0.5">
                    {f.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href={TEMPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-[0.98]"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Buka Template di Google Sheets</span>
            <ArrowRight className="w-4 h-4 ml-1 opacity-60" />
          </a>
        </div>
      </div>

      {/* ── Tutorial / Panduan ── */}
      <div className="rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 overflow-hidden shadow-lg">
        {/* Toggle Header */}
        <button
          type="button"
          onClick={() => setShowGuide(!showGuide)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div className="text-left">
              <h2 className="text-sm sm:text-base font-bold text-white">
                📖 Panduan Cara Pakai Template
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                3 langkah mudah untuk mulai menggunakan template
              </p>
            </div>
          </div>
          <div className="text-slate-500">
            {showGuide ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </button>

        {/* Steps */}
        {showGuide && (
          <div className="px-5 sm:px-6 pb-6 space-y-6">
            {/* Divider */}
            <div className="border-t border-slate-800/60" />

            {GUIDE_STEPS.map((step, index) => (
              <div key={step.step} className="space-y-3">
                {/* Step Header */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0">
                    <span className="text-xs font-bold">{step.step}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="ml-11 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-900/30 shadow-inner">
                  <img
                    src={step.image}
                    alt={`Langkah ${step.step}: ${step.title}`}
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Tip */}
                <div className="ml-11 flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    <span className="font-medium text-amber-300">Tips:</span>{" "}
                    {step.tip}
                  </p>
                </div>

                {/* Connector line between steps */}
                {index < GUIDE_STEPS.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-6 bg-slate-700/40" />
                  </div>
                )}
              </div>
            ))}

            {/* Final note */}
            <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-emerald-300 font-semibold">
                    Selesai! 🎉
                  </span>{" "}
                  Template sudah siap digunakan. Isi data keuangan kamu di
                  setiap sheet bulan (Januari – Desember). Rekap tahunan akan
                  otomatis terupdate di tab{" "}
                  <span className="text-white font-medium">
                    &quot;Rekap 1 Tahun&quot;
                  </span>
                  . Semua perubahan tersimpan otomatis di Google Drive kamu.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
