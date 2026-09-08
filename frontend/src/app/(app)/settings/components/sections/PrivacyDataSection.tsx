"use client";

import React from "react";
import { 
  Download, 
  Trash2, 
  AlertTriangle 
} from "lucide-react";

interface PrivacyDataSectionProps {
  onOpenExportModal: () => void;
  onOpenDeleteModal: (type: "transactions" | "account") => void;
}

export default function PrivacyDataSection({
  onOpenExportModal,
  onOpenDeleteModal,
}: PrivacyDataSectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Data & Pencadangan
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Unduh salinan lengkap data pembukuan, atau hapus riwayat akun Anda.
        </p>
      </div>

      {/* Data Export & Backup Banner */}
      <div className="p-5 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
            <Download className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Unduh Salinan Data Lengkap</h3>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              Dapatkan berkas arsip transaksi, struk yang telah di-scan, dan alokasi tabungan dalam format JSON, CSV, atau ringkasan PDF.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Ekspor Sekarang</span>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-5 sm:p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-rose-500/20 pb-3">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-rose-300">Zona Berbahaya (Danger Zone)</h3>
            <p className="text-xs text-rose-400/80">Tindakan berikut bersifat destruktif dan menghapus data secara permanen.</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Delete all transactions */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-white">Kosongkan Riwayat Pembukuan</div>
              <div className="text-[11px] text-slate-400">Hapus semua transaksi dan nota struk, namun pertahankan akun dan profil.</div>
            </div>
            <button
              type="button"
              onClick={() => onOpenDeleteModal("transactions")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-colors cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Transaksi</span>
            </button>
          </div>

          {/* Delete account permanently */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-rose-300">Hapus Akun Finusa Secara Permanen</div>
              <div className="text-[11px] text-slate-400">Semua data, integrasi, dan histori tabungan akan dihapus dari server selamanya.</div>
            </div>
            <button
              type="button"
              onClick={() => onOpenDeleteModal("account")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-md cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Akun Saya</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
