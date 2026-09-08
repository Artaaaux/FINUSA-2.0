"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignup, useResendVerification } from "@/lib/auth/hooks";
import { GoogleAuthButton } from "@/shared/components/auth/GoogleAuthButton";
import { TurnstileWidget } from "@/shared/components/auth/TurnstileWidget";
import logoImg from "../../../../../public/Assets/Logo.png";

export function SignupForm() {
  const router = useRouter();
  const { signup, loading, error, success } = useSignup();
  const { resend, loading: resendLoading, sent: resendSent, error: resendError } = useResendVerification();
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [isWaitingVerification, setIsWaitingVerification] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation and touched states
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; confirmPassword?: boolean }>({});

  // Password strength state
  const [strength, setStrength] = useState({ score: 0, label: "", color: "" });

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: "", color: "bg-slate-700" });
      return;
    }

    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label = "Sangat Lemah";
    let color = "bg-red-500";

    if (score === 2) {
      label = "Lemah";
      color = "bg-orange-500";
    } else if (score === 3) {
      label = "Sedang";
      color = "bg-yellow-500";
    } else if (score === 4) {
      label = "Kuat";
      color = "bg-green-500";
    } else if (score >= 5) {
      label = "Sangat Kuat";
      color = "bg-accent-cyan";
    }

    setStrength({ score, label, color });
  }, [password]);

  const validateEmail = (val: string) => {
    if (!val) return "Email wajib diisi";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return "Format email tidak valid";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "Password wajib diisi";
    if (val.length < 6) return "Password minimal 6 karakter";
    return "";
  };

  const validateConfirmPassword = (val: string) => {
    if (!val) return "Konfirmasi password wajib diisi";
    if (val !== password) return "Password tidak cocok";
    return "";
  };

  const handleBlur = (field: "email" | "password" | "confirmPassword") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    } else if (field === "password") {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
      // Also validate confirm password if it has value
      if (confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
      }
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
    }
  };

  const handleChange = (field: "email" | "password" | "confirmPassword", value: string) => {
    if (field === "email") {
      setEmail(value);
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      }
    } else if (field === "password") {
      setPassword(value);
      if (touched.password) {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      }
      // Revalidate confirm password if it matches
      if (touched.confirmPassword && confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: value === confirmPassword ? "" : "Password tidak cocok",
        }));
      }
    } else {
      setConfirmPassword(value);
      if (touched.confirmPassword || value === password) {
        setErrors((prev) => ({ ...prev, confirmPassword: value === password ? "" : "Password tidak cocok" }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ email: true, password: true, confirmPassword: true });

    // Validate all fields
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword);

    if (emailErr || passErr || confirmErr) {
      setErrors({ email: emailErr, password: passErr, confirmPassword: confirmErr });
      return;
    }

    try {
      const data = await signup(email, password, captchaToken);
      if (data?.session) {
        setTimeout(() => {
          router.push("/home");
        }, 1200);
      } else {
        setIsWaitingVerification(true);
      }
    } catch {
      // Error is set in signup hook
    }
  };

  if (isWaitingVerification) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#1a1f3a] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.15)] relative overflow-hidden text-center"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-600 via-accent-cyan to-accent-green" />

        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Mail className="w-8 h-8 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Cek Email Anda!</h2>
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          Tautan verifikasi telah dikirimkan ke alamat email:
          <br />
          <span className="font-semibold text-accent-cyan break-all">{email}</span>
        </p>

        <p className="text-slate-400 text-xs mb-6">
          Silakan buka inbox email Anda dan klik tombol <strong>"Aktifkan Akun FINUSA"</strong> untuk memverifikasi akun sebelum bisa masuk ke dashboard.
        </p>

        {resendSent && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            Link verifikasi baru telah berhasil dikirim ulang ke email Anda!
          </div>
        )}
        {resendError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {resendError}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => resend(email)}
            disabled={resendLoading || resendSent}
            className="w-full h-11 flex items-center justify-center font-medium text-sm text-slate-200 bg-[#0F172A] hover:bg-[#1E293B] border border-slate-700/80 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {resendLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {resendSent ? "Email Terkirim Ulang" : "Kirim Ulang Email Verifikasi"}
          </button>

          <Link
            href="/auth/login"
            className="w-full h-11 flex items-center justify-center font-semibold text-white bg-[#2563EB] hover:bg-blue-600 rounded-lg transition-all duration-200 text-sm"
          >
            Sudah Verifikasi? Masuk Sekarang
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
      {/* Visual top border line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-600 via-accent-cyan to-accent-green" />

      {/* Header */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={logoImg.src}
          alt="FINUSA Logo"
          className="h-10 w-auto object-contain mb-3 select-none pointer-events-none"
        />
        <h2 className="text-2xl font-bold text-white text-center">Daftar</h2>
        <p className="text-slate-400 text-sm text-center mt-1">
          Mulai langkah cerdas finansial Anda
        </p>
      </div>

      {/* General error or success messages */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-900/50 flex items-start gap-2 text-red-400 text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-lg bg-green-950/50 border border-green-900/50 flex items-start gap-2 text-accent-green text-xs"
          >
            <Check className="w-4 h-4 shrink-0 mt-0.5 text-accent-green" />
            <div>
              <p className="font-semibold">Pendaftaran Berhasil!</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Mengalihkan ke dashboard...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-slate-300">
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              disabled={loading || success}
              className={`w-full h-11 pl-10 pr-4 bg-[#0F172A] border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200 ${
                errors.email && touched.email
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#1E293B] focus:border-accent-cyan"
              }`}
            />
          </div>
          <AnimatePresence>
            {errors.email && touched.email && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-[#EF4444] flex items-center gap-1 mt-1"
              >
                <span>{errors.email}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-slate-300">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              disabled={loading || success}
              className={`w-full h-11 pl-10 pr-10 bg-[#0F172A] border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200 ${
                errors.password && touched.password
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#1E293B] focus:border-accent-cyan"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator (Visual Indicator V2) */}
          {password && (
            <div className="space-y-1 mt-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Kekuatan Password:</span>
                <span
                  className={`font-semibold ${
                    strength.score <= 2
                      ? "text-red-400"
                      : strength.score === 3
                      ? "text-yellow-400"
                      : "text-accent-green"
                  }`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-full rounded-full transition-all duration-300 ${
                      idx <= strength.score ? strength.color : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {errors.password && touched.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-[#EF4444] flex items-center gap-1 mt-1"
              >
                <span>{errors.password}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-300">
            Konfirmasi Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              disabled={loading || success}
              className={`w-full h-11 pl-10 pr-10 bg-[#0F172A] border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-accent-cyan transition-all duration-200 ${
                errors.confirmPassword && touched.confirmPassword
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#1E293B] focus:border-accent-cyan"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <AnimatePresence>
            {errors.confirmPassword && touched.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-xs text-[#EF4444] flex items-center gap-1 mt-1"
              >
                <span>{errors.confirmPassword}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Anti-Bot Cloudflare Turnstile CAPTCHA */}
        <TurnstileWidget onVerify={(token) => setCaptchaToken(token)} />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full h-11 flex items-center justify-center font-semibold text-white bg-[#2563EB] rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-accent-cyan hover:shadow-[0_0_15px_rgba(0,217,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] mt-6"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Daftar"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#1a1f3a] px-3 text-slate-500 font-medium tracking-wider">
            atau
          </span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <GoogleAuthButton
        label="Daftar dengan Google"
        nextPath="/home"
        disabled={loading || success}
      />

      {/* Footer Link */}
      <div className="mt-6 text-center text-sm text-slate-400">
        Sudah punya akun?{" "}
        <Link
          href="/auth/login"
          className="text-accent-cyan hover:underline font-medium transition-colors duration-200"
        >
          Masuk
        </Link>
      </div>
    </motion.div>
  );
}
