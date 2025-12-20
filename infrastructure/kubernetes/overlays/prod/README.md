# `infrastructure/kubernetes/overlays/prod/`

Production environment overlays.

Requirements:
- Immutable image digests
- Tight resource limits and autoscaling
- Strict network policies / ingress rules
- Full observability + alerting enabled
- Safe rollout strategy (canary/blue-green) + rollback hooks


