/**
 * useMRVSubmissions Hook
 * 
 * React Query hooks for MRV submission data fetching.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getMRVSubmissions, 
  getMRVSubmission, 
  createMRVSubmission,
  getMRVSubmissionProcess,
} from '@/lib/api'
import { useMRVStore } from '@/lib/stores'
import type { MRVSubmission } from '@/types'

// Query keys
export const mrvKeys = {
  all: ['mrv-submissions'] as const,
  lists: () => [...mrvKeys.all, 'list'] as const,
  list: (projectId: string) => [...mrvKeys.lists(), projectId] as const,
  details: () => [...mrvKeys.all, 'detail'] as const,
  detail: (id: string) => [...mrvKeys.details(), id] as const,
  process: (id: string) => [...mrvKeys.detail(id), 'process'] as const,
}

/**
 * Hook to fetch MRV submissions for a project
 */
export function useMRVSubmissions(projectId: string) {
  const { setSubmissions, setLoading, setError } = useMRVStore()
  
  return useQuery({
    queryKey: mrvKeys.list(projectId),
    queryFn: async () => {
      const response = await getMRVSubmissions(projectId)
      setSubmissions(response.data)
      return response.data
    },
    enabled: !!projectId,
    staleTime: 30 * 1000, // 30 seconds - more frequent updates for submissions
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  })
}

/**
 * Hook to fetch a single MRV submission
 */
export function useMRVSubmission(submissionId: string) {
  return useQuery({
    queryKey: mrvKeys.detail(submissionId),
    queryFn: () => getMRVSubmission(submissionId),
    enabled: !!submissionId,
  })
}

/**
 * Hook to create a new MRV submission
 */
export function useCreateMRVSubmission() {
  const queryClient = useQueryClient()
  const { addSubmission } = useMRVStore()
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<MRVSubmission> }) =>
      createMRVSubmission(projectId, data),
    onSuccess: (newSubmission, { projectId }) => {
      addSubmission(newSubmission)
      queryClient.invalidateQueries({ queryKey: mrvKeys.list(projectId) })
    },
  })
}

/**
 * Hook to fetch the process/workflow for an MRV submission
 */
export function useMRVSubmissionProcess(submissionId: string) {
  return useQuery({
    queryKey: mrvKeys.process(submissionId),
    queryFn: () => getMRVSubmissionProcess(submissionId),
    enabled: !!submissionId,
    refetchInterval: 10 * 1000, // Poll every 10 seconds for process updates
  })
}

