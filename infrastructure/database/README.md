# `infrastructure/database/`

PostgreSQL schema and migrations for the DMRV SaaS platform (AWS RDS).

This schema is derived from:
- `../../dmrv_saa_s_architecture_near_nft_design.md`
- `../../ARCHITECTURE_GAPS_ANALYSIS.md`
- `../../../../types/events/index.ts`
- `../../../../types/processes/index.ts`

## Key design principles

- **Multi-tenant by default**: tenant-scoped tables include `tenant_id` and are protected with **Row Level Security (RLS)**.
- **Event-driven**: includes an **event store** (`eventing.event_store`) and **idempotency** (`eventing.processed_events`) for at-least-once delivery.
- **Process/Saga support**: includes `process.processes`, `process.process_steps`, `saga.sagas`, `saga.saga_steps`.
- **Auditability**: append-only audit log tables in `audit.*`.

## How tenant isolation works (RLS)

Application code should set the tenant context per request/worker:

```sql
SELECT set_config('app.tenant_id', '<tenant-uuid>', true);
```

RLS policies then enforce:

```sql
tenant_id = app.current_tenant_id()
```

## Migrations

- `migrations/0001_init.sql`: initial schemas/tables/indexes/RLS policies


