# FaceBai Production Architecture

Status: OWNER DIRECTION — production-grade social platform foundation
Date: 2026-09-24
Domain: facebai.party

## Objective

FaceBai is a real Bisaya-first social network, not a static UI demonstration. The approved banana-leaf master design remains the visual authority, but every primary screen must be backed by authenticated user state and persistent data.

## Locked initial stack

- Web application: Next.js 16 App Router + React 19 + TypeScript
- Cloud runtime/CDN: Cloudflare Workers, using Cloudflare's current recommended Next.js path (vinext) after compatibility qualification
- Database: Supabase managed PostgreSQL
- Authentication: Supabase Auth
- Authorization: PostgreSQL Row Level Security (RLS) plus server-side authorization checks
- Realtime: Supabase Realtime Broadcast for notifications and later messaging/presence
- User media: Cloudflare R2
- Image delivery: Cloudflare Images transformations over R2 originals
- Bot protection: Cloudflare Turnstile on registration, login-risk flows, password recovery and abuse-sensitive forms
- Search: PostgreSQL Full Text Search + GIN indexes initially; dedicated search service only when evidence requires it
- Source/CI: GitHub; PR-based changes; lint/typecheck/test/build required before merge

## Trust boundaries

Browser
  -> Cloudflare edge / FaceBai Next.js app
      -> Supabase Auth
      -> Supabase Postgres (RLS enforced)
      -> Supabase Realtime
      -> R2 media storage
      -> Cloudflare Images delivery

The browser never receives Supabase secret/service credentials or R2 administrative credentials.

## Application surfaces

Public:
- /
- /login
- /register
- /forgot-password
- /privacy
- /terms
- /community-standards
- /u/[username] for profiles permitted to be public
- public post permalinks where visibility permits

Authenticated:
- /home (Tambayan feed)
- /people (Mga Bai)
- /stories (Isturya)
- /groups
- /notifications
- /saved
- /settings
- /settings/privacy
- /settings/security
- /settings/account

Deferred until core social system is qualified:
- Marketplace
- Events
- direct/group messaging
- advanced recommendation ranking
- video-heavy features

Owner/admin:
- /admin/moderation
- /admin/reports
- /admin/users
- /admin/audit

Admin routes must use separate role checks and cannot rely on hidden navigation as access control.

## Authentication flow

Registration:
1. User supplies display name, unique username, verified email, password, date of birth/private age data, and accepts Terms/Privacy/Community Standards.
2. Turnstile token is verified.
3. Supabase Auth creates the identity and sends verification email.
4. A profile row is provisioned transactionally.
5. User cannot create public content until email verification completes.

Login:
1. Email/username entry resolves to an identity safely without leaking account existence.
2. Password is verified by Supabase Auth.
3. Session is maintained using secure server-compatible auth cookies.
4. Risk controls/rate limits apply to repeated failures.

Account lifecycle:
- email verification
- password recovery
- session revocation/logout
- password change with reauthentication
- data export request
- account deactivation
- account deletion with retention policy

## Feed design

MVP feed is intentionally understandable and privacy-conservative:
- own posts
- accepted Bai/friend posts
- public/group posts the user is authorized to see
- reverse chronological order
- cursor pagination by `(created_at, id)`
- blocked/muted users filtered at query level
- no opaque behavioral ranking in the first release

Do not implement a Facebook-scale fan-out architecture prematurely. Begin with indexed fan-out-on-read queries and measure. Introduce materialized/home-feed fan-out only when production telemetry demonstrates the need.

## Media pipeline

1. Authenticated client requests a short-lived upload authorization from FaceBai backend.
2. Backend validates identity, quota, intended MIME family and size policy.
3. Client uploads directly to R2 using the authorized object key.
4. Application records media metadata in Postgres only after upload validation.
5. Public delivery occurs through a controlled FaceBai media URL and Cloudflare image transformations.
6. Original upload keys are opaque UUID-based paths, never user filenames.

Initial uploads: JPEG, PNG, WebP only. Video is deferred until image moderation, storage and abuse controls are proven.

## Realtime

Use realtime selectively:
- notification badges
- newly accepted Bai requests
- reactions/comments on an open post
- later: chat, typing indicators, online presence

Do not stream the entire feed database to clients. Realtime signals an event; durable state remains in Postgres.

## Search

Phase 1 search targets:
- usernames/display names
- public posts
- groups

Use normalized searchable columns and GIN/appropriate indexes. Respect blocks, profile visibility and post visibility in search queries.

## Environments

- local: local app + Supabase local/dev project where possible
- staging: isolated Supabase project + isolated R2 prefix/bucket + staging Worker/domain
- production: isolated production resources for facebai.party

Never point local/staging code at production databases or production media buckets.

## Non-negotiable engineering rules

- No hard-coded fake users/posts in production paths except explicit development seed data.
- Every mutating operation performs server-side authorization.
- RLS enabled for every exposed application table.
- Schema changes are migration files committed to Git.
- User-generated content has report/block/delete pathways.
- Secrets stay server-side and in environment/secret stores.
- No direct merge to main without owner approval and qualification evidence.
