import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Database, Eye, Mail } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi (Privacy Policy) - FINUSA",
  description: "Kebijakan Privasi dan Perlindungan Data Pengguna Aplikasi FINUSA.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 bg-[#161B26] p-6 sm:p-10 rounded-2xl border border-slate-800 shadow-2xl">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Kebijakan Privasi (Privacy Policy)
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Terakhir diperbarui: 8 September 2026 • FINUSA (Finance Nusantara)
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              1. Informasi yang Kami Kumpulkan
            </h2>
            <p>
              FINUSA (Finance Nusantara) menghormati dan berkomitmen untuk melindungi privasi setiap pengguna. Saat Anda menggunakan aplikasi FINUSA, kami mengumpulkan informasi tertentu untuk memberikan layanan pencatatan keuangan terbaik:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-slate-400">
              <li>
                <strong className="text-slate-200">Informasi Akun:</strong> Alamat email, nama lengkap, dan foto profil yang Anda berikan secara langsung atau melalui Google Sign-In.
              </li>
              <li>
                <strong className="text-slate-200">Data Transaksi Keuangan:</strong> Catatan pemasukan, pengeluaran, kategori, dompet/rekening, serta foto resi transaksi yang Anda unggah.
              </li>
              <li>
                <strong className="text-slate-200">Data Otorisasi Google OAuth:</strong> Token otorisasi aman dari Google yang Anda izinkan untuk mengintegrasikan data ke Google Sheets pribadi Anda.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              2. Penggunaan Informasi Pengguna
            </h2>
            <p>Informasi yang dikumpulkan digunakan secara terbatas hanya untuk tujuan berikut:</p>
            <ul className="list-disc pl-6 space-y-1 text-slate-400">
              <li>Menyediakan layanan autentikasi aman (Login & Sign Up).</li>
              <li>Menampilkan laporan dan grafik analisis keuangan pribadi Anda.</li>
              <li>Mengirimkan/menyingkronkan data transaksi keuangan ke Google Spreadsheet milik Anda sendiri melalui API Google Sheets resmi.</li>
              <li>Memastikan keamanan akun dan mencegah akses tanpa izin.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              3. Perlindungan & Keamanan Data
            </h2>
            <p>
              Kami menerapkan standar keamanan enkripsi SSL/TLS tingkat tinggi dan infrastruktur database cloud Supabase dengan proteksi Row Level Security (RLS). Kami <strong>TIDAK PERNAH</strong> menjual, menyewakan, atau membagikan data keuangan pribadi Anda kepada pihak ketiga mana pun untuk tujuan pemasaran.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              4. Penggunaan Layanan Google API
            </h2>
            <p>
              Penggunaan FINUSA atas informasi yang diterima dari Google API mematuhi <em>Google API Services User Data Policy</em>, termasuk persyaratan <em>Limited Use</em>. Data Google Anda hanya digunakan untuk fungsionalitas aplikasi dan tidak pernah dibagikan ke pihak luar.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-800 pt-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              5. Hubungi Kami
            </h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin mengajukan penghapusan data akun, silakan hubungi tim pengembang FINUSA melalui:
            </p>
            <p className="font-mono text-cyan-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 inline-block">
              Email: azadira.rabbany@gmail.com
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © 2026 FINUSA (Finance Nusantara). All rights reserved.
        </div>
      </div>
    </div>
  );
}
