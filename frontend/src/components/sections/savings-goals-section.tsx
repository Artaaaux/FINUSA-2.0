'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Target, ArrowRight, Laptop, Luggage, Check } from 'lucide-react'
import Link from 'next/link'
import { SectionBadge } from '@/components/ui/section-badge'
import { FinancialGoalCard, FinancialGoal } from './financial-goals/financial-goal-card'

const financialGoalsData: FinancialGoal[] = [
  {
    id: 'macbook',
    title: 'MacBook Air M3',
    targetDate: 'Target: Desember 2026',
    progress: 65,
    collected: 'Rp 9.750.000',
    target: 'Rp 15.000.000',
    status: 'Sedikit lagi!',
    variant: 'sky',
    icon: <Laptop className="w-6 h-6 stroke-[1.6]" />
  },
  {
    id: 'bali',
    title: 'Liburan ke Bali',
    targetDate: 'Target: November 2026',
    progress: 70,
    collected: 'Rp 4.200.000',
    target: 'Rp 6.000.000',
    status: 'Sisa Rp 1.800.000',
    variant: 'teal',
    icon: <Luggage className="w-6 h-6 stroke-[1.6]" />
  }
]

const benefits = [
  'Visualisasi progres tabungan realtime & perayaan milestone',
  'Pengingat berkala yang disiplin tanpa rasa cemas',
  'Kalkulasi estimasi target tercapai secara cerdas'
]

export function SavingsGoalsSection() {
  return (
    <section 
      aria-label="Fitur Target Finansial Finusa" 
      className="py-16 lg:py-24 relative overflow-hidden section-deferred" 
      id="tujuan"
    >
      {/* Ambient background blurred spheres */}
      <div 
        aria-hidden="true" 
        className="absolute -top-32 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400/25 to-sky-400/20 rounded-full blur-[130px] pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-sky-500/20 to-cyan-400/15 rounded-full blur-[150px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Vision & Benefits */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-5 flex flex-col items-start z-10"
          >
            {/* Feature Pill Badge */}
            <SectionBadge 
              variant="sky" 
              icon={<Target className="w-4 h-4 text-cyan-300 stroke-[1.8] drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />}
              className="mb-6 sm:mb-8"
            >
              Fitur Target Finansial
            </SectionBadge>

            {/* Section Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.25] mb-6 text-white">
              Ubah Keinginan<br />
              Menjadi Rencana<br />
              <span className="inline-block mt-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]">
                Nyata
              </span>
            </h2>

            {/* Supporting Description */}
            <p className="text-slate-300 sm:text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg font-normal">
              Finusa membantumu memecah impian besar menjadi langkah tabungan harian atau mingguan yang ringan, terukur, dan penuh motivasi.
            </p>

            {/* Feature Benefits List */}
            <div className="space-y-4 mb-10 w-full" data-purpose="benefits-list">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3.5 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/15 border border-sky-400/30 flex items-center justify-center transition group-hover:border-sky-400 group-hover:bg-sky-500/25">
                    <Check className="w-3.5 h-3.5 text-sky-300 stroke-[2.2]" />
                  </div>
                  <span className="text-sm sm:text-base text-slate-300 font-medium tracking-normal">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Primary Call to Action Button */}
            <Link
              href="/nabung"
              className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 shadow-glow-button hover:shadow-glow-cyan transition-all duration-300 active:scale-[0.98]"
            >
              <span className="text-sm sm:text-base font-semibold tracking-wide">
                Mulai Atur Target Tabungan
              </span>
              <ArrowRight className="w-4 h-4 text-white stroke-[2.2] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right Column: Interactive Glass Goal Cards Showcase */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="xl:col-span-7 relative flex items-center justify-center w-full"
          >
            {/* Ambient Card Glow Backdrop */}
            <div 
              aria-hidden="true" 
              className="absolute -inset-6 bg-gradient-to-r from-sky-500/15 via-cyan-400/20 to-teal-400/15 rounded-3xl blur-2xl pointer-events-none -z-10" 
            />

            {/* Connecting Milestone Line between Cards (Desktop) */}
            <div 
              aria-hidden="true" 
              className="hidden md:flex absolute top-1/2 left-1/4 right-1/4 -translate-y-1/2 items-center justify-center pointer-events-none z-0"
            >
              <div className="w-full h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
              <div className="absolute w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] ring-4 ring-sky-950" />
            </div>

            {/* Container for Both Glass Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full relative z-10">
              {financialGoalsData.map((goal) => (
                <FinancialGoalCard key={goal.id} goal={goal} />
              ))}
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default SavingsGoalsSection
