/**
 * Registry Hooks
 * 
 * React Query hooks for fetching and managing registry data.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { RegistryConfig, ProtocolConfig, GapAnalysis, NetCORCResult } from '@/types/registry'
import type { RegistryType, UUID } from '@/types'
import { 
  registryConfigs, 
  getRegistryConfig, 
  getProtocolConfig,
  getRegistrySummaries,
} from '@/config/registries'

// Query keys
export const registryKeys = {
  all: ['registries'] as const,
  list: () => [...registryKeys.all, 'list'] as const,
  detail: (id: RegistryType) => [...registryKeys.all, 'detail', id] as const,
  protocol: (registryId: RegistryType, protocolId: string) => 
    [...registryKeys.all, 'protocol', registryId, protocolId] as const,
  gapAnalysis: (sessionId: UUID) => [...registryKeys.all, 'gap-analysis', sessionId] as const,
}

/**
 * Hook to fetch all available registries
 */
export function useRegistries() {
  return useQuery({
    queryKey: registryKeys.list(),
    queryFn: async (): Promise<RegistryConfig[]> => {
      // In production, fetch from API:
      // const response = await fetch('/api/v1/registries')
      // return response.json()
      
      // For now, return static configs
      return registryConfigs
    },
    staleTime: 1000 * 60 * 60, // 1 hour - registries don't change often
  })
}

/**
 * Hook to get registry summaries for dropdowns
 */
export function useRegistrySummaries() {
  return useQuery({
    queryKey: [...registryKeys.list(), 'summaries'],
    queryFn: async () => {
      return getRegistrySummaries()
    },
    staleTime: 1000 * 60 * 60,
  })
}

/**
 * Hook to fetch a specific registry
 */
export function useRegistry(registryId: RegistryType | null) {
  return useQuery({
    queryKey: registryKeys.detail(registryId as RegistryType),
    queryFn: async (): Promise<RegistryConfig | null> => {
      if (!registryId) return null
      
      // In production:
      // const response = await fetch(`/api/v1/registries/${registryId}`)
      // return response.json()
      
      return getRegistryConfig(registryId) ?? null
    },
    enabled: !!registryId,
    staleTime: 1000 * 60 * 60,
  })
}

/**
 * Hook to fetch a specific protocol
 */
export function useProtocol(registryId: RegistryType | null, protocolId: string | null) {
  return useQuery({
    queryKey: registryKeys.protocol(registryId as RegistryType, protocolId as string),
    queryFn: async (): Promise<ProtocolConfig | null> => {
      if (!registryId || !protocolId) return null
      
      // In production:
      // const response = await fetch(`/api/v1/registries/${registryId}/protocols/${protocolId}`)
      // return response.json()
      
      return getProtocolConfig(registryId, protocolId) ?? null
    },
    enabled: !!registryId && !!protocolId,
    staleTime: 1000 * 60 * 60,
  })
}

/**
 * Hook to get the protocol tree for rendering
 */
export function useProtocolTree(registryId: RegistryType | null, protocolId: string | null) {
  const { data: protocol, isLoading, error } = useProtocol(registryId, protocolId)
  
  return {
    tree: protocol?.net_corc_formula ?? null,
    protocol,
    isLoading,
    error,
  }
}

/**
 * Hook for calculating Net CORC
 */
export function useCalculateNetCORC() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (sessionId: UUID): Promise<NetCORCResult> => {
      // In production:
      // const response = await fetch(`/api/v1/mrv/sessions/${sessionId}/calculate`, {
      //   method: 'POST',
      // })
      // return response.json()
      
      // For now, calculation is done in the store
      throw new Error('Use store.calculateNetCORC() instead')
    },
    onSuccess: (data, sessionId) => {
      queryClient.invalidateQueries({ queryKey: registryKeys.gapAnalysis(sessionId) })
    },
  })
}

/**
 * Hook for running gap analysis
 */
export function useGapAnalysis(sessionId: UUID | null) {
  return useQuery({
    queryKey: registryKeys.gapAnalysis(sessionId as UUID),
    queryFn: async (): Promise<GapAnalysis | null> => {
      if (!sessionId) return null
      
      // In production:
      // const response = await fetch(`/api/v1/mrv/sessions/${sessionId}/gap-analysis`)
      // return response.json()
      
      // For now, this is calculated in the store
      return null
    },
    enabled: !!sessionId,
    staleTime: 1000 * 30, // 30 seconds - gap analysis can change frequently
  })
}

/**
 * Hook for submitting data injection for computation
 */
export function useSubmitForComputation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (sessionId: UUID): Promise<{ success: boolean; mrv_submission_id: UUID }> => {
      // In production:
      // const response = await fetch(`/api/v1/mrv/sessions/${sessionId}/submit`, {
      //   method: 'POST',
      // })
      // return response.json()
      
      // Mock response
      return {
        success: true,
        mrv_submission_id: crypto.randomUUID() as UUID,
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mrv'] })
    },
  })
}

/**
 * Hook for uploading files
 */
export function useUploadFile() {
  return useMutation({
    mutationFn: async ({ 
      sessionId, 
      fieldId, 
      file 
    }: { 
      sessionId: UUID
      fieldId: string
      file: File 
    }): Promise<{ url: string; file_id: string }> => {
      // In production:
      // const formData = new FormData()
      // formData.append('file', file)
      // formData.append('session_id', sessionId)
      // formData.append('field_id', fieldId)
      // const response = await fetch('/api/v1/upload', {
      //   method: 'POST',
      //   body: formData,
      // })
      // return response.json()
      
      // Mock response
      return {
        url: URL.createObjectURL(file),
        file_id: crypto.randomUUID(),
      }
    },
  })
}

/**
 * Hook for downloading Excel template
 */
export function useDownloadTemplate() {
  return useMutation({
    mutationFn: async ({ 
      registryId, 
      protocolId 
    }: { 
      registryId: RegistryType
      protocolId: string 
    }): Promise<Blob> => {
      const protocol = getProtocolConfig(registryId, protocolId)
      
      if (!protocol?.excel_template) {
        throw new Error('No template available for this protocol')
      }
      
      // In production:
      // const response = await fetch(`/api/v1/registries/${registryId}/protocols/${protocolId}/template`)
      // return response.blob()
      
      // For now, just return an empty blob
      throw new Error('Template download not implemented')
    },
  })
}

