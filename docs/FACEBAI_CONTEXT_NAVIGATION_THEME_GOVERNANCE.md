# FaceBai Context, Navigation & Theme Governance v1.0

Status: **OFFICIAL — NORMATIVE ANNEX**

Adopted by owner directive on 2026-09-25.

This document is a normative annex to `docs/FACEBAI_DESIGN_INTERACTION_GOVERNANCE.md`. It applies to profile editing, media selection, composers, lightweight creation/editing flows, account utilities, and future bounded social tasks.

Its purpose is to keep FaceBai feeling like one continuous social application rather than a collection of disconnected pages.

---

## 1. Authority

This annex inherits the authority hierarchy in `FACEBAI_DESIGN_INTERACTION_GOVERNANCE.md`.

Facebook is the primary reference for **interaction architecture, task placement, and context preservation**, not for proprietary artwork, exact trade dress, pixel-for-pixel layout, or branded assets.

FaceBai retains its own tropical banana-leaf identity, green/cream palette, original icons, localized voice, and product terminology.

---

## 2. Core rule: preserve user context

For bounded actions initiated from an existing social surface, FaceBai SHOULD keep the originating surface visible and preserve the user's place whenever technically reasonable.

Examples:
- choosing/changing profile photo;
- choosing/changing cover photo;
- editing bio;
- editing one small profile detail;
- creating a post from Tambayan;
- editing a post;
- viewing lightweight notification details;
- confirming a reversible account or content action.

These SHOULD normally open as an **in-context modal or sheet**, not as a visually unrelated full-page destination.

The user should feel that they are still on the profile/feed/content surface and temporarily performing a focused task.

---

## 3. Navigation budget

FaceBai must minimize unnecessary page transitions.

### Preferred hierarchy

1. **Inline** — very small reversible action that can safely happen in place.
2. **Popover/disclosure** — compact utility or small selection.
3. **Modal / task sheet** — bounded focused task that benefits from preserving the current social context.
4. **Dedicated route/page** — only when the task is large, durable, multi-section, independently navigable, or unsafe to compress into an overlay.

A new page MUST NOT be created merely because routing is technically convenient.

### Dedicated pages remain appropriate for

- full settings areas;
- privacy/security management;
- long forms;
- complex onboarding;
- moderation/admin workspaces;
- multi-step flows requiring durable progress;
- content surfaces users reasonably expect to bookmark/open directly;
- cases where accessibility, mobile keyboard behavior, or screen size makes an overlay unsuitable.

---

## 4. Route-backed modal rule

Where a task needs refresh safety, direct linking, browser history, or recovery, FaceBai SHOULD use a **route-backed modal** pattern.

Desired behavior:

- normal in-app activation opens the task over the current parent surface;
- the URL may reflect the task state when useful;
- browser Back closes the task and returns to the underlying context;
- Close returns to the invoking context without unnecessary full-page navigation;
- refresh/direct URL remains recoverable;
- direct access may render a standalone fallback only when there is no safe parent context to reconstruct.

For Next.js App Router, an intercepting/parallel-route implementation is an acceptable architecture when it preserves these guarantees.

The implementation mechanism is not itself the governance requirement; the user-visible behavior is.

---

## 5. Modal visual placement

Desktop bounded tasks SHOULD normally use:

- centered modal;
- clearly dimmed background context;
- compact header with title and close control;
- one primary task at a time;
- restrained width appropriate to the task rather than a full dashboard surface;
- internal scrolling only when content exceeds the viewport;
- no duplicate navigation rails inside the modal.

Mobile bounded tasks SHOULD normally use:

- full-screen or near-full-screen task sheet;
- persistent close/back affordance;
- keyboard-safe layout;
- preserved task state during temporary interruptions where practical.

FaceBai SHOULD visually communicate that the user has not left the parent social context.

---

## 6. Modal accessibility contract

A modal MUST:

- have an accessible name;
- move focus into the task appropriately;
- keep keyboard focus within the modal while modal;
- make background content inert/unavailable to interaction;
- support Escape to close when safe;
- contain a visible close or cancel control;
- return focus to the invoking control, or another logical workflow target, after close;
- avoid focus loss when validation/errors appear;
- remain usable at 200% zoom and supported mobile widths.

Prefer native `<dialog>` where it fits the implementation and browser-support requirements. A custom dialog is acceptable only when the same behavioral guarantees are tested.

---

## 7. Profile-photo chooser governance

The profile-photo flow should follow the familiar social-network mental model visible in current Facebook interaction patterns while remaining FaceBai-specific.

### Initial chooser

The profile surface opens a focused **Choose profile photo** task over the profile.

The chooser SHOULD prioritize:

1. **Upload photo** — primary action when the user wants a new image.
2. **Current/recent real uploads** — only when FaceBai actually has persisted user media to show.
3. Optional future real collections such as tagged/user photos only after those product modules genuinely exist.

Do NOT fabricate Suggested Photos, Uploads, Photos of You, counts, or thumbnails merely to reproduce Facebook's populated appearance.

### Upload progression

`CHOOSE -> VALIDATE -> PREVIEW/CROP (when implemented) -> UPLOAD -> VERIFY -> COMMIT -> SUCCESS`

On failure:

`... -> ERROR -> RETRY`

The previous valid profile photo MUST remain authoritative until the replacement has passed the complete storage/commit verification path.

### Success behavior

When replacement succeeds:

- update the visible profile image;
- provide concise transaction confirmation;
- close or advance the task naturally;
- preserve the user's underlying profile context;
- avoid redirecting through unrelated intermediate pages.

---

## 8. Theme is application state, not component state

Theme selection is a global application preference.

It MUST NOT depend on whether a ThemeToggle component happens to be mounted on the current route.

Every FaceBai route that participates in theming MUST resolve the intended theme independently and consistently.

### Required behavior

- a chosen Light/Dark preference persists across route changes;
- it persists across full browser refresh;
- focused tasks/modals inherit the same theme as the underlying application;
- direct navigation to a supported route preserves the stored preference;
- opening a modal must not change theme;
- closing a modal must not change theme;
- authentication and social surfaces must not disagree about the user's explicit theme choice;
- no route may silently reset an explicit user theme to Light.

---

## 9. First-paint / no-flash theme rule

Theme MUST be resolved early enough that users do not see an avoidable flash of the wrong color scheme during initial page load.

An implementation is qualified only when the correct explicit theme is applied **before or at first meaningful paint**, not later because a mounted client component eventually runs an effect.

Acceptable architectures include:

- server-readable persisted preference applied to the root `<html>` element;
- an intentionally tiny pre-hydration bootstrap that resolves stored preference before the themed UI is painted;
- a combination of server preference plus `prefers-color-scheme` fallback.

FaceBai SHOULD use the platform/system preference only when the user has not explicitly selected a theme.

The browser `color-scheme` hint should agree with the resolved application theme so native form controls, scrollbars, and browser-provided UI do not visually contradict the page.

---

## 10. Theme persistence source-of-truth rule

A user-selected theme needs a durable application-level source of truth.

Implementation SHOULD support server-visible persistence when server-rendered first paint depends on the selection.

A cookie is appropriate for server-readable Light/Dark preference. `localStorage` may be retained as a client mirror/backward-compatibility mechanism, but it MUST NOT be the only mechanism if doing so causes route-dependent theme initialization or wrong-theme first paint.

If multiple stores are used, their synchronization rules must be deterministic and tested.

---

## 11. System-theme fallback

If no explicit FaceBai theme preference exists:

- follow `prefers-color-scheme`;
- allow Light and Dark system preferences;
- do not persist a system-derived theme as an explicit user choice unless the product intentionally exposes a `System` option later.

If FaceBai later introduces `System` as a third appearance option, it must be represented explicitly and tested separately from Light/Dark.

---

## 12. Navigation history rules

In-context tasks MUST preserve predictable browser history.

### Close

Close should dismiss the current task and return to the exact logical parent context where possible.

### Back

Browser Back should normally dismiss the most recently opened overlay/task before leaving the parent page.

### Refresh

Refresh must preserve meaningful durable state:
- authenticated context;
- explicit theme;
- route-backed task when intentionally represented in the URL;
- saved data.

Unsaved meaningful form edits still follow the dirty-form governance rule.

### Deep links

If a nested task URL is opened directly and the original parent context cannot be reconstructed, render a safe standalone focused fallback rather than creating broken history or a blank backdrop.

---

## 13. Redirect minimization

Redirects are reserved for genuine navigation boundaries or security/session requirements.

Do not redirect solely to:

- refresh visible data;
- show a success message;
- switch from one small edit subsection to another;
- close a bounded task;
- expose a profile-photo picker;
- recover ordinary local UI state.

Prefer:

- local state transition;
- route interception;
- `router.refresh()` where server-rendered data must be refreshed;
- modal dismissal;
- optimistic/in-place update when correctness permits;
- toast/inline transaction confirmation.

Redirect remains appropriate for:

- authentication boundaries;
- authorization failure;
- canonical URL enforcement;
- genuinely different top-level destinations;
- unrecoverable route state.

---

## 14. Profile-edit placement rule

`/ako` remains the canonical owner profile context.

From `/ako`:

- avatar camera/edit -> profile-photo modal;
- cover camera/edit -> cover-photo modal;
- edit profile -> focused edit modal/menu;
- bio/details -> nested task within the same contextual edit experience where practical.

FaceBai SHOULD NOT make the user repeatedly traverse:

`Profile -> Edit page -> Section page -> Upload page -> Profile`

for ordinary single-field/profile-media work.

The intended experience is closer to:

`Profile -> contextual task -> done/close -> same Profile position`.

---

## 15. Error placement inside contextual tasks

Errors belong inside the task that caused them.

For upload/media failures:

- keep the modal open;
- preserve the previous valid image;
- show the error near the action/status area;
- offer Retry when safe;
- do not redirect to an error page;
- do not close the task automatically on failure;
- do not lose the selected file unless security/browser constraints require reselection.

Warnings about unavailable current media should not dominate the task more than the actionable recovery controls.

---

## 16. Motion for contextual tasks

Modal/sheet entrance and exit should use the existing FaceBai motion governance.

Recommended product behavior:

- restrained opacity/scale or opacity/translate transition;
- approximately 160-220 ms;
- background dim transition aligned with dialog entrance;
- no bouncing or spring-heavy motion for ordinary settings/profile tasks;
- `prefers-reduced-motion: reduce` removes nonessential transforms.

Motion must never delay access to the task or its close control.

---

## 17. Qualification matrix

A contextual modal/task is not qualified until these applicable cases pass:

### Theme
- Light open/close;
- Dark open/close;
- Dark refresh stays Dark;
- Light refresh stays Light;
- direct nested URL uses correct persisted theme;
- no wrong-theme first-paint flash within practical browser testing.

### Navigation
- open from parent;
- Close returns to parent;
- browser Back returns to parent;
- browser Forward can restore route-backed task when designed to do so;
- refresh is safe;
- direct URL fallback is safe;
- no unnecessary redirect chain.

### Modal behavior
- background visibly dimmed;
- background interaction blocked;
- focus enters dialog;
- Tab/Shift+Tab stay inside;
- Escape closes when safe;
- focus returns logically;
- close button has accessible name.

### Responsive
- wide desktop;
- laptop;
- tablet;
- compact width;
- mobile/full-screen sheet;
- mobile keyboard interaction when inputs exist.

### Localization
- Bisaya;
- Tagalog;
- English;
- long strings do not break header/actions.

### Failure
- validation error;
- 401/session expiry;
- 403;
- 413;
- 429;
- 5xx;
- timeout/offline;
- safe retry;
- duplicate activation blocked.

---

## 18. Automated guardrails

Browser qualification SHOULD include tests for:

- persisted theme before interactive task use;
- route navigation preserving theme;
- hard refresh preserving explicit theme;
- modal open/close/history behavior;
- focus containment and restoration;
- Escape behavior;
- background inertness;
- mobile sheet behavior;
- no duplicate upload submission;
- upload error stays in context;
- success returns/updates in context;
- representative Light/Dark screenshots.

Source/regex tests alone cannot prove these runtime behaviors.

---

## 19. Current FaceBai profile-edit migration target

The current standalone `/ako/edit` focused surface is an acceptable direct-route fallback, but it is **not the final preferred in-app interaction** for small profile tasks.

The target architecture is:

- `/ako` as visible parent context;
- route-backed contextual modal on desktop;
- task sheet/full-screen contextual surface on narrow mobile;
- standalone fallback for direct nested navigation when required;
- one task at a time;
- application-level theme persistence independent of local component mounting.

This migration must preserve existing profile validation, localization, upload verification, Supabase authorization/RLS boundaries, dirty-form protection, and governed success/error states.

---

## 20. Exception rule

A module may intentionally use a full page instead of a contextual modal only when there is a documented reason such as complexity, accessibility, security, long-form editing, or independently navigable information architecture.

Convenience for implementation is not sufficient justification.

Any material exception follows the main governance change-control process.
