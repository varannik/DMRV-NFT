# Data Schema (PostgreSQL) — DMRV SaaS (NEAR + AWS)

This document describes the **recommended data schema** used by the platform, aligned with:
- `../dmrv_saa_s_architecture_near_nft_design.md`
- Event/process types in `../../types/*`

Source of truth migration:
- `../infrastructure/database/migrations/0001_init.sql`

## Design goals

- **Multi-tenant isolation**: almost all business tables include `tenant_id` with **RLS enforced**.
- **Event-driven correctness**: at-least-once delivery supported via **event store + idempotency**.
- **Auditability**: immutable, append-only audit trail.
- **Long-running workflows**: process tracking + saga compensation.
- **Registry-first issuance**: registry approval before NEAR mint.

## High-level entity map (workflow-first)

### Issuance flow (MRV → NFT)

1. `mrv.mrv_submissions` (raw MRV payload)
2. `mrv.mrv_computations` (computed tonnage + methodology outputs)
3. `verification.verifications` + `verification.verification_category_results` + `verification.verification_reports`
4. `hashing.mrv_hashes` (canonical payload + SHA-256 hash)
5. `registry.global_hash_registry` (dedupe lock) + `registry.registry_submissions` (registry status + serial)
6. `credit.credits` (off-chain credit state) + `credit.credit_ownership` (current owner projection)
7. `credit.credit_transfers` / `credit.retirements` (chain lifecycle projections)

### Retirement flow

- Retirement is captured in `credit.retirements` and registry confirmation is tracked via `registry.registry_submissions.status` (e.g., `retired`) or a follow-up registry event.

### Reversal flow (permanence)

- `credit.reversal_events` + `credit.reversal_affected_credits`
- Buffer balances are tracked in `credit.buffer_pools`

## Tenancy & RLS

### Tenant context

Apps/workers must set session tenant:

```sql
SELECT set_config('app.tenant_id', '<tenant-uuid>', true);
```

RLS policy uses:

```sql
tenant_id = app.current_tenant_id()
```

### Tables without `tenant_id`

Some tables are global by design:
- `registry.global_hash_registry` (prevents cross-tenant double counting)
- Lookup tables like `core.subscription_plans`, `core.features`, `project.methodologies`

## Eventing tables

- **`eventing.event_store`**: partitioned append-only store for replay/audit.
- **`eventing.processed_events`**: consumer idempotency (`UNIQUE(consumer_group, event_id)`).
- **`eventing.outbox_events`**: optional transactional outbox for safe publish-after-commit.

## Process & Saga tables

Aligned to `types/processes/index.ts`:

- **`process.processes`**: process instance state (status/progress/metadata/error).
- **`process.process_steps`**: step-level status, retries, results.
- **`saga.sagas`**: orchestration state + compensation tracking.
- **`saga.saga_steps`**: step outcomes for the saga.

## Credits & chain projection tables

- **`credit.credits`**: authoritative off-chain view of credit status (ACTIVE/RETIRED/IMPAIRED/etc.).
- **`credit.credit_ownership`**: current owner (NEAR account or custodian).
- **`credit.credit_transfers`**: ownership history (from `blockchain.nft.transferred.v1`).
- **`credit.retirements`**: retirement certificates and beneficiary claims.
- **`credit.credit_lineage`**: split/merge lineage for fractionalization.

## Verification checklists

To support “9-category verification” with methodology versioning:

- **`verification.checklist_templates`**
- **`verification.checklist_template_items`**

These define what must be checked; actual results per verification live in:
- `verification.verification_category_results`


