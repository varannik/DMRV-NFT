'use client'

/**
 * StatusBadge Component
 * 
 * Displays a status indicator with appropriate styling based on the status type.
 * 
 * @example
 * ```tsx
 * <StatusBadge status="approved" />
 * <StatusBadge status="in_progress" label="Processing" />
 * ```
 */

import clsx from 'clsx'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Loader2 
} from 'lucide-react'
import type { Status } from '@/types'

interface StatusBadgeProps {
  status: Status
  label?: string
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig: Record<Status, { 
  icon: React.ComponentType<{ className?: string }>, 
  label: string,
  className: string 
}> = {
  completed: { icon: CheckCircle, label: 'Completed', className: 'status-completed' },
  approved: { icon: CheckCircle, label: 'Approved', className: 'status-approved' },
  active: { icon: CheckCircle, label: 'Active', className: 'status-active' },
  pending: { icon: Clock, label: 'Pending', className: 'status-pending' },
  in_progress: { icon: Loader2, label: 'In Progress', className: 'status-in_progress' },
  rejected: { icon: XCircle, label: 'Rejected', className: 'status-rejected' },
  failed: { icon: AlertCircle, label: 'Failed', className: 'status-failed' },
  draft: { icon: Clock, label: 'Draft', className: 'status-draft' },
  retired: { icon: CheckCircle, label: 'Retired', className: 'status-draft' },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

export function StatusBadge({ 
  status, 
  label, 
  showIcon = true, 
  size = 'md',
  className 
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon
  const displayLabel = label || config.label

  return (
    <span 
      className={clsx(
        'status-badge inline-flex items-center gap-1.5 font-medium rounded-full',
        config.className,
        sizeClasses[size],
        status === 'in_progress' && 'pulse-animation',
        className
      )}
    >
      {showIcon && (
        <Icon 
          className={clsx(
            size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4',
            status === 'in_progress' && 'animate-spin'
          )} 
        />
      )}
      {displayLabel}
    </span>
  )
}

