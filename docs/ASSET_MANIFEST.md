# FaceBai Production Asset Manifest

Status: required before frontend fidelity qualification
Master visual authority: approved 2026-09-24 banana-leaf FaceBai dashboard

Assets are generated/approved individually. Do not bake important brand elements into one large screenshot.

## A0 — Core brand assets

1. `brand/facebai-logo-horizontal.svg`
   - primary wordmark + leaf accent
   - transparent background
   - dark-green master version
   - must remain readable at header size

2. `brand/facebai-logo-mark.svg`
   - compact standalone mark for favicon/mobile/app icon
   - original leaf/B motif; not Facebook-derived iconography

3. `brand/facebai-logo-horizontal-light.svg`
   - light variant for dark/photographic backgrounds

4. Favicons/app icons derived deterministically from approved logo mark:
   - favicon.ico
   - icon-192.png
   - icon-512.png
   - apple-touch-icon.png

## A1 — Banana-leaf environmental system

5. `decor/banana-leaf-corner-top-left.webp`
6. `decor/banana-leaf-corner-top-right.webp`
7. `decor/banana-leaf-corner-bottom-left.webp`
8. `decor/banana-leaf-corner-bottom-right.webp`
   - transparent PNG/WebP masters
   - decorative only; never interfere with readable content

9. `decor/banana-leaf-pattern.svg`
   - low-contrast repeatable pattern used for large empty areas
   - must tile seamlessly

10. `decor/paper-texture.webp`
   - extremely subtle cream organic texture; small repeatable tile

Prefer separate transparent leaf assets over a giant full-screen background so responsive layouts can reposition/hide decoration.

## A2 — Product illustration assets

11. `illustrations/welcome-bai.webp`
   - FaceBai-branded tropical welcome scene for registration/login
   - no UI text baked into art

12. `illustrations/empty-feed.webp`
13. `illustrations/empty-friends.webp`
14. `illustrations/empty-notifications.webp`
   - reusable empty states, same art direction

15. optional `mascot/banana-bai.svg|webp`
   - only if separately approved; not required for architecture

## A3 — Development fixtures

Seed avatars/post photos are development/test fixtures, not brand assets. Production UI must work with arbitrary user uploads.

Rules:
- fixtures live under `public/fixtures/` or seed storage
- never claim fixture identities are real users
- no production dependency on seed content

## Asset quality gates

Every production asset must have:
- owner approval
- final filename
- dimensions/viewBox
- transparent/opaque intent
- SHA-256 lock where raster master matters
- accessibility role (decorative vs meaningful)
- compression/output derivative policy

## Generation order

Generate/approve in this order:
1. primary FaceBai logo
2. compact logo mark
3. banana-leaf corner asset set
4. repeatable banana-leaf pattern
5. login/register illustration
6. empty-state illustration family

Do not generate decorative extras before these core assets are accepted.
