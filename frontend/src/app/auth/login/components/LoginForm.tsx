"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin } from "@/lib/auth/hooks";
import logoImg from "../../../../../public/Assets/Logo.png";

export function LoginForm() {
  const router = useRouter();
  const { login, loading, error, success } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Field validation and touched states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

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

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      const emailErr = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: emailErr }));
    } else {
      const passErr = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: passErr }));
    }
  };

  const handleChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
      if (touched.email) {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      }
    } else {
      setPassword(value);
      if (touched.password) {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({ email: true, password: true });

    // Validate both
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    try {
      await login(email, password);
      // Wait a brief moment to show success state, then redirect
      setTimeout(() => {
        router.push("/home");
      }, 800);
    } catch {
      // Error handled by hook, displayed in UI
    }
  };

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
      <div className="flex flex-col items-center mb-8">
        <img
          src={logoImg.src}
          alt="FINUSA Logo"
          className="h-10 w-auto object-contain mb-3 select-none pointer-events-none"
        />
        <h2 className="text-2xl font-bold text-white text-center">Masuk</h2>
        <p className="text-slate-400 text-sm text-center mt-1">
          Kelola finansial Anda dengan FINUSA
        </p>
      </div>

      {/* General error message */}
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
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-3 rounded-lg bg-green-950/50 border border-green-900/50 flex items-start gap-2 text-accent-green text-xs"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-accent-green" />
            <span>Masuk berhasil! Mengalihkan ke dashboard...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-accent-cyan hover:text-accent-green transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
            >
              Lupa Password?
            </Link>
          </div>
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full h-11 flex items-center justify-center font-semibold text-white bg-[#2563EB] rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-accent-cyan hover:shadow-[0_0_15px_rgba(0,217,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-6 text-center text-sm text-slate-400">
        Belum punya akun?{" "}
        <Link
          href="/auth/signup"
          className="text-accent-cyan  hover:underline font-medium transition-colors duration-200"
        >
          Daftar
        </Link>
      </div>
    </motion.div>
  );
}
