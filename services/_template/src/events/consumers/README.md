# `src/events/consumers/`

Event consumers.

Put here:
- SQS message handlers
- Idempotency store checks (processed events table/Redis)
- DLQ handling hooks + structured error reporting
- Backpressure controls (batch sizes, concurrency limits)


