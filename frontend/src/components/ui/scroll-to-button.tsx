'use client'

import React from 'react'

interface ScrollToButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  targetId: string
  children: React.ReactNode
}

export function ScrollToButton({
  targetId,
  children,
  className,
  ...props
}: ScrollToButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e)
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
}

export default ScrollToButton
