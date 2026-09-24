# FaceBai F1 — Hosted Auth Manual Configuration

Status: **LIVE AUTH QUALIFICATION IN PROGRESS**

Scope: the dedicated `facebai-development` Supabase project and `facebai-development` Cloudflare Worker only.

Do not apply these development settings to HelioRigs, CourtFeed, the root `facebai.party` release, or a future FaceBai production Supabase project.

## A. Canonical domains

Public production domain, reserved and not cut over during F1:

```text
https://facebai.party
```

Hosted development origin:

```text
https://dev.facebai.party
```

`dev.facebai.party` is attached to the dedicated Cloudflare Worker `facebai-development`.

## B. Supabase Auth URL configuration — NEXT MANUAL GATE

Supabase Dashboard → `facebai-development` → Authentication → URL Configuration.

Set:

```text
Site URL
https://dev.facebai.party

Redirect URLs
https://dev.facebai.party/auth/confirm
https://dev.facebai.party/auth/recover
http://localhost:3000/**
```

The localhost wildcard is development-only convenience. Production later uses `https://facebai.party` with explicit HTTPS redirect paths.

## C. Confirm-signup email template

Supabase Dashboard → Authentication → Email Templates → Confirm signup.

The confirmation link must route through FaceBai's SSR verification endpoint:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirm your FaceBai account
</a>
```

F1 intentionally accepts only `type=email` at `/auth/confirm`.

Do not put access or refresh tokens into query parameters.

## D. Password recovery

FaceBai calls `resetPasswordForEmail()` with `${NEXT_PUBLIC_SITE_URL}/auth/recover`.

The recovery endpoint exchanges the PKCE authorization code server-side and redirects to `/auth/update-password`.

The hosted recovery URL must stay in Supabase's redirect allow-list.

## E. Transactional auth email transport

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

A dedicated Resend key named `FaceBai Supabase Auth` exists with sending-only access restricted to the FaceBai auth domain. Never commit or document the credential value.

Supabase custom SMTP:

```text
Host: smtp.resend.com
Port: 465
Username: resend
Sender: FaceBai <no-reply@auth.facebai.party>
Password: Resend API key (secret; dashboard only)
```

## F. Cloudflare Turnstile

Canonical widget:

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

The Turnstile secret must never be committed to Git, placed in `NEXT_PUBLIC_*`, or copied into source.

Supabase Dashboard → Authentication → Bot and Abuse Protection:

1. Enable CAPTCHA protection.
2. Select **Cloudflare Turnstile**.
3. Enter the secret belonging to the `FaceBai Auth` widget.
4. Save.

## G. Application environment

Hosted Cloudflare Builds currently supplies only these application variables:

```text
NEXT_PUBLIC_SITE_URL=https://dev.facebai.party
NEXT_PUBLIC_SUPABASE_URL=https://hxrrdwhttmkjluhcverb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<development publishable key>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFCdCcxwW8Jx02gI
```

`NODE_ENV` is intentionally not overridden in Cloudflare Builds. Setting it to `production` before `npm clean-install` caused npm to omit vinext/Vite development build dependencies during the first hosted build attempt.

Never substitute a Supabase secret/service-role key for the publishable key.

## H. Cloudflare deployment state

FaceBai requires server actions, SSR cookie sessions, and route handlers, so it is deployed as a Cloudflare Worker rather than a static Pages export.

Repository deployment branch:

```text
feature/f1-auth-foundation
```

Worker:

```text
Name: facebai-development
workers.dev: https://facebai-development.gerardogalvezofficial.workers.dev
Development custom domain: https://dev.facebai.party
Root production domain: NOT ATTACHED
```

Cloudflare Builds:

```text
Build command: npm run build:vinext
Deploy command: npx @vinext/cloudflare deploy
Root directory: /
Build caching: enabled
Excluded deployment-only paths: docs/**, *.md
```

Hosted build evidence:

- Build `5f3c1d39-bbd4-4b75-8f03-c7b8ca2076a5`: FAIL — `NODE_ENV=production` caused npm to omit devDependencies; no application version was promoted.
- Build `2089431a-8c0c-4edd-92ef-84a045b33029`: PASS — vinext build and Cloudflare deploy both completed successfully.
- `dev.facebai.party` was attached only after the successful build and has an issued Cloudflare certificate.
- `facebai.party` and `main` remain untouched.

The successful deploy exposed one configuration drift: Wrangler deployment disabled Worker observability because the setting was absent from `wrangler.jsonc`. Commit `8dc3c65f68a03ad557e7facbf154b8d0ebbdbbaf` adds persistent Workers Logs configuration. That follow-up deployment must pass before runtime-log qualification is treated as proven.

The Workers target uses Workers Cache only. F1 does not provision KV or Cloudflare Images.

## I. Local development environment

For local testing:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://hxrrdwhttmkjluhcverb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<development publishable key>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAFCdCcxwW8Jx02gI
```

Use `scripts/setup-f1-local.ps1` to create `.env.local` without writing service-role or Turnstile secrets.

## J. Qualification order

Infrastructure already proven:

1. Permanent Next.js + Workers CI gate passes.
2. Dedicated Workers Builds token exists.
3. Repository is connected to `facebai-development`.
4. Corrected vinext hosted build/deploy passes.
5. `dev.facebai.party` is attached to the development Worker.
6. Turnstile allow-list includes `dev.facebai.party`.

Remaining F1 qualification:

1. Finish the observability-preservation deployment and confirm Worker logs remain enabled.
2. Set the Supabase Site URL and redirect allow-list to `https://dev.facebai.party`.
3. Enable the `FaceBai Auth` Turnstile secret in Supabase Bot and Abuse Protection.
4. Open `/register` and prove the hosted UI and Turnstile widget render.
5. Register one valid 18+ controlled account.
6. Prove `profiles` and `account_private` were created for that Auth user.
7. Prove the Resend confirmation email arrives.
8. Confirm email and prove `/auth/confirm` creates the SSR cookie session.
9. Prove `/tambayan` loads only while authenticated.
10. Log out and prove `/tambayan` redirects to `/login`.
11. Re-login.
12. Exercise forgot-password → recovery email → `/auth/recover` → update password.
13. Prove the old password fails and the new password succeeds.
14. Create a second controlled test user and perform two-user RLS attack tests.
15. Test under-18, missing-legal-acceptance, and duplicate-username rejection through supported Auth flows.
16. Prove missing/invalid Turnstile tokens fail for signup, password login, and password reset.
17. Review light and dark auth UI using only approved FaceBai assets.

Do not mark F1 qualified and do not merge PR #3 until the remaining live evidence is recorded.
