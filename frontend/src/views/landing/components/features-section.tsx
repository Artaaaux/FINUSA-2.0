"use client";

import { BookOpen, TrendingUp, Wrench, ArrowRight, Sparkles, Goal, ChartColumn   } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-br from-[#060B1D] via-[#0A1128] to-[#0D0F25] px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Unique BG: diagonal blue radial glow + grid dots */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_30%,rgba(37,99,235,0.08)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_20%_80%,rgba(16,185,129,0.06)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)' }} />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/[0.07] blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-500/[0.05] blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1 text-xs font-semibold tracking-wider text-accent-cyan uppercase">
            FITUR ISTIMEWA
          </div>
          <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Satu tempat untuk belajar, memantau, dan mengatur keuangan
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 leading-relaxed">
            Setiap fitur dirancang untuk membuat pengelolaan keuangan jadi
            sederhana dan bisa dipahami siapa saja.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Card 1: Edukasi Finansial (md:col-span-2) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
            whileHover={shouldReduceMotion ? {} : { y: -6 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-500/25 bg-gradient-to-b from-blue-500/10 to-blue-600/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-blue-400/50 hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)] md:col-span-2"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/15 text-blue-400">
                  <BookOpen size={22} aria-hidden="true" />
                </div>
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-0.5 text-[11px] font-bold tracking-wider text-blue-300">
                  01 . EDUKASI
                </span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Edukasi Finansial</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-400 max-w-md">
                Belajar manage keuangan dengan AI advisor yang siap menjawab pertanyaan finansial kapan saja. Dapatkan saran finansial khusus untuk kebutuhan Anda.
              </p>
            </div>

            {/* Visual Preview: Interactive Chat Bubble Interface */}
            <div className="mt-2 rounded-xl border border-blue-500/15 bg-slate-950/60 p-4 font-sans text-xs text-gray-300 shadow-inner">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-[10px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="font-semibold text-gray-400">Finusa AI Assistant</span>
                </div>
                <span>Baru saja</span>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white border border-slate-700">U</div>
                  <div className="rounded-lg bg-slate-900/80 px-3 py-1.5 text-gray-300 border border-slate-800">
                    Bagaimana cara memulai budget 50-30-20?
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="h-5 w-5 shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Sparkles size={11} className="text-blue-400" />
                  </div>
                  <div className="rounded-lg bg-blue-950/20 px-3 py-1.5 text-gray-300 border border-blue-950/30">
                    Bagi pendapatan bersih menjadi 3 bagian: <strong className="text-blue-300">50% Kebutuhan</strong>, <strong className="text-blue-300">30% Keinginan</strong>, dan <strong className="text-blue-300">20% Tabungan/Investasi</strong>. Mulailah dengan mencatat pengeluaran Anda terlebih dahulu!
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
             <p className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-all duration-200 group-hover:gap-2.5">
                Mulai belajar dengan AI
              </p>
            </div>
          </motion.div>

          {/* Card 2: Monitor & Tracking (md:col-span-1) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.2 }}
            whileHover={shouldReduceMotion ? {} : { y: -6 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-accent-green/25 bg-gradient-to-b from-emerald-500/10 to-emerald-600/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-accent-green/50 hover:shadow-[0_8px_30px_rgba(0,255,136,0.1)] md:col-span-1"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-green/25 bg-accent-green/15 text-accent-green">
                  <TrendingUp size={22} aria-hidden="true" />
                </div>
                <span className="rounded-full border border-accent-green/20 bg-accent-green/10 px-4 py-0.5 text-[11px] font-bold tracking-wider text-accent-green">
                  02 . TRACKING
                </span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Monitor & Tracking</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                Track pengeluaran, kelola budget, dan monitor arus kas harian dengan detail & analytics yang cerdas.
              </p>
            </div>

            {/* Visual Preview: Interactive Budget Progress Card */}
            <div className="mt-2 rounded-xl border border-accent-green/15 bg-slate-950/60 p-4 font-sans text-xs shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Budget Makan & Jajan</span>
                <span className="font-semibold text-accent-green">Rp 120k / Rp 500k</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-accent-green" style={{ width: '24%' }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-white/5 pt-2">
                <span>Sisa Budget: Rp 380k</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">Aman</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-green transition-all duration-200 group-hover:gap-2.5">
                Pantau pengeluaranmu
              </p>
            </div>
          </motion.div>

          {/* Card 3: Tools Lengkap (md:col-span-3) */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.3 }}
            whileHover={shouldReduceMotion ? {} : { y: -6 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-accent-purple/25 bg-gradient-to-b from-violet-500/10 to-violet-600/5 p-8 backdrop-blur-md transition-all duration-300 hover:border-accent-purple/50 hover:shadow-[0_8px_30px_rgba(167,139,250,0.1)] md:col-span-3"
          >
            {/* Inner row layout for split content */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
              <div className="md:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 md:justify-start">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-purple/25 bg-accent-purple/15 text-accent-purple">
                      <Wrench size={22} aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-accent-purple/20 bg-accent-purple/10 px-4 py-0.5 text-[11px] font-bold tracking-wider text-accent-purple md:ml-4">
                      03 . TOOLS
                    </span>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-white">Fitur & Tools Terlengkap</h3>
                  <p className="mb-4 text-sm leading-relaxed text-gray-400">
                    Goals planning, spreadsheets, dan buku kas digital terintegrasi untuk membantu mencapai tujuan finansial Anda.
                  </p>
                </div>

                <div className="mt-auto hidden pt-4 md:block">
                  <p className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-purple transition-all duration-200 group-hover:gap-2.5">
                    Lihat semua modul tools
                  </p>
                </div>
              </div>

              {/* Bento Inner Items (Grid layout inside) */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Savings Goal Preview */}
                <div className="rounded-xl border border-accent-purple/15 bg-slate-950/60 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <span><Goal size={17} className="text-accent-purple" /></span> Target Tabungan
                    </h4>
                    <span className="text-[10px] font-bold text-accent-purple bg-accent-purple/10 border border-accent-purple/20 px-2 py-0.5 rounded-full">
                      75% Selesai
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-2">Beli Laptop Baru (Pelajar &amp; Belajar)</p>
                  <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-accent-purple" style={{ width: '75%' }} />
                  </div>
                  <span className="text-[10px] text-gray-500">Kumpul Rp 6.0M dari Rp 8.0M</span>
                </div>

                {/* Template Spreadsheet */}
                <div className="rounded-xl border border-accent-purple/15 bg-slate-950/60 p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5 mb-2">
                      <span><ChartColumn size={17} className="text-accent-purple" /></span> Template Spreadsheet
                    </h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Download template spreadsheet keuangan, pencatatan kas mandiri, dan format anggaran siap pakai langsung dalam format .xlsx.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[9px] font-medium text-gray-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      Fast Export
                    </span>
                    <span className="text-[9px] font-medium text-gray-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                      Real-time Sync
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 md:hidden">
              <a href="#about" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-purple transition-all duration-200 group-hover:gap-2.5">
                Lihat semua modul tools
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
