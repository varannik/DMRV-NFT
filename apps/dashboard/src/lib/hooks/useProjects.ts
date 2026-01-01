/**
 * useProjects Hook
 * 
 * React Query hooks for project data fetching and mutations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, getProject, createProject, updateProject, deleteProject } from '@/lib/api'
import { useProjectStore } from '@/lib/stores'
import type { Project } from '@/types'

// Query keys
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (filters: Record<string, string>) => [...projectKeys.lists(), { filters }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
}

/**
 * Hook to fetch all projects
 */
export function useProjects() {
  const { setProjects, setLoading, setError } = useProjectStore()
  
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const response = await getProjects()
      setProjects(response.data)
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single project
 */
export function useProject(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
  })
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<Project>) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

/**
 * Hook to update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<Project> }) =>
      updateProject(projectId, data),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

/**
 * Hook to delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

