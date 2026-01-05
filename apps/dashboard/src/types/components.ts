/**
 * DMRV Dashboard - Component Type Definitions
 * 
 * TypeScript interfaces for all UI components.
 */

import type { ReactNode } from 'react'
import type { Status, RegistryType, ProcessPhase, Block, ProcessStep } from './index'

// ============================================
// Atomic Component Types
// ============================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export interface BadgeProps {
  status: Status
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  className?: string
}

export interface IconProps {
  name: string
  size?: number
  className?: string
}

// ============================================
// Molecule Component Types
// ============================================

export interface FormFieldProps {
  label: string
  name: string
  error?: string
  required?: boolean
  children: ReactNode
}

export interface StatusBadgeProps {
  status: Status
  label?: string
  className?: string
}

export interface BlockHeaderProps {
  blockNumber: number
  status: Status
  timestamp: Date
  registryType: RegistryType
}

// ============================================
// Organism Component Types
// ============================================

export interface BlockCardProps {
  block: Block
  isSelected?: boolean
  onSelect: (blockId: string) => void
  className?: string
}

export interface ProcessNodeCardProps {
  step: ProcessStep
  isActive?: boolean
  onClick?: () => void
}

export interface SidebarProps {
  isExpanded: boolean
  onToggle: () => void
  activeRoute: string
}

export interface SidebarItemProps {
  icon: ReactNode
  label: string
  href: string
  isActive?: boolean
  isExpanded: boolean
  badge?: number
}

// ============================================
// Layout Component Types
// ============================================

export interface DashboardLayoutProps {
  children: ReactNode
}

export interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'subtle' | 'dropdown'
  hover?: boolean
  onClick?: () => void
}

// ============================================
// Block & Process Component Types
// ============================================

export interface BlockChainProps {
  blocks: Block[]
  selectedBlockId: string | null
  onBlockSelect: (blockId: string) => void
}

export interface ProjectSelectorProps {
  projects: { id: string; name: string; registryType: RegistryType; status: string }[]
  selectedProjectId: string | null
  onProjectSelect: (projectId: string) => void
}

export interface ProcessFlowProps {
  steps: ProcessStep[]
  currentPhase: ProcessPhase
  onStepClick?: (stepId: string) => void
}

export interface StepsTrackerProps {
  steps: ProcessStep[]
  currentPhase: ProcessPhase
  onStepClick?: (stepId: string, phase: ProcessPhase) => void
}

// ============================================
// Modal & Dialog Types
// ============================================

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
}

// ============================================
// Navigation Types
// ============================================

export interface NavItem {
  id: string
  label: string
  href: string
  icon: string
  badge?: number
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

// ============================================
// Error & Loading State Types
// ============================================

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
}

export interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

// ============================================
// Chart & Visualization Types
// ============================================

export interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

export interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
  icon?: ReactNode
}

