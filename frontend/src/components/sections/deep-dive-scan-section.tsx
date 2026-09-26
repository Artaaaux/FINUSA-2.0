'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Check
} from 'lucide-react'
import Link from 'next/link'
import { SectionBadge } from '@/components/ui/section-badge'
import { AIScanReceipt } from './ai-scan/ai-scan-receipt'
import { AIScanOverlay } from './ai-scan/ai-scan-overlay'

export function DeepDiveAIScanSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [hasStarted, setHasStarted] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [isDetected, setIsDetected] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const startScanSequence = useCallback(() => {
    setHasStarted(true)

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        setScanProgress(1)
        setIsScanning(false)
        setIsDetected(true)
        setIsCompleted(true)
        return
      }
    }

    setIsScanning(true)
    const startTime = performance.now()
    const duration = 2000 // 2 seconds scan pass

    const animateScan = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      setScanProgress(progress)

      // Detection entities pop in as laser passes items
      if (progress >= 0.35) {
        setIsDetected(true)
      }

      if (progress < 1) {
        requestAnimationFrame(animateScan)
      } else {
        // Final state reached
        setIsScanning(false)
        setIsCompleted(true)
      }
    }

    requestAnimationFrame(animateScan)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || hasStarted) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startScanSequence()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)

    // Immediate check if element is already within viewport
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      startScanSequence()
    }

    return () => observer.disconnect()
  }, [hasStarted, startScanSequence])

  const benefitList = [
    {
      title: 'Kenali toko & total otomatis',
      desc: 'Tanpa perlu input manual.',
    },
    {
      title: 'Kategorikan pengeluaran',
      desc: 'Langsung masuk ke kategori yang tepat.',
    },
    {
      title: 'Simpan transaksi tanpa mengetik',
      desc: 'Lebih cepat, lebih praktis.',
    },
  ]

  return (
    <section 
      ref={containerRef}
      aria-label="Finusa AI Receipt Scanner"
      className="py-16 sm:py-24 lg:py-28 relative overflow-hidden section-deferred" 
      id="ai-scan"
    >
      {/* Ambient Radial Lighting Effects */}
      <div 
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" 
      />
      <div 
        aria-hidden="true"
        className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Visual Presentation of Finusa AI OCR Receipt Scanner */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative flex justify-center items-center"
          >
            {/* Outer Scanning Enclosure with Glassmorphic Frame */}
            <div className="glass-panel-scan w-full max-w-[620px] rounded-[32px] p-4 sm:p-7 relative border border-cyan-400/25 shadow-2xl">
              
              {/* Scanner Enclosure Header */}
              <div className="flex items-center justify-between mb-5 px-1 relative z-20">
                {/* Left: AI Vision OCR Indicator */}
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs sm:text-sm tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>AI VISION OCR</span>
                </div>

                {/* Right: Status Pill */}
                <div className="glass-card-sm-scan flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium">
                  {isCompleted ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-emerald-300 font-medium">Selesai Dipindai</span>
                    </>
                  ) : isScanning ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span className="text-cyan-300">Memindai...</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      <span className="text-slate-300">Siap</span>
                    </>
                  )}
                </div>
              </div>

              {/* Receipt & Scanning Stage */}
              <AIScanReceipt 
                scanProgress={scanProgress} 
                isScanning={isScanning} 
              />

              {/* Surrounding Glass Overlay Cards (Positioned relative to glass-panel-scan) */}
              <AIScanOverlay 
                isDetected={isDetected} 
                isCompleted={isCompleted} 
              />

            </div>
          </motion.div>

          {/* RIGHT: Finusa Copywriting and Action Triggers */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 text-left"
          >
            {/* Category Pill */}
            <SectionBadge 
              variant="default" 
              icon={<Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
              className="mb-5"
            >
              Finusa AI Scan
            </SectionBadge>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-extrabold tracking-tight leading-[1.14] mb-5">
              <span className="text-white block pb-1">Scan struk.</span>
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent block leading-tight">
                Pengeluaran langsung tercatat.
              </span>
            </h2>

            {/* Descriptive Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8 max-w-xl">
              Foto struk belanja, biarkan Finusa mengenali toko, total, dan detail transaksi secara otomatis.
            </p>

            {/* Key Benefit Points List */}
            <div className="space-y-4 sm:space-y-5 mb-10">
              {benefitList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 sm:gap-4 group">
                  <div className="w-7 h-7 rounded-full bg-blue-900/60 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:border-cyan-400 transition-colors">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Primary CTA Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link 
                href="/receipt-scanner"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-cyan-400/30 transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
              >
                <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span>Scan Struk Sekarang</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust Badges & Verified Note (No Fabricated Metrics) */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 font-medium">
                  AI Vision OCR · Deteksi toko, item &amp; total
                </span>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default DeepDiveAIScanSection
