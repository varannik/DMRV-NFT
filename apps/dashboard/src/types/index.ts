/**
 * DMRV Dashboard - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the dashboard application. Based on DATA_SCHEMA.md and STATE_MANAGEMENT.md.
 */

// ============================================
// Base Types
// ============================================

export type UUID = string

export type Status = 'pending' | 'in_progress' | 'approved' | 'rejected' | 'failed' | 'completed' | 'active' | 'draft' | 'retired'

export type RegistryType = 'verra' | 'puro' | 'isometric' | 'eu_ets'

export type ProcessPhase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  user_id: UUID
  email: string
  name: string
  avatar_url?: string
  role: 'admin' | 'operator' | 'verifier' | 'viewer'
  tenant_id: UUID
  mfa_enabled: boolean
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  mfaRequired: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface MFAVerification {
  code: string
  session_token: string
}

// ============================================
// Tenant Types
// ============================================

export interface Tenant {
  tenant_id: UUID
  name: string
  slug: string
  logo_url?: string
  settings: TenantSettings
  subscription_tier: 'starter' | 'professional' | 'enterprise'
  created_at: string
}

export interface TenantSettings {
  primary_color: string
  secondary_color: string
  allow_sso: boolean
  sso_provider?: string
  mfa_required: boolean
}

// ============================================
// Project Types
// ============================================

export interface Project {
  project_id: UUID
  tenant_id: UUID
  name: string
  description: string
  registry_type: RegistryType
  registry_project_id?: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  methodology: string
  location: ProjectLocation
  start_date: string
  end_date?: string
  created_at: string
  updated_at: string
}

export interface ProjectLocation {
  country: string
  region?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface ProjectSummary {
  project_id: UUID
  name: string
  registry_type: RegistryType
  status: Project['status']
  total_submissions: number
  total_credits: number
}

// ============================================
// MRV Submission Types (Blocks)
// ============================================

export interface MRVSubmission {
  mrv_submission_id: UUID
  project_id: UUID
  tenant_id: UUID
  registry_type: RegistryType
  status: Status
  submission_date: string
  monitoring_period_start: string
  monitoring_period_end: string
  reported_tonnage: number
  verified_tonnage?: number
  mrv_hash?: string
  process_id?: UUID
  created_at: string
  updated_at: string
}

export interface Block {
  id: string
  blockNumber: number
  mrvSubmissionId: UUID
  status: Status
  registryType: RegistryType
  timestamp: Date
  tonnage: number
  hash?: string
}

// ============================================
// Process & Workflow Types
// ============================================

export interface Process {
  process_id: UUID
  mrv_submission_id: UUID
  current_phase: ProcessPhase
  status: 'running' | 'completed' | 'failed' | 'paused'
  started_at: string
  completed_at?: string
  steps: ProcessStep[]
}

export interface ProcessStep {
  step_id: UUID
  process_id: UUID
  phase: ProcessPhase
  phase_name: string
  status: 'completed' | 'in_progress' | 'pending' | 'failed' | 'blocked'
  started_at?: string
  completed_at?: string
  metadata?: Record<string, unknown>
  sub_steps?: ProcessSubStep[]
}

export interface ProcessSubStep {
  id: string
  name: string
  status: ProcessStep['status']
  order: number
}

export const PROCESS_PHASES: Record<ProcessPhase, { name: string; description: string }> = {
  0: { name: 'Registry Selection', description: 'Select registry and perform gap analysis' },
  1: { name: 'Data Ingestion', description: 'Receive and validate MRV data' },
  2: { name: 'MRV Computation', description: 'Calculate tonnage and emissions' },
  3: { name: 'Verification', description: '9-category verification process' },
  4: { name: 'Canonical Hashing', description: 'Generate MRV hash' },
  5: { name: 'Registry Submission', description: 'Submit to carbon registry' },
  6: { name: 'NFT Minting', description: 'Mint credit NFT on NEAR' },
  7: { name: 'Active Credit', description: 'Credit available for trading' },
}

export const VERIFICATION_CATEGORIES = [
  'Project Setup',
  'General',
  'Project Design',
  'Facilities',
  'Carbon Accounting',
  'LCA',
  'Project Emissions',
  'GHG Statements',
  'Removal Data',
] as const

export type VerificationCategory = typeof VERIFICATION_CATEGORIES[number]

// ============================================
// Credit & NFT Types
// ============================================

export interface CarbonCredit {
  credit_id: UUID
  mrv_submission_id: UUID
  project_id: UUID
  token_id: string
  nft_contract_address: string
  tonnage: number
  vintage_year: number
  registry_serial_number?: string
  status: 'active' | 'retired' | 'transferred' | 'cancelled'
  minted_at: string
  metadata_uri: string
}

// ============================================
// ReactFlow Node Types
// ============================================

export interface ProcessNodeData {
  phase: ProcessPhase
  phaseName: string
  status: ProcessStep['status']
  timestamp?: Date
  metadata?: Record<string, unknown>
  subSteps?: ProcessSubStep[]
  isExpanded?: boolean
}

export interface ProcessNodeProps {
  data: ProcessNodeData
  selected?: boolean
}

// ============================================
// UI State Types
// ============================================

export interface SidebarState {
  isExpanded: boolean
  activeSection: string | null
}

export interface ProjectState {
  projects: Project[]
  selectedProjectId: UUID | null
  isLoading: boolean
  error: string | null
}

export interface MRVState {
  submissions: MRVSubmission[]
  selectedSubmissionId: UUID | null
  isLoading: boolean
  error: string | null
}

export interface ProcessState {
  currentProcess: Process | null
  selectedStepId: UUID | null
  isLoading: boolean
  error: string | null
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface ProjectFormData {
  name: string
  description: string
  registry_type: RegistryType
  methodology: string
  country: string
  region?: string
  start_date: string
}

// ============================================
// Event Types (Real-time updates)
// ============================================

export type EventType =
  | 'mrv.computed.v1'
  | 'mrv.approved.v1'
  | 'mrv.hash.created.v1'
  | 'registry.approved.v1'
  | 'blockchain.nft.minted.v1'
  | 'process.progress.v1'

export interface RealtimeEvent {
  event_type: EventType
  payload: Record<string, unknown>
  timestamp: string
  tenant_id: UUID
}

