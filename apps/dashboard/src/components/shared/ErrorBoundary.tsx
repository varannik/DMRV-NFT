'use client'

/**
 * ErrorBoundary Component
 * 
 * React Error Boundary to catch JavaScript errors in child component tree.
 * Shows a fallback UI with retry option.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { GlassCard } from './GlassCard'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    // TODO: Log to error reporting service (e.g., Sentry)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <GlassCard className="max-w-md text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-red-500/20">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Something went wrong
              </h2>
              <p className="text-white/70">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button
                variant="secondary"
                onClick={this.handleRetry}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Try again
              </Button>
            </div>
          </GlassCard>
        </div>
      )
    }

    return this.props.children
  }
}

