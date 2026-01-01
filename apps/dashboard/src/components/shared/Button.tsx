'use client'

/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading state, icons, and glassmorphism styling.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" leftIcon={<Icon />}>
 *   Click Me
 * </Button>
 * ```
 */

import { forwardRef } from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import type { ButtonProps } from '@/types/components'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) {
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-danger',
      ghost: 'btn-ghost',
    }

    const sizeClasses = {
      sm: 'btn-sm text-sm',
      md: 'text-base',
      lg: 'btn-lg text-lg',
    }

    return (
      <button
        ref={ref}
        className={clsx(
          'btn',
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'opacity-70 cursor-wait',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    )
  }
)

