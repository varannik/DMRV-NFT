# `src/events/`

Event publishers and consumers for the event-driven architecture.

Put here:
- `publishers/`: build + publish domain events
- `consumers/`: handle incoming events (idempotent, retryable)

Rules:
- Validate payloads against schemas.
- Deduplicate by `event_id`.
- Use `correlation_id`/`causation_id` for tracing end-to-end flows.


