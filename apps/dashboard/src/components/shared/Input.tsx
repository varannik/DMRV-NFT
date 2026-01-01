'use client'

/**
 * Input Component
 * 
 * A styled input component with glassmorphism effect, label, and error states.
 * 
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   error="Invalid email format"
 * />
 * ```
 */

import { forwardRef } from 'react'
import clsx from 'clsx'
import type { InputProps } from '@/types/components'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className,
      id,
      ...props
    },
    ref
  ) {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s/g, '-')}`

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-white/90"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'glass-input w-full py-3 px-4',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-red-500/50 focus:border-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-white/50">{helperText}</p>
        )}
      </div>
    )
  }
)

