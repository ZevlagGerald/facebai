# F1.5 — Auth Experience Hardening

Status: **IMPLEMENTATION IN PROGRESS / NOT PRODUCTION QUALIFIED**

Branch: `feature/f1-5-auth-experience`
Base: `feature/f1-auth-foundation` @ `ed0f47101f7430b874a4d72d09054807f2b89d5c`

## Goals

FaceBai authentication must behave like a production product rather than a collection of static forms. Every user action must expose progress, success, failure, and the next available action.

## Locked UX requirements

- Shared branded auth shell for register, login, verification, recovery, and password update.
- Visible asynchronous button states.
- Accessible information/success/warning/error status messages.
- Explicit Cloudflare Turnstile lifecycle with loading, ready, verified, expired, and error states.
- Actionable recovery from expired or invalid links.
- A dedicated email-confirmation success surface before entering Tambayan.
- Mobile and desktop layouts with light/dark theme support.
- Existing Supabase security behavior must remain unchanged unless separately authorized.

## Turnstile requirements

- Explicit widget rendering for dynamic auth forms.
- Server-side validation remains authoritative through the existing Supabase Auth CAPTCHA integration.
- Submit stays blocked until the current widget has produced a token.
- Expired or failed verification visibly disables submission and offers retry.
- Tokens are never logged or shown in UI copy.

## Asset governance

Only owner-approved FaceBai production assets may be used for logos and tropical backgrounds. Do not redraw, recolor, synthesize, or crop reference boards into production assets.

Required deployable paths:

- `public/brand/facebai-logo-light.png`
- `public/brand/facebai-logo-dark.png`
- `public/brand/facebai-background-light.webp`
- `public/brand/facebai-background-dark.webp`

The approved light/dark logo source hashes are already locked in `docs/APPROVED_ASSETS.md`. Background files must be isolated, qualified production assets before deployment.

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
10. Responsive light/dark visual review with all approved assets loading successfully.

No merge to the prior F1 branch, `main`, or production deployment occurs without owner review and approval.
