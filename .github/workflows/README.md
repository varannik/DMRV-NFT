# `.github/workflows/`

Place CI/CD workflow definitions here.

Recommended pipelines (aligned with `ARCHITECTURE_GAPS_ANALYSIS.md`):

- **CI**: lint, unit tests, typecheck, build for every PR.
- **Security**: SAST, dependency scanning, container image scanning.
- **Infra**: Terraform validate/plan on PR, apply on approval for environments.
- **Deploy**: Build/push images, rollout (blue/green or canary), automated rollback hooks.
- **Release**: Tagging, changelog, provenance/SBOM.


