# `smart-contracts/`

NEAR smart contracts (Rust) for:
- Credit NFT issuance/lifecycle (NEP-171)
- Registry synchronization primitives (where needed)

Subfolders:
- `nft-contract/`: NFT contract implementing `mint/transfer/retire/split/merge/pause`.
- `registry-sync/`: Optional contract(s) for cross-registry hash registry or sync proofs.
- `scripts/`: Deployment and admin scripts (testnet/mainnet).
- `tests/`: Simulation/unit tests for contracts.


