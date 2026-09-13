"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/auth/supabase";

export function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const err = params.get("error_description") || params.get("error");

      if (err) {
        setError(err);
      } else if (code) {
        supabase.auth.exchangeCodeForSession(code).catch((e) => {
          console.error("Code exchange failed:", e);
        });
      }
    }
  }, []);

  // Password Strength Calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: "", color: "bg-slate-700" };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: "Lemah", color: "bg-red-500" };
    if (score <= 3) return { score: 2, label: "Sedang", color: "bg-amber-500" };
    return { score: 3, label: "Kuat", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  // Validation criteria
  const isMinLength = password.length >= 8;
  const hasLetterAndNumber = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const isMatching = password !== "" && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isMinLength) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (!hasLetterAndNumber) {
      setError("Password harus mengombinasikan huruf dan angka.");
      return;
    }

    if (!isMatching) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
    } catch (err: unknown) {
      console.error("Reset password error:", err);
      if (err && typeof err === "object" && "message" in err) {
        const msg = (err as { message: string }).message;
        if (msg.includes("same password") || msg.includes("different")) {
          setError("Password baru tidak boleh sama dengan password lama.");
        } else {
          setError(msg || "Gagal memperbarui password. Silakan minta tautan reset baru.");
        }
      } else {
        setError("Gagal memperbarui password. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#1a1f3a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-accent-cyan to-blue-600" />

        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Password Berhasil Diubah!</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xs leading-relaxed">
            Kata sandi akun FINUSA Anda telah diperbarui. Silakan masuk ke dashboard untuk melanjutkan.
          </p>

          <button
            onClick={() => router.push("/home")}
            className="w-full h-11 flex items-center justify-center gap-2 font-semibold text-white bg-blue-600 rounded-lg transition-all duration-300 hover:bg-blue-500 shadow-lg shadow-blue-500/25 mt-6 cursor-pointer"
          >
            <span>Masuk ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-[#1a1f3a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-600 via-accent-cyan to-accent-green" />

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/Assets/Logo.png"
          alt="FINUSA Logo"
          className="h-10 w-auto object-contain mb-3 select-none pointer-events-none"
        />
        <h2 className="text-2xl font-bold text-white text-center">Buat Password Baru</h2>
        <p className="text-slate-400 text-sm text-center mt-1">
          Masukkan kata sandi baru untuk akun Anda
        </p>
      </div>

      {/* Error display */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-3.5 rounded-lg bg-red-950/50 border border-red-900/50 flex items-start gap-2 text-red-400 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Baru */}
        <div className="space-y-1.5">
          <label htmlFor="new-password" className="text-xs font-semibold text-slate-300">
            Password Baru
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full h-11 pl-10 pr-10 bg-[#0F172A] border border-[#1E293B] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength Bar */}
          {password && (
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">Kekuatan Password:</span>
                <span
                  className={
                    strength.score === 1
                      ? "text-red-400 font-semibold"
                      : strength.score === 2
                      ? "text-amber-400 font-semibold"
                      : "text-emerald-400 font-semibold"
                  }
                >
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength.score >= 1 ? strength.color : "bg-transparent"
                  } w-1/3`}
                />
                <div
                  className={`h-full transition-all duration-300 ${
                    strength.score >= 2 ? strength.color : "bg-transparent"
                  } w-1/3`}
                />
                <div
                  className={`h-full transition-all duration-300 ${
                    strength.score >= 3 ? strength.color : "bg-transparent"
                  } w-1/3`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Konfirmasi Password Baru */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="text-xs font-semibold text-slate-300">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full h-11 pl-10 pr-10 bg-[#0F172A] border border-[#1E293B] rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-800/80 space-y-1.5 text-xs text-slate-400 my-3">
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${isMinLength ? "text-emerald-400" : "text-slate-600"}`}
            />
            <span className={isMinLength ? "text-slate-200" : "text-slate-400"}>
              Minimal 8 karakter
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${
                hasLetterAndNumber ? "text-emerald-400" : "text-slate-600"
              }`}
            />
            <span className={hasLetterAndNumber ? "text-slate-200" : "text-slate-400"}>
              Kombinasi huruf & angka
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2
              className={`w-3.5 h-3.5 ${isMatching ? "text-emerald-400" : "text-slate-600"}`}
            />
            <span className={isMatching ? "text-slate-200" : "text-slate-400"}>
              Konfirmasi password cocok
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isMinLength || !hasLetterAndNumber || !isMatching}
          className="w-full h-11 flex items-center justify-center font-semibold text-white bg-[#2563EB] rounded-lg transition-all duration-300 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] mt-4 cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Password Baru"}
        </button>
      </form>
    </motion.div>
  );
}
