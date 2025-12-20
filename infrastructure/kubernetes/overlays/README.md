# `infrastructure/kubernetes/overlays/`

Environment overlays for Kubernetes manifests.

Each environment should define:
- Image tags (pin to immutable digests in prod)
- Resource sizing
- Ingress/ALB settings
- Feature flags / environment variables

Subfolders:
- `dev/`
- `staging/`
- `prod/`


