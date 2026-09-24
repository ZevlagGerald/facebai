# FaceBai Production Asset Manifest

Status: active
Master visual authority: owner-approved 2026-09-24 banana-leaf FaceBai dashboard

Production assets are generated and owner-approved individually. Important brand elements must never be replaced by cheap CSS approximations or redrawn substitutes.

Theme adaptability is mandatory. See canonical `main` rule: `docs/THEME_ASSET_RULES.md`. Every asset must declare its light/dark classification before production qualification.

## A0 — Core brand assets

### A0.1 Primary FaceBai horizontal logo — LOCKED

Canonical source: `facebai_tropical_leaf_logo.png`

Source SHA-256:
`ab65a35448d33f648860e417a228fb83c527c0217ae5fe441b8056f0cae62b02`

Approved production WebP derivative SHA-256:
`65eeaecc02fa43c7f1cc3e5926f12a84f22c61a3dd0bac8b32cb224377a9183e`

Intent:
- transparent background
- primary FaceBai wordmark
- desktop header
- authentication / onboarding
- brand and marketing surfaces

Locked visual identity:
- layered banana-leaf emblem on the left
- custom rounded green FaceBai lettering
- leaf/sprout treatment integrated with the final `i`
- forest / emerald / lime green palette

Theme classification:
- light-surface primary logo
- light mode: approved
- dark mode: only where contrast is verified; otherwise use a separately generated and owner-approved dark-surface counterpart
- CSS inversion/recolor/filter-based dark-mode conversion: prohibited

Do not vector-redraw this asset by eye and call the redraw equivalent. Any future SVG must be produced and reviewed as an explicit derivative before it becomes canonical.

### A0.2 Compact mark — PENDING

Required for:
- favicon
- mobile navigation
- PWA/app icon
- compact FaceBai surfaces

Must be separately generated and owner-approved. It should derive from the accepted FaceBai visual identity without simply shrinking the full wordmark until it becomes unreadable.

Theme requirement:
- must be visually qualified on both light and dark surfaces
- if one master cannot meet both contrast requirements, generate explicit light/dark mark variants

### A0.3 Dark-surface/light logo variant — PENDING

Create before dark-mode production qualification if the canonical green wordmark lacks adequate contrast on dark surfaces.

Requirements:
- separately generated and owner-approved
- preserve FaceBai proportions, lettering silhouette and banana-leaf identity
- own canonical filename and hash lock
- never created by CSS `invert`, `brightness`, `hue-rotate` or arbitrary recoloring

### A0.4 Icon package — PENDING A0.2

Derive deterministically after compact mark approval:
- favicon.ico
- icon-192.png
- icon-512.png
- apple-touch-icon.png

All icon outputs must be checked against both light and dark browser/OS surfaces.

## A1 — Banana-leaf environmental system

### A1.1 Primary tropical background — LOCKED

Canonical source: `sunlit_tropical_foliage_frame.png`

Source SHA-256:
`6b23c95499d2e5fe3fff524931569a0792b0582f6435fc7df773e24a3b323c83`

Approved production WebP derivative SHA-256:
`8b0eb905015593f740e4e4942b23646feaf554ec0ba840d497cb8c44a5877152`

Intent:
- authentication / registration environment
- onboarding / welcome surfaces
- selected branded empty-state or promotional surfaces
- source art-direction reference for the environmental system

Locked characteristics:
- warm cream central negative space
- premium illustrated banana foliage around edges
- layered natural depth
- subtle tropical coast/mountain scenery
- no baked UI, text, logo or people

Theme classification:
- light-theme environmental background
- light mode: approved
- dark mode: non-destructive positioning/cropping plus neutral readability scrim may be evaluated
- if a genuine dark environmental scene is needed, generate a separate owner-approved dark counterpart with its own hash lock
- inversion/hue-shifting/destructive CSS recolor: prohibited

The artwork itself must be used. CSS may position, crop, responsively contain it, or place a neutral accessibility/readability layer over it, but CSS must not replace or creatively recolor the illustration.

### A1.2 Dark environmental background — CONDITIONAL / PENDING

Only generate if visual qualification proves the light environmental artwork cannot support the intended dark-mode composition while retaining proper readability and FaceBai identity.

If created, it must be a real generated FaceBai asset—not a CSS-darkened imitation—and requires separate owner approval/hash lock.

### A1.3 Supplemental transparent leaf assets — PENDING / ONLY AS NEEDED

Separate corner/edge assets may still be generated later for responsive dashboard decoration where the full background is inappropriate. They must visually match the locked primary background and master design.

Each must document whether it is theme-neutral or requires light/dark variants.

### A1.4 Organic paper/cream texture — PENDING / OPTIONAL

Only create if visual qualification shows the UI needs it. Do not manufacture decorative assets merely to fill the manifest.

A dark-theme texture, if required, must be a deliberately qualified counterpart rather than a filter-altered light texture.

## A2 — Product illustration assets

Pending after core UI/auth requirements prove the need:
- registration/onboarding supporting illustration, if the locked tropical background alone is insufficient
- empty feed
- empty Bai/friends
- empty notifications
- moderation/error empty states

All must match the approved art direction, be separately reviewed, and declare theme behavior.

## A3 — Development fixtures

Seed avatars/post photos are development/test fixtures, not FaceBai brand assets.

Rules:
- never represent fixture identities as real users
- production UI must work with arbitrary uploads
- no production dependency on fixture content

## Asset quality gates

Every production asset requires:
- owner approval
- canonical filename
- source dimensions
- transparent/opaque intent
- SHA-256 source lock
- accessibility role
- derivative/compression policy
- light/dark theme classification
- approved light-mode usage
- approved dark-mode usage
- explicit counterpart requirement when one source cannot satisfy both themes
- no silent creative alteration during optimization

## Current approved inventory

1. Primary FaceBai horizontal logo — **APPROVED / LOCKED / LIGHT-SURFACE PRIMARY**
2. Primary tropical background — **APPROVED / LOCKED / LIGHT-THEME ENVIRONMENT**

Next required assets:
3. Compact FaceBai mark/favicon master — must qualify on both themes
4. Dark-surface FaceBai logo variant — required before dark-mode production qualification if canonical logo contrast is insufficient
