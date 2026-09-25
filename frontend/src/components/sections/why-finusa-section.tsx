'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ScanLine, 
  Activity, 
  Target, 
  ArrowUpRight, 
  CheckCircle2
} from 'lucide-react'

export default function WhyFinusaSection() {
  const [activeCard, setActiveCard] = useState<number>(0)

  return (
    <section id="about" className="relative bg-[#0F1419] py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-y border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-teal-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Vision, Copy, and Impact Metrics */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-jakarta leading-tight tracking-tight">
              Lebih dari Sekadar Catat Uang, Kami Membangun Disiplin Finansial.
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-jakarta">
              FINUSA dirancang khusus untuk pelajar, fresh graduate, dan profesional muda Indonesia yang lelah dengan pencatatan manual yang merepotkan dan rasa cemas saat tanggal tua mendekat.
            </p>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-jakarta">
              Cukup foto struk belanja, biarkan AI mengekstrak semua rincian ke pembukuan secara otomatis. Pantau arus kas dengan kartu ATM visual dan capai target tabungan impian dengan perayaan milestone yang memotivasi.
            </p>

            {/* Metrics Row */}
            <div className="pt-6 border-t border-white/10 mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                    100% Gratis
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 font-jakarta font-medium">
                    Tanpa biaya tersembunyi
                  </p>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                    &lt; 3 Detik
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 font-jakarta font-medium">
                    Proses scan struk otomatis
                  </p>
                </div>

                <div>
                  <h4 className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
                    3+ Modul
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 font-jakarta font-medium">
                    Fitur utama terintegrasi
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Layered Bento Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {/* Card 1: Tall Amber Accent Card */}
            <div 
              onMouseEnter={() => setActiveCard(0)}
              className={`sm:col-span-1 sm:row-span-2 rounded-[1.5rem] p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                activeCard === 0 
                  ? 'bg-[#1a1f2e] border-[#E8A76F]/40 shadow-[0_12px_32px_rgba(0,0,0,0.2)] -translate-y-1' 
                  : 'bg-[#1f2534] border-white/5 hover:border-[#E8A76F]/30'
              }`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#E8A76F]/10 border border-[#E8A76F]/20 flex items-center justify-center text-[#E8A76F] shadow-sm">
                  <ScanLine className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-white font-jakarta">
                  Smart OCR Scanner
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed font-jakarta">
                  Cukup ambil foto struk belanja di minimarket atau kafe favoritmu. AI FINUSA otomatis mengenali toko, tanggal, item belanjaan, dan total harga.
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-white/10">
                <div className="text-2xl font-bold text-[#E8A76F] font-mono tracking-tight">
                  &lt; 3 DETIK
                </div>
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                  Proses Ekstraksi Otomatis
                </div>
              </div>
            </div>

            {/* Card 2: Deep Blue Filled Card */}
            <div 
              onMouseEnter={() => setActiveCard(1)}
              className={`sm:col-span-1 rounded-[1.5rem] p-6 border transition-all duration-300 flex flex-col justify-between ${
                activeCard === 1 
                  ? 'bg-[#1a1f2e] border-[#4B7BFF]/40 shadow-[0_12px_32px_rgba(0,0,0,0.2)] -translate-y-1' 
                  : 'bg-[#1f2534] border-white/5 hover:border-[#4B7BFF]/40'
              }`}
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#4B7BFF]/10 border border-[#4B7BFF]/20 flex items-center justify-center text-[#4B7BFF] shadow-sm">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-jakarta">
                  Visual Cashflow ATM
                </h3>
                <p className={`text-xs leading-relaxed font-jakarta ${activeCard === 1 ? 'text-gray-200' : 'text-gray-400'}`}>
                  Pantau pemasukan, pengeluaran, dan rasio tabungan melalui kartu debit visual yang rapi dan mudah dianalisis.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-white">
                <span>100% Kontrol Kas</span>
                <ArrowUpRight className="w-4 h-4 text-[#4B7BFF]" />
              </div>
            </div>

            {/* Card 3: Emerald/Teal Goal Milestone Card */}
            <div 
              onMouseEnter={() => setActiveCard(2)}
              className={`sm:col-span-1 rounded-[1.5rem] p-6 border transition-all duration-300 flex flex-col justify-between ${
                activeCard === 2 
                  ? 'bg-[#1a1f2e] border-[#2A9D8F]/40 shadow-[0_12px_32px_rgba(0,0,0,0.2)] -translate-y-1' 
                  : 'bg-[#1f2534] border-white/5 hover:border-[#2A9D8F]/30'
              }`}
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/20 flex items-center justify-center text-[#2A9D8F] shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white font-jakarta">
                  Milestone Tabungan
                </h3>
                <p className={`text-xs leading-relaxed font-jakarta ${activeCard === 2 ? 'text-gray-200' : 'text-gray-400'}`}>
                  Raih target tabungan impian dengan perayaan milestone interaktif (25%, 50%, 75%, 100%) yang menyenangkan.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#2A9D8F]">
                <span>Bebas Cemas Finansial</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  )
}

export { WhyFinusaSection }
