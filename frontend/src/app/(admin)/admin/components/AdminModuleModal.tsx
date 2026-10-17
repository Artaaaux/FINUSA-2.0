"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowLeftRight, 
  Receipt, 
  PiggyBank, 
  BarChart3, 
  Settings, 
  ExternalLink, 
  X, 
  CheckCircle2
} from "lucide-react";
import { AdminNavSectionId } from "./AdminSidebar";

interface AdminModuleModalProps {
  sectionId: AdminNavSectionId | null;
  isOpen: boolean;
  onClose: () => void;
  stats?: {
    totalUsers: number;
    totalTransactions: number;
    totalReceiptPhotos: number;
    totalSavingsGoals: number;
  };
}

export function AdminModuleModal({
  sectionId,
  isOpen,
  onClose,
  stats,
}: AdminModuleModalProps) {
  if (!isOpen || !sectionId) return null;

  const moduleData: Record<
    string,
    {
      title: string;
      subtitle: string;
      icon: React.ElementType;
      color: string;
      borderColor: string;
      bgIcon: string;
      href: string;
      statLabel: string;
      statValue: string | number;
      description: string;
      features: string[];
    }
  > = {
    transactions: {
      title: "Buku Transaksi",
      subtitle: "Manajemen pencatatan arus kas dan mutasi keuangan",
      icon: ArrowLeftRight,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgIcon: "bg-emerald-500/15",
      href: "/pembukuan",
      statLabel: "Total Mutasi Tercatat",
      statValue: stats?.totalTransactions ?? 7,
      description:
        "Modul pembukuan memungkinkan pemantauan pemasukan dan pengeluaran pengguna, integrasi multi-rekening, serta sinkronisasi Google Sheets.",
      features: [
        "Pencatatan kas masuk & kas keluar real-time",
        "Dukungan multi-metode pembayaran (Cash, QRIS, Transfer Bank)",
        "Sinkronisasi otomatis ke Google Spreadsheet",
      ],
    },
    receipt_scan: {
      title: "Scan Struk AI",
      subtitle: "Optical Character Recognition (OCR) & AI Vision",
      icon: Receipt,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgIcon: "bg-amber-500/15",
      href: "/receipt-scanner",
      statLabel: "Total Struk Belanja",
      statValue: stats?.totalReceiptPhotos ?? 0,
      description:
        "Sistem ekstraksi struk belanja pintar menggunakan arsitektur dual-AI: MeCutinAI Qwen 3.8 Flash Vision dengan fallback NVIDIA NIM Llama 3.2 11B Vision.",
      features: [
        "Ekstraksi teks otomatis & pemisahan item struk",
        "Deteksi total belanja, tanggal, dan nama merchant",
        "Failover ganda jika koneksi provider utama terhambat",
      ],
    },
    savings: {
      title: "Target Nabung",
      subtitle: "Manajemen celengan dan impian finansial pengguna",
      icon: PiggyBank,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgIcon: "bg-purple-500/15",
      href: "/nabung",
      statLabel: "Celengan Aktif",
      statValue: stats?.totalSavingsGoals ?? 2,
      description:
        "Fitur celengan terstruktur yang membantu pengguna mencapai target tabungan dengan proyeksi waktu, setoran berkala, dan visualisasi capaian.",
      features: [
        "Pelacakan progres target tabungan interaktif",
        "Pemberitahuan berkala dan rekomendasi nominal setoran",
        "Kategori tabungan fleksibel (dana darurat, liburan, gadget)",
      ],
    },
    reports: {
      title: "Laporan & Monitoring",
      subtitle: "Analitik performa keuangan dan ringkasan platform",
      icon: BarChart3,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      bgIcon: "bg-cyan-500/15",
      href: "/monitor",
      statLabel: "Status Laporan",
      statValue: "Aktif",
      description:
        "Pusat visualisasi data komprehensif yang menyajikan grafik tren pengeluaran, rasio tabungan, dan evaluasi kesehatan finansial.",
      features: [
        "Grafik tren pengeluaran bulanan dan mingguan",
        "Rasio pembagian kategori belanja (Needs, Wants, Savings)",
        "Ekspor laporan komparatif dalam format spreadsheet",
      ],
    },
    settings: {
      title: "Pengaturan & Konfigurasi",
      subtitle: "Preferensi platform, profil pengguna, dan keamanan",
      icon: Settings,
      color: "text-slate-300",
      borderColor: "border-slate-500/30",
      bgIcon: "bg-slate-500/15",
      href: "/settings",
      statLabel: "Status Konfigurasi",
      statValue: "Tersinkron",
      description:
        "Kelola pengaturan platform, kunci API pihak ketiga (Supabase, Google Sheets, AI Vision), serta preferensi notifikasi.",
      features: [
        "Manajemen kredensial Supabase & Google Cloud OAuth",
        "Pengaturan zona waktu default (Asia/Jakarta WIB)",
        "Konfigurasi Cloudflare Turnstile & security headers",
      ],
    },
  };

  const current = moduleData[sectionId];
  if (!current) return null;

  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Apple Glass Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#090F21]/95 backdrop-blur-2xl border border-white/[0.12] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.12)] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup Dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm ${current.bgIcon} ${current.borderColor} ${current.color}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {current.title}
            </h3>
            <p className="text-xs text-slate-400">{current.subtitle}</p>
          </div>
        </div>

        {/* Quick Metric Bar */}
        <div className="mt-5 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-slate-400">{current.statLabel}</span>
          <span className="text-base font-extrabold text-white font-mono">
            {current.statValue}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3.5 text-xs text-slate-300 leading-relaxed">
          {current.description}
        </p>

        {/* Features Checklist */}
        <div className="mt-4 space-y-2">
          {current.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
          >
            Tutup
          </button>
          <Link
            href={current.href}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md active:scale-95"
          >
            <span>Buka Modul Lengkap</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
