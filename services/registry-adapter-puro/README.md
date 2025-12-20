# `services/registry-adapter-puro/`

Integration adapter for Puro.earth.

Responsibilities:
- Submit verified MRV/hash payload for issuance approval
- Emit registry lifecycle events (`registry.approved.v1`, `registry.rejected.v1`, `registry.retired.v1`)
- Handle throttling/rate limits and registry-specific workflows


