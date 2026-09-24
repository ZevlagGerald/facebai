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
- Plain CSS design system for precise reproduction of the approved master design
- Bisaya-first interface vocabulary

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Product direction

Initial FaceBai MVP is a social network with a familiar feed-driven interaction model, but an original FaceBai identity and UI. Planned product areas include profiles, posts, reactions, comments, follows/friends, groups/tambayan, stories, notifications, messaging, moderation and account controls.

## Governance

See [`GOVERNANCE.md`](./GOVERNANCE.md) and [`docs/MASTER_DESIGN.md`](./docs/MASTER_DESIGN.md) before changing UI architecture or brand direction.
