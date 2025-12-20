# `services/registry-adapter-verra/`

Integration adapter for Verra (VCS).

Responsibilities:
- Transform canonical MRV payload into Verra submission formats
- Submit and poll Verra APIs (or workflow)
- Emit `registry.approved.v1` / `registry.rejected.v1`
- Handle retirement confirmation (`registry.retired.v1`)


