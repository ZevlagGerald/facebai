# FaceBai

**FaceBai** is a Bisaya-first social community platform for **facebai.party**.

## Brand lock

The canonical visual direction is the owner-approved tropical banana-leaf master design dated **2026-09-24**. Its exact source-image SHA-256 is recorded in `docs/DESIGN_LOCK.txt`.

A repository-friendly visual preview is stored at:

`public/reference/facebai-master-design-preview.jpg`

The approved master design is a product authority, not a disposable mockup. New UI work must preserve its core visual language unless the owner explicitly approves a redesign.

## Current baseline

- Next.js 16.3.6
- React 19.3.0
- TypeScript
- App Router
- Supabase Auth + Postgres + RLS foundation
- Cloudflare Turnstile auth protection
- light/dark production brand assets
- Bisaya-first interface vocabulary

## Local development

Install dependencies:

```bash
npm install
```

On Windows/PowerShell, create the F1 development environment safely:

```powershell
PowerShell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-f1-local.ps1
```

The helper prompts only for the **development Supabase publishable key** and writes `.env.local`, which is gitignored. It does not request or write a Supabase secret/service-role key or the Turnstile secret.

Before exercising real signup/login flows, complete:

`docs/F1_MANUAL_AUTH_CONFIG.md`

Then start FaceBai:

```bash
npm run dev
```

Open `http://localhost:3000`.

Repository qualification gate:

```bash
npm test
npm run typecheck
npm run build
```

## Product direction

Initial FaceBai MVP is a social network with a familiar feed-driven interaction model, but an original FaceBai identity and UI. Planned product areas include profiles, posts, reactions, comments, follows/friends, groups/tambayan, stories, notifications, messaging, moderation and account controls.

## Governance

See [`GOVERNANCE.md`](./GOVERNANCE.md), [`docs/MASTER_DESIGN.md`](./docs/MASTER_DESIGN.md), and [`docs/F1_SUPABASE_SETUP.md`](./docs/F1_SUPABASE_SETUP.md) before changing UI architecture, brand direction, or the authentication/data-security baseline.
