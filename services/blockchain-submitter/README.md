# `services/blockchain-submitter/`

NEAR transaction submission service.

Responsibilities:
- Receive `registry.approved.v1` events and mint NFTs on NEAR
- Manage signing keys (HSM/multi-sig operational model)
- Emit `blockchain.nft.minted.v1` / failure events


