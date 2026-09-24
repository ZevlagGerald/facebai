# FaceBai F1 — Supabase Development Qualification

Status: **NOT YET QUALIFIED**

This document is for a dedicated **development** Supabase project only. Do not apply these steps to production until the owner explicitly authorizes production setup.

## 1. Project configuration

Required application environment variables:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=<development project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<development publishable key>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Cloudflare Turnstile site key>
```

Do not place Supabase service-role/secret keys in `NEXT_PUBLIC_*` variables or client code.

## 2. Database

Apply, in order:

```text
supabase/migrations/0001_auth_profiles.sql
```

Qualification queries must prove:

- `profiles` exists and has RLS enabled;
- `account_private` exists and has RLS enabled;
- authenticated users can read profiles;
- a user can update only their own profile;
- `account_private` is readable only by its owner;
- there is no public Data API update policy for DOB/legal-acceptance fields;
- direct signup attempts for users under 18 are rejected by the database trigger;
- signup without required legal-acceptance metadata is rejected;
- duplicate usernames cannot create a second profile.

## 3. Authentication

Keep email confirmation enabled for F1.

For SSR token-hash signup confirmation, set the Confirm signup email template link to:

```text
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

Password recovery uses Supabase's PKCE flow. `resetPasswordForEmail()` redirects to:

```text
<FaceBai origin>/auth/recover
```

`/auth/recover` exchanges the returned Auth Code for a cookie-backed recovery session and then redirects to `/auth/update-password`.

Set the development Site URL to the actual development application origin. Add explicit redirect URLs only for approved development/staging origins, including the recovery callback URL where required by Supabase configuration.

## 4. Turnstile

FaceBai delegates CAPTCHA verification to Supabase Auth.

- configure Cloudflare Turnstile in Supabase Auth CAPTCHA settings;
- store the Turnstile secret in Supabase's CAPTCHA configuration, not in browser-visible application variables;
- expose only the Turnstile site key to the Next.js app;
- registration, password login, and password-reset request submit `cf-turnstile-response` as the Supabase `captchaToken`;
- when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is configured, the FaceBai server action fails closed if the response token is missing.

Do not mark CAPTCHA as proven until real challenge tokens are accepted by the development Supabase project for signup, login, and password reset, and missing/invalid tokens are rejected.

## 5. Legal acceptance / private-beta age rule

Canonical F1 legal version:

```text
2026-09-24
```

Registration sends self-attested DOB and acceptance metadata, but the database trigger independently verifies:

- DOB exists;
- DOB is not younger than 18 for the current private beta;
- DOB is not earlier than 1900-01-01;
- Terms acceptance is true;
- Privacy Notice acceptance is true;
- legal version matches the F1 canonical version.

The database records server-generated acceptance timestamps in `account_private`.

This 18+ private-beta rule is an engineering/safety gate and does not replace legal review or a future production age-assurance design.

## 6. Live flow qualification

Before F1 can be merged/qualified, prove all of the following against the development project:

1. New 18+ user registers successfully.
2. Under-18 direct signup is rejected even if the web form is bypassed.
3. Missing legal acceptance is rejected even if the web form is bypassed.
4. Confirmation email arrives.
5. Confirmation link creates the cookie-backed SSR session.
6. Confirmed user reaches `/tambayan`.
7. Logout invalidates the local session and returns to `/login`.
8. Re-login succeeds.
9. Unauthenticated request to `/tambayan` redirects to login and preserves a safe local return path.
10. Auth proxy refresh preserves refreshed cookies across redirect responses.
11. Duplicate username signup cannot create a second profile.
12. User A cannot read User B's `account_private` row.
13. User A cannot update User B's `profiles` row.
14. Invalid/missing Turnstile token fails for signup, login, and password reset after CAPTCHA is enabled.
15. Forgot-password returns the same generic response whether or not an account exists.
16. Recovery email returns through `/auth/recover`, establishes a verified recovery session, and reaches `/auth/update-password`.
17. Password update succeeds only with a valid recovery/authenticated session and signs the user out afterward.
18. Old password no longer signs in after a successful reset; new password does.
19. Light and dark auth pages pass visual review with approved FaceBai assets.

Record evidence before changing status from **UNPROVEN** to **PROVEN**.
