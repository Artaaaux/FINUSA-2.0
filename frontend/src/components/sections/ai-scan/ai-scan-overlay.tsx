'use client'

import React from 'react'
import { Store, Calendar, ShoppingBag, Check, Sparkles, Tag, Clock } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface AIScanOverlayProps {
  isDetected: boolean
  isCompleted: boolean
}

export function AIScanOverlay({ isDetected, isCompleted }: AIScanOverlayProps) {
  return (
    <>
      {/* Left Floating Detected Entities (Positioned offset outward to avoid covering receipt prices) */}
      <div className="hidden sm:flex flex-col gap-3 absolute -left-5 lg:-left-7 top-14 z-20 pointer-events-none">
        {/* Item 1: Store */}
        <div
          style={{ transitionDelay: '50ms' }}
          className={cn(
            'glass-card-sm-scan py-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto hover:translate-x-1 transition-[opacity,transform] duration-350',
            isDetected ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Toko</div>
            <div className="text-xs font-semibold text-white">Minimarket</div>
          </div>
          <div className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>

        {/* Item 2: Date */}
        <div
          style={{ transitionDelay: '150ms' }}
          className={cn(
            'glass-card-sm-scan py-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto hover:translate-x-1 transition-[opacity,transform] duration-350',
            isDetected ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tanggal</div>
            <div className="text-xs font-semibold text-white">26 Sep 2026</div>
          </div>
          <div className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>

        {/* Item 3: Total Items */}
        <div
          style={{ transitionDelay: '250ms' }}
          className={cn(
            'glass-card-sm-scan py-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto hover:translate-x-1 transition-[opacity,transform] duration-350',
            isDetected ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95'
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Item</div>
            <div className="text-xs font-semibold text-white">3 produk</div>
          </div>
          <div className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Right Floating Extracted Detail Card */}
      <div
        style={{ transitionDelay: '200ms' }}
        className={cn(
          'hidden sm:block absolute -right-4 lg:-right-8 top-14 z-20 w-[210px] pointer-events-none transition-[opacity,transform] duration-400',
          isDetected ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 scale-95'
        )}
      >
        <div className="glass-card-sm-scan p-3.5 rounded-2xl pointer-events-auto">
          {/* AI Processing / Verified Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-[10px] font-medium text-cyan-300 mb-2.5">
            <Sparkles className="w-3 h-3 text-cyan-300" />
            <span>{isCompleted ? 'AI Terverifikasi' : 'AI sedang membaca...'}</span>
          </div>

          {/* Total Amount Extracted */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Total Belanja</div>
              <div className="text-base font-bold text-white tracking-tight font-mono">
                Rp 106.500
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
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
                <div className="text-slate-200 font-semibold text-[11px] leading-tight">
                  Makanan &amp; Minuman
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Clock className="w-3 h-3" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 leading-tight">Waktu</div>
                <div className="text-slate-200 font-semibold text-[11px] leading-tight">
                  26 Sep 2026, 14:32
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Confirmation Status Banner */}
      <div
        className={cn(
          'mt-4 pt-2 relative z-20 transition-[opacity,transform] duration-400',
          isCompleted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        )}
      >
        <div className="glass-card-sm-scan--flat py-3 px-4 rounded-2xl flex items-center gap-3.5 shadow-lg border border-cyan-400/30">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-bold text-white">
              Transaksi berhasil diidentifikasi
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400">
              Data siap disimpan ke Finusa
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default AIScanOverlay
