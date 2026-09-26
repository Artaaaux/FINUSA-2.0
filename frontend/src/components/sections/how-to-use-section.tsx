'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Cpu, LayoutDashboard } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Camera,
    title: 'Foto Struk Belanja',
    desc: 'Buka aplikasi Finusa, arahkan kamera ke struk pembayaran minimarket/cafe, atau unggah tangkapan layar transaksi e-wallet kamu.',
    color: 'text-blue-400',
    bg: 'bg-blue-600/20 border-blue-500/30',
    borderHover: 'hover:border-blue-500/40'
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Finusa AI Memindai',
    desc: 'Mesin cerdas mengekstrak nama merchant, rincian barang, tanggal belanja, dan total biaya secara instan tanpa perlu ketik manual.',
    color: 'text-cyan-300',
    bg: 'bg-cyan-600/20 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/40'
  },
  {
    step: '03',
    icon: LayoutDashboard,
    title: 'Keuangan Tercatat Rapi',
    desc: 'Dashboard arus kasmu langsung diperbarui secara realtime. Pantau pos pengeluaran, sisa bujet bulanan, dan progres tabunganmu.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-600/20 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/40'
  }
]

export function HowToUseSection() {
  return (
    <section className="py-24 lg:py-32 relative section-deferred" id="cara-kerja">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
            Langkah Mudah
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-4 tracking-tight leading-tight">
            Mulai Rapi Finansial dalam 3 Langkah
          </h2>
          <p className="text-slate-300 mt-3 text-base sm:text-lg">
            Tanpa setup yang rumit, siapa pun bisa langsung mulai mengatur keuangan hari ini.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connecting Line Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-blue-500/20 via-cyan-400/40 to-emerald-500/20 -translate-y-8 z-0 pointer-events-none" />

          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`relative z-10 rounded-2xl bg-[#091738]/85 border border-white/10 p-7 text-center ${item.borderHover} transition-all duration-300 shadow-glass-card hover:-translate-y-1.5 flex flex-col items-center`}
              >
                {/* Step Number Badge */}
                <div className={`w-14 h-14 rounded-2xl ${item.bg} border ${item.color} flex items-center justify-center text-xl font-bold mb-6 shadow-inner font-mono`}>
                  {item.step}
                </div>

                <div className="mb-3">
                  <Icon className={`w-6 h-6 mx-auto ${item.color} mb-2 opacity-80`} />
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-300/85 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </motion.div>
            )
          })}

        </div>

      </div>
    </section>
  )
}

export default HowToUseSection
