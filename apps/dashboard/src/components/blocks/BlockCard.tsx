'use client'

/**
 * BlockCard Component
 * 
 * Displays a single MRV submission as a blockchain-style block card.
 * Inspired by mempool.space visualization.
 * 
 * @example
 * ```tsx
 * <BlockCard
 *   block={blockData}
 *   isSelected={true}
 *   onSelect={(id) => console.log('Selected:', id)}
 * />
 * ```
 */

import { memo, useCallback } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, XCircle, Loader2, Hash } from 'lucide-react'
import type { Block, Status } from '@/types'

interface BlockCardProps {
  block: Block
  isSelected?: boolean
  onSelect: (blockId: string) => void
  className?: string
}

const statusConfig: Record<Status, { 
  icon: React.ComponentType<{ className?: string }>,
  color: string,
  bgColor: string,
  label: string 
}> = {
  approved: { 
    icon: CheckCircle2, 
    color: 'text-green-400', 
    bgColor: 'from-green-500/30 to-emerald-500/10',
    label: '✅' 
  },
  completed: { 
    icon: CheckCircle2, 
    color: 'text-green-400', 
    bgColor: 'from-green-500/30 to-emerald-500/10',
    label: '✅' 
  },
  active: { 
    icon: CheckCircle2, 
    color: 'text-green-400', 
    bgColor: 'from-green-500/30 to-emerald-500/10',
    label: '✅' 
  },
  in_progress: { 
    icon: Loader2, 
    color: 'text-amber-400', 
    bgColor: 'from-amber-500/30 to-yellow-500/10',
    label: '🟡' 
  },
  pending: { 
    icon: Clock, 
    color: 'text-white/50', 
    bgColor: 'from-white/10 to-white/5',
    label: '⚪' 
  },
  rejected: { 
    icon: XCircle, 
    color: 'text-red-400', 
    bgColor: 'from-red-500/30 to-rose-500/10',
    label: '🔴' 
  },
  failed: { 
    icon: XCircle, 
    color: 'text-red-400', 
    bgColor: 'from-red-500/30 to-rose-500/10',
    label: '🔴' 
  },
  draft: { 
    icon: Clock, 
    color: 'text-white/40', 
    bgColor: 'from-white/5 to-transparent',
    label: '⚪' 
  },
  retired: { 
    icon: CheckCircle2, 
    color: 'text-white/50', 
    bgColor: 'from-white/10 to-white/5',
    label: '⬜' 
  },
}

const registryIcons: Record<string, string> = {
  verra: '🌍',
  puro: '🌱',
  isometric: '📐',
  eu_ets: '🇪🇺',
}

export const BlockCard = memo(function BlockCard({
  block,
  isSelected = false,
  onSelect,
  className,
}: BlockCardProps) {
  const handleClick = useCallback(() => {
    onSelect(block.id)
  }, [block.id, onSelect])
  
  const config = statusConfig[block.status] || statusConfig.pending
  const Icon = config.icon
  const registryIcon = registryIcons[block.registryType] || '📊'
  
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={clsx(
        'relative cursor-pointer transition-all duration-200',
        'w-28 h-32 flex flex-col items-center justify-center gap-2',
        'rounded-xl border backdrop-blur-lg',
        `bg-gradient-to-br ${config.bgColor}`,
        isSelected 
          ? 'border-green-500 shadow-lg shadow-green-500/30 ring-2 ring-green-500/50' 
          : 'border-white/20 hover:border-white/40',
        className
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-selected={isSelected}
      aria-label={`Block ${block.blockNumber}, Status: ${block.status}`}
    >
      {/* Block Number */}
      <div className="absolute -top-2 -left-2 w-7 h-7 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
        <span className="text-xs font-bold text-white">#{block.blockNumber}</span>
      </div>
      
      {/* Registry Icon */}
      <div className="absolute -top-2 -right-2 text-lg">
        {registryIcon}
      </div>
      
      {/* Status Icon */}
      <div className={clsx(
        'w-12 h-12 rounded-xl flex items-center justify-center',
        'bg-white/10 backdrop-blur',
        config.color
      )}>
        <Icon className={clsx(
          'w-6 h-6',
          block.status === 'in_progress' && 'animate-spin'
        )} />
      </div>
      
      {/* Tonnage */}
      <div className="text-center">
        <p className="text-sm font-bold text-white">
          {block.tonnage.toLocaleString()}
        </p>
        <p className="text-xs text-white/50">tCO₂e</p>
      </div>
      
      {/* Hash indicator */}
      {block.hash && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-white/40">
          <Hash className="w-3 h-3" />
          <span>{block.hash.substring(0, 6)}...</span>
        </div>
      )}
      
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs text-green-400 font-medium whitespace-nowrap"
        >
          Selected
        </motion.div>
      )}
    </motion.div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.block.id === nextProps.block.id &&
    prevProps.block.status === nextProps.block.status &&
    prevProps.isSelected === nextProps.isSelected
  )
})

