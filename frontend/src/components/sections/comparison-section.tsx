"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";

interface ProfileScenario {
  id: string;
  name: string;
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
  leakageBreakdown: Array<{ item: string; amount: number }>;
}

const PROFILES: ProfileScenario[] = [
  {
    id: "student",
    name: "Mahasiswa / Fresh Graduate",
    role: "Uang saku / gaji awal pertama",
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
    leakageBreakdown: [
      { item: "Jajan impulsif & kopi kekinian tanpa batas harian", amount: 320000 },
      { item: "Biaya admin top-up e-wallet (Rp 1.500 x 20 transaksi)", amount: 30000 },
      { item: "Biaya transfer beda bank & QRIS fee", amount: 20000 },
      { item: "Langganan streaming / aplikasi yang jarang dipakai", amount: 150000 },
    ],
  },
  {
    id: "employee",
    name: "Karyawan & Profesional Muda",
    role: "Penghasilan tetap bulanan",
    monthlyIncome: 8000000,
    monthlyIncomeText: "Rp 8.000.000 / bulan",
    leakageWithout: 1350000,
    savingsWithout: 500000,
    savingsWith: 2200000,
    yearlyAccumulationWithout: 6000000,
    yearlyAccumulationWith: 26400000,
    timeSpentWithout: "45 menit / minggu (rekonsiliasi mutasi)",
    timeSpentWith: "2 menit / hari (otomatis)",
    targetSuccessRateWithout: "22%",
    targetSuccessRateWith: "88%",
    leakageBreakdown: [
      { item: "Pengeluaran nongkrong & kuliner impulsif di luar anggaran", amount: 750000 },
      { item: "Biaya admin transfer antar-bank & potongan e-wallet", amount: 65000 },
      { item: "Biaya langganan gym / SaaS / media yang terlewat cancel", amount: 285000 },
      { item: "Bunga denda paylater / keterlambatan tagihan", amount: 250000 },
    ],
  },
  {
    id: "business",
    name: "Pelaku UMKM / Freelancer",
    role: "Arus kas usaha dan pribadi berputar",
    monthlyIncome: 22000000,
    monthlyIncomeText: "Rp 22.000.000 omzet kas",
    leakageWithout: 2950000,
    savingsWithout: 1200000,
    savingsWith: 5400000,
    yearlyAccumulationWithout: 14400000,
    yearlyAccumulationWith: 64800000,
    timeSpentWithout: "90 menit / minggu (buku kas manual)",
    timeSpentWith: "5 menit / hari (Dashboard & Sheets)",
    targetSuccessRateWithout: "28%",
    targetSuccessRateWith: "91%",
    leakageBreakdown: [
      { item: "Kas dagang terpakai belanja pribadi tanpa catatan", amount: 1400000 },
      { item: "Piutang pelanggan macet / lupa ditagih tepat waktu", amount: 850000 },
      { item: "Selisih stok bahan baku & bon belanja hilang", amount: 450000 },
      { item: "Biaya admin operasional & transaksi merchant", amount: 250000 },
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
    feature: "Pemisahan Kas UMKM & Usaha",
    withFinusa: "Mode Pembukuan Bisnis dengan pos Gaji Pemilik dan Piutang",
    withoutFinusa: "Uang modal dan belanja rumah tangga campur aduk hingga modal habis",
  },
  {
    feature: "Evaluasi Kebocoran Kas",
    withFinusa: "Peringatan batas anggaran kategori sebelum overbudget",
    withoutFinusa: "Hanya menyadari uang habis saat saldo ATM menipis di akhir bulan",
  },
];

function formatRupiah(num: number): string {
  return "Rp " + num.toLocaleString("id-ID");
}

export function ComparisonSection() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileScenario>(PROFILES[1]);

  return (
    <section id="comparison" className="relative overflow-hidden bg-[#0A0E17] py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-850">
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
                  <strong className="text-white block mb-0.5">Pemisahan Kas Usaha vs Kas Rumah Tangga</strong>
                  Fitur pencatatan modal dagang, piutang tempo, dan gaji pemilik (owner&apos;s draw) agar bisnis tidak kekurangan modal kerja.
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-5 border-t border-blue-500/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Rata-rata kepatuhan catat 1 tahun</span>
              <span className="font-bold text-emerald-400 tabular-nums">91% Konsisten</span>
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
                  <strong className="text-white block mb-0.5">Uang Dagang & Kas Keluarga Campur Aduk</strong>
                  Bagi pelaku usaha, modal tergerus untuk kebutuhan pribadi tanpa disadari hingga tiba saatnya membayar stok barang dagangan.
                </div>
              </li>
            </ul>

            <div className="mt-8 pt-5 border-t border-rose-900/20 flex items-center justify-between text-xs">
              <span className="text-slate-400">Rata-rata bertahan mencatat</span>
              <span className="font-bold text-rose-400 tabular-nums">Hanya 11 Hari</span>
            </div>
          </div>
        </div>

        {/* Kalkulator Simulasi Finansial Berdasarkan Profil Pengguna Indonesia */}
        <div className="rounded-2xl border border-slate-800 bg-[#121824] p-6 sm:p-10 mb-16 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Simulasi Perhitungan Finansial Nyata
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Pilih profil yang paling mendekati kondisi Anda untuk melihat perbandingan angka dan dampak riil 1 tahun.
              </p>
            </div>

            {/* Profile Tabs */}
            <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 self-start md:self-auto">
              {PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfile(p)}
                  className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                    selectedProfile.id === p.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p.name.split("/")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Profile Breakdown */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Kebocoran Kas Bulanan */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Potensi Kebocoran Kas</span>
                <span className="text-rose-400 font-semibold">Tanpa Finusa</span>
              </div>
              <div className="text-2xl font-extrabold text-rose-400 tabular-nums">
                {formatRupiah(selectedProfile.leakageWithout)}
                <span className="text-xs font-normal text-slate-400 block mt-0.5">per bulan</span>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs space-y-2">
                <span className="text-slate-400 font-medium block">Rincian kebocoran mikro:</span>
                {selectedProfile.leakageBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-400 text-[11px] leading-tight">
                    <span className="truncate pr-2">• {item.item}</span>
                    <span className="text-slate-300 shrink-0 tabular-nums">{formatRupiah(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Tabungan Bulanan Terkumpul */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Rata-rata Tabungan / Bulan</span>
                <span className="text-blue-400 font-semibold">Perbandingan</span>
              </div>
              <div className="space-y-3 mt-1">
                <div>
                  <span className="text-xs text-slate-400">Dengan FINUSA:</span>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums">
                    {formatRupiah(selectedProfile.savingsWith)}
                    <span className="text-xs text-slate-400 font-normal"> / bulan</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Tanpa FINUSA:</span>
                  <div className="text-base font-semibold text-slate-400 tabular-nums">
                    {formatRupiah(selectedProfile.savingsWithout)}
                    <span className="text-xs text-slate-500 font-normal"> / bulan</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Tingkat Ketercapaian Target:</span>
                <span className="text-emerald-400 font-bold tabular-nums">{selectedProfile.targetSuccessRateWith} vs {selectedProfile.targetSuccessRateWithout}</span>
              </div>
            </div>

            {/* Card 3: Akumulasi Bersih 1 Tahun */}
            <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-slate-900/80 p-5">
              <div className="flex items-center justify-between text-xs text-blue-400 mb-2 font-medium">
                <span>Akumulasi Tabungan 1 Tahun</span>
                <span>Proyeksi Riil</span>
              </div>
              <div className="text-3xl font-black text-white tabular-nums">
                {formatRupiah(selectedProfile.yearlyAccumulationWith)}
              </div>
              <div className="text-xs text-emerald-400 font-medium mt-1">
                Selisih dana darurat: +{formatRupiah(selectedProfile.yearlyAccumulationWith - selectedProfile.yearlyAccumulationWithout)}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Waktu yang dihabiskan:</span>
                  <span className="text-white font-medium">{selectedProfile.timeSpentWith}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Profil Penghasilan:</span>
                  <span className="text-slate-300 font-medium">{selectedProfile.monthlyIncomeText}</span>
                </div>
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
              Berdasarkan Analisis Pasar Aplikasi Pengatur Keuangan di Indonesia
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
