'use client'

/**
 * GlassCard Component
 * 
 * A reusable glassmorphism card component that provides the signature
 * frosted glass effect used throughout the DMRV dashboard.
 * 
 * @example
 * ```tsx
 * <GlassCard variant="strong" hover>
 *   <h2>Card Title</h2>
 *   <p>Card content</p>
 * </GlassCard>
 * ```
 */

import { forwardRef } from 'react'
import clsx from 'clsx'
import type { GlassCardProps } from '@/types/components'

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    { 
      children, 
      className, 
      variant = 'default', 
      hover = false, 
      onClick,
      solid = false,
    },
    ref
  ) {
    const variantClasses = {
      default: 'glass',
      strong: 'glass-strong',
      subtle: 'glass-subtle',
      dropdown: 'glass-dropdown',
    }

    // Solid mode for overlays/modals - uses opaque background instead of glass effect
    const solidClasses = 'bg-gray-900 border border-white/20 rounded-2xl shadow-2xl'

    return (
      <div
        ref={ref}
        className={clsx(
          solid ? solidClasses : variantClasses[variant],
          hover && 'glass-hover cursor-pointer',
          'p-6',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
      >
        {children}
      </div>
    )
  }
)

