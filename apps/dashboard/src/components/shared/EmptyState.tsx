'use client'

/**
 * EmptyState Component
 * 
 * Displays a helpful message when there's no content to show.
 */

import { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { Button } from './Button'
import { GlassCard } from './GlassCard'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <GlassCard className={className}>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 rounded-full bg-white/5 mb-4">
          {icon || <Inbox className="w-12 h-12 text-white/40" />}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-white/60 max-w-sm mb-6">
            {description}
          </p>
        )}
        {action && (
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </GlassCard>
  )
}

