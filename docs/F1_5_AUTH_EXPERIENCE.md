# F1.5 — Auth Experience Hardening

Status: **IMPLEMENTATION IN PROGRESS / NOT PRODUCTION QUALIFIED**

Branch: `feature/f1-5-auth-experience`
Base: `feature/f1-auth-foundation` @ `ed0f47101f7430b874a4d72d09054807f2b89d5c`

## Visual authority — LOCKED

F1.5 does not define a new FaceBai visual language.

The exact owner-approved **FaceBai Tropical Social Dashboard** is the canonical product-composition authority:

- SHA-256: `bebb2eea80e150ee89ee42977482a2dcf3132ae78a054d43ba04186e7e9506a7`
- locked in `docs/DESIGN_LOCK.txt`

The exact owner-approved **FaceBai light/dark theme identity board** is the canonical theme/asset-treatment authority:

- dimensions: 1536 × 1024
- SHA-256: `7f0257a55ced1c95bb49998d6a172751f5a13cb45116eb776a7a3bec3a39bee1`
- locked in `docs/THEME_REFERENCE_LOCK.md`

The master dashboard governs composition, card treatment, spacing, green controls, cream surfaces, tropical environmental framing, and overall product character. The theme board governs light/dark logo behavior, tropical background treatment, palette relationships, and theme contrast.

Any auth mockup or UI-kit image generated after those locks is **NON-AUTHORITATIVE** unless the owner explicitly approves and hash-locks it. It must not replace the master dashboard or theme board as the source of truth.

## Goals

FaceBai authentication must behave like a production product rather than a collection of static forms. Every user action must expose progress, success, failure, and the next available action while remaining visually consistent with the approved FaceBai product system.

## Locked UX requirements

- Shared branded auth shell for register, login, verification, recovery, and password update.
- Visible asynchronous button states.
- Accessible information/success/warning/error status messages.
- Explicit Cloudflare Turnstile lifecycle with loading, ready, verified, expired, and error states.
- Actionable recovery from expired or invalid links.
- A dedicated email-confirmation success surface before entering Tambayan.
- Mobile and desktop layouts with light/dark theme support.
- Existing Supabase security behavior must remain unchanged unless separately authorized.
- Auth surfaces must use the dashboard's restrained cream/green card system rather than a separate glassmorphism or unrelated landing-page aesthetic.
- Copy may adapt to the auth task, but brand phrases must not overwrite or redefine approved FaceBai identity language.

## Turnstile requirements

- Explicit widget rendering for dynamic auth forms.
- Server-side validation remains authoritative through the existing Supabase Auth CAPTCHA integration.
- Submit stays blocked until the current widget has produced a token.
- Expired or failed verification visibly disables submission and offers retry.
- Tokens are never logged or shown in UI copy.

## Asset governance

Only owner-approved FaceBai production assets may be used for logos and tropical backgrounds. Do not redraw, recolor, synthesize, or crop reference boards into production assets.

Qualified sources already recovered and hash-verified during F1.5 review:

- canonical light logo source: `7868ed17554366092282102a603085c84a8a3c4b675ea4b88a46db6fa4b3300b`
- canonical dark logo source: `f25a1eead495e0aa85872539d254a58dccd9d428f95cb7a4acc3cb5bfd6d70ed`
- canonical compact mark source: `dcb34c5aff700f03d092ea698d57c055272bfc578b45dd78a2b1112eff8e599c`
- canonical light tropical background source: `6b23c95499d2e5fe3fff524931569a0792b0582f6435fc7df773e24a3b323c83`
- approved light-background WebP derivative: `8b0eb905015593f740e4e4942b23646feaf554ec0ba840d497cb8c44a5877152`

Required deployable paths currently referenced by the app:

- `public/brand/facebai-logo-light.png`
- `public/brand/facebai-logo-dark.png`
- `public/brand/facebai-background-light.webp`

A dark-mode development fallback may apply a neutral deep-forest scrim over the approved light background source. This does **not** qualify the final dark background. Final dark visual qualification still requires an isolated approved dark-theme background source or a separately owner-approved deterministic treatment. Cropping the theme board to manufacture that asset is prohibited.

## Qualification gate

F1.5 is not complete until all of the following pass on the hosted development environment:

1. Register: loading, validation, Turnstile, successful check-email transition.
2. Check email: resend states and current-link guidance.
3. Email confirmation: verification success page then Tambayan.
4. Login: loading/error/success states and protected redirect.
5. Forgot password: anti-enumeration success state and Turnstile lifecycle.
6. Recovery link: successful token exchange and actionable invalid/expired state.
7. Update password: loading/error/success and forced re-login.
8. Turnstile delayed-load, expiry, error, and retry scenarios.
9. Keyboard/focus/status-message accessibility.
10. Responsive light/dark visual review against the locked dashboard and theme board.
11. All approved production assets load successfully; no reference-board crops or synthetic substitutions exist.

No merge to the prior F1 branch, `main`, or production deployment occurs without owner review and approval.
