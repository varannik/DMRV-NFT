# `services/_template/src/`

Service source code.

Recommended sub-areas:
- `config/`: environment config loading and validation
- `controllers/`: HTTP handlers
- `services/`: business logic (domain)
- `repositories/`: DB access layer
- `models/`: entities and domain models
- `events/`: publishers + consumers (EventBridge/SQS)
- `middleware/`: auth, tenant context, idempotency
- `utils/`: helpers (logging, tracing, errors)


