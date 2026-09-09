"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, AlertCircle, ArrowLeft, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForgotPassword } from "@/lib/auth/hooks";
import { TurnstileWidget } from "@/shared/components/auth/TurnstileWidget";

export function ForgotPasswordForm() {
  const { resetPassword, loading, error, sent, setError } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [captchaResetKey, setCaptchaResetKey] = useState<number>(0);

  const validateEmail = (val: string) => {
    if (!val) return "Email wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Format email tidak valid";
    return "";
  };

  const handleBlur = () => {
    setFieldError(validateEmail(email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const err = validateEmail(email);
    setFieldError(err);
    if (err) return;

    if (!captchaToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError("Silakan tunggu atau selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }

    try {
      await resetPassword(email, captchaToken);
    } catch {
      setCaptchaResetKey((prev) => prev + 1);
      setCaptchaToken("");
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full bg-[#1a1f3a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-600 via-accent-cyan to-accent-green" />

        <div className="flex flex-col items-center py-4">
          <div className="w-14 h-14 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-4">
            <Send className="w-6 h-6 text-accent-cyan" />
          </div>
          <h2 className="text-xl font-bold text-white text-center">Cek Email Anda</h2>
          <p className="text-slate-400 text-sm text-center mt-2 leading-relaxed max-w-xs">
            Kami telah mengirim tautan reset password ke <strong className="text-white">{email}</strong>
          </p>
          <p className="text-slate-500 text-xs text-center mt-3">
            Tidak menerima email? Cek folder spam atau{" "}
            <button
              onClick={() => resetPassword(email)}
              disabled={loading}
              className="text-accent-cyan hover:underline transition-colors disabled:opacity-50 bg-transparent p-0 border-none cursor-pointer text-xs"
            >
              kirim ulang
            </button>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1.5 text-sm text-accent-cyan hover:text-accent-green transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </Link>
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
      <div className="flex flex-col items-center mb-8">
        <img
          src="/Assets/Logo.png"
          alt="FINUSA Logo"
          className="h-10 w-auto object-contain mb-3 select-none pointer-events-none"
        />
        <h2 className="text-2xl font-bold text-white text-center">Lupa Password</h2>
        <p className="text-slate-400 text-sm text-center mt-1">
          Masukkan email Anda untuk mendapatkan tautan reset
        </p>
      </div>

      {/* Error message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-3 rounded-lg bg-red-950/50 border border-red-900/50 flex items-start gap-2 text-red-400 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="reset-email" className="text-xs font-semibold text-slate-300">
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="reset-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldError) setFieldError(validateEmail(e.target.value));
              }}
              onBlur={handleBlur}
              disabled={loading}
              className={`w-full h-11 pl-10 pr-4 bg-[#0F172A] border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200 ${
                fieldError
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#1E293B] focus:border-accent-cyan"
              }`}
            />
          </div>
          <AnimatePresence>
            {fieldError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-[#EF4444] flex items-center gap-1 mt-1"
              >
                <span>{fieldError}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Anti-Bot Cloudflare Turnstile CAPTCHA */}
        <TurnstileWidget
          key={captchaResetKey}
          resetTrigger={captchaResetKey}
          onVerify={(token) => setCaptchaToken(token)}
          onExpire={() => setCaptchaToken("")}
          onError={() => setCaptchaToken("")}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center font-semibold text-white bg-[#2563EB] rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-accent-cyan hover:shadow-[0_0_15px_rgba(0,217,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] mt-4"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Kirim Tautan Reset"
          )}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-accent-cyan hover:text-accent-green transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Login
        </Link>
      </div>
    </motion.div>
  );
}
