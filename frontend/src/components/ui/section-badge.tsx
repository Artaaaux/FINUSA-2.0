import React from 'react'
import { cn } from '@/shared/lib/utils'

interface SectionBadgeProps {
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
  variant?: 'sky' | 'cyan' | 'default'
}

export function SectionBadge({
  icon,
  children,
  className,
  variant = 'cyan'
}: SectionBadgeProps) {
  const variantStyles = {
    cyan: 'eyebrow-pill text-cyan-200 hover:border-cyan-400/50',
    sky: 'border-sky-400/50 bg-sky-950/60 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-white/20',
    default: 'border-cyan-400/30 bg-cyan-950/70 text-cyan-300 shadow-inner'
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md transition duration-300',
        variantStyles[variant],
        className
      )}
    >
      {icon}
      <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
        {children}
      </span>
    </div>
  )
}
