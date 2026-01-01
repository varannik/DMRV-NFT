'use client'

/**
 * LoadingSpinner Component
 * 
 * A loading indicator with optional message.
 */

import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function LoadingSpinner({ 
  size = 'md', 
  message, 
  className 
}: LoadingSpinnerProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 
        className={clsx(
          'animate-spin text-white/70',
          sizeClasses[size]
        )} 
      />
      {message && (
        <p className="text-sm text-white/60">{message}</p>
      )}
    </div>
  )
}

/**
 * FullPageLoader Component
 * 
 * A full-page loading overlay with glassmorphism.
 */
export function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="glass p-8 rounded-2xl">
        <LoadingSpinner size="lg" message={message || 'Loading...'} />
      </div>
    </div>
  )
}

/**
 * Skeleton Component
 * 
 * Placeholder loading skeleton with shimmer effect.
 */
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className, 
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={clsx(
        'animate-pulse bg-white/10',
        variantClasses[variant],
        className
      )}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
    />
  )
}

