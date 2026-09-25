'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, 
  Check, 
  Camera, 
  Search, 
  Home, 
  Receipt, 
  PiggyBank, 
  BarChart3, 
  Settings, 
  Zap, 
  Sparkles,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react'

export function HeroSection() {
  return (
    <section 
      id="beranda" 
      className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Hero Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left z-20">
            
            {/* AI Pill Announcement Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-cyan-500/30 text-xs sm:text-sm text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(0,210,255,0.15)]"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="font-semibold tracking-wide flex items-center gap-1.5">
                ✦ Finusa AI
              </span>
              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-slate-300 truncate">Scan struk, catat pengeluaran otomatis</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 ml-0.5 shrink-0" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-sans"
            >
              Kelola Keuanganmu <br className="hidden sm:inline" />
              <span className="text-cyan-300">
                Lebih Mudah, Cerdas,
              </span>
              <br />dan Teratur
            </motion.h1>

            {/* Subheading description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Finusa hadir untuk membantumu mengatur pemasukan, pengeluaran, menabung, dan mencapai tujuan finansial — dengan bantuan AI yang siap bekerja untukmu.
            </motion.p>

            {/* Call to Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link 
                href="/auth/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-[0_4px_25px_rgba(22,135,255,0.45)] hover:shadow-[0_4px_35px_rgba(22,135,255,0.65)] active:scale-[0.98] group"
              >
                <span>Mulai Gratis Sekarang</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <button 
                onClick={() => {
                  document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl text-base font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 transition backdrop-blur-sm"
              >
                <span>Lihat Fitur</span>
              </button>
            </motion.div>

            {/* Guarantee Note */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-cyan-300/80 font-medium"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                ✓
              </div>
              <span>100% Gratis Selamanya.</span>
            </motion.div>

          </div>

          {/* Hero Right Column: 3-Layer Interactive Product Showcase */}
          <div className="lg:col-span-6 relative mt-12 lg:mt-0 pr-0 lg:pr-6">
            
            {/* Atmospheric Glow for Mockup */}
            <div className="absolute -top-16 -right-10 w-96 h-96 bg-blue-500/25 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" />
            <div className="absolute -bottom-10 left-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

            {/* Main Desktop Mockup Frame (Layer 1 - Floating Background Plane) */}
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-xl lg:max-w-none"
            >
              <div className="animate-float-dashboard">
                <div className="rounded-2xl bg-navy-900/90 border border-white/15 p-3.5 shadow-glass-card backdrop-blur-2xl transition-all duration-500 hover:border-blue-500/40">
                  
                  {/* Window Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.07] px-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                      <span className="ml-2 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> Finusa Dashboard
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-32 sm:w-36 h-5 bg-navy-950/60 rounded-md border border-white/5 flex items-center px-2 text-[10px] text-slate-400">
                        <Search className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                        <span className="truncate">Cari transaksi...</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 border border-white/20 flex items-center justify-center text-[10px] text-white font-bold">
                        FN
                      </div>
                    </div>
                  </div>

                  {/* Internal Layout: Sidebar + Main Area */}
                  <div className="grid grid-cols-12 gap-3 pt-3">
                    
                    {/* Micro Sidebar */}
                    <div className="hidden sm:block sm:col-span-3 space-y-1 pr-1 border-r border-white/[0.06]">
                      <div className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-semibold flex items-center gap-2 border border-blue-500/20">
                        <Home className="w-3.5 h-3.5" />
                        <span>Beranda</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-2 transition">
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Transaksi</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-2 transition">
                        <PiggyBank className="w-3.5 h-3.5" />
                        <span>Nabung</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-2 transition">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Laporan</span>
                      </div>
                      <div className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-2 transition">
                        <Settings className="w-3.5 h-3.5" />
                        <span>Pengaturan</span>
                      </div>
                    </div>

                    {/* Main Content Viewport */}
                    <div className="col-span-12 sm:col-span-9 space-y-3">
                      
                      {/* Welcome Bar */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            Halo, Pengguna 👋
                          </h4>
                          <p className="text-[11px] text-slate-400">Yuk, atur keuanganmu hari ini!</p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                          Synced Cloud
                        </span>
                      </div>

                      {/* Financial Stats Cards Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        
                        {/* Total Saldo */}
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-900/40 to-navy-900/60 border border-blue-500/30">
                          <p className="text-[10px] font-medium text-slate-400">Total Saldo</p>
                          <p className="text-sm font-bold text-white mt-0.5 tracking-tight font-mono">Rp 3.750.000</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                              <TrendingUp className="w-2.5 h-2.5" /> +12%
                            </span>
                            {/* Sparkline graphic */}
                            <svg className="w-10 h-4 text-emerald-400" fill="none" viewBox="0 0 50 20">
                              <path d="M1 16L12 12L24 15L36 6L49 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                          </div>
                        </div>

                        {/* Pemasukan */}
                        <div className="p-2.5 rounded-xl bg-navy-950/60 border border-white/5">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-slate-400">Pemasukan</p>
                            <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                              <ArrowDownLeft className="w-2.5 h-2.5" />
                            </span>
                          </div>
                          <p className="text-sm font-bold text-white mt-0.5 font-mono">Rp 5.200.000</p>
                          <p className="text-[9px] text-slate-400 mt-1">2 transaksi</p>
                        </div>

                        {/* Pengeluaran */}
                        <div className="p-2.5 rounded-xl bg-navy-950/60 border border-white/5">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-slate-400">Pengeluaran</p>
                            <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px]">
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                          <p className="text-sm font-bold text-white mt-0.5 font-mono">Rp 1.450.000</p>
                          <p className="text-[9px] text-slate-400 mt-1">18 transaksi</p>
                        </div>

                      </div>

                      {/* Charts & Goals Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        
                        {/* Expense Donut Chart Mockup */}
                        <div className="p-3 rounded-xl bg-navy-950/50 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] font-semibold text-slate-200">Pengeluaran Terbanyak</p>
                            <span className="text-[9px] text-blue-400">Bulan ini</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Conic Gradient Donut */}
                            <div 
                              className="relative w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm"
                              style={{ background: 'conic-gradient(#1687ff 0% 35%, #00d2ff 35% 55%, #8b5cf6 55% 70%, #ec4899 70% 80%, #64748b 80% 100%)' }}
                            >
                              <div className="w-9 h-9 rounded-full bg-navy-900 flex items-center justify-center">
                                <span className="text-[8px] font-bold text-slate-300">Total</span>
                              </div>
                            </div>
                            <div className="space-y-1 text-[9px] flex-1">
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Makan &amp; Minum</span>
                                <span className="font-bold">35%</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Transportasi</span>
                                <span className="font-bold">20%</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-300">
                                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Belanja</span>
                                <span className="font-bold">15%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Savings Goal Micro Card */}
                        <div className="p-3 rounded-xl bg-navy-950/50 border border-white/5 flex flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold text-slate-200">Tujuan Nabung</p>
                            <span className="text-[9px] text-blue-400">Lihat Semua →</span>
                          </div>
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                                💻
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="font-semibold text-white">Laptop Baru</span>
                                  <span className="font-bold text-cyan-300">60%</span>
                                </div>
                                <div className="w-full bg-navy-800 rounded-full h-1.5 mt-1 overflow-hidden">
                                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 rounded-full" style={{ width: '60%' }} />
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 font-mono">
                              <span>Target: Rp 5.000.000</span>
                              <span>Sisa: <strong className="text-slate-300">Rp 2.000.000</strong></span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>

            {/* Layer 2: Floating AI Scan Struk Feature Showcase (Foreground Left Float) */}
            <div className="absolute -bottom-8 -left-2 sm:-left-8 z-30 animate-float-card-left pointer-events-auto">
              <div className="w-[280px] sm:w-80 rounded-2xl bg-[#0d1f44]/95 border border-cyan-400/40 p-3.5 shadow-glass-float backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/70 hover:shadow-[0_20px_50px_rgba(0,210,255,0.3)]">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">AI Scan</h5>
                      <p className="text-[9px] text-cyan-300">Scan struk &amp; catat otomatis</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 animate-pulse">Scanning...</span>
                </div>
                
                {/* Camera Viewport with Animated Laser Line */}
                <div className="relative mt-2.5 h-28 sm:h-32 rounded-xl bg-navy-950/80 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
                  {/* Laser Scanning Line */}
                  <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00d2ff,0_0_25px_rgba(0,210,255,0.5)] animate-laser-scan z-20 pointer-events-none" />
                  
                  {/* Receipt Paper Mockup */}
                  <div className="w-36 sm:w-40 bg-white/95 rounded shadow-md p-2 text-[7px] font-mono text-slate-800 rotate-1 transform relative z-10 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-center border-b border-slate-300 pb-0.5">INDOMARET JKT</p>
                      <div className="flex justify-between mt-1 text-slate-600">
                        <span>Roti Gandum</span><span>Rp 18.500</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Susu UHT 1L</span><span>Rp 21.000</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Kopi Botol</span><span>Rp 9.500</span>
                      </div>
                    </div>
                    <div className="border-t border-dashed border-slate-400 pt-0.5 font-bold flex justify-between">
                      <span>TOTAL</span>
                      <span className="text-blue-600">Rp 49.000</span>
                    </div>
                  </div>

                  {/* Corner Viewfinder Markers */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 z-20 animate-pulse" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 z-20 animate-pulse" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 z-20 animate-pulse" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 z-20 animate-pulse" />
                </div>

                {/* Success Alert Chip */}
                <div className="mt-2.5 flex items-center justify-between p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px]">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Struk berhasil dipindai!</span>
                  </div>
                  <span className="text-[9px] text-slate-200 font-bold font-mono">Rp 49.000</span>
                </div>
              </div>
            </div>

            {/* Layer 3: Floating Phone App Card (Foreground Right Float) */}
            <div className="hidden sm:block absolute -top-8 -right-2 lg:-right-4 z-30 animate-float-card-right pointer-events-auto">
              <div className="w-52 sm:w-56 rounded-3xl bg-[#091530] border-2 border-slate-700/80 p-2.5 shadow-glass-float transition-all duration-300 hover:border-blue-500/60 hover:shadow-[0_20px_50px_rgba(37,99,235,0.4)]">
                {/* Phone Bezel Details */}
                <div className="w-16 h-3 bg-navy-950 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900"></div>
                </div>
                
                {/* Mini Mobile App Header */}
                <div className="flex justify-between items-center px-1 pb-2">
                  <span className="text-[9px] font-bold text-white font-mono">09:41</span>
                  <span className="text-[8px] font-semibold text-blue-400">Finusa Mobile</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-1.5 bg-slate-400 rounded-sm"></span>
                    <span className="w-2 h-1.5 bg-slate-400 rounded-sm"></span>
                  </div>
                </div>

                <div className="bg-navy-900/90 rounded-2xl p-2.5 border border-white/5">
                  <p className="text-[9px] text-slate-400">Saldo Utama</p>
                  <p className="text-xs font-bold text-white font-mono">Rp 3.750.000</p>
                  <div className="grid grid-cols-4 gap-1 mt-2 text-center">
                    <div className="p-1 rounded bg-blue-600/20 text-[8px] text-blue-300 font-medium">Scan</div>
                    <div className="p-1 rounded bg-white/5 text-[8px] text-slate-300">+ Catat</div>
                    <div className="p-1 rounded bg-white/5 text-[8px] text-slate-300">Nabung</div>
                    <div className="p-1 rounded bg-white/5 text-[8px] text-slate-300">Target</div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/5 space-y-1.5">
                    <p className="text-[8px] font-bold text-slate-400">Transaksi Terbaru</p>
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="text-white truncate">Indomaret</span>
                      <span className="text-rose-400 font-bold font-mono">-Rp 54.000</span>
                    </div>
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="text-white truncate">Gojek Ride</span>
                      <span className="text-rose-400 font-bold font-mono">-Rp 22.000</span>
                    </div>
                    <div className="flex items-center justify-between text-[8px]">
                      <span className="text-white truncate">Gaji Freelance</span>
                      <span className="text-emerald-400 font-bold font-mono">+Rp 5.000.000</span>
                    </div>
                  </div>
                </div>

                {/* Quick pill for scan */}
                <div className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-1.5 text-center">
                  <span className="text-[9px] font-bold text-white flex items-center justify-center gap-1">
                    <Zap className="w-2.5 h-2.5" /> Scan Struk Otomatis
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
