# FaceBai Theme & Asset Adaptability Rules

Status: **CANONICAL PROJECT RULE**
Effective: **2026-09-24**
Applies to: all production UI, brand assets, decorative artwork, illustrations, icons, backgrounds and future generated assets.

## Objective

FaceBai must support both **light mode** and **dark mode** without degrading or cheaply approximating the approved banana-leaf brand identity.

Theme support is an asset-system requirement, not an afterthought.

## Core rule

Canonical approved artwork is immutable.

Do not use CSS filters, hue rotation, inversion, brightness hacks, opacity tricks, blend modes or arbitrary recoloring to manufacture a dark-mode or light-mode version of a locked brand asset.

If an approved asset does not read correctly on both themes, create a separate deliberate variant, review it visually, approve it, and record its hash/version before production use.

## Required theme states

Every meaningful production asset must be classified as one of the following:

1. **Theme-neutral** — the same exact asset may be used in light and dark mode without loss of readability or brand fidelity.
2. **Light-surface asset** — intended primarily for cream/light UI surfaces.
3. **Dark-surface asset** — separately designed/approved counterpart for dark UI surfaces.
4. **Decorative-only asset** — may be positioned/cropped differently per theme but must not convey required information.

The classification must be documented in the asset manifest or approved-asset record.

## Logo rules

### Primary logo

The approved green `FaceBai` wordmark is the canonical light-surface logo.

It may be used on light, cream or sufficiently pale photographic surfaces when contrast is adequate.

### Dark mode

A dedicated dark-surface/light-logo variant must be generated from the same FaceBai identity and separately owner-approved before it becomes canonical.

The dark-mode logo variant must preserve:
- the exact FaceBai identity and proportions;
- the banana-leaf emblem concept;
- the custom lettering silhouette;
- the leaf/sprout treatment;
- brand recognizability at small sizes.

It must not be created by `filter: invert()`, `hue-rotate()`, `brightness()` or other browser recoloring of the canonical logo.

### Logo mark / favicon

The compact FaceBai mark must be tested on both light and dark browser/application surfaces.

If one mark cannot satisfy both, maintain explicit `light` and `dark` mark variants and derive favicon/PWA outputs deterministically from the approved masters.

## Background rules

The approved sunlit tropical background is the canonical **light-theme environmental artwork**.

For dark mode:
- do not simply invert or heavily darken the canonical source with CSS filters;
- a theme-neutral crop/overlay is allowed only when the original artwork remains visually intact and readable content meets contrast requirements;
- if a true dark environmental background is needed, generate and approve a dedicated nighttime/deep-tropical FaceBai background as a separate source asset and hash-lock it.

CSS may provide a non-destructive scrim or surface layer between artwork and foreground UI for text readability, but it must not replace the artwork or alter its identity.

## UI surface rules

Theme tokens may control:
- page/surface colors;
- text colors;
- borders and dividers;
- shadows;
- focus rings;
- semantic status colors;
- translucent scrims behind content;
- card opacity where accessibility permits.

Theme tokens must not redraw or simulate the approved brand artwork.

## Contrast and accessibility

All text and interactive controls placed over FaceBai artwork must satisfy the project's accessibility contrast target in both themes.

Never sacrifice readability to preserve an exact crop. Reposition/crop decorative artwork or add a neutral scrim before changing the canonical artwork itself.

Meaningful icons must have theme-safe contrast. Decorative imagery should use empty alt text where appropriate; meaningful images require descriptive alternative text.

## Responsive behavior

Light/dark adaptability and responsive adaptability are separate concerns.

Approved assets may be:
- cropped;
- repositioned;
- scaled proportionally;
- hidden when purely decorative and space-constrained;
- served as optimized derivatives.

Do not stretch, distort, recolor, mirror without design intent, or independently rearrange internal parts of a locked logo/illustration.

## Asset acceptance checklist

Before any future asset is marked production-approved, record:
- canonical filename;
- source dimensions/viewBox;
- SHA-256 for raster source where applicable;
- role/purpose;
- transparency intent;
- theme classification;
- approved light-mode usage;
- approved dark-mode usage;
- whether a counterpart variant is required;
- responsive/cropping rules;
- accessibility role;
- derivative/compression policy.

## Current asset classification

### `facebai_tropical_leaf_logo.png`
- status: owner-approved and locked
- classification: **light-surface primary logo**
- light mode: approved
- dark mode: may be used only where contrast is visually verified; otherwise use a future separately approved dark-surface logo variant
- CSS recolor/filter fallback: **PROHIBITED**

### `sunlit_tropical_foliage_frame.png`
- status: owner-approved and locked
- classification: **light-theme environmental background**
- light mode: approved
- dark mode: non-destructive overlay/crop may be evaluated; a true dark-background counterpart requires separate generation and approval
- CSS inversion/recolor fallback: **PROHIBITED**

## Governance

Any new light/dark asset variant is a new governed production asset. It does not replace the original canonical asset unless the owner explicitly changes the authority record.

See also:
- `GOVERNANCE.md`
- `docs/APPROVED_ASSETS.md`
- `docs/MASTER_DESIGN.md`
