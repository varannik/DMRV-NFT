# `infrastructure/`

Infrastructure-as-code and deployment configuration for AWS.

Subfolders:
- `terraform/`: AWS resources (networking, RDS, EventBridge/SQS, IAM, KMS, etc.)
- `kubernetes/`: Base + overlays for dev/staging/prod (GitOps-friendly).
- `helm/`: Helm charts for services/platform components.
- `docker-compose/`: Local development stack (Postgres, Redis, LocalStack).
- `monitoring/`: Prometheus/Grafana/Fluent Bit/X-Ray/OpenTelemetry config.


