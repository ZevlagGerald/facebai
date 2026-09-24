# F1 — FaceBai Auth Foundation

Status: implementation branch `feature/f1-auth-foundation`; not production deployed.

## Scope

This tranche establishes a real authentication-backed application foundation:

- Next.js 16 App Router
- Supabase SSR cookie sessions via `@supabase/ssr`
- Next.js 16 `proxy.ts` session refresh/protection
- email/password registration and login
- email-confirmation endpoint
- authenticated Tambayan route
- PostgreSQL profile + private account tables
- Row Level Security
- automatic profile bootstrap from verified registration metadata
- 18+ private-beta registration gate
- light/dark FaceBai auth UI using approved production asset paths

## Required environment

Copy `.env.example` to `.env.local` and provide a non-production Supabase project's URL and publishable key.

## Supabase configuration gate

Before testing email verification:

1. Set Site URL for the environment.
2. Add the environment's allowed redirect URL.
3. Configure the Confirm signup email template to send `TokenHash` to `/auth/confirm` using Supabase's SSR email-confirmation pattern.
4. Apply `supabase/migrations/0001_auth_profiles.sql` to a dedicated development project first.
5. Configure production SMTP before public release; Supabase's default mail service is for limited testing.

## Asset gate

Extract the approved FaceBai production asset bundle into `public/` so these paths exist:

- `/public/brand/facebai-logo-light.png`
- `/public/brand/facebai-logo-dark.png`
- `/public/brand/facebai-mark.png`
- `/public/brand/facebai-background-light.webp`
- `/public/brand/facebai-background-dark.webp`
- `/public/icons/...`

No CSS-drawn logo or banana-leaf background is allowed as a fallback.

## Security notes

- protected routes verify Supabase claims/user data; do not authorize from unverified cookie session objects
- private DOB is isolated from public profile data
- RLS is enabled from the first migration
- open redirects are rejected by requiring local `/...` paths
- Turnstile variables are reserved but enforcement remains a pre-public-release gate until keys are configured
- no production secrets belong in Git

## Explicitly not yet included

- posts/feed
- Bai/friend graph
- media uploads/R2
- notifications/realtime
- groups
- moderation console
- public production deployment
