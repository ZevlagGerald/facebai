# Initial Architecture

This baseline intentionally starts frontend-first and does not yet lock a database/auth vendor.

## Phase 1 — UI shell

Implement and qualify the approved FaceBai master interface as responsive React components.

## Phase 2 — identity and accounts

Add authentication, profiles, privacy controls and account lifecycle.

## Phase 3 — social graph and publishing

Add posts, media, reactions, comments, follows/friends, feed ranking boundaries and groups/tambayan.

## Phase 4 — realtime/social utilities

Add notifications and messaging with abuse controls.

## Phase 5 — production hardening

Moderation, rate limiting, reporting, observability, backups, content policy, privacy/data controls and deployment qualification.

A backend/database choice should be made before Phase 2 based on expected scale, cost ceiling and Cloudflare integration requirements rather than being assumed in the UI tranche.
