"use client";

import React, { useState } from "react";
import { 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Check, 
  Loader2 
} from "lucide-react";

interface SecuritySectionProps {
  onChangePasswordSuccess: () => void;
  onChangePassword?: (current: string, next: string) => Promise<{ success: boolean; error?: string }>;
}

export default function SecuritySection({
  onChangePasswordSuccess,
  onChangePassword,
}: SecuritySectionProps) {
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(newPassword);

  const handleChangePassword = async (e: React.FormEvent) => {
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
      } catch (err: unknown) {
        const errorObj = err as Error;
        setPasswordError(errorObj?.message || "Terjadi kesalahan saat memproses pembaruan kata sandi.");
        return;
      } finally {
        setIsSubmittingPassword(false);
      }
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onChangePasswordSuccess();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          Akun & Keamanan
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Lindungi akun Anda dengan kata sandi yang kuat.
        </p>
      </div>

      {/* Password Change Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <KeyRound className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">Ubah Kata Sandi</h3>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3.5 py-2 pr-10 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 pr-10 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength meter bar */}
            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1.5">
                  <div className={`flex-1 rounded-full ${strength >= 1 ? "bg-rose-500" : "bg-slate-800"}`} />
                  <div className={`flex-1 rounded-full ${strength >= 2 ? "bg-amber-500" : "bg-slate-800"}`} />
                  <div className={`flex-1 rounded-full ${strength >= 3 ? "bg-teal-500" : "bg-slate-800"}`} />
                  <div className={`flex-1 rounded-full ${strength >= 4 ? "bg-emerald-500" : "bg-slate-800"}`} />
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  Kekuatan: {strength <= 1 ? "Lemah" : strength === 2 ? "Sedang" : strength === 3 ? "Kuat" : "Sangat Kuat"}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 pr-10 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!currentPassword || !newPassword || !confirmPassword || isSubmittingPassword}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi & Memperbarui...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Perbarui Kata Sandi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
