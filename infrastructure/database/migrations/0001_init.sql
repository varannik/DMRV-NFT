-- DMRV SaaS Platform (NEAR + AWS) - Database Schema v1
-- Migration: 0001_init
-- Target: PostgreSQL 14+ (AWS RDS)
--
-- Notes:
-- - Uses tenant-scoped Row Level Security (RLS) across most tables.
-- - Uses partitioned tables for large append-only logs (event store, audit log).
-- - Uses text + CHECK constraints for statuses (easier evolution than enums).

BEGIN;

-- ============================================================================
-- Extensions
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;   -- case-insensitive emails

-- ============================================================================
-- Namespaces (Postgres schemas)
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS iam;
CREATE SCHEMA IF NOT EXISTS project;
CREATE SCHEMA IF NOT EXISTS mrv;
CREATE SCHEMA IF NOT EXISTS verification;
CREATE SCHEMA IF NOT EXISTS hashing;
CREATE SCHEMA IF NOT EXISTS registry;
CREATE SCHEMA IF NOT EXISTS credit;
CREATE SCHEMA IF NOT EXISTS process;
CREATE SCHEMA IF NOT EXISTS saga;
CREATE SCHEMA IF NOT EXISTS eventing;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS webhook;

-- ============================================================================
-- Shared helpers (tenant context + timestamps)
-- ============================================================================

-- Returns the current tenant_id from session setting. NULL if not set.
CREATE OR REPLACE FUNCTION app.current_tenant_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid
$$;

-- Sets updated_at automatically.
CREATE OR REPLACE FUNCTION app.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- CORE: Tenants / Plans / Feature Flags / Tenant Secrets Metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.tenants (
  tenant_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE, -- stable human readable identifier
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','grace_period','restricted','suspended','churned')),
  region text, -- e.g., 'us-east-1' (useful for data residency)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_tenants_updated_at
BEFORE UPDATE ON core.tenants
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Subscription plans for billing/entitlements
CREATE TABLE IF NOT EXISTS core.subscription_plans (
  plan_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_code text NOT NULL UNIQUE, -- starter/professional/enterprise/custom
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_subscription_plans_updated_at
BEFORE UPDATE ON core.subscription_plans
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Tenant plan assignment (history-friendly)
CREATE TABLE IF NOT EXISTS core.tenant_plan_assignments (
  tenant_plan_assignment_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES core.subscription_plans(plan_id),
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE INDEX IF NOT EXISTS idx_tenant_plan_assignments_tenant
  ON core.tenant_plan_assignments(tenant_id, effective_from DESC);

CREATE TRIGGER trg_tenant_plan_assignments_updated_at
BEFORE UPDATE ON core.tenant_plan_assignments
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Feature flags / entitlements (plan-based + tenant override)
CREATE TABLE IF NOT EXISTS core.features (
  feature_key text PRIMARY KEY, -- e.g., 'sso_saml', 'batch_operations'
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS core.plan_entitlements (
  plan_id uuid NOT NULL REFERENCES core.subscription_plans(plan_id) ON DELETE CASCADE,
  feature_key text NOT NULL REFERENCES core.features(feature_key) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (plan_id, feature_key)
);

CREATE TABLE IF NOT EXISTS core.tenant_feature_overrides (
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  feature_key text NOT NULL REFERENCES core.features(feature_key) ON DELETE CASCADE,
  enabled boolean NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, feature_key)
);

CREATE TRIGGER trg_tenant_feature_overrides_updated_at
BEFORE UPDATE ON core.tenant_feature_overrides
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Tenant API keys (store only hashed values)
CREATE TABLE IF NOT EXISTS core.tenant_api_keys (
  api_key_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL, -- bcrypt/argon2 hash (never store raw)
  prefix text NOT NULL, -- first N chars for identification
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, prefix)
);

CREATE INDEX IF NOT EXISTS idx_tenant_api_keys_tenant_active
  ON core.tenant_api_keys(tenant_id)
  WHERE revoked_at IS NULL;

CREATE TRIGGER trg_tenant_api_keys_updated_at
BEFORE UPDATE ON core.tenant_api_keys
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Per-tenant registry connections (store encrypted secrets in Secrets Manager; DB stores metadata)
CREATE TABLE IF NOT EXISTS core.tenant_registry_connections (
  registry_connection_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  registry_type text NOT NULL CHECK (registry_type IN ('verra','puro','isometric','eu_ets','california_arb','other')),
  external_account_ref text, -- ID in registry system if available
  secret_ref text NOT NULL, -- pointer to Secrets Manager ARN/path
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','disabled','error')),
  last_success_at timestamptz,
  last_error_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, registry_type)
);

CREATE INDEX IF NOT EXISTS idx_tenant_registry_connections_tenant
  ON core.tenant_registry_connections(tenant_id);

CREATE TRIGGER trg_tenant_registry_connections_updated_at
BEFORE UPDATE ON core.tenant_registry_connections
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- IAM: Users / Roles / Invitations / MFA / Sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS iam.users (
  user_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  email citext NOT NULL,
  display_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('invited','active','suspended','deleted')),
  password_hash text, -- NULL if SSO-only
  mfa_required boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_status ON iam.users(tenant_id, status);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON iam.users
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS iam.roles (
  role_key text PRIMARY KEY, -- tenant_admin, project_manager, mrv_analyst, verifier, viewer, api_user
  description text NOT NULL
);

CREATE TABLE IF NOT EXISTS iam.user_roles (
  user_id uuid NOT NULL REFERENCES iam.users(user_id) ON DELETE CASCADE,
  role_key text NOT NULL REFERENCES iam.roles(role_key) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_key)
);

CREATE TABLE IF NOT EXISTS iam.invitations (
  invitation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  email citext NOT NULL,
  invited_by_user_id uuid REFERENCES iam.users(user_id),
  token_hash text NOT NULL,
  expires_at timestamptz NOT NULL,
  accepted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_invitations_tenant_email
  ON iam.invitations(tenant_id, email);

CREATE TRIGGER trg_invitations_updated_at
BEFORE UPDATE ON iam.invitations
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS iam.mfa_factors (
  mfa_factor_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES iam.users(user_id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('totp','webauthn','sms','recovery_codes')),
  secret_ref text, -- Secrets Manager reference for TOTP seed or WebAuthn data
  enabled boolean NOT NULL DEFAULT true,
  last_used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mfa_factors_user ON iam.mfa_factors(user_id, enabled);

CREATE TRIGGER trg_mfa_factors_updated_at
BEFORE UPDATE ON iam.mfa_factors
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS iam.sessions (
  session_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES iam.users(user_id) ON DELETE CASCADE,
  refresh_token_hash text NOT NULL,
  ip_address inet,
  user_agent text,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_active
  ON iam.sessions(user_id)
  WHERE revoked_at IS NULL;

CREATE TRIGGER trg_sessions_updated_at
BEFORE UPDATE ON iam.sessions
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- PROJECT: Projects / Methodologies / Membership
-- ============================================================================

CREATE TABLE IF NOT EXISTS project.methodologies (
  methodology_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL, -- e.g., VM0007
  version text NOT NULL, -- e.g., 1.0
  name text NOT NULL,
  schema_uri text, -- where schema lives (S3/IPFS)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (code, version)
);

CREATE TRIGGER trg_methodologies_updated_at
BEFORE UPDATE ON project.methodologies
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS project.projects (
  project_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  methodology_id uuid REFERENCES project.methodologies(methodology_id),
  crediting_start_date date,
  crediting_end_date date,
  vintage_year int,
  boundary_geojson jsonb, -- maps/polygons (validated at app level)
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','paused','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (crediting_end_date IS NULL OR crediting_start_date IS NULL OR crediting_end_date > crediting_start_date)
);

CREATE INDEX IF NOT EXISTS idx_projects_tenant_status ON project.projects(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_projects_methodology ON project.projects(methodology_id);

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON project.projects
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS project.project_members (
  project_member_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES project.projects(project_id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES iam.users(user_id) ON DELETE CASCADE,
  role_key text NOT NULL REFERENCES iam.roles(role_key),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, user_id, role_key)
);

CREATE INDEX IF NOT EXISTS idx_project_members_project ON project.project_members(project_id);

-- ============================================================================
-- MRV: Submissions + Computations + Artefacts
-- ============================================================================

CREATE TABLE IF NOT EXISTS mrv.mrv_submissions (
  mrv_submission_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES project.projects(project_id) ON DELETE CASCADE,
  submitted_by_user_id uuid REFERENCES iam.users(user_id),
  source_type text NOT NULL CHECK (source_type IN ('sensor','lab','satellite','manual','api','other')),
  source_ref text, -- external device/provider identifier
  raw_payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN ('received','validated','computed','in_verification','approved','rejected','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mrv_submissions_tenant_project_time
  ON mrv.mrv_submissions(tenant_id, project_id, received_at DESC);

CREATE INDEX IF NOT EXISTS idx_mrv_submissions_status
  ON mrv.mrv_submissions(tenant_id, status);

CREATE TRIGGER trg_mrv_submissions_updated_at
BEFORE UPDATE ON mrv.mrv_submissions
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS mrv.mrv_computations (
  computation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  mrv_submission_id uuid NOT NULL REFERENCES mrv.mrv_submissions(mrv_submission_id) ON DELETE CASCADE,
  methodology_code text NOT NULL,
  methodology_version text NOT NULL,
  computed_tonnage numeric(20,8) NOT NULL CHECK (computed_tonnage >= 0),
  uncertainty_lower numeric(20,8),
  uncertainty_upper numeric(20,8),
  computed_payload jsonb NOT NULL, -- normalized computed results
  computed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mrv_submission_id)
);

CREATE INDEX IF NOT EXISTS idx_mrv_computations_tenant_time
  ON mrv.mrv_computations(tenant_id, computed_at DESC);

CREATE TRIGGER trg_mrv_computations_updated_at
BEFORE UPDATE ON mrv.mrv_computations
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS mrv.mrv_artifacts (
  artifact_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  mrv_submission_id uuid NOT NULL REFERENCES mrv.mrv_submissions(mrv_submission_id) ON DELETE CASCADE,
  artifact_type text NOT NULL CHECK (artifact_type IN ('raw_attachment','computed_report','verification_report','certificate','other')),
  uri text NOT NULL, -- S3/IPFS/Arweave URI
  sha256_hex text, -- optional integrity check
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mrv_artifacts_submission
  ON mrv.mrv_artifacts(mrv_submission_id, created_at DESC);

-- ============================================================================
-- VERIFICATION: workflow + category results + reports
-- ============================================================================

CREATE TABLE IF NOT EXISTS verification.verifications (
  verification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES project.projects(project_id) ON DELETE CASCADE,
  mrv_submission_id uuid NOT NULL REFERENCES mrv.mrv_submissions(mrv_submission_id) ON DELETE CASCADE,
  verifier_user_id uuid NOT NULL REFERENCES iam.users(user_id),
  status text NOT NULL DEFAULT 'started'
    CHECK (status IN ('started','in_progress','clarification_required','completed','approved','rejected')),
  overall_status text, -- e.g., APPROVED/REJECTED
  verified_tonnage numeric(20,8) CHECK (verified_tonnage IS NULL OR verified_tonnage >= 0),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mrv_submission_id)
);

CREATE INDEX IF NOT EXISTS idx_verifications_tenant_status
  ON verification.verifications(tenant_id, status, created_at DESC);

CREATE TRIGGER trg_verifications_updated_at
BEFORE UPDATE ON verification.verifications
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS verification.verification_category_results (
  category_result_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  verification_id uuid NOT NULL REFERENCES verification.verifications(verification_id) ON DELETE CASCADE,
  category_key text NOT NULL, -- e.g., 'project_setup', 'carbon_accounting'
  status text NOT NULL CHECK (status IN ('passed','passed_with_comments','clarification_required','corrective_action','failed')),
  findings jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of findings strings/objects
  evidence_refs jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of artifact refs/URIs
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (verification_id, category_key)
);

CREATE INDEX IF NOT EXISTS idx_verification_category_results_verification
  ON verification.verification_category_results(verification_id);

CREATE TABLE IF NOT EXISTS verification.verification_clarifications (
  clarification_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  verification_id uuid NOT NULL REFERENCES verification.verifications(verification_id) ON DELETE CASCADE,
  category_key text,
  questions jsonb NOT NULL, -- array of questions
  response jsonb, -- response payload
  requested_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verification_clarifications_verification
  ON verification.verification_clarifications(verification_id, requested_at DESC);

CREATE TABLE IF NOT EXISTS verification.verification_reports (
  verification_report_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  verification_id uuid NOT NULL REFERENCES verification.verifications(verification_id) ON DELETE CASCADE,
  report_uri text NOT NULL, -- IPFS/S3
  report_hash_sha256 text, -- sha256 hex of report content (optional)
  report_payload jsonb, -- structured report (optional)
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (verification_id)
);

-- Verification checklist templates (versioned per methodology)
CREATE TABLE IF NOT EXISTS verification.checklist_templates (
  checklist_template_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  methodology_id uuid REFERENCES project.methodologies(methodology_id) ON DELETE SET NULL,
  name text NOT NULL,
  version int NOT NULL DEFAULT 1 CHECK (version > 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','deprecated')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (methodology_id, version)
);

CREATE TABLE IF NOT EXISTS verification.checklist_template_items (
  checklist_template_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_template_id uuid NOT NULL REFERENCES verification.checklist_templates(checklist_template_id) ON DELETE CASCADE,
  category_key text NOT NULL,
  item_key text NOT NULL, -- e.g., '1.1_project_registered'
  description text NOT NULL,
  evidence_required boolean NOT NULL DEFAULT false,
  validation_type text NOT NULL DEFAULT 'manual' CHECK (validation_type IN ('manual','automated','hybrid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (checklist_template_id, item_key)
);

-- ============================================================================
-- HASHING: canonical payload + mrv_hash identity
-- ============================================================================

CREATE TABLE IF NOT EXISTS hashing.mrv_hashes (
  mrv_hash_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  mrv_submission_id uuid NOT NULL REFERENCES mrv.mrv_submissions(mrv_submission_id) ON DELETE CASCADE,
  mrv_hash text NOT NULL,
  canonical_payload jsonb NOT NULL,
  canonical_payload_uri text, -- optional off-chain storage
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (mrv_submission_id),
  UNIQUE (mrv_hash),
  CHECK (length(mrv_hash) IN (64, 71)) -- 64 hex, or 'sha256:' prefix
);

CREATE INDEX IF NOT EXISTS idx_mrv_hashes_tenant_created
  ON hashing.mrv_hashes(tenant_id, created_at DESC);

-- Global hash registry to prevent double-counting across registries
CREATE TABLE IF NOT EXISTS registry.global_hash_registry (
  mrv_hash text PRIMARY KEY,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  first_seen_tenant_id uuid REFERENCES core.tenants(tenant_id),
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked','approved','rejected','retired')),
  registry_type text,
  registry_serial text,
  notes text
);

-- ============================================================================
-- REGISTRY: submissions and lifecycle
-- ============================================================================

CREATE TABLE IF NOT EXISTS registry.registry_submissions (
  registry_submission_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  mrv_submission_id uuid NOT NULL REFERENCES mrv.mrv_submissions(mrv_submission_id) ON DELETE CASCADE,
  mrv_hash text NOT NULL REFERENCES registry.global_hash_registry(mrv_hash),
  registry_type text NOT NULL CHECK (registry_type IN ('verra','puro','isometric','eu_ets','california_arb','other')),
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted','approved','rejected','cancel_requested','cancelled','retirement_requested','retired','error')),
  registry_serial text, -- issued serial number
  registry_project_id text,
  request_payload jsonb, -- what we submitted
  response_payload jsonb, -- what registry returned
  last_error text,
  last_error_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (registry_type, registry_serial),
  UNIQUE (mrv_hash, registry_type)
);

CREATE INDEX IF NOT EXISTS idx_registry_submissions_tenant_status
  ON registry.registry_submissions(tenant_id, status, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_registry_submissions_mrv_submission
  ON registry.registry_submissions(mrv_submission_id);

CREATE TRIGGER trg_registry_submissions_updated_at
BEFORE UPDATE ON registry.registry_submissions
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- CREDIT: off-chain state + NEAR token tracking + lifecycle
-- ============================================================================

CREATE TABLE IF NOT EXISTS credit.credits (
  credit_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES project.projects(project_id) ON DELETE CASCADE,
  mrv_submission_id uuid NOT NULL REFERENCES mrv.mrv_submissions(mrv_submission_id) ON DELETE CASCADE,
  mrv_hash text NOT NULL, -- from hashing.mrv_hashes / global registry
  registry_type text NOT NULL,
  registry_serial text,
  token_id text, -- NEAR token id
  near_contract_id text, -- contract account id
  near_minter_account_id text, -- submitter account id
  tonnage_co2e numeric(20,8) NOT NULL CHECK (tonnage_co2e >= 0),
  vintage_year int NOT NULL CHECK (vintage_year >= 1900 AND vintage_year <= 3000),
  issuance_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','retired','impaired','invalidated','expired','void')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  minted_at timestamptz,
  retired_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, mrv_hash),
  UNIQUE (near_contract_id, token_id),
  UNIQUE (registry_type, registry_serial)
);

CREATE INDEX IF NOT EXISTS idx_credits_tenant_status
  ON credit.credits(tenant_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_credits_project
  ON credit.credits(project_id, created_at DESC);

CREATE TRIGGER trg_credits_updated_at
BEFORE UPDATE ON credit.credits
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- Current ownership (projection from chain events)
CREATE TABLE IF NOT EXISTS credit.credit_ownership (
  credit_id uuid PRIMARY KEY REFERENCES credit.credits(credit_id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  owner_account_id text NOT NULL, -- NEAR account id (or custodian)
  owner_type text NOT NULL DEFAULT 'near' CHECK (owner_type IN ('near','custodial','internal')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_ownership_owner
  ON credit.credit_ownership(owner_account_id);

-- Transfer history
CREATE TABLE IF NOT EXISTS credit.credit_transfers (
  transfer_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  credit_id uuid NOT NULL REFERENCES credit.credits(credit_id) ON DELETE CASCADE,
  token_id text NOT NULL,
  from_account_id text,
  to_account_id text NOT NULL,
  transaction_hash text NOT NULL,
  block_height bigint,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_transfers_credit
  ON credit.credit_transfers(credit_id, occurred_at DESC);

-- Retirement records (beneficiary claim + certificate)
CREATE TABLE IF NOT EXISTS credit.retirements (
  retirement_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  credit_id uuid NOT NULL REFERENCES credit.credits(credit_id) ON DELETE CASCADE,
  token_id text NOT NULL,
  beneficiary text NOT NULL,
  retirement_reason text,
  certificate_uri text,
  registry_confirmed boolean NOT NULL DEFAULT false,
  registry_confirmed_at timestamptz,
  blockchain_tx_hash text,
  blockchain_block_height bigint,
  retired_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_retirements_tenant_time
  ON credit.retirements(tenant_id, retired_at DESC);

-- Credit split/merge lineage (fractionalization)
CREATE TABLE IF NOT EXISTS credit.credit_lineage (
  lineage_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  parent_credit_id uuid REFERENCES credit.credits(credit_id) ON DELETE SET NULL,
  child_credit_id uuid REFERENCES credit.credits(credit_id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('split','merge')),
  amount_co2e numeric(20,8),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_lineage_parent
  ON credit.credit_lineage(parent_credit_id, created_at DESC);

-- Buffer pool + reversals (permanence risk handling)
CREATE TABLE IF NOT EXISTS credit.buffer_pools (
  buffer_pool_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  project_id uuid REFERENCES project.projects(project_id) ON DELETE SET NULL,
  buffer_type text NOT NULL DEFAULT 'permanence' CHECK (buffer_type IN ('permanence','insurance','other')),
  balance_co2e numeric(20,8) NOT NULL DEFAULT 0 CHECK (balance_co2e >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, project_id, buffer_type)
);

-- Reversal events that impair/invalidates credits and debit buffer pools
CREATE TABLE IF NOT EXISTS credit.reversal_events (
  reversal_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  project_id uuid REFERENCES project.projects(project_id) ON DELETE SET NULL,
  detected_at timestamptz NOT NULL DEFAULT now(),
  reversal_type text NOT NULL CHECK (reversal_type IN ('fire','disease','policy_change','measurement_error','other')),
  total_reversed_co2e numeric(20,8) NOT NULL CHECK (total_reversed_co2e > 0),
  buffer_debited_co2e numeric(20,8) NOT NULL DEFAULT 0 CHECK (buffer_debited_co2e >= 0),
  status text NOT NULL DEFAULT 'detected' CHECK (status IN ('detected','quantified','buffer_debited','impaired','resolved')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reversal_events_tenant_time
  ON credit.reversal_events(tenant_id, detected_at DESC);

-- Map reversal events to affected credits (many-to-many)
CREATE TABLE IF NOT EXISTS credit.reversal_affected_credits (
  reversal_event_id uuid NOT NULL REFERENCES credit.reversal_events(reversal_event_id) ON DELETE CASCADE,
  credit_id uuid NOT NULL REFERENCES credit.credits(credit_id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  impaired_co2e numeric(20,8) CHECK (impaired_co2e IS NULL OR impaired_co2e >= 0),
  new_status text CHECK (new_status IN ('active','impaired','invalidated','retired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (reversal_event_id, credit_id)
);

-- ============================================================================
-- PROCESS: long-running process tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS process.processes (
  process_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  process_type text NOT NULL
    CHECK (process_type IN ('credit_issuance','credit_retirement','batch_minting','tenant_onboarding','data_migration','reversal_handling')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','processing','completed','failed','compensating','compensated','cancelled')),
  current_step int NOT NULL DEFAULT 0 CHECK (current_step >= 0),
  total_steps int NOT NULL CHECK (total_steps > 0),
  progress_percent int NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  estimated_completion timestamptz,
  error jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_processes_tenant_status
  ON process.processes(tenant_id, status, started_at DESC);

CREATE TRIGGER trg_processes_updated_at
BEFORE UPDATE ON process.processes
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS process.process_steps (
  step_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  process_id uuid NOT NULL REFERENCES process.processes(process_id) ON DELETE CASCADE,
  step_number int NOT NULL CHECK (step_number >= 0),
  step_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','completed','failed','retrying','skipped')),
  started_at timestamptz,
  completed_at timestamptz,
  error jsonb,
  result jsonb,
  retry_count int NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  max_retries int NOT NULL DEFAULT 3 CHECK (max_retries >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (process_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_process_steps_process
  ON process.process_steps(process_id, step_number);

CREATE TRIGGER trg_process_steps_updated_at
BEFORE UPDATE ON process.process_steps
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- SAGA: orchestration and compensation tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS saga.sagas (
  saga_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  process_id uuid NOT NULL REFERENCES process.processes(process_id) ON DELETE CASCADE,
  saga_type text NOT NULL CHECK (saga_type IN ('credit_issuance','credit_retirement','batch_minting')),
  status text NOT NULL DEFAULT 'initiated'
    CHECK (status IN ('initiated','processing','completed','failed','compensating','compensated')),
  current_step int NOT NULL DEFAULT 0 CHECK (current_step >= 0),
  completed_steps jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of step names
  failed_step int,
  compensation_status text CHECK (compensation_status IN ('not_started','in_progress','completed','failed')),
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sagas_tenant_status
  ON saga.sagas(tenant_id, status, created_at DESC);

CREATE TRIGGER trg_sagas_updated_at
BEFORE UPDATE ON saga.sagas
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS saga.saga_steps (
  saga_step_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  saga_id uuid NOT NULL REFERENCES saga.sagas(saga_id) ON DELETE CASCADE,
  step_number int NOT NULL CHECK (step_number >= 0),
  step_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','compensated')),
  result jsonb,
  error jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (saga_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_saga_steps_saga
  ON saga.saga_steps(saga_id, step_number);

-- ============================================================================
-- EVENTING: event store, outbox, idempotency
-- ============================================================================

-- Partitioned event store (append-only)
CREATE TABLE IF NOT EXISTS eventing.event_store (
  sequence_number bigserial NOT NULL,
  event_id uuid NOT NULL,
  event_type text NOT NULL,
  aggregate_id text NOT NULL,
  aggregate_version int NOT NULL DEFAULT 0 CHECK (aggregate_version >= 0),
  tenant_id uuid,
  correlation_id text, -- may be a UUID (process_id) but keep flexible
  causation_id uuid,
  payload jsonb NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (sequence_number, created_at),
  UNIQUE (event_id)
) PARTITION BY RANGE (created_at);

-- Default partition to avoid insert failures before a monthly partition exists
CREATE TABLE IF NOT EXISTS eventing.event_store_default
  PARTITION OF eventing.event_store DEFAULT;

CREATE INDEX IF NOT EXISTS idx_event_store_tenant_type_time
  ON eventing.event_store_default(tenant_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_store_aggregate
  ON eventing.event_store_default(aggregate_id, aggregate_version);

-- Idempotency / dedupe for consumers
CREATE TABLE IF NOT EXISTS eventing.processed_events (
  processed_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_group text NOT NULL, -- e.g., 'credit-service', 'billing'
  tenant_id uuid,
  event_id uuid NOT NULL,
  event_type text NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (consumer_group, event_id)
);

CREATE INDEX IF NOT EXISTS idx_processed_events_group_time
  ON eventing.processed_events(consumer_group, processed_at DESC);

-- Outbox pattern (optional but recommended for atomic write + publish)
CREATE TABLE IF NOT EXISTS eventing.outbox_events (
  outbox_event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid,
  event_type text NOT NULL,
  aggregate_id text NOT NULL,
  aggregate_version int NOT NULL DEFAULT 0,
  correlation_id text,
  causation_id uuid,
  payload jsonb NOT NULL,
  metadata jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','published','failed')),
  attempts int NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  available_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending
  ON eventing.outbox_events(status, available_at)
  WHERE status = 'pending';

CREATE TRIGGER trg_outbox_events_updated_at
BEFORE UPDATE ON eventing.outbox_events
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- AUDIT: append-only audit events (partitioned)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit.audit_events (
  audit_event_id bigserial NOT NULL,
  tenant_id uuid,
  actor_user_id uuid,
  action text NOT NULL, -- e.g., 'mrv.submitted', 'verification.approved'
  resource_type text NOT NULL, -- e.g., 'mrv_submission', 'credit'
  resource_id text NOT NULL,
  correlation_id text,
  ip_address inet,
  user_agent text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (audit_event_id, occurred_at)
) PARTITION BY RANGE (occurred_at);

CREATE TABLE IF NOT EXISTS audit.audit_events_default
  PARTITION OF audit.audit_events DEFAULT;

CREATE INDEX IF NOT EXISTS idx_audit_events_tenant_time
  ON audit.audit_events_default(tenant_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_events_resource
  ON audit.audit_events_default(resource_type, resource_id, occurred_at DESC);

-- ============================================================================
-- BILLING: usage ledger, invoices, payments
-- ============================================================================

CREATE TABLE IF NOT EXISTS billing.usage_ledger (
  usage_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  metric text NOT NULL, -- credits_minted, credits_retired, api_calls, storage_gb
  period_start date NOT NULL,
  period_end date NOT NULL,
  quantity numeric(20,4) NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, metric, period_start, period_end),
  CHECK (period_end > period_start)
);

CREATE INDEX IF NOT EXISTS idx_usage_ledger_tenant_period
  ON billing.usage_ledger(tenant_id, period_start DESC);

CREATE TABLE IF NOT EXISTS billing.invoices (
  invoice_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  external_invoice_ref text, -- Stripe invoice id
  amount_cents bigint NOT NULL DEFAULT 0 CHECK (amount_cents >= 0),
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','open','paid','void','uncollectible')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  issued_at timestamptz,
  paid_at timestamptz,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_period
  ON billing.invoices(tenant_id, period_start DESC);

CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON billing.invoices
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- WEBHOOK: configs + delivery attempts
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook.webhook_endpoints (
  webhook_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  name text NOT NULL,
  endpoint_url text NOT NULL,
  secret_ref text NOT NULL, -- Secrets Manager reference for HMAC secret
  enabled boolean NOT NULL DEFAULT true,
  event_filters jsonb NOT NULL DEFAULT '[]'::jsonb, -- list of event_types
  failure_count int NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_endpoints_tenant_enabled
  ON webhook.webhook_endpoints(tenant_id, enabled);

CREATE TRIGGER trg_webhook_endpoints_updated_at
BEFORE UPDATE ON webhook.webhook_endpoints
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

CREATE TABLE IF NOT EXISTS webhook.webhook_deliveries (
  delivery_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  webhook_id uuid NOT NULL REFERENCES webhook.webhook_endpoints(webhook_id) ON DELETE CASCADE,
  event_id uuid NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','delivered','failed')),
  attempt_count int NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  next_attempt_at timestamptz,
  last_error text,
  last_response_status int,
  last_response_time_ms int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (webhook_id, event_id)
);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_pending
  ON webhook.webhook_deliveries(status, next_attempt_at)
  WHERE status = 'pending';

CREATE TRIGGER trg_webhook_deliveries_updated_at
BEFORE UPDATE ON webhook.webhook_deliveries
FOR EACH ROW EXECUTE FUNCTION app.set_updated_at();

-- ============================================================================
-- API Idempotency (HTTP idempotency keys)
-- ============================================================================

CREATE TABLE IF NOT EXISTS core.idempotency_keys (
  idempotency_key_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES core.tenants(tenant_id) ON DELETE CASCADE,
  key text NOT NULL,
  request_hash text NOT NULL, -- hash of request body + path + method
  response_status int,
  response_body jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE (tenant_id, key),
  CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_tenant_expires
  ON core.idempotency_keys(tenant_id, expires_at DESC);

-- ============================================================================
-- RLS: enable and apply standard tenant isolation policy
-- ============================================================================

-- Helper macro-like approach: enable RLS + policy per table that has tenant_id.
-- NOTE: migrations usually run as a privileged role; application should SET app.tenant_id.

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE column_name = 'tenant_id'
      AND table_schema IN ('core','iam','project','mrv','verification','hashing','registry','credit','process','saga','billing','webhook','eventing','audit')
    GROUP BY table_schema, table_name
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', r.table_schema, r.table_name);
    EXECUTE format('ALTER TABLE %I.%I FORCE ROW LEVEL SECURITY', r.table_schema, r.table_name);

    -- drop/create to make migration idempotent
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I.%I', r.table_schema, r.table_name);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I.%I USING (tenant_id = app.current_tenant_id())',
      r.table_schema, r.table_name
    );
  END LOOP;
END $$;

COMMIT;


