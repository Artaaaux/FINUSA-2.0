'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

export interface StepItem {
  step: string
  title: string
  desc: string
  icon: React.ReactNode
}

interface StepCardProps {
  item: StepItem
  index: number
  className?: string
}

export function StepCard({ item, index, className }: StepCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className={cn(
        'apple-glass-card rounded-[26px] p-7 sm:p-9 flex flex-col items-center text-center transition-all duration-300 hover:border-cyan-400/60 hover:-translate-y-1.5 group h-full justify-between',
        className
      )}
    >
      <div aria-hidden="true" className="glass-sheen" />

      <div className="flex flex-col items-center relative z-10 w-full">
        {/* Badge Number */}
        <div className="num-pill text-white font-bold px-4 py-1.5 rounded-xl text-sm mb-6 sm:mb-7 tracking-wider font-mono transition-transform duration-300 group-hover:scale-105">
          {item.step}
        </div>

        {/* Outline Icon */}
        <div className="w-12 h-12 flex items-center justify-center text-cyan-300 mb-5 sm:mb-6 transition-transform group-hover:scale-110 duration-300">
          {item.icon}
        </div>

        {/* Title */}
        <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight mb-3">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-slate-300/80 sm:text-slate-400 text-xs sm:text-sm leading-relaxed max-w-[280px]">
          {item.desc}
        </p>
      </div>
    </motion.article>
  )
}
