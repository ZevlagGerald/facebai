# FaceBai UI Placement Standard

Status: F2-GUI-V2.3 baseline

FaceBai uses Facebook as an interaction-architecture reference while preserving FaceBai branding, Bisaya-first terminology, tropical identity, and original icon/art treatment. This is a placement and simplicity standard, not a pixel copy of Facebook.

## Core rule

Choose the interface mode from the task before designing the screen. Do not apply the three-column social shell to every route.

## Four interface modes

### 1. Social
Use for browsing people and social content.

Examples: Tambayan, Profile, Mga Bai, Pundok.

Placement:
- persistent global navigation
- personal/context shortcuts on the left when desktop space supports them
- primary social content in the center
- optional contextual modules on the right
- mobile uses compact/bottom navigation rather than desktop rails

### 2. Focused task
Use when the user is performing one bounded action.

Examples: Edit profile, change profile photo, change cover, create/edit post, confirmation flows.

Placement:
- one centered dialog/surface on desktop
- full-screen sheet/surface on mobile
- no social left rail
- no contextual right rail
- show only controls needed for the current action
- secondary/advanced controls are one action deeper

### 3. Settings
Use for durable account or preference management.

Examples: profile details, privacy, security, notifications, language, appearance.

Placement:
- category navigation plus one settings content surface
- group related controls according to a user mental model
- warnings appear beside the setting they affect, not as permanent global cards
- consequential identity changes such as username belong here or in an equivalent dedicated details subflow

### 4. Quick utility
Use for brief, reversible utility actions.

Examples: language, account menu, notifications preview, theme control.

Placement:
- compact popover or small disclosure
- only one competing header popover open at a time
- no dedicated page unless the task grows beyond quick inspection/action

## Module placement matrix

| Module | FaceBai placement |
| --- | --- |
| Tambayan | Social: center feed, personal left rail, contextual right rail |
| Ako / profile | Social: cover/avatar identity first, tabs/content below |
| Edit profile | Focused task: centered editor; one profile area at a time |
| Avatar / cover | Direct camera affordance on profile; focused media editor after activation |
| Mga Bai | Social: friend/request filters plus primary friend content |
| Pundok | Social: group navigation plus group/feed content |
| Bai & Sell | Social/workspace: category/filter context plus listings |
| Hoy! | Quick utility for recent notifications; dedicated history only when needed |
| Search | Dedicated results workspace with filters and results |
| Photos | Profile/social content, not a permanent settings panel |
| Account | Quick utility from avatar/account control |
| Language | Quick utility dropdown |
| Appearance | Quick utility for simple theme toggle; Settings when options expand |
| Privacy / security | Settings |
| Post creation | Compact composer entry point -> focused creation task |
| Photo viewer | Focused immersive overlay/viewer |
| Messages | Compact conversation surface or dedicated messaging workspace when implemented |

## Simplicity rules

1. Primary content comes before explanation.
2. Avoid repeating the same label, helper, state, or technical constraint in adjacent UI.
3. Do not display implementation details unless they affect the user's decision.
4. Use icons plus labels for major navigation; do not rely on color alone.
5. Use progressive disclosure: common actions first, advanced controls one action deeper.
6. Keep warnings contextual. Example: the profile-URL consequence appears while editing username, not on every profile-edit screen.
7. Empty space is preferable to fake modules, fake counts, or duplicate helper cards.
8. Do not invent social activity to make layouts look populated.

## Profile-edit baseline

The profile remains a social surface. Avatar and cover editing are launched directly from camera affordances on those media areas. The general Edit profile action opens a focused menu containing profile photo, cover photo, bio, and public identity. Selecting one opens only that editor.

The existing media validation, owner-scoped storage paths, RLS, signed media URLs, and update behavior remain authoritative. This standard changes placement and disclosure, not data ownership or security.

## F3 composer rule

When F3 begins, Tambayan should expose a compact composer entry point. Activating it opens a focused post-creation task. Frequently used tools may be visible; advanced controls must not all be shown at once.

## Research basis

- Meta, “Making it Easier to Create, Discover, and Share Content on Facebook” (2025): cleaner navigation, reduced clutter, common creation tools forward, advanced tools secondary.
- Meta, “How We’re Making it Easier to Navigate Settings” (2021): fewer categories, clearer labels, related settings grouped according to user mental models.
- Facebook Help Center profile guidance: profile/cover media are treated as core profile identity assets and profile-picture thumbnails are reused throughout the social experience.
