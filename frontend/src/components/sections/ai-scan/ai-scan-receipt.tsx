'use client'

import React from 'react'
import { Store } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface AIScanReceiptProps {
  scanProgress: number // 0 to 1
  isScanning: boolean
  className?: string
}

export function AIScanReceipt({
  scanProgress,
  isScanning,
  className,
}: AIScanReceiptProps) {
  // Barcode pattern
  const barcodePattern = [2, 1, 3, 0, 2, 1, 4, 0, 2, 1, 3, 1, 2, 0, 3, 1, 4, 2]

  return (
    <div className={cn('relative flex justify-center py-2 sm:py-3 select-none', className)}>
      {/* Scanning Laser Beam: Thinner (1.5px), refined glow */}
      {isScanning && (
        <div
          className="absolute left-2 right-2 sm:left-4 sm:right-4 z-30 pointer-events-none flex items-center justify-center transition-all duration-75"
          style={{
            top: `${Math.min(Math.max(scanProgress * 92 + 4, 4), 96)}%`,
            opacity: scanProgress > 0 && scanProgress < 1 ? 1 : 0,
          }}
        >
          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
          <div className="absolute w-14 h-1.5 bg-cyan-300/25 blur-[2px] rounded-full pointer-events-none" />
        </div>
      )}

      {/* Optical Corner Guides for Scanner Frame */}
      <div className="absolute top-1 left-2 sm:left-6 w-5 h-5 border-t-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute top-1 right-2 sm:right-6 w-5 h-5 border-t-2 border-r-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute bottom-2 left-2 sm:left-6 w-5 h-5 border-b-2 border-l-2 border-cyan-400 pointer-events-none z-20" />
      <div className="absolute bottom-2 right-2 sm:right-6 w-5 h-5 border-b-2 border-r-2 border-cyan-400 pointer-events-none z-20" />

      {/* Thermal Paper Receipt Container: ~360px wide, high-contrast crisp text */}
      <div className="relative w-full max-w-[330px] sm:max-w-[360px] bg-white rounded-t-sm text-slate-800 shadow-2xl overflow-hidden font-mono text-xs sm:text-[13px]">
        {/* Receipt Content */}
        <div className="p-5 sm:p-6 pb-4">
          
          {/* Merchant Header */}
          <div className="text-center pb-3.5 border-b border-dashed border-slate-300">
            <div className="flex justify-center items-center gap-1.5 font-bold text-slate-900 text-base sm:text-lg tracking-wide uppercase">
              <Store className="w-4 h-4 text-slate-700" />
              <span>MINIMARKET</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-sans">
              Jl. Melati No. 12, Jakarta Pusat
            </p>
            <div className="flex justify-between items-center text-[10px] sm:text-[11px] text-slate-400 mt-2 font-sans font-medium">
              <span>26/09/2026 14:32:17</span>
              <span>#TRX-94821</span>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="py-3.5 space-y-2.5 border-b border-dashed border-slate-300">
            <div
              className={cn(
                'flex justify-between items-baseline font-medium text-slate-700 transition-colors duration-300 rounded px-1 -mx-1',
                scanProgress > 0.25 && scanProgress < 0.85 && 'bg-cyan-50/70 text-slate-950'
              )}
            >
              <span>Susu Almond 1L</span>
              <span className="text-slate-900 font-semibold tracking-tight">Rp 38.500</span>
            </div>
            <div
              className={cn(
                'flex justify-between items-baseline font-medium text-slate-700 transition-colors duration-300 rounded px-1 -mx-1',
                scanProgress > 0.45 && scanProgress < 0.95 && 'bg-cyan-50/70 text-slate-950'
              )}
            >
              <span>Oatmeal Instant 800g</span>
              <span className="text-slate-900 font-semibold tracking-tight">Rp 46.000</span>
            </div>
            <div
              className={cn(
                'flex justify-between items-baseline font-medium text-slate-700 transition-colors duration-300 rounded px-1 -mx-1',
                scanProgress > 0.65 && 'bg-cyan-50/70 text-slate-950'
              )}
            >
              <span>Roti Gandum Utuh</span>
              <span className="text-slate-900 font-semibold tracking-tight">Rp 22.000</span>
            </div>
          </div>

          {/* Calculations */}
          <div className="py-3 space-y-1.5 text-[11px] text-slate-500 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>SUBTOTAL</span>
              <span className="font-medium text-slate-800 font-semibold">Rp 106.500</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>PPN (11% TERMASUK)</span>
              <span>Rp 10.554</span>
            </div>
          </div>

          {/* Total */}
          <div className="py-3.5 flex justify-between items-center text-sm font-bold text-slate-950">
            <span className="tracking-tight uppercase font-sans">TOTAL BELANJA</span>
            <span className="text-blue-900 font-extrabold text-base sm:text-lg">Rp 106.500</span>
          </div>

          {/* Barcode Graphic */}
          <div className="pt-2 text-center">
            <div className="h-8 w-full max-w-[210px] mx-auto flex justify-between items-stretch">
              {barcodePattern.map((w, i) => (
                <span
                  key={i}
                  className={w === 0 ? 'w-[1.5px] bg-transparent' : 'bg-slate-900'}
                  style={{ width: w > 0 ? `${w}px` : undefined }}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-sans">
              Terima kasih telah berbelanja di Minimarket.{' '}
              <span className="text-slate-600 font-medium">#BelanjaHemat</span>
            </p>
          </div>

        </div>

        {/* Perforated Receipt Bottom Edge */}
        <div className="w-full overflow-hidden leading-none -mt-[1px]">
          <svg
            className="w-full h-2.5 text-white fill-current"
            viewBox="0 0 360 8"
            preserveAspectRatio="none"
          >
            <path d="M0 0 L10 8 L20 0 L30 8 L40 0 L50 8 L60 0 L70 8 L80 0 L90 8 L100 0 L110 8 L120 0 L130 8 L140 0 L150 8 L160 0 L170 8 L180 0 L190 8 L200 0 L210 8 L220 0 L230 8 L240 0 L250 8 L260 0 L270 8 L280 0 L290 8 L300 0 L310 8 L320 0 L330 8 L340 0 L350 8 L360 0 L360 0 L0 0 Z" />
          </svg>
        </div>

      </div>
    </div>
  )
}
