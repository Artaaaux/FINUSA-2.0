'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden section-deferred">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto relative rounded-3xl bg-gradient-to-b from-[#0d2252] to-[#081534] border border-blue-400/30 p-8 sm:p-14 lg:p-16 text-center shadow-glass-float overflow-hidden"
        >
          {/* Decorative Glows (GPU Accelerated Radial) */}
          <div 
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.22) 0%, rgba(34, 211, 238, 0.08) 45%, rgba(34, 211, 238, 0) 70%)',
              transform: 'translateZ(0)',
            }}
          />
          <div 
            className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0.08) 45%, rgba(37, 99, 235, 0) 70%)',
              transform: 'translateZ(0)',
            }}
          />

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight relative z-10 font-sans">
            Mulai Rapikan Keuanganmu Hari Ini.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mt-4 relative z-10 leading-relaxed">
            Bergabung bersama ribuan pelajar, fresh graduate, dan profesional muda Indonesia yang sudah hemat waktu dengan Finusa AI.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
            <Link 
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-cyan-500 shadow-glow-blue transition duration-300 active:scale-95"
            >
              <span>Mulai Gratis Sekarang</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>

            <Link 
              href="/bantuan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-medium text-slate-200 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition duration-200"
            >
              <span>Pusat Bantuan</span>
            </Link>
          </div>

          <p className="text-xs sm:text-sm text-cyan-300/80 mt-6 relative z-10 font-medium">
            ✓ 100% Gratis Selamanya • Setup &lt; 1 Menit
          </p>
        </motion.div>

      </div>
    </section>
  )
}

export default CtaSection
