import React from 'react'
import { cn } from '@/shared/lib/utils'

interface ProgressBarProps {
  progress: number
  variant?: 'sky' | 'teal'
  className?: string
  trackClassName?: string
}

export function ProgressBar({
  progress,
  variant = 'sky',
  className,
  trackClassName,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  const gradientStyles = {
    sky: 'bg-gradient-to-r from-sky-600 via-sky-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.6)]',
    teal: 'bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(20,184,166,0.6)]',
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'relative w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden p-[1px] border border-white/5',
        trackClassName
      )}
    >
      <div
        className={cn(
          'h-full rounded-full relative transition-all duration-700 ease-out',
          gradientStyles[variant],
          className
        )}
        style={{ width: `${clampedProgress}%` }}
      >
        {/* Shiny Tip Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/70 rounded-full blur-[1px]" />
      </div>
    </div>
  )
}
