'use client'

/**
 * ProcessNode Component
 * 
 * Custom ReactFlow node for displaying process phases.
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import clsx from 'clsx'
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  Lock,
  FileSearch,
  Database,
  Calculator,
  ShieldCheck,
  Hash,
  Upload,
  Coins,
  TrendingUp,
} from 'lucide-react'
import type { ProcessNodeData, ProcessPhase } from '@/types'

const phaseIcons: Record<ProcessPhase, React.ComponentType<{ className?: string }>> = {
  0: FileSearch,     // Registry Selection
  1: Database,       // Data Ingestion
  2: Calculator,     // MRV Computation
  3: ShieldCheck,    // Verification
  4: Hash,           // Canonical Hashing
  5: Upload,         // Registry Submission
  6: Coins,          // NFT Minting
  7: TrendingUp,     // Active Credit
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-green-400',
    bgColor: 'from-green-500/30 to-emerald-500/10',
    borderColor: 'border-green-500/50',
  },
  in_progress: {
    icon: Loader2,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/30 to-yellow-500/10',
    borderColor: 'border-amber-500/50',
  },
  pending: {
    icon: Clock,
    color: 'text-white/40',
    bgColor: 'from-white/10 to-white/5',
    borderColor: 'border-white/20',
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'from-red-500/30 to-rose-500/10',
    borderColor: 'border-red-500/50',
  },
  blocked: {
    icon: Lock,
    color: 'text-white/30',
    bgColor: 'from-white/5 to-transparent',
    borderColor: 'border-white/10',
  },
}

function ProcessNodeComponent({ data, selected }: NodeProps<ProcessNodeData>) {
  const config = statusConfig[data.status]
  const StatusIcon = config.icon
  const PhaseIcon = phaseIcons[data.phase]
  
  return (
    <div
      className={clsx(
        'min-w-[200px] rounded-xl backdrop-blur-lg',
        'border-2 transition-all duration-200',
        `bg-gradient-to-br ${config.bgColor}`,
        config.borderColor,
        selected && 'ring-2 ring-green-500/50 shadow-lg shadow-green-500/20',
        data.status === 'in_progress' && 'pulse-animation'
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-white/30 !border-white/50 !w-3 !h-3"
      />
      
      {/* Node Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            'bg-white/10 backdrop-blur',
            config.color
          )}>
            <PhaseIcon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/50 font-medium">Phase {data.phase}</p>
            <p className="text-sm font-semibold text-white">{data.phaseName}</p>
          </div>
          <StatusIcon className={clsx(
            'w-5 h-5',
            config.color,
            data.status === 'in_progress' && 'animate-spin'
          )} />
        </div>
        
        {/* Sub-steps for verification phase */}
        {data.subSteps && data.subSteps.length > 0 && data.isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
            {data.subSteps.map((subStep) => {
              const SubIcon = statusConfig[subStep.status as keyof typeof statusConfig]?.icon || Clock
              const subConfig = statusConfig[subStep.status as keyof typeof statusConfig] || statusConfig.pending
              return (
                <div 
                  key={subStep.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <SubIcon className={clsx(
                    'w-3 h-3',
                    subConfig.color,
                    subStep.status === 'in_progress' && 'animate-spin'
                  )} />
                  <span className={clsx(
                    'flex-1 truncate',
                    subStep.status === 'completed' && 'text-green-400',
                    subStep.status === 'in_progress' && 'text-amber-400',
                    subStep.status === 'pending' && 'text-white/40',
                  )}>
                    {subStep.name}
                  </span>
                </div>
              )
            })}
          </div>
        )}
        
        {/* Collapsed sub-steps indicator */}
        {data.subSteps && data.subSteps.length > 0 && !data.isExpanded && (
          <div className="mt-2 text-xs text-white/50">
            {data.subSteps.filter(s => s.status === 'completed').length}/{data.subSteps.length} categories completed
          </div>
        )}
        
        {/* Timestamp */}
        {data.timestamp && (
          <p className="text-xs text-white/40 mt-2">
            {new Date(data.timestamp).toLocaleDateString()}
          </p>
        )}
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white/30 !border-white/50 !w-3 !h-3"
      />
    </div>
  )
}

export const ProcessNode = memo(ProcessNodeComponent)

