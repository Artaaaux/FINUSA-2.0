"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight, TrendingUp, Sparkles, Shield, Clock, Info } from "lucide-react";

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
    timeSpentWithout: "35 menit / minggu",
    timeSpentWith: "2 menit / hari",
    leakageBreakdown: [
      { item: "Jajan impulsif & kopi kekinian", amount: 320000 },
      { item: "Admin top-up e-wallet (Rp 1.500 × 20)", amount: 30000 },
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
    timeSpentWithout: "45 menit / minggu",
    timeSpentWith: "2 menit / hari",
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
    timeSpentWithout: "60 menit / minggu",
    timeSpentWith: "3 menit / hari",
    leakageBreakdown: [
      { item: "Fine dining & hangout tanpa anggaran pos", amount: 1200000 },
      { item: "Belanja impulsif barang hobi", amount: 650000 },
      { item: "Multi-subscription cloud & entertainment", amount: 380000 },
      { item: "Biaya administrasi kartu & transfer debit", amount: 220000 },
    ],
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

  // Derived calculations with transparent formulas
  const leakagePercent = ((selectedProfile.leakageWithout / selectedProfile.monthlyIncome) * 100).toFixed(1);
  const savingsRateWith = ((selectedProfile.savingsWith / selectedProfile.monthlyIncome) * 100).toFixed(0);
  const savingsRateWithout = ((selectedProfile.savingsWithout / selectedProfile.monthlyIncome) * 100).toFixed(0);
  const savingsDelta = selectedProfile.yearlyAccumulationWith - selectedProfile.yearlyAccumulationWithout;
  const breakdownTotal = selectedProfile.leakageBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section id="comparison" className="relative overflow-hidden bg-gradient-to-b from-[#080D1E] via-[#0C1126] to-[#090E1C] py-24 px-4 sm:px-6 lg:px-8">
      {/* Background — matching other sections: radial glows + subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_20%,rgba(37,99,235,0.06)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_70%_80%,rgba(16,185,129,0.05)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '36px 36px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)' }} />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-[420px] w-[420px] rounded-full bg-blue-600/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-emerald-500/[0.04] blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header — no badge, more honest copy */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Kenapa FINUSA, Bukan yang Lain?
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Transaksi kecil yang tidak tercatat dan tabungan yang tidak dipisahkan dari saldo harian adalah dua penyebab utama kebocoran keuangan. Berikut simulasi dampaknya berdasarkan profil penghasilan.
          </p>
        </div>

        {/* Side by Side Core Comparison: Left = FINUSA, Right = Tanpa FINUSA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* SISI KIRI: Menggunakan FINUSA */}
          <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/15 via-[#0D1225]/60 to-[#0B1020]/80 p-6 sm:p-8 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between pb-5 border-b border-blue-500/15 mb-6">
              <div>
                <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
                  Metode Modern & Terukur
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Dengan FINUSA</h3>
              </div>
              <div className="px-3 py-1 rounded-md bg-blue-500/15 border border-blue-500/20 text-xs font-semibold text-blue-300">
                Terkontrol & Efisien
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Scan Struk AI 3 Detik</strong>
                  Foto struk minimarket atau resto, sistem otomatis mengekstrak nominal, toko, dan kategori tanpa perlu mengetik manual.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Kantong Tabungan Terisolasi</strong>
                  Uang tabungan dipisahkan secara psikologis dan visual dalam celengan digital berprogres, terhindar dari pemakaian konsumtif harian.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Integrasi Mandiri Google Sheets</strong>
                  Sinkronisasi dua arah otomatis ke spreadsheet Google Drive pribadi. Data sepenuhnya milik Anda dan tidak bergantung pada vendor.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Bebas Iklan & Tanpa Pelacak Komersial</strong>
                  Antarmuka bersih tanpa gangguan iklan video maupun pop-up banner saat Anda sedang konsentrasi mengelola keuangan.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                  <Check className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Pemisahan Pos 50/30/20 Otomatis</strong>
                  Otomatis membagi pengeluaran untuk kebutuhan pokok harian, pos gaya hidup, dan investasi masa depan agar kas seimbang.
                </div>
              </li>
            </ul>
          </div>

          {/* SISI KANAN: Tanpa FINUSA */}
          <div className="rounded-2xl border border-rose-950/30 bg-gradient-to-b from-rose-950/10 via-[#0D1225]/60 to-[#0B1020]/80 p-6 sm:p-8 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between pb-5 border-b border-rose-900/15 mb-6">
              <div>
                <span className="text-xs font-semibold tracking-wider text-rose-400 uppercase">
                  Metode Konvensional / Tanpa Sistem
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">Tanpa FINUSA</h3>
              </div>
              <div className="px-3 py-1 rounded-md bg-rose-500/10 border border-rose-500/15 text-xs font-semibold text-rose-300">
                Rentan Bocor & Melelahkan
              </div>
            </div>

            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Pencatatan Manual Melelahkan</strong>
                  Harus membuka aplikasi dan mengetik nominal setiap kali selesai jajan. Kebanyakan orang menyerah mencatat setelah beberapa minggu pertama.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Uang Tabungan Menumpuk di Rekening Belanja</strong>
                  Gaji, tabungan, dan uang jajan berada di kartu ATM yang sama. Target tabungan sering tergerus untuk belanja sebelum akhir bulan.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Spreadsheet Rumit & Rawan Formula Rusak</strong>
                  Mengedit spreadsheet di ponsel saat belanja sangat lambat. Rumus mudah terhapus dan mutasi tidak otomatis tercatat.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Aplikasi Konvensional Dipenuhi Iklan</strong>
                  Aplikasi offline di Play Store sering menampilkan iklan video 15 detik yang mengunci layar saat ingin mencatat cepat.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20">
                  <X className="h-3 w-3" />
                </div>
                <div>
                  <strong className="text-white block mb-0.5">Jebakan Cicilan & Subscription Tersembunyi</strong>
                  Biaya langganan aplikasi dan cicilan paylater tidak terpantau, menyebabkan saldo terpotong tiba-tiba tanpa disadari.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Simulation Card ── */}
        <div className="rounded-3xl border border-slate-800/60 bg-gradient-to-b from-[#101724]/80 via-[#0C1019]/90 to-[#0A0D15] p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/[0.08] blur-[90px]" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/[0.08] blur-[90px]" />

          {/* Header & Profile Switcher */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold mb-2 border border-blue-500/15">
                <Sparkles className="h-3 w-3" />
                Simulasi Dampak Finansial
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Perhitungan Berdasarkan Profil Penghasilan
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Pilih profil yang mendekati kondisi Anda. Semua angka dihitung dari rincian pos di bawah.
              </p>
            </div>

            {/* Profile Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="inline-flex rounded-xl bg-slate-950/60 p-1.5 border border-slate-800/80">
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

              <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs font-mono text-slate-300 self-stretch sm:self-auto flex items-center justify-center">
                Penghasilan: {selectedProfile.monthlyIncomeText}
              </div>
            </div>
          </div>

          {/* 3 Cards Grid */}
          <div className="relative z-10 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Kebocoran Kas Mikro (Tanpa Finusa) */}
            <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#111724]/60 to-[#0C1019]/80 p-6 flex flex-col justify-between hover:border-rose-500/20 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400 font-medium">Kebocoran Mikro Bulanan</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[11px] font-semibold border border-rose-500/15">
                    Tanpa Sistem
                  </span>
                </div>

                <div className="mb-2">
                  <AmountDisplay amount={selectedProfile.leakageWithout} color="rose" size="xl" />
                  <span className="text-xs text-slate-500 block mt-1">
                    = {leakagePercent}% dari penghasilan ({selectedProfile.leakageWithout.toLocaleString("id-ID")} ÷ {selectedProfile.monthlyIncome.toLocaleString("id-ID")})
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-800/60 rounded-full h-1.5 my-4 overflow-hidden">
                  <div
                    className="bg-rose-500 h-1.5 rounded-full"
                    style={{ width: `${leakagePercent}%` }}
                  />
                </div>

                {/* Breakdown List — these items sum to the total above */}
                <div className="space-y-2 mt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Rincian Pos (total = angka di atas):
                  </span>
                  {selectedProfile.leakageBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-900/40 border border-slate-800/40"
                    >
                      <span className="text-slate-300 truncate mr-2 text-[11px]">{item.item}</span>
                      <span className="font-mono text-rose-300 font-medium shrink-0 text-xs tabular-nums">
                        -Rp {item.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                  {/* Verification: show sum matches */}
                  <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-rose-950/20 border border-rose-500/10 mt-1">
                    <span className="text-slate-400 text-[11px] font-medium">Total rincian</span>
                    <span className="font-mono text-rose-400 font-bold text-xs tabular-nums">
                      Rp {breakdownTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Estimasi waktu catat manual:</span>
                <span className="text-rose-400 font-mono font-medium">{selectedProfile.timeSpentWithout}</span>
              </div>
            </div>

            {/* Card 2: Disiplin Menabung */}
            <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-b from-[#111724]/60 to-[#0C1019]/80 p-6 flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-400 font-medium">Potensi Tabungan Bulanan</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-semibold border border-blue-500/15">
                    Perbandingan
                  </span>
                </div>

                {/* Row 1: Dengan FINUSA */}
                <div className="rounded-xl p-3.5 bg-emerald-950/15 border border-emerald-500/15 mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-semibold">Dengan FINUSA</span>
                    <span className="text-[10px] text-emerald-400/70 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {savingsRateWith}% dari penghasilan
                    </span>
                  </div>
                  <AmountDisplay amount={selectedProfile.savingsWith} color="emerald" size="lg" />
                </div>

                {/* Row 2: Tanpa FINUSA */}
                <div className="rounded-xl p-3.5 bg-slate-900/60 border border-slate-800/80 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Tanpa FINUSA</span>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded">
                      {savingsRateWithout}% dari penghasilan
                    </span>
                  </div>
                  <AmountDisplay amount={selectedProfile.savingsWithout} color="white" size="md" />
                </div>

                {/* Explanation instead of unverifiable percentages */}
                <div className="rounded-xl p-3 bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>
                      Selisih tabungan dihitung dari: pencatatan otomatis mengurangi kebocoran mikro, dan isolasi kantong mencegah tabungan terpakai untuk belanja harian.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Waktu pencatatan dengan FINUSA:</span>
                <span className="text-emerald-400 font-mono font-medium">{selectedProfile.timeSpentWith}</span>
              </div>
            </div>

            {/* Card 3: Proyeksi 1 Tahun */}
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 via-[#0E1524]/80 to-[#0C1019] p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-blue-400 font-semibold tracking-wide uppercase text-[11px]">
                    Proyeksi Tabungan 1 Tahun
                  </span>
                </div>

                <div className="my-2">
                  <AmountDisplay amount={selectedProfile.yearlyAccumulationWith} color="white" size="xl" />
                </div>

                {/* Delta Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-xs font-semibold mt-1">
                  <TrendingUp className="h-3.5 w-3.5 shrink-0" />
                  <span>+Rp {savingsDelta.toLocaleString("id-ID")} vs tanpa sistem</span>
                </div>

                <div className="mt-5 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>Dana darurat 3-6 bulan terbentuk secara bertahap tanpa utang.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Hanya butuh {selectedProfile.timeSpentWith} dengan fitur Scan Struk AI.</span>
                  </div>
                </div>

                {/* Calculation transparency */}
                <div className="mt-4 rounded-lg p-2.5 bg-slate-900/40 border border-slate-800/40 text-[10px] text-slate-500 font-mono">
                  = Rp {selectedProfile.savingsWith.toLocaleString("id-ID")} × 12 bulan = Rp {selectedProfile.yearlyAccumulationWith.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-500/15">
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
      </div>
    </section>
  );
}
