'use client'

import React, { useRef } from 'react'
import { Calendar, Target as TargetIcon } from 'lucide-react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { cn } from '@/shared/lib/utils'

export interface FinancialGoal {
  id: string
  title: string
  targetDate: string
  progress: number
  collected: string
  target: string
  status: string
  variant: 'sky' | 'teal'
  icon: React.ReactNode
}

interface FinancialGoalCardProps {
  goal: FinancialGoal
  className?: string
}

export function FinancialGoalCard({ goal, className }: FinancialGoalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cardRef.current.style.setProperty('--mouse-x', `${x}px`)
    cardRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const isTeal = goal.variant === 'teal'

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'glass-card-goals relative rounded-3xl p-6 sm:p-7 shadow-glass-card transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group',
        isTeal
          ? 'border-teal-400/25 hover:border-teal-400/50 hover:shadow-[0_25px_50px_-12px_rgba(20,184,166,0.18)]'
          : 'border-sky-400/25 hover:border-sky-400/50 hover:shadow-[0_25px_50px_-12px_rgba(56,189,248,0.18)]',
        className
      )}
      data-purpose="financial-card"
    >
      <div className="card-glow-layer" aria-hidden="true" />

      {/* Top Row: Icon, Title & Percentage Badge */}
      <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3.5">
          {/* Icon Container */}
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-105 duration-300',
              isTeal
                ? 'bg-teal-950/60 border border-teal-400/30 text-teal-300'
                : 'bg-sky-950/60 border border-sky-400/30 text-sky-400'
            )}
          >
            {goal.icon}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              {goal.title}
            </h3>
            {/* Target Deadline */}
            <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{goal.targetDate}</span>
            </div>
          </div>
        </div>

        {/* Percentage Pill */}
        <span
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-bold font-mono tracking-tight',
            isTeal
              ? 'text-teal-300 bg-teal-950/70 border border-teal-400/30'
              : 'text-sky-300 bg-sky-950/70 border border-sky-400/30'
          )}
        >
          {goal.progress}%
        </span>
      </div>

      {/* Amount Section */}
      <div className="mb-4 relative z-10">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Terkumpul
          </span>
          <span className="text-lg font-bold text-white tracking-tight font-mono">
            {goal.collected}
          </span>
        </div>

        {/* Progress Track */}
        <ProgressBar progress={goal.progress} variant={goal.variant} />
      </div>

      {/* Bottom Info Row */}
      <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] sm:text-xs mt-2 relative z-10 gap-2">
        <div className="flex items-center gap-1.5 text-slate-300 shrink-0">
          <TargetIcon
            className={cn('w-3.5 h-3.5 shrink-0', isTeal ? 'text-teal-400' : 'text-sky-400')}
          />
          <span>
            Target <strong className="text-white font-semibold font-mono">{goal.target}</strong>
          </span>
        </div>

        {isTeal ? (
          <div className="flex items-center gap-1.5 text-slate-400 font-medium shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>
              Sisa <strong className="text-slate-200 font-medium font-mono">{goal.status.replace('Sisa ', '')}</strong>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{goal.status}</span>
          </div>
        )}
      </div>
    </article>
  )
}
