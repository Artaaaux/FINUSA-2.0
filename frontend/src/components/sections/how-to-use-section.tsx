'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Camera, Cpu, LayoutGrid, Sparkles } from 'lucide-react'
import { SectionBadge } from '@/components/ui/section-badge'
import { StepCard, StepItem } from './steps/step-card'

const stepsData: StepItem[] = [
  {
    step: '01',
    title: 'Foto Struk Belanja',
    desc: 'Buka aplikasi Finusa, arahkan kamera ke struk pembayaran minimarket/café, atau unggah tangkapan layar transaksi e-wallet kamu.',
    icon: <Camera className="w-8 h-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] stroke-[1.8]" />
  },
  {
    step: '02',
    title: 'Finusa AI Memindai',
    desc: 'Finusa mengenali nama merchant, rincian barang, tanggal belanja, dan total transaksi secara otomatis.',
    icon: <Cpu className="w-8 h-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] stroke-[1.8]" />
  },
  {
    step: '03',
    title: 'Keuangan Tercatat Rapi',
    desc: 'Dashboard arus kasmu langsung diperbarui secara realtime. Pantau pos pengeluaran, sisa bujet bulanan, dan progres tabunganmu.',
    icon: <LayoutGrid className="w-8 h-8 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] stroke-[1.8]" />
  }
]

export function HowToUseSection() {
  return (
    <section 
      aria-label="3 Langkah Mudah Finusa" 
      className="py-16 sm:py-24 lg:py-28 relative section-deferred overflow-hidden" 
      id="cara-kerja"
    >
      {/* Atmospheric Ambient Lighting Backdrop */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] md:w-[1000px] h-[350px] rounded-full bg-cyan-400/10 blur-[140px] pointer-events-none -z-10" 
      />
      <div 
        aria-hidden="true" 
        className="absolute top-10 -left-20 w-[500px] h-[450px] rounded-full bg-blue-600/15 blur-[150px] pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-18 flex flex-col items-center"
        >
          {/* Category Badge */}
          <SectionBadge 
            variant="cyan"
            icon={<Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
            className="mb-5 sm:mb-6"
          >
            LANGKAH MUDAH
          </SectionBadge>

          {/* Main Title */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold text-white tracking-tight leading-[1.18] mb-4">
            Mulai Rapi Finansial dalam 3{' '}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              Langkah
            </span>
          </h2>

          {/* Supportive Subtitle */}
          <p className="text-slate-300/80 sm:text-slate-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-normal">
            Tanpa setup yang rumit, siapa pun bisa langsung mulai mengatur keuangan hari ini.
          </p>
        </motion.div>

        {/* Steps Flow Section */}
        <div className="relative w-full max-w-6xl mx-auto">
          
          {/* Continuous Glowing Cyan Connector Line (Desktop Only) */}
          <div 
            aria-hidden="true" 
            className="hidden md:block absolute top-[48%] left-8 right-8 -translate-y-1/2 z-0 pointer-events-none"
          >
            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-cyan-400/55 to-transparent relative shadow-[0_0_12px_rgba(34,211,238,0.6)]">
              {/* Connecting Node 1 (Between Card 01 and 02) */}
              <div className="absolute left-1/3 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_4px_rgba(34,211,238,0.9)]" />
              </div>
              {/* Connecting Node 2 (Between Card 02 and 03) */}
              <div className="absolute left-2/3 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_4px_rgba(34,211,238,0.9)]" />
              </div>
            </div>
          </div>

          {/* Continuous Vertical Connector Line (Mobile Only) */}
          <div 
            aria-hidden="true" 
            className="md:hidden absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-[1.5px] bg-gradient-to-b from-transparent via-cyan-400/35 to-transparent pointer-events-none z-0" 
          />

          {/* 3 Steps Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7 relative z-10 items-stretch">
            {stepsData.map((item, idx) => (
              <StepCard key={item.step} item={item} index={idx} />
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}

export default HowToUseSection
