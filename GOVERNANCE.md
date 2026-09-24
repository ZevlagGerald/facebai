# FaceBai Project Governance

## Authority

The owner is the final authority for product, design, deployment and production decisions.

## Canonical identity

- Brand: **FaceBai**
- Primary domain: **facebai.party**
- Audience: Bisaya users and communities worldwide
- Master visual direction: tropical banana-leaf social interface

## Master-design protection

The file `public/reference/facebai-master-design.png` is the canonical approved UI reference.

Do not silently:

- replace the banana-leaf visual identity;
- switch to a generic blue social-network theme;
- copy Facebook logos, icons, exact layouts, or trade dress;
- remove the cream/green tropical palette;
- replace Bisaya-oriented interface vocabulary with generic branding;
- materially restructure the desktop three-column social experience without owner approval.

Responsive adaptations are allowed when needed for usability.

## Repository workflow

- `main` = production-qualified baseline.
- Implementation should normally happen on `feature/*` branches.
- Do not merge substantial feature work to `main` without owner approval.
- Do not deploy to production or change DNS without owner approval.
- Do not commit secrets, passwords, tokens, private keys, or production credentials.

## Engineering principle

Implement the smallest coherent tranche, verify it, report changed files/tests/risks, then continue. Avoid redesign loops and unnecessary generated assets.
