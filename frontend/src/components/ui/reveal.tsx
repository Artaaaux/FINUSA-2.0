'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/shared/lib/utils'

type FromDirection = 'up' | 'left' | 'right' | 'down' | 'none'
type RevealTag = 'div' | 'article' | 'section' | 'span'

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag
  from?: FromDirection
  distance?: number
  delay?: number
  duration?: number
  margin?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

// Global shared observers per rootMargin to avoid instantiating multiple observers
const observers = new Map<string, IntersectionObserver>()

function getObserver(margin: string): IntersectionObserver | null {
  if (typeof window === 'undefined') return null
  if (observers.has(margin)) return observers.get(margin)!

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          target.dataset.revealed = 'true'
          observer.unobserve(target)
        }
      })
    },
    { rootMargin: margin, threshold: 0.1 }
  )

  observers.set(margin, observer)
  return observer
}

export function Reveal({
  as = 'div',
  from = 'up',
  distance,
  delay = 0,
  duration = 500,
  margin = '-60px',
  className,
  style,
  children,
  ...rest
}: RevealProps) {
  const Component = as
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Honor reduced motion immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.dataset.revealed = 'true'
      return
    }

    const observer = getObserver(margin)
    if (observer) {
      observer.observe(el)
    } else {
      el.dataset.revealed = 'true'
    }

    return () => {
      observer?.unobserve(el)
    }
  }, [margin])

  // Compute CSS custom properties for transform
  const defaultDist = from === 'up' || from === 'down' ? 20 : 30
  const d = distance !== undefined ? distance : defaultDist
  let transformVal = 'none'
  if (from === 'up') transformVal = `translate3d(0, ${d}px, 0)`
  else if (from === 'down') transformVal = `translate3d(0, -${d}px, 0)`
  else if (from === 'left') transformVal = `translate3d(-${d}px, 0, 0)`
  else if (from === 'right') transformVal = `translate3d(${d}px, 0, 0)`

  const dynamicStyles: React.CSSProperties = {
    ...style,
    ['--reveal-from' as string]: transformVal,
    ['--reveal-delay' as string]: `${delay}ms`,
    ['--reveal-dur' as string]: `${duration}ms`,
  }

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn('reveal-element', className)}
      style={dynamicStyles}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Reveal
