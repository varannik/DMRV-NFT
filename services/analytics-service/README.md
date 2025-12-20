# `services/analytics-service/`

Analytics and derived metrics subscriber (optional but common).

Responsibilities:
- Subscribe to key events and build aggregate metrics (credits minted/day, tonnage, latency)
- Feed dashboards or BI sinks (e.g., warehouse) without impacting OLTP paths


