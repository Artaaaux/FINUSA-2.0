"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLogin, useGoogleAuth } from "@/lib/auth/hooks";
import { TurnstileWidget } from "@/shared/components/auth/TurnstileWidget";

export function LoginForm() {
  const router = useRouter();
  const { login, loading, error, success, setError } = useLogin();
  const {
    signInWithGoogle,
    loading: googleLoading,
    error: googleError,
  } = useGoogleAuth();

  const [urlErrorMsg, setUrlErrorMsg] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [captchaResetKey, setCaptchaResetKey] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const errParam = params.get("error");
      if (errParam) {
        if (errParam === "auth_callback_failed" || errParam === "Auth failed") {
          setUrlErrorMsg("Autentikasi Google gagal atau dibatalkan. Silakan coba lagi.");
        } else {
          setUrlErrorMsg(errParam);
        }
      }
    }
  }, []);

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

    if (!captchaToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      setError("Silakan tunggu atau selesaikan verifikasi CAPTCHA terlebih dahulu.");
      return;
    }

    setUrlErrorMsg(null);

    try {
      await login(email, password, captchaToken);
      // Wait a brief moment to show success state, then redirect
      setTimeout(() => {
        router.push("/home");
      }, 800);
    } catch {
      // Error handled by hook, displayed in UI
      setCaptchaResetKey((prev) => prev + 1);
      setCaptchaToken("");
    }
  };

  const handleGoogleSignIn = async () => {
    setUrlErrorMsg(null);
    try {
      await signInWithGoogle("/home");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal masuk dengan Google";
      setUrlErrorMsg(msg);
    }
  };

  const activeErrorMessage = error || urlErrorMsg || googleError;

  return (
    <div className="relative min-h-screen w-full bg-[#070B1D] font-sans text-slate-100 antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-white flex flex-col justify-between">
      {/* ───── Ambient Background And Lighting Effects ───── */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep midnight angular background gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050814] via-[#0B1530] to-[#0A1D3B] opacity-95" />

        {/* Right Side: Architectural luminous ambient orbs and bokeh behind login card */}
        <div className="absolute right-0 top-0 w-3/5 h-full bg-gradient-to-l from-[#132A55]/30 via-transparent to-transparent" />
        <div className="absolute -right-24 top-1/4 w-[540px] h-[540px] bg-[#1687FF]/20 rounded-full blur-[120px]" />

        {/* Vibrant cyan & royal blue orb positioned directly behind the frosted login card for refraction */}
        <div className="absolute right-[8%] top-[22%] w-[480px] h-[480px] bg-gradient-to-br from-[#19D3FF]/30 to-[#2463F4]/35 rounded-full blur-[95px]" />
        <div className="absolute right-[15%] top-[45%] w-[380px] h-[380px] bg-[#00E5FF]/20 rounded-full blur-[80px]" />

        {/* Lower-left soft ambient pool */}
        <div className="absolute -left-20 bottom-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#1687FF]/20 via-[#0B1A3C]/40 to-transparent rounded-full blur-[120px]" />

        {/* Specular 3D Curved Glass Ribbon Geometry (Lower Left) */}
        <div className="absolute -left-24 -bottom-36 w-[640px] h-[640px] opacity-75 md:opacity-90 transition-opacity pointer-events-none">
          <svg
            className="w-full h-full ribbon-gradient-edge"
            fill="none"
            viewBox="0 0 600 600"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-40,550 C120,480 230,360 210,180 C200,90 140,40 50,70 C-30,100 -50,220 20,340 C90,460 280,520 490,490"
              filter="blur(16px)"
              opacity="0.3"
              stroke="url(#ambientGlassGrad)"
              strokeLinecap="round"
              strokeWidth="48"
            />
            <path
              d="M-30,530 C130,470 240,350 220,190 C210,105 150,55 70,82 C-5,110 -30,220 35,335 C105,445 285,505 480,480"
              stroke="url(#specularRibbonGrad)"
              strokeLinecap="round"
              strokeWidth="18"
            />
            <path
              d="M-20,525 C135,465 242,345 222,192 C214,112 156,65 80,90 C10,118 -15,222 45,332 C112,440 288,498 475,475"
              opacity="0.9"
              stroke="url(#sharpHighlightGrad)"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <defs>
              <linearGradient id="ambientGlassGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#19D3FF" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#2463F4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0B1530" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="specularRibbonGrad" x1="20%" x2="80%" y1="10%" y2="90%">
                <stop offset="0%" stopColor="#AEEBFF" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#28C8F5" stopOpacity="0.4" />
                <stop offset="70%" stopColor="#1687FF" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#5599FF" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="sharpHighlightGrad" x1="10%" x2="90%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#9EEBFF" stopOpacity="0.75" />
                <stop offset="80%" stopColor="#32B5FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Floating Home / Back Button */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-12 pt-5 sm:pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 border border-white/10 text-slate-300 hover:text-white hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-md text-xs sm:text-sm group shadow-sm hover:shadow-[0_0_15px_rgba(25,211,255,0.2)]"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-cyan-400" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* ───── Main Content Wrapper ───── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* ───── Left Hero Section ───── */}
          <section
            className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:space-y-9 lg:pr-6"
            data-purpose="hero-brand-presentation"
          >
            {/* Brand Identity: Interconnected ribbon logo */}
            <header className="flex items-center space-x-3.5">
              <div aria-hidden="true" className="relative w-11 h-11 flex-shrink-0">
                <svg
                  className="w-full h-full drop-shadow-[0_2px_12px_rgba(25,211,255,0.45)]"
                  fill="none"
                  viewBox="0 0 44 44"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 11C7 8.79086 8.79086 7 11 7H33C35.2091 7 37 8.79086 37 11V15C37 17.2091 35.2091 19 33 19H17V33C17 35.2091 15.2091 37 13 37H11C8.79086 37 7 35.2091 7 33V11Z"
                    fill="url(#finusaMarkGrad1)"
                  />
                  <path
                    d="M19 21H29C31.2091 21 33 22.7909 33 25V27C33 29.2091 31.2091 31 29 31H19V21Z"
                    fill="url(#finusaMarkGrad2)"
                  />
                  <path
                    d="M25 35L34 26C35.5 24.5 37 25.5 37 27.5V35C37 36.1 36.1 37 35 37H27C25.5 37 24.5 35.8 25 35Z"
                    fill="#19D3FF"
                  />
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="finusaMarkGrad1"
                      x1="7"
                      x2="37"
                      y1="7"
                      y2="37"
                    >
                      <stop stopColor="#19D3FF" />
                      <stop offset="1" stopColor="#1687FF" />
                    </linearGradient>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="finusaMarkGrad2"
                      x1="19"
                      x2="33"
                      y1="21"
                      y2="31"
                    >
                      <stop stopColor="#28C8F5" />
                      <stop offset="1" stopColor="#2463F4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-white leading-none">
                  FINUSA
                </span>
                <span className="text-[9px] font-semibold tracking-[0.26em] text-[#86A3CF] uppercase mt-1">
                  Finance Indonesia USA
                </span>
              </div>
            </header>

            {/* Main Headline & Narrative Copy */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.18]">
                Selamat Datang
                <br />
                di <span className="text-gradient-cyan">FINUSA</span>
              </h1>
              <p className="text-[#B7C5DC] text-base sm:text-lg max-w-[460px] leading-relaxed">
                Kelola finansial Anda dengan lebih mudah, aman dan terpercaya.
              </p>
            </div>

            {/* 3 Feature Highlight Pills */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-2 max-w-[500px]"
              data-purpose="features-list"
            >
              {/* Feature Item 1: Aman */}
              <div className="apple-glass-pill rounded-2xl p-3.5 sm:p-4 flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5 transition-transform hover:-translate-y-1 duration-200">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shadow-sm shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold tracking-wide">Aman</h3>
                  <p className="text-[12px] text-[#8EA2C6] leading-snug mt-0.5">
                    Data Anda terlindungi
                  </p>
                </div>
              </div>

              {/* Feature Item 2: Cepat */}
              <div className="apple-glass-pill rounded-2xl p-3.5 sm:p-4 flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5 transition-transform hover:-translate-y-1 duration-200">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shadow-sm shrink-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold tracking-wide">Cepat</h3>
                  <p className="text-[12px] text-[#8EA2C6] leading-snug mt-0.5">
                    Transaksi lebih efisien
                  </p>
                </div>
              </div>

              {/* Feature Item 3: Mudah */}
              <div className="apple-glass-pill rounded-2xl p-3.5 sm:p-4 flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-2.5 transition-transform hover:-translate-y-1 duration-200">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/25 flex items-center justify-center text-cyan-400 shadow-sm shrink-0">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold tracking-wide">Mudah</h3>
                  <p className="text-[12px] text-[#8EA2C6] leading-snug mt-0.5">
                    Pantau keuangan dalam satu tempat
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ───── Right Login Card Section ───── */}
          <section
            className="lg:col-span-6 flex justify-center lg:justify-end"
            data-purpose="login-form-container"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full max-w-[500px] apple-glass-card rounded-[28px] p-7 sm:p-10 relative overflow-hidden"
            >
              {/* Card Interior Top Header with FINUSA Crest */}
              <div className="flex flex-col items-center text-center">
                <div
                  aria-label="FINUSA Logo"
                  className="flex items-center space-x-2.5 mb-4 sm:mb-5"
                >
                  <svg
                    className="w-9 h-9 drop-shadow-[0_2px_10px_rgba(25,211,255,0.4)]"
                    fill="none"
                    viewBox="0 0 44 44"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 11C7 8.79086 8.79086 7 11 7H33C35.2091 7 37 8.79086 37 11V15C37 17.2091 35.2091 19 33 19H17V33C17 35.2091 15.2091 37 13 37H11C8.79086 37 7 35.2091 7 33V11Z"
                      fill="url(#cardLogoGrad1)"
                    />
                    <path
                      d="M19 21H29C31.2091 21 33 22.7909 33 25V27C33 29.2091 31.2091 31 29 31H19V21Z"
                      fill="url(#cardLogoGrad2)"
                    />
                    <path
                      d="M25 35L34 26C35.5 24.5 37 25.5 37 27.5V35C37 36.1 36.1 37 35 37H27C25.5 37 24.5 35.8 25 35Z"
                      fill="#19D3FF"
                    />
                    <defs>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="cardLogoGrad1"
                        x1="7"
                        x2="37"
                        y1="7"
                        y2="37"
                      >
                        <stop stopColor="#19D3FF" />
                        <stop offset="1" stopColor="#1687FF" />
                      </linearGradient>
                      <linearGradient
                        gradientUnits="userSpaceOnUse"
                        id="cardLogoGrad2"
                        x1="19"
                        x2="33"
                        y1="21"
                        y2="31"
                      >
                        <stop stopColor="#28C8F5" />
                        <stop offset="1" stopColor="#2463F4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-left">
                    <span className="text-xl font-bold tracking-tight text-white leading-none block">
                      FINUSA
                    </span>
                    <span className="text-[8px] font-semibold tracking-[0.22em] text-[#86A3CF] uppercase block mt-0.5">
                      FINANCE INDONESIA USA
                    </span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h2 className="text-[28px] sm:text-[32px] font-bold text-white tracking-tight">
                  Masuk
                </h2>
                <p className="text-sm text-[#C2CEE2] mt-1.5 font-normal">
                  Kelola finansial Anda dengan FINUSA
                </p>
              </div>

              {/* Login Alerts (Success & Fail feedback) */}
              <AnimatePresence mode="wait">
                {activeErrorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="mt-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-xs text-rose-300 shadow-sm backdrop-blur-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-rose-400 uppercase tracking-wider">
                        Gagal
                      </p>
                      <p className="text-slate-200 text-xs mt-0.5 leading-relaxed">
                        {activeErrorMessage.toLowerCase().includes("email not confirmed")
                          ? "Email Anda belum dikonfirmasi. Silakan periksa inbox email Anda untuk mengaktifkan akun."
                          : activeErrorMessage}
                      </p>
                    </div>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="mt-5 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 shadow-sm backdrop-blur-md"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                        Berhasil
                      </p>
                      <p className="text-slate-200 text-xs mt-0.5">
                        Masuk berhasil! Mengalihkan ke dashboard...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interactive Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" id="loginForm">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="emailInput"
                    className="block text-[13px] font-semibold text-[#E5ECF8]"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8EA2C6]">
                      <Mail className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <input
                      id="emailInput"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      disabled={loading || success}
                      required
                      className={`apple-glass-input w-full h-13 sm:h-14 pl-12 pr-4 rounded-2xl text-white placeholder-[#6E82A5] text-[15px] focus:outline-none transition-all duration-200 ${
                        errors.email && touched.email
                          ? "border-rose-500 focus:border-rose-500"
                          : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {errors.email && touched.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium pl-1"
                      >
                        <span>{errors.email}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="passwordInput"
                      className="block text-[13px] font-semibold text-[#E5ECF8]"
                    >
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-[13px] font-medium text-[#28C8F5] hover:text-[#5ce0ff] transition-colors hover:underline"
                    >
                      Lupa Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8EA2C6]">
                      <Lock className="w-5 h-5" strokeWidth={1.8} />
                    </div>
                    <input
                      id="passwordInput"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      disabled={loading || success}
                      required
                      className={`apple-glass-input w-full h-13 sm:h-14 pl-12 pr-12 rounded-2xl text-white placeholder-[#6E82A5] text-[15px] focus:outline-none transition-all duration-200 ${
                        errors.password && touched.password
                          ? "border-rose-500 focus:border-rose-500"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      id="togglePasswordBtn"
                      aria-label="Tampilkan atau sembunyikan password"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading || success}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8EA2C6] hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" strokeWidth={1.8} />
                      ) : (
                        <Eye className="w-5 h-5" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {errors.password && touched.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-rose-400 flex items-center gap-1 mt-1 font-medium pl-1"
                      >
                        <span>{errors.password}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cloudflare Turnstile Anti-Bot Widget */}
                <TurnstileWidget
                  key={captchaResetKey}
                  resetTrigger={captchaResetKey}
                  onVerify={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken("")}
                  onError={() => setCaptchaToken("")}
                />

                {/* Primary Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="btn-gradient-primary w-full h-[54px] sm:h-[56px] rounded-2xl flex items-center justify-center space-x-2 text-white font-bold text-[16px] shadow-btn-glow cursor-pointer transition duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk</span>
                        <ArrowRight className="w-5 h-5 stroke-[2.2]" />
                      </>
                    )}
                  </button>
                </div>

                {/* OR Divider */}
                <div className="relative py-3 flex items-center justify-center">
                  <div className="w-full border-t border-slate-400/20" />
                  <span className="absolute bg-[#0D1C3C]/80 border border-white/10 px-3.5 py-0.5 text-[11px] font-semibold tracking-wider text-[#A6BCD9] uppercase backdrop-blur-md rounded-full shadow-sm">
                    ATAU
                  </span>
                </div>

                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading || success || googleLoading}
                  className="apple-glass-btn-secondary w-full h-[52px] sm:h-[54px] rounded-2xl flex items-center justify-center space-x-3 text-slate-100 font-medium text-[15px] cursor-pointer group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                      <span>Menghubungkan ke Google...</span>
                    </>
                  ) : (
                    <>
                      {/* Full color SVG Google Logo */}
                      <svg
                        className="w-5 h-5 shrink-0"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="group-hover:text-white transition-colors">
                        Lanjutkan dengan Google
                      </span>
                    </>
                  )}
                </button>

                {/* Bottom Registration Prompt */}
                <div className="text-center pt-3 pb-1">
                  <p className="text-[14px] text-[#A6BCD9]">
                    Belum punya akun?
                    <Link
                      href="/auth/signup"
                      className="text-[#27C9F4] font-semibold hover:underline hover:text-[#5ce0ff] transition-colors ml-1.5"
                    >
                      Daftar
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </section>
        </div>
      </main>

      {/* ───── Subtle Footer ───── */}
      <footer className="relative z-10 py-5 text-center text-xs text-[#6B82A8] pointer-events-none">
        © {new Date().getFullYear()} FINUSA. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
}
