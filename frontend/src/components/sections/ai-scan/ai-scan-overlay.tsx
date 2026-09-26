'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Store, Calendar, ShoppingBag, Check, Sparkles, Tag, Clock } from 'lucide-react'

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
        <motion.div
          initial={{ opacity: 0, x: -16, scale: 0.95 }}
          animate={
            isDetected
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: -16, scale: 0.95 }
          }
          transition={{ duration: 0.35, delay: 0.05 }}
          className="glass-card-sm-scan py-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto hover:translate-x-1 transition-transform"
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
        </motion.div>

        {/* Item 2: Date */}
        <motion.div
          initial={{ opacity: 0, x: -16, scale: 0.95 }}
          animate={
            isDetected
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: -16, scale: 0.95 }
          }
          transition={{ duration: 0.35, delay: 0.15 }}
          className="glass-card-sm-scan py-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto hover:translate-x-1 transition-transform"
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
        </motion.div>

        {/* Item 3: Total Items */}
        <motion.div
          initial={{ opacity: 0, x: -16, scale: 0.95 }}
          animate={
            isDetected
              ? { opacity: 1, x: 0, scale: 1 }
              : { opacity: 0, x: -16, scale: 0.95 }
          }
          transition={{ duration: 0.35, delay: 0.25 }}
          className="glass-card-sm-scan py-2.5 px-3.5 rounded-2xl flex items-center gap-3 shadow-xl pointer-events-auto hover:translate-x-1 transition-transform"
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
        </motion.div>
      </div>

      {/* Right Floating Extracted Detail Card: Compact (w-[210px]), shifted outward so receipt details are clear */}
      <motion.div
        initial={{ opacity: 0, x: 16, scale: 0.95 }}
        animate={
          isDetected
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: 16, scale: 0.95 }
        }
        transition={{ duration: 0.4, delay: 0.2 }}
        className="hidden sm:block absolute -right-4 lg:-right-8 top-14 z-20 w-[210px] pointer-events-none"
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
      </motion.div>

      {/* Bottom Confirmation Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={
          isCompleted
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 12 }
        }
        transition={{ duration: 0.4 }}
        className="mt-4 pt-2 relative z-20"
      >
        <div className="glass-card-sm-scan py-3 px-4 rounded-2xl flex items-center gap-3.5 shadow-lg border border-cyan-400/30">
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
      </motion.div>
    </>
  )
}
