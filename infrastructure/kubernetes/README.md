# `infrastructure/kubernetes/`

Kubernetes manifests (GitOps-friendly).

Structure:
- `base/`: shared manifests (namespaces, RBAC, common config)
- `overlays/`: environment-specific overlays (dev/staging/prod)

Keep secrets out of git; use External Secrets / Secrets Manager integration.


