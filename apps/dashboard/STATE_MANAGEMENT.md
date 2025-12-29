# Dashboard State Management Requirements

**Document Purpose**: Complete state management specification for the DMRV dashboard  
**Based on**: `docs/architecture/COMPREHENSIVE_WORKFLOWS.md` and `ARCHITECTURE_GAPS_ANALYSIS.md`  
**Last Updated**: 2024-01-XX  
**Version**: 4.1 (Added Governance/Ops + Notification Delivery Tracking State)

---

## Table of Contents

1. [Overview](#overview)
2. [State Categories](#state-categories)
3. [State Management Architecture](#state-management-architecture)
4. [State Persistence Strategy](#state-persistence-strategy)
5. [Real-Time State Synchronization](#real-time-state-synchronization)
6. [Implementation Recommendations](#implementation-recommendations)
7. [Advanced State Management Patterns](#advanced-state-management-patterns)
   - 7.1 [State Normalization](#1-state-normalization)
   - 7.2 [Selectors and Memoization](#2-selectors-and-memoization)
   - 7.3 [Next.js SSR Hydration](#3-nextjs-ssr-hydration)
   - 7.4 [DevTools Integration](#4-devtools-integration)
   - 7.5 [State Migration and Versioning](#5-state-migration-and-versioning)
   - 7.6 [State Security](#6-state-security)
   - 7.7 [Runtime State Validation](#7-runtime-state-validation)
   - 7.8 [State Observability and Monitoring](#8-state-observability-and-monitoring)
   - 7.9 [Code Splitting and Lazy Loading](#9-code-splitting-and-lazy-loading)
   - 7.10 [State Error Boundaries](#10-state-error-boundaries)
   - 7.11 [Debouncing and Throttling](#11-debouncing-and-throttling)
   - 7.12 [Undo/Redo Functionality](#12-undoredo-functionality)
   - 7.13 [Middleware Composition](#13-middleware-composition)
   - 7.14 [Comprehensive Testing Strategies](#14-comprehensive-testing-strategies)

---

## Overview

This document defines all state management requirements for the DMRV dashboard based on the comprehensive workflows and architecture analysis. The dashboard needs to manage complex state across multiple domains including projects, MRV submissions, verification workflows, credit lifecycle, and real-time updates.

### Key Requirements

- **44 major state categories** across the application (updated from 41)
- **Real-time synchronization** for critical state changes
- **Optimistic updates** for better UX
- **State persistence** for user preferences and drafts
- **State machines** for complex workflows (verification, saga pattern)
- **Multi-tenant isolation** in state management
- **Carbon science integrity** tracking (buffer pool, permanence, vintage)
- **Batch operations** state management
- **Webhook & SSO** configuration state
- **Event-driven architecture** state (event replay, consumer management, circuit breakers)
- **Backend operations** state (retirement saga, DLQ, schema registry)
- **Governance & ops** state (disputes/appeals, incidents, SLO/SLA, runbooks, DR/backup)
- **Notification delivery** state (outbox, delivery attempts, retries, provider health)

---

## State Categories

### 1. Authentication & User State

```typescript
// User Session State
interface UserState {
  currentUser: {
    id: string
    email: string
    name: string
    role: 'tenant_admin' | 'project_manager' | 'mrv_analyst' | 'verifier'
    permissions: string[]
  } | null
  
  // Tenant Context State
  currentTenant: {
    id: string
    name: string
    plan: 'free' | 'professional' | 'enterprise'
    settings: TenantSettings
  } | null
  
  // Multi-tenant Switching
  availableTenants: Tenant[]
  tenantSwitchInProgress: boolean
  isAuthenticated: boolean
  sessionExpiresAt: Date | null
}
```

**State Transitions**:
- `unauthenticated` → `authenticating` → `authenticated`
- `authenticated` → `tenant_switching` → `authenticated` (new tenant)

---

### 2. Project State Management

```typescript
interface ProjectState {
  // Project List State
  projects: Project[]
  projectsLoading: boolean
  projectsError: Error | null
  projectsFilters: {
    status: ProjectStatus[]
    registry: RegistryType[]
    projectType: string[]
    searchQuery: string
  }
  
  // Single Project State
  currentProject: Project | null
  projectStatus: 'setup' | 'data_collection' | 'computation_pending' | 
                 'computed' | 'verification_pending' | 'verified' | 
                 'hash_created' | 'registry_submitted' | 'nft_minted' | 'active'
  
  // Project Registry State
  targetRegistry: 'verra' | 'puro' | 'isometric' | 'gold_standard' | 'eu_ets' | null
  previousRegistry: RegistryType | null
  registryChangeHistory: RegistryChange[]
  registryChangeInProgress: boolean
  registryChangeImpact: ImpactAssessment | null
  
  // Project Gap Analysis State
  gapAnalysis: {
    completenessScore: number
    canProceedToComputation: boolean
    missingRequiredFields: string[]
    missingEvidenceTypes: string[]
    actionItems: ActionItem[]
  } | null
  gapAnalysisLoading: boolean
  gapAnalysisLastUpdated: Date | null
}
```

**State Transitions**:
- Project Status: `setup` → `data_collection` → `computation_pending` → `computed` → `verification_pending` → `verified` → `hash_created` → `registry_submitted` → `nft_minted` → `active`

---

### 3. MRV Submission State

```typescript
interface MRVSubmissionState {
  // MRV Submission List
  mrvSubmissions: MRVSubmission[]
  mrvSubmissionsLoading: boolean
  mrvSubmissionsFilters: {
    status: MRVStatus[]
    projectId: string
    dateRange: [Date, Date]
  }
  
  // Single MRV Submission State
  currentMRVSubmission: MRVSubmission | null
  mrvStatus: 'received' | 'validating' | 'validated' | 'computed' | 
             'computation_failed' | 'approved' | 'rejected' | 'superseded'
  
  // MRV Data Collection State
  sensorData: SensorReading[]
  evidenceArtifacts: EvidenceFile[]
  evidenceUploadProgress: Map<string, number> // fileId -> progress %
  evidenceUploadErrors: Map<string, Error>
  
  // MRV Computation State
  computationResult: {
    grossRemoval: number
    baselineEmissions: number
    projectEmissions: number
    leakageDeduction: number
    bufferDeduction: number
    netRemoval: number
    uncertaintyLower: number
    uncertaintyUpper: number
  } | null
  computationStatus: 'pending' | 'in_progress' | 'completed' | 'failed'
  computationError: Error | null
}
```

**State Transitions**:
- MRV Status: `received` → `validating` → `validated` → `computed` → `approved` | `rejected`
- Computation: `pending` → `in_progress` → `completed` | `failed`

---

### 4. Verification State Management

```typescript
interface VerificationState {
  // Verification State Machine
  verificationStatus: 'not_started' | 'started' | 'in_progress' | 
                      'clarification_required' | 'completed'
  verificationResult: 'approved' | 'rejected' | null
  verificationReport: VerificationReport | null
  
  // 9-Category Verification State
  verificationCategories: {
    projectSetup: CategoryStatus
    general: CategoryStatus
    projectDesign: CategoryStatus
    facilities: CategoryStatus
    carbonAccounting: CategoryStatus
    lifeCycleAssessment: CategoryStatus
    projectEmissions: CategoryStatus
    ghgStatements: CategoryStatus
    removalData: CategoryStatus
  }
  
  // Category Status Type
  type CategoryStatus = {
    status: 'not_reviewed' | 'in_progress' | 'passed' | 'passed_with_comments' | 
            'failed' | 'clarification_required'
    comments: string[]
    findings: Finding[]
    reviewedBy: string | null
    reviewedAt: Date | null
  }
  
  // Clarification Requests
  clarificationRequests: ClarificationRequest[]
  pendingClarifications: ClarificationRequest[]
  clarificationResponses: Map<string, string> // requestId -> response
  
  // Verifier Assignment
  assignedVerifier: Verifier | null
  verifierAssignmentHistory: VerifierAssignment[]
}
```

**State Machine**:
```
not_started → started → in_progress → clarification_required → in_progress → completed
                                                                    ↓
                                                              (approved | rejected)
```

---

### 5. Hashing State

```typescript
interface HashingState {
  // Hash Creation State
  mrvHash: string | null
  evidenceHash: string | null
  hashStatus: 'not_created' | 'creating' | 'created' | 'failed'
  hashCreationError: Error | null
  
  // Hash Metadata
  hashMetadata: {
    registry: string
    methodology: string
    computedTonnage: number
    verificationReportHash: string
    evidenceHash: string
    createdAt: Date
  } | null
  
  // Duplicate Detection State
  duplicateEvidenceCheck: {
    isDuplicate: boolean
    existingSubmissions: EvidenceSubmission[]
    requiresManualReview: boolean
    complianceAlert: ComplianceAlert | null
  } | null
}
```

---

### 6. Registry Submission State

```typescript
interface RegistrySubmissionState {
  // Registry Submission State
  registrySubmissionStatus: 'not_submitted' | 'submitting' | 'submitted' | 
                           'approved' | 'rejected' | 'pending_review'
  registrySerial: string | null
  registrySubmissionId: string | null
  registrySubmissionError: Error | null
  
  // Registry API State
  registryApiStatus: 'idle' | 'connecting' | 'connected' | 'error'
  registryApiRetries: number
  registryApiLastError: Error | null
}
```

---

### 7. Credit (NFT) State Management

```typescript
interface CreditState {
  // Credit List State
  credits: Credit[]
  creditsLoading: boolean
  creditsFilters: {
    status: CreditStatus[]
    registry: RegistryType[]
    vintage: number[]
    searchQuery: string
  }
  
  // Single Credit State
  currentCredit: Credit | null
  creditStatus: 'pending' | 'minting' | 'active' | 'transferred' | 
                'retired' | 'voided' | 'mint_failed'
  
  // NFT Minting State
  mintingStatus: 'not_started' | 'preparing' | 'submitting' | 
                 'confirming' | 'completed' | 'failed'
  mintingTransactionHash: string | null
  mintingBlockHeight: number | null
  mintingError: Error | null
  mintingProgress: number // 0-100
  
  // NEAR Blockchain State
  nearConnectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  nearAccountId: string | null
  nearBalance: string | null
  nearTransactionHistory: Transaction[]
}
```

**State Transitions**:
- Credit Status: `pending` → `minting` → `active` | `mint_failed`
- Minting: `not_started` → `preparing` → `submitting` → `confirming` → `completed` | `failed`

---

### 8. Process/Workflow State (Saga Pattern)

```typescript
interface ProcessState {
  // Credit Issuance Saga State
  sagaStatus: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'compensating'
  sagaSteps: {
    mrvApproval: SagaStepStatus
    hashCreation: SagaStepStatus
    registrySubmission: SagaStepStatus
    nftMinting: SagaStepStatus
  }
  
  // Saga Step Status
  type SagaStepStatus = {
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'compensating'
    startedAt: Date | null
    completedAt: Date | null
    error: Error | null
    compensationStatus: 'not_required' | 'required' | 'in_progress' | 'completed'
  }
  
  // Process Tracking
  activeProcesses: Process[]
  processProgress: Map<string, number> // processId -> progress %
  processErrors: Map<string, Error>
}
```

**Saga State Machine**:
```
not_started → in_progress (step 1) → in_progress (step 2) → ... → completed
                                                      ↓
                                                   failed → compensating
```

---

### 9. Registry Change State

```typescript
interface RegistryChangeState {
  // Registry Change Workflow State
  registryChangeInProgress: boolean
  registryChangeStage: 'before_computation' | 'after_computation' | 
                       'after_verification' | 'after_hash' | 'after_submission'
  registryChangeImpact: {
    stage: string
    severity: 'low' | 'medium' | 'high' | 'very_high' | 'blocked'
    invalidatedWork: InvalidatedWork[]
    requiresRecomputation: boolean
    requiresReverification: boolean
    requiresNewHash: boolean
    estimatedTimeDays: number
    estimatedCostUsd: number
  } | null
  
  // Registry Comparison State (Exploratory)
  registryComparisons: {
    verra: RegistryComparison | null
    puro: RegistryComparison | null
    isometric: RegistryComparison | null
    goldStandard: RegistryComparison | null
  }
  comparisonMode: 'exploratory' | 'selected'
}
```

**Impact by Stage**:
- Stage 1 (Before Computation): ✅ Low impact
- Stage 2 (After Computation): ⚠️ Medium impact
- Stage 3 (After Verification): ⚠️ High impact
- Stage 4 (After Hash): ❌ Very high impact
- Stage 5 (After Submission): ❌ Blocked

---

### 10. Double-Counting Prevention State

```typescript
interface DoubleCountingState {
  // Evidence Hash Tracking
  evidenceRegistry: {
    evidenceHash: string
    existingSubmissions: EvidenceSubmission[]
    activeCredits: Credit[]
    retiredCredits: Credit[]
    voidedCredits: Credit[]
  } | null
  
  // Compliance State
  complianceChecks: {
    isDuplicate: boolean
    requiresManualReview: boolean
    complianceAlerts: ComplianceAlert[]
    policyViolations: PolicyViolation[]
  }
  
  // Multi-Registry Detection
  multiRegistryDetection: {
    detected: boolean
    registries: RegistryType[]
    statuses: CreditStatus[]
    requiresAction: boolean
  }
}
```

---

### 11. Billing & Subscription State

```typescript
interface BillingState {
  // Subscription State
  subscription: {
    plan: 'free' | 'professional' | 'enterprise'
    status: 'active' | 'cancelled' | 'expired' | 'trial'
    billingCycle: 'monthly' | 'annual'
    nextBillingDate: Date
  } | null
  
  // Usage Metrics State
  usageMetrics: {
    creditsIssued: number
    apiCalls: number
    storageUsed: number
    verificationsCompleted: number
    period: 'current_month' | 'last_month' | 'current_year'
  }
  
  // Invoices State
  invoices: Invoice[]
  currentInvoice: Invoice | null
  paymentMethods: PaymentMethod[]
}
```

---

### 12. Settings State

```typescript
interface SettingsState {
  // Tenant Settings
  tenantSettings: {
    name: string
    logo: string | null
    contactInfo: ContactInfo
    preferences: UserPreferences
  }
  
  // User Management State
  users: User[]
  invitedUsers: InvitedUser[]
  userRoles: Map<string, Role[]>
  
  // API Keys State
  apiKeys: APIKey[]
  apiKeyGenerationInProgress: boolean
  
  // Webhook Configuration State
  webhooks: Webhook[]
  webhookTestResults: Map<string, WebhookTestResult>
}
```

---

### 13. Real-Time Updates State

```typescript
interface RealTimeState {
  // WebSocket/SSE Connection State
  realTimeConnectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  subscribedEvents: EventType[]
  eventQueue: Event[]
  lastEventTimestamp: Date | null
  
  // Event Subscriptions
  eventSubscriptions: {
    'mrv.computed.v1': boolean
    'mrv.approved.v1': boolean
    'mrv.rejected.v1': boolean
    'verification.completed.v1': boolean
    'mrv.hash.created.v1': boolean
    'registry.approved.v1': boolean
    'blockchain.nft.minted.v1': boolean
    'project.registry.changed.v1': boolean
    'computation.invalidated.v1': boolean
    'verification.invalidated.v1': boolean
    // ... other events
  }
}
```

**Critical Events for Real-Time Updates**:
- `mrv.computed.v1` - Update computation status
- `mrv.approved.v1` - Update MRV approval status
- `verification.completed.v1` - Update verification status
- `blockchain.nft.minted.v1` - Update credit status
- `project.registry.changed.v1` - Update project registry

---

### 14. UI/UX State

```typescript
interface UIState {
  // Navigation State
  currentRoute: string
  navigationHistory: string[]
  sidebarCollapsed: boolean
  activeTab: string
  
  // Modal/Dialog State
  openModals: {
    registryChange: boolean
    gapAnalysis: boolean
    verificationDetails: boolean
    creditDetails: boolean
    confirmation: boolean
    // ... other modals
  }
  
  // Form State
  formDirty: Map<string, boolean> // formId -> isDirty
  formErrors: Map<string, ValidationError[]>
  formSubmitting: Map<string, boolean>
  
  // Loading States
  loadingStates: {
    projects: boolean
    mrvSubmissions: boolean
    credits: boolean
    verification: boolean
    processes: boolean
    // ... other loading states
  }
  
  // Notification State
  notifications: Notification[]
  unreadCount: number
  notificationPreferences: NotificationPreferences
  
  // Toast/Alert State
  toasts: Toast[]
}
```

---

### 15. Cache & Data Management State

```typescript
interface CacheState {
  // Cache State
  cache: {
    projects: CacheEntry<Project[]>
    mrvSubmissions: CacheEntry<MRVSubmission[]>
    credits: CacheEntry<Credit[]>
    verificationReports: CacheEntry<VerificationReport[]>
    registryRequirements: CacheEntry<RegistryRequirements[]>
  }
  
  // Cache Entry Type
  type CacheEntry<T> = {
    data: T
    timestamp: Date
    expiresAt: Date
    stale: boolean
  }
  
  // Optimistic Updates
  optimisticUpdates: {
    projectUpdates: Map<string, Partial<Project>>
    mrvUpdates: Map<string, Partial<MRVSubmission>>
    creditUpdates: Map<string, Partial<Credit>>
  }
  
  // Offline State
  offlineMode: boolean
  pendingMutations: Mutation[]
  syncStatus: 'synced' | 'syncing' | 'error'
}
```

---

### 16. Error & Retry State

```typescript
interface ErrorState {
  // Error State
  errors: {
    apiErrors: APIError[]
    networkErrors: NetworkError[]
    validationErrors: ValidationError[]
    blockchainErrors: BlockchainError[]
  }
  
  // Retry State
  retryQueue: RetryableOperation[]
  retryAttempts: Map<string, number> // operationId -> attempts
  retryBackoff: Map<string, number> // operationId -> backoffMs
}
```

---

### 17. Analytics & Metrics State

```typescript
interface AnalyticsState {
  // Dashboard Metrics
  dashboardMetrics: {
    totalProjects: number
    activeProjects: number
    totalCredits: number
    activeCredits: number
    pendingVerifications: number
    totalTonnage: number
    revenue: number
  }
  
  // Time Series Data
  metricsHistory: {
    creditsIssued: TimeSeriesData[]
    revenue: TimeSeriesData[]
    verificationsCompleted: TimeSeriesData[]
  }
  
  // Business KPIs
  businessKPIs: {
    timeToFirstCredit: number
    verificationPassRate: number
    registryApprovalRate: number
    nftMintSuccessRate: number
  }
}
```

---

### 18. Carbon Science State

```typescript
interface CarbonScienceState {
  // Buffer Pool State
  bufferPool: {
    totalBufferCredits: number
    projectBufferContribution: number
    bufferRate: number // 0.05 to 0.25 depending on risk
    availableBuffer: number
    allocatedBuffer: number
  } | null
  
  // Permanence State
  permanence: {
    assessmentStatus: 'pending' | 'completed' | 'review_required'
    permanenceDuration: number // years
    reversalRisk: 'low' | 'medium' | 'high'
    monitoringFrequency: string // e.g., "annual", "quarterly"
  } | null
  
  // Reversal Events State
  reversalEvents: ReversalEvent[]
  activeReversals: ReversalEvent[]
  reversalMonitoring: {
    lastCheckDate: Date | null
    nextCheckDate: Date | null
    monitoringStatus: 'active' | 'paused' | 'completed'
  }
  
  // Vintage & Expiry State
  vintage: {
    year: number
    creditingPeriodStart: Date
    creditingPeriodEnd: Date
    expiryDate: Date | null
    daysUntilExpiry: number | null
    expiryWarningLevel: 'none' | 'warning' | 'urgent' | 'expired'
  } | null
  
  // Additionality State
  additionality: {
    assessmentComplete: boolean
    regulatorySurplus: boolean
    financialBarrier: boolean
    commonPracticeTest: boolean
    baselineScenarioId: string | null
    addionalityEvidence: EvidenceFile[]
  } | null
  
  // Leakage Assessment State
  leakageAssessment: {
    assessmentComplete: boolean
    activityShifting: number // percentage
    marketLeakage: number // percentage
    ecologicalLeakage: number // percentage
    totalLeakageFactor: number // 0.0 to 1.0
    mitigationMeasures: string[]
  } | null
}

type ReversalEvent = {
  id: string
  type: 'fire' | 'disease' | 'policy_change' | 'natural_disaster' | 'other'
  tonnageReleased: number
  detectedDate: Date
  status: 'detected' | 'quantified' | 'buffer_deducted' | 'remediated'
  affectedCredits: string[]
}
```

**State Transitions**:
- Vintage Expiry: `active` → `warning` (-6 months) → `urgent` (-30 days) → `expired`
- Reversal: `detected` → `quantified` → `buffer_deducted` → `remediated`

---

### 19. Batch Operations State

```typescript
interface BatchOperationsState {
  // Batch List State
  batches: Batch[]
  batchesLoading: boolean
  batchesFilters: {
    type: ('mint' | 'retire' | 'transfer')[]
    status: BatchStatus[]
    dateRange: [Date, Date]
  }
  
  // Current Batch State
  currentBatch: Batch | null
  batchStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'partial'
  
  // Batch Progress State
  batchProgress: {
    totalItems: number
    processedItems: number
    successfulItems: number
    failedItems: number
    currentItem: number
    percentComplete: number
    estimatedTimeRemaining: number // seconds
  } | null
  
  // Batch Results State
  batchResults: {
    successful: BatchItem[]
    failed: BatchItem[]
    errors: Map<string, Error> // itemId -> error
  } | null
  
  // Batch Configuration State
  batchConfig: {
    maxBatchSize: number
    currentBatchSize: number
    allowPartialSuccess: boolean
    stopOnError: boolean
  }
}

type Batch = {
  id: string
  type: 'mint' | 'retire' | 'transfer'
  status: BatchStatus
  items: BatchItem[]
  createdAt: Date
  startedAt: Date | null
  completedAt: Date | null
}

type BatchItem = {
  id: string
  data: any
  status: 'pending' | 'processing' | 'success' | 'failed'
  result: any | null
  error: Error | null
}
```

**State Transitions**:
- Batch: `pending` → `processing` → (`completed` | `failed` | `partial`)
- Item: `pending` → `processing` → (`success` | `failed`)

---

### 20. Webhook Configuration State

```typescript
interface WebhookState {
  // Webhook List State
  webhooks: Webhook[]
  webhooksLoading: boolean
  
  // Webhook Configuration State
  currentWebhook: Webhook | null
  webhookStatus: 'active' | 'paused' | 'disabled' | 'failed'
  
  // Webhook Delivery State
  deliveryLog: WebhookDelivery[]
  recentDeliveries: WebhookDelivery[]
  deliveryStats: {
    totalDeliveries: number
    successfulDeliveries: number
    failedDeliveries: number
    averageResponseTime: number
    successRate: number
  }
  
  // Webhook Test State
  testInProgress: boolean
  testResult: {
    success: boolean
    statusCode: number
    responseTime: number
    response: any
    error: Error | null
  } | null
  
  // Webhook Events Subscription State
  subscribedEvents: Set<string>
  availableEvents: EventType[]
}

type Webhook = {
  id: string
  url: string
  secret: string
  active: boolean
  events: string[]
  retryPolicy: {
    maxRetries: number
    backoffType: 'linear' | 'exponential'
  }
  headers: Map<string, string>
  createdAt: Date
}

type WebhookDelivery = {
  id: string
  webhookId: string
  eventType: string
  status: 'success' | 'failed' | 'retrying'
  attempts: number
  responseTime: number | null
  statusCode: number | null
  error: Error | null
  timestamp: Date
}
```

---

### 21. Feature Flags & Entitlements State

```typescript
interface FeatureState {
  // Feature Access State
  features: {
    multiRegistry: boolean
    batchOperations: boolean
    creditFractionalization: boolean
    customWebhooks: boolean
    ssoEnabled: boolean
    dedicatedSupport: boolean
    whiteLabel: boolean
    advancedAnalytics: boolean
    apiAccess: boolean
  }
  
  // Plan Entitlements State
  entitlements: {
    maxCreditsPerMonth: number
    maxApiCallsPerMonth: number
    maxProjects: number
    maxUsers: number
    storageGb: number
    retentionDays: number
  }
  
  // Feature Access Tracking State
  featureAttempts: Map<string, number> // featureId -> attempt count
  blockedFeatures: Set<string>
  upsellOpportunities: UpsellOpportunity[]
}

type UpsellOpportunity = {
  feature: string
  attemptCount: number
  lastAttempt: Date
  requiredPlan: 'professional' | 'enterprise'
  estimatedValue: number
}
```

---

### 22. SSO & Identity Provider State

```typescript
interface SSOState {
  // SSO Configuration State
  ssoEnabled: boolean
  ssoProvider: 'saml' | 'oidc' | null
  ssoConfig: {
    idpName: string
    idpMetadataUrl: string | null
    entityId: string | null
    ssoUrl: string | null
    certificate: string | null
  } | null
  
  // SCIM Provisioning State
  scimEnabled: boolean
  scimSyncStatus: 'idle' | 'syncing' | 'error'
  scimLastSync: Date | null
  scimStats: {
    usersCreated: number
    usersUpdated: number
    usersDeactivated: number
    lastSyncDuration: number
  } | null
  
  // SSO Session State
  ssoSessions: SSOSession[]
  activeSSOSessions: number
  
  // Directory Sync State
  directorySyncEnabled: boolean
  directorySyncStatus: 'connected' | 'disconnected' | 'error'
  lastDirectorySync: Date | null
  pendingProvisioningTasks: ProvisioningTask[]
}

type SSOSession = {
  sessionId: string
  userId: string
  idpSessionId: string
  createdAt: Date
  expiresAt: Date
  lastActivity: Date
}

type ProvisioningTask = {
  id: string
  type: 'create_user' | 'update_user' | 'deactivate_user'
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error: Error | null
}
```

---

### 23. Verifier Management State

```typescript
interface VerifierManagementState {
  // Verifier List State
  verifiers: Verifier[]
  verifiersLoading: boolean
  availableVerifiers: Verifier[]
  
  // Verifier Assignment State
  currentAssignment: {
    verifierId: string
    verifierName: string
    assignedAt: Date
    dueDate: Date | null
    status: 'assigned' | 'in_progress' | 'completed'
  } | null
  
  // Verifier Workload State
  verifierWorkload: Map<string, number> // verifierId -> active verifications
  verifierAvailability: Map<string, boolean>
  
  // Conflict of Interest State
  conflictChecks: {
    checked: boolean
    hasConflict: boolean
    conflictReason: string | null
    override: boolean
    overrideReason: string | null
  } | null
  
  // Verifier Performance State
  verifierMetrics: {
    averageTurnaroundTime: number
    approvalRate: number
    totalVerifications: number
    activeVerifications: number
  } | null
  
  // Verifier Rotation State
  rotationRequired: boolean
  rotationCount: number
  lastRotationDate: Date | null
  nextRotationDue: Date | null
}

type Verifier = {
  id: string
  name: string
  accreditation: string
  accreditingBody: string
  specializations: string[]
  maxConcurrentVerifications: number
  available: boolean
}
```

---

### 24. Audit & Compliance State

```typescript
interface AuditComplianceState {
  // Audit Trail State
  auditLogs: AuditLog[]
  auditLogsLoading: boolean
  auditFilters: {
    actor: string[]
    action: string[]
    resource: string[]
    dateRange: [Date, Date]
  }
  
  // Compliance Status State
  complianceStatus: {
    kycComplete: boolean
    amlCheckPassed: boolean
    gdprCompliant: boolean
    dataRetentionConfigured: boolean
    termsAccepted: boolean
    termsVersion: string
    lastComplianceReview: Date | null
  }
  
  // Data Retention State
  dataRetention: {
    retentionPeriodDays: number
    autoDeleteEnabled: boolean
    pendingDeletions: number
    nextDeletionDate: Date | null
  }
  
  // Export & GDPR State
  dataExports: DataExport[]
  exportInProgress: boolean
  gdprRequests: GDPRRequest[]
  
  // Regulatory Requirements State
  regulatoryRequirements: {
    marketType: 'voluntary' | 'compliance'
    jurisdiction: string
    reportingFrequency: 'annual' | 'quarterly' | 'monthly'
    nextReportDue: Date | null
    complianceDocuments: ComplianceDoc[]
  } | null
}

type AuditLog = {
  id: string
  timestamp: Date
  actor: string
  action: string
  resource: string
  resourceId: string
  changes: any
  ipAddress: string
  userAgent: string
}

type DataExport = {
  id: string
  requestedAt: Date
  status: 'pending' | 'processing' | 'completed' | 'failed'
  format: 'json' | 'csv' | 'pdf'
  downloadUrl: string | null
  expiresAt: Date | null
}

type GDPRRequest = {
  id: string
  type: 'access' | 'erasure' | 'portability' | 'rectification'
  status: 'pending' | 'processing' | 'completed'
  requestedAt: Date
  completedAt: Date | null
}
```

---

### 25. Marketplace State (Future)

```typescript
interface MarketplaceState {
  // Listing State
  listings: Listing[]
  listingsLoading: boolean
  listingsFilters: {
    priceRange: [number, number]
    vintage: number[]
    registry: RegistryType[]
    methodology: string[]
    projectType: string[]
  }
  
  // Active Listing State
  currentListing: Listing | null
  listingStatus: 'draft' | 'active' | 'sold' | 'cancelled' | 'expired'
  
  // Order Book State
  orderBook: {
    buyOrders: Order[]
    sellOrders: Order[]
    recentTrades: Trade[]
    marketDepth: number
  } | null
  
  // Trading State
  activeTrades: Trade[]
  tradeInProgress: boolean
  tradeStatus: 'pending' | 'escrow' | 'confirming' | 'completed' | 'failed'
  
  // Pricing State
  marketPrices: {
    currentPrice: number
    volumeWeightedAverage: number
    high24h: number
    low24h: number
    change24h: number
    volume24h: number
  } | null
  
  // Wallet State
  walletBalance: {
    credits: number
    fiat: number
    pendingTransfers: number
  } | null
}

type Listing = {
  id: string
  creditId: string
  sellerId: string
  price: number
  quantity: number
  status: 'active' | 'sold' | 'cancelled'
  listedAt: Date
  expiresAt: Date | null
}

type Order = {
  id: string
  type: 'buy' | 'sell'
  price: number
  quantity: number
  userId: string
  status: 'open' | 'filled' | 'cancelled'
}

type Trade = {
  id: string
  buyerId: string
  sellerId: string
  creditId: string
  price: number
  quantity: number
  timestamp: Date
  status: 'completed' | 'pending'
}
```

---

## Backend Operations & Event-Driven Architecture State

### 26. Retirement Saga State

```typescript
interface RetirementSagaState {
  // Retirement Saga Tracking
  retirementSagas: Map<string, RetirementSaga> // sagaId -> saga
  
  type RetirementSaga = {
    sagaId: string
    creditId: string
    beneficiary: string
    status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'compensating'
    timeout: number // 1 hour
    startedAt: Date | null
    completedAt: Date | null
    
    // 4-Step Retirement Flow
    steps: {
      reserveInRegistry: RetirementStep
      retireOnChain: RetirementStep
      confirmInRegistry: RetirementStep
      generateCertificate: RetirementStep
    }
  }
  
  type RetirementStep = {
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'compensating'
    startedAt: Date | null
    completedAt: Date | null
    error: Error | null
    compensationStatus: 'not_required' | 'required' | 'in_progress' | 'completed'
    retryCount: number
  }
  
  // Registry Reserve State
  registryReservations: Map<string, RegistryReservation>
  
  type RegistryReservation = {
    creditId: string
    registryId: string
    reservedAt: Date
    expiresAt: Date
    status: 'reserved' | 'confirmed' | 'expired' | 'cancelled'
  }
  
  // Retirement Certificate State
  certificates: Map<string, RetirementCertificate>
  certificateGenerationStatus: 'idle' | 'generating' | 'completed' | 'failed'
}
```

**Key Features**:
- Separate saga for retirement (distinct from credit issuance)
- 4-step process with compensation logic
- Registry reservation tracking
- Certificate generation state

**Events Tracked**:
- `saga.retirement.started.v1`
- `registry.reserved.v1`
- `blockchain.nft.retired.v1`
- `registry.retired.v1`
- `certificate.generated.v1`

---

### 27. Event Replay & Recovery State

```typescript
interface EventReplayState {
  // Replay Jobs State
  replayJobs: ReplayJob[]
  activeReplayJob: ReplayJob | null
  
  type ReplayJob = {
    jobId: string
    type: 'full' | 'tenant' | 'time-range' | 'event-type' | 'aggregate'
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    
    // Replay Configuration
    config: {
      tenantId?: string
      fromSequence?: number
      toSequence?: number
      fromDate?: Date
      toDate?: Date
      eventTypes?: string[]
      aggregateId?: string
      targetConsumers?: string[]
      rateLimit: number // events per second
    }
    
    // Progress Tracking
    progress: {
      totalEvents: number
      processedEvents: number
      failedEvents: number
      percentComplete: number
      estimatedTimeRemaining: number
    }
    
    startedAt: Date | null
    completedAt: Date | null
    error: Error | null
  }
  
  // Event Store State
  eventStore: {
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
    totalEvents: number
    currentSequence: number
    
    // Storage Tiers
    storageTiers: {
      hot: { count: number; retentionDays: 90 } // PostgreSQL
      warm: { count: number; retentionDays: 730 } // S3 Glacier
      cold: { count: number; retentionDays: 3650 } // S3 Deep Archive
    }
  }
  
  // Snapshot/Checkpoint State
  snapshots: {
    creditService: {
      lastSnapshot: Date | null
      nextSnapshot: Date | null
      frequency: 1000 // events
    }
    billingLedger: {
      lastSnapshot: Date | null
      nextSnapshot: Date | null
      frequency: 'daily'
    }
    processState: {
      lastSnapshot: Date | null
      nextSnapshot: Date | null
      frequency: 'per_step'
    }
  }
}
```

**Key Features**:
- Event replay job management
- Event store connection and monitoring
- Storage tier tracking (hot/warm/cold)
- Snapshot/checkpoint state per component

**Use Cases**:
- Tenant data recovery
- Read model rebuild
- Point-in-time recovery
- Consumer bug fixes

---

### 28. Schema Registry State

```typescript
interface SchemaRegistryState {
  // Schema Versions
  schemas: Map<string, EventSchema[]> // eventType -> versions
  
  type EventSchema = {
    eventType: string // e.g., 'mrv.approved.v1'
    version: number
    schema: JSONSchema
    status: 'draft' | 'active' | 'deprecated' | 'archived'
    compatibilityMode: 'backward' | 'forward' | 'full' | 'none'
    createdAt: Date
    deprecatedAt: Date | null
    archivedAt: Date | null
  }
  
  // Schema Validation State
  validationStatus: Map<string, ValidationStatus>
  
  type ValidationStatus = {
    eventType: string
    lastValidation: Date
    status: 'valid' | 'invalid' | 'warning'
    errors: ValidationError[]
  }
  
  // Schema Migration State
  activeMigrations: SchemaMigration[]
  
  type SchemaMigration = {
    migrationId: string
    fromVersion: string // e.g., 'mrv.approved.v1'
    toVersion: string // e.g., 'mrv.approved.v2'
    phase: 'prepare' | 'dual-publish' | 'v2-only' | 'cleanup'
    startedAt: Date
    estimatedCompletion: Date
    status: 'in_progress' | 'completed' | 'failed'
    
    progress: {
      consumersUpdated: number
      totalConsumers: number
      dualPublishDuration: number // days
      deprecationDate: Date
    }
  }
  
  // Schema Compatibility Check
  compatibilityChecks: {
    lastCheck: Date | null
    results: CompatibilityCheckResult[]
  }
}
```

**Key Features**:
- Event schema versioning
- Compatibility mode enforcement
- Schema migration tracking
- Validation status per event type

**Compatibility Rules**:
- Backward: New schema reads old data
- Forward: Old schema reads new data
- Full: Both directions
- None: No compatibility checks

---

### 29. Consumer Management State

```typescript
interface ConsumerManagementState {
  // Consumer Groups
  consumerGroups: Map<string, ConsumerGroup>
  
  type ConsumerGroup = {
    groupId: string
    name: string // 'mrv-processors', 'registry-sync', 'blockchain-ops', etc.
    services: string[]
    eventTypes: string[]
    
    // Health Metrics
    health: {
      status: 'healthy' | 'degraded' | 'unhealthy' | 'critical'
      lastHeartbeat: Date
      consumerLag: number // events behind
      processingLatency: number // seconds
      errorRate: number // percentage
      dlqDepth: number // messages in DLQ
    }
    
    // Performance Metrics
    metrics: {
      eventsProcessed: number
      eventsPerSecond: number
      avgProcessingTime: number
      successRate: number
    }
  }
  
  // Consumer Lag Alerts
  lagAlerts: Map<string, LagAlert>
  
  type LagAlert = {
    consumerId: string
    currentLag: number
    threshold: number // 1000 events
    severity: 'warning' | 'critical'
    triggeredAt: Date
    action: 'scale_up' | 'investigate' | 'alert_ops'
  }
  
  // Backpressure State
  backpressure: {
    producerSide: {
      throttled: boolean
      deliveryRate: number
      queueDepth: number
      circuitBreakerOpen: boolean
    }
    consumerSide: {
      overwhelmed: boolean
      batchSize: number
      processingBacklog: number
      autoScaling: boolean
    }
    systemProtection: {
      tenantRateLimits: Map<string, number> // tenantId -> current rate
      globalEventRate: number
      circuitBreakers: Map<string, boolean> // service -> isOpen
    }
  }
}
```

**Key Features**:
- Consumer group health monitoring
- Consumer lag tracking and alerting
- Backpressure detection and handling
- Auto-scaling state

**Alert Thresholds**:
- Consumer lag > 1000 events: Scale up
- Processing latency > 5 seconds: Investigate
- Error rate > 1%: Alert ops
- DLQ depth > 100: Manual review
- Last heartbeat > 60 seconds: Restart consumer

---

### 30. API Idempotency State

```typescript
interface IdempotencyState {
  // Idempotency Cache
  idempotencyCache: Map<string, IdempotencyRecord>
  
  type IdempotencyRecord = {
    key: string // Idempotency-Key header value
    requestHash: string
    status: number // HTTP status code
    body: any
    headers: Record<string, string>
    createdAt: Date
    expiresAt: Date // TTL: 24 hours
    replayed: boolean
  }
  
  // Request Tracking
  activeRequests: Map<string, RequestState>
  
  type RequestState = {
    requestId: string
    idempotencyKey: string | null
    endpoint: string
    method: string
    status: 'processing' | 'completed' | 'failed'
    startedAt: Date
    completedAt: Date | null
  }
  
  // Replay Detection
  replayDetection: {
    replayedRequests: number
    uniqueRequests: number
    cacheHitRate: number
    averageResponseTime: number
  }
  
  // Idempotency Requirements by Endpoint
  endpointRequirements: Map<string, IdempotencyRequirement>
  
  type IdempotencyRequirement = {
    endpoint: string
    method: string
    required: boolean
    keySource: 'header' | 'natural' | 'none'
  }
}
```

**Key Features**:
- Idempotency key tracking (24-hour TTL)
- Request deduplication
- Cached response replay
- Replay detection and metrics

**Required Endpoints**:
- `POST /credits`: Yes (header)
- `POST /credits/batch/mint`: Yes (header)
- `POST /credits/{id}/retire`: Yes (header)
- `POST /verifications/{id}/approve`: Yes (header)
- `PUT /*`: Natural (resource ID)

---

### 31. Registry Adapter Health State

```typescript
interface RegistryAdapterHealthState {
  // Per-Registry Adapter State
  adapters: Map<string, RegistryAdapterHealth>
  
  type RegistryAdapterHealth = {
    registryId: 'verra' | 'puro' | 'isometric' | 'eu-ets' | 'california-arb'
    
    // Connection State
    connectionStatus: 'connected' | 'disconnected' | 'degraded' | 'maintenance'
    lastSuccessfulRequest: Date | null
    lastFailedRequest: Date | null
    
    // Circuit Breaker State
    circuitBreaker: {
      state: 'closed' | 'open' | 'half-open'
      failureCount: number
      failureThreshold: 5
      lastStateChange: Date
      nextRetryAt: Date | null // For half-open state
    }
    
    // Retry State
    retryQueue: RetryRequest[]
    
    type RetryRequest = {
      requestId: string
      attempt: number
      maxAttempts: 5
      nextRetryAt: Date
      backoffMs: number // Exponential: 1s, 2s, 4s, 8s, 16s
      payload: any
    }
    
    // Performance Metrics
    metrics: {
      requestRate: number // requests per minute
      avgLatency: number // milliseconds
      successRate: number // percentage
      errorRate: number // percentage
      timeoutRate: number // percentage
    }
    
    // API Status
    apiStatus: {
      issuance: 'operational' | 'degraded' | 'down'
      retirement: 'operational' | 'degraded' | 'down'
      query: 'operational' | 'degraded' | 'down'
    }
  }
  
  // Dead Letter Queue (DLQ) State
  dlq: {
    messages: DLQMessage[]
    depth: number
    threshold: 100 // Alert if exceeded
    
    type DLQMessage = {
      messageId: string
      registryId: string
      originalRequest: any
      failureReason: string
      failedAt: Date
      retryCount: number
      status: 'pending_review' | 'requeued' | 'discarded'
    }
  }
}
```

**Key Features**:
- Per-registry circuit breaker state
- Exponential backoff retry tracking
- DLQ monitoring and management
- API health by endpoint type

**Circuit Breaker States**:
- **Closed**: Normal operation
- **Open**: Fail fast after 5 failures
- **Half-Open**: Test with single call after 60s

---

### 32. NEAR Indexer State

```typescript
interface NEARIndexerState {
  // Indexer Connection
  indexer: {
    connectionStatus: 'disconnected' | 'connecting' | 'syncing' | 'synced' | 'error'
    lastSyncTime: Date | null
    syncError: Error | null
  }
  
  // Block Tracking
  blockTracking: {
    latestBlockHeight: number
    lastProcessedBlock: number
    blockLag: number // blocks behind
    syncPercentage: number
    estimatedTimeToCatchUp: number // seconds
  }
  
  // Transaction Monitoring
  transactions: {
    pending: NEARTransaction[]
    confirmed: NEARTransaction[]
    failed: NEARTransaction[]
    
    type NEARTransaction = {
      txHash: string
      type: 'mint' | 'transfer' | 'retire' | 'split' | 'merge'
      status: 'pending' | 'included' | 'confirmed' | 'finalized' | 'failed'
      blockHeight: number | null
      confirmations: number
      gasUsed: string
      timestamp: Date
      creditId: string
    }
  }
  
  // Event Processing
  eventProcessing: {
    eventsDetected: number
    eventsProcessed: number
    eventsFailed: number
    processingRate: number // events per second
    
    lastEvents: IndexerEvent[]
    
    type IndexerEvent = {
      eventId: string
      eventType: 'nft_mint' | 'nft_transfer' | 'nft_retire'
      blockHeight: number
      timestamp: Date
      processed: boolean
      emittedPlatformEvent: boolean
    }
  }
  
  // Indexer Performance
  performance: {
    avgBlockProcessingTime: number // milliseconds
    avgEventProcessingTime: number // milliseconds
    memoryUsage: number // MB
    cpuUsage: number // percentage
  }
}
```

**Key Features**:
- Real-time block sync monitoring
- Transaction confirmation tracking (3 blocks for finality)
- Event detection and processing
- Performance metrics

**Sync States**:
- Syncing: Catching up to latest block
- Synced: < 10 blocks behind
- Error: Connection or processing failure

---

### 33. Registry Requirements Catalog State

```typescript
interface RegistryRequirementsCatalogState {
  // Catalog Entries
  catalog: Map<string, RegistryRequirements>
  
  type RegistryRequirements = {
    registryId: string
    methodologyCode: string
    methodologyVersion: string
    projectType?: string
    
    // Requirements Definition
    requiredFields: RequirementField[]
    requiredEvidenceTypes: string[]
    recommendedFields: string[]
    conditionalRequirements: ConditionalRequirement[]
    
    // Metadata
    lastUpdated: Date
    version: number
    status: 'active' | 'deprecated' | 'draft'
  }
  
  type RequirementField = {
    jsonPath: string // e.g., 'mrv_data.baseline.emissions'
    fieldType: 'string' | 'number' | 'boolean' | 'object' | 'array'
    required: boolean
    validationRules?: {
      min?: number
      max?: number
      pattern?: string
      enum?: any[]
    }
  }
  
  type ConditionalRequirement = {
    condition: {
      field: string
      operator: '==' | '!=' | '>' | '<' | 'in'
      value: any
    }
    thenRequired: string[] // Field paths
  }
  
  // Catalog Loading State
  catalogLoading: Map<string, boolean> // registryId+methodology -> loading
  catalogCache: {
    entries: Map<string, CachedRequirements>
    lastRefresh: Date
    ttl: number // seconds
  }
  
  // Catalog Version Management
  catalogVersions: Map<string, CatalogVersion[]>
  
  type CatalogVersion = {
    versionId: string
    registryId: string
    methodologyCode: string
    version: number
    effectiveDate: Date
    deprecatedDate: Date | null
    changes: string[]
  }
}
```

**Key Features**:
- Requirements catalog per registry+methodology
- Field validation rules
- Conditional requirements
- Catalog versioning and cache management

**Used For**:
- Gap analysis
- Validation
- Verification checklists
- Registry adapter transformations

---

### 34. Methodology State

```typescript
interface MethodologyState {
  // Available Methodologies
  methodologies: Map<string, Methodology>
  
  type Methodology = {
    methodologyId: string
    code: string // e.g., 'VM0042', 'Puro-BCR'
    name: string
    version: string
    registryId: string
    
    // Methodology Details
    projectTypes: string[]
    calculationApproach: string
    evidenceRequirements: string[]
    verificationRequirements: string[]
    
    // Version Info
    status: 'active' | 'deprecated' | 'draft'
    effectiveDate: Date
    expiryDate: Date | null
    supersededBy: string | null
    
    // Compatibility
    compatibleWith: {
      registries: string[]
      projectTypes: string[]
      regions: string[]
    }
  }
  
  // Methodology Selection State
  methodologySelection: {
    availableForProject: Methodology[]
    selectedMethodology: Methodology | null
    selectionLocked: boolean // After computation starts
    
    // Comparison State
    comparisonMode: boolean
    comparedMethodologies: Methodology[]
  }
  
  // Methodology Calculations State
  calculations: Map<string, MethodologyCalculation>
  
  type MethodologyCalculation = {
    methodologyId: string
    projectId: string
    
    // Calculation Formulas
    formulas: {
      baselineEmissions: string
      projectEmissions: string
      grossRemoval: string
      leakageDeduction: string
      bufferContribution: string
      netRemoval: string
    }
    
    // Parameters
    parameters: {
      leakageFactor: number
      bufferRate: number
      uncertaintyBounds: [number, number]
    }
    
    // Results Cache
    lastCalculation: {
      result: number // tCO2e
      timestamp: Date
      inputs: any
    } | null
  }
}
```

**Key Features**:
- Methodology catalog and versioning
- Methodology selection and locking
- Formula and parameter management
- Calculation result caching

**Selection Flow**:
- Available based on project type
- Locked after computation starts
- Cannot change without invalidating work

---

### 35. Retirement Certificate State

```typescript
interface RetirementCertificateState {
  // Certificate Generation
  certificates: Map<string, RetirementCertificate>
  
  type RetirementCertificate = {
    certificateId: string
    creditId: string
    tokenId: string
    
    // Certificate Details
    beneficiary: string
    retiredTonnage: number
    retirementDate: Date
    registrySerial: string
    projectName: string
    methodology: string
    vintage: number
    
    // Certificate Generation Status
    generationStatus: 'pending' | 'generating' | 'completed' | 'failed'
    generatedAt: Date | null
    pdfUrl: string | null
    ipfsHash: string | null
    
    // Certificate Metadata
    certificateNumber: string
    qrCode: string // For verification
    digitalSignature: string
    
    // Download Tracking
    downloads: CertificateDownload[]
    
    type CertificateDownload = {
      downloadedAt: Date
      downloadedBy: string
      ipAddress: string
    }
  }
  
  // Batch Certificates
  batchCertificates: Map<string, BatchCertificate>
  
  type BatchCertificate = {
    batchCertificateId: string
    credits: string[] // creditIds
    beneficiary: string
    totalTonnage: number
    generationStatus: 'pending' | 'generating' | 'completed' | 'failed'
    pdfUrl: string | null
  }
  
  // Certificate Verification
  certificateVerification: {
    verificationUrl: string
    publicVerificationEndpoint: string
  }
}
```

**Key Features**:
- Certificate generation tracking
- PDF and IPFS storage
- Digital signature and QR code
- Download tracking
- Batch certificate support

**Generation Flow**:
- Triggered after successful retirement
- PDF generated with certificate number
- Uploaded to IPFS for permanence
- Public verification via QR code

---

### 36. Registry Cancellation State

```typescript
interface RegistryCancellationState {
  // Cancellation Requests
  cancellationRequests: Map<string, CancellationRequest>
  
  type CancellationRequest = {
    requestId: string
    creditId: string
    registryId: string
    registrySerial: string
    
    // Cancellation Reason
    reason: 'nft_mint_failed' | 'double_counting' | 'user_requested' | 
            'registry_migration' | 'error_correction'
    details: string
    
    // Request Status
    status: 'pending' | 'submitted' | 'confirmed' | 'rejected' | 'failed'
    submittedAt: Date | null
    confirmedAt: Date | null
    
    // Registry Response
    registryResponse: {
      approved: boolean
      cancellationDate: Date | null
      refundAmount: number | null
      notes: string
    } | null
    
    // Compensation State
    compensationRequired: boolean
    compensationStatus: 'not_required' | 'pending' | 'completed'
    compensationActions: CompensationAction[]
    
    type CompensationAction = {
      action: string
      status: 'pending' | 'in_progress' | 'completed' | 'failed'
      completedAt: Date | null
    }
  }
  
  // Cancellation History
  cancellationHistory: CancellationRequest[]
  
  // Pending Cancellations by Registry
  pendingByRegistry: Map<string, CancellationRequest[]>
}
```

**Key Features**:
- Cancellation request tracking
- Registry response handling
- Compensation state management
- Cancellation history

**Cancellation Reasons**:
- NFT mint failed: Saga compensation
- Double counting: Compliance violation
- User requested: Manual cancellation
- Registry migration: Void and reissue
- Error correction: Fix submission errors

---

### 37. Circuit Breaker State

```typescript
interface CircuitBreakerState {
  // Circuit Breakers by Service
  circuitBreakers: Map<string, CircuitBreaker>
  
  type CircuitBreaker = {
    serviceId: string
    serviceName: string
    
    // Circuit State
    state: 'closed' | 'open' | 'half-open'
    stateChangedAt: Date
    
    // Failure Tracking
    failureCount: number
    failureThreshold: number // Default: 5
    successCount: number // In half-open state
    successThreshold: number // Default: 2
    
    // Timing
    timeout: number // Open state duration (default: 60s)
    nextRetryAt: Date | null
    
    // Metrics
    metrics: {
      totalRequests: number
      successfulRequests: number
      failedRequests: number
      rejectedRequests: number // While open
      avgResponseTime: number
    }
    
    // Recent Failures
    recentFailures: CircuitBreakerFailure[]
    
    type CircuitBreakerFailure = {
      timestamp: Date
      error: Error
      requestDetails: any
    }
  }
  
  // Global Circuit Breaker Status
  globalStatus: {
    totalCircuitBreakers: number
    openCircuitBreakers: number
    halfOpenCircuitBreakers: number
    lastStatusChange: Date
  }
  
  // Circuit Breaker Alerts
  alerts: CircuitBreakerAlert[]
  
  type CircuitBreakerAlert = {
    alertId: string
    serviceId: string
    state: 'open' | 'half-open'
    triggeredAt: Date
    acknowledgedAt: Date | null
    resolvedAt: Date | null
  }
}
```

**Key Features**:
- Per-service circuit breaker tracking
- State machine (closed → open → half-open → closed)
- Failure and success counting
- Alert generation

**State Transitions**:
- **Closed**: Normal operation, count failures
- **Open**: After 5 failures, reject all requests
- **Half-Open**: After 60s, test with 2 requests
- **Closed**: After 2 successes in half-open

---

### 38. Dead Letter Queue (DLQ) State

```typescript
interface DeadLetterQueueState {
  // DLQ Messages
  dlqMessages: Map<string, DLQMessage>
  
  type DLQMessage = {
    messageId: string
    queueName: string
    
    // Original Event/Request
    originalEvent: {
      eventId: string
      eventType: string
      payload: any
      timestamp: Date
    }
    
    // Failure Information
    failureInfo: {
      failureReason: string
      errorMessage: string
      errorStack: string
      retryCount: number
      lastRetryAt: Date
    }
    
    // DLQ Metadata
    arrivedAt: Date
    ttl: number // Time to live in DLQ (days)
    expiresAt: Date
    
    // Review Status
    reviewStatus: 'pending_review' | 'under_review' | 'resolved' | 'discarded'
    assignedTo: string | null
    reviewNotes: string
    
    // Resolution Actions
    resolution: {
      action: 'requeue' | 'manual_fix' | 'discard' | 'escalate'
      resolvedAt: Date | null
      resolvedBy: string | null
    } | null
  }
  
  // DLQ Metrics
  metrics: {
    totalMessages: number
    messagesByQueue: Map<string, number>
    messagesByAge: {
      last1Hour: number
      last24Hours: number
      last7Days: number
      older: number
    }
    averageTimeInDLQ: number // hours
  }
  
  // DLQ Alerts
  dlqAlerts: DLQAlert[]
  
  type DLQAlert = {
    alertId: string
    queueName: string
    currentDepth: number
    threshold: number // Default: 100
    severity: 'warning' | 'critical'
    triggeredAt: Date
  }
  
  // DLQ Management
  management: {
    autoDiscardEnabled: boolean
    autoDiscardAfterDays: number
    manualReviewRequired: boolean
    escalationRules: EscalationRule[]
  }
}
```

**Key Features**:
- DLQ message tracking and management
- Review workflow (pending → under review → resolved)
- Resolution actions (requeue, fix, discard, escalate)
- Alert thresholds and auto-discard

**Alert Threshold**: DLQ depth > 100 messages

---

### 39. Event Store State

```typescript
interface EventStoreState {
  // Event Store Connection
  connection: {
    status: 'disconnected' | 'connecting' | 'connected' | 'error'
    host: string
    lastConnectionAt: Date | null
    connectionError: Error | null
  }
  
  // Event Count and Sequences
  eventCounts: {
    totalEvents: number
    currentSequence: number
    eventsToday: number
    eventsThisWeek: number
    eventsThisMonth: number
  }
  
  // Storage Tiers
  storageTiers: {
    hot: {
      tier: 'PostgreSQL'
      retentionDays: 90
      eventCount: number
      storageSize: number // GB
      status: 'healthy' | 'warning' | 'critical'
    }
    warm: {
      tier: 'S3 Glacier'
      retentionDays: 730 // 2 years
      eventCount: number
      storageSize: number // GB
      status: 'healthy' | 'warning' | 'critical'
    }
    cold: {
      tier: 'S3 Deep Archive'
      retentionDays: 3650 // 10 years
      eventCount: number
      storageSize: number // GB
      status: 'healthy' | 'warning' | 'critical'
    }
  }
  
  // Event Archival Status
  archival: {
    lastArchivalRun: Date | null
    nextArchivalRun: Date | null
    eventsArchived: number
    archivalStatus: 'idle' | 'running' | 'completed' | 'failed'
    archivalError: Error | null
  }
  
  // Event Query Performance
  queryPerformance: {
    avgQueryTime: number // milliseconds
    slowQueries: SlowQuery[]
    
    type SlowQuery = {
      query: string
      duration: number
      timestamp: Date
    }
  }
}
```

**Key Features**:
- Event store connection monitoring
- Multi-tier storage tracking (hot/warm/cold)
- Archival job status
- Query performance monitoring

**Storage Retention**:
- Hot (PostgreSQL): 90 days
- Warm (S3 Glacier): 2 years
- Cold (S3 Deep Archive): 10 years

---

### 40. Snapshot/Checkpoint State

```typescript
interface SnapshotCheckpointState {
  // Snapshots by Component
  snapshots: Map<string, ComponentSnapshot>
  
  type ComponentSnapshot = {
    componentId: string
    componentName: 'credit-service' | 'billing-ledger' | 'process-state'
    
    // Snapshot Configuration
    frequency: number | 'daily' | 'per_step'
    frequencyUnit?: 'events' | 'hours' | 'days'
    
    // Snapshot Status
    lastSnapshot: {
      snapshotId: string
      timestamp: Date
      eventSequence: number
      storageLocation: string
      size: number // bytes
      compressionRatio: number
    } | null
    
    nextSnapshot: {
      estimatedAt: Date
      eventsUntilNext?: number
    } | null
    
    // Snapshot History
    history: SnapshotRecord[]
    
    type SnapshotRecord = {
      snapshotId: string
      timestamp: Date
      eventSequence: number
      size: number
      status: 'completed' | 'failed'
      restoreVerified: boolean
    }
    
    // Restore Capability
    restoreStatus: {
      canRestore: boolean
      lastRestoreTest: Date | null
      restoreTime: number | null // seconds
    }
  }
  
  // Checkpoint Progress
  checkpoints: Map<string, ProcessCheckpoint>
  
  type ProcessCheckpoint = {
    processId: string
    processType: string
    currentStep: string
    checkpointData: any
    createdAt: Date
    canResume: boolean
  }
  
  // Snapshot Performance
  performance: {
    avgSnapshotTime: number // seconds
    avgSnapshotSize: number // MB
    storageUsed: number // GB
    compressionRatio: number
  }
}
```

**Key Features**:
- Per-component snapshot management
- Snapshot frequency configuration
- Restore capability testing
- Process checkpoint for resumption

**Snapshot Frequencies**:
- Credit Service: Every 1000 events
- Billing Ledger: Daily
- Process State: Per step

---

### 41. Process Timeout State

```typescript
interface ProcessTimeoutState {
  // Timeout Configuration by Process Type
  timeoutConfig: Map<string, TimeoutConfig>
  
  type TimeoutConfig = {
    processType: 'credit_issuance' | 'batch_minting' | 'retirement' | 'registry_sync'
    timeout: number // seconds
    warningThreshold: number // percentage (e.g., 80% of timeout)
    action: 'cancel_saga' | 'partial_completion' | 'alert_ops' | 'retry_or_dlq'
  }
  
  // Active Process Timeouts
  activeTimeouts: Map<string, ProcessTimeout>
  
  type ProcessTimeout = {
    processId: string
    processType: string
    startedAt: Date
    timeoutAt: Date
    warningAt: Date
    
    // Timeout Status
    status: 'active' | 'warning' | 'expired' | 'cancelled'
    warningTriggered: boolean
    timeoutTriggered: boolean
    
    // ETA Calculation
    eta: {
      estimatedCompletion: Date
      confidenceLevel: number // 0-1
      basedOnHistoricalData: boolean
    }
    
    // Timeout Actions
    onWarning: TimeoutAction[]
    onTimeout: TimeoutAction[]
    
    type TimeoutAction = {
      action: string
      executed: boolean
      executedAt: Date | null
      result: 'success' | 'failed' | 'pending'
    }
  }
  
  // Timeout History
  timeoutHistory: {
    totalTimeouts: number
    timeoutsByType: Map<string, number>
    averageTimeToTimeout: Map<string, number> // processType -> seconds
    
    recentTimeouts: TimeoutEvent[]
    
    type TimeoutEvent = {
      processId: string
      processType: string
      timedOutAt: Date
      action: string
      result: string
    }
  }
  
  // Timeout Predictions
  predictions: {
    likelyToTimeout: ProcessTimeout[]
    riskFactors: Map<string, string> // processId -> reason
  }
}
```

**Key Features**:
- Timeout configuration per process type
- Warning threshold (e.g., 80% of timeout)
- ETA calculation and confidence
- Timeout action execution tracking

**Timeout Durations**:
- Credit Issuance: 24 hours
- Batch Minting: 4 hours
- Retirement: 1 hour
- Registry Sync: 30 minutes

---

### 42. Dispute / Appeal / Case Management State

```typescript
interface DisputeCaseState {
  // Dispute/Appeal Cases
  cases: Map<string, DisputeCase>
  casesLoading: boolean
  casesError: Error | null

  // Filtering + triage
  filters: {
    status: Array<'open' | 'under_review' | 'awaiting_customer' | 'escalated' | 'resolved' | 'rejected' | 'closed'>
    type: Array<'credit_rejection' | 'verification_dispute' | 'ownership_dispute' | 'methodology_dispute' | 'billing_dispute' | 'other'>
    severity: Array<'low' | 'medium' | 'high' | 'critical'>
    projectId?: string
    creditId?: string
    registryId?: string
  }

  // Active case view
  activeCaseId: string | null
  activeCase: DisputeCase | null
  activeTimeline: CaseEvent[]
  activeMessages: CaseMessage[]
  activeAttachments: CaseAttachment[]

  // SLA tracking (from Governance/Dispute Resolution tables)
  sla: {
    defaultTargetsDays: {
      creditRejection: number // e.g., 14
      verificationDispute: number // e.g., 30
      ownershipDispute: number // e.g., 7
      methodologyDispute: number // e.g., 21
    }
    breaches: CaseSLABreach[]
  }

  type DisputeCase = {
    id: string
    tenantId: string
    createdByUserId: string
    assignedToUserId: string | null
    type: 'credit_rejection' | 'verification_dispute' | 'ownership_dispute' | 'methodology_dispute' | 'billing_dispute' | 'other'
    status: 'open' | 'under_review' | 'awaiting_customer' | 'escalated' | 'resolved' | 'rejected' | 'closed'
    severity: 'low' | 'medium' | 'high' | 'critical'

    // Links to domain entities
    projectId?: string
    mrvSubmissionId?: string
    verificationId?: string
    creditId?: string
    tokenId?: string
    registryId?: string
    registrySerial?: string

    // Narrative
    subject: string
    description: string
    requestedOutcome: string

    // Escalation path
    escalation: {
      level: 'support' | 'dispute_committee' | 'arbitration' | 'expert_panel'
      escalatedAt: Date | null
      reason: string | null
    }

    // Outcome
    resolution: {
      resolvedAt: Date | null
      outcome: 'approved' | 'partially_approved' | 'rejected' | 'withdrawn' | 'no_action'
      actionsTaken: string[]
      notes: string | null
    }

    createdAt: Date
    updatedAt: Date
    dueAt: Date | null // SLA deadline (computed)
  }

  type CaseEvent = {
    id: string
    caseId: string
    timestamp: Date
    actorType: 'user' | 'support' | 'system' | 'verifier' | 'registry'
    eventType:
      | 'created'
      | 'assigned'
      | 'status_changed'
      | 'escalated'
      | 'evidence_added'
      | 'message_sent'
      | 'resolution_recorded'
    payload: any
  }

  type CaseMessage = {
    id: string
    caseId: string
    senderUserId: string
    message: string
    createdAt: Date
  }

  type CaseAttachment = {
    id: string
    caseId: string
    filename: string
    contentType: string
    sizeBytes: number
    storageUri: string // S3/IPFS URI
    sha256: string
    uploadedByUserId: string
    uploadedAt: Date
  }

  type CaseSLABreach = {
    caseId: string
    breachedAt: Date
    targetDays: number
    elapsedDays: number
    severity: 'warning' | 'critical'
  }
}
```

**Why**: `dmrv_saa_s_architecture_near_nft_design.md` defines **Dispute Resolution** (credit rejection, verification dispute, ownership dispute, methodology dispute) with SLAs and escalation paths.

---

### 43. SLO/SLA + Incident + Runbook + DR/Backup Operations State

```typescript
interface OperationsSREState {
  // SLO/SLA dashboards (service health + targets)
  slo: {
    services: Map<string, ServiceSLO>
    lastUpdatedAt: Date | null
    loading: boolean
    error: Error | null
  }

  type ServiceSLO = {
    serviceId: string
    serviceName: string
    targets: {
      availabilityPercent: number // e.g., 99.9
      p95LatencyMs?: number
      errorRatePercent?: number
      syncDelaySeconds?: number // e.g., registry sync delay
    }
    current: {
      availabilityPercent: number
      p95LatencyMs?: number
      errorRatePercent?: number
      syncDelaySeconds?: number
    }
    window: '5m' | '1h' | '24h' | '7d' | '30d'
    status: 'healthy' | 'warning' | 'breached'
    breach: {
      breachedAt: Date | null
      reason: string | null
      burnRate?: number
    }
  }

  // Incident management (PagerDuty/OpsGenie integration concept)
  incidents: {
    active: Incident[]
    history: Incident[]
    loading: boolean
    error: Error | null
  }

  type Incident = {
    incidentId: string
    title: string
    severity: 'p1' | 'p2' | 'p3' | 'p4'
    status: 'triggered' | 'acknowledged' | 'investigating' | 'mitigated' | 'resolved'
    affectedServices: string[]
    startedAt: Date
    acknowledgedAt: Date | null
    resolvedAt: Date | null
    communication: {
      internalChannel?: string // slack/teams link
      publicStatusPage?: string
      lastUpdateAt?: Date
    }
    metrics: {
      errorRatePercent?: number
      latencyMs?: number
      dlqDepth?: number
      consumerLag?: number
    }
    postmortem: {
      required: boolean
      dueAt: Date | null
      completedAt: Date | null
      docUrl: string | null
    }
  }

  // Runbooks (operational procedures)
  runbooks: {
    catalog: Runbook[]
    lastViewedRunbooks: string[]
    execution: Map<string, RunbookExecution> // executionId -> run
  }

  type Runbook = {
    runbookId: string
    name: string
    description: string
    tags: string[] // e.g., 'registry', 'near', 'dlq', 'replay'
    docUrl: string
    ownerTeam: string
    lastUpdatedAt: Date
  }

  type RunbookExecution = {
    executionId: string
    runbookId: string
    initiatedByUserId: string
    status: 'in_progress' | 'completed' | 'cancelled' | 'failed'
    startedAt: Date
    completedAt: Date | null
    steps: Array<{
      stepId: string
      title: string
      status: 'pending' | 'done' | 'skipped' | 'failed'
      notes?: string
    }>
    outcomeNotes: string | null
  }

  // DR/Backups/Fault tolerance visibility (backup freshness, failover readiness, DR drills)
  disasterRecovery: {
    status: 'ready' | 'degraded' | 'not_ready'
    lastDRDrillAt: Date | null
    nextPlannedDrillAt: Date | null
    rpoMinutes: number | null
    rtoMinutes: number | null
    backups: {
      database: BackupStatus
      eventStore: BackupStatus
      objectStorage: BackupStatus
    }
    failover: {
      primaryRegion: string
      secondaryRegion: string
      replicationLagSeconds: number | null
      lastFailoverTestAt: Date | null
    }
  }

  type BackupStatus = {
    component: string
    frequency: string // e.g., 'continuous', 'daily'
    retentionDays: number
    lastSuccessfulBackupAt: Date | null
    lastFailedBackupAt: Date | null
    status: 'healthy' | 'warning' | 'failed'
    details?: string
  }
}
```

**Why**: The architecture specifies **SLOs**, **alerting/incident management**, **runbooks**, and **DR/backup/failover** strategies. An admin dashboard needs state to represent these operational controls and health signals.

---

### 44. Notification Delivery / Outbox / Provider Health State

```typescript
interface NotificationDeliveryState {
  // Unified delivery outbox for email/webhooks/in-app
  outbox: {
    items: DeliveryItem[]
    loading: boolean
    error: Error | null
    filters: {
      channel: Array<'email' | 'webhook' | 'in_app'>
      status: Array<'queued' | 'sending' | 'delivered' | 'failed' | 'retrying' | 'suppressed'>
      eventType?: string
      tenantId?: string
      since?: Date
      until?: Date
    }
  }

  // Provider health (SES/SendGrid/etc + webhook delivery pipeline)
  providers: {
    email: ProviderHealth
    webhook: ProviderHealth
    inApp: ProviderHealth
  }

  type ProviderHealth = {
    status: 'operational' | 'degraded' | 'down'
    lastCheckedAt: Date | null
    errorRatePercent: number | null
    avgLatencyMs: number | null
    incidents: string[] // incidentIds (link to Ops state)
  }

  // Retry policy visibility (align with webhook retry + external API retry patterns)
  retryPolicy: {
    maxAttempts: number
    backoff: 'exponential' | 'linear'
    baseDelayMs: number
  }

  type DeliveryItem = {
    deliveryId: string
    channel: 'email' | 'webhook' | 'in_app'
    tenantId: string
    userId?: string
    destination: string // email address or webhook URL (masked in UI)
    eventId: string
    eventType: string
    createdAt: Date

    status: 'queued' | 'sending' | 'delivered' | 'failed' | 'retrying' | 'suppressed'
    attempts: DeliveryAttempt[]
    lastAttemptAt: Date | null
    nextRetryAt: Date | null

    // Policy controls
    suppression: {
      suppressed: boolean
      reason?: 'bounced' | 'complaint' | 'disabled' | 'rate_limited' | 'policy'
      suppressedAt?: Date
    }
  }

  type DeliveryAttempt = {
    attempt: number
    startedAt: Date
    endedAt: Date | null
    result: 'success' | 'failed'
    statusCode?: number
    error?: string
    responseTimeMs?: number
  }
}
```

**Why**: Workflows explicitly “notify tenant (email/webhook)” and the architecture defines a dedicated **Webhook Service** with retries. The dashboard needs state to show delivery status, failures, retries, and provider health (especially for admin/operator views).

---

## State Management Architecture

### Recommended Stack

#### Primary: Zustand (Recommended)
- **Why**: Lightweight, simple API, great TypeScript support
- **Use for**: Global application state, UI state, preferences
- **Example**:
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useProjectStore = create(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
    }),
    { name: 'project-storage' }
  )
)
```

#### Secondary: React Query / TanStack Query
- **Why**: Excellent for server state, caching, synchronization
- **Use for**: API data, server state, automatic refetching
- **Example**:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query'

const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: () => apiClient.get('/projects'),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

#### Form State: React Hook Form
- **Why**: Performance, validation, minimal re-renders
- **Use for**: All forms (project creation, MRV submission, etc.)

#### State Machines: XState (Optional)
- **Why**: Complex workflows need state machines
- **Use for**: Verification workflow, Saga pattern, Registry change workflow

### State Organization

```
src/
├── stores/                         # Zustand stores
│   ├── auth.store.ts              # Authentication & user
│   ├── project.store.ts           # Projects
│   ├── mrv.store.ts              # MRV submissions
│   ├── verification.store.ts     # Verification
│   ├── credit.store.ts            # Credits/NFTs
│   ├── process.store.ts           # Processes/Saga
│   ├── registry.store.ts          # Registry changes
│   ├── billing.store.ts           # Billing
│   ├── settings.store.ts          # Settings
│   ├── ui.store.ts                # UI state
│   ├── cache.store.ts             # Cache management
│   ├── carbon-science.store.ts    # Buffer pool, permanence, vintage
│   ├── batch.store.ts             # Batch operations
│   ├── webhook.store.ts           # Webhook configuration
│   ├── feature.store.ts           # Feature flags & entitlements
│   ├── sso.store.ts               # SSO & SCIM state
│   ├── verifier.store.ts          # Verifier management
│   ├── audit.store.ts             # Audit & compliance
│   └── marketplace.store.ts       # Marketplace (future)
├── hooks/                          # Custom hooks
│   ├── useProjects.ts             # Project hooks
│   ├── useMRV.ts                  # MRV hooks
│   ├── useVerification.ts         # Verification hooks
│   ├── useCredits.ts              # Credit hooks
│   ├── useRealTime.ts             # Real-time updates
│   ├── useBatch.ts                # Batch operations
│   ├── useWebhooks.ts             # Webhook management
│   ├── useCarbonScience.ts        # Carbon science data
│   ├── useVerifiers.ts            # Verifier management
│   └── useFeatures.ts             # Feature access
└── state-machines/                 # XState machines (optional)
    ├── verification.machine.ts
    ├── saga.machine.ts
    ├── registry-change.machine.ts
    ├── batch.machine.ts
    └── reversal.machine.ts
```

---

## State Persistence Strategy

### Persist to localStorage

```typescript
// User preferences
- userPreferences
- tenantSettings
- notificationPreferences
- theme preferences

// Form drafts (auto-save)
- projectDraft
- mrvSubmissionDraft
- verificationResponseDraft

// UI preferences
- sidebarCollapsed
- tableColumnPreferences
- dashboardWidgetLayout
```

### Persist to sessionStorage

```typescript
// Session-specific state
- currentRoute
- navigationHistory
- openModals
- temporaryFilters
```

### Don't Persist (In-Memory Only)

```typescript
// Real-time data
- real-time events
- WebSocket connection state
- event queue

// Loading states
- loadingStates
- optimistic updates

// Cache (handled by React Query)
- API response cache
- query cache
```

### Implementation Example

```typescript
// Zustand with persistence
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useSettingsStore = create(
  persist(
    (set) => ({
      tenantSettings: null,
      updateSettings: (settings) => set({ tenantSettings: settings }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

---

## Real-Time State Synchronization

### WebSocket/SSE Connection

```typescript
// Real-time event handling
interface RealTimeEvent {
  type: EventType
  payload: any
  timestamp: Date
  tenantId: string
}

// Event handlers
const eventHandlers = {
  'mrv.computed.v1': (payload) => {
    // Update MRV computation state
    updateMRVComputation(payload)
  },
  'mrv.approved.v1': (payload) => {
    // Update MRV approval state
    updateMRVApproval(payload)
  },
  'blockchain.nft.minted.v1': (payload) => {
    // Update credit status
    updateCreditStatus(payload)
  },
  // ... other events
}
```

### Optimistic Updates

```typescript
// Example: Registry change
const changeRegistry = async (projectId, newRegistry) => {
  // Optimistic update
  updateProjectOptimistically(projectId, { targetRegistry: newRegistry })
  
  try {
    const result = await apiClient.put(`/projects/${projectId}/registry`, {
      new_registry: newRegistry
    })
    // Confirm update
    updateProject(projectId, result)
  } catch (error) {
    // Rollback optimistic update
    rollbackProjectUpdate(projectId)
    showError(error)
  }
}
```

### Conflict Resolution

```typescript
// Handle concurrent edits
const handleConflict = (localState, serverState) => {
  // Strategy: Last-write-wins with user confirmation
  if (localState.updatedAt > serverState.updatedAt) {
    // Local is newer, ask user
    showConflictDialog(localState, serverState)
  } else {
    // Server is newer, update local
    updateLocalState(serverState)
  }
}
```

---

## Implementation Recommendations

### Phase 1: Core State (Weeks 1-2)

1. **Authentication & User State**
   - User session management
   - Tenant context
   - Multi-tenant switching

2. **Project State**
   - Project list and filters
   - Current project state
   - Basic project CRUD

3. **UI State**
   - Navigation state
   - Modal management
   - Loading states

### Phase 2: Workflow State (Weeks 3-4)

4. **MRV Submission State**
   - MRV list and filters
   - Data collection state
   - Computation state

5. **Verification State**
   - Verification state machine
   - 9-category checklist state
   - Clarification requests

### Phase 3: Advanced State (Weeks 5-6)

6. **Credit State**
   - Credit list and filters
   - NFT minting state
   - NEAR blockchain state

7. **Process State**
   - Saga pattern state
   - Process tracking
   - Error handling

8. **Registry Change State**
   - Registry change workflow
   - Impact assessment
   - Registry comparison

### Phase 4: Real-Time & Optimization (Weeks 7-8)

9. **Real-Time Updates**
   - WebSocket connection
   - Event subscriptions
   - Event queue management

10. **Cache & Performance**
    - React Query integration
    - Optimistic updates
    - Offline support

11. **Analytics State**
    - Dashboard metrics
    - Business KPIs
    - Time series data

### Phase 5: Carbon Science & Batch Operations (Weeks 9-10)

12. **Carbon Science State**
    - Buffer pool tracking
    - Permanence monitoring
    - Vintage & expiry management
    - Reversal event handling

13. **Batch Operations State**
    - Batch minting
    - Batch retirement
    - Progress tracking

14. **Verifier Management State**
    - Verifier assignment
    - Workload tracking
    - Conflict of interest checks

### Phase 6: Enterprise Features (Weeks 11-12)

15. **Webhook State**
    - Webhook configuration
    - Delivery tracking
    - Retry management

16. **Feature Flags State**
    - Plan entitlements
    - Feature access control
    - Upsell tracking

17. **SSO & Identity State**
    - SSO configuration
    - SCIM provisioning
    - Directory sync

18. **Audit & Compliance State**
    - Audit logging
    - GDPR compliance
    - Data retention

### Phase 7: Backend Operations Monitoring (Weeks 13-14)

19. **Retirement Saga State**
    - 4-step retirement workflow
    - Registry reservations
    - Certificate generation tracking

20. **Circuit Breaker State**
    - Per-service circuit breakers
    - State transitions
    - Alert generation

21. **Dead Letter Queue State**
    - DLQ message tracking
    - Review workflow
    - Resolution actions

22. **Registry Adapter Health State**
    - Circuit breakers per registry
    - Retry queue management
    - Performance metrics

23. **NEAR Indexer State**
    - Block sync monitoring
    - Transaction confirmation
    - Event processing

### Phase 8: Event-Driven Architecture (Weeks 15-16)

24. **Event Replay & Recovery State**
    - Replay job management
    - Event store monitoring
    - Snapshot management

25. **Schema Registry State**
    - Schema versioning
    - Compatibility enforcement
    - Migration tracking

26. **Consumer Management State**
    - Consumer health monitoring
    - Lag alerts
    - Backpressure handling

27. **API Idempotency State**
    - Idempotency cache
    - Request deduplication
    - Replay detection

28. **Event Store State**
    - Multi-tier storage tracking
    - Archival jobs
    - Query performance

### Phase 9: Advanced Operations (Weeks 17-18)

29. **Registry Requirements Catalog State**
    - Requirements per registry/methodology
    - Catalog versioning
    - Cache management

30. **Methodology State**
    - Methodology selection
    - Calculation formulas
    - Result caching

31. **Retirement Certificate State**
    - Certificate generation
    - IPFS storage
    - Download tracking

32. **Registry Cancellation State**
    - Cancellation requests
    - Compensation tracking
    - Cancellation history

33. **Snapshot/Checkpoint State**
    - Component snapshots
    - Restore capability
    - Process checkpoints

34. **Process Timeout State**
    - Timeout configuration
    - ETA calculation
    - Timeout predictions

### Phase 10: Marketplace (Future - Weeks 19+)

35. **Marketplace State**
    - Listing management
    - Order book
    - Trading state
    - Wallet integration

---

### State Management Best Practices

1. **Single Source of Truth**
   - Each piece of state has one authoritative source
   - Avoid duplicating state across stores

2. **Normalized State**
   - Store entities by ID in maps/objects
   - Use references instead of nested objects

3. **Derived State**
   - Compute derived values in selectors
   - Use memoization for expensive calculations

4. **State Updates**
   - Use immutable updates
   - Batch related updates
   - Use transactions for atomic updates

5. **Error Handling**
   - Centralized error state
   - Retry mechanisms
   - User-friendly error messages

6. **Performance**
   - Lazy load state
   - Paginate large lists
   - Debounce frequent updates

---

## State Management Libraries Comparison

| Library | Use Case | Pros | Cons |
|---------|----------|------|------|
| **Zustand** | Global state, UI state | Simple, lightweight, TypeScript | Less ecosystem |
| **React Query** | Server state, API data | Caching, refetching, optimistic updates | Learning curve |
| **React Hook Form** | Form state | Performance, validation | Form-specific only |
| **XState** | State machines | Complex workflows, visualization | Steep learning curve |
| **Jotai** | Atomic state | Fine-grained updates | Newer, smaller ecosystem |

---

## Testing State Management

### Unit Tests

```typescript
// Test Zustand store
describe('ProjectStore', () => {
  it('should update current project', () => {
    const store = useProjectStore.getState()
    store.setCurrentProject(mockProject)
    expect(store.currentProject).toEqual(mockProject)
  })
})
```

### Integration Tests

```typescript
// Test state transitions
describe('Verification Workflow', () => {
  it('should transition from in_progress to completed', async () => {
    // Setup
    // Execute
    // Assert state transitions
  })
})
```

---

## Advanced State Management Patterns

This section covers advanced patterns and best practices for production-ready React/Next.js applications.

### 1. State Normalization

**Problem**: Nested data structures make updates difficult and cause unnecessary re-renders.

**Solution**: Normalize state by storing entities by ID in maps/objects.

```typescript
// ❌ BAD: Nested structure
interface BadState {
  projects: Array<{
    id: string
    name: string
    credits: Array<{
      id: string
      tonnage: number
    }>
  }>
}

// ✅ GOOD: Normalized structure
interface NormalizedState {
  entities: {
    projects: Record<string, Project>
    credits: Record<string, Credit>
  }
  ids: {
    projectIds: string[]
    creditIds: string[]
  }
  relationships: {
    projectCredits: Record<string, string[]> // projectId -> creditIds[]
  }
}

// Normalization helper
const normalizeProjects = (projects: Project[]) => {
  const entities = {
    projects: {},
    credits: {},
  }
  const ids = {
    projectIds: [],
    creditIds: [],
  }
  const relationships = {
    projectCredits: {},
  }
  
  projects.forEach(project => {
    entities.projects[project.id] = {
      ...project,
      credits: undefined, // Remove nested credits
    }
    ids.projectIds.push(project.id)
    relationships.projectCredits[project.id] = project.credits.map(c => c.id)
    
    project.credits.forEach(credit => {
      entities.credits[credit.id] = credit
      ids.creditIds.push(credit.id)
    })
  })
  
  return { entities, ids, relationships }
}

// Usage in Zustand store
const useProjectStore = create<NormalizedState>((set) => ({
  entities: { projects: {}, credits: {} },
  ids: { projectIds: [], creditIds: [] },
  relationships: { projectCredits: {} },
  
  addProject: (project) => set((state) => ({
    entities: {
      ...state.entities,
      projects: {
        ...state.entities.projects,
        [project.id]: project,
      },
    },
    ids: {
      ...state.ids,
      projectIds: [...state.ids.projectIds, project.id],
    },
  })),
  
  updateProject: (id, updates) => set((state) => ({
    entities: {
      ...state.entities,
      projects: {
        ...state.entities.projects,
        [id]: { ...state.entities.projects[id], ...updates },
      },
    },
  })),
}))
```

**Benefits**:
- Single source of truth per entity
- Easier updates (update by ID, no array searching)
- Better performance (no deep cloning)
- Easier to find relationships
- Predictable state shape

---

### 2. Selectors and Memoization

**Problem**: Derived state calculations can cause unnecessary re-renders and performance issues.

**Solution**: Use selectors with proper memoization.

```typescript
import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'

// ❌ BAD: Recalculates on every render
const MyComponent = () => {
  const projects = useProjectStore(state => state.entities.projects)
  const activeProjects = Object.values(projects).filter(p => p.status === 'active')
  // This recalculates even if projects didn't change!
}

// ✅ GOOD: Memoized selector
const selectActiveProjects = (state: ProjectState) =>
  Object.values(state.entities.projects).filter(p => p.status === 'active')

const MyComponent = () => {
  const activeProjects = useProjectStore(selectActiveProjects, shallow)
  // Only recalculates when projects change
}

// ✅ BETTER: Custom hook with memoization
const useActiveProjects = () => {
  const projects = useProjectStore(state => state.entities.projects)
  
  return useMemo(
    () => Object.values(projects).filter(p => p.status === 'active'),
    [projects]
  )
}

// ✅ BEST: Reselect-style selectors for complex derivations
import { createSelector } from 'reselect'

const selectProjects = (state: ProjectState) => state.entities.projects
const selectFilters = (state: ProjectState) => state.filters

const selectFilteredProjects = createSelector(
  [selectProjects, selectFilters],
  (projects, filters) => {
    let result = Object.values(projects)
    
    if (filters.status.length > 0) {
      result = result.filter(p => filters.status.includes(p.status))
    }
    
    if (filters.registry.length > 0) {
      result = result.filter(p => filters.registry.includes(p.targetRegistry))
    }
    
    if (filters.searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    }
    
    return result
  }
)

// Usage
const FilteredProjectList = () => {
  const projects = useProjectStore(selectFilteredProjects)
  // Only recalculates when projects or filters change
}
```

**Best Practices**:
- Always memoize derived state
- Use `shallow` equality for object/array comparisons
- Create reusable selector functions
- Consider `reselect` for complex derivations
- Profile with React DevTools to verify memoization

---

### 3. Next.js SSR Hydration

**Problem**: State mismatches between server and client cause hydration errors.

**Solution**: Properly handle server-side rendering and hydration.

```typescript
// SSR-safe state hook
const useSSRSafeState = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    // Server: use initial value
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    // Client: try to restore from storage
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })
  
  // Only run on client
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save state:', error)
    }
  }, [key, state])
  
  return [state, setState]
}

// Zustand store with SSR support
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useProjectStore = create(
  persist(
    (set) => ({
      projects: [],
      setProjects: (projects) => set({ projects }),
    }),
    {
      name: 'project-storage',
      storage: createJSONStorage(() => {
        // Return no-op storage on server
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return localStorage
      }),
    }
  )
)

// Prevent hydration mismatch for UI state
const useMounted = () => {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return mounted
}

// Component with SSR-safe state
const MyComponent = () => {
  const mounted = useMounted()
  const [clientOnlyState, setClientOnlyState] = useSSRSafeState('key', defaultValue)
  
  // Show server-safe content until mounted
  if (!mounted) {
    return <Skeleton />
  }
  
  // Now safe to use client-only state
  return <div>{clientOnlyState}</div>
}

// Next.js App Router: Server Component pattern
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch initial data on server
  const projects = await getProjects()
  
  return <ClientDashboard initialProjects={projects} />
}

// app/dashboard/ClientDashboard.tsx
'use client'

export function ClientDashboard({ initialProjects }) {
  const setProjects = useProjectStore(state => state.setProjects)
  
  // Hydrate store with server data
  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects, setProjects])
  
  return <ProjectList />
}
```

**Key Points**:
- Always check `typeof window !== 'undefined'` before accessing browser APIs
- Use `useEffect` for client-only initialization
- Provide fallback UI while hydrating
- Initialize stores with server-fetched data
- Use Next.js App Router server components for initial data

---

### 4. DevTools Integration

**Problem**: Debugging state changes is difficult without visibility.

**Solution**: Integrate with Redux DevTools and Zustand DevTools.

```typescript
import { devtools } from 'zustand/middleware'

// Enable DevTools for Zustand
const useProjectStore = create(
  devtools(
    (set, get) => ({
      projects: [],
      
      // Named actions for DevTools
      setProjects: (projects) =>
        set({ projects }, false, 'projects/set'),
      
      addProject: (project) =>
        set(
          (state) => ({
            projects: [...state.projects, project],
          }),
          false,
          'projects/add'
        ),
      
      updateProject: (id, updates) =>
        set(
          (state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
          }),
          false,
          { type: 'projects/update', id, updates } // Action with payload
        ),
    }),
    {
      name: 'ProjectStore', // Store name in DevTools
      enabled: process.env.NODE_ENV === 'development', // Only in dev
    }
  )
)

// Custom DevTools middleware
const devtoolsMiddleware = (config) => (set, get, api) => {
  return config(
    (...args) => {
      const before = get()
      set(...args)
      const after = get()
      
      // Custom logging
      if (process.env.NODE_ENV === 'development') {
        console.group('State Update')
        console.log('Before:', before)
        console.log('After:', after)
        console.groupEnd()
      }
      
      // Send to external monitoring
      if (window.__MONITORING__) {
        window.__MONITORING__.trackStateChange({
          before,
          after,
          timestamp: Date.now(),
        })
      }
    },
    get,
    api
  )
}

// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      <YourApp />
      {/* Only in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  )
}
```

**DevTools Features**:
- Time-travel debugging
- State inspection at any point
- Action replay
- Performance profiling
- Export/import state snapshots

---

### 5. State Migration and Versioning

**Problem**: App updates may require state schema changes, breaking existing persisted state.

**Solution**: Implement versioned state with migrations.

```typescript
interface StateMigration {
  version: number
  migrate: (oldState: any) => any
}

const migrations: StateMigration[] = [
  {
    version: 1,
    migrate: (state) => ({
      ...state,
      // v0 -> v1: Add new field
      newField: null,
    }),
  },
  {
    version: 2,
    migrate: (state) => ({
      ...state,
      // v1 -> v2: Rename field
      renamedField: state.oldField,
      oldField: undefined,
    }),
  },
  {
    version: 3,
    migrate: (state) => ({
      ...state,
      // v2 -> v3: Restructure nested data
      entities: normalizeProjects(state.projects),
      projects: undefined,
    }),
  },
]

// Migration engine
const migrateState = <T extends { version: number }>(
  state: T,
  targetVersion: number
): T => {
  let migrated = { ...state }
  const startVersion = state.version || 0
  
  for (const migration of migrations) {
    if (migration.version > startVersion && migration.version <= targetVersion) {
      console.log(`Migrating state from v${migrated.version} to v${migration.version}`)
      migrated = migration.migrate(migrated)
      migrated.version = migration.version
    }
  }
  
  return migrated
}

// Zustand store with migrations
const CURRENT_VERSION = 3

const useProjectStore = create(
  persist(
    (set) => ({
      version: CURRENT_VERSION,
      projects: [],
      // ... rest of state
    }),
    {
      name: 'project-storage',
      version: CURRENT_VERSION,
      migrate: (persistedState: any, version: number) => {
        // Migrate to current version
        return migrateState(persistedState, CURRENT_VERSION)
      },
      // Handle migration errors
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate state, resetting:', error)
          // Could reset to default state or show error to user
        }
      },
    }
  )
)

// Manual migration trigger (for testing)
const resetAndMigrate = () => {
  const stored = localStorage.getItem('project-storage')
  if (stored) {
    const parsed = JSON.parse(stored)
    const migrated = migrateState(parsed.state, CURRENT_VERSION)
    localStorage.setItem(
      'project-storage',
      JSON.stringify({ state: migrated, version: CURRENT_VERSION })
    )
  }
}
```

**Migration Best Practices**:
- Always increment version on schema changes
- Test migrations thoroughly
- Keep migrations idempotent
- Log migration progress
- Provide rollback mechanism if possible
- Clear old persisted state after major versions

---

### 6. State Security

**Problem**: Sensitive data in client state can be exposed via DevTools, storage, or XSS.

**Solution**: Implement security measures for sensitive state.

```typescript
// Security rules for state
interface SecurityPolicy {
  // Never store in client state
  forbidden: string[]
  // Encrypt before persisting
  encrypted: string[]
  // Sanitize before logging
  sanitized: string[]
}

const securityPolicy: SecurityPolicy = {
  forbidden: [
    'password',
    'apiKey',
    'secret',
    'privateKey',
  ],
  encrypted: [
    'sessionToken',
    'refreshToken',
  ],
  sanitized: [
    'email',
    'phone',
    'ssn',
  ],
}

// Sanitize state for logging/debugging
const sanitizeState = (state: any): any => {
  const sanitized = { ...state }
  
  securityPolicy.sanitized.forEach((key) => {
    if (key in sanitized) {
      sanitized[key] = '***REDACTED***'
    }
  })
  
  return sanitized
}

// Encrypt sensitive fields before persistence
const encryptSensitiveFields = async (state: any): Promise<any> => {
  const encrypted = { ...state }
  
  for (const key of securityPolicy.encrypted) {
    if (key in encrypted) {
      encrypted[key] = await encrypt(encrypted[key])
    }
  }
  
  return encrypted
}

// Secure storage implementation
const createSecureStorage = () => {
  return {
    getItem: async (name: string) => {
      try {
        const item = localStorage.getItem(name)
        if (!item) return null
        
        const parsed = JSON.parse(item)
        // Decrypt sensitive fields
        for (const key of securityPolicy.encrypted) {
          if (key in parsed.state) {
            parsed.state[key] = await decrypt(parsed.state[key])
          }
        }
        
        return JSON.stringify(parsed)
      } catch (error) {
        console.error('Failed to decrypt state:', error)
        return null
      }
    },
    
    setItem: async (name: string, value: string) => {
      try {
        const parsed = JSON.parse(value)
        // Encrypt sensitive fields
        parsed.state = await encryptSensitiveFields(parsed.state)
        localStorage.setItem(name, JSON.stringify(parsed))
      } catch (error) {
        console.error('Failed to encrypt state:', error)
      }
    },
    
    removeItem: (name: string) => {
      localStorage.removeItem(name)
    },
  }
}

// Store with security
const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        sessionToken: null, // Will be encrypted
        
        setAuth: (user, sessionToken) => {
          // Validate input
          if (!user || !sessionToken) {
            throw new Error('Invalid auth data')
          }
          
          set({ user, sessionToken })
        },
      }),
      {
        name: 'auth-storage',
        storage: createSecureStorage(),
      }
    ),
    {
      // Sanitize state in DevTools
      serialize: (state) => sanitizeState(state),
    }
  )
)

// XSS prevention
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Validate and sanitize before storing
const addUserInput = (input: string) => {
  const sanitized = sanitizeInput(input)
  useProjectStore.setState({ userInput: sanitized })
}
```

**Security Checklist**:
- ✅ Never store passwords in client state
- ✅ Encrypt tokens before persisting
- ✅ Sanitize user input before storing
- ✅ Redact sensitive data in logs
- ✅ Use HTTPS for all API calls
- ✅ Implement CSP headers
- ✅ Validate all state updates
- ✅ Clear sensitive state on logout

---

### 7. Runtime State Validation

**Problem**: Invalid state can cause runtime errors and data corruption.

**Solution**: Use schema validation libraries like Zod for runtime checks.

```typescript
import { z } from 'zod'

// Define schemas
const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  status: z.enum(['setup', 'data_collection', 'computed', 'verified']),
  targetRegistry: z.enum(['verra', 'puro', 'isometric']).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const ProjectStateSchema = z.object({
  projects: z.array(ProjectSchema),
  currentProject: ProjectSchema.nullable(),
  projectsLoading: z.boolean(),
  projectsError: z.instanceof(Error).nullable(),
})

type ProjectState = z.infer<typeof ProjectStateSchema>

// Validated store
const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  projectsLoading: false,
  projectsError: null,
  
  // Validated update
  addProject: (project: unknown) => {
    try {
      // Validate input
      const validated = ProjectSchema.parse(project)
      
      set((state) => ({
        projects: [...state.projects, validated],
      }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Invalid project data:', error.errors)
        throw new Error('Invalid project data')
      }
      throw error
    }
  },
  
  // Batch validation
  setProjects: (projects: unknown[]) => {
    try {
      const validated = z.array(ProjectSchema).parse(projects)
      set({ projects: validated })
    } catch (error) {
      console.error('Invalid projects data:', error)
      set({ projectsError: error as Error })
    }
  },
}))

// Middleware for automatic validation
const validateMiddleware = <T>(schema: z.ZodSchema<T>) => {
  return (config: StateCreator<T>) => (set, get, api) => {
    return config(
      (partial, replace, action) => {
        try {
          // Validate the next state
          const nextState = typeof partial === 'function'
            ? partial(get())
            : partial
          
          const validated = schema.parse({ ...get(), ...nextState })
          
          set(partial, replace, action)
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('State validation failed:', error.errors)
            // Could revert to previous state or show error
          }
          throw error
        }
      },
      get,
      api
    )
  }
}

// API response validation
const fetchProjects = async () => {
  const response = await fetch('/api/projects')
  const data = await response.json()
  
  // Validate API response before updating state
  const validated = z.array(ProjectSchema).parse(data)
  
  useProjectStore.getState().setProjects(validated)
}

// Form validation with React Hook Form + Zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const ProjectForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ProjectSchema),
  })
  
  const onSubmit = (data: z.infer<typeof ProjectSchema>) => {
    // Data is already validated by Zod
    useProjectStore.getState().addProject(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      {/* ... */}
    </form>
  )
}
```

**Validation Benefits**:
- Catch errors at runtime
- Type-safe state updates
- API response validation
- Form validation integration
- Clear error messages

---

### 8. State Observability and Monitoring

**Problem**: No visibility into state performance and usage patterns in production.

**Solution**: Implement monitoring and analytics for state changes.

```typescript
// Monitoring interface
interface StateMonitoring {
  trackStateChange: (action: string, state: any) => void
  measurePerformance: (fn: () => void) => number
  trackStateSize: (state: any) => number
  reportMetrics: () => void
}

// Performance monitoring middleware
const performanceMiddleware = (config) => (set, get, api) => {
  let updateCount = 0
  let totalUpdateTime = 0
  
  return config(
    (...args) => {
      const start = performance.now()
      
      set(...args)
      
      const end = performance.now()
      const duration = end - start
      
      updateCount++
      totalUpdateTime += duration
      
      // Track slow updates
      if (duration > 16) {
        // > 16ms (one frame at 60fps)
        console.warn(`Slow state update: ${duration}ms`, args)
        
        // Send to monitoring service
        if (window.__ANALYTICS__) {
          window.__ANALYTICS__.track('slow_state_update', {
            duration,
            action: args[2], // action name
            timestamp: Date.now(),
          })
        }
      }
      
      // Report metrics every 100 updates
      if (updateCount % 100 === 0) {
        console.log('State Performance Metrics:', {
          totalUpdates: updateCount,
          averageUpdateTime: totalUpdateTime / updateCount,
          currentStateSize: JSON.stringify(get()).length,
        })
      }
    },
    get,
    api
  )
}

// State size monitoring
const monitorStateSize = (state: any): number => {
  const serialized = JSON.stringify(state)
  const sizeInBytes = new Blob([serialized]).size
  const sizeInKB = sizeInBytes / 1024
  
  // Warn if state is too large
  if (sizeInKB > 5000) {
    // > 5MB
    console.warn(`Large state detected: ${sizeInKB.toFixed(2)}KB`)
  }
  
  return sizeInKB
}

// Analytics integration
const analyticsMiddleware = (config) => (set, get, api) => {
  return config(
    (partial, replace, action) => {
      // Track before state
      const before = get()
      
      // Apply update
      set(partial, replace, action)
      
      // Track after state
      const after = get()
      
      // Send to analytics
      if (window.__ANALYTICS__ && typeof action === 'string') {
        window.__ANALYTICS__.track('state_change', {
          action,
          timestamp: Date.now(),
          stateSize: monitorStateSize(after),
          // Don't send full state (privacy + size)
          // Send aggregated metrics instead
          metrics: {
            projectCount: after.projects?.length || 0,
            creditCount: after.credits?.length || 0,
          },
        })
      }
    },
    get,
    api
  )
}

// Error tracking
const errorTrackingMiddleware = (config) => (set, get, api) => {
  return config(
    (...args) => {
      try {
        set(...args)
      } catch (error) {
        // Track state errors
        console.error('State update error:', error)
        
        if (window.__SENTRY__) {
          window.__SENTRY__.captureException(error, {
            extra: {
              action: args[2],
              stateBefore: sanitizeState(get()),
            },
          })
        }
        
        throw error
      }
    },
    get,
    api
  )
}

// Combine monitoring middlewares
const useProjectStore = create(
  performanceMiddleware(
    analyticsMiddleware(
      errorTrackingMiddleware(
        devtools(
          persist(
            (set) => ({
              // ... store implementation
            }),
            { name: 'project-storage' }
          ),
          { name: 'ProjectStore' }
        )
      )
    )
  )
)

// React Query monitoring
import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Track query performance
      onSuccess: (data, query) => {
        const duration = Date.now() - query.state.dataUpdatedAt
        
        if (duration > 1000) {
          console.warn(`Slow query: ${query.queryKey}`, { duration })
        }
      },
      onError: (error, query) => {
        // Track query errors
        console.error(`Query error: ${query.queryKey}`, error)
        
        if (window.__SENTRY__) {
          window.__SENTRY__.captureException(error, {
            tags: { queryKey: query.queryKey.toString() },
          })
        }
      },
    },
  },
})
```

**Monitoring Metrics**:
- State update frequency
- Update duration (performance)
- State size over time
- Error rates
- User actions leading to state changes

---

### 9. Code Splitting and Lazy Loading

**Problem**: Loading all state stores upfront increases bundle size and initial load time.

**Solution**: Lazy load stores based on routes or features.

```typescript
// Dynamic store loading
const useLazyStore = <T>(storeName: string) => {
  const [store, setStore] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    
    import(`./stores/${storeName}.store`)
      .then((module) => {
        setStore(module.default)
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        setLoading(false)
      })
  }, [storeName])
  
  return { store, loading, error }
}

// Route-based lazy loading
// app/dashboard/page.tsx
const DashboardPage = () => {
  const { store: dashboardStore, loading } = useLazyStore('dashboard')
  
  if (loading) return <Skeleton />
  
  return <DashboardContent store={dashboardStore} />
}

// Feature-based lazy loading
const VerificationPage = () => {
  const [VerificationStore, setVerificationStore] = useState(null)
  
  useEffect(() => {
    // Only load verification store when needed
    import('./stores/verification.store').then((module) => {
      setVerificationStore(module.useVerificationStore)
    })
  }, [])
  
  if (!VerificationStore) return <Loading />
  
  return <VerificationContent store={VerificationStore} />
}

// Preload stores for faster navigation
const preloadStore = (storeName: string) => {
  // Use webpack magic comments for chunk naming
  import(
    /* webpackChunkName: "store-[request]" */
    /* webpackPrefetch: true */
    `./stores/${storeName}.store`
  )
}

// Preload on hover
const NavigationLink = ({ to, storeName }) => {
  return (
    <Link
      to={to}
      onMouseEnter={() => preloadStore(storeName)}
    >
      Navigate
    </Link>
  )
}

// Split stores by domain
// stores/index.ts
export const useCoreStore = create(...) // Always loaded

// Lazy-loaded stores
export const useDashboardStore = lazy(() =>
  import('./dashboard.store').then((m) => ({ default: m.useDashboardStore }))
)

export const useVerificationStore = lazy(() =>
  import('./verification.store').then((m) => ({ default: m.useVerificationStore }))
)

// Dynamic React Query prefetching
import { useQueryClient } from '@tanstack/react-query'

const ProjectLink = ({ projectId }) => {
  const queryClient = useQueryClient()
  
  return (
    <Link
      to={`/projects/${projectId}`}
      onMouseEnter={() => {
        // Prefetch project data on hover
        queryClient.prefetchQuery({
          queryKey: ['project', projectId],
          queryFn: () => fetchProject(projectId),
        })
      }}
    >
      View Project
    </Link>
  )
}
```

**Code Splitting Benefits**:
- Smaller initial bundle
- Faster page loads
- Load stores on-demand
- Better performance for large apps

---

### 10. State Error Boundaries

**Problem**: State errors can crash the entire app.

**Solution**: Implement error boundaries for state-related errors.

```typescript
import React, { Component, ErrorInfo } from 'react'

interface StateErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  resetState?: () => void
}

interface StateErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class StateErrorBoundary extends Component<
  StateErrorBoundaryProps,
  StateErrorBoundaryState
> {
  constructor(props: StateErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error: Error): StateErrorBoundaryState {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('State Error Boundary caught an error:', error, errorInfo)
    
    // Log to error reporting service
    if (window.__SENTRY__) {
      window.__SENTRY__.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      })
    }
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
    
    // Attempt state recovery
    this.recoverState()
  }
  
  recoverState = () => {
    try {
      // Clear corrupted state
      this.props.resetState?.()
      
      // Or reset to default state
      useProjectStore.setState({
        projects: [],
        currentProject: null,
        projectsError: null,
      })
      
      // Clear persisted state if needed
      localStorage.removeItem('project-storage')
    } catch (error) {
      console.error('Failed to recover state:', error)
    }
  }
  
  handleReset = () => {
    this.recoverState()
    this.setState({ hasError: false, error: null })
  }
  
  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong with application state</h2>
            <details>
              <summary>Error details</summary>
              <pre>{this.state.error?.message}</pre>
              <pre>{this.state.error?.stack}</pre>
            </details>
            <button onClick={this.handleReset}>
              Reset and Try Again
            </button>
          </div>
        )
      )
    }
    
    return this.props.children
  }
}

// Usage: Wrap components that use state
const App = () => {
  return (
    <StateErrorBoundary
      onError={(error) => {
        // Custom error handling
        console.error('State error:', error)
      }}
      resetState={() => {
        // Reset all stores
        useProjectStore.getState().reset()
        useAuthStore.getState().reset()
      }}
    >
      <Dashboard />
    </StateErrorBoundary>
  )
}

// Store-level error handling
const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  projectsError: null,
  
  fetchProjects: async () => {
    try {
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      set({ projects: data, projectsError: null })
    } catch (error) {
      // Store error in state instead of throwing
      set({ projectsError: error as Error })
      
      // Show user-friendly notification
      toast.error('Failed to load projects. Please try again.')
    }
  },
  
  reset: () => set({ projects: [], projectsError: null }),
}))

// React Query error boundaries
import { QueryErrorResetBoundary } from '@tanstack/react-query'

const AppWithQueryErrorBoundary = () => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <StateErrorBoundary
          onError={reset}
          fallback={<ErrorFallback onReset={reset} />}
        >
          <App />
        </StateErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

**Error Boundary Best Practices**:
- Wrap components at appropriate levels
- Provide helpful error messages
- Allow user to recover
- Log errors for debugging
- Reset state to known good state
- Test error scenarios

---

### 11. Debouncing and Throttling

**Problem**: Frequent state updates (e.g., from user input) cause performance issues.

**Solution**: Debounce or throttle state updates.

```typescript
import { useDebouncedCallback, useThrottledCallback } from 'use-debounce'

// Debounce: Wait for user to stop typing
const useProjectFilters = () => {
  const setFilters = useProjectStore((state) => state.setFilters)
  
  // Debounce filter updates (300ms delay)
  const debouncedSetFilters = useDebouncedCallback(
    (filters) => {
      setFilters(filters)
    },
    300,
    { maxWait: 1000 } // Maximum 1s wait
  )
  
  return debouncedSetFilters
}

// Throttle: Limit update frequency
const useScrollPosition = () => {
  const setScrollPos = useUIStore((state) => state.setScrollPosition)
  
  // Throttle scroll updates (100ms minimum between updates)
  const throttledSetScrollPos = useThrottledCallback(
    (position) => {
      setScrollPos(position)
    },
    100,
    { trailing: false }
  )
  
  return throttledSetScrollPos
}

// Usage in component
const SearchInput = () => {
  const [localValue, setLocalValue] = useState('')
  const debouncedSetFilters = useProjectFilters()
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Update local state immediately (responsive UI)
    setLocalValue(value)
    // Debounce the actual filter update (performance)
    debouncedSetFilters({ searchQuery: value })
  }
  
  return <input value={localValue} onChange={handleChange} />
}

// Custom debounce hook
const useDebouncedState = <T>(initialValue: T, delay: number) => {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return [value, debouncedValue, setValue] as const
}

// Store-level debouncing
const useProjectStore = create<ProjectState>((set, get) => {
  let debounceTimer: NodeJS.Timeout | null = null
  
  return {
    projects: [],
    filters: {},
    
    setFilters: (filters) => {
      // Clear previous timer
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      
      // Debounce the actual update
      debounceTimer = setTimeout(() => {
        set({ filters })
        // Fetch filtered data
        get().fetchFilteredProjects()
      }, 300)
    },
    
    fetchFilteredProjects: async () => {
      const { filters } = get()
      // Fetch with current filters
    },
  }
})

// Batch multiple updates
const batchUpdates = () => {
  // React 18+ automatically batches updates
  // No need for unstable_batchedUpdates
  
  useProjectStore.setState({ projectsLoading: true })
  useProjectStore.setState({ projects: [] })
  useProjectStore.setState({ projectsError: null })
  
  // All three updates will be batched into one render
}

// Zustand subscribe with debounce
const subscribeWithDebounce = (callback: () => void, delay: number) => {
  let timeout: NodeJS.Timeout
  
  return useProjectStore.subscribe((state, prevState) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback()
    }, delay)
  })
}
```

**When to Use**:
- **Debounce**: User input (search, forms), resize events
- **Throttle**: Scroll, mouse move, animations
- **Batch**: Multiple related updates

---

### 12. Undo/Redo Functionality

**Problem**: Users need to undo/redo actions (forms, data edits).

**Solution**: Implement history management with undo/redo.

```typescript
interface UndoRedoState<T> {
  past: T[]
  present: T
  future: T[]
}

const createUndoRedoStore = <T extends object>(initialState: T) => {
  return create<UndoRedoState<T> & {
    undo: () => void
    redo: () => void
    set: (fn: (state: T) => T) => void
    canUndo: () => boolean
    canRedo: () => boolean
    reset: () => void
  }>((set, get) => ({
    past: [],
    present: initialState,
    future: [],
    
    set: (fn) => {
      const { present, past } = get()
      const next = fn(present)
      
      set({
        past: [...past, present],
        present: next,
        future: [], // Clear future on new action
      })
    },
    
    undo: () => {
      const { past, present, future } = get()
      
      if (past.length === 0) return
      
      const previous = past[past.length - 1]
      const newPast = past.slice(0, past.length - 1)
      
      set({
        past: newPast,
        present: previous,
        future: [present, ...future],
      })
    },
    
    redo: () => {
      const { past, present, future } = get()
      
      if (future.length === 0) return
      
      const next = future[0]
      const newFuture = future.slice(1)
      
      set({
        past: [...past, present],
        present: next,
        future: newFuture,
      })
    },
    
    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,
    
    reset: () => set({
      past: [],
      present: initialState,
      future: [],
    }),
  }))
}

// Usage
const useProjectFormStore = createUndoRedoStore({
  name: '',
  description: '',
  registry: null,
})

const ProjectForm = () => {
  const { present, set, undo, redo, canUndo, canRedo } = useProjectFormStore()
  
  return (
    <div>
      <input
        value={present.name}
        onChange={(e) =>
          set((state) => ({ ...state, name: e.target.value }))
        }
      />
      
      <button onClick={undo} disabled={!canUndo()}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo()}>
        Redo
      </button>
      
      {/* Keyboard shortcuts */}
      <KeyboardShortcut
        keys={['Control', 'z']}
        onPress={undo}
        disabled={!canUndo()}
      />
      <KeyboardShortcut
        keys={['Control', 'Shift', 'z']}
        onPress={redo}
        disabled={!canRedo()}
      />
    </div>
  )
}

// Limit history size
const createUndoRedoStoreWithLimit = <T,>(
  initialState: T,
  maxHistorySize: number = 50
) => {
  // ... same as above but with:
  
  set: (fn) => {
    const { present, past } = get()
    const next = fn(present)
    
    let newPast = [...past, present]
    // Limit history size
    if (newPast.length > maxHistorySize) {
      newPast = newPast.slice(newPast.length - maxHistorySize)
    }
    
    set({
      past: newPast,
      present: next,
      future: [],
    })
  },
}

// Selective undo (undo specific actions)
interface Action {
  type: string
  payload: any
}

const createSelectiveUndoStore = <T,>(initialState: T) => {
  return create<{
    state: T
    history: Array<{ state: T; action: Action }>
    undoAction: (actionType: string) => void
  }>((set, get) => ({
    state: initialState,
    history: [],
    
    dispatch: (action: Action) => {
      const { state, history } = get()
      const nextState = reducer(state, action)
      
      set({
        state: nextState,
        history: [...history, { state, action }],
      })
    },
    
    undoAction: (actionType: string) => {
      const { history } = get()
      
      // Find the last occurrence of this action type
      const index = history.findLastIndex((h) => h.action.type === actionType)
      
      if (index !== -1) {
        // Restore state from before this action
        set({
          state: history[index].state,
          history: history.filter((_, i) => i !== index),
        })
      }
    },
  }))
}
```

**Undo/Redo Best Practices**:
- Limit history size (memory)
- Clear history on save/submit
- Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
- Show undo/redo availability in UI
- Consider selective undo for complex apps

---

### 13. Middleware Composition

**Problem**: Multiple middleware functions need to be applied in a specific order.

**Solution**: Compose middleware functions properly.

```typescript
type StateCreator<T> = (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>
) => T

type Middleware<T> = (
  config: StateCreator<T>
) => StateCreator<T>

// Compose multiple middlewares
const composeMiddlewares = <T,>(
  ...middlewares: Middleware<T>[]
): Middleware<T> => {
  return (config) => {
    return middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      config
    )
  }
}

// Custom middleware functions
const loggerMiddleware: Middleware<any> = (config) => (set, get, api) => {
  return config(
    (args) => {
      console.log('Before:', get())
      set(args)
      console.log('After:', get())
    },
    get,
    api
  )
}

const timestampMiddleware: Middleware<any> = (config) => (set, get, api) => {
  return config(
    (args) => {
      const timestamp = Date.now()
      set({ ...args, updatedAt: timestamp })
    },
    get,
    api
  )
}

const validationMiddleware = <T,>(schema: z.ZodSchema<T>): Middleware<T> => {
  return (config) => (set, get, api) => {
    return config(
      (args) => {
        try {
          const nextState = { ...get(), ...args }
          schema.parse(nextState)
          set(args)
        } catch (error) {
          console.error('Validation error:', error)
          throw error
        }
      },
      get,
      api
    )
  }
}

// Compose all middlewares
const useProjectStore = create(
  composeMiddlewares(
    devtools,
    persist,
    loggerMiddleware,
    timestampMiddleware,
    validationMiddleware(ProjectSchema)
  )(
    (set) => ({
      projects: [],
      setProjects: (projects) => set({ projects }),
    })
  )
)

// Conditional middleware (dev/prod)
const conditionalMiddleware = (
  condition: boolean,
  middleware: Middleware<any>
): Middleware<any> => {
  return condition ? middleware : (config) => config
}

// Example: Logger only in development
const useStore = create(
  composeMiddlewares(
    conditionalMiddleware(
      process.env.NODE_ENV === 'development',
      loggerMiddleware
    ),
    conditionalMiddleware(
      process.env.NODE_ENV === 'development',
      devtools
    ),
    persist
  )(config)
)
```

**Middleware Order Matters**:
1. DevTools (outermost - sees all updates)
2. Persist (save after validation)
3. Logger (log validated updates)
4. Validation (innermost - validate first)

---

### 14. Comprehensive Testing Strategies

**Problem**: State management needs thorough testing but is often undertested.

**Solution**: Implement comprehensive testing for all state scenarios.

```typescript
import { renderHook, act } from '@testing-library/react'
import { expect, describe, it, beforeEach } from 'vitest'

describe('ProjectStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useProjectStore.setState({
      projects: [],
      currentProject: null,
      projectsLoading: false,
      projectsError: null,
    })
  })
  
  // Test basic state updates
  it('should add a project', () => {
    const { result } = renderHook(() => useProjectStore())
    const mockProject = { id: '1', name: 'Test Project' }
    
    act(() => {
      result.current.addProject(mockProject)
    })
    
    expect(result.current.projects).toHaveLength(1)
    expect(result.current.projects[0]).toEqual(mockProject)
  })
  
  // Test async actions
  it('should fetch projects successfully', async () => {
    const { result } = renderHook(() => useProjectStore())
    const mockProjects = [{ id: '1', name: 'Project 1' }]
    
    // Mock API
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProjects,
    })
    
    await act(async () => {
      await result.current.fetchProjects()
    })
    
    expect(result.current.projects).toEqual(mockProjects)
    expect(result.current.projectsError).toBeNull()
  })
  
  // Test error handling
  it('should handle fetch errors', async () => {
    const { result } = renderHook(() => useProjectStore())
    const mockError = new Error('Network error')
    
    global.fetch = vi.fn().mockRejectedValue(mockError)
    
    await act(async () => {
      await result.current.fetchProjects()
    })
    
    expect(result.current.projectsError).toEqual(mockError)
    expect(result.current.projects).toEqual([])
  })
  
  // Test selectors
  it('should filter active projects', () => {
    const { result } = renderHook(() => {
      const projects = useProjectStore((state) => state.projects)
      return useMemo(
        () => projects.filter((p) => p.status === 'active'),
        [projects]
      )
    })
    
    act(() => {
      useProjectStore.setState({
        projects: [
          { id: '1', status: 'active' },
          { id: '2', status: 'inactive' },
          { id: '3', status: 'active' },
        ],
      })
    })
    
    expect(result.current).toHaveLength(2)
  })
  
  // Test persistence
  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useProjectStore())
    const mockProject = { id: '1', name: 'Test' }
    
    act(() => {
      result.current.addProject(mockProject)
    })
    
    const stored = localStorage.getItem('project-storage')
    expect(stored).toBeTruthy()
    
    const parsed = JSON.parse(stored!)
    expect(parsed.state.projects).toContainEqual(mockProject)
  })
  
  // Test state machine transitions
  it('should transition through verification states', () => {
    const { result } = renderHook(() => useVerificationStore())
    
    expect(result.current.status).toBe('not_started')
    
    act(() => {
      result.current.startVerification()
    })
    expect(result.current.status).toBe('started')
    
    act(() => {
      result.current.completeCategory('projectSetup')
    })
    expect(result.current.status).toBe('in_progress')
    
    act(() => {
      result.current.completeVerification()
    })
    expect(result.current.status).toBe('completed')
  })
  
  // Test optimistic updates
  it('should handle optimistic update rollback', async () => {
    const { result } = renderHook(() => useProjectStore())
    const mockProject = { id: '1', name: 'Test' }
    
    // Mock failed API call
    global.fetch = vi.fn().mockRejectedValue(new Error('API Error'))
    
    // Store initial state
    const initialProjects = result.current.projects
    
    await act(async () => {
      // Optimistic update
      result.current.optimisticallyUpdateProject(mockProject)
      
      // Wait for API call to fail
      try {
        await result.current.saveProject(mockProject)
      } catch (error) {
        // Should rollback
      }
    })
    
    // Should be rolled back to initial state
    expect(result.current.projects).toEqual(initialProjects)
  })
  
  // Test React Query integration
  it('should integrate with React Query', async () => {
    const queryClient = new QueryClient()
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
    
    const { result } = renderHook(
      () => useQuery({
        queryKey: ['projects'],
        queryFn: () => fetchProjects(),
      }),
      { wrapper }
    )
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBeDefined()
  })
  
  // Test middleware
  it('should log state changes in development', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    
    const { result } = renderHook(() => useProjectStore())
    
    act(() => {
      result.current.addProject({ id: '1', name: 'Test' })
    })
    
    if (process.env.NODE_ENV === 'development') {
      expect(consoleSpy).toHaveBeenCalled()
    }
  })
  
  // Test state normalization
  it('should normalize nested data', () => {
    const nestedData = [
      {
        id: '1',
        name: 'Project 1',
        credits: [
          { id: 'c1', tonnage: 100 },
          { id: 'c2', tonnage: 200 },
        ],
      },
    ]
    
    const normalized = normalizeProjects(nestedData)
    
    expect(normalized.entities.projects).toHaveProperty('1')
    expect(normalized.entities.credits).toHaveProperty('c1')
    expect(normalized.relationships.projectCredits['1']).toEqual(['c1', 'c2'])
  })
  
  // Test concurrent updates
  it('should handle concurrent updates correctly', async () => {
    const { result } = renderHook(() => useProjectStore())
    
    await act(async () => {
      // Simulate concurrent updates
      await Promise.all([
        result.current.addProject({ id: '1', name: 'Project 1' }),
        result.current.addProject({ id: '2', name: 'Project 2' }),
        result.current.addProject({ id: '3', name: 'Project 3' }),
      ])
    })
    
    expect(result.current.projects).toHaveLength(3)
  })
  
  // Integration test
  it('should complete full credit issuance workflow', async () => {
    const { result: projectResult } = renderHook(() => useProjectStore())
    const { result: mrvResult } = renderHook(() => useMRVStore())
    const { result: verificationResult } = renderHook(() => useVerificationStore())
    
    // 1. Create project
    await act(async () => {
      await projectResult.current.createProject({ name: 'Test Project' })
    })
    
    // 2. Submit MRV data
    await act(async () => {
      await mrvResult.current.submitMRV({ data: 'test' })
    })
    
    // 3. Complete verification
    await act(async () => {
      await verificationResult.current.approve()
    })
    
    // Verify final state
    expect(projectResult.current.currentProject?.status).toBe('verified')
  })
})
```

**Testing Checklist**:
- ✅ Basic CRUD operations
- ✅ Async actions (success/error)
- ✅ Selectors and derived state
- ✅ Persistence (localStorage/sessionStorage)
- ✅ State machine transitions
- ✅ Optimistic updates and rollback
- ✅ React Query integration
- ✅ Middleware functionality
- ✅ Normalization helpers
- ✅ Concurrent updates
- ✅ Full workflow integration tests

---

## Related Documentation

- **Architecture**: `../../docs/architecture/COMPREHENSIVE_WORKFLOWS.md`
- **API Specs**: `../../docs/api/README.md`
- **Development Guide**: `../../docs/development/README.md`
- **Dashboard README**: `./README.md`

---

---

## Summary of State Categories

### Core Platform State (Phases 1-4: Weeks 1-8)
1. Authentication & User State
2. Project State Management
3. MRV Submission State
4. Verification State Management
5. Hashing State
6. Registry Submission State
7. Credit (NFT) State Management
8. Process/Workflow State (Saga Pattern)
9. Registry Change State
10. Double-Counting Prevention State
11. Billing & Subscription State
12. Settings State
13. Real-Time Updates State
14. UI/UX State
15. Cache & Data Management State
16. Error & Retry State
17. Analytics & Metrics State

### Advanced Features (Phases 5-6: Weeks 9-12)
18. **Carbon Science State** - Buffer pool, permanence, vintage, reversal tracking
19. **Batch Operations State** - Batch minting, retirement, progress tracking
20. **Webhook Configuration State** - Webhook management, delivery tracking
21. **Feature Flags & Entitlements State** - Plan-based access control
22. **SSO & Identity Provider State** - Enterprise authentication, SCIM provisioning
23. **Verifier Management State** - Verifier assignment, workload, conflict checks
24. **Audit & Compliance State** - Audit logs, GDPR, data retention
25. **Marketplace State** (Future) - Credit trading, listings, order book

### Backend Operations & Event-Driven Architecture (Phases 7-9: Weeks 13-18)
26. **Retirement Saga State** - 4-step retirement workflow, registry reservations, certificate generation
27. **Event Replay & Recovery State** - Replay jobs, event store monitoring, snapshot management
28. **Schema Registry State** - Schema versioning, compatibility enforcement, migration tracking
29. **Consumer Management State** - Consumer health, lag alerts, backpressure handling
30. **API Idempotency State** - Idempotency cache, request deduplication, replay detection
31. **Registry Adapter Health State** - Circuit breakers, retry queues, DLQ monitoring
32. **NEAR Indexer State** - Block sync, transaction monitoring, event processing
33. **Registry Requirements Catalog State** - Requirements per registry/methodology, catalog versioning
34. **Methodology State** - Methodology selection, calculation formulas, result caching
35. **Retirement Certificate State** - Certificate generation, IPFS storage, download tracking
36. **Registry Cancellation State** - Cancellation requests, compensation tracking
37. **Circuit Breaker State** - Per-service circuit breakers, state transitions, alerts
38. **Dead Letter Queue (DLQ) State** - DLQ messages, review workflow, resolution actions
39. **Event Store State** - Multi-tier storage (hot/warm/cold), archival jobs
40. **Snapshot/Checkpoint State** - Component snapshots, restore capability, checkpoints
41. **Process Timeout State** - Timeout configuration, ETA calculation, timeout predictions

### Governance, Reliability & Delivery Observability (Version 4.1 additions)
42. **Dispute / Appeal / Case Management State** - Dispute cases, SLAs, escalation, evidence, outcomes
43. **SLO/SLA + Incident + Runbook + DR/Backup Operations State** - Service SLOs, incidents, runbooks, DR readiness, backup freshness
44. **Notification Delivery / Outbox / Provider Health State** - Delivery outbox, attempts/retries, suppression, provider health

---

## Version History

### Version 4.1 (Current) - Governance/Ops + Notification Delivery Tracking

Added **3 state categories** for governance case management, SRE operations, and delivery observability:

- Dispute / Appeal / Case Management State (#42)
- SLO/SLA + Incident + Runbook + DR/Backup Operations State (#43)
- Notification Delivery / Outbox / Provider Health State (#44)

**Why Added**: The architecture explicitly defines dispute resolution/SLAs, SLO/incident/runbook/DR expectations, and notification delivery behavior (email + webhook). The dashboard needs explicit state to power admin/operator views and audit-grade case workflows.

---

### Version 4.0 - Backend Operations & Event-Driven Architecture

Added **16 state categories** for backend operations and event-driven architecture patterns:

**Critical Priority (5)**:
- Retirement Saga State (#26)
- Event Replay & Recovery State (#27)
- Consumer Management State (#29)
- Circuit Breaker State (#37)
- Dead Letter Queue State (#38)

**High Priority (6)**:
- Schema Registry State (#28)
- API Idempotency State (#30)
- Registry Adapter Health State (#31)
- NEAR Indexer State (#32)
- Registry Requirements Catalog State (#33)
- Methodology State (#34)

**Medium Priority (5)**:
- Retirement Certificate State (#35)
- Registry Cancellation State (#36)
- Event Store State (#39)
- Snapshot/Checkpoint State (#40)
- Process Timeout State (#41)

**Why Added**: Deep analysis of `dmrv_saa_s_architecture_near_nft_design.md` (Sections 28-33) revealed extensive event-driven architecture, saga patterns, circuit breakers, consumer management, and event replay capabilities that were not represented in frontend state management. These are essential for:
- Monitoring backend health and performance
- Debugging distributed systems issues
- Managing long-running processes
- Event replay and recovery operations
- API reliability and idempotency

---

### Version 3.0 - Advanced Patterns

Added 14 advanced state management patterns (normalization, SSR hydration, DevTools, security, validation, observability, etc.)

---

### Version 2.0 - Enterprise & Carbon Science Features

Based on comprehensive analysis of `COMPREHENSIVE_WORKFLOWS.md` and `dmrv_saa_s_architecture_near_nft_design.md`, added **8 critical state categories**:

### 1. Carbon Science State ⭐ **Critical**
**Why Added**: Architecture documents detail buffer pool mechanism, permanence tracking, vintage management, and reversal handling - none of which were in original state management.

**Key Components**:
- Buffer pool allocation and tracking
- Permanence duration and risk assessment
- Reversal event detection and remediation
- Vintage year and expiry warnings
- Additionality verification status
- Leakage assessment data

**Impact**: Required for carbon credit integrity and compliance with registry rules.

---

### 2. Batch Operations State ⭐ **High Priority**
**Why Added**: Architecture defines batch minting (100 credits max) and batch retirement (500 credits max) with specific rate limits and progress tracking.

**Key Components**:
- Batch processing status
- Item-level success/failure tracking
- Progress percentage and ETA
- Batch configuration (max size, atomicity)

**Impact**: Essential for large-scale credit issuance and corporate offset programs.

---

### 3. Webhook Configuration State ⭐ **High Priority**
**Why Added**: Architecture includes comprehensive webhook system with delivery tracking, retry policies, and signature verification.

**Key Components**:
- Webhook endpoint configuration
- Delivery success/failure tracking
- Event subscription management
- Test functionality
- Performance metrics

**Impact**: Critical for platform integrations and real-time notifications.

---

### 4. Feature Flags & Entitlements State ⭐ **High Priority**
**Why Added**: Architecture defines feature matrix across Starter/Professional/Enterprise plans with specific quotas and entitlements.

**Key Components**:
- Feature access per plan
- Usage quotas and limits
- Upsell opportunity tracking
- Feature access attempts

**Impact**: Essential for SaaS business model and plan differentiation.

---

### 5. SSO & Identity Provider State ⭐ **Medium Priority**
**Why Added**: Architecture documents SAML/OIDC SSO integration and SCIM provisioning for Enterprise tier.

**Key Components**:
- SSO configuration (SAML/OIDC)
- SCIM sync status
- Directory provisioning tasks
- SSO session management

**Impact**: Required for Enterprise customers and compliance.

---

### 6. Verifier Management State ⭐ **Medium Priority**
**Why Added**: Architecture defines verifier governance including accreditation, conflict of interest checks, rotation, and performance tracking.

**Key Components**:
- Verifier assignment and workload
- Conflict of interest checks
- Verifier rotation tracking
- Performance metrics
- Availability status

**Impact**: Critical for verification workflow quality and compliance.

---

### 7. Audit & Compliance State ⭐ **Medium Priority**
**Why Added**: Architecture requires comprehensive audit trails, GDPR compliance, data retention policies, and regulatory reporting.

**Key Components**:
- Immutable audit logs
- GDPR request handling
- Data export functionality
- Compliance status tracking
- Regulatory requirements

**Impact**: Essential for regulatory compliance and audits.

---

### 8. Marketplace State ⭐ **Future**
**Why Added**: Architecture mentions marketplace functionality for credit trading.

**Key Components**:
- Listing management
- Order book
- Trading execution
- Wallet integration
- Market pricing

**Impact**: Future revenue stream, currently planned feature.

---

## Implementation Priority

### Immediate (Weeks 1-8)
- Core 17 categories (already defined)

### High Priority (Weeks 9-10)
- Carbon Science State (regulatory compliance)
- Batch Operations State (scalability)
- Webhook State (integrations)

### Medium Priority (Weeks 11-12)
- Feature Flags State (business model)
- SSO State (enterprise requirement)
- Verifier Management State (workflow quality)
- Audit & Compliance State (regulatory)

### Future (Weeks 13+)
- Marketplace State (planned feature)

---

**Document Status**: Updated - Complete with Advanced Patterns  
**Version**: 3.0  

**What's New in v4.0**:
- ✅ Added 16 backend operations & event-driven architecture state categories
- ✅ Retirement saga state (separate from credit issuance)
- ✅ Event replay & recovery capabilities
- ✅ Schema registry and version management
- ✅ Consumer health monitoring and lag alerts
- ✅ API idempotency tracking
- ✅ Circuit breaker state per service/registry
- ✅ Dead Letter Queue monitoring
- ✅ NEAR indexer detailed state
- ✅ Registry requirements catalog
- ✅ Methodology management
- ✅ Retirement certificate tracking
- ✅ Registry cancellation workflows
- ✅ Event store multi-tier storage
- ✅ Snapshot/checkpoint management
- ✅ Process timeout predictions

**What's New in v3.0**:
- ✅ Added 14 advanced state management patterns
- ✅ Production-ready best practices for React/Next.js
- ✅ Comprehensive security guidelines
- ✅ Performance optimization techniques
- ✅ Testing strategies and examples
- ✅ SSR hydration patterns for Next.js App Router
- ✅ DevTools integration guides
- ✅ State migration and versioning patterns

**Next Steps**: 
1. Review and approve expanded state management architecture (41 categories + 14 advanced patterns)
2. Set up Zustand stores structure for all categories
3. Implement Phase 1-4: Core state (Weeks 1-8)
4. Implement Phase 5: Carbon science & batch operations (Weeks 9-10)
5. Implement Phase 6: Enterprise features (Weeks 11-12)
6. Implement Phase 7: Backend operations monitoring (Weeks 13-14)
7. Implement Phase 8: Event-driven architecture (Weeks 15-16)
8. Implement Phase 9: Advanced operations (Weeks 17-18)
9. Apply advanced patterns as needed:
   - State normalization for large datasets
   - Selector memoization for performance
   - SSR hydration for Next.js pages
   - DevTools integration for debugging
   - Migration system for schema changes
   - Security measures for sensitive data
   - Validation with Zod schemas
   - Monitoring and observability
   - Error boundaries for resilience
   - Undo/redo for complex forms
   - Comprehensive test coverage
10. Add React Query for server state synchronization
11. Implement real-time updates with WebSocket/SSE
12. Plan Phase 10: Marketplace state (future enhancement)

**Best Practices Coverage**: ✅ Complete
- State normalization
- Memoization and performance
- SSR/hydration
- DevTools integration
- Migration and versioning
- Security hardening
- Runtime validation
- Observability
- Code splitting
- Error handling
- Debouncing/throttling
- Undo/redo
- Middleware composition
- Comprehensive testing

