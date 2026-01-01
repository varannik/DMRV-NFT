/**
 * Process Store
 * 
 * Manages the current process workflow state including steps and phases.
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Process, ProcessStep, ProcessPhase, UUID } from '@/types'

interface ProcessState {
  currentProcess: Process | null
  selectedStepId: UUID | null
  isLoading: boolean
  error: string | null
  
  setProcess: (process: Process | null) => void
  selectStep: (stepId: UUID | null) => void
  updateStepStatus: (stepId: UUID, status: ProcessStep['status']) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Computed getters
  getCurrentPhase: () => ProcessPhase | null
  getProgress: () => number
  getStepsByPhase: (phase: ProcessPhase) => ProcessStep[]
}

export const useProcessStore = create<ProcessState>()(
  devtools(
    (set, get) => ({
      currentProcess: null,
      selectedStepId: null,
      isLoading: false,
      error: null,
      
      setProcess: (process) => set({ currentProcess: process }),
      
      selectStep: (stepId) => set({ selectedStepId: stepId }),
      
      updateStepStatus: (stepId, status) => {
        const process = get().currentProcess
        if (!process) return
        
        const updatedSteps = process.steps.map(step =>
          step.step_id === stepId ? { ...step, status } : step
        )
        
        set({
          currentProcess: {
            ...process,
            steps: updatedSteps,
          },
        })
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      getCurrentPhase: () => {
        const process = get().currentProcess
        return process?.current_phase ?? null
      },
      
      getProgress: () => {
        const process = get().currentProcess
        if (!process) return 0
        
        const completedSteps = process.steps.filter(s => s.status === 'completed').length
        const totalSteps = process.steps.length
        
        return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0
      },
      
      getStepsByPhase: (phase) => {
        const process = get().currentProcess
        if (!process) return []
        
        return process.steps.filter(s => s.phase === phase)
      },
    }),
    { name: 'ProcessStore' }
  )
)

