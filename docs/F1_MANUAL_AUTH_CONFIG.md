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
- dev.facebai.party
- localhost
- 127.0.0.1
```

`dev.facebai.party` is already present in the widget allow-list.

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

The feature branch has been non-destructively migrated to Cloudflare's vinext Workers target. Permanent CI now proves all of the following on every feature/PR build:

- locked dependency install
- FaceBai auth/security tests
- strict TypeScript typecheck
- normal Next.js production build
- vinext compatibility check
- actual Cloudflare Workers production build

The generated target uses Workers Cache only. F1 does not provision a KV namespace or Cloudflare Images binding.

A dedicated modern Cloudflare Worker already exists:

```text
Worker: facebai-development
workers.dev: https://facebai-development.gerardogalvezofficial.workers.dev
Previews: enabled
Deployment: none yet
Custom domains: none yet
```

The private GitHub repository is also connected to Cloudflare Builds.

Current deployment blocker: the Cloudflare account has no Workers Builds API token/build token. The connected automation credential can manage Workers and Builds but is not authorized to mint Cloudflare account API tokens. Do not bypass that permission boundary.

One dashboard action is therefore required:

1. Cloudflare → Workers & Pages → `facebai-development`.
2. Settings → Builds → API token.
3. Create/select a build token for this development Worker, preferably named `FaceBai Development Builds`.
4. Keep the token secret in Cloudflare; never paste it into chat or commit it.

After the token exists, the connector can discover its UUID and continue the repository trigger, environment, deployment, smoke-test, and `dev.facebai.party` attachment automatically.

The root `facebai.party` stays reserved for the approved public release.

## H. Qualification order

After hosted configuration is complete, qualify in this order:

1. Keep the permanent Next.js + Workers CI gate green.
2. Create/select the Cloudflare Workers Builds token.
3. Deploy the qualified development build and smoke-test the Worker.
4. Attach `dev.facebai.party` only after the Worker deployment is healthy.
5. Set the development Supabase Site URL and explicit redirect URLs to the deployed HTTPS origin.
6. Render `/register` and prove Turnstile loads.
7. Register one valid 18+ test account.
8. Prove `profiles` and `account_private` were created for that Auth user.
9. Confirm the email and prove `/auth/confirm` creates the SSR cookie session.
10. Prove `/tambayan` loads only while authenticated.
11. Log out and prove `/tambayan` redirects to `/login`.
12. Re-login.
13. Exercise forgot-password → recovery email → `/auth/recover` → update password.
14. Prove the old password fails and the new password succeeds.
15. Create a second controlled test user and perform two-user RLS attack tests.
16. Test under-18, missing-legal-acceptance, and duplicate-username rejection through the supported Auth API/UI.
17. Prove missing/invalid Turnstile tokens fail for signup, password login, and password reset.
18. Review light and dark auth UI using only approved FaceBai assets.

Do not mark F1 qualified and do not merge PR #3 until the evidence above is recorded.
