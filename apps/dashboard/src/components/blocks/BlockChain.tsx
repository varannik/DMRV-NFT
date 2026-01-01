'use client'

/**
 * BlockChain Component
 * 
 * Displays the chain of MRV submission blocks horizontally.
 * Inspired by mempool.space visualization.
 */

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { BlockCard } from './BlockCard'
import { GlassCard, Button, EmptyState } from '@/components/shared'
import type { Block } from '@/types'

interface BlockChainProps {
  blocks: Block[]
  selectedBlockId: string | null
  onBlockSelect: (blockId: string) => void
  isLoading?: boolean
}

export function BlockChain({
  blocks,
  selectedBlockId,
  onBlockSelect,
  isLoading,
}: BlockChainProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }
  
  if (isLoading) {
    return (
      <GlassCard className="h-48 flex items-center justify-center">
        <div className="flex gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-28 h-32 rounded-xl bg-white/10" />
          ))}
        </div>
      </GlassCard>
    )
  }
  
  if (blocks.length === 0) {
    return (
      <EmptyState
        title="No MRV Submissions Yet"
        description="Start by creating a new MRV submission for your project."
        action={{
          label: 'Create Submission',
          onClick: () => {/* TODO: Navigate to create submission */},
        }}
      />
    )
  }
  
  return (
    <GlassCard className="relative">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-white">MRV Submission Blocks</h3>
          <p className="text-xs md:text-sm text-white/60">
            {blocks.length} blocks • Newest first
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={scrollLeft} className="!p-2">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={scrollRight} className="!p-2">
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            <span className="hidden sm:inline">New Block</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
      
      {/* Blocks Container */}
      <div className="relative">
        {/* Chain connectors (visual line between blocks) */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Scrollable blocks */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {blocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              style={{ scrollSnapAlign: 'center' }}
            >
              <BlockCard
                block={block}
                isSelected={block.id === selectedBlockId}
                onSelect={onBlockSelect}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Selected Block Info */}
      {selectedBlockId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-white/10"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60">Current Block:</span>
            <span className="text-sm font-medium text-white">
              #{blocks.find(b => b.id === selectedBlockId)?.blockNumber}
            </span>
            <span className="text-xs text-white/40">
              {blocks.find(b => b.id === selectedBlockId)?.mrvSubmissionId.substring(0, 8)}...
            </span>
          </div>
        </motion.div>
      )}
    </GlassCard>
  )
}

