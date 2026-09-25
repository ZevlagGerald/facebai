# FaceBai Design & Interaction Governance v1.0

Status: **OFFICIAL — v1.0**

This document is the official product-interface governance for FaceBai, adopted by owner approval on 2026-09-25. It is normative under root `GOVERNANCE.md` and applies to all user-facing FaceBai modules unless a higher-authority owner directive or locked project rule explicitly overrides it.

## 1. Purpose

FaceBai must behave like one coherent product. A module is not qualified merely because it looks correct or its happy path works. Every user-facing surface must have predictable placement, feedback, motion, failure recovery, accessibility, localization, responsive behavior, and security boundaries.

This governance exists to prevent:
- dashboard-like information overload;
- silent buttons and stale pages;
- inconsistent loading/error/success behavior;
- duplicate submissions and ambiguous state;
- each module inventing its own interaction language;
- accessibility regressions;
- fake content or fake state used to make a screen look complete;
- copying Facebook logos, proprietary artwork, or exact trade dress.

## 2. Authority and hierarchy

The owner remains the final authority.

When documents conflict, use this order:
1. explicit owner directive;
2. root `GOVERNANCE.md`;
3. locked design/theme/asset references;
4. this official governance and its normative annexes;
5. `docs/FACEBAI_UI_PLACEMENT_STANDARD.md`;
6. `docs/F2_GUI_VOICE_STANDARD.md`;
7. module-specific specifications and tests.

No lower-level document may silently override a higher-level authority.

## 3. Facebook reference rule

Facebook is the primary **interaction-architecture and placement reference** for FaceBai social experiences.

FaceBai may use familiar social-network mental models such as:
- a central feed;
- profile cover/avatar hierarchy;
- direct profile-media edit affordances;
- compact composer -> focused creation flow;
- header utilities for account/language/notifications;
- contextual side rails on large screens;
- focused dialogs/sheets for bounded tasks;
- category-based settings.

FaceBai MUST NOT copy Facebook logos, proprietary icon artwork, exact trade dress, screenshots, or pixel-for-pixel layouts. FaceBai keeps its tropical banana-leaf identity, original iconography, cream/green visual system, and Bisaya-first personality.

Research basis: Meta's 2025 Facebook redesign emphasizes cleaner navigation, reduced clutter, frequently used destinations, minimal-distraction creation flows, and advanced tools one action deeper.

## 4. Core product principles

Every module MUST follow these principles:

### 4.1 Simplicity before density
Show the primary task first. Secondary controls, explanations, and advanced options are progressively disclosed.

### 4.2 Visible system status
Every meaningful user action receives immediate acknowledgement. Network or server work must never appear silent.

### 4.3 One coherent interaction language
Buttons, dialogs, uploads, errors, menus, loading states, confirmations, and notifications behave consistently across modules.

### 4.4 Recoverability
Failure must preserve valid user work where practical and provide a clear recovery path.

### 4.5 Real state only
Do not fabricate posts, counts, friends, messages, listings, notifications, activity, or success states to make a page look populated.

### 4.6 Accessibility by default
WCAG 2.2 AA is the product target. Accessibility is a qualification gate, not post-launch cleanup.

### 4.7 Localization by default
All new user-facing copy MUST ship through the localization system for Bisaya, Tagalog, and English unless an explicitly reviewed exception exists.

### 4.8 Security and privacy are interaction concerns
Authentication, authorization, RLS, private media, destructive actions, and privacy consequences must be clear in the user experience as well as correct in backend enforcement.

## 5. Interface modes

Every screen MUST select an interface mode before implementation. See `FACEBAI_UI_PLACEMENT_STANDARD.md` for the placement matrix.

### Social
For browsing people/content: Tambayan, Profile, Mga Bai, Pundok.

### Focused task
For one bounded action: edit profile field, upload media, create/edit post, confirmation.

### Settings
For durable preferences/account management: profile details, privacy, security, notifications, language, appearance.

### Quick utility
For brief reversible actions: language, account, theme, notification preview.

Do not apply the three-column social shell to every route.

## 6. Universal action state machine

Every action that can trigger work MUST define applicable states from this contract:

`IDLE -> VALIDATING -> PENDING -> SUCCESS`

or

`IDLE -> VALIDATING -> PENDING -> ERROR -> RETRY`

Interactive presentation also includes `HOVER`, `FOCUS`, `PRESSED`, and when justified, `DISABLED`.

Rules:
- an action must acknowledge activation immediately;
- duplicate activation MUST be blocked while the same mutation is pending;
- pending state must remain visually identifiable;
- success must be communicated when the outcome is not otherwise self-evident;
- errors must explain recovery, not merely state that something failed;
- validation errors must be contextual to the affected field/action;
- server mutation actions SHOULD be idempotent where duplicate requests could cause material harm;
- failed mutations MUST NOT falsely display success;
- existing valid data should remain intact when replacement/update operations fail.

The detailed normative contract is in `docs/FACEBAI_INTERACTION_CONTRACT.md`.

## 7. Feedback taxonomy

FaceBai uses three feedback classes.

### Local operation feedback
Use for the task currently being performed: `Saving...`, `Uploading...`, `Sending...`.

### Transaction confirmation
Use after a completed direct user action when confirmation is useful: `Profile photo updated`, `Post published`.

### Social notification (Hoy!)
Use for events caused by other people or external social activity: reactions, replies, Bai requests, group activity.

Hoy! MUST NOT replace direct operation feedback.

## 8. Motion governance

Motion communicates hierarchy or state; it is not decoration.

FaceBai motion tokens are product decisions, not claims about Facebook's private implementation:
- press feedback: approximately 70-100 ms;
- hover/color transition: 120-160 ms;
- popover/disclosure: 120-160 ms;
- toast/status entrance: 160-200 ms;
- modal/sheet transition: 160-220 ms;
- avoid routine UI motion longer than approximately 220 ms.

Rules:
- avoid bouncing, pulsing, floating, or looping decorative motion in normal controls;
- animations must not delay access to the action/result;
- `prefers-reduced-motion: reduce` MUST suppress nonessential motion;
- color/opacity changes may remain when they do not create problematic motion and still preserve meaning.

## 9. Async and network guardrails

Every networked module MUST define behavior for applicable conditions:
- normal success;
- slow response;
- offline/network failure;
- expired authentication / 401;
- forbidden / 403;
- invalid input / 400-422;
- payload too large / 413;
- rate limit / 429;
- server failure / 5xx;
- timeout;
- duplicate/repeated activation.

Requirements:
- do not discard user-entered content on recoverable network failure;
- provide retry when retry is safe;
- do not retry destructive/non-idempotent work invisibly unless explicitly engineered as safe;
- block or coalesce duplicate submissions;
- distinguish empty, loading, and error states;
- authentication expiry should route the user to a safe reauthentication path without pretending the mutation succeeded.

## 10. Button and control governance

Every button/control MUST have:
- clear purpose;
- visible hover when pointer hover exists;
- visible keyboard focus;
- pressed feedback;
- accessible name;
- correct semantic element (`button`, `a`, input, disclosure, etc.);
- pending behavior when it starts asynchronous work;
- success/error behavior when applicable;
- touch target meeting WCAG 2.2 requirements, with FaceBai targeting approximately 44 x 44 CSS px where practical.

Color MUST NOT be the sole state indicator.

Disabled controls SHOULD be used only when an action genuinely cannot be taken. If users need to understand why an action is unavailable, provide contextual explanation rather than a silent disabled control.

## 11. Forms and validation

Forms MUST:
- use visible labels;
- show helper text only when it aids the current decision;
- show validation errors beside the relevant field;
- state how to fix an error;
- preserve entered data after recoverable failure;
- prevent double submission;
- communicate pending and completion states;
- protect unsaved meaningful work from accidental dismissal.

Dirty-form rule:
- if the user has made meaningful unsaved changes and attempts to leave/close, confirm discard;
- if nothing changed, close/navigate without unnecessary confirmation.

## 12. Destructive actions

Confirmation is proportional to consequence.

Low-risk reversible actions generally do not need confirmation.
High-risk or irreversible actions MUST use consequence-specific copy.

Avoid generic `Are you sure?` or `Yes / No` when a specific action name is clearer.

Preferred pattern:
- title: `Delete this post?`
- body: explain what disappears and whether recovery is possible;
- safe action: `Cancel`;
- destructive action: `Delete post`.

When safe and technically reliable, Undo may be preferable to interrupting users with frequent confirmations.

## 13. Dialog and focused-task governance

A genuine modal dialog MUST:
- have an accessible name;
- move focus into the dialog appropriately;
- contain keyboard focus while modal;
- make background content inert/unavailable;
- close with Escape when that is safe;
- provide a visible close/cancel control;
- return focus logically after close.

Desktop focused tasks SHOULD use a centered dialog/surface when context matters. Mobile SHOULD use a full-screen sheet/surface when space or keyboard use requires it.

Route-backed focused tasks are preferred when direct linking, refresh safety, browser navigation, and recovery are important.

## 14. Popover/disclosure governance

Header utilities (Language, Account, future Hoy!/Messages previews) MUST:
- expose expanded/collapsed state semantically;
- work with keyboard activation;
- close on repeated trigger activation;
- close on Escape where applicable;
- close on outside interaction when appropriate;
- be mutually exclusive when panels compete for the same header region;
- maintain logical focus order.

## 15. Upload governance

Upload flows MUST include:
1. file selection;
2. client-side type/size validation when possible;
3. preview when useful;
4. pending/upload status;
5. success or error result;
6. retry path when safe.

For replacement media:
- failure MUST preserve the previous valid asset;
- backend ownership/path checks remain authoritative;
- successful replacement cleanup must not delete the newly accepted asset;
- accessible live status is required for asynchronous state.

## 16. Loading, empty, error, and success states

Every module MUST define applicable states before implementation:
- Loading;
- Empty;
- Ready;
- Pending;
- Success;
- Error;
- Unauthorized;
- Unavailable/Coming Soon;
- Offline/timeout where relevant.

Rules:
- Loading must not look like Empty;
- Empty must not look like Error;
- Error must provide recovery or next action where possible;
- Coming Soon must never resemble a working feature;
- skeletons may be used only when they reduce layout shift and accurately represent expected content structure;
- do not use fake data as an empty-state substitute.

## 17. Notifications

Notification governance separates system feedback from social events.

Hoy! SHOULD include only relevant social/product events that users may reasonably want to revisit. Notification items SHOULD deep-link to the relevant context when available.

Avoid notification spam, duplicate events, fake unread counts, and using notifications to compensate for missing inline feedback.

## 18. Accessibility governance

FaceBai targets WCAG 2.2 AA.

Minimum requirements include:
- semantic controls and landmarks;
- programmatically determinable name/role/state;
- visible focus;
- keyboard-operable functionality;
- status messages exposed to assistive technology without unnecessary focus theft;
- sufficient text and UI contrast;
- WCAG 2.2 target-size requirements;
- reflow/responsive support;
- reduced-motion support;
- accessible dialog/disclosure semantics;
- no color-only meaning.

Automated accessibility checks are necessary but not sufficient; manual keyboard and assistive-technology-aware review remains part of qualification.

## 19. Localization governance

Supported UI locales:
- Bisaya/Cebuano (`ceb`) — default FaceBai product language;
- Tagalog (`tl`);
- English (`en`).

Rules:
- no new hard-coded user-facing strings in modules covered by localization;
- important states/errors/actions must be localized together with happy-path copy;
- layouts must tolerate longer translated text;
- critical security/privacy/legal/payment language prioritizes clarity over humor;
- legal translations require explicit review before being treated as authoritative.

## 20. Responsive governance

Major modules MUST be qualified at representative viewport classes:
- wide desktop: 1440-1920;
- laptop: approximately 1280;
- tablet: approximately 1024;
- compact/tablet: approximately 720;
- mobile: approximately 430;
- narrow mobile: approximately 360.

Responsive changes may alter placement while preserving task hierarchy and access to essential actions.

No important control may disappear merely because the viewport becomes smaller.

## 21. Theme governance

Every production screen supporting themes MUST remain usable in Light and Dark.

Brand green is an accent/semantic color, not a requirement to paint every surface green. Surface hierarchy must remain visually distinguishable in both themes.

Existing theme-asset rules and locked references remain authoritative.

## 22. Security and privacy governance

User-interface correctness never substitutes for backend enforcement.

Data-mutating modules MUST:
- enforce authorization server-side;
- rely on RLS/storage policies where applicable;
- avoid exposing private object paths/content beyond product requirements;
- validate ownership before update/delete;
- avoid trusting client-supplied identity/authorization claims;
- avoid secret disclosure in logs, UI, repository, or client bundles.

Security-sensitive errors SHOULD avoid leaking account existence or internal implementation details.

## 23. Qualification gates

A module is not qualified until all applicable gates pass:

1. **Visual Pass** — hierarchy, placement, theme, responsive behavior.
2. **Functional Pass** — expected happy paths work.
3. **Failure/Edge Pass** — invalid input, network/server/auth/rate-limit/duplicate-action behavior is handled.
4. **Accessibility Pass** — semantic, keyboard, focus, status, contrast, motion, target-size checks.
5. **Localization Pass** — Bisaya/Tagalog/English strings and layout behavior.
6. **Security/RLS Pass** — required for data/private-state modules.
7. **Deployment/Runtime Pass** — exact tested commit builds and runs in the intended environment.

Detailed evidence requirements are in `docs/FACEBAI_MODULE_QUALIFICATION_STANDARD.md`.

## 24. Evidence language

Reviews MUST distinguish:
- **PROVEN** — directly evidenced by test, source inspection, live runtime, or verified configuration;
- **UNPROVEN** — expected or designed but not yet demonstrated;
- **FAILED** — evidence contradicts the requirement;
- **NOT APPLICABLE** — requirement does not apply and the reason is documented.

Do not report designed behavior as proven runtime behavior.

## 25. Testing strategy

FaceBai SHOULD maintain a layered test strategy:
- unit tests for pure validation/state logic;
- component tests for reusable UI behavior;
- Playwright browser E2E for navigation, interaction, upload, auth-aware flows, and responsive behavior;
- axe-based automated accessibility scans plus manual keyboard checks;
- visual-regression screenshots for high-value surfaces;
- database/RLS/storage-policy tests for protected state;
- failure-injection tests for common network/server/auth cases;
- localization tests for all supported locales.

Automated tests must complement, not replace, authenticated visual/manual qualification where human perception is material.

## 26. Shared primitive rule

Repeated behavior SHOULD be centralized into governed primitives rather than reimplemented independently.

Recommended governed primitives:
- Button;
- IconButton;
- Popover/Disclosure;
- Dialog/ConfirmDialog;
- Toast/InlineStatus;
- Progress/Spinner;
- FormField;
- EmptyState;
- Skeleton;
- Upload control.

Shared primitives must not become over-generalized frameworks. Build only abstractions proven useful by multiple modules.

## 27. Change control and exceptions

A governance exception requires:
1. the exact rule being waived;
2. reason the standard interaction is unsuitable;
3. affected routes/components;
4. accessibility/security implications;
5. temporary or permanent status;
6. owner approval when the exception materially changes product behavior or design architecture.

Silent exceptions are prohibited.

Governance changes themselves MUST be versioned, reviewed, and reported as a bounded tranche. Material changes require explicit owner approval before becoming official.

## 28. Definition of Qualified

A module may be marked `QUALIFIED` only when:
- all applicable qualification gates pass;
- no known high-severity defect is being hidden by visual polish;
- PROVEN vs UNPROVEN evidence is documented;
- exact commit/environment is identified;
- unresolved limitations are recorded;
- no fake data/state was used to simulate completion.

`TECHNICAL PASS` is not equivalent to `QUALIFIED` when required visual/manual/runtime evidence remains outstanding.

## 29. Official status and versioning

This document is **Official FaceBai Design & Interaction Governance v1.0**, adopted by explicit owner approval on 2026-09-25.

Rules:
1. future material governance changes must be reviewed as a bounded tranche;
2. material changes require explicit owner approval before they become authoritative;
3. material revisions increment the governance version;
4. subordinate standards and module specifications may not silently weaken this governance;
5. adoption or revision of this governance does not authorize a `main` merge, production deployment, DNS/routes changes, secret changes, or production database mutation unless separately approved under root governance.

## 30. Research references

This governance was reviewed against:
- Meta, "Making it Easier to Create, Discover, and Share Content on Facebook" (2025): https://about.fb.com/news/2025/12/making-it-easier-to-create-discover-and-share-content-on-facebook/
- W3C WCAG 2.2: https://www.w3.org/TR/wcag/
- WAI-ARIA APG Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA APG Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- W3C C39 reduced-motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- Playwright accessibility testing guidance: https://playwright.dev/docs/accessibility-testing
- Nielsen Norman Group confirmation-dialog guidance: https://www.nngroup.com/articles/confirmation-dialog/

These sources inform interaction and accessibility principles. FaceBai-specific timings, tokens, terminology, layout rules, and qualification gates are FaceBai product decisions, not claims about Facebook's private implementation.
