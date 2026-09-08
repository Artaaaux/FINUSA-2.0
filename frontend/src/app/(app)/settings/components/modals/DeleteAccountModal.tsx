"use client";

import React, { useState } from "react";
import { 
  X, 
  AlertTriangle, 
  Trash2 
} from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "transactions" | "account";
  onConfirm: () => void;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  type,
  onConfirm,
}: DeleteAccountModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");

  if (!isOpen) return null;

  const requiredConfirmationText = type === "account" ? "HAPUS AKUN" : "HAPUS TRANSAKSI";
  const isValid = confirmationInput.trim() === requiredConfirmationText;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1a1f2e] border border-rose-500/50 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {type === "account" ? "Hapus Akun Permanen" : "Hapus Riwayat Transaksi"}
              </h3>
              <p className="text-xs text-rose-400 mt-0.5 font-medium">
                Tindakan ini tidak dapat dibatalkan!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Warning */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 space-y-1.5 leading-relaxed">
            <p className="font-semibold">Perhatian Khusus:</p>
            {type === "account" ? (
              <p>
                Menghapus akun akan menghapus profil Anda, memutus semua integrasi Google Sheets, serta melenyapkan seluruh pos tabungan dan transaksi Anda secara permanen dari server Finusa.
              </p>
            ) : (
              <p>
                Seluruh catatan pemasukan, pengeluaran, struk OCR, dan log rekonsiliasi akan dihapus permanen. Saldo akun akan direset ke nol.
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Ketik <span className="font-mono text-rose-400 font-bold">{requiredConfirmationText}</span> di bawah untuk mengonfirmasi:
            </label>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder={requiredConfirmationText}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-500 font-mono tracking-wider"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>{type === "account" ? "Konfirmasi Hapus Akun" : "Konfirmasi Hapus Data"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
