/**
 * useProcess Hook
 * 
 * React Query hooks for process/workflow data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProcess, getProcessSteps, updateProcessStep } from '@/lib/api'
import { useProcessStore } from '@/lib/stores'
import type { ProcessStep } from '@/types'

// Query keys
export const processKeys = {
  all: ['processes'] as const,
  details: () => [...processKeys.all, 'detail'] as const,
  detail: (id: string) => [...processKeys.details(), id] as const,
  steps: (id: string) => [...processKeys.detail(id), 'steps'] as const,
}

/**
 * Hook to fetch a process
 */
export function useProcess(processId: string) {
  const { setProcess, setLoading, setError } = useProcessStore()
  
  return useQuery({
    queryKey: processKeys.detail(processId),
    queryFn: async () => {
      const process = await getProcess(processId)
      setProcess(process)
      return process
    },
    enabled: !!processId,
    refetchInterval: 10 * 1000, // Poll every 10 seconds
  })
}

/**
 * Hook to fetch process steps
 */
export function useProcessSteps(processId: string) {
  return useQuery({
    queryKey: processKeys.steps(processId),
    queryFn: () => getProcessSteps(processId),
    enabled: !!processId,
    refetchInterval: 10 * 1000,
  })
}

/**
 * Hook to update a process step
 */
export function useUpdateProcessStep() {
  const queryClient = useQueryClient()
  const { updateStepStatus } = useProcessStore()
  
  return useMutation({
    mutationFn: ({ 
      processId, 
      stepId, 
      data 
    }: { 
      processId: string
      stepId: string
      data: Partial<ProcessStep> 
    }) => updateProcessStep(processId, stepId, data),
    onSuccess: (updatedStep, { processId }) => {
      if (updatedStep.status) {
        updateStepStatus(updatedStep.step_id, updatedStep.status)
      }
      queryClient.invalidateQueries({ queryKey: processKeys.detail(processId) })
      queryClient.invalidateQueries({ queryKey: processKeys.steps(processId) })
    },
  })
}

