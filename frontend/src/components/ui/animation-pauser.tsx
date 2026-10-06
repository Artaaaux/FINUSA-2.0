'use client'

import { useEffect } from 'react'

export function AnimationPauser() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const regions = document.querySelectorAll<HTMLElement>('[data-anim-region]')
    if (!regions.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          if (entry.isIntersecting) {
            el.classList.remove('anim-paused')
          } else {
            el.classList.add('anim-paused')
          }
        })
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    )

    regions.forEach((r) => observer.observe(r))

    return () => observer.disconnect()
  }, [])

  return null
}

export default AnimationPauser
