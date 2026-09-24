# FaceBai F1 — Hosted Auth Manual Configuration

Status: **REQUIRED BEFORE LIVE AUTH QUALIFICATION**

Scope: the dedicated `facebai-development` Supabase project only.

Do not apply these development settings to HelioRigs, CourtFeed, or a future FaceBai production project.

## A. URL Configuration

Supabase Dashboard → `facebai-development` → Authentication → URL Configuration.

For local F1 qualification set:

```text
Site URL
http://localhost:3000

Redirect URLs
http://localhost:3000/**
```

The `/**` wildcard is development-only convenience. Production must use explicit HTTPS origins/paths rather than a broad wildcard.

Do not point the development project at `https://facebai.party` until a FaceBai production/staging deployment is explicitly authorized.

## B. Confirm-signup email template

Supabase Dashboard → Authentication → Email Templates → Confirm signup.

The confirmation link must route through FaceBai's SSR verification endpoint:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirm your FaceBai account
</a>
```

F1 intentionally accepts only `type=email` at `/auth/confirm`.

Do not use a template that puts access or refresh tokens into query parameters.

## C. Password recovery

No custom recovery token parsing is required in the template.

FaceBai calls `resetPasswordForEmail()` with:

```text
http://localhost:3000/auth/recover
```

for local development. Supabase's PKCE recovery flow returns an Auth Code to `/auth/recover`; FaceBai exchanges that code server-side and redirects to `/auth/update-password`.

The local redirect allow-list in section A must be present before testing recovery.

## D. Cloudflare Turnstile

Canonical development/auth widget:

```text
Name: FaceBai Auth
Mode: managed
Site key: 0x4AAAAAAFCdCcxwW8Jx02gI
Allowed hosts:
- facebai.party
- www.facebai.party
- localhost
- 127.0.0.1
```

The Turnstile secret must never be committed to Git, placed in `NEXT_PUBLIC_*`, or copied into application source.

Supabase Dashboard → Authentication → Bot and Abuse Protection:

1. Enable CAPTCHA protection.
2. Select **Cloudflare Turnstile**.
3. Enter the secret belonging to the `FaceBai Auth` widget.
4. Save.

The frontend site key is already documented in `.env.example`.

## E. Local application environment

Create `.env.local` from `.env.example` and set the development publishable key locally:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://hxrrdwhttmkjluhcverb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<development publishable key>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFCdCcxwW8Jx02gI
```

A Supabase publishable key is intended for client applications, but FaceBai still keeps environment-specific values out of source history. Never substitute a Supabase secret/service-role key here.

## F. Qualification order

After A–E are complete, qualify in this order:

1. Render `/register` and prove Turnstile loads on localhost.
2. Register one valid 18+ test account.
3. Prove `profiles` and `account_private` were created for that Auth user.
4. Confirm the email and prove `/auth/confirm` creates the SSR cookie session.
5. Prove `/tambayan` loads only while authenticated.
6. Log out and prove `/tambayan` redirects to `/login`.
7. Re-login.
8. Exercise forgot-password → recovery email → `/auth/recover` → update password.
9. Prove the old password fails and the new password succeeds.
10. Create a second controlled test user and perform two-user RLS attack tests.
11. Test under-18, missing-legal-acceptance, and duplicate-username rejection through the supported Auth API/UI.
12. Prove missing/invalid Turnstile tokens fail for signup, password login, and password reset.
13. Review light and dark auth UI using only approved FaceBai assets.

Do not mark F1 qualified and do not merge PR #3 until the evidence above is recorded.
