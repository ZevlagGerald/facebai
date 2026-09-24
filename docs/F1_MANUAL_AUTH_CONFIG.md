# FaceBai F1 — Hosted Auth Manual Configuration

Status: **LIVE AUTH QUALIFICATION IN PROGRESS**

Scope: the dedicated `facebai-development` Supabase project only.

Do not apply these development settings to HelioRigs, CourtFeed, or a future FaceBai production project.

## A. URL Configuration

FaceBai's canonical public domain is:

```text
https://facebai.party
```

Do not point hosted Auth at the production root until the application is actually serving the required auth routes there.

For local F1 qualification, Supabase Dashboard → `facebai-development` → Authentication → URL Configuration:

```text
Site URL
http://localhost:3000

Redirect URLs
http://localhost:3000/**
```

The `/**` wildcard is development-only convenience.

For hosted development, the intended test origin is:

```text
https://dev.facebai.party
```

After a real FaceBai Worker deployment exists at that hostname, change the development project to:

```text
Site URL
https://dev.facebai.party

Redirect URLs
https://dev.facebai.party/auth/confirm
https://dev.facebai.party/auth/recover
http://localhost:3000/**
```

Production later uses `https://facebai.party` with explicit HTTPS redirect paths. No production-domain cutover is part of F1.

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

FaceBai currently calls `resetPasswordForEmail()` with `${NEXT_PUBLIC_SITE_URL}/auth/recover`.

The recovery endpoint exchanges the PKCE authorization code server-side and redirects to `/auth/update-password`.

The matching `/auth/recover` origin must be present in Supabase's redirect allow-list before hosted recovery testing.

## D. Transactional auth email transport

Canonical auth sending domain:

```text
auth.facebai.party
```

Status: **VERIFIED in Resend**.

Sending identity:

```text
FaceBai <no-reply@auth.facebai.party>
```

Resend sending DNS is present in Cloudflare and verified:

- DKIM: `resend._domainkey.auth.facebai.party`
- Return-path CNAME: `rsend.auth.facebai.party` → regional Resend target
- Sending CNAME: `send.auth.facebai.party` → Resend sending target
- both CNAME records remain DNS-only

A dedicated Resend API key named `FaceBai Supabase Auth` exists with sending-only access restricted to the FaceBai auth domain. The credential value must never be committed to Git or copied into documentation.

Supabase custom SMTP uses:

```text
Host: smtp.resend.com
Port: 465
Username: resend
Sender: FaceBai <no-reply@auth.facebai.party>
Password: Resend API key (secret; dashboard only)
```

The Confirm signup template is editable only after custom SMTP is configured in the hosted project.

## E. Cloudflare Turnstile

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

Before hosted testing on `dev.facebai.party`, add that hostname to the widget allow-list.

The Turnstile secret must never be committed to Git, placed in `NEXT_PUBLIC_*`, or copied into application source.

Supabase Dashboard → Authentication → Bot and Abuse Protection:

1. Enable CAPTCHA protection.
2. Select **Cloudflare Turnstile**.
3. Enter the secret belonging to the `FaceBai Auth` widget.
4. Save.

The frontend site key is already documented in `.env.example`.

## F. Local application environment

Create `.env.local` from `.env.example` and set the development publishable key locally:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://hxrrdwhttmkjluhcverb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<development publishable key>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFCdCcxwW8Jx02gI
```

A Supabase publishable key is intended for client applications, but FaceBai still keeps environment-specific values out of source history. Never substitute a Supabase secret/service-role key here.

## G. Cloudflare application deployment gate

FaceBai requires server actions, SSR cookie sessions, and route handlers, so it must not be deployed as a static Pages export.

Cloudflare's current recommended path for an existing Next.js 16 application is **vinext on Cloudflare Workers**. Before adopting it, F1 CI runs a pinned vinext compatibility check. Only after that check passes should the repository be migrated non-destructively and deployed to `dev.facebai.party`.

The root `facebai.party` stays reserved for the approved public release.

## H. Qualification order

After hosted configuration is complete, qualify in this order:

1. Prove the current Next.js application passes the Cloudflare vinext compatibility gate.
2. Deploy the qualified development build to `dev.facebai.party`.
3. Add `dev.facebai.party` to the Turnstile widget allow-list.
4. Set the development Supabase Site URL and explicit redirect URLs to the deployed HTTPS origin.
5. Render `/register` and prove Turnstile loads.
6. Register one valid 18+ test account.
7. Prove `profiles` and `account_private` were created for that Auth user.
8. Confirm the email and prove `/auth/confirm` creates the SSR cookie session.
9. Prove `/tambayan` loads only while authenticated.
10. Log out and prove `/tambayan` redirects to `/login`.
11. Re-login.
12. Exercise forgot-password → recovery email → `/auth/recover` → update password.
13. Prove the old password fails and the new password succeeds.
14. Create a second controlled test user and perform two-user RLS attack tests.
15. Test under-18, missing-legal-acceptance, and duplicate-username rejection through the supported Auth API/UI.
16. Prove missing/invalid Turnstile tokens fail for signup, password login, and password reset.
17. Review light and dark auth UI using only approved FaceBai assets.

Do not mark F1 qualified and do not merge PR #3 until the evidence above is recorded.
