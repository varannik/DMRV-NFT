/**
 * Registry Store - Zustand State Management
 * 
 * Manages the state for the registry-driven data injection system.
 * Handles registry/protocol selection, session management, and calculations.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  RegistryStore,
  RegistryConfig,
  DataInjectionSession,
  NetCORCResult,
  GapAnalysis,
  FieldState,
  NodeState,
  InputMethod,
  FormulaNode,
} from '@/types/registry'
import type { RegistryType, UUID } from '@/types'
import { 
  registryConfigs, 
  getRegistryConfig, 
  getProtocolConfig 
} from '@/config/registries'

/**
 * Calculate Net CORC based on field values and formula tree
 */
function calculateNetCORCFromSession(session: DataInjectionSession): NetCORCResult {
  const fieldValues = session.field_values
  
  // Extract values from field states
  const getValue = (fieldId: string): number => {
    const field = fieldValues[fieldId]
    return typeof field?.value === 'number' ? field.value : 0
  }
  
  // Calculate based on protocol formulas
  const grossRemoval = getValue('gross_removal')
  const scope1 = getValue('scope_1')
  const scope2 = getValue('scope_2')
  const scope3 = getValue('scope_3')
  const leakageFactor = getValue('leakage_factor') / 100 || 0.05
  const bufferRate = getValue('buffer_rate') / 100 || 0.15
  
  const projectEmissions = scope1 + scope2 + scope3
  const leakage = grossRemoval * leakageFactor
  const buffer = (grossRemoval - leakage) * bufferRate
  const netCorc = grossRemoval - projectEmissions - leakage - buffer
  
  return {
    net_corc: Math.max(0, netCorc),
    gross_removal: grossRemoval,
    total_emissions: projectEmissions,
    leakage,
    buffer,
    node_values: {
      removal_data: grossRemoval,
      project_emissions: projectEmissions,
      leakage,
      buffer,
    },
    formula: 'removal_data - project_emissions - leakage - buffer',
    calculated_at: new Date().toISOString(),
    is_valid: grossRemoval > 0 && netCorc > 0,
    validation_errors: netCorc <= 0 ? ['Net CORC must be positive'] : undefined,
  }
}

/**
 * Run gap analysis on a session
 */
function runGapAnalysisOnSession(
  session: DataInjectionSession, 
  registryId: RegistryType, 
  protocolId: string
): GapAnalysis {
  const protocol = getProtocolConfig(registryId, protocolId)
  if (!protocol) {
    return {
      protocol_id: protocolId,
      completeness_score: 0,
      can_proceed_to_computation: false,
      node_analysis: {},
      missing_required_fields: [],
      missing_evidence_types: [],
      recommendations: ['Protocol not found'],
    }
  }
  
  const missingFields: string[] = []
  const missingEvidence: string[] = []
  const nodeAnalysis: GapAnalysis['node_analysis'] = {}
  
  // Recursively analyze nodes
  function analyzeNode(node: FormulaNode): void {
    if (node.node_type === 'input' && node.required_inputs) {
      let nodeComplete = true
      let nodeScore = 0
      const nodeMissing: string[] = []
      
      for (const input of node.required_inputs) {
        const fieldState = session.field_values[input.field_id]
        const hasValue = fieldState?.status === 'filled' && fieldState.value !== null && fieldState.value !== undefined
        
        if (hasValue) {
          nodeScore++
        } else if (input.required) {
          nodeComplete = false
          nodeMissing.push(input.field_id)
          missingFields.push(`${node.node_name}.${input.field_name}`)
          
          if (input.field_type === 'file') {
            missingEvidence.push(input.field_name)
          }
        }
      }
      
      nodeAnalysis[node.node_id] = {
        node_id: node.node_id,
        node_name: node.node_name,
        complete: nodeComplete,
        score: node.required_inputs.length > 0 
          ? Math.round((nodeScore / node.required_inputs.length) * 100) 
          : 100,
        missing_fields: nodeMissing,
        errors: [],
      }
    }
    
    // Recurse into children
    if (node.children) {
      for (const child of node.children) {
        analyzeNode(child)
      }
    }
  }
  
  analyzeNode(protocol.net_corc_formula)
  
  // Calculate overall score
  const nodeScores = Object.values(nodeAnalysis)
  const completenessScore = nodeScores.length > 0
    ? Math.round(nodeScores.reduce((sum, n) => sum + n.score, 0) / nodeScores.length)
    : 0
  
  const canProceed = completenessScore >= 80 && missingFields.length === 0
  
  const recommendations: string[] = []
  if (missingFields.length > 0) {
    recommendations.push(`Complete ${missingFields.length} required field(s)`)
  }
  if (missingEvidence.length > 0) {
    recommendations.push(`Upload ${missingEvidence.length} required document(s)`)
  }
  if (completenessScore < 80) {
    recommendations.push('Reach 80% completeness to proceed')
  }
  
  return {
    protocol_id: protocolId,
    completeness_score: completenessScore,
    can_proceed_to_computation: canProceed,
    node_analysis: nodeAnalysis,
    missing_required_fields: missingFields,
    missing_evidence_types: missingEvidence,
    recommendations,
  }
}

/**
 * Create initial node states from protocol config
 */
function createInitialNodeStates(registryId: RegistryType, protocolId: string) {
  const protocol = getProtocolConfig(registryId, protocolId)
  if (!protocol) return {}
  
  const nodeStates: { [node_id: string]: NodeState } = {}
  
  function initNode(node: FormulaNode): void {
    nodeStates[node.node_id] = {
      node_id: node.node_id,
      status: 'empty',
      progress_percent: 0,
    }
    
    if (node.children) {
      for (const child of node.children) {
        initNode(child)
      }
    }
  }
  
  initNode(protocol.net_corc_formula)
  return nodeStates
}

/**
 * Create initial field states from protocol config
 */
function createInitialFieldStates(registryId: RegistryType, protocolId: string) {
  const protocol = getProtocolConfig(registryId, protocolId)
  if (!protocol) return {}
  
  const fieldStates: { [field_id: string]: FieldState } = {}
  
  function initFields(node: FormulaNode): void {
    if (node.required_inputs) {
      for (const input of node.required_inputs) {
        fieldStates[input.field_id] = {
          field_id: input.field_id,
          value: input.default_value ?? null,
          source: null,
          status: input.default_value !== undefined ? 'filled' : 'empty',
        }
        
        // Handle nested fields
        if (input.nested_fields) {
          for (const nested of input.nested_fields) {
            fieldStates[nested.field_id] = {
              field_id: nested.field_id,
              value: null,
              source: null,
              status: 'empty',
            }
          }
        }
      }
    }
    
    if (node.children) {
      for (const child of node.children) {
        initFields(child)
      }
    }
  }
  
  initFields(protocol.net_corc_formula)
  return fieldStates
}

/**
 * Registry Store Implementation
 */
export const useRegistryStore = create<RegistryStore>()(
  persist(
    (set, get) => ({
      // Initial state
      registries: registryConfigs,
      selectedRegistryId: null,
      selectedProtocolId: null,
      currentSession: null,
      isLoadingRegistries: false,
      isLoadingProtocol: false,
      isSaving: false,
      isCalculating: false,
      error: null,
      
      // Actions
      loadRegistries: async () => {
        set({ isLoadingRegistries: true, error: null })
        try {
          // In production, this would fetch from API
          // const response = await fetch('/api/v1/registries')
          // const data = await response.json()
          // set({ registries: data.registries })
          
          // For now, use static configs
          set({ registries: registryConfigs })
        } catch (error) {
          set({ error: 'Failed to load registries' })
        } finally {
          set({ isLoadingRegistries: false })
        }
      },
      
      selectRegistry: (registryId: RegistryType) => {
        const registry = getRegistryConfig(registryId)
        if (registry) {
          set({ 
            selectedRegistryId: registryId,
            selectedProtocolId: null, // Reset protocol when registry changes
          })
        }
      },
      
      selectProtocol: (protocolId: string) => {
        const { selectedRegistryId } = get()
        if (selectedRegistryId) {
          const protocol = getProtocolConfig(selectedRegistryId, protocolId)
          if (protocol) {
            set({ selectedProtocolId: protocolId })
          }
        }
      },
      
      createSession: async (projectId: UUID) => {
        const { selectedRegistryId, selectedProtocolId } = get()
        
        if (!selectedRegistryId || !selectedProtocolId) {
          throw new Error('Registry and protocol must be selected')
        }
        
        const session: DataInjectionSession = {
          session_id: crypto.randomUUID() as UUID,
          project_id: projectId,
          registry_id: selectedRegistryId,
          protocol_id: selectedProtocolId,
          status: 'draft',
          overall_progress: 0,
          node_states: createInitialNodeStates(selectedRegistryId, selectedProtocolId),
          field_values: createInitialFieldStates(selectedRegistryId, selectedProtocolId),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        
        set({ currentSession: session })
        return session
      },
      
      loadSession: async (sessionId: UUID) => {
        set({ isLoadingProtocol: true, error: null })
        try {
          // In production, fetch from API
          // const response = await fetch(`/api/v1/mrv/sessions/${sessionId}`)
          // const session = await response.json()
          // set({ currentSession: session })
          
          // For demo, just keep current session
          console.log('Loading session:', sessionId)
        } catch (error) {
          set({ error: 'Failed to load session' })
        } finally {
          set({ isLoadingProtocol: false })
        }
      },
      
      saveSession: async () => {
        const { currentSession } = get()
        if (!currentSession) return
        
        set({ isSaving: true, error: null })
        try {
          // In production, save to API
          // await fetch(`/api/v1/mrv/sessions/${currentSession.session_id}`, {
          //   method: 'PUT',
          //   body: JSON.stringify(currentSession),
          // })
          
          set({ 
            currentSession: {
              ...currentSession,
              updated_at: new Date().toISOString(),
            }
          })
        } catch (error) {
          set({ error: 'Failed to save session' })
        } finally {
          set({ isSaving: false })
        }
      },
      
      updateFieldValue: (fieldId: string, value: unknown, source: InputMethod) => {
        const { currentSession } = get()
        if (!currentSession) return
        
        const updatedFieldValues = {
          ...currentSession.field_values,
          [fieldId]: {
            field_id: fieldId,
            value,
            source,
            status: value !== null && value !== undefined && value !== '' ? 'filled' : 'empty',
            last_updated: new Date().toISOString(),
          } as FieldState,
        }
        
        // Calculate progress
        const filledCount = Object.values(updatedFieldValues).filter(
          f => f.status === 'filled'
        ).length
        const totalCount = Object.keys(updatedFieldValues).length
        const progress = Math.round((filledCount / totalCount) * 100)
        
        set({
          currentSession: {
            ...currentSession,
            field_values: updatedFieldValues,
            overall_progress: progress,
            status: progress > 0 ? 'in_progress' : 'draft',
            updated_at: new Date().toISOString(),
          },
        })
      },
      
      uploadFile: async (fieldId: string, file: File) => {
        const { updateFieldValue } = get()
        
        // In production, upload to S3 or similar
        // const formData = new FormData()
        // formData.append('file', file)
        // const response = await fetch('/api/v1/upload', { method: 'POST', body: formData })
        // const { url } = await response.json()
        
        // For now, create a local URL
        const url = URL.createObjectURL(file)
        
        updateFieldValue(fieldId, {
          file_id: crypto.randomUUID(),
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          upload_date: new Date().toISOString(),
          storage_url: url,
        }, 'upload')
      },
      
      calculateNetCORC: async () => {
        const { currentSession } = get()
        if (!currentSession) {
          throw new Error('No active session')
        }
        
        set({ isCalculating: true, error: null })
        try {
          const result = calculateNetCORCFromSession(currentSession)
          
          set({
            currentSession: {
              ...currentSession,
              net_corc: result.net_corc,
              updated_at: new Date().toISOString(),
            },
          })
          
          return result
        } catch (error) {
          set({ error: 'Failed to calculate Net CORC' })
          throw error
        } finally {
          set({ isCalculating: false })
        }
      },
      
      runGapAnalysis: async () => {
        const { currentSession, selectedRegistryId, selectedProtocolId } = get()
        
        if (!currentSession || !selectedRegistryId || !selectedProtocolId) {
          throw new Error('No active session or protocol selected')
        }
        
        return runGapAnalysisOnSession(currentSession, selectedRegistryId, selectedProtocolId)
      },
      
      submitForComputation: async () => {
        const { currentSession, runGapAnalysis } = get()
        if (!currentSession) {
          throw new Error('No active session')
        }
        
        // Run gap analysis first
        const analysis = await runGapAnalysis()
        
        if (!analysis.can_proceed_to_computation) {
          throw new Error('Cannot proceed: Gap analysis failed. ' + analysis.recommendations.join('. '))
        }
        
        set({ isSaving: true, error: null })
        try {
          // In production, submit to API
          // await fetch(`/api/v1/mrv/sessions/${currentSession.session_id}/submit`, {
          //   method: 'POST',
          // })
          
          set({
            currentSession: {
              ...currentSession,
              status: 'submitted',
              submitted_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          })
        } catch (error) {
          set({ error: 'Failed to submit for computation' })
          throw error
        } finally {
          set({ isSaving: false })
        }
      },
      
      reset: () => {
        set({
          selectedRegistryId: null,
          selectedProtocolId: null,
          currentSession: null,
          error: null,
        })
      },
    }),
    {
      name: 'dmrv-registry-store',
      partialize: (state) => ({
        selectedRegistryId: state.selectedRegistryId,
        selectedProtocolId: state.selectedProtocolId,
        // Don't persist session - should be loaded from API
      }),
    }
  )
)

export default useRegistryStore

