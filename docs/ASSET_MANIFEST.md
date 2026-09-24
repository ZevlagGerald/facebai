# FaceBai Production Asset Manifest

Status: active
Master visual authority: owner-approved 2026-09-24 banana-leaf FaceBai dashboard

Production assets are generated and owner-approved individually. Important brand elements must never be replaced by cheap CSS approximations or redrawn substitutes.

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

Do not vector-redraw this asset by eye and call the redraw equivalent. Any future SVG must be produced and reviewed as an explicit derivative before it becomes canonical.

### A0.2 Compact mark — PENDING

Required for:
- favicon
- mobile navigation
- PWA/app icon
- compact FaceBai surfaces

Must be separately generated and owner-approved. It should derive from the accepted FaceBai visual identity without simply shrinking the full wordmark until it becomes unreadable.

### A0.3 Light logo variant — PENDING

Only create if a real dark/photographic UI use case requires it.

### A0.4 Icon package — PENDING A0.2

Derive deterministically after compact mark approval:
- favicon.ico
- icon-192.png
- icon-512.png
- apple-touch-icon.png

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

The artwork itself must be used. CSS may position, crop, shade, blur, fade or responsively contain it, but CSS must not replace the illustration.

### A1.2 Supplemental transparent leaf assets — PENDING / ONLY AS NEEDED

Separate corner/edge assets may still be generated later for responsive dashboard decoration where the full background is inappropriate. They must visually match the locked primary background and master design.

### A1.3 Organic paper/cream texture — PENDING / OPTIONAL

Only create if visual qualification shows the UI needs it. Do not manufacture decorative assets merely to fill the manifest.

## A2 — Product illustration assets

Pending after core UI/auth requirements prove the need:
- registration/onboarding supporting illustration, if the locked tropical background alone is insufficient
- empty feed
- empty Bai/friends
- empty notifications
- moderation/error empty states

All must match the approved art direction and be separately reviewed.

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
- no silent creative alteration during optimization

## Current approved inventory

1. Primary FaceBai horizontal logo — **APPROVED / LOCKED**
2. Primary tropical background — **APPROVED / LOCKED**

Next required asset:
3. Compact FaceBai mark/favicon master
