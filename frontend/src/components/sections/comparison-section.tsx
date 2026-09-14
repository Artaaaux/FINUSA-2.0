"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, TrendingUp, Sparkles, Shield, Clock } from "lucide-react";

interface ProfileScenario {
  id: string;
  name: string;
  badge: string;
  role: string;
  monthlyIncome: number;
  monthlyIncomeText: string;
  leakageWithout: number;
  savingsWith: number;
  savingsWithout: number;
  yearlyAccumulationWith: number;
  yearlyAccumulationWithout: number;
  timeSpentWithout: string;
  timeSpentWith: string;
  targetSuccessRateWithout: string;
  targetSuccessRateWith: string;
  leakagePercentage: string;
  leakageBreakdown: Array<{ item: string; amount: number }>;
}

const PROFILES: ProfileScenario[] = [
  {
    id: "student",
    name: "Mahasiswa & Pelajar",
    badge: "Uang Saku & Kerja Lepas",
    role: "Alokasi uang saku, kos, dan jajan harian",
    monthlyIncome: 3500000,
    monthlyIncomeText: "Rp 3.500.000 / bulan",
    leakageWithout: 520000,
    savingsWithout: 150000,
    savingsWith: 850000,
    yearlyAccumulationWithout: 1800000,
    yearlyAccumulationWith: 10200000,
    timeSpentWithout: "35 menit / minggu (sering lupa)",
    timeSpentWith: "2 menit / hari (Scan Struk AI)",
    targetSuccessRateWithout: "14%",
    targetSuccessRateWith: "82%",
    leakagePercentage: "14.8%",
    leakageBreakdown: [
      { item: "Jajan impulsif & kopi kekinian", amount: 320000 },
      { item: "Admin top-up e-wallet (Rp 1.500 x 20)", amount: 30000 },
      { item: "Biaya transfer beda bank & QRIS fee", amount: 20000 },
      { item: "Langganan streaming jarang dipakai", amount: 150000 },
    ],
  },
  {
    id: "firstjobber",
    name: "First Jobber & Karyawan Muda",
    badge: "Gaji Tetap Bulanan",
    role: "Gaji pertama & belajar hidup mandiri",
    monthlyIncome: 7500000,
    monthlyIncomeText: "Rp 7.500.000 / bulan",
    leakageWithout: 1250000,
    savingsWithout: 450000,
    savingsWith: 2100000,
    yearlyAccumulationWithout: 5400000,
    yearlyAccumulationWith: 25200000,
    timeSpentWithout: "45 menit / minggu (rekonsiliasi mutasi)",
    timeSpentWith: "2 menit / hari (otomatis)",
    targetSuccessRateWithout: "22%",
    targetSuccessRateWith: "88%",
    leakagePercentage: "16.6%",
    leakageBreakdown: [
      { item: "Nongkrong & kuliner impulsif akhir pekan", amount: 680000 },
      { item: "Admin top-up & transfer antar-bank", amount: 65000 },
      { item: "Langganan gym / SaaS lupa dicancel", amount: 255000 },
      { item: "Bunga denda cicilan / paylater", amount: 250000 },
    ],
  },
  {
    id: "professional",
    name: "Profesional & Senior Single",
    badge: "Karier Mapan",
    role: "Pendapatan stabil & target finansial besar",
    monthlyIncome: 16000000,
    monthlyIncomeText: "Rp 16.000.000 / bulan",
    leakageWithout: 2450000,
    savingsWithout: 1800000,
    savingsWith: 5200000,
    yearlyAccumulationWithout: 21600000,
    yearlyAccumulationWith: 62400000,
    timeSpentWithout: "60 menit / minggu (banyak rekening)",
    timeSpentWith: "3 menit / hari (Scan Struk & Sheets)",
    targetSuccessRateWithout: "34%",
    targetSuccessRateWith: "93%",
    leakagePercentage: "15.3%",
    leakageBreakdown: [
      { item: "Fine dining & hangout tanpa anggaran pos", amount: 1200000 },
      { item: "Belanja impulsif barang hobi", amount: 650000 },
      { item: "Multi-subscription cloud & entertainment", amount: 380000 },
      { item: "Biaya administrasi kartu & transfer debit", amount: 220000 },
    ],
  },
];

const COMPARISON_MATRIX = [
  {
    feature: "Pencatatan Struk Belanja",
    withFinusa: "Pindai otomatis via Scan AI OCR (3 detik per struk)",
    withoutFinusa: "Ketik manual angka satu per satu atau nota hilang",
  },
  {
    feature: "Isolasi Target Tabungan",
    withFinusa: "Kantong celengan digital terisolasi dengan milestone visual",
    withoutFinusa: "Menumpuk di rekening harian, 82% tergerus sebelum akhir bulan",
  },
  {
    feature: "Pengalaman Pengguna & Iklan",
    withFinusa: "100% Bebas iklan banner, bebas iklan pop-up, privasi bersih",
    withoutFinusa: "Aplikasi gratisan dipenuhi video iklan setiap selesai mencatat",
  },
  {
    feature: "Integrasi Google Sheets",
    withFinusa: "Sinkronisasi dua arah real-time ke Google Drive pribadi",
    withoutFinusa: "Data terkunci di aplikasi pengembang atau rumus Excel manual error",
  },
  {
    feature: "Alokasi Pos Kebutuhan vs Keinginan",
    withFinusa: "Pemisahan otomatis rumus 50/30/20 (pokok, gaya hidup, tabungan)",
    withoutFinusa: "Saldo bercampur aduk, pos gaya hidup memakan jatah tabungan",
  },
  {
    feature: "Evaluasi Kebocoran Kas",
    withFinusa: "Peringatan batas anggaran kategori sebelum overbudget",
    withoutFinusa: "Hanya menyadari uang habis saat saldo ATM menipis di akhir bulan",
  },
];

function AmountDisplay({
  amount,
  color = "white",
  size = "md",
}: {
  amount: number;
  color?: "white" | "rose" | "emerald" | "blue";
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const formatted = amount.toLocaleString("id-ID");
  const colorMap = {
    white: "text-white",
    rose: "text-rose-400",
    emerald: "text-emerald-400",
    blue: "text-blue-400",
  };
  const sizeMap = {
    sm: "text-base sm:text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl",
  };

  return (
    <div className="inline-flex items-baseline gap-1 font-mono">
      <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-400 select-none">
        Rp
      </span>
      <span className={`font-bold tabular-nums tracking-tight ${colorMap[color]} ${sizeMap[size]}`}>
        {formatted}
      </span>
    </div>
  );
}

export function ComparisonSection() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileScenario>(PROFILES[1]);
  const savingsDelta = selectedProfile.yearlyAccumulationWith - selectedProfile.yearlyAccumulationWithout;

  return (
    <section id="comparison" className="relative overflow-hidden bg-[#0A0E17] py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_25%_25%,rgba(75,123,255,0.07)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_75%_75%,rgba(42,157,143,0.05)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Analisis Komparasi Keuangan Indonesia
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-5">
            Apa Bedanya Menggunakan FINUSA Dibandingkan Metode Lain?
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Rata-rata orang Indonesia kehilangan Rp 850.000 hingga Rp 1.450.000 setiap bulan bukan karena belanja besar, melainkan akibat kebocoran transaksi kecil tak terdata dan ketiadaan isolasi pos tabungan.
          </p>
        </div>

        {/* Side by Side Core Comparison: Left = FINUSA, Right = Tanpa FINUSA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* SISI KIRI: Menggunakan FINUSA */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 via-slate-900/60 to-slate-900/90 p-6 sm:p-8 backdrop-blur-sm relative shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between pb-5 border-b border-blue-500/20 mb-6">
              <div>
                <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
                  Metode Modern & Terukur
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Dengan FINUSA</h3>
              </div>
              <div className="px-3 py-1 rounded-md bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-300">
                Terkontrol & Efisien
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Scan Struk AI 3 Detik</strong>
                  Foto struk minimarket atau resto, sistem otomatis mengekstrak nominal, toko, dan kategori tanpa perlu mengetik manual.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Kantong Tabungan Terisolasi</strong>
                  Uang tabungan dipisahkan secara psikologis dan visual dalam celengan digital berprogres, terhindar dari pemakaian konsumtif harian.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Integrasi Mandiri Google Sheets</strong>
                  Sinkronisasi dua arah otomatis ke spreadsheet Google Drive pribadi. Data sepenuhnya milik Anda dan tidak bergantung pada vendor.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Bebas Iklan & Tanpa Pelacak Komersial</strong>
                  Antarmuka bersih tanpa gangguan iklan video maupun pop-up banner saat Anda sedang konsentrasi mengelola keuangan.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Pemisahan Pos 50/30/20 Otomatis</strong>
                  Otomatis membagi pengeluaran untuk kebutuhan pokok harian, pos gaya hidup, dan investasi masa depan agar kas seimbang.
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-5 border-t border-blue-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Rata-rata kepatuhan catat 1 tahun</span>
              <span className="font-bold text-emerald-400 font-mono">91% Konsisten</span>
            </div>
          </div>

          {/* SISI KANAN: Tanpa FINUSA */}
          <div className="rounded-2xl border border-rose-950/40 bg-gradient-to-b from-rose-950/10 via-slate-900/60 to-slate-900/90 p-6 sm:p-8 backdrop-blur-sm relative shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between pb-5 border-b border-rose-900/20 mb-6">
              <div>
                <span className="text-xs font-semibold tracking-wider text-rose-400 uppercase">
                  Metode Konvensional / Tanpa Sistem
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Tanpa FINUSA</h3>
              </div>
              <div className="px-3 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300">
                Rentan Bocor & Melelahkan
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Pencatatan Manual Melelahkan</strong>
                  Harus membuka aplikasi dan mengetik nominal setiap kali selesai jajan. 89% orang menyerah mencatat setelah minggu kedua.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Uang Tabungan Menumpuk di Rekening Belanja</strong>
                  Gaji, tabungan, dan uang jajan berada di kartu ATM yang sama. 82% target tabungan tergerus untuk belanja sebelum akhir bulan.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Spreadsheet Rumit & Rawan Formula Rusak</strong>
                  Mengedit spreadsheet di ponsel saat belanja sangat lambat. Rumus mudah terhapus dan mutasi tidak otomatis tercatat.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Aplikasi Konvensional Dipenuhi Iklan</strong>
                  Aplikasi offline di Play Store sering menampilkan iklan video 15 detik yang mengunci layar saat ingin mencatat cepat.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/30">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Jebakan Cicilan & Subscription Tersembunyi</strong>
                  Biaya langganan aplikasi dan cicilan paylater tidak terpantau, menyebabkan saldo terpotong tiba-tiba tanpa disadari.
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-5 border-t border-rose-900/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Rata-rata bertahan mencatat</span>
              <span className="font-bold text-rose-400 font-mono">Hanya 11 Hari</span>
            </div>
          </div>
        </div>

        {/* ── Modern Redesigned Simulation Card ── */}
        <div className="rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#111724] via-[#0C1019] to-[#0A0D15] p-6 sm:p-10 mb-16 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[90px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[90px]" />

          {/* Header & Profile Switcher */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/20">
                <Sparkles className="h-3 w-3" />
                Kalkulator Dampak Finansial
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Simulasi Perhitungan Finansial Nyata
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Pilih profil Anda untuk membandingkan kebocoran kas bulanan dan proyeksi tabungan.
              </p>
            </div>

            {/* Profile Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="inline-flex rounded-xl bg-slate-950/80 p-1.5 border border-slate-800">
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfile(p)}
                    className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      selectedProfile.id === p.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {p.name.split("&")[0]}
                  </button>
                ))}
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 self-stretch sm:self-auto flex items-center justify-center">
                Penghasilan: {selectedProfile.monthlyIncomeText}
              </div>
            </div>
          </div>

          {/* 3 Modern Cards Grid */}
          <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Kebocoran Kas Mikro (Tanpa Finusa) */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950/90 p-6 flex flex-col justify-between hover:border-rose-500/30 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400 font-medium">Kebocoran Mikro</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[11px] font-semibold border border-rose-500/20">
                    Tanpa Finusa
                  </span>
                </div>

                <div className="mb-2">
                  <AmountDisplay amount={selectedProfile.leakageWithout} color="rose" size="xl" />
                  <span className="text-xs text-slate-500 block mt-1">
                    {selectedProfile.leakagePercentage} dari pendapatan bulanan menguap
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 my-4 overflow-hidden">
                  <div
                    className="bg-rose-500 h-1.5 rounded-full"
                    style={{ width: selectedProfile.leakagePercentage }}
                  />
                </div>

                {/* Structured Breakdown List */}
                <div className="space-y-2 mt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Pos Bocoran Rata-Rata:
                  </span>
                  {selectedProfile.leakageBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60"
                    >
                      <span className="text-slate-300 truncate mr-2 text-[11px]">{item.item}</span>
                      <span className="font-mono text-rose-300 font-medium shrink-0 text-xs tabular-nums">
                        -Rp {item.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Waktu habis untuk catat:</span>
                <span className="text-rose-400 font-mono font-medium">{selectedProfile.timeSpentWithout}</span>
              </div>
            </div>

            {/* Card 2: Akumulasi Tabungan Bulanan */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/70 to-slate-950/90 p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400 font-medium">Disiplin Menabung</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-semibold border border-blue-500/20">
                    Perbandingan Bulanan
                  </span>
                </div>

                {/* Row 1: Dengan FINUSA */}
                <div className="rounded-xl p-3.5 bg-emerald-950/20 border border-emerald-500/20 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-semibold">Dengan FINUSA</span>
                    <span className="text-[10px] text-emerald-400/80 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      Rasio 28%
                    </span>
                  </div>
                  <AmountDisplay amount={selectedProfile.savingsWith} color="emerald" size="lg" />
                </div>

                {/* Row 2: Tanpa FINUSA */}
                <div className="rounded-xl p-3.5 bg-slate-900/80 border border-slate-800 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Tanpa FINUSA</span>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                      Rasio 4%
                    </span>
                  </div>
                  <AmountDisplay amount={selectedProfile.savingsWithout} color="white" size="md" />
                </div>

                {/* Success Rate Comparison */}
                <div className="rounded-xl p-3 bg-slate-900/50 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Target Tercapai:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {selectedProfile.targetSuccessRateWith}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Gagal di Akhir Bulan:</span>
                    <span className="text-rose-400 font-mono font-bold">
                      {selectedProfile.targetSuccessRateWithout}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Pencatatan harian:</span>
                <span className="text-emerald-400 font-mono font-medium">{selectedProfile.timeSpentWith}</span>
              </div>
            </div>

            {/* Card 3: Akumulasi Bersih 1 Tahun (Spotlight Card) */}
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/30 via-slate-900/90 to-[#0E1524] p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl" />

              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-blue-400 font-semibold tracking-wide uppercase text-[11px]">
                    Proyeksi Tabungan 1 Tahun
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold border border-blue-500/30">
                    Hasil Nyata
                  </span>
                </div>

                <div className="my-2">
                  <AmountDisplay amount={selectedProfile.yearlyAccumulationWith} color="white" size="xl" />
                </div>

                {/* Delta Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mt-1">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                  <span>+{savingsDelta.toLocaleString("id-ID")} Lebih Banyak</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Dana darurat 3-6 bulan terbentuk secara bertahap tanpa utang.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Hanya butuh 2 menit per hari dengan fitur Scan Struk AI.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-500/20">
                <Link
                  href="/auth/signup"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
                >
                  Mulai Amankan Tabungan
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Comparison Matrix Table */}
        <div className="rounded-2xl border border-slate-800 bg-[#0F141F] overflow-hidden mb-12 shadow-xl">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Matriks Perbandingan Fitur Detail
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Berdasarkan Analisis Aplikasi Pengatur Keuangan Pribadi di Indonesia
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6 font-semibold w-1/4">Aspek Evaluasi</th>
                  <th className="py-3.5 px-6 font-semibold text-blue-400 w-3/8">FINUSA</th>
                  <th className="py-3.5 px-6 font-semibold text-slate-400 w-3/8">Aplikasi Konvensional / Catatan Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-medium text-white">{row.feature}</td>
                    <td className="py-4 px-6 text-slate-200">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{row.withFinusa}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      <div className="flex items-start gap-2">
                        <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{row.withoutFinusa}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Action Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
          <div>
            <h4 className="text-base font-bold text-white">Ingin membaca analisis riset selengkapnya?</h4>
            <p className="text-sm text-slate-400">
              Pelajari metodologi dan telaah komprehensif perilaku belanja di Indonesia.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/perbandingan"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-sm font-semibold text-slate-200 hover:text-white hover:border-slate-600 transition-all"
            >
              Baca Analisis Lengkap
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-md"
            >
              Coba Finusa Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
