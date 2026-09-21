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
      <span className="text-[11px] sm:text-xs font-medium tracking-wider text-slate-500 select-none">
        Rp
      </span>
      <span className={`font-semibold tabular-nums tracking-tight ${colorMap[color]} ${sizeMap[size]}`}>
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
    <section id="comparison" className="relative overflow-hidden bg-slate-950 py-24 px-4 sm:px-6 lg:px-8">
      {/* Background — extremely minimal */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.03)_0%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
            Kenapa FINUSA?
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Transaksi kecil yang tidak tercatat dan tabungan yang tidak dipisahkan dari saldo harian adalah dua penyebab utama kebocoran keuangan.
          </p>
        </div>

        {/* Side by Side Core Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* SISI KIRI: Menggunakan FINUSA */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8">
            <div className="pb-5 border-b border-slate-800/80 mb-6">
              <h3 className="text-xl font-semibold text-white">Dengan FINUSA</h3>
            </div>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Scan Struk AI 3 Detik — </strong>
                  Foto struk minimarket atau resto, sistem otomatis mengekstrak nominal, toko, dan kategori tanpa perlu mengetik manual.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Kantong Tabungan Terisolasi — </strong>
                  Uang tabungan dipisahkan secara psikologis dan visual dalam celengan digital berprogres, terhindar dari pemakaian konsumtif harian.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Integrasi Mandiri Google Sheets — </strong>
                  Sinkronisasi dua arah otomatis ke spreadsheet Google Drive pribadi. Data sepenuhnya milik Anda.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Bebas Iklan & Pelacak — </strong>
                  Antarmuka bersih tanpa gangguan iklan video maupun pop-up banner saat Anda mengelola keuangan.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Pemisahan Pos 50/30/20 Otomatis — </strong>
                  Otomatis membagi pengeluaran untuk kebutuhan pokok harian, pos gaya hidup, dan investasi masa depan.
                </p>
              </li>
            </ul>
          </div>

          {/* SISI KANAN: Tanpa FINUSA */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8">
            <div className="pb-5 border-b border-slate-800/80 mb-6">
              <h3 className="text-xl font-semibold text-white">Tanpa FINUSA</h3>
            </div>
            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Pencatatan Manual Melelahkan — </strong>
                  Harus membuka aplikasi dan mengetik nominal setiap kali selesai jajan. Kebanyakan orang menyerah mencatat.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Uang Tabungan Tercampur — </strong>
                  Gaji, tabungan, dan jajan berada di kartu ATM yang sama. Target tabungan sering tergerus untuk belanja.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Spreadsheet Rumit di HP — </strong>
                  Mengedit spreadsheet di ponsel saat belanja sangat lambat. Rumus mudah terhapus dan mutasi tidak otomatis.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Aplikasi Dipenuhi Iklan — </strong>
                  Aplikasi offline di Play Store sering menampilkan iklan video yang mengunci layar saat ingin mencatat.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" strokeWidth={3} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-white font-medium">Jebakan Biaya Tersembunyi — </strong>
                  Biaya langganan aplikasi dan cicilan paylater tidak terpantau, menyebabkan saldo terpotong tiba-tiba.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Simulation Card ── */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 sm:p-8">
          {/* Header & Profile Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
            <div>
              <h3 className="text-xl font-semibold text-white tracking-tight mb-1">
                Simulasi Dampak Finansial
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Pilih profil untuk melihat perbandingan angka nyata.
              </p>
            </div>

            {/* Profile Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 w-full sm:w-auto overflow-x-auto">
                {PROFILES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfile(p)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                      selectedProfile.id === p.id
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {p.name.split("&")[0].trim()}
                  </button>
                ))}
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 self-stretch sm:self-auto flex items-center justify-center">
                Penghasilan: {selectedProfile.monthlyIncomeText}
              </div>
            </div>
          </div>

          {/* 3 Cards Grid */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Kebocoran Kas Mikro */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Kebocoran Bulanan</span>
                </div>

                <div className="mb-4">
                  <AmountDisplay amount={selectedProfile.leakageWithout} color="white" size="lg" />
                  <span className="text-[11px] text-slate-500 font-mono block mt-1">
                    {leakagePercent}% dari penghasilan
                  </span>
                </div>

                {/* Breakdown List */}
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-800/80">
                  {selectedProfile.leakageBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-baseline gap-2">
                      <span className="text-[11px] text-slate-400 truncate">{item.item}</span>
                      <span className="text-[11px] font-mono text-slate-300 shrink-0">
                        {item.amount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-baseline gap-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-500">Total rincian</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {breakdownTotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[11px] text-slate-500 font-mono flex justify-between">
                <span>Waktu harian:</span>
                <span className="text-slate-300">{selectedProfile.timeSpentWithout}</span>
              </div>
            </div>

            {/* Card 2: Perbandingan Tabungan */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Potensi Tabungan</span>
                </div>

                {/* Row 1: Dengan FINUSA */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-medium">Dengan FINUSA</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {savingsRateWith}% dari gaji
                    </span>
                  </div>
                  <AmountDisplay amount={selectedProfile.savingsWith} color="emerald" size="lg" />
                </div>

                {/* Row 2: Tanpa FINUSA */}
                <div className="mb-4 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Tanpa FINUSA</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {savingsRateWithout}% dari gaji
                    </span>
                  </div>
                  <AmountDisplay amount={selectedProfile.savingsWithout} color="white" size="md" />
                </div>
              </div>

              <div className="mt-6 text-[11px] text-slate-500 font-mono flex justify-between">
                <span>Waktu dengan FINUSA:</span>
                <span className="text-emerald-400">{selectedProfile.timeSpentWith}</span>
              </div>
            </div>

            {/* Card 3: Proyeksi 1 Tahun */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                    Proyeksi 1 Tahun
                  </span>
                </div>

                <div className="mb-3">
                  <AmountDisplay amount={selectedProfile.yearlyAccumulationWith} color="blue" size="lg" />
                </div>

                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                  <TrendingUp className="h-3 w-3" />
                  +Rp {savingsDelta.toLocaleString("id-ID")}
                </div>

                {/* Calculation transparency */}
                <div className="mt-5 text-[10px] text-slate-500 font-mono border-t border-slate-800/80 pt-4">
                  Rp {selectedProfile.savingsWith.toLocaleString("id-ID")} × 12 bln
                  <br />= Rp {selectedProfile.yearlyAccumulationWith.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/auth/signup"
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors w-full"
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
