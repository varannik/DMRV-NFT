# DMRV SaaS Platform (NEAR + AWS) — Monorepo

This repository is the implementation scaffold for the architecture described in:

- `dmrv_saa_s_architecture_near_nft_design.md`
- `ARCHITECTURE_GAPS_ANALYSIS.md`

## What lives where

- `docs/`: Architecture, ADRs, API specs, event catalog, runbooks, and operational playbooks.
- `infrastructure/`: Terraform, Kubernetes, Helm, Docker Compose, and monitoring config.
- `services/`: Microservices (TypeScript/Node) following an event-driven architecture.
- `shared/`: Shared libraries (auth, events, types, validation, errors, logging, blockchain utilities).
- `smart-contracts/`: NEAR smart contracts (Rust) and related tooling/tests.
- `tests/`: End-to-end and load tests across the full platform.
- `scripts/`: Helper scripts for local dev, migrations, ops workflows.
- `.github/`: CI/CD workflows and repo automation.

## Conventions

- **Event naming**: `noun.verb.v{n}` (e.g., `mrv.approved.v1`)
- **Multi-tenancy**: Every API request + event includes `tenant_id`
- **Idempotency**: At-least-once delivery is assumed; consumers must dedupe by `event_id`


