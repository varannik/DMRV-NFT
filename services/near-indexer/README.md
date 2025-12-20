# `services/near-indexer/`

NEAR chain event ingestion.

Responsibilities:
- Subscribe to NEAR events (NEAR Lake / RPC)
- Normalize on-chain events (mint/transfer/retire) into platform events
- Emit `blockchain.nft.*` events for downstream consumers (credit service, audit, notifications)


