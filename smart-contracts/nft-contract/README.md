# `smart-contracts/nft-contract/`

NEAR NFT contract implementing the credit lifecycle.

Expected features (from the architecture doc):
- `mint`: only the platform submitter account can mint
- `transfer`: owner transfer
- `retire`: irreversible retirement with beneficiary claim
- `split/merge`: fractionalization primitives
- `pause/unpause`: emergency control by governance (multi-sig)

Keep contract state minimal and prefer storing large artefacts off-chain (IPFS/S3/Arweave) with hashes on-chain.


