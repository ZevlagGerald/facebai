# FaceBai Project Governance

## Authority

The owner is the final authority for product, design, deployment and production decisions.

## Canonical identity

- Brand: **FaceBai**
- Primary domain: **facebai.party**
- Audience: Bisaya users and communities worldwide
- Master visual direction: tropical banana-leaf social interface

## Master-design protection

The owner-approved FaceBai dashboard design dated 2026-09-24 is the canonical product-composition authority. Its exact source-image hash is recorded in `docs/DESIGN_LOCK.txt`.

The owner-approved FaceBai light/dark brand identity board dated 2026-09-24 is the canonical theme/asset-treatment authority. Its exact source-image hash is recorded in `docs/THEME_REFERENCE_LOCK.md`.

Do not silently:

- replace the banana-leaf visual identity;
- switch to a generic blue social-network theme;
- copy Facebook logos, icons, exact layouts, or trade dress;
- remove the cream/green tropical palette;
- replace Bisaya-oriented interface vocabulary with generic branding;
- materially restructure the desktop three-column social experience without owner approval;
- replace approved artwork with CSS-generated approximations;
- recolor approved logo/background artwork using destructive CSS filters;
- introduce a light/dark theme treatment that conflicts with the locked theme reference.

Responsive adaptations are allowed when needed for usability, provided the approved artwork and design intent remain intact.

## Light/dark theme rule

Every production screen that supports theming must be visually qualified in both light and dark modes.

Theme-specific logos, marks, backgrounds, and illustrations must be either:

1. deterministic technical derivatives of approved sources with no creative alteration; or
2. separately generated, owner-approved, and SHA-256 locked.

CSS may control layout, crop, size, position, neutral scrims, and accessibility contrast. CSS must not substitute for approved branded artwork.

See `docs/THEME_ASSET_RULES.md` and `docs/THEME_REFERENCE_LOCK.md`.

## Repository workflow

- `main` = production-qualified baseline.
- Implementation should normally happen on `feature/*` branches.
- Do not merge substantial feature work to `main` without owner approval.
- Do not deploy to production or change DNS without owner approval.
- Do not commit secrets, passwords, tokens, private keys, or production credentials.

## Engineering principle

Implement the smallest coherent tranche, verify it, report changed files/tests/risks, then continue. Avoid redesign loops and unnecessary generated assets.

## Official design and interaction governance

The official product-interface governance is:

- `docs/FACEBAI_DESIGN_INTERACTION_GOVERNANCE.md` — **Official FaceBai Design & Interaction Governance v1.0**;
- `docs/FACEBAI_INTERACTION_CONTRACT.md` — normative interaction annex;
- `docs/FACEBAI_MODULE_QUALIFICATION_STANDARD.md` — normative module qualification annex.

Supporting subordinate standards include:

- `docs/FACEBAI_UI_PLACEMENT_STANDARD.md`;
- `docs/F2_GUI_VOICE_STANDARD.md`.

When governance documents conflict, use this authority order:

1. explicit owner directive;
2. this root `GOVERNANCE.md`;
3. locked design/theme/asset references;
4. `docs/FACEBAI_DESIGN_INTERACTION_GOVERNANCE.md` and its normative annexes;
5. `docs/FACEBAI_UI_PLACEMENT_STANDARD.md`;
6. `docs/F2_GUI_VOICE_STANDARD.md`;
7. module-specific specifications and tests.

All new or materially changed user-facing modules must follow the official design/interaction governance and applicable qualification gates before they may be called `QUALIFIED` or `FROZEN`.

Official governance changes must be versioned and reviewed as a bounded tranche. Material changes to the governance or its authority hierarchy require explicit owner approval.

Adoption of the design/interaction governance does not itself authorize a merge to `main`, production deployment, DNS/routes changes, secret changes, or production database mutation.