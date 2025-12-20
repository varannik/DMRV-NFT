# `src/controllers/`

HTTP/REST (or GraphQL) handlers.

Responsibilities:
- Request validation
- Authn/authz enforcement (scopes/roles)
- Tenant context enforcement (`tenant_id`)
- Idempotency key handling (where required)
- Response shaping (no domain logic here)


