/**
 * DMRV Dashboard - Registry Configuration Type Definitions
 * 
 * These types define the configuration-driven registry system that allows
 * new registries and protocols to be added without code changes.
 * 
 * Based on COMPREHENSIVE_WORKFLOWS.md Section 3.0.4
 */

import type { RegistryType, UUID } from './index'

// ============================================
// Registry Configuration Types
// ============================================

/**
 * Root configuration for a carbon registry (e.g., Verra, Puro, Isometric)
 */
export interface RegistryConfig {
  registry_id: RegistryType
  registry_name: string
  version: string
  description?: string
  logo_url?: string
  website_url?: string
  protocols: ProtocolConfig[]
}

/**
 * Configuration for a specific methodology/protocol within a registry
 */
export interface ProtocolConfig {
  protocol_id: string
  protocol_name: string
  version: string
  description?: string
  documentation_url?: string
  
  // The tree structure defining Net CORC calculation
  net_corc_formula: FormulaNode
  
  // Excel template for bulk upload
  excel_template?: string
  
  // API endpoints configuration
  api_endpoints?: APIEndpointConfig[]
}

// ============================================
// Formula Tree Node Types
// ============================================

/**
 * Type of node in the formula tree
 * - calculated: A node whose value is computed from a formula
 * - input: A node that requires user input
 * - operator: A mathematical operator connecting nodes
 */
export type NodeType = 'calculated' | 'input' | 'operator'

/**
 * Mathematical operators for formula nodes
 */
export type Operator = '+' | '-' | '*' | '/'

/**
 * A node in the Net CORC calculation tree
 */
export interface FormulaNode {
  node_id: string
  node_name: string
  node_type: NodeType
  description?: string
  
  // For calculated nodes - the formula expression
  formula?: string
  
  // For operator nodes
  operator?: Operator
  
  // For input nodes - list of required data fields
  required_inputs?: InputField[]
  
  // Child nodes in the tree
  children?: FormulaNode[]
  
  // Display options
  display?: NodeDisplayOptions
}

/**
 * Display options for a formula node
 */
export interface NodeDisplayOptions {
  icon?: string
  color?: string
  collapsed_by_default?: boolean
  show_formula?: boolean
}

// ============================================
// Input Field Types
// ============================================

/**
 * Type of data for an input field
 */
export type FieldType = 'number' | 'string' | 'boolean' | 'file' | 'array' | 'object' | 'date'

/**
 * Methods available for inputting data
 */
export type InputMethod = 'api' | 'excel' | 'upload' | 'manual'

/**
 * Configuration for a required input field
 */
export interface InputField {
  field_id: string
  field_name: string
  field_type: FieldType
  description?: string
  
  // Unit of measurement (e.g., "tCO₂e", "kWh", "%")
  unit?: string
  
  // Whether this field is required
  required: boolean
  
  // Default value if not provided
  default_value?: unknown
  
  // Validation rules
  validation_rules?: ValidationRule[]
  
  // Allowed input methods
  input_methods: InputMethod[]
  
  // API specification for programmatic input
  api_spec?: APIFieldSpec
  
  // Excel column mapping
  excel_column?: string
  
  // For array/object types - nested field definitions
  nested_fields?: InputField[]
  
  // Conditional visibility
  visible_when?: ConditionalRule
  
  // Help text or tooltip
  help_text?: string
}

// ============================================
// Validation Types
// ============================================

/**
 * Types of validation rules
 */
export type ValidationType = 
  | 'required'
  | 'min'
  | 'max'
  | 'range'
  | 'pattern'
  | 'enum'
  | 'custom'
  | 'file_type'
  | 'file_size'

/**
 * A validation rule for an input field
 */
export interface ValidationRule {
  type: ValidationType
  value?: unknown
  min?: number
  max?: number
  pattern?: string
  values?: unknown[]
  message?: string
  custom_validator?: string
}

/**
 * Conditional rule for field visibility or requirements
 */
export interface ConditionalRule {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains'
  value: unknown
}

// ============================================
// API Configuration Types
// ============================================

/**
 * API endpoint configuration
 */
export interface APIEndpointConfig {
  endpoint_id: string
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  description?: string
  request_schema?: object
  response_schema?: object
}

/**
 * API field specification for programmatic input
 */
export interface APIFieldSpec {
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH'
  field_path?: string
  transform?: string
}

// ============================================
// Data Injection State Types
// ============================================

/**
 * Status of a data injection node
 */
export type DataInjectionStatus = 
  | 'empty'
  | 'partial'
  | 'complete'
  | 'error'
  | 'validating'
  | 'calculating'

/**
 * State of a single node in the data injection tree
 */
export interface NodeState {
  node_id: string
  status: DataInjectionStatus
  value?: number | string | null
  calculated_value?: number
  progress_percent: number
  errors?: string[]
  warnings?: string[]
  last_updated?: string
}

/**
 * State of all input fields for a node
 */
export interface FieldsState {
  [field_id: string]: FieldState
}

/**
 * State of a single input field
 */
export interface FieldState {
  field_id: string
  value: unknown
  source: InputMethod | null
  status: 'empty' | 'filled' | 'error' | 'validating'
  validation_errors?: string[]
  uploaded_file?: UploadedFile
  last_updated?: string
}

/**
 * Information about an uploaded file
 */
export interface UploadedFile {
  file_id: string
  file_name: string
  file_type: string
  file_size: number
  upload_date: string
  storage_url?: string
}

// ============================================
// Data Injection Session Types
// ============================================

/**
 * A data injection session for a project
 */
export interface DataInjectionSession {
  session_id: UUID
  project_id: UUID
  registry_id: RegistryType
  protocol_id: string
  
  // Overall status
  status: 'draft' | 'in_progress' | 'submitted' | 'validated' | 'error'
  
  // Progress tracking
  overall_progress: number
  
  // Node states
  node_states: { [node_id: string]: NodeState }
  
  // Field values
  field_values: { [field_id: string]: FieldState }
  
  // Calculated Net CORC
  net_corc?: number
  
  // Timestamps
  created_at: string
  updated_at: string
  submitted_at?: string
}

// ============================================
// Net CORC Calculation Types
// ============================================

/**
 * Result of a Net CORC calculation
 */
export interface NetCORCResult {
  net_corc: number
  gross_removal: number
  total_emissions: number
  leakage: number
  buffer: number
  
  // Breakdown by node
  node_values: { [node_id: string]: number }
  
  // Formula used
  formula: string
  
  // Calculation timestamp
  calculated_at: string
  
  // Validation status
  is_valid: boolean
  validation_errors?: string[]
}

// ============================================
// Gap Analysis Types
// ============================================

/**
 * Result of a gap analysis for a protocol
 */
export interface GapAnalysis {
  protocol_id: string
  completeness_score: number
  can_proceed_to_computation: boolean
  
  // Per-node analysis
  node_analysis: { [node_id: string]: NodeGapAnalysis }
  
  // Missing required fields
  missing_required_fields: string[]
  
  // Missing evidence/files
  missing_evidence_types: string[]
  
  // Recommendations
  recommendations: string[]
}

/**
 * Gap analysis for a single node
 */
export interface NodeGapAnalysis {
  node_id: string
  node_name: string
  complete: boolean
  score: number
  missing_fields: string[]
  errors: string[]
}

// ============================================
// Registry Store Types
// ============================================

/**
 * State for the registry store
 */
export interface RegistryState {
  // Available registries
  registries: RegistryConfig[]
  
  // Currently selected registry and protocol
  selectedRegistryId: RegistryType | null
  selectedProtocolId: string | null
  
  // Current data injection session
  currentSession: DataInjectionSession | null
  
  // Loading states
  isLoadingRegistries: boolean
  isLoadingProtocol: boolean
  isSaving: boolean
  isCalculating: boolean
  
  // Errors
  error: string | null
}

/**
 * Actions for the registry store
 */
export interface RegistryActions {
  // Load registries
  loadRegistries: () => Promise<void>
  
  // Select registry and protocol
  selectRegistry: (registryId: RegistryType) => void
  selectProtocol: (protocolId: string) => void
  
  // Session management
  createSession: (projectId: UUID) => Promise<DataInjectionSession>
  loadSession: (sessionId: UUID) => Promise<void>
  saveSession: () => Promise<void>
  
  // Field updates
  updateFieldValue: (fieldId: string, value: unknown, source: InputMethod) => void
  uploadFile: (fieldId: string, file: File) => Promise<void>
  
  // Calculations
  calculateNetCORC: () => Promise<NetCORCResult>
  runGapAnalysis: () => Promise<GapAnalysis>
  
  // Submit for computation
  submitForComputation: () => Promise<void>
  
  // Reset
  reset: () => void
}

export type RegistryStore = RegistryState & RegistryActions

