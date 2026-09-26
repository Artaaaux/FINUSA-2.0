'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Store, 
  Calendar, 
  ShoppingBag, 
  Clock, 
  Tag, 
  Check
} from 'lucide-react'
import Link from 'next/link'

export function DeepDiveAIScanSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-navy-950/80 border-y border-slate-800/60 section-deferred" id="ai-scan">
      
      {/* Ambient Radial Lighting Effects (GPU Accelerated) */}
      <div 
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.16) 0%, rgba(37, 99, 235, 0.06) 45%, rgba(37, 99, 235, 0) 70%)',
          transform: 'translateZ(0)',
        }}
      />
      <div 
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.11) 0%, rgba(6, 182, 212, 0.04) 40%, rgba(6, 182, 212, 0) 70%)',
          transform: 'translateZ(0)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Visual Presentation of Finusa AI OCR Receipt Scanner */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative flex justify-center items-center"
          >
            {/* Outer Scanning Enclosure */}
            <div className="w-full max-w-[620px] rounded-[32px] p-4 sm:p-7 relative border border-cyan-400/25 bg-[#0a1830]/60 backdrop-blur-xl shadow-2xl">
              
              {/* Scanner Enclosure Header */}
              <div className="flex items-center justify-between mb-6 px-1">
                {/* Left: AI Vision OCR Indicator */}
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs sm:text-sm tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>AI VISION OCR</span>
                </div>

                {/* Right: Status Pill */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1e3d]/80 border border-cyan-400/20 text-cyan-300 text-xs font-medium backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Memindai...</span>
                </div>
              </div>

              {/* Receipt & Scanning Stage */}
              <div className="relative flex justify-center py-2 sm:py-3">
                
                {/* Scanning Laser Beam (Compositor GPU translate3d) */}
                <div className="absolute top-[8px] left-3 right-3 sm:left-6 sm:right-6 z-30 pointer-events-none animate-laser-scan-deep flex items-center justify-center">
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-85 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                  <div className="absolute w-16 h-2 bg-cyan-300/25 blur-[3px] rounded-full pointer-events-none" />
                </div>

                {/* Thermal Paper Receipt Container */}
                <div className="relative w-full max-w-[340px] sm:max-w-[360px] bg-white rounded-t-sm text-slate-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-[13px] select-none">
                  
                  {/* Receipt Content */}
                  <div className="p-6 pb-4">
                    
                    {/* Merchant Header */}
                    <div className="text-center pb-3.5 border-b border-dashed border-slate-300">
                      <div className="flex justify-center items-center gap-1.5 font-bold text-slate-900 text-base sm:text-lg tracking-wide uppercase">
                        <Store className="w-4 h-4 text-slate-700" />
                        <span>MINIMARKET</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
                        Jl. Melati No. 12, Jakarta Pusat
                      </p>
                      <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-slate-400 mt-2 font-sans font-medium">
                        <span>26/09/2026 14:32:17</span>
                        <span>#TRX-94821</span>
                      </div>
                    </div>

                    {/* Purchased Items */}
                    <div className="py-3.5 space-y-2.5 border-b border-dashed border-slate-300">
                      <div className="flex justify-between items-baseline font-medium text-slate-700">
                        <span>Susu Almond 1L</span>
                        <span className="text-slate-900 font-semibold tracking-tight">Rp 38.500</span>
                      </div>
                      <div className="flex justify-between items-baseline font-medium text-slate-700">
                        <span>Oatmeal Instant 800g</span>
                        <span className="text-slate-900 font-semibold tracking-tight">Rp 46.000</span>
                      </div>
                      <div className="flex justify-between items-baseline font-medium text-slate-700">
                        <span>Roti Gandum Utuh</span>
                        <span className="text-slate-900 font-semibold tracking-tight">Rp 22.000</span>
                      </div>
                    </div>

                    {/* Calculations */}
                    <div className="py-3 space-y-1.5 text-[11px] text-slate-500 border-b border-dashed border-slate-300">
                      <div className="flex justify-between">
                        <span>SUBTOTAL</span>
                        <span className="font-medium text-slate-800">Rp 106.500</span>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span>PPN (11% TERMASUK)</span>
                        <span>Rp 10.554</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="py-3.5 flex justify-between items-center text-sm font-bold text-slate-950">
                      <span className="tracking-tight uppercase font-sans">TOTAL BELANJA</span>
                      <span className="text-blue-900 font-extrabold text-base sm:text-lg">Rp 106.500</span>
                    </div>

                    {/* Barcode Graphic */}
                    <div className="pt-2 text-center">
                      <div className="h-8 w-full max-w-[220px] mx-auto flex justify-between items-stretch">
                        {[2,1,3,0,2,1,4,0,2,1,3,1,2,0,3,1,4,2].map((w, i) => (
                          <span 
                            key={i} 
                            className={w === 0 ? "w-[1.5px] bg-transparent" : "bg-slate-900"} 
                            style={{ width: w > 0 ? `${w}px` : undefined }} 
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 font-sans">
                        Terima kasih telah berbelanja di Minimarket. <span className="text-slate-600 font-medium">#BelanjaHemat</span>
                      </p>
                    </div>

                  </div>

                  {/* Perforated Receipt Bottom Edge */}
                  <div className="w-full overflow-hidden leading-none -mt-[1px]">
                    <svg 
                      className="w-full h-2.5 text-white fill-current" 
                      viewBox="0 0 360 8" 
                      preserveAspectRatio="none"
                    >
                      <path d="M0 0 L10 8 L20 0 L30 8 L40 0 L50 8 L60 0 L70 8 L80 0 L90 8 L100 0 L110 8 L120 0 L130 8 L140 0 L150 8 L160 0 L170 8 L180 0 L190 8 L200 0 L210 8 L220 0 L230 8 L240 0 L250 8 L260 0 L270 8 L280 0 L290 8 L300 0 L310 8 L320 0 L330 8 L340 0 L350 8 L360 0 L360 0 L0 0 Z" />
                    </svg>
                  </div>

                </div>

                {/* Optical Corner Guides for Scanner Frame */}
                <div className="absolute top-1 left-2 sm:left-8 w-6 h-6 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute top-1 right-2 sm:right-8 w-6 h-6 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-1 left-2 sm:left-8 w-6 h-6 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
                <div className="absolute bottom-1 right-2 sm:right-8 w-6 h-6 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              </div>

              {/* Left Floating Detected Entities (Anchor Overlays) */}
              <div className="hidden sm:flex flex-col gap-3 absolute -left-7 top-14 z-20">
                {/* Item 1: Store */}
                <div className="bg-[#0b1b36]/90 border border-cyan-400/25 backdrop-blur-md shadow-xl py-2.5 px-3.5 rounded-2xl flex items-center gap-3 hover:translate-x-1 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="text-left pr-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Toko</div>
                    <div className="text-xs font-semibold text-white">Minimarket</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Item 2: Date */}
                <div className="bg-[#0b1b36]/90 border border-cyan-400/25 backdrop-blur-md shadow-xl py-2.5 px-3.5 rounded-2xl flex items-center gap-3 hover:translate-x-1 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="text-left pr-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tanggal</div>
                    <div className="text-xs font-semibold text-white">26 Sep 2026</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Item 3: Total Items */}
                <div className="bg-[#0b1b36]/90 border border-cyan-400/25 backdrop-blur-md shadow-xl py-2.5 px-3.5 rounded-2xl flex items-center gap-3 hover:translate-x-1 transition-transform">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="text-left pr-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Item</div>
                    <div className="text-xs font-semibold text-white">3 produk</div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Right Floating Extracted Detail Card */}
              <div className="hidden sm:block absolute -right-6 lg:-right-10 top-14 z-20 w-[210px]">
                <div className="bg-[#0b1b36]/90 border border-cyan-400/25 backdrop-blur-md shadow-xl p-3.5 rounded-2xl">
                  {/* AI Processing Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[10px] font-medium text-cyan-300 mb-2.5">
                    <Sparkles className="w-3 h-3 text-cyan-300" />
                    <span>AI sedang membaca...</span>
                  </div>

                  {/* Total Amount Extracted */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Total Belanja</div>
                      <div className="text-base font-bold text-white tracking-tight">Rp 106.500</div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Auto-Categorization Detail */}
                  <div className="pt-2.5 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Tag className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 leading-tight">Kategori</div>
                        <div className="text-slate-200 font-semibold text-[11px] leading-tight">Makanan &amp; Minuman</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                        <Clock className="w-3 h-3" />
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 leading-tight">Waktu</div>
                        <div className="text-slate-200 font-semibold text-[11px] leading-tight">26 Sep 2026, 14:32</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Confirmation Status Banner */}
              <div className="mt-4 pt-3">
                <div className="bg-[#0b1b36]/80 border border-cyan-400/25 backdrop-blur-md shadow-lg py-3 px-4 rounded-2xl flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-bold text-white">Transaksi berhasil diidentifikasi</p>
                    <p className="text-[11px] sm:text-xs text-slate-400">Data siap disimpan ke Finusa</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* RIGHT: Finusa Copywriting and Action Triggers */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 text-left"
          >
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-300 text-xs sm:text-sm font-semibold tracking-wide shadow-inner mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Finusa AI Scan</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.1] mb-5">
              <span className="text-white block pb-1">Scan struk.</span>
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent block leading-tight">
                Pengeluaran langsung tercatat.
              </span>
            </h2>

            {/* Descriptive Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8 max-w-xl">
              Foto struk belanja, biarkan Finusa mengenali toko, total, dan detail transaksi secara otomatis.
            </p>

            {/* Key Benefit Points List */}
            <div className="space-y-5 mb-10">
              
              {/* Benefit 1 */}
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Kenali toko &amp; total otomatis</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Tanpa perlu input manual.</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Kategorikan pengeluaran</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Langsung masuk ke kategori yang tepat.</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Simpan transaksi tanpa mengetik</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Lebih cepat, lebih praktis.</p>
                </div>
              </div>

            </div>

            {/* Primary CTA Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link 
                href="/receipt-scanner"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-cyan-400/30 transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Scan Struk Sekarang</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust Badges & Metrics */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 font-medium">AI Vision OCR · Deteksi toko, item &amp; total</span>
              </div>
              <div className="text-slate-600">•</div>
              <div>Didukung 500+ Format Struk</div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default DeepDiveAIScanSection
