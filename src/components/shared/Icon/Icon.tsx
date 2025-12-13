import React from 'react'

export interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  color?: string
  className?: string
  children: React.ReactNode
  viewBox?: string
  'aria-label'?: string
  'aria-hidden'?: boolean
}

const sizeMap = {
  xs: 'var(--size-icon-xs, 1.5rem)', // 12px
  sm: 'var(--size-icon-sm, 2rem)',   // 16px
  md: 'var(--size-icon-md, 3rem)',   // 24px
  lg: 'var(--size-icon-lg, 4rem)',   // 32px
}

export function Icon({
  size = 'sm',
  color = 'currentColor',
  className = '',
  children,
  viewBox = '0 0 24 24',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  const iconSize = sizeMap[size]

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      color={color}
      style={{ color }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? 'img' : 'presentation'}
    >
      {children}
    </svg>
  )
}

