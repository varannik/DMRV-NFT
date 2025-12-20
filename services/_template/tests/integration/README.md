# `tests/integration/`

Integration tests for the service.

Guidelines:
- Use Postgres/Redis via Docker Compose
- Use LocalStack (or similar) for EventBridge/SQS if needed
- Verify idempotency + retry/DLQ behavior for consumers


