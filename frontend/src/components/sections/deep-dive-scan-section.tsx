'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Camera, Sparkles, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { SectionBadge } from '@/components/ui/section-badge'
import { AIScanReceipt } from './ai-scan/ai-scan-receipt'
import { AIScanOverlay } from './ai-scan/ai-scan-overlay'
import { Reveal } from '@/components/ui/reveal'

export function DeepDiveAIScanSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasStartedRef = useRef(false)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const [isScanning, setIsScanning] = useState(false)
  const [isDetected, setIsDetected] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [item1Active, setItem1Active] = useState(false)
  const [item2Active, setItem2Active] = useState(false)
  const [item3Active, setItem3Active] = useState(false)

  const startScanSequence = useCallback(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        setIsScanning(false)
        setIsDetected(true)
        setIsCompleted(true)
        setItem1Active(false)
        setItem2Active(false)
        setItem3Active(true)
        return
      }
    }

    setIsScanning(true)

    // Schedule milestone state updates (5 clean renders instead of 120 per-frame renders)
    const timers = [
      setTimeout(() => setItem1Active(true), 500),
      setTimeout(() => setIsDetected(true), 700),
      setTimeout(() => setItem2Active(true), 900),
      setTimeout(() => setItem3Active(true), 1300),
      setTimeout(() => setItem1Active(false), 1700),
      setTimeout(() => setItem2Active(false), 1900),
      setTimeout(() => {
        setIsScanning(false)
        setIsCompleted(true)
      }, 2000),
    ]

    timeoutsRef.current = timers
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || hasStartedRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startScanSequence()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      startScanSequence()
      observer.disconnect()
    }

    return () => {
      observer.disconnect()
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [startScanSequence])

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
      id="ai-scan"
      data-anim-region
      aria-label="Finusa AI Receipt Scanner"
      className="py-16 sm:py-24 lg:py-28 relative overflow-hidden section-deferred" 
    >
      {/* Ambient Radial Lighting Effects (Hardware-Accelerated) */}
      <div 
        aria-hidden="true"
        className="absolute top-1/4 left-1/4 pointer-events-none w-[650px] h-[650px]"
        style={{
          background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.18) 0%, rgba(37, 99, 235, 0.06) 45%, transparent 70%)',
          transform: 'translate3d(-50%, -50%, 0)',
        }}
      />
      <div 
        aria-hidden="true"
        className="absolute bottom-10 right-1/4 pointer-events-none w-[500px] h-[500px]"
        style={{
          background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.14) 0%, rgba(6, 182, 212, 0.04) 45%, transparent 70%)',
          transform: 'translateZ(0)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Visual Presentation of Finusa AI OCR Receipt Scanner */}
          <Reveal 
            from="left"
            margin="-60px"
            duration={600}
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
                <div className="glass-card-sm-scan--flat flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium">
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
                isScanning={isScanning} 
                item1Active={item1Active}
                item2Active={item2Active}
                item3Active={item3Active}
              />

              {/* Surrounding Glass Overlay Cards */}
              <AIScanOverlay 
                isDetected={isDetected} 
                isCompleted={isCompleted} 
              />

            </div>
          </Reveal>

          {/* RIGHT: Finusa Copywriting and Action Triggers */}
          <Reveal 
            from="right"
            margin="-60px"
            duration={600}
            delay={150}
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

            {/* Trust Badges & Verified Note */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 font-medium">
                  AI Vision OCR · Deteksi toko, item &amp; total
                </span>
              </div>
            </div>

          </Reveal>

        </div>
      </div>
    </section>
  )
}

export default DeepDiveAIScanSection
