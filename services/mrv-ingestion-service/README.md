# `services/mrv-ingestion-service/`

High-volume MRV data ingestion.

Responsibilities:
- Accept MRV data from sensors/labs/satellite providers
- Validate payloads against methodology schemas
- Persist raw submissions with tenant/project association
- Emit ingestion events for downstream processing


