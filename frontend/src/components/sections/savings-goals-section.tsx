'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function SavingsGoalsSection() {
  return (
    <section className="py-24 relative bg-navy-900/30 border-t border-white/5" id="tujuan">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Vision & Checklist */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-semibold">
              <Target className="w-3.5 h-3.5" /> Fitur Target Finansial
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ubah Keinginan Menjadi Rencana Nyata
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Finusa membantumu memecah impian besar menjadi langkah tabungan harian atau mingguan yang ringan, terukur, dan penuh motivasi.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs shrink-0">
                  ✓
                </div>
                <span>Visualisasi progres tabungan realtime &amp; perayaan milestone</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs shrink-0">
                  ✓
                </div>
                <span>Pengingat berkala yang disiplin tanpa rasa cemas</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs shrink-0">
                  ✓
                </div>
                <span>Kalkulasi estimasi target tercapai secara cerdas</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/nabung"
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-white transition-colors group"
              >
                <span>Mulai Atur Target Tabungan</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Interactive Goal Cards Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            
            {/* Goal 1: MacBook Air M3 */}
            <div className="rounded-3xl bg-[#0b1b3e]/90 border border-white/10 p-6 shadow-glass-card hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl border border-blue-500/30 shadow-sm">
                    💻
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">MacBook Air M3</h4>
                    <p className="text-xs text-slate-400">Target: Desember 2026</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 font-mono">
                  65%
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Terkumpul</span>
                  <span className="text-white font-bold font-mono">Rp 9.750.000</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full shadow-[0_0_12px_rgba(0,210,255,0.4)]" 
                    style={{ width: '65%' }} 
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Target: Rp 15.000.000</span>
                  <span className="text-emerald-400 font-medium font-sans">Sedikit lagi! 🚀</span>
                </div>
              </div>
            </div>

            {/* Goal 2: Liburan ke Bali */}
            <div className="rounded-3xl bg-[#0b1b3e]/90 border border-white/10 p-6 shadow-glass-card hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl border border-emerald-500/30 shadow-sm">
                    🏖️
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Liburan ke Bali</h4>
                    <p className="text-xs text-slate-400">Target: November 2026</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
                  70%
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Terkumpul</span>
                  <span className="text-white font-bold font-mono">Rp 4.200.000</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
                    style={{ width: '70%' }} 
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 pt-1 font-mono">
                  <span>Target: Rp 6.000.000</span>
                  <span className="text-emerald-300 font-medium font-sans">Sisa Rp 1.800.000</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default SavingsGoalsSection
