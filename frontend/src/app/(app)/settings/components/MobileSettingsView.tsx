"use client";

import React from "react";
import {
  Clock,
  Wallet,
  KeyRound,
  Download,
  Trash2,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { UserProfileSettings } from "../types";

interface MobileSettingsViewProps {
  profile: UserProfileSettings;
  onOpenTimezoneModal: () => void;
  onOpenProfileModal: () => void;
  onOpenPasswordModal: () => void;
  onOpenExportModal: () => void;
  onOpenDeleteTransactions: () => void;
  onOpenDeleteAccount: () => void;
  onOpenShortcuts: () => void;
  onLogout: () => void;
}

export default function MobileSettingsView({
  profile,
  onOpenTimezoneModal,
  onOpenProfileModal,
  onOpenPasswordModal,
  onOpenExportModal,
  onOpenDeleteTransactions,
  onOpenShortcuts,
  onLogout,
}: MobileSettingsViewProps) {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="pt-2 px-1 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pengaturan
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">
              Tersinkronisasi Cloud
            </span>
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* ── Section 1: Integrasi & Transaksi (Yang Paling Penting) ── */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Integrasi & Transaksi
        </h2>
        <div className="rounded-2xl bg-[#161c28] border border-slate-800/80 overflow-hidden divide-y divide-slate-800/60 shadow-lg">
          {/* Zona Waktu Item */}
          <button
            type="button"
            onClick={onOpenTimezoneModal}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Zona Waktu
                </p>
                <p className="text-xs text-blue-400/90 font-mono mt-0.5 truncate">
                  {profile.timezone || "Asia/Jakarta (WIB)"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500 group-hover:text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Mata Uang Item */}
          <div className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Mata Uang Utama</p>
                <p className="text-xs text-slate-400 mt-0.5">Rupiah Indonesia (IDR - Rp)</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
              Default
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Profil & Identitas ── */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Profil Saya
        </h2>
        <div className="rounded-2xl bg-[#161c28] border border-slate-800/80 overflow-hidden shadow-lg">
          {/* Profil Lengkap */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-md overflow-hidden flex items-center justify-center shrink-0">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-sm font-bold text-blue-400">
                    {profile.firstName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  Ketuk untuk mengubah nama & foto profil
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-slate-500 group-hover:text-slate-300">
              <span className="text-xs text-slate-400">Ubah</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* ── Section 3: Keamanan & Data ── */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Keamanan & Data
        </h2>
        <div className="rounded-2xl bg-[#161c28] border border-slate-800/80 overflow-hidden divide-y divide-slate-800/60 shadow-lg">
          {/* Ubah Password */}
          <button
            type="button"
            onClick={onOpenPasswordModal}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                  Kata Sandi Akun
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Ubah password masuk Anda</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
          </button>

          {/* Ekspor Data */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Ekspor Data Transaksi
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Unduh file CSV & JSON pembukuan</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
          </button>

          {/* Kosongkan Transaksi */}
          <button
            type="button"
            onClick={onOpenDeleteTransactions}
            className="w-full flex items-center justify-between p-4 hover:bg-rose-500/5 active:bg-rose-500/10 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-300">
                  Reset Riwayat Transaksi
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Kosongkan seluruh data kas</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400/60 shrink-0" />
          </button>
        </div>
      </div>

      {/* ── Section 4: Sistem & Bantuan ── */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          Umum & Bantuan
        </h2>
        <div className="rounded-2xl bg-[#161c28] border border-slate-800/80 overflow-hidden divide-y divide-slate-800/60 shadow-lg">
          {/* FAQ & Pintasan */}
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Pintasan & Bantuan
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Daftar shortcut navigasi cepat</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
          </button>

          {/* Versi Finusa */}
          <div className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Versi Aplikasi</p>
                <p className="text-xs text-emerald-400 mt-0.5">FINUSA v2.0 (100% Free & Open)</p>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          {/* Keluar Akun */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-rose-500/5 active:bg-rose-500/10 transition-colors text-left cursor-pointer group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-400">
                  Keluar dari Akun
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Selesaikan sesi saat ini</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400/60 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
