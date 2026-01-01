'use client'

/**
 * StepsTracker Component
 * 
 * Right sidebar showing the process steps and progress for the selected block.
 */

import { useMemo } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  Lock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { GlassCard } from '@/components/shared'
import { PROCESS_PHASES, VERIFICATION_CATEGORIES } from '@/types'
import type { ProcessPhase, ProcessStep } from '@/types'

interface StepsTrackerProps {
  steps: ProcessStep[]
  currentPhase: ProcessPhase
  onStepClick?: (stepId: string, phase: ProcessPhase) => void
  isLoading?: boolean
}

const statusIcons = {
  completed: CheckCircle2,
  in_progress: Loader2,
  pending: Clock,
  failed: XCircle,
  blocked: Lock,
}

const statusColors = {
  completed: 'text-green-400 bg-green-500/20 border-green-500/30',
  in_progress: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
  pending: 'text-white/40 bg-white/5 border-white/10',
  failed: 'text-red-400 bg-red-500/20 border-red-500/30',
  blocked: 'text-white/30 bg-white/5 border-white/10',
}

export function StepsTracker({ 
  steps, 
  currentPhase, 
  onStepClick,
  isLoading 
}: StepsTrackerProps) {
  const { completedSteps, totalSteps, progress } = useMemo(() => {
    const completed = steps.filter(s => s.status === 'completed').length
    const total = steps.length || 8
    return {
      completedSteps: completed,
      totalSteps: total,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }, [steps])
  
  // Generate steps if not provided (for demo)
  const displaySteps = useMemo(() => {
    if (steps.length > 0) return steps
    
    // Generate demo steps based on current phase
    return Object.entries(PROCESS_PHASES).map(([phase, info]) => {
      const phaseNum = parseInt(phase) as ProcessPhase
      let status: ProcessStep['status'] = 'pending'
      
      if (phaseNum < currentPhase) {
        status = 'completed'
      } else if (phaseNum === currentPhase) {
        status = 'in_progress'
      }
      
      return {
        step_id: `step-${phase}`,
        process_id: 'demo',
        phase: phaseNum,
        phase_name: info.name,
        status,
        sub_steps: phaseNum === 3 ? VERIFICATION_CATEGORIES.map((cat, i) => ({
          id: `cat-${i}`,
          name: cat,
          status: i < 5 ? 'completed' : i === 5 ? 'in_progress' : 'pending',
          order: i,
        })) : undefined,
      } as ProcessStep
    })
  }, [steps, currentPhase])
  
  if (isLoading) {
    return (
      <GlassCard className="w-80 h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </GlassCard>
    )
  }
  
  return (
    <GlassCard className="w-80 flex flex-col max-h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white mb-1">Process Steps</h3>
        <p className="text-sm text-white/60">
          Track your credit issuance progress
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-white/70">Progress</span>
          <span className="text-white font-medium">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-white/50 mt-2">
          <span>{completedSteps}/{totalSteps} phases</span>
          <span>ETA: 2-3 weeks</span>
        </div>
      </div>
      
      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {displaySteps.map((step, index) => {
            const Icon = statusIcons[step.status]
            const isCurrentStep = step.phase === currentPhase
            const hasSubSteps = step.sub_steps && step.sub_steps.length > 0
            
            return (
              <motion.div
                key={step.step_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => onStepClick?.(step.step_id, step.phase)}
                  className={clsx(
                    'w-full text-left p-3 rounded-xl border transition-all duration-200',
                    statusColors[step.status],
                    isCurrentStep && 'ring-2 ring-amber-500/50',
                    'hover:bg-white/10'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      step.status === 'completed' && 'bg-green-500/30',
                      step.status === 'in_progress' && 'bg-amber-500/30',
                      step.status === 'pending' && 'bg-white/10',
                      step.status === 'failed' && 'bg-red-500/30',
                      step.status === 'blocked' && 'bg-white/5',
                    )}>
                      <Icon className={clsx(
                        'w-4 h-4',
                        step.status === 'in_progress' && 'animate-spin'
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white/50">
                          Phase {step.phase}
                        </span>
                        {isCurrentStep && (
                          <span className="px-1.5 py-0.5 rounded text-xs bg-amber-500/30 text-amber-400">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-white truncate">
                        {step.phase_name}
                      </p>
                      {hasSubSteps && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                          {step.status === 'in_progress' ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          {step.sub_steps?.filter(s => s.status === 'completed').length}/{step.sub_steps?.length} completed
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Sub-steps for verification phase */}
                  {hasSubSteps && step.status === 'in_progress' && (
                    <div className="mt-3 ml-11 space-y-1.5">
                      {step.sub_steps?.map((subStep) => {
                        const SubIcon = statusIcons[subStep.status as keyof typeof statusIcons]
                        return (
                          <div 
                            key={subStep.id}
                            className="flex items-center gap-2 text-xs"
                          >
                            <SubIcon className={clsx(
                              'w-3 h-3',
                              subStep.status === 'completed' && 'text-green-400',
                              subStep.status === 'in_progress' && 'text-amber-400 animate-spin',
                              subStep.status === 'pending' && 'text-white/30',
                            )} />
                            <span className={clsx(
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
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </GlassCard>
  )
}

