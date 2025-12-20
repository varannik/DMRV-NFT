# `services/process-service/`

Long-running process tracking (from architecture section 30).

Responsibilities:
- Track state/progress for async workflows (issuance, batch minting, retirement)
- Expose status APIs (`GET /v1/processes/{id}`) and emit `process.*` events
- Support cancellation where compensation is possible


