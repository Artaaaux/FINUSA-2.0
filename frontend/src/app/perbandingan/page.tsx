import React from "react";
import Link from "next/link";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { ComparisonSection } from "@/components/sections/comparison-section";
import { ArrowLeft, ShieldCheck, TrendingUp, Clock, Layers } from "lucide-react";

export const metadata = {
  title: "Perbandingan FINUSA vs Metode Lain | Analisis Keuangan Indonesia",
  description:
    "Telaah mendalam tentang perbedaan pengguna FINUSA dibandingkan pencatatan manual, spreadsheet, dan aplikasi pengatur uang konvensional di Indonesia beserta kalkulasi finansial nyata.",
};

const DETAILED_PROBLEMS = [
  {
    title: "1. Jebakan Kebocoran Mikro (Latte Factor & Friction Fees)",
    description:
      "Dalam lanskap transaksi di Indonesia, transaksi kecil bernilai Rp 15.000 hingga Rp 35.000 (jajan sore, kopi kekinian, ongkos antar pesanan makanan) adalah pos yang paling cepat mengikis saldo tanpa disadari. Ditambah lagi dengan biaya admin top-up dompet digital (Rp 1.000 - Rp 2.500 per transaksi) dan biaya transfer antar-bank. Dalam 1 bulan, rata-rata orang mengalami kebocoran mikro sebesar Rp 850.000 - Rp 1.450.000.",
    impact: "Pengurangan tabungan hingga 15% dari total gaji bulanan.",
  },
  {
    title: "2. Ketiadaan Isolasi Tabungan (Single-Account Trap)",
    description:
      "Sebagian besar masyarakat menumpuk uang gaji, dana darurat, dan uang belanja harian dalam satu rekening bank dengan satu kartu debit yang sama. Ketika saldo terlihat masih ada di aplikasi m-banking, otak menganggap dana tersebut bebas dibelanjakan. Tanpa isolasi kompartemen, 82% target tabungan terpakai sebelum tanggal 25.",
    impact: "Dana darurat tidak pernah terbentuk meskipun gaji naik setiap tahun.",
  },
  {
    title: "3. Friksi Pencatatan Manual yang Melelahkan",
    description:
      "Aplikasi konvensional menuntut pengguna membuka aplikasi, memilih kategori, dan mengetik angka setiap kali membeli barang kecil. Setelah 7 sampai 14 hari, kelelahan kognitif (*decision fatigue*) menyebabkan 89% pengguna berhenti mencatat. Akibatnya, buku kas terbengkalai dan posisi keuangan kembali buta.",
    impact: "Retensi pencatatan mandiri hanya bertahan rata-rata 11 hari.",
  },
  {
    title: "4. Percampuran Kas Usaha UMKM dan Konsumsi Pribadi",
    description:
      "Di Indonesia, jutaan pelaku usaha kecil dan freelancer mencampur penerimaan omzet usaha ke dalam rekening pribadi. Tanpa pemisahan pos 'Gaji Pemilik' (*owner's draw*) dan pencatatan utang-piutang jatuh tempo, uang modal terpakai untuk belanja konsumtif hingga usaha mengalami krisis likuiditas.",
    impact: "Penyebab nomor satu kebangkrutan usaha mikro dalam 2 tahun pertama.",
  },
];

export default function PerbandinganPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A0E17] text-slate-200 pt-24 pb-20">
        {/* Page Hero Header */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
            Laporan Analisis Komparatif
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            Mengapa Pendekatan Konvensional Gagal, dan Bagaimana FINUSA Mengubahnya
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
            Studi mendalam terhadap pola pencatatan keuangan di Indonesia membuktikan bahwa masalah pengelolaan uang bukan karena kurangnya niat, melainkan karena alat yang digunakan menciptakan beban mental yang terlalu besar.
          </p>
        </div>

        {/* The 4 Core Problems Section */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-slate-800">
            4 Masalah Utama Pengelolaan Uang di Indonesia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DETAILED_PROBLEMS.map((prob, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#101622] p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-white mb-3">{prob.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                    {prob.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Dampak nyata:</span>
                  <span className="text-rose-400 font-semibold">{prob.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Embedded Interactive Comparison Section */}
        <ComparisonSection />

        {/* Methodological Deep Dive: 4 Pillars of Finusa */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-20 mb-20">
          <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-slate-800">
            Arsitektur Solusi FINUSA untuk Ekosistem Indonesia
          </h2>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-[#101622] p-6 sm:p-8">
              <div className="flex items-center gap-3 text-blue-400 mb-3 font-semibold text-sm">
                <Clock className="h-5 w-5" />
                <span>1. Zero-Friction Data Capture (Scan Struk AI)</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                FINUSA menggunakan mesin AI OCR yang dilatih mengenali pola struk belanja dari ritel minimarket dan struk transaksi di Indonesia. Pengguna cukup mengambil foto struk belanjaan dalam 3 detik, dan sistem akan langsung mengekstrak nama merchant, total belanja, tanggal, serta kategori pengeluaran secara akurat.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#101622] p-6 sm:p-8">
              <div className="flex items-center gap-3 text-emerald-400 mb-3 font-semibold text-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>2. Kantong Celengan Berpagar Psikologis</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Fitur Tabungan mengisolasi dana target (seperti Dana Darurat, Qurban, atau Tabungan Liburan) dari saldo operasional kas harian. Dengan memisahkan visual kas bebas dan kas target, pengguna tidak lagi merasa memiliki uang berlebih yang mendorong konsumsi impulsif.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#101622] p-6 sm:p-8">
              <div className="flex items-center gap-3 text-amber-400 mb-3 font-semibold text-sm">
                <Layers className="h-5 w-5" />
                <span>3. Kedaulatan Data via Integrasi Google Sheets</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Kami meyakini bahwa data keuangan Anda adalah aset pribadi yang tidak boleh terkurung dalam satu sistem tertutup (*vendor lock-in*). FINUSA menyediakan sinkronisasi dua arah ke Google Sheets pribadi pengguna, sehingga seluruh data transaksi dapat diolah, dibackup, dan diakses seumur hidup.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#101622] p-6 sm:p-8">
              <div className="flex items-center gap-3 text-purple-400 mb-3 font-semibold text-sm">
                <TrendingUp className="h-5 w-5" />
                <span>4. Pembukuan Ganda: Pribadi & Usaha UMKM</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Dirancang khusus bagi freelancer dan wirausahawan mandiri. FINUSA memfasilitasi pencatatan kas bisnis yang terpisah dari kas rumah tangga dengan modul khusus untuk mencatat &apos;Gaji Pemilik&apos; serta melacak piutang pelanggan dan utang jatuh tempo.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/30 via-slate-900 to-slate-900 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Mulai Kendalikan Keuangan Anda Hari Ini
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              Bergabunglah dengan ribuan pengguna yang telah menghentikan kebocoran kas dan mencapai target tabungan mereka bersama FINUSA.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 transition-all shadow-lg"
              >
                Daftar Akun Gratis
              </Link>
              <Link
                href="/bantuan"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-300 font-semibold text-sm hover:text-white hover:border-slate-600 transition-all"
              >
                Lihat Panduan Fitur
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
