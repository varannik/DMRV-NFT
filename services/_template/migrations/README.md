# `migrations/`

Database migrations for the service (if stateful).

Guidelines:
- Prefer forward-only, zero-downtime migrations
- Document rollback steps for risky changes
- Keep schema changes compatible across rolling deployments


