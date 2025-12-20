# `services/api-gateway/`

Unified ingress for clients.

Responsibilities:
- Authn/authz enforcement (JWT, API keys; optionally SSO integration)
- Tenant identification and rate limiting per tenant
- Request routing to internal services
- Standardized error responses and request IDs

Folders:
- `src/`: implementation
- `src/events/`: gateway-level events (optional)
- `tests/`: unit/integration tests


