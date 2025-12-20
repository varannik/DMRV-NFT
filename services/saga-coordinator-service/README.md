# `services/saga-coordinator-service/`

Saga orchestration and compensation (from architecture section 29).

Responsibilities:
- Track saga instances and step completion
- Handle timeouts and trigger compensation flows
- Emit `saga.*` events for observability/audit


