# `infrastructure/terraform/`

Terraform code for AWS infrastructure.

Recommended modules to add over time:
- Networking (VPC/subnets/NAT, VPC endpoints)
- RDS Postgres (multi-AZ, read replicas, backups)
- ElastiCache Redis
- EventBridge custom bus + rules + targets
- SQS queues + DLQs per consumer
- IAM roles/policies per service (least privilege)
- KMS keys and Secrets Manager integration


