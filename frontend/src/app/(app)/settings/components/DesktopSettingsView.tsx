"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Check,
  User,
  Upload,
  Trash2,
  Camera,
  Loader2,
  Save,
  KeyRound,
  Download,
  ShieldCheck,
  Info,
  LogOut,
  Wallet
} from "lucide-react";
import { UserProfileSettings } from "../types";
import { SettingsService } from "@/lib/services/settings.service";

interface DesktopSettingsViewProps {
  profile: UserProfileSettings;
  onSaveProfile: (updated: UserProfileSettings) => Promise<void>;
  isSavingProfile: boolean;
  onSelectTimezone: (tz: string) => void;
  onOpenExportModal: () => void;
  onOpenDeleteTransactions: () => void;
  onOpenDeleteAccount: () => void;
  onChangePasswordSuccess: () => void;
  onChangePassword?: (current: string, next: string) => Promise<{ success: boolean; error?: string }>;
  onLogout: () => void;
}

const TIMEZONES = [
  {
    id: "Asia/Jakarta (WIB)",
    name: "WIB — Waktu Indonesia Barat",
    region: "Sumatra, Jawa, Kalimantan Barat & Tengah",
    utc: "UTC+7",
    offsetHours: 7,
  },
  {
    id: "Asia/Makassar (WITA)",
    name: "WITA — Waktu Indonesia Tengah",
    region: "Bali, Nusa Tenggara, Kalimantan Selatan & Timur, Sulawesi",
    utc: "UTC+8",
    offsetHours: 8,
  },
  {
    id: "Asia/Jayapura (WIT)",
    name: "WIT — Waktu Indonesia Timur",
    region: "Maluku, Maluku Utara, Papua & sekitarnya",
    utc: "UTC+9",
    offsetHours: 9,
  },
  {
    id: "Asia/Singapore (SGT)",
    name: "SGT — Singapore / Malaysia",
    region: "Singapura, Semenanjung Malaysia, Sabah, Sarawak",
    utc: "UTC+8",
    offsetHours: 8,
  },
];

export default function DesktopSettingsView({
  profile,
  onSaveProfile,
  isSavingProfile,
  onSelectTimezone,
  onOpenExportModal,
  onOpenDeleteTransactions,
  onChangePasswordSuccess,
  onChangePassword,
  onLogout,
}: DesktopSettingsViewProps) {
  const [formData, setFormData] = useState<UserProfileSettings>(profile);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [liveTimes, setLiveTimes] = useState<Record<string, string>>({});

  // Password state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  useEffect(() => {
    setFormData(profile);
    setAvatarPreview(profile.avatarUrl);
  }, [profile]);

  // Real-time clock for timezones
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const times: Record<string, string> = {};

      TIMEZONES.forEach((tz) => {
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const tzDate = new Date(utc + 3600000 * tz.offsetHours);
        const hours = String(tzDate.getHours()).padStart(2, "0");
        const mins = String(tzDate.getMinutes()).padStart(2, "0");
        const secs = String(tzDate.getSeconds()).padStart(2, "0");
        times[tz.id] = `${hours}:${mins}:${secs}`;
      });

      setLiveTimes(times);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setAvatarPreview(tempUrl);
    setIsUploadingAvatar(true);

    try {
      const uploadedUrl = await SettingsService.uploadAvatar(file);
      setAvatarPreview(uploadedUrl);
      setFormData((prev) => ({ ...prev, avatarUrl: uploadedUrl }));
    } catch (err) {
      console.warn("Avatar upload error:", err);
      setFormData((prev) => ({ ...prev, avatarUrl: tempUrl }));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview("");
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
  };

  const handleTimezoneChange = (tzId: string) => {
    setFormData((prev) => ({ ...prev, timezone: tzId }));
    onSelectTimezone(tzId);
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("Kata sandi baru minimal harus 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (onChangePassword) {
      setIsSubmittingPassword(true);
      try {
        const res = await onChangePassword(currentPassword, newPassword);
        if (!res.success) {
          setPasswordError(res.error || "Gagal memperbarui kata sandi.");
          return;
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordForm(false);
        onChangePasswordSuccess();
      } catch (err: unknown) {
        const errorObj = err as Error;
        setPasswordError(errorObj?.message || "Terjadi kesalahan saat memproses pembaruan kata sandi.");
      } finally {
        setIsSubmittingPassword(false);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ─────────────────────────────────────────────────────────────
          CARD 1 (HIGHLIGHT): Zona Waktu & Integrasi Transaksi Uang Keluar/Masuk
      ───────────────────────────────────────────────────────────── */}
      <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#182030] to-[#141926] border-2 border-blue-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_25px_rgba(75,123,255,0.1)] relative overflow-hidden">
        {/* Top ambient glow line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500 via-teal-400 to-indigo-500" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-700/60">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Zona Waktu & Integrasi Transaksi
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
                  Penting
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Zona waktu ini digunakan sebagai acuan waktu otomatis saat mencatat uang masuk dan uang keluar di seluruh fitur Finusa (Catat, Monitor, dan sinkronisasi Google Sheets).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold">
              <Wallet className="w-3.5 h-3.5" />
              <span>Mata Uang: IDR (Rp)</span>
            </div>
          </div>
        </div>

        {/* Timezone Grid Selection */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {TIMEZONES.map((tz) => {
            const isSelected =
              formData.timezone?.includes(tz.id.split(" ")[0]) ||
              formData.timezone === tz.id;

            return (
              <button
                key={tz.id}
                type="button"
                onClick={() => handleTimezoneChange(tz.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600/20 border-blue-500/80 shadow-[0_0_20px_rgba(37,99,235,0.2)] ring-1 ring-blue-400"
                    : "bg-[#121722]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {tz.name}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tz.utc}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 truncate">
                    {tz.region}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {liveTimes[tz.id] && (
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-800/60 shadow-xs">
                      {liveTimes[tz.id]}
                    </span>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: Profil & Identitas Pengguna
      ───────────────────────────────────────────────────────────── */}
      <section className="p-6 sm:p-7 rounded-3xl bg-[#161c28] border border-slate-800/90 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Profil & Identitas Saya
              </h2>
              <p className="text-xs text-slate-400">
                Kelola nama tampilan dan foto profil akun Anda
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {/* Avatar Row */}
          <div className="p-4 rounded-2xl bg-[#121722] border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-md overflow-hidden flex items-center justify-center">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Foto Profil"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-xl font-bold text-blue-400">
                      {formData.firstName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="desktop-avatar-upload"
                  className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                  title="Ganti Foto"
                >
                  <Camera className="w-5 h-5" />
                </label>
                <input
                  id="desktop-avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">Foto Profil</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  PNG, JPG atau WEBP hingga 5MB.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <label
                    htmlFor="desktop-avatar-upload"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingAvatar ? "Mengunggah..." : "Unggah Baru"}</span>
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields: Sisakan Nama Depan & Nama Belakang */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nama Depan
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="Masukkan nama depan"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Nama Belakang
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
                placeholder="Masukkan nama belakang"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile || isUploadingAvatar}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer active:scale-95"
            >
              {isSavingProfile || isUploadingAvatar ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: Keamanan, Data & Tindakan Akun
      ───────────────────────────────────────────────────────────── */}
      <section className="p-6 sm:p-7 rounded-3xl bg-[#161c28] border border-slate-800/90 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Keamanan & Pengelolaan Data
              </h2>
              <p className="text-xs text-slate-400">
                Ganti kata sandi, ekspor pembukuan, atau atur ulang data
              </p>
            </div>
          </div>
        </div>

        {/* Security & Action Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password Box */}
          <div className="p-4 rounded-2xl bg-[#121722] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-xs mb-1">
                <KeyRound className="w-4 h-4" />
                <span>Kata Sandi Masuk</span>
              </div>
              <p className="text-xs text-slate-400">
                Perbarui kata sandi secara berkala untuk menjaga akun tetap aman.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors cursor-pointer"
            >
              {showPasswordForm ? "Tutup Form Sandi" : "Ubah Kata Sandi"}
            </button>
          </div>

          {/* Export Box */}
          <div className="p-4 rounded-2xl bg-[#121722] border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-xs mb-1">
                <Download className="w-4 h-4" />
                <span>Cadangan Data Transaksi</span>
              </div>
              <p className="text-xs text-slate-400">
                Unduh seluruh data pembukuan Anda dalam format CSV atau JSON.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenExportModal}
              className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Pembukuan</span>
            </button>
          </div>
        </div>

        {/* Expandable Password Change Form */}
        {showPasswordForm && (
          <form onSubmit={handleChangePasswordSubmit} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
            <h4 className="text-xs font-bold text-amber-300">Form Ubah Kata Sandi</h4>
            {passwordError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-800/40">
                {passwordError}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Sandi Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#121722] border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#121722] border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Konfirmasi Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#121722] border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isSubmittingPassword}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmittingPassword ? "Memperbarui..." : "Simpan Kata Sandi Baru"}
              </button>
            </div>
          </form>
        )}

        {/* Danger & Logout Row */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenDeleteTransactions}
            className="w-full sm:w-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Riwayat Transaksi</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER: Info Finusa v2.0
      ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>FINUSA v2.0.0 — 100% Gratis & Open untuk Pembukuan Bisnis</span>
        </div>
        <span>Tersinkron dengan Database Cloud Supabase</span>
      </div>
    </div>
  );
}
