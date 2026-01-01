'use client'

/**
 * Dashboard Page
 * 
 * Main dashboard showing project blocks, process flow, and stats.
 * Responsive design for mobile, tablet, and desktop.
 */

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Leaf, 
  Clock, 
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { GlassCard, StatusBadge } from '@/components/shared'
import { BlockChain, ProjectSelector } from '@/components/blocks'
import { ProcessFlow } from '@/components/process'
import type { Block, ProcessPhase } from '@/types'

// Demo data
const demoProjects = [
  { id: 'proj-1', name: 'Amazon Reforestation Project', registryType: 'verra' as const, status: 'active' },
  { id: 'proj-2', name: 'Direct Air Capture Facility', registryType: 'puro' as const, status: 'active' },
  { id: 'proj-3', name: 'EU Carbon Capture Site', registryType: 'eu_ets' as const, status: 'draft' },
  { id: 'proj-4', name: 'Biochar Production', registryType: 'isometric' as const, status: 'active' },
]

const demoBlocks: Block[] = [
  { id: 'block-1', blockNumber: 42, mrvSubmissionId: 'mrv-001', status: 'approved', registryType: 'verra', timestamp: new Date('2024-01-15'), tonnage: 15000, hash: '0x1a2b3c4d' },
  { id: 'block-2', blockNumber: 41, mrvSubmissionId: 'mrv-002', status: 'in_progress', registryType: 'verra', timestamp: new Date('2024-01-10'), tonnage: 12500 },
  { id: 'block-3', blockNumber: 40, mrvSubmissionId: 'mrv-003', status: 'approved', registryType: 'verra', timestamp: new Date('2024-01-05'), tonnage: 18000, hash: '0x5e6f7g8h' },
  { id: 'block-4', blockNumber: 39, mrvSubmissionId: 'mrv-004', status: 'approved', registryType: 'verra', timestamp: new Date('2024-01-01'), tonnage: 9500, hash: '0x9i0j1k2l' },
  { id: 'block-5', blockNumber: 38, mrvSubmissionId: 'mrv-005', status: 'failed', registryType: 'verra', timestamp: new Date('2023-12-28'), tonnage: 7200 },
  { id: 'block-6', blockNumber: 37, mrvSubmissionId: 'mrv-006', status: 'approved', registryType: 'verra', timestamp: new Date('2023-12-20'), tonnage: 22000, hash: '0x3m4n5o6p' },
]

// Stats cards data
interface StatCard {
  title: string
  value: string
  change: { value: number; trend: 'up' | 'down' }
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function DashboardPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-1')
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block-1')
  const [currentPhase] = useState<ProcessPhase>(3)
  
  const stats: StatCard[] = useMemo(() => [
    {
      title: 'Total Credits Issued',
      value: '84,200 tCO₂e',
      change: { value: 12.5, trend: 'up' },
      icon: Leaf,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Active Submissions',
      value: '6',
      change: { value: 2, trend: 'up' },
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Verification Rate',
      value: '94.2%',
      change: { value: 3.1, trend: 'up' },
      icon: CheckCircle2,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Portfolio Value',
      value: '$2.1M',
      change: { value: 8.4, trend: 'up' },
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-600',
    },
  ], [])
  
  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId)
  }
  
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Dashboard</h1>
          <p className="text-sm md:text-base text-white/60">Monitor your carbon credit issuance workflow</p>
        </div>
        <ProjectSelector
          projects={demoProjects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={setSelectedProjectId}
        />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard hover className="!p-4 md:!p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="order-2 md:order-1">
                  <p className="text-xs md:text-sm text-white/60 mb-1">{stat.title}</p>
                  <p className="text-lg md:text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1 md:mt-2">
                    {stat.change.trend === 'up' ? (
                      <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
                    )}
                    <span className={`text-xs md:text-sm ${stat.change.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change.value}%
                    </span>
                  </div>
                </div>
                <div className={`order-1 md:order-2 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      
      {/* Blockchain Blocks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <BlockChain
          blocks={demoBlocks}
          selectedBlockId={selectedBlockId}
          onBlockSelect={handleBlockSelect}
        />
      </motion.div>
      
      {/* Process Flow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white">Process Flow</h2>
            <p className="text-xs md:text-sm text-white/60">
              {selectedBlockId 
                ? `Viewing workflow for Block #${demoBlocks.find(b => b.id === selectedBlockId)?.blockNumber}`
                : 'Select a block to view its workflow'}
            </p>
          </div>
          {selectedBlockId && (
            <StatusBadge 
              status={demoBlocks.find(b => b.id === selectedBlockId)?.status || 'pending'} 
              size="lg"
            />
          )}
        </div>
        <ProcessFlow
          steps={[]}
          currentPhase={currentPhase}
          onStepClick={(stepId) => {
            console.log('Step clicked:', stepId)
          }}
        />
      </motion.div>
    </div>
  )
}
