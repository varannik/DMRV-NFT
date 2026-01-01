# Dashboard Data Schema Specification

**Document Purpose**: Comprehensive data schema specification for the DMRV dashboard application  
**Based on**: `dmrv_saa_s_architecture_near_nft_design.md`, `docs/architecture/COMPREHENSIVE_WORKFLOWS.md`, `infrastructure/database/migrations/0001_init.sql`  
**Last Updated**: 2024-12-29  
**Version**: 2.0 - Phase 1 & 2 Complete

**Coverage**: 43 of 52 database tables (83%) - Phase 1 (Critical) & Phase 2 (High Priority) complete

---

## Table of Contents

1. [Overview](#overview)
2. [Database Schema (PostgreSQL)](#database-schema-postgresql)
3. [Cache Schema (Redis)](#cache-schema-redis)
4. [Local Storage Schema (Browser)](#local-storage-schema-browser)
5. [API Response Schemas](#api-response-schemas)
6. [State Management Schemas](#state-management-schemas)
7. [Data Access Patterns](#data-access-patterns)
8. [Cache Strategy](#cache-strategy)
9. [Data Validation](#data-validation)

---

## Overview

This document defines the comprehensive data schema for the DMRV dashboard, covering:

- **PostgreSQL Database**: 43 entities documented (83% of 52 total tables)
  - Phase 1 (Critical): Subscription, IAM, Projects, Registry integration - ✅ Complete
  - Phase 2 (High Priority): Carbon science, Verification, MRV artifacts - ✅ Complete
  - Phase 3-4: Enterprise & operational features
- **Redis Cache**: Shared cache with tenant namespacing for performance
- **Browser Storage**: Local/session storage for user preferences and drafts
- **API Responses**: Standardized response formats
- **State Management**: Frontend state structures aligned with `STATE_MANAGEMENT.md` (44 categories)

### Design Principles

- **Multi-Tenant Isolation**: All tenant-scoped data includes `tenant_id` with RLS enforcement
- **Cache Namespacing**: Redis keys use `{namespace}:{tenant_id}:{resource_type}:{resource_id}` pattern
- **Data Normalization**: Normalized database schema with denormalized cache views
- **Versioning**: Schema versioning for API responses and cache structures
- **Auditability**: Immutable audit trails for all data changes
- **Soft Deletes**: Soft delete pattern for user-facing data (GDPR compliance)

---

## Database Schema (PostgreSQL)

### Schema Organization

PostgreSQL uses **schema namespaces** for logical organization:

- `core.*` - Tenants, plans, features, API keys
- `iam.*` - Users, roles, invitations, sessions, MFA
- `project.*` - Projects, methodologies, project members
- `mrv.*` - MRV submissions, computations, artifacts
- `verification.*` - Verifications, category results, reports, checklists
- `hashing.*` - MRV hashes, canonical payloads
- `registry.*` - Registry submissions, global hash registry
- `credit.*` - Credits, ownership, transfers, retirements, buffer pools, reversals
- `process.*` - Process tracking, process steps
- `saga.*` - Saga orchestration, saga steps
- `eventing.*` - Event store, processed events, outbox
- `audit.*` - Audit logs
- `billing.*` - Billing, subscriptions, usage
- `webhook.*` - Webhook configurations, deliveries

### Core Entities

#### 1. Tenants (`core.tenants`)

```typescript
interface Tenant {
  tenant_id: string // UUID, PRIMARY KEY
  slug: string // UNIQUE, stable identifier
  name: string
  status: 'active' | 'grace_period' | 'restricted' | 'suspended' | 'churned'
  region?: string // e.g., 'us-east-1'
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (tenant_id)`
- `UNIQUE (slug)`

**RLS**: Not applicable (global table)

---

#### 2. Users (`iam.users`)

```typescript
interface User {
  user_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  email: string // citext (case-insensitive), UNIQUE per tenant
  display_name?: string
  status: 'invited' | 'active' | 'suspended' | 'deleted'
  password_hash?: string // NULL if SSO-only
  mfa_required: boolean
  deleted_at?: Date // Soft delete
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (user_id)`
- `UNIQUE (tenant_id, email)`
- `idx_users_tenant_status (tenant_id, status)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 3. Projects (`project.projects`)

```typescript
interface Project {
  project_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  name: string
  project_type: string // e.g., 'forestry', 'soil_carbon', 'dac', 'beccs'
  location: {
    lat: number
    lon: number
    address?: string
    country?: string
  } // JSONB
  target_registry: 'verra' | 'puro' | 'isometric' | 'gold_standard' | 'eu_ets' | null
  previous_registry?: string
  methodology_id?: string // UUID, FK to project.methodologies
  status: 'setup' | 'data_collection' | 'computation_pending' | 'computed' | 
          'verification_pending' | 'verified' | 'hash_created' | 
          'registry_submitted' | 'nft_minted' | 'active'
  metadata: Record<string, any> // JSONB
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (project_id)`
- `idx_projects_tenant_status (tenant_id, status, created_at DESC)`
- `idx_projects_registry (target_registry) WHERE target_registry IS NOT NULL`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 4. MRV Submissions (`mrv.mrv_submissions`)

```typescript
interface MRVSubmission {
  mrv_submission_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  project_id: string // UUID, FK to project.projects
  submitted_by_user_id?: string // UUID, FK to iam.users
  source_type: 'sensor' | 'lab' | 'satellite' | 'manual' | 'api' | 'other'
  source_ref?: string // External device/provider identifier
  raw_payload: Record<string, any> // JSONB
  received_at: Date
  status: 'received' | 'validated' | 'computed' | 'in_verification' | 
          'approved' | 'rejected' | 'archived'
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (mrv_submission_id)`
- `idx_mrv_submissions_tenant_project_time (tenant_id, project_id, received_at DESC)`
- `idx_mrv_submissions_status (tenant_id, status)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 5. MRV Computations (`mrv.mrv_computations`)

```typescript
interface MRVComputation {
  computation_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  mrv_submission_id: string // UUID, FK to mrv.mrv_submissions, UNIQUE
  methodology_code: string // e.g., 'VM0042'
  methodology_version: string // e.g., 'v2.0'
  computed_tonnage: number // numeric(20,8), >= 0
  uncertainty_lower?: number // numeric(20,8)
  uncertainty_upper?: number // numeric(20,8)
  computed_payload: {
    gross_removal: number
    baseline_emissions: number
    project_emissions: number
    leakage_deduction: number
    leakage_factor: number
    buffer_deduction: number
    buffer_rate: number
    net_removal: number
  } // JSONB
  computed_at: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (computation_id)`
- `UNIQUE (mrv_submission_id)`
- `idx_mrv_computations_tenant_time (tenant_id, computed_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 6. Verifications (`verification.verifications`)

```typescript
interface Verification {
  verification_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  project_id: string // UUID, FK to project.projects
  mrv_submission_id: string // UUID, FK to mrv.mrv_submissions, UNIQUE
  verifier_user_id: string // UUID, FK to iam.users
  status: 'started' | 'in_progress' | 'clarification_required' | 
          'completed' | 'approved' | 'rejected'
  overall_status?: 'APPROVED' | 'REJECTED'
  verified_tonnage?: number // numeric(20,8), >= 0
  completed_at?: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (verification_id)`
- `UNIQUE (mrv_submission_id)`
- `idx_verifications_tenant_status (tenant_id, status, created_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 7. Verification Category Results (`verification.verification_category_results`)

```typescript
interface VerificationCategoryResult {
  category_result_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  verification_id: string // UUID, FK to verification.verifications
  category_key: 'project_setup' | 'general' | 'project_design' | 'facilities' | 
                'carbon_accounting' | 'life_cycle_assessment' | 'project_emissions' | 
                'ghg_statements' | 'removal_data'
  status: 'passed' | 'passed_with_comments' | 'clarification_required' | 
          'corrective_action' | 'failed'
  findings: Array<{
    severity: 'info' | 'minor' | 'major' | 'critical'
    description: string
    evidence_ref?: string
  }> // JSONB
  evidence_refs: string[] // JSONB, array of artifact URIs
  reviewed_at: Date
  created_at: Date
}

// UNIQUE constraint: (verification_id, category_key)
```

**Indexes**:
- `PRIMARY KEY (category_result_id)`
- `UNIQUE (verification_id, category_key)`
- `idx_verification_category_results_verification (verification_id)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 8. MRV Hashes (`hashing.mrv_hashes`)

```typescript
interface MRVHash {
  mrv_hash_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  mrv_submission_id: string // UUID, FK to mrv.mrv_submissions, UNIQUE
  mrv_hash: string // SHA-256 hex (64 chars) or 'sha256:...' (71 chars), UNIQUE
  canonical_payload: {
    registry_id: string
    methodology_code: string
    methodology_version: string
    computed_tonnage: number
    verification_report_hash?: string
    evidence_hash?: string
    // ... other registry-specific fields
  } // JSONB
  canonical_payload_uri?: string // IPFS/S3 URI
  created_at: Date
}

// UNIQUE constraints:
// - UNIQUE (mrv_submission_id)
// - UNIQUE (mrv_hash)
```

**Indexes**:
- `PRIMARY KEY (mrv_hash_id)`
- `UNIQUE (mrv_submission_id)`
- `UNIQUE (mrv_hash)`
- `idx_mrv_hashes_tenant_created (tenant_id, created_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 9. Registry Submissions (`registry.registry_submissions`)

```typescript
interface RegistrySubmission {
  registry_submission_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  mrv_submission_id: string // UUID, FK to mrv.mrv_submissions
  mrv_hash: string // FK to registry.global_hash_registry
  registry_type: 'verra' | 'puro' | 'isometric' | 'eu_ets' | 'california_arb' | 'other'
  status: 'submitted' | 'approved' | 'rejected' | 'cancel_requested' | 'cancelled' | 
          'retirement_requested' | 'retired' | 'error'
  registry_serial?: string // Issued serial number, UNIQUE per registry_type
  registry_project_id?: string
  request_payload: Record<string, any> // JSONB, what we submitted
  response_payload?: Record<string, any> // JSONB, what registry returned
  last_error?: string
  last_error_at?: Date
  submitted_at: Date
  approved_at?: Date
  rejected_at?: Date
  created_at: Date
  updated_at: Date
}

// UNIQUE constraints:
// - UNIQUE (registry_type, registry_serial) WHERE registry_serial IS NOT NULL
// - UNIQUE (mrv_hash, registry_type)
```

**Indexes**:
- `PRIMARY KEY (registry_submission_id)`
- `UNIQUE (registry_type, registry_serial) WHERE registry_serial IS NOT NULL`
- `UNIQUE (mrv_hash, registry_type)`
- `idx_registry_submissions_tenant_status (tenant_id, status, submitted_at DESC)`
- `idx_registry_submissions_mrv_submission (mrv_submission_id)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 10. Credits (`credit.credits`)

```typescript
interface Credit {
  credit_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  project_id: string // UUID, FK to project.projects
  mrv_submission_id: string // UUID, FK to mrv.mrv_submissions
  mrv_hash: string // From hashing.mrv_hashes
  registry_type: string
  registry_serial?: string
  token_id?: string // NEAR token ID
  near_contract_id?: string // NEAR contract account ID
  near_minter_account_id?: string // Submitter account ID
  tonnage_co2e: number // numeric(20,8), >= 0
  vintage_year: number // 1900-3000
  issuance_date: Date
  expiry_date?: Date
  status: 'active' | 'retired' | 'impaired' | 'invalidated' | 'expired' | 'void'
  metadata: {
    gross_removal?: number
    leakage_deduction?: number
    buffer_contribution?: number
    methodology?: {
      code: string
      version: string
    }
    verification?: {
      verifier_id: string
      verification_date: Date
      report_hash?: string
    }
    mrv_report_uri?: string // IPFS URI
  } // JSONB
  minted_at?: Date
  retired_at?: Date
  created_at: Date
  updated_at: Date
}

// UNIQUE constraints:
// - UNIQUE (tenant_id, mrv_hash)
// - UNIQUE (near_contract_id, token_id) WHERE token_id IS NOT NULL
// - UNIQUE (registry_type, registry_serial) WHERE registry_serial IS NOT NULL
```

**Indexes**:
- `PRIMARY KEY (credit_id)`
- `UNIQUE (tenant_id, mrv_hash)`
- `UNIQUE (near_contract_id, token_id) WHERE token_id IS NOT NULL`
- `UNIQUE (registry_type, registry_serial) WHERE registry_serial IS NOT NULL`
- `idx_credits_tenant_status (tenant_id, status, created_at DESC)`
- `idx_credits_project (project_id, created_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 11. Credit Ownership (`credit.credit_ownership`)

```typescript
interface CreditOwnership {
  credit_id: string // UUID, PRIMARY KEY, FK to credit.credits
  tenant_id: string // UUID, FK to core.tenants
  owner_account_id: string // NEAR account ID (or custodian)
  owner_type: 'near' | 'custodial' | 'internal'
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (credit_id)`
- `idx_credit_ownership_owner (owner_account_id)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 12. Retirements (`credit.retirements`)

```typescript
interface Retirement {
  retirement_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  credit_id: string // UUID, FK to credit.credits
  token_id: string // NEAR token ID
  beneficiary: string
  retirement_reason?: string
  certificate_uri?: string // IPFS/S3 URI
  registry_confirmed: boolean
  registry_confirmed_at?: Date
  blockchain_tx_hash?: string
  blockchain_block_height?: number
  retired_at: Date
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (retirement_id)`
- `idx_retirements_tenant_time (tenant_id, retired_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 13. Processes (`process.processes`)

```typescript
interface Process {
  process_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  process_type: 'credit_issuance' | 'credit_retirement' | 'batch_minting' | 
                 'tenant_onboarding' | 'data_migration' | 'reversal_handling'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 
          'compensating' | 'compensated' | 'cancelled'
  current_step: number // >= 0
  total_steps: number // > 0
  progress_percent: number // 0-100
  started_at: Date
  completed_at?: Date
  estimated_completion?: Date
  error?: {
    code: string
    message: string
    details?: any
  } // JSONB
  metadata: Record<string, any> // JSONB
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (process_id)`
- `idx_processes_tenant_status (tenant_id, status, started_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 14. Process Steps (`process.process_steps`)

```typescript
interface ProcessStep {
  step_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  process_id: string // UUID, FK to process.processes
  step_number: number // >= 0
  step_name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'retrying' | 'skipped'
  started_at?: Date
  completed_at?: Date
  error?: {
    code: string
    message: string
    details?: any
  } // JSONB
  result?: Record<string, any> // JSONB
  retry_count: number // >= 0
  max_retries: number // >= 0, default 3
  created_at: Date
  updated_at: Date
}

// UNIQUE constraint: (process_id, step_number)
```

**Indexes**:
- `PRIMARY KEY (step_id)`
- `UNIQUE (process_id, step_number)`
- `idx_process_steps_process (process_id, step_number)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 15. Sagas (`saga.sagas`)

```typescript
interface Saga {
  saga_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  saga_type: 'credit_issuance' | 'credit_retirement'
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'compensating'
  timeout: number // seconds
  started_at?: Date
  completed_at?: Date
  error?: {
    code: string
    message: string
    details?: any
  } // JSONB
  metadata: Record<string, any> // JSONB
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (saga_id)`
- `idx_sagas_tenant_status (tenant_id, status, started_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 16. Saga Steps (`saga.saga_steps`)

```typescript
interface SagaStep {
  saga_step_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  saga_id: string // UUID, FK to saga.sagas
  step_name: string // e.g., 'mrvApproval', 'hashCreation', 'registrySubmission', 'nftMinting'
  step_order: number // >= 0
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'compensating'
  started_at?: Date
  completed_at?: Date
  error?: {
    code: string
    message: string
    details?: any
  } // JSONB
  compensation_status: 'not_required' | 'required' | 'in_progress' | 'completed'
  compensation_error?: {
    code: string
    message: string
    details?: any
  } // JSONB
  retry_count: number // >= 0
  created_at: Date
  updated_at: Date
}

// UNIQUE constraint: (saga_id, step_order)
```

**Indexes**:
- `PRIMARY KEY (saga_step_id)`
- `UNIQUE (saga_id, step_order)`
- `idx_saga_steps_saga (saga_id, step_order)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 17. Event Store (`eventing.event_store`)

```typescript
interface EventStore {
  sequence_number: number // BIGSERIAL, PRIMARY KEY, global order
  event_id: string // UUID, UNIQUE
  event_type: string // e.g., 'mrv.approved.v1'
  aggregate_id: string // Partition key
  aggregate_version: number
  tenant_id?: string // UUID, FK to core.tenants (nullable for system events)
  payload: Record<string, any> // JSONB
  metadata: {
    correlation_id?: string
    causation_id?: string
    user_id?: string
    ip_address?: string
  } // JSONB
  created_at: Date
}

// Partitioned by aggregate_id (monthly partitions)
```

**Indexes**:
- `PRIMARY KEY (sequence_number)`
- `UNIQUE (event_id)`
- `idx_event_store_tenant_type_time (tenant_id, event_type, created_at)`
- `idx_event_store_aggregate (aggregate_id, aggregate_version)`

**RLS**: `tenant_id IS NULL OR tenant_id = app.current_tenant_id()`

---

#### 18. Billing Usage (`billing.usage_ledger`)

```typescript
interface UsageLedger {
  usage_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  metric: 'credits_minted' | 'credits_retired' | 'api_calls' | 'storage_gb' | 
          'registry_submissions' | 'verifications'
  quantity: number // numeric(20,8)
  unit_price: number // numeric(20,8)
  total_amount: number // numeric(20,8)
  billing_period: string // e.g., '2024-01'
  event_id?: string // UUID, FK to eventing.event_store
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (usage_id)`
- `idx_usage_ledger_tenant_period (tenant_id, billing_period, created_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 19. Webhook Configurations (`webhook.webhook_configurations`)

```typescript
interface WebhookConfiguration {
  webhook_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  name: string
  endpoint_url: string // HTTPS only
  secret: string // HMAC signing key (encrypted in DB)
  events: string[] // JSONB, array of event types
  active: boolean
  retry_policy: {
    max_attempts: number // default 3
    backoff_ms: number[] // [1000, 60000, 300000]
  } // JSONB
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (webhook_id)`
- `idx_webhook_configurations_tenant (tenant_id, active)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 20. Webhook Deliveries (`webhook.webhook_deliveries`)

```typescript
interface WebhookDelivery {
  delivery_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  webhook_id: string // UUID, FK to webhook.webhook_configurations
  event_id: string // UUID, FK to eventing.event_store
  status: 'pending' | 'delivered' | 'failed' | 'retrying'
  attempt: number // >= 1
  response_status?: number // HTTP status code
  response_body?: string
  error?: string
  delivered_at?: Date
  next_retry_at?: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (delivery_id)`
- `idx_webhook_deliveries_webhook (webhook_id, created_at DESC)`
- `idx_webhook_deliveries_status (status, next_retry_at) WHERE status IN ('pending', 'retrying')`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 21. Subscription Plans (`core.subscription_plans`)

```typescript
interface SubscriptionPlan {
  plan_id: string // UUID, PRIMARY KEY
  plan_code: 'starter' | 'professional' | 'enterprise' | 'custom' // UNIQUE
  name: string
  description: string
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (plan_id)`
- `UNIQUE (plan_code)`

**RLS**: Not applicable (global table)

**Cache**:
```typescript
// Key: dmrv:dashboard:plan:{plan_code}
// TTL: 1 hour
interface PlanCache {
  plan_id: string
  plan_code: string
  name: string
  description: string
  cached_at: number
}
```

---

#### 22. Tenant Plan Assignments (`core.tenant_plan_assignments`)

```typescript
interface TenantPlanAssignment {
  tenant_plan_assignment_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  plan_id: string // UUID, FK to core.subscription_plans
  effective_from: Date
  effective_to?: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (tenant_plan_assignment_id)`
- `idx_tenant_plan_assignments_tenant (tenant_id, effective_from DESC)`
- `idx_tenant_plan_assignments_active (tenant_id) WHERE effective_to IS NULL`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 23. Features (`core.features`)

```typescript
interface Feature {
  feature_key: string // PRIMARY KEY, e.g., 'batch_operations', 'sso', 'white_label'
  name: string
  description: string
  category: 'core' | 'enterprise' | 'integration' | 'advanced'
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (feature_key)`

**RLS**: Not applicable (global table)

**Cache**:
```typescript
// Key: dmrv:dashboard:features
// TTL: 1 hour
interface FeaturesCache {
  features: Feature[]
  cached_at: number
}
```

---

#### 24. Plan Entitlements (`core.plan_entitlements`)

```typescript
interface PlanEntitlement {
  plan_id: string // UUID, FK to core.subscription_plans
  feature_key: string // FK to core.features
  enabled: boolean
  config?: Record<string, any> // JSONB, feature-specific config
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (plan_id, feature_key)`
- `idx_plan_entitlements_feature (feature_key)`

**RLS**: Not applicable (global table)

**Cache**:
```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:entitlements
// TTL: 5 minutes
interface EntitlementsCache {
  features: Record<string, boolean>
  config: Record<string, any>
  cached_at: number
}
```

---

#### 25. Tenant Feature Overrides (`core.tenant_feature_overrides`)

```typescript
interface TenantFeatureOverride {
  tenant_id: string // UUID, FK to core.tenants
  feature_key: string // FK to core.features
  enabled: boolean
  config?: Record<string, any> // JSONB
  override_reason?: string
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (tenant_id, feature_key)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 26. Roles (`iam.roles`)

```typescript
interface Role {
  role_key: 'tenant_admin' | 'project_manager' | 'mrv_analyst' | 'verifier' | 'viewer' | 'api_user' // PRIMARY KEY
  description: string
}
```

**Indexes**:
- `PRIMARY KEY (role_key)`

**RLS**: Not applicable (global table)

---

#### 27. User Roles (`iam.user_roles`)

```typescript
interface UserRole {
  user_id: string // UUID, FK to iam.users
  role_key: string // FK to iam.roles
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (user_id, role_key)`
- `idx_user_roles_role (role_key)`

**RLS**: Via user_id → users.tenant_id

**Cache**:
```typescript
// Key: dmrv:dashboard:user:{user_id}:roles
// TTL: 5 minutes
interface UserRolesCache {
  user_id: string
  roles: string[]
  permissions: string[]
  cached_at: number
}
```

---

#### 28. Invitations (`iam.invitations`)

```typescript
interface Invitation {
  invitation_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  email: string // citext
  invited_by_user_id?: string // UUID, FK to iam.users
  token_hash: string
  expires_at: Date
  accepted_at?: Date
  revoked_at?: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (invitation_id)`
- `idx_invitations_tenant_email (tenant_id, email)`
- `idx_invitations_token_hash (token_hash) WHERE accepted_at IS NULL AND revoked_at IS NULL`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 29. MFA Factors (`iam.mfa_factors`)

```typescript
interface MFAFactor {
  mfa_factor_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  user_id: string // UUID, FK to iam.users
  type: 'totp' | 'webauthn' | 'sms' | 'recovery_codes'
  secret_ref?: string // Secrets Manager reference
  enabled: boolean
  last_used_at?: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (mfa_factor_id)`
- `idx_mfa_factors_user (user_id, enabled)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 30. Sessions (`iam.sessions`)

```typescript
interface Session {
  session_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  user_id: string // UUID, FK to iam.users
  refresh_token_hash: string
  ip_address?: string // inet type
  user_agent?: string
  expires_at: Date
  revoked_at?: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (session_id)`
- `idx_sessions_user_active (user_id) WHERE revoked_at IS NULL`

**RLS**: `tenant_id = app.current_tenant_id()`

**Cache**: See "Session Cache" in Cache Schema section

---

#### 31. Tenant API Keys (`core.tenant_api_keys`)

```typescript
interface TenantAPIKey {
  api_key_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  name: string
  key_prefix: string // e.g., 'dmrv_live_' (visible)
  key_hash: string // SHA-256 hash of full key
  permissions: string[] // JSONB array
  last_used_at?: Date
  expires_at?: Date
  revoked_at?: Date
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (api_key_id)`
- `idx_tenant_api_keys_tenant (tenant_id, revoked_at) WHERE revoked_at IS NULL`
- `idx_tenant_api_keys_hash (key_hash) WHERE revoked_at IS NULL`

**RLS**: `tenant_id = app.current_tenant_id()`

**Cache**:
```typescript
// Key: dmrv:dashboard:api_key:{key_hash}
// TTL: 5 minutes
interface APIKeyCache {
  api_key_id: string
  tenant_id: string
  permissions: string[]
  expires_at?: Date
  cached_at: number
}
```

---

#### 32. Methodologies (`project.methodologies`)

```typescript
interface Methodology {
  methodology_id: string // UUID, PRIMARY KEY
  code: string // e.g., 'VM0042'
  version: string // e.g., 'v2.0'
  name: string
  schema_uri?: string // S3/IPFS URI
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (methodology_id)`
- `UNIQUE (code, version)`

**RLS**: Not applicable (global table)

**Cache**:
```typescript
// Key: dmrv:dashboard:methodology:{code}:{version}
// TTL: 1 hour
interface MethodologyCache {
  methodology_id: string
  code: string
  version: string
  name: string
  schema_uri?: string
  cached_at: number
}
```

---

#### 33. Project Members (`project.project_members`)

```typescript
interface ProjectMember {
  project_id: string // UUID, FK to project.projects
  user_id: string // UUID, FK to iam.users
  role: 'owner' | 'manager' | 'contributor' | 'viewer'
  added_by_user_id?: string // UUID, FK to iam.users
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (project_id, user_id)`
- `idx_project_members_user (user_id)`

**RLS**: Via project_id → projects.tenant_id

**Cache**:
```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:project:{project_id}:members
// TTL: 5 minutes
interface ProjectMembersCache {
  project_id: string
  members: Array<{
    user_id: string
    email: string
    display_name: string
    role: string
  }>
  cached_at: number
}
```

---

#### 34. Tenant Registry Connections (`core.tenant_registry_connections`)

```typescript
interface TenantRegistryConnection {
  tenant_registry_connection_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  registry_type: 'verra' | 'puro' | 'isometric' | 'eu_ets' | 'california_arb' | 'gold_standard' | 'other'
  credentials_ref: string // AWS Secrets Manager ARN
  status: 'active' | 'inactive' | 'error'
  last_test_at?: Date
  last_test_result?: string
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (tenant_registry_connection_id)`
- `UNIQUE (tenant_id, registry_type)`

**RLS**: `tenant_id = app.current_tenant_id()`

**Cache**:
```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:registry_connections
// TTL: 10 minutes
interface RegistryConnectionsCache {
  connections: Array<{
    registry_type: string
    status: string
    last_test_at?: Date
  }>
  cached_at: number
}
```

---

#### 35. Credit Transfers (`credit.credit_transfers`)

```typescript
interface CreditTransfer {
  transfer_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  credit_id: string // UUID, FK to credit.credits
  from_account_id: string // NEAR account or internal
  to_account_id: string // NEAR account or internal
  blockchain_tx_hash?: string
  blockchain_block_height?: number
  transfer_reason?: string
  transferred_at: Date
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (transfer_id)`
- `idx_credit_transfers_credit (credit_id, transferred_at DESC)`
- `idx_credit_transfers_accounts (from_account_id, to_account_id)`

**RLS**: `tenant_id = app.current_tenant_id()`

**Cache**:
```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:credit:{credit_id}:transfers
// TTL: 2 minutes
interface CreditTransfersCache {
  credit_id: string
  transfers: CreditTransfer[]
  cached_at: number
}
```

---

#### 36. Credit Lineage (`credit.credit_lineage`)

```typescript
interface CreditLineage {
  credit_id: string // UUID, FK to credit.credits
  parent_credit_id?: string // UUID, FK to credit.credits
  lineage_type: 'split' | 'merge' | 'correction' | 'reissuance'
  notes?: string
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (credit_id, parent_credit_id)`
- `idx_credit_lineage_parent (parent_credit_id)`

**RLS**: `tenant_id = app.current_tenant_id()` via credit_id

---

#### 37. Buffer Pools (`credit.buffer_pools`)

```typescript
interface BufferPool {
  buffer_pool_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  project_id: string // UUID, FK to project.projects
  total_contributed_tco2e: number // numeric(20,8)
  available_tco2e: number // numeric(20,8)
  used_for_reversals_tco2e: number // numeric(20,8)
  buffer_rate: number // numeric(5,4), e.g., 0.15 for 15%
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (buffer_pool_id)`
- `idx_buffer_pools_project (project_id)`

**RLS**: `tenant_id = app.current_tenant_id()`

**Cache**:
```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:project:{project_id}:buffer_pool
// TTL: 5 minutes
interface BufferPoolCache {
  buffer_pool_id: string
  total_contributed_tco2e: number
  available_tco2e: number
  used_for_reversals_tco2e: number
  buffer_rate: number
  cached_at: number
}
```

---

#### 38. Reversal Events (`credit.reversal_events`)

```typescript
interface ReversalEvent {
  reversal_event_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  project_id: string // UUID, FK to project.projects
  event_type: 'fire' | 'disease' | 'harvest' | 'policy_change' | 'other'
  event_date: Date
  estimated_tco2e_lost: number // numeric(20,8)
  verified_tco2e_lost?: number // numeric(20,8)
  description: string
  reported_by_user_id: string // UUID, FK to iam.users
  verified_by_user_id?: string // UUID, FK to iam.users
  status: 'reported' | 'investigating' | 'verified' | 'buffer_applied' | 'resolved'
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (reversal_event_id)`
- `idx_reversal_events_project (project_id, event_date DESC)`
- `idx_reversal_events_status (tenant_id, status)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 39. Reversal Affected Credits (`credit.reversal_affected_credits`)

```typescript
interface ReversalAffectedCredit {
  reversal_event_id: string // UUID, FK to credit.reversal_events
  credit_id: string // UUID, FK to credit.credits
  impact_tco2e: number // numeric(20,8)
  buffer_used_tco2e: number // numeric(20,8)
  notes?: string
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (reversal_event_id, credit_id)`
- `idx_reversal_affected_credits_credit (credit_id)`

**RLS**: `tenant_id = app.current_tenant_id()` via credit_id

---

#### 40. Verification Clarifications (`verification.verification_clarifications`)

```typescript
interface VerificationClarification {
  clarification_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  verification_id: string // UUID, FK to verification.verifications
  category_key: string
  question: string
  raised_by_user_id: string // UUID, FK to iam.users (verifier)
  response?: Record<string, any> // JSONB
  responded_by_user_id?: string // UUID, FK to iam.users
  status: 'pending' | 'responded' | 'accepted' | 'escalated'
  created_at: Date
  responded_at?: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (clarification_id)`
- `idx_verification_clarifications_verification (verification_id, status, created_at DESC)`

**RLS**: `tenant_id = app.current_tenant_id()`

**Cache**:
```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:verification:{verification_id}:clarifications
// TTL: 1 minute
interface VerificationClarificationsCache {
  verification_id: string
  clarifications: VerificationClarification[]
  pending_count: number
  cached_at: number
}
```

---

#### 41. Verification Reports (`verification.verification_reports`)

```typescript
interface VerificationReport {
  verification_report_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  verification_id: string // UUID, FK to verification.verifications, UNIQUE
  report_uri: string // S3/IPFS URI
  report_hash: string // SHA-256
  generated_at: Date
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (verification_report_id)`
- `UNIQUE (verification_id)`

**RLS**: `tenant_id = app.current_tenant_id()`

---

#### 42. MRV Artifacts (`mrv.mrv_artifacts`)

```typescript
interface MRVArtifact {
  artifact_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  mrv_submission_id: string // UUID, FK to mrv.mrv_submissions
  artifact_type: 'sensor_data' | 'calibration_cert' | 'lab_report' | 'satellite_imagery' | 
                 'photo' | 'qa_qc_procedure' | 'monitoring_report' | 'other'
  file_name: string
  file_size: number // bytes
  mime_type: string
  storage_uri: string // S3/IPFS URI
  sha256_hash: string
  uploaded_by_user_id?: string // UUID, FK to iam.users
  created_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (artifact_id)`
- `idx_mrv_artifacts_submission (mrv_submission_id, created_at DESC)`
- `idx_mrv_artifacts_hash (sha256_hash)`

**RLS**: `tenant_id = app.current_tenant_id()`

**Cache**:
```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:mrv_submission:{mrv_submission_id}:artifacts
// TTL: 5 minutes
interface MRVArtifactsCache {
  mrv_submission_id: string
  artifacts: Array<{
    artifact_id: string
    artifact_type: string
    file_name: string
    file_size: number
    storage_uri: string
  }>
  cached_at: number
}
```

---

#### 43. Invoices (`billing.invoices`)

```typescript
interface Invoice {
  invoice_id: string // UUID, PRIMARY KEY
  tenant_id: string // UUID, FK to core.tenants
  billing_period_start: Date
  billing_period_end: Date
  subtotal: number // numeric(20,2)
  tax: number // numeric(20,2)
  total: number // numeric(20,2)
  currency: string // e.g., 'USD'
  status: 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled'
  issued_at?: Date
  due_at?: Date
  paid_at?: Date
  payment_method?: string
  payment_reference?: string
  invoice_uri?: string // S3 URI
  created_at: Date
  updated_at: Date
}
```

**Indexes**:
- `PRIMARY KEY (invoice_id)`
- `idx_invoices_tenant_period (tenant_id, billing_period_start DESC)`
- `idx_invoices_status (tenant_id, status, due_at) WHERE status IN ('issued', 'overdue')`

**RLS**: `tenant_id = app.current_tenant_id()`

---

### Global Tables (No tenant_id)

#### Global Hash Registry (`registry.global_hash_registry`)

```typescript
interface GlobalHashRegistry {
  mrv_hash: string // PRIMARY KEY, SHA-256 hex
  first_seen_at: Date
  first_seen_tenant_id?: string // UUID, FK to core.tenants
  status: 'locked' | 'approved' | 'rejected' | 'retired'
  registry_type?: string
  registry_serial?: string
  notes?: string
}
```

**Purpose**: Prevents cross-tenant double-counting (evidence_hash deduplication)

**RLS**: Not applicable (global table, no tenant isolation)

---

## Cache Schema (Redis)

### Namespace Strategy

**Critical**: All Redis keys use a **namespace prefix** to prevent collisions in a shared Redis instance:

```
{namespace}:{tenant_id}:{resource_type}:{resource_id}:{field?}
```

**Namespace**: `dmrv:dashboard` (fixed prefix for dashboard cache)

**Examples**:
- `dmrv:dashboard:tenant_abc123:project:proj_xyz789`
- `dmrv:dashboard:tenant_abc123:project:proj_xyz789:gap_analysis`
- `dmrv:dashboard:tenant_abc123:mrv_submission:mrv_456:computation`
- `dmrv:dashboard:tenant_abc123:credit:credit_789:ownership`
- `dmrv:dashboard:tenant_abc123:process:process_123:steps`

### Cache Key Patterns

#### 1. Tenant Context Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:context
// TTL: 1 hour
interface TenantContextCache {
  tenant_id: string
  name: string
  slug: string
  status: string
  plan: {
    plan_code: string
    name: string
    features: string[]
  }
  settings: {
    timezone: string
    locale: string
    currency: string
  }
  cached_at: number // Unix timestamp
}
```

---

#### 2. Project Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:project:{project_id}
// TTL: 5 minutes
interface ProjectCache {
  project_id: string
  tenant_id: string
  name: string
  project_type: string
  location: {
    lat: number
    lon: number
    address?: string
  }
  target_registry: string | null
  methodology_id: string | null
  status: string
  metadata: Record<string, any>
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
  cached_at: number // Unix timestamp
}

// Key: dmrv:dashboard:tenant:{tenant_id}:project:{project_id}:gap_analysis
// TTL: 1 hour (or until data changes)
interface GapAnalysisCache {
  project_id: string
  completeness_score: number // 0-100
  can_proceed_to_computation: boolean
  missing_required_fields: string[]
  missing_evidence_types: string[]
  action_items: Array<{
    type: 'field' | 'evidence'
    path: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  cached_at: number
}

// Key: dmrv:dashboard:tenant:{tenant_id}:project:{project_id}:list
// TTL: 2 minutes
interface ProjectListCache {
  projects: Array<{
    project_id: string
    name: string
    status: string
    target_registry: string | null
    created_at: string
  }>
  filters: {
    status?: string[]
    registry?: string[]
    project_type?: string[]
  }
  total_count: number
  cached_at: number
}
```

---

#### 3. MRV Submission Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:mrv_submission:{mrv_submission_id}
// TTL: 2 minutes
interface MRVSubmissionCache {
  mrv_submission_id: string
  tenant_id: string
  project_id: string
  source_type: string
  raw_payload: Record<string, any>
  status: string
  received_at: string
  cached_at: number
}

// Key: dmrv:dashboard:tenant:{tenant_id}:mrv_submission:{mrv_submission_id}:computation
// TTL: 10 minutes (computation results are stable)
interface MRVComputationCache {
  mrv_submission_id: string
  computation_id: string
  methodology_code: string
  methodology_version: string
  computed_tonnage: number
  computed_payload: {
    gross_removal: number
    baseline_emissions: number
    project_emissions: number
    leakage_deduction: number
    buffer_deduction: number
    net_removal: number
  }
  computed_at: string
  cached_at: number
}
```

---

#### 4. Verification Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:verification:{verification_id}
// TTL: 1 minute (verification can change frequently)
interface VerificationCache {
  verification_id: string
  tenant_id: string
  project_id: string
  mrv_submission_id: string
  verifier_user_id: string
  status: string
  overall_status: string | null
  verified_tonnage: number | null
  completed_at: string | null
  cached_at: number
}

// Key: dmrv:dashboard:tenant:{tenant_id}:verification:{verification_id}:categories
// TTL: 1 minute
interface VerificationCategoriesCache {
  verification_id: string
  categories: Array<{
    category_key: string
    status: string
    findings: Array<{
      severity: string
      description: string
    }>
    reviewed_at: string
  }>
  cached_at: number
}
```

---

#### 5. Credit Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:credit:{credit_id}
// TTL: 5 minutes
interface CreditCache {
  credit_id: string
  tenant_id: string
  project_id: string
  mrv_submission_id: string
  mrv_hash: string
  registry_type: string
  registry_serial: string | null
  token_id: string | null
  tonnage_co2e: number
  vintage_year: number
  status: string
  metadata: Record<string, any>
  minted_at: string | null
  cached_at: number
}

// Key: dmrv:dashboard:tenant:{tenant_id}:credit:{credit_id}:ownership
// TTL: 1 minute (ownership can change on-chain)
interface CreditOwnershipCache {
  credit_id: string
  owner_account_id: string
  owner_type: string
  updated_at: string
  cached_at: number
}

// Key: dmrv:dashboard:tenant:{tenant_id}:credit:list
// TTL: 2 minutes
interface CreditListCache {
  credits: Array<{
    credit_id: string
    token_id: string | null
    tonnage_co2e: number
    status: string
    registry_type: string
    vintage_year: number
  }>
  filters: {
    status?: string[]
    registry?: string[]
    vintage?: number[]
  }
  total_count: number
  cached_at: number
}
```

---

#### 6. Process Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:process:{process_id}
// TTL: 30 seconds (processes update frequently)
interface ProcessCache {
  process_id: string
  tenant_id: string
  process_type: string
  status: string
  current_step: number
  total_steps: number
  progress_percent: number
  started_at: string
  completed_at: string | null
  estimated_completion: string | null
  error: Record<string, any> | null
  cached_at: number
}

// Key: dmrv:dashboard:tenant:{tenant_id}:process:{process_id}:steps
// TTL: 30 seconds
interface ProcessStepsCache {
  process_id: string
  steps: Array<{
    step_id: string
    step_number: number
    step_name: string
    status: string
    started_at: string | null
    completed_at: string | null
    error: Record<string, any> | null
  }>
  cached_at: number
}
```

---

#### 7. Saga Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:saga:{saga_id}
// TTL: 30 seconds
interface SagaCache {
  saga_id: string
  tenant_id: string
  saga_type: string
  status: string
  timeout: number
  started_at: string | null
  completed_at: string | null
  error: Record<string, any> | null
  cached_at: number
}

// Key: dmrv:dashboard:tenant:{tenant_id}:saga:{saga_id}:steps
// TTL: 30 seconds
interface SagaStepsCache {
  saga_id: string
  steps: Array<{
    saga_step_id: string
    step_name: string
    step_order: number
    status: string
    compensation_status: string
    started_at: string | null
    completed_at: string | null
  }>
  cached_at: number
}
```

---

#### 8. Rate Limiting Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:rate_limit:{endpoint}:{window}
// TTL: Window duration (e.g., 60 seconds for per-minute limit)
interface RateLimitCache {
  tenant_id: string
  endpoint: string // e.g., 'projects:list', 'mrv:submit'
  window: string // '1m', '1h', '1d'
  count: number
  limit: number
  reset_at: number // Unix timestamp
}
```

**Pattern**: `dmrv:dashboard:tenant:{tenant_id}:rate_limit:{endpoint}:{window}`

**TTL**: Matches window duration (60s for 1m, 3600s for 1h, 86400s for 1d)

---

#### 9. Idempotency Cache

```typescript
// Key: dmrv:dashboard:tenant:{tenant_id}:idempotency:{idempotency_key}
// TTL: 24 hours
interface IdempotencyCache {
  tenant_id: string
  idempotency_key: string
  request_hash: string
  response_status: number
  response_body: Record<string, any>
  response_headers: Record<string, string>
  created_at: number
  expires_at: number
}
```

**Pattern**: `dmrv:dashboard:tenant:{tenant_id}:idempotency:{idempotency_key}`

**TTL**: 24 hours (86400 seconds)

---

#### 10. Session Cache

```typescript
// Key: dmrv:dashboard:session:{session_id}
// TTL: 24 hours (or session expiry)
interface SessionCache {
  session_id: string
  user_id: string
  tenant_id: string
  email: string
  role: string
  permissions: string[]
  expires_at: number // Unix timestamp
  created_at: number
  last_activity: number
}
```

**Pattern**: `dmrv:dashboard:session:{session_id}`

**Note**: Session cache does NOT include tenant_id in key (session_id is globally unique)

**TTL**: 24 hours or session expiry, whichever is shorter

---

#### 11. Registry Requirements Catalog Cache

```typescript
// Key: dmrv:dashboard:registry:{registry_id}:methodology:{methodology_code}:v{version}:requirements
// TTL: 1 hour (requirements change infrequently)
interface RegistryRequirementsCache {
  registry_id: string
  methodology_code: string
  methodology_version: string
  required_fields: Array<{
    json_path: string
    field_type: string
    required: boolean
    validation_rules?: Record<string, any>
  }>
  required_evidence_types: string[]
  recommended_fields: string[]
  conditional_requirements: Array<{
    condition: Record<string, any>
    then_required: string[]
  }>
  cached_at: number
}
```

**Pattern**: `dmrv:dashboard:registry:{registry_id}:methodology:{methodology_code}:v{version}:requirements`

**Note**: This cache is **global** (no tenant_id) since requirements are registry-specific, not tenant-specific

---

### Cache TTL Strategy

| Resource Type | TTL | Rationale |
|--------------|-----|-----------|
| **Tenant Context** | 1 hour | Changes infrequently |
| **Project** | 5 minutes | Moderate update frequency |
| **Project Gap Analysis** | 1 hour | Expensive computation, changes when data added |
| **Project List** | 2 minutes | Frequently filtered/searched |
| **MRV Submission** | 2 minutes | Status changes during workflow |
| **MRV Computation** | 10 minutes | Stable after computation |
| **Verification** | 1 minute | Active workflow, frequent updates |
| **Credit** | 5 minutes | Moderate update frequency |
| **Credit Ownership** | 1 minute | Can change on-chain |
| **Credit List** | 2 minutes | Frequently filtered/searched |
| **Process** | 30 seconds | Active processes update frequently |
| **Saga** | 30 seconds | Active sagas update frequently |
| **Rate Limit** | Window duration | Matches limit window |
| **Idempotency** | 24 hours | Matches API idempotency TTL |
| **Session** | 24 hours | Matches session expiry |
| **Registry Requirements** | 1 hour | Changes infrequently |

---

### Cache Invalidation Strategy

#### 1. Write-Through Pattern

When updating database, also update cache:

```typescript
async function updateProject(projectId: string, updates: Partial<Project>) {
  // 1. Update database
  const updated = await db.update('project.projects', projectId, updates)
  
  // 2. Invalidate cache
  await redis.del(`dmrv:dashboard:tenant:${tenantId}:project:${projectId}`)
  await redis.del(`dmrv:dashboard:tenant:${tenantId}:project:${projectId}:gap_analysis`)
  await redis.del(`dmrv:dashboard:tenant:${tenantId}:project:list`)
  
  // 3. Optionally: Update cache with new data (write-through)
  await redis.setex(
    `dmrv:dashboard:tenant:${tenantId}:project:${projectId}`,
    300, // 5 minutes
    JSON.stringify(updated)
  )
  
  return updated
}
```

#### 2. Event-Driven Invalidation

Listen to events and invalidate related cache:

```typescript
// On mrv.computed.v1 event
eventBus.on('mrv.computed.v1', async (event) => {
  const { tenant_id, mrv_submission_id, project_id } = event.payload
  
  // Invalidate MRV submission cache
  await redis.del(`dmrv:dashboard:tenant:${tenant_id}:mrv_submission:${mrv_submission_id}`)
  await redis.del(`dmrv:dashboard:tenant:${tenant_id}:mrv_submission:${mrv_submission_id}:computation`)
  
  // Invalidate project cache (status may have changed)
  await redis.del(`dmrv:dashboard:tenant:${tenant_id}:project:${project_id}`)
})

// On blockchain.nft.minted.v1 event
eventBus.on('blockchain.nft.minted.v1', async (event) => {
  const { tenant_id, credit_id } = event.payload
  
  // Invalidate credit cache
  await redis.del(`dmrv:dashboard:tenant:${tenant_id}:credit:${credit_id}`)
  await redis.del(`dmrv:dashboard:tenant:${tenant_id}:credit:${credit_id}:ownership`)
  await redis.del(`dmrv:dashboard:tenant:${tenant_id}:credit:list`)
})
```

#### 3. Tag-Based Invalidation

Use Redis sets to track cache keys by tag:

```typescript
// When caching project
await redis.setex(`dmrv:dashboard:tenant:${tenantId}:project:${projectId}`, 300, data)
await redis.sadd(`dmrv:dashboard:tenant:${tenantId}:tags:project:${projectId}`, 
  `dmrv:dashboard:tenant:${tenantId}:project:${projectId}`)

// When invalidating all project-related cache
const keys = await redis.smembers(`dmrv:dashboard:tenant:${tenantId}:tags:project:${projectId}`)
if (keys.length > 0) {
  await redis.del(...keys)
  await redis.del(`dmrv:dashboard:tenant:${tenantId}:tags:project:${projectId}`)
}
```

---

## Local Storage Schema (Browser)

### Storage Strategy

- **localStorage**: User preferences, UI state, drafts (persists across sessions)
- **sessionStorage**: Temporary data, form drafts, navigation state (cleared on tab close)

### Namespace Pattern

```
dmrv.dashboard.{tenant_id}.{category}.{key}
```

**Examples**:
- `dmrv.dashboard.tenant_abc123.preferences.theme`
- `dmrv.dashboard.tenant_abc123.preferences.language`
- `dmrv.dashboard.tenant_abc123.drafts.mrv_submission_456`
- `dmrv.dashboard.tenant_abc123.ui.sidebar_collapsed`

---

### 1. User Preferences (localStorage)

```typescript
// Key: dmrv.dashboard.{tenant_id}.preferences
interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string // e.g., 'en-US'
  timezone: string // e.g., 'America/New_York'
  dateFormat: string // e.g., 'MM/DD/YYYY'
  currency: string // e.g., 'USD'
  notifications: {
    email: boolean
    push: boolean
    webhook: boolean
  }
  tablePreferences: {
    projects: {
      pageSize: number
      sortBy: string
      sortOrder: 'asc' | 'desc'
      visibleColumns: string[]
    }
    credits: {
      pageSize: number
      sortBy: string
      sortOrder: 'asc' | 'desc'
      visibleColumns: string[]
    }
  }
  lastUpdated: number // Unix timestamp
}
```

---

### 2. Form Drafts (localStorage)

```typescript
// Key: dmrv.dashboard.{tenant_id}.drafts.{form_type}.{form_id}
interface FormDraft {
  formType: 'project' | 'mrv_submission' | 'verification_response' | 'retirement'
  formId: string // UUID or 'new'
  data: Record<string, any>
  lastSaved: number // Unix timestamp
  autoSaveEnabled: boolean
}

// Examples:
// - dmrv.dashboard.tenant_abc123.drafts.project.new
// - dmrv.dashboard.tenant_abc123.drafts.mrv_submission.mrv_456
```

**TTL**: 7 days (auto-cleanup)

---

### 3. UI State (sessionStorage)

```typescript
// Key: dmrv.dashboard.{tenant_id}.ui
interface UIState {
  sidebarCollapsed: boolean
  activeTab: string
  modalsOpen: string[] // Array of modal IDs
  toasts: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    timestamp: number
  }>
  navigationHistory: string[] // Last 10 routes
}
```

**TTL**: Session (cleared on tab close)

---

### 4. Authentication State (sessionStorage)

```typescript
// Key: dmrv.dashboard.auth
interface AuthState {
  sessionToken: string // JWT (encrypted)
  refreshToken: string // (encrypted)
  expiresAt: number // Unix timestamp
  tenantId: string
  userId: string
  lastActivity: number
}
```

**Security**: Tokens should be encrypted before storing

**TTL**: Session (cleared on tab close)

---

### 5. Offline Queue (localStorage)

```typescript
// Key: dmrv.dashboard.{tenant_id}.offline_queue
interface OfflineQueue {
  operations: Array<{
    id: string // UUID
    type: 'create' | 'update' | 'delete'
    resource: string // e.g., 'project', 'mrv_submission'
    resourceId: string
    payload: Record<string, any>
    timestamp: number
    retryCount: number
  }>
  lastSyncAttempt: number
}
```

**Purpose**: Queue operations when offline, sync when online

**TTL**: 30 days (auto-cleanup after sync)

---

## API Response Schemas

### Standard Response Format

All API responses follow this structure:

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
    timestamp: string // ISO 8601
  }
  meta?: {
    request_id: string
    timestamp: string
    version: string // API version
  }
}
```

---

### 1. Project Responses

```typescript
// GET /api/v1/projects
interface ProjectsListResponse {
  projects: Project[]
  pagination: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
  }
  filters?: {
    status?: string[]
    registry?: string[]
    project_type?: string[]
  }
}

// GET /api/v1/projects/{project_id}
interface ProjectResponse {
  project: Project
  gap_analysis?: GapAnalysis
  recent_mrv_submissions?: MRVSubmission[]
  credits_count?: number
}

// POST /api/v1/projects
interface CreateProjectRequest {
  name: string
  project_type: string
  location: {
    lat: number
    lon: number
    address?: string
  }
  target_registry?: string
  methodology_id?: string
}

interface CreateProjectResponse {
  project: Project
  gap_analysis: GapAnalysis
}
```

---

### 2. MRV Submission Responses

```typescript
// GET /api/v1/projects/{project_id}/mrv/submissions
interface MRVSubmissionsListResponse {
  submissions: MRVSubmission[]
  pagination: {
    page: number
    page_size: number
    total_count: number
  }
}

// GET /api/v1/mrv/submissions/{mrv_submission_id}
interface MRVSubmissionResponse {
  submission: MRVSubmission
  computation?: MRVComputation
  verification?: Verification
  hash?: MRVHash
  registry_submission?: RegistrySubmission
}

// POST /api/v1/projects/{project_id}/mrv/submissions
interface CreateMRVSubmissionRequest {
  source_type: string
  source_ref?: string
  raw_payload: Record<string, any>
  evidence_files?: Array<{
    file_name: string
    file_type: string
    file_size: number
    uri: string // Pre-signed S3 URL or IPFS hash
  }>
}

interface CreateMRVSubmissionResponse {
  submission: MRVSubmission
  gap_analysis: GapAnalysis
}
```

---

### 3. Verification Responses

```typescript
// GET /api/v1/verifications/{verification_id}
interface VerificationResponse {
  verification: Verification
  categories: VerificationCategoryResult[]
  clarifications: VerificationClarification[]
  report?: VerificationReport
}

// POST /api/v1/verifications/{verification_id}/categories/{category_key}
interface UpdateCategoryRequest {
  status: string
  findings?: Array<{
    severity: string
    description: string
  }>
  evidence_refs?: string[]
}

// POST /api/v1/verifications/{verification_id}/clarifications/{clarification_id}/respond
interface RespondToClarificationRequest {
  response: Record<string, any>
}
```

---

### 4. Credit Responses

```typescript
// GET /api/v1/credits
interface CreditsListResponse {
  credits: Credit[]
  pagination: {
    page: number
    page_size: number
    total_count: number
  }
  filters?: {
    status?: string[]
    registry?: string[]
    vintage?: number[]
  }
}

// GET /api/v1/credits/{credit_id}
interface CreditResponse {
  credit: Credit
  ownership: CreditOwnership
  transfers: CreditTransfer[]
  retirement?: Retirement
}

// POST /api/v1/credits/{credit_id}/retire
interface RetireCreditRequest {
  beneficiary: string
  retirement_reason?: string
}

interface RetireCreditResponse {
  retirement: Retirement
  certificate_uri?: string
}
```

---

### 5. Process Responses

```typescript
// GET /api/v1/processes/{process_id}
interface ProcessResponse {
  process: Process
  steps: ProcessStep[]
  estimated_completion?: string
}

// GET /api/v1/processes
interface ProcessesListResponse {
  processes: Process[]
  pagination: {
    page: number
    page_size: number
    total_count: number
  }
  filters?: {
    status?: string[]
    process_type?: string[]
  }
}
```

---

### 6. Gap Analysis Responses

```typescript
// GET /api/v1/projects/{project_id}/mrv/gap-analysis
interface GapAnalysisResponse {
  project_id: string
  target_registry: string
  methodology_code: string
  completeness_score: number // 0-100
  can_proceed_to_computation: boolean
  missing_required_fields: Array<{
    json_path: string
    field_type: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  missing_evidence_types: Array<{
    evidence_type: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  action_items: Array<{
    type: 'field' | 'evidence'
    path: string
    description: string
    priority: 'high' | 'medium' | 'low'
    estimated_time_minutes?: number
  }>
  last_updated: string // ISO 8601
}
```

---

## State Management Schemas

State management schemas align with `STATE_MANAGEMENT.md`. Key schemas:

### 1. Project State

```typescript
interface ProjectState {
  projects: Map<string, Project> // Normalized by ID
  projectsLoading: boolean
  projectsError: Error | null
  projectsFilters: {
    status: string[]
    registry: string[]
    projectType: string[]
    searchQuery: string
  }
  currentProjectId: string | null
  gapAnalysis: Map<string, GapAnalysis> // projectId -> gap analysis
}
```

---

### 2. MRV Submission State

```typescript
interface MRVSubmissionState {
  submissions: Map<string, MRVSubmission> // Normalized by ID
  submissionsLoading: boolean
  computations: Map<string, MRVComputation> // mrv_submission_id -> computation
  currentSubmissionId: string | null
  evidenceUploads: Map<string, {
    progress: number
    error?: Error
  }> // fileId -> upload state
}
```

---

### 3. Verification State

```typescript
interface VerificationState {
  verifications: Map<string, Verification> // Normalized by ID
  categoryResults: Map<string, VerificationCategoryResult[]> // verification_id -> categories
  clarifications: Map<string, VerificationClarification[]> // verification_id -> clarifications
  currentVerificationId: string | null
  verificationStatus: 'not_started' | 'started' | 'in_progress' | 'completed'
}
```

---

### 4. Credit State

```typescript
interface CreditState {
  credits: Map<string, Credit> // Normalized by ID
  ownership: Map<string, CreditOwnership> // credit_id -> ownership
  retirements: Map<string, Retirement> // credit_id -> retirement
  creditsLoading: boolean
  currentCreditId: string | null
}
```

---

## Data Access Patterns

### 1. Read Pattern (Cache-Aside)

```typescript
async function getProject(projectId: string): Promise<Project> {
  const cacheKey = `dmrv:dashboard:tenant:${tenantId}:project:${projectId}`
  
  // 1. Try cache first
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // 2. Cache miss: fetch from database
  const project = await db.query(
    'SELECT * FROM project.projects WHERE project_id = $1 AND tenant_id = $2',
    [projectId, tenantId]
  )
  
  if (!project) {
    throw new NotFoundError('Project not found')
  }
  
  // 3. Write to cache
  await redis.setex(cacheKey, 300, JSON.stringify(project)) // 5 min TTL
  
  return project
}
```

---

### 2. Write Pattern (Write-Through)

```typescript
async function updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
  // 1. Update database
  const updated = await db.query(
    'UPDATE project.projects SET ... WHERE project_id = $1 AND tenant_id = $2 RETURNING *',
    [projectId, tenantId]
  )
  
  // 2. Invalidate related cache
  await Promise.all([
    redis.del(`dmrv:dashboard:tenant:${tenantId}:project:${projectId}`),
    redis.del(`dmrv:dashboard:tenant:${tenantId}:project:${projectId}:gap_analysis`),
    redis.del(`dmrv:dashboard:tenant:${tenantId}:project:list`)
  ])
  
  // 3. Optionally: Update cache with new data
  await redis.setex(
    `dmrv:dashboard:tenant:${tenantId}:project:${projectId}`,
    300,
    JSON.stringify(updated)
  )
  
  // 4. Emit event for other services
  await eventBus.emit('project.updated.v1', {
    tenant_id: tenantId,
    project_id: projectId,
    changes: updates
  })
  
  return updated
}
```

---

### 3. List Pattern (Paginated Cache)

```typescript
async function listProjects(filters: ProjectFilters, page: number, pageSize: number): Promise<ProjectsListResponse> {
  // Create cache key from filters + pagination
  const cacheKey = `dmrv:dashboard:tenant:${tenantId}:project:list:${hashFilters(filters)}:${page}:${pageSize}`
  
  // Try cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }
  
  // Cache miss: query database
  const { projects, total_count } = await db.queryProjects(filters, page, pageSize)
  
  const response: ProjectsListResponse = {
    projects,
    pagination: {
      page,
      page_size: pageSize,
      total_count,
      total_pages: Math.ceil(total_count / pageSize)
    },
    filters
  }
  
  // Cache for 2 minutes (lists change frequently)
  await redis.setex(cacheKey, 120, JSON.stringify(response))
  
  return response
}
```

---

### 4. Batch Read Pattern

```typescript
async function getProjectsBatch(projectIds: string[]): Promise<Map<string, Project>> {
  const results = new Map<string, Project>()
  const cacheKeys = projectIds.map(id => 
    `dmrv:dashboard:tenant:${tenantId}:project:${id}`
  )
  
  // 1. Try cache for all
  const cached = await redis.mget(...cacheKeys)
  const missingIds: string[] = []
  
  cached.forEach((data, index) => {
    if (data) {
      results.set(projectIds[index], JSON.parse(data))
    } else {
      missingIds.push(projectIds[index])
    }
  })
  
  // 2. Fetch missing from database
  if (missingIds.length > 0) {
    const projects = await db.query(
      'SELECT * FROM project.projects WHERE project_id = ANY($1) AND tenant_id = $2',
      [missingIds, tenantId]
    )
    
    // 3. Cache and add to results
    for (const project of projects) {
      results.set(project.project_id, project)
      await redis.setex(
        `dmrv:dashboard:tenant:${tenantId}:project:${project.project_id}`,
        300,
        JSON.stringify(project)
      )
    }
  }
  
  return results
}
```

---

## Cache Strategy

### Cache Layers

1. **Browser Cache (HTTP Cache Headers)**
   - Static assets: 1 year
   - API responses: Varies by endpoint (see TTL table)

2. **Redis Cache (Application Cache)**
   - Shared Redis instance with namespace isolation
   - TTL-based expiration
   - Event-driven invalidation

3. **Browser Storage (localStorage/sessionStorage)**
   - User preferences: No expiration
   - Form drafts: 7 days
   - UI state: Session only

---

### Cache Warming

Pre-populate cache for frequently accessed data:

```typescript
// On tenant login, warm cache
async function warmTenantCache(tenantId: string) {
  // Warm tenant context
  const tenant = await db.getTenant(tenantId)
  await redis.setex(
    `dmrv:dashboard:tenant:${tenantId}:context`,
    3600,
    JSON.stringify(tenant)
  )
  
  // Warm recent projects (last 10)
  const recentProjects = await db.getRecentProjects(tenantId, 10)
  for (const project of recentProjects) {
    await redis.setex(
      `dmrv:dashboard:tenant:${tenantId}:project:${project.project_id}`,
      300,
      JSON.stringify(project)
    )
  }
}
```

---

### Cache Monitoring

Track cache performance:

```typescript
interface CacheMetrics {
  hit_rate: number // 0-1
  miss_rate: number // 0-1
  avg_response_time_ms: number
  cache_size_mb: number
  eviction_count: number
  keys_by_namespace: Record<string, number>
}
```

---

## Data Validation

### Schema Validation (Zod)

Use Zod for runtime validation:

```typescript
import { z } from 'zod'

const ProjectSchema = z.object({
  project_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(1).max(255),
  project_type: z.enum(['forestry', 'soil_carbon', 'dac', 'beccs']),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    address: z.string().optional()
  }),
  target_registry: z.enum(['verra', 'puro', 'isometric', 'gold_standard', 'eu_ets']).nullable(),
  status: z.enum(['setup', 'data_collection', 'computation_pending', 'computed', 
                   'verification_pending', 'verified', 'hash_created', 
                   'registry_submitted', 'nft_minted', 'active']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

// Validate API response
function validateProjectResponse(data: unknown): Project {
  return ProjectSchema.parse(data)
}
```

---

### Database Constraints

PostgreSQL enforces:

- **Primary Keys**: UUIDs for all entities
- **Foreign Keys**: Referential integrity
- **Check Constraints**: Status enums, numeric ranges
- **Unique Constraints**: Business rules (e.g., one active credit per mrv_hash per tenant)
- **NOT NULL**: Required fields

---

### API Validation

Validate all API requests:

```typescript
const CreateProjectRequestSchema = z.object({
  name: z.string().min(1).max(255),
  project_type: z.enum(['forestry', 'soil_carbon', 'dac', 'beccs']),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180)
  }),
  target_registry: z.enum(['verra', 'puro', 'isometric']).optional()
})

// In API handler
export async function POST(request: Request) {
  const body = await request.json()
  const validated = CreateProjectRequestSchema.parse(body) // Throws if invalid
  // ... proceed with validated data
}
```

---

## Related Documentation

- **Gap Analysis**:
  - `./DATA_SCHEMA_CHECK_SUMMARY.md` - Executive summary: 83% coverage, priority roadmap
  - `./DATA_SCHEMA_GAP_ANALYSIS.md` - Complete analysis with all missing table schemas
- **State Management**: `./STATE_MANAGEMENT.md` - Frontend state structures (44 categories)
- **Database Schema**: `../../infrastructure/database/migrations/0001_init.sql` - Source of truth (52 tables)
- **Architecture**: `../../dmrv_saa_s_architecture_near_nft_design.md` - System architecture
- **Workflows**: `../../docs/architecture/COMPREHENSIVE_WORKFLOWS.md` - Business workflows

---

**Document Status**: Comprehensive - Phase 1 & 2 Complete  
**Coverage**: 43 of 52 database tables documented (83% coverage)  
- ✅ **Phase 1 (Critical)**: 14 tables added - Subscription, IAM, Project, Registry
- ✅ **Phase 2 (High Priority)**: 9 tables added - Carbon Science, Verification, MRV Artifacts
- ⏳ **Phase 3-4**: 9 operational tables remaining (see DATA_SCHEMA_GAP_ANALYSIS.md)

**Ready for**: Phase 1 & 2 implementation (core workflows + carbon science)  
**Next Steps**: Add Phase 3 enterprise features and Phase 4 operational monitoring tables

**Related Gap Analysis**:
- **Executive Summary**: `./DATA_SCHEMA_CHECK_SUMMARY.md` - Quick assessment and priority roadmap
- **Complete Gap Analysis**: `./DATA_SCHEMA_GAP_ANALYSIS.md` - All missing table schemas with priorities

