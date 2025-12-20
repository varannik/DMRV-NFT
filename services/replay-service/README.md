# `services/replay-service/`

Event replay and recovery (from architecture section 31).

Responsibilities:
- Provide admin API to request replays (by tenant/time-range/event-type)
- Read from event store and re-emit events with replay markers
- Rate limit replays to protect downstream systems


