# `services/credit-service/`

Credit state management (off-chain read model + operational state).

Responsibilities:
- Maintain credit lifecycle state based on events (minted/transferred/retired/impaired)
- Provide query APIs for credits and public verification endpoints
- Enforce expiry/vintage rules and status transitions


