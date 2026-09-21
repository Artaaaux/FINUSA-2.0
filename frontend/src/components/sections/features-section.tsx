"use client"

import React from 'react'
import { ScanLine, TrendingUp, Wrench, ArrowRight, Goal, ChartColumn } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

export function FeaturesSection() {
  const shouldReduceMotion = useReducedMotion()

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <section id="features" className="relative py-24 bg-bg-dark overflow-hidden text-slate-200">
      {/* Background with single subtle radial gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.05),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 80%)' }} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-16 md:mb-24 max-w-2xl">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Tiga pilar pengelolaan keuangan
          </motion.h2>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={cardVariants}
            className="text-lg text-slate-400"
          >
            Dari mencatat pengeluaran otomatis hingga mencapai target impianmu. Semua dalam satu ekosistem yang rapi dan terukur.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Scan Struk AI */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-slate-700/30 bg-slate-900/50 backdrop-blur-sm hover:-translate-y-1 hover:border-slate-600/50 transition-all duration-300"
          >
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <ScanLine className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-blue-400 uppercase">Pilar 01</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Scan Struk AI</h3>
              <p className="text-slate-400 mb-8 max-w-md">
                Teknologi OCR canggih untuk mengubah struk belanjamu menjadi data terstruktur dalam hitungan detik. Bebas ribet input manual.
              </p>
              
              <div className="mt-auto bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-slate-300">Hasil Scan Terakhir</span>
                  <span className="text-blue-400 text-xs">Otomatis Terkategori</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-sm">Kopi Senja</span>
                    </div>
                    <span className="text-sm font-medium font-mono">Rp 35.000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm">Supermarket</span>
                    </div>
                    <span className="text-sm font-medium font-mono">Rp 120.000</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Monitor Arus Kas */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="md:col-span-1 group relative overflow-hidden rounded-2xl border border-slate-700/30 bg-slate-900/50 backdrop-blur-sm hover:-translate-y-1 hover:border-slate-600/50 transition-all duration-300"
          >
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold tracking-wider text-green-400 uppercase">Pilar 02</span>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Monitor Arus Kas</h3>
              <p className="text-slate-400 mb-8">
                Visualisasi jernih untuk tahu persis kemana uangmu mengalir setiap bulannya.
              </p>
              
              <div className="mt-auto space-y-4 bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">Anggaran Makan</span>
                    <span className="text-slate-300">75%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">Transportasi</span>
                    <span className="text-slate-300">40%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Target Tabungan & Template */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={cardVariants}
            className="md:col-span-3 group relative overflow-hidden rounded-2xl border border-slate-700/30 bg-slate-900/50 backdrop-blur-sm hover:-translate-y-1 hover:border-slate-600/50 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row h-full">
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Goal className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">Pilar 03</span>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Target Tabungan & Template</h3>
                <p className="text-slate-400 mb-6">
                  Rencanakan masa depan dengan fitur target tabungan dan akses puluhan template gratis untuk manajemen aset, hutang, hingga portofolio investasi.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-400 font-medium cursor-pointer group-hover:text-purple-300 transition-colors">
                  Eksplorasi Template <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              
              <div className="p-8 md:w-1/2 bg-slate-950/30 flex items-center justify-center">
                <div className="w-full max-w-sm space-y-3">
                  {/* Goal Preview */}
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <ChartColumn className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-white">Dana Darurat</span>
                        <span className="text-xs text-slate-400">Rp 10Jt</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  {/* Template Info */}
                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800/50 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-white">Template Budget 50/30/20</span>
                      <span className="block text-xs text-slate-400">Format Notion & Excel</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
