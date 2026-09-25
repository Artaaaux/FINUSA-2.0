'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Camera, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function DeepDiveAIScanSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-navy-900/40 border-y border-white/5">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual OCR Breakdown Graphic */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative order-2 lg:order-1"
          >
            <div className="relative max-w-md mx-auto rounded-3xl bg-[#091733] border border-cyan-500/30 p-6 sm:p-7 shadow-glass-card">
              
              {/* Card Header Status */}
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  OCR Engine v2.4 Active
                </span>
                <span className="text-xs text-slate-400 font-mono">Proses &lt; 3s</span>
              </div>

              {/* Realistic Receipt with OCR Boundary Highlights */}
              <div className="rounded-2xl bg-slate-100 text-slate-900 p-5 font-mono text-xs relative overflow-hidden shadow-inner">
                <div className="text-center font-bold text-sm tracking-wider mb-1">
                  SUPERMARKET REJEKI
                </div>
                <div className="text-[10px] text-slate-500 text-center mb-3">
                  23/09/2026 14:32 • ID: #TRX-94821
                </div>

                <div className="space-y-2.5 border-y border-slate-300 py-3">
                  {/* Item 1 */}
                  <div className="flex justify-between items-center relative p-1.5 rounded-lg bg-blue-100/70 border border-blue-400/60 shadow-sm">
                    <span className="font-semibold text-slate-800">Susu Almond 1L</span>
                    <span className="font-bold text-slate-900">Rp 38.500</span>
                    <span className="absolute -right-2 -top-2 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-sans font-semibold">
                      Minuman
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex justify-between items-center relative p-1.5 rounded-lg bg-blue-100/70 border border-blue-400/60 shadow-sm">
                    <span className="font-semibold text-slate-800">Oatmeal Instant 800g</span>
                    <span className="font-bold text-slate-900">Rp 46.000</span>
                    <span className="absolute -right-2 -top-2 bg-blue-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-sans font-semibold">
                      Makanan
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="mt-3.5 flex justify-between items-center text-sm font-extrabold bg-cyan-100/80 p-2 rounded-lg border border-cyan-400 text-blue-950">
                  <span className="font-sans">TOTAL BELANJA</span>
                  <span className="text-blue-700 font-mono">Rp 84.500</span>
                </div>
              </div>

              {/* Real-time Extraction Status Bubble */}
              <div className="mt-4 p-3.5 rounded-xl bg-navy-950/90 border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">Terkonversi Otomatis</p>
                  <p className="text-slate-400 text-[11px]">
                    Masuk ke pos: <strong className="text-cyan-300">Kebutuhan Pokok</strong>
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Feature Description */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Teknologi Finusa AI Struk
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug">
              Tinggalkan Cara Lama.<br />
              <span className="text-cyan-300">
                Scan Struk, Beres dalam 3 Detik.
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              Tidak ada lagi tumpukan kertas struk yang hilang atau lupa dicatat. Finusa AI mendeteksi merchant seperti Indomaret, Alfamart, restoran, SPBU, hingga struk cetak kasir cafe lokal dengan presisi tinggi.
            </p>

            <ul className="space-y-3.5 text-slate-200 text-sm sm:text-base">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </span>
                <span><strong>Ekstraksi Nama Toko &amp; Nominal Presisi:</strong> AI mengenali total harga final, item rincian, dan tanggal transaksi.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </span>
                <span><strong>Auto-Kategorisasi Otomatis:</strong> Langsung dikelompokkan ke pos makanan, transportasi, hobi, atau kebutuhan rumah tangga.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-1">
                  ✓
                </span>
                <span><strong>Bisa dari Foto Galeri / Kamera Langsung:</strong> Ambil foto langsung atau unggah tangkapan layar transaksi e-wallet kamu.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link 
                href="/receipt-scanner"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-glow-blue active:scale-95 duration-200"
              >
                <Camera className="w-4 h-4" />
                <span>Coba AI Scan Sekarang</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default DeepDiveAIScanSection
