/**
 * API Client
 * 
 * Centralized HTTP client for API requests with authentication,
 * error handling, and request/response interceptors.
 */

import { useAuthStore } from '@/lib/stores'
import type { ApiResponse, ApiError } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

export class ApiClient {
  private baseUrl: string
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }
  
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    const token = useAuthStore.getState().accessToken
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }
  
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      }))
      
      // Handle 401 - Unauthorized
      if (response.status === 401) {
        useAuthStore.getState().logout()
        throw new Error('Session expired. Please sign in again.')
      }
      
      throw new Error(error.message || `HTTP error ${response.status}`)
    }
    
    return response.json()
  }
  
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<T>(response)
  }
  
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return this.handleResponse<T>(response)
  }
  
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return this.handleResponse<T>(response)
  }
  
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return this.handleResponse<T>(response)
  }
  
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })
    
    return this.handleResponse<T>(response)
  }
}

// Singleton instance
export const apiClient = new ApiClient()

