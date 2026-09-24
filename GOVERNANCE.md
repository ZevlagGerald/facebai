# FaceBai Project Governance

## Authority

The owner is the final authority for product, design, deployment and production decisions.

## Canonical identity

- Brand: **FaceBai**
- Primary domain: **facebai.party**
- Audience: Bisaya users and communities worldwide
- Master visual direction: tropical banana-leaf social interface

## Master-design protection

The approved 2026-09-24 FaceBai banana-leaf dashboard is the canonical UI composition authority. The exact source-image hash and repository preview are recorded under `docs/`.

Do not silently:

- replace the banana-leaf visual identity;
- switch to a generic blue social-network theme;
- copy Facebook logos, icons, exact layouts, or trade dress;
- remove the cream/green tropical palette;
- replace Bisaya-oriented interface vocabulary with generic branding;
- materially restructure the desktop three-column social experience without owner approval.

Responsive adaptations are allowed when needed for usability.

## Theme and production-asset protection

FaceBai must support both **light mode** and **dark mode** as a first-class design requirement.

Canonical approved artwork is immutable. Do not manufacture theme variants using CSS inversion, hue rotation, brightness hacks, or arbitrary recoloring.

If a locked asset does not work correctly on both themes, create a deliberate separate variant, visually review it, obtain owner approval, and record its version/hash before production use.

All future production assets must document their light/dark theme classification and approved usage before qualification.

Canonical rules: [`docs/THEME_ASSET_RULES.md`](./docs/THEME_ASSET_RULES.md)
Approved locked assets: [`docs/APPROVED_ASSETS.md`](./docs/APPROVED_ASSETS.md)

## Repository workflow

- `main` = production-qualified baseline.
- Implementation should normally happen on `feature/*` branches.
- Do not merge substantial feature work to `main` without owner approval.
- Do not deploy to production or change DNS without owner approval.
- Do not commit secrets, passwords, tokens, private keys, or production credentials.

## Engineering principle

Implement the smallest coherent tranche, verify it, report changed files/tests/risks, then continue. Avoid redesign loops and unnecessary generated assets.
