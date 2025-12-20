# `src/middleware/`

Cross-cutting HTTP middleware.

Put here:
- Auth middleware (JWT validation)
- Tenant context extraction and enforcement
- Request ID / correlation ID injection
- Rate limiting hooks (if applied at service-level)
- Idempotency middleware for write endpoints


