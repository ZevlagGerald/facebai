# FaceBai Production Roadmap

This roadmap supersedes a static-mockup-first interpretation of M1. The approved UI remains the visual target, but implementation proceeds as a functioning social product.

## F0 — Architecture and governance
Status: IN PROGRESS
- production architecture
- data model
- security/privacy baseline
- asset manifest
- environment boundaries
- release gates

Exit: owner accepts the architecture baseline.

## A0 — Brand asset lock
- primary logo
- compact logo mark
- banana-leaf decoration set
- repeatable pattern/texture
- login/register illustration
- asset hashes and usage rules

Exit: owner approves production assets individually.

## F1 — Application foundation
- Next.js 16 + TypeScript
- Cloudflare Workers compatibility using current recommended Next.js adapter path
- CSS/design tokens from master design
- real responsive shell using approved assets
- error/not-found/loading states
- lint/typecheck/unit/build CI

Exit: local + CI build pass and master-layout visual review passes.

## F2 — Auth and onboarding
- Supabase project/environment config
- migrations + generated DB types
- register
- email verification
- login/logout
- password recovery
- protected routes
- session refresh/revocation
- Turnstile
- adult-beta age gate/assurance flow
- privacy/terms/community-standards acceptance records

Exit: auth security tests and two-account isolation tests pass.

## F3 — Profiles and Bai graph
- public/private profile fields
- avatar/cover media
- username rules
- Add Bai request/accept/decline/cancel
- block/mute
- profile privacy
- people search

Exit: RLS and relationship-state tests pass.

## F4 — Posts and media
- create/edit/delete posts
- visibility controls
- R2 direct upload authorization
- Cloudflare image delivery/transformations
- multi-image posts
- post permalinks
- save posts

Exit: upload abuse tests, access-control tests and media lifecycle tests pass.

## F5 — Feed, reactions and comments
- chronological authorized Tambayan feed
- cursor pagination
- reactions
- comments/replies
- realtime update signals
- optimistic UI with durable rollback/error handling

Exit: multi-user end-to-end feed tests pass; blocked/private content cannot leak.

## F6 — Notifications and stories
- notifications
- read/unread state
- Isturya/story uploads
- expiry handling
- realtime signals

Exit: expiry, visibility and notification authorization tests pass.

## F7 — Groups/Tambayan communities
- create group
- join/request
- roles
- group posts
- moderation controls

Exit: membership/role authorization matrix passes.

## F8 — Safety/moderation/admin
- report user/post/comment/group
- moderation queue
- remove/suspend actions
- admin audit log
- user appeals/contact path
- rate limits/abuse controls

Exit: public beta cannot start before this gate.

## F9 — Privacy/legal readiness
- final privacy notice
- terms
- community standards
- DPO/PIC operational ownership
- data inventory/retention schedule
- NPC registration/compliance assessment
- data-subject request workflow
- account export/delete
- breach response runbook

Exit: owner/legal/privacy signoff before broad public launch.

## F10 — Staging and production launch
- isolated staging qualification
- performance/load tests
- backup/recovery checks
- monitoring/error alerting
- Cloudflare production configuration
- facebai.party cutover only with explicit owner approval

## Deferred
Do not build these before the core graph/feed/moderation system is stable:
- Marketplace
- Events
- chat/messaging
- video-first uploads
- algorithmic recommendation feed
- ads/monetization
- native mobile apps

They are product extensions, not prerequisites for the first credible FaceBai release.
