/**
 * API Endpoints
 * 
 * Typed API endpoint functions for all DMRV services.
 */

import { apiClient } from './client'
import type { 
  User, 
  Project, 
  MRVSubmission, 
  Process, 
  ProcessStep,
  CarbonCredit,
  ApiResponse,
  LoginCredentials,
  MFAVerification,
} from '@/types'

// ============================================
// Authentication
// ============================================

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
  mfa_required?: boolean
  mfa_session_token?: string
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiClient.post('/auth/login', credentials)
}

export async function verifyMFA(data: MFAVerification): Promise<LoginResponse> {
  return apiClient.post('/auth/mfa/verify', data)
}

export async function logout(): Promise<void> {
  return apiClient.post('/auth/logout')
}

export async function refreshToken(refreshToken: string): Promise<{ access_token: string }> {
  return apiClient.post('/auth/refresh', { refresh_token: refreshToken })
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get('/auth/me')
}

// ============================================
// Projects
// ============================================

export async function getProjects(): Promise<ApiResponse<Project[]>> {
  return apiClient.get('/projects')
}

export async function getProject(projectId: string): Promise<Project> {
  return apiClient.get(`/projects/${projectId}`)
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  return apiClient.post('/projects', data)
}

export async function updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
  return apiClient.patch(`/projects/${projectId}`, data)
}

export async function deleteProject(projectId: string): Promise<void> {
  return apiClient.delete(`/projects/${projectId}`)
}

// ============================================
// MRV Submissions
// ============================================

export async function getMRVSubmissions(projectId: string): Promise<ApiResponse<MRVSubmission[]>> {
  return apiClient.get(`/projects/${projectId}/mrv/submissions`)
}

export async function getMRVSubmission(submissionId: string): Promise<MRVSubmission> {
  return apiClient.get(`/mrv/submissions/${submissionId}`)
}

export async function createMRVSubmission(projectId: string, data: Partial<MRVSubmission>): Promise<MRVSubmission> {
  return apiClient.post(`/projects/${projectId}/mrv/submissions`, data)
}

export async function getMRVSubmissionProcess(submissionId: string): Promise<Process> {
  return apiClient.get(`/mrv/submissions/${submissionId}/process`)
}

// ============================================
// Processes
// ============================================

export async function getProcess(processId: string): Promise<Process> {
  return apiClient.get(`/processes/${processId}`)
}

export async function getProcessSteps(processId: string): Promise<ProcessStep[]> {
  return apiClient.get(`/processes/${processId}/steps`)
}

export async function updateProcessStep(processId: string, stepId: string, data: Partial<ProcessStep>): Promise<ProcessStep> {
  return apiClient.patch(`/processes/${processId}/steps/${stepId}`, data)
}

// ============================================
// Credits
// ============================================

export async function getCredits(projectId?: string): Promise<ApiResponse<CarbonCredit[]>> {
  const params = projectId ? { project_id: projectId } : undefined
  return apiClient.get('/credits', params)
}

export async function getCredit(creditId: string): Promise<CarbonCredit> {
  return apiClient.get(`/credits/${creditId}`)
}

export async function retireCredit(creditId: string, reason: string): Promise<CarbonCredit> {
  return apiClient.post(`/credits/${creditId}/retire`, { reason })
}

// ============================================
// Analytics
// ============================================

export interface DashboardStats {
  total_credits: number
  total_tonnage: number
  active_submissions: number
  verification_rate: number
  portfolio_value: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiClient.get('/analytics/dashboard')
}

