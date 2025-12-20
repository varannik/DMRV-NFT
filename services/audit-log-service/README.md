# `services/audit-log-service/`

Immutable audit trail for compliance and forensic analysis.

Responsibilities:
- Subscribe to all domain events
- Persist tamper-evident audit logs (append-only)
- Provide query/export interfaces for audits (role-restricted)


