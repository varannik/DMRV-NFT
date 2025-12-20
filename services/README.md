# `services/`

All microservices live here (Node.js + TypeScript by default).

Cross-cutting requirements:
- Must propagate `tenant_id` (request context + event payloads).
- Publish domain events to EventBridge; consume via SQS with DLQs.
- Enforce idempotency (dedupe by `event_id`) and ordering per aggregate.
- Emit audit events for all state changes.

See `services/_template/` for the reference folder layout.


