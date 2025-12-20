# `tests/e2e/`

End-to-end system tests.

Cover at minimum:
- MRV ingestion → computation → verification → hash → registry approval → NEAR mint
- Retirement flow (registry reserve → on-chain retire → registry confirm → certificate)
- Failure modes (registry outage, NEAR RPC outage, DLQ/retry, idempotent replays)


