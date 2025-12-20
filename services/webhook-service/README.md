# `services/webhook-service/`

Tenant-configurable outbound webhooks (from architecture section 27).

Responsibilities:
- Subscribe to domain events and fan-out to tenant webhook endpoints
- Sign payloads (HMAC) and provide replay protection headers
- Retry with backoff and disable misbehaving endpoints


