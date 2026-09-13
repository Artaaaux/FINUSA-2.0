"use client";

import React, { useState } from "react";
import { X, KeyRound, Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { SettingsService } from "@/lib/services/settings.service";

interface MobilePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isGoogleOAuth?: boolean;
}

export default function MobilePasswordModal({
  isOpen,
  onClose,
  onSuccess,
  isGoogleOAuth = false,
}: MobilePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "bg-slate-700", text: "text-slate-500" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { level: 1, label: "Lemah", color: "bg-rose-500", text: "text-rose-400" };
    if (score <= 2) return { level: 2, label: "Sedang", color: "bg-amber-500", text: "text-amber-400" };
    return { level: 3, label: "Kuat", color: "bg-emerald-500", text: "text-emerald-400" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword.trim()) {
      setError("Harap masukkan kata sandi saat ini.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("Kata sandi baru tidak boleh sama dengan kata sandi saat ini.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await SettingsService.changePassword(currentPassword, newPassword);
      if (res.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Gagal memperbarui kata sandi.");
      }
    } catch {
      setError("Terjadi kesalahan sistem saat memperbarui kata sandi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#0f141e] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ubah Kata Sandi</h3>
              <p className="text-xs text-slate-400">Perbarui kredensial login akun Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isGoogleOAuth ? (
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">Akun Menggunakan Google Sign-In</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Akun Anda terdaftar dan masuk menggunakan akun Google. FINUSA tidak menyimpan kata sandi terpisah. Anda dapat mengelola keamanan atau kata sandi langsung melalui setelan Akun Google Anda.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi Saat Ini
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:border-amber-500 focus:outline-none placeholder-slate-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Kata Sandi Baru
                </label>
                {newPassword && (
                  <span className={`text-[10px] font-semibold ${passwordStrength.text}`}>
                    Kekuatan: {passwordStrength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:border-amber-500 focus:outline-none placeholder-slate-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter bar */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="grid grid-cols-3 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-colors ${passwordStrength.level >= 1 ? passwordStrength.color : "bg-slate-800"}`} />
                    <div className={`rounded-full transition-colors ${passwordStrength.level >= 2 ? passwordStrength.color : "bg-slate-800"}`} />
                    <div className={`rounded-full transition-colors ${passwordStrength.level >= 3 ? passwordStrength.color : "bg-slate-800"}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Konfirmasi Kata Sandi Baru
                </label>
                {confirmPassword && (
                  <span className={`text-[10px] font-semibold ${newPassword === confirmPassword ? "text-emerald-400" : "text-rose-400"}`}>
                    {newPassword === confirmPassword ? "Cocok" : "Belum cocok"}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:border-amber-500 focus:outline-none placeholder-slate-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checklist Syarat Sandi */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-[11px]">
              <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? "text-emerald-400" : "text-slate-400"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Minimal 8 karakter</span>
              </div>
              <div className={`flex items-center gap-1.5 ${/[a-zA-Z]/.test(newPassword) && /\d/.test(newPassword) ? "text-emerald-400" : "text-slate-400"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Kombinasi huruf & angka</span>
              </div>
              <div className={`flex items-center gap-1.5 ${confirmPassword.length > 0 && newPassword === confirmPassword ? "text-emerald-400" : "text-slate-400"}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Konfirmasi kata sandi cocok</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || newPassword.length < 8 || newPassword !== confirmPassword}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Perbarui Sandi</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
