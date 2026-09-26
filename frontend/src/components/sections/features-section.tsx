'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ScanLine, BarChart3, PiggyBank, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const coreFeatures = [
  {
    icon: ScanLine,
    title: 'AI Scan Struk',
    desc: 'Cukup foto struk belanja, AI Finusa akan otomatis membaca item, nominal, tanggal, dan mencatat pengeluaran tanpa repot mengetik manual.',
    badge: 'SCAN OTOMATIS',
    color: 'text-cyan-300',
    bg: 'from-cyan-500/20 to-emerald-500/20 border-cyan-400/30',
    hoverBorder: 'hover:border-cyan-500/40',
    link: '/receipt-scanner',
    actionText: 'Coba Scan Struk'
  },
  {
    icon: BarChart3,
    title: 'Manajemen Keuangan',
    desc: 'Pantau arus kas harian, mingguan, dan bulanan. Pahami kemana uangmu pergi dengan visualisasi grafik interaktif yang jernih.',
    badge: 'ARUS KAS REALTIME',
    color: 'text-blue-400',
    bg: 'from-blue-600/20 to-cyan-500/20 border-blue-400/30',
    hoverBorder: 'hover:border-blue-500/40',
    link: '/home',
    actionText: 'Buka Dashboard'
  },
  {
    icon: PiggyBank,
    title: 'Nabung untuk Tujuan',
    desc: 'Buat target tabungan spesifik sesuai mimpimu — beli laptop kuliah, dana darurat, tiket konser, hingga rencana traveling impian.',
    badge: 'TARGET CERDAS',
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-amber-600/20 border-amber-400/30',
    hoverBorder: 'hover:border-amber-500/40',
    link: '/nabung',
    actionText: 'Atur Target'
  },
  {
    icon: Sparkles,
    title: 'Laporan & Insight AI',
    desc: 'Dapatkan evaluasi kebiasaan belanja dan rekomendasi cerdas dari AI untuk menghemat pengeluaran tanpa mengurangi kenyamanan hidupmu.',
    badge: 'ANALISIS CERDAS',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/30',
    hoverBorder: 'hover:border-emerald-500/40',
    link: '/monitor',
    actionText: 'Lihat Analisis'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden section-deferred" id="fitur">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-3">
            Fitur Unggulan
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Semua yang Kamu Butuhkan dalam Satu Tempat
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            Finusa bukan sekadar pencatat keuangan biasa, melainkan partner cerdas yang membantu menjaga kesehatan finansialmu setiap hari.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-full mt-5"></div>
        </div>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreFeatures.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group relative rounded-2xl p-6 bg-[#0a1835]/80 hover:bg-[#0d1e42] border border-white/[0.08] ${feature.hoverBorder} transition-all duration-300 shadow-glass-card hover:-translate-y-1.5 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.bg} border flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-slate-300/80 leading-relaxed font-normal">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/[0.06]">
                  <Link 
                    href={feature.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors group-hover:translate-x-0.5 duration-200"
                  >
                    <span>{feature.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default FeaturesSection
