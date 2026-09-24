# FaceBai Approved Production Assets

Status: **LOCKED / OWNER APPROVED**
Approved: **2026-09-24**

These assets are canonical FaceBai brand assets. They must not be replaced, redrawn, recolored, reinterpreted, or approximated with CSS-generated artwork unless the owner explicitly approves a new asset revision.

Theme adaptability is governed by [`THEME_ASSET_RULES.md`](./THEME_ASSET_RULES.md). The approved light/dark visual authority is locked in [`THEME_REFERENCE_LOCK.md`](./THEME_REFERENCE_LOCK.md).

## A0.1 — Primary FaceBai Logo

Canonical source filename: `facebai_tropical_leaf_logo.png`

SHA-256:
`ab65a35448d33f648860e417a228fb83c527c0217ae5fe441b8056f0cae62b02`

Role:
- primary FaceBai horizontal wordmark
- authentication screens
- desktop header
- marketing/brand surfaces

Locked visual characteristics:
- FaceBai custom rounded green wordmark
- large layered banana-leaf emblem at left
- leaf/sprout treatment integrated with the final `i`
- deep forest/emerald/lime green palette
- transparent background

Theme classification:
- **light-surface primary logo**
- light mode: approved
- dark mode: follow the separately approved light/dark theme reference; do not synthesize a dark variant with filters
- CSS `invert`, `hue-rotate`, `brightness`, arbitrary recoloring, or equivalent filter-based theme conversion: **PROHIBITED**

Approved production WebP derivative SHA-256:
`65eeaecc02fa43c7f1cc3e5926f12a84f22c61a3dd0bac8b32cb224377a9183e`

## A0.2 — Primary Tropical Background

Canonical source filename: `sunlit_tropical_foliage_frame.png`

SHA-256:
`6b23c95499d2e5fe3fff524931569a0792b0582f6435fc7df773e24a3b323c83`

Role:
- FaceBai authentication / onboarding environmental background
- selected branded empty or welcome surfaces
- source visual reference for the tropical environmental system

Locked visual characteristics:
- premium illustrated banana-leaf frame
- warm cream/off-white central negative space
- layered natural green foliage
- soft sunlight and organic shadows
- subtle tropical coastal/mountain depth
- no text, logo, people, UI, or synthetic CSS replacement

Theme classification:
- **light-theme environmental background**
- light mode: approved
- dark mode: follow the separately approved dark tropical background direction from `THEME_REFERENCE_LOCK.md`
- CSS inversion, hue-shifting, destructive recoloring, or replacing the scene with synthetic CSS leaf artwork: **PROHIBITED**

Approved production WebP derivative SHA-256:
`8b0eb905015593f740e4e4942b23646feaf554ec0ba840d497cb8c44a5877152`

## A0.3 — FaceBai Light/Dark Theme Identity Board

Status: **APPROVED / LOCKED**

Canonical source image:
- dimensions: **1536 × 1024**
- format: **RGBA PNG**
- SHA-256: `7f0257a55ced1c95bb49998d6a172751f5a13cb45116eb776a7a3bec3a39bee1`

This board is the canonical theme reference for:
- primary logo treatment in light mode;
- primary logo treatment in dark mode;
- compact leaf/F logo mark direction;
- favicon/app-icon family;
- light tropical background direction;
- dark tropical background direction;
- green/cream/deep-forest theme relationship;
- navigation/header usage examples.

The board is a reference authority, not a license to crop individual production assets from the board without qualification. Final deployable logo/icon/background files should be generated or derived as isolated assets and hash-locked separately.

## A0.4 — Isolated Primary Logo, Light Mode

Status: **APPROVED / LOCKED**

Canonical production source filename: `facebai-logo-light.png`

Source qualification:
- dimensions: **2172 × 724**
- format: **RGBA PNG**
- transparent background: **YES**
- SHA-256: `7868ed17554366092282102a603085c84a8a3c4b675ea4b88a46db6fa4b3300b`

Role:
- deployable light-mode FaceBai horizontal logo
- light authentication surfaces
- light navigation/header surfaces
- light marketing surfaces

Locked characteristics:
- isolated logo only; no board, labels, mockup, or background scene
- leaf-integrated FaceBai `F` emblem
- vivid natural green foliage with dew/highlight detail
- custom rounded green `FaceBai` wordmark
- botanical leaf accent above the final `i`
- no CSS-redrawn substitute

Theme classification:
- **LIGHT MODE PRIMARY PRODUCTION LOGO**
- use on cream, white, warm-sand, or other qualified light surfaces
- do not use CSS filters to adapt this source for dark mode
- dark mode must use its own separately generated, owner-approved and hash-locked production logo

Derivative policy:
- resizing/compression from this exact source is allowed when aspect ratio and alpha are preserved
- creative recoloring, redrawing, leaf replacement, font substitution, or geometry changes are prohibited without explicit owner approval

## A0.5 — Isolated Primary Logo, Dark Mode

Status: **APPROVED / LOCKED**

Canonical production source filename: `facebai-logo-dark.png`

Source qualification:
- dimensions: **2171 × 724**
- format: **RGBA PNG**
- transparent background: **YES**
- SHA-256: `f25a1eead495e0aa85872539d254a58dccd9d428f95cb7a4acc3cb5bfd6d70ed`

Role:
- deployable dark-mode FaceBai horizontal logo
- dark authentication surfaces
- dark navigation/header surfaces
- dark marketing surfaces

Locked characteristics:
- isolated logo only; no board, labels, mockup, or background scene
- leaf-integrated FaceBai `F` emblem
- vivid natural green foliage with dew/highlight detail
- cream/ivory FaceBai wordmark optimized for dark surfaces
- botanical leaf accent above the final `i`
- deep green edging/shadow treatment retained from the approved dark-mode identity
- no CSS-redrawn substitute

Theme classification:
- **DARK MODE PRIMARY PRODUCTION LOGO**
- use on deep forest, near-black, or other qualified dark surfaces
- do not use CSS filters to adapt this source for light mode
- light mode must use the separately approved and hash-locked light production logo

Derivative policy:
- resizing/compression from this exact source is allowed when aspect ratio and alpha are preserved
- creative recoloring, redrawing, leaf replacement, font substitution, outline removal, or geometry changes are prohibited without explicit owner approval

## Governance

1. These hashes identify the exact owner-approved source images.
2. CSS may control layout, positioning, cropping, responsive sizing, neutral overlays/scrims, and accessibility contrast, but CSS must not replace or creatively alter the artwork itself.
3. Optimized delivery derivatives may be produced only from canonical sources without creative alteration.
4. A new source image or creative theme variant requires explicit owner approval and a new versioned hash record.
5. The approved master dashboard design remains the composition authority for how brand assets are used within FaceBai.
6. The approved theme board remains the light/dark visual-treatment authority.
7. Every future approved production asset must record its light/dark theme classification before qualification.
