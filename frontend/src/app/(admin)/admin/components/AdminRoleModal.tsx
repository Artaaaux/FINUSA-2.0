"use client";

import React from "react";
import { ShieldCheck, UserX, AlertTriangle, X } from "lucide-react";
import { AdminUserItem } from "@/lib/services/admin.service";

interface AdminRoleModalProps {
  user: AdminUserItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

export function AdminRoleModal({
  user,
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}: AdminRoleModalProps) {
  if (!isOpen || !user) return null;

  const isCurrentlyAdmin = user.systemRole === "admin" || user.systemRole === "super_admin";
  const targetRole = isCurrentlyAdmin ? "User Biasa" : "Admin";
  const displayName = (user.firstName + " " + user.lastName).trim() || user.email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !isProcessing && onClose()}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Glass Dialog */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[#090F21]/95 backdrop-blur-2xl border border-white/[0.12] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.12)] z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          aria-label="Tutup Dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
              isCurrentlyAdmin
                ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                : "bg-blue-500/15 border-blue-500/30 text-blue-400"
            }`}
          >
            {isCurrentlyAdmin ? (
              <UserX className="w-5 h-5" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Konfirmasi Perubahan Hak Akses
            </h3>
            <p className="text-xs text-slate-400">
              Verifikasi perubahan otorisasi sistem akun
            </p>
          </div>
        </div>

        {/* User Detail Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Pengguna:</span>
            <span className="font-semibold text-white">{displayName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Email:</span>
            <span className="font-mono text-slate-300 truncate max-w-[220px]">
              {user.email}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-white/[0.05]">
            <span className="text-slate-400">Status Baru:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                isCurrentlyAdmin
                  ? "bg-slate-800 text-slate-300 border border-slate-700"
                  : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {targetRole}
            </span>
          </div>
        </div>

        {/* Warning Note */}
        <div className="mt-3.5 flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            {isCurrentlyAdmin
              ? "Akun ini tidak lagi memiliki wewenang untuk mengakses dashboard manajemen dan konfigurasi platform."
              : "Akun ini akan mendapatkan hak akses penuh ke pusat kendali admin, metrik platform, dan manajemen pengguna."}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md active:scale-95 disabled:opacity-50 ${
              isCurrentlyAdmin
                ? "bg-rose-600 hover:bg-rose-500 shadow-rose-950/40"
                : "bg-blue-600 hover:bg-blue-500 shadow-blue-950/40"
            }`}
          >
            {isProcessing ? "Menyimpan Perubahan..." : `Ya, Jadikan ${targetRole}`}
          </button>
        </div>
      </div>
    </div>
  );
}
