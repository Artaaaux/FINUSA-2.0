'use client'

import React from 'react'
import Marquee from 'react-fast-marquee'
import { ShieldCheck, Zap, Sparkles, ScanLine, Smartphone, Lock } from 'lucide-react'

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'Aman & Terenkripsi',
    subtitle: 'Standar Bank 256-Bit',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Zap,
    title: 'Proses Super Cepat',
    subtitle: 'Scan & catat < 3 Detik',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
  {
    icon: Sparkles,
    title: '100% Gratis',
    subtitle: 'Tanpa Biaya Tersembunyi',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: ScanLine,
    title: 'Smart OCR Engine',
    subtitle: 'Ekstrak Struk Presisi',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Smartphone,
    title: 'Multi Platform',
    subtitle: 'Web, Tablet & Mobile',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
  },
  {
    icon: Lock,
    title: 'Privasi Terjamin',
    subtitle: 'Data Pribadi Terlindungi',
    color: 'text-cyan-300',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
  },
]

export function TrustTicker() {
  return (
    <section className="border-y border-white/[0.08] bg-navy-950/60 backdrop-blur-md py-6 overflow-hidden relative z-20">
      <div className="marquee-mask w-full overflow-hidden">
        <Marquee
          speed={45}
          pauseOnHover={true}
          autoFill={true}
          direction="left"
          className="overflow-hidden py-1"
        >
          {trustItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <div 
                key={`trust-${idx}`}
                className="flex items-center gap-3.5 flex-shrink-0 px-4 py-2.5 mx-3 sm:mx-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:border-white/15 hover:bg-white/[0.06] transition-all duration-200 cursor-default select-none"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">{item.title}</p>
                  <p className="text-xs text-slate-400 font-medium">{item.subtitle}</p>
                </div>
              </div>
            )
          })}
        </Marquee>
      </div>
    </section>
  )
}

export default TrustTicker
