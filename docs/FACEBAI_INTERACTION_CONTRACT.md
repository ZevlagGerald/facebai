# FaceBai Universal Interaction Contract

Status: **NORMATIVE ANNEX — candidate governance v1.0**

This document defines the required behavior of interactive FaceBai controls. It is subordinate to `FACEBAI_DESIGN_INTERACTION_GOVERNANCE_CANDIDATE.md` until official adoption.

## 1. Universal interaction contract

Every actionable control MUST define applicable behavior for:

| State | Required behavior |
| --- | --- |
| Idle | clearly actionable and correctly labelled |
| Hover | subtle pointer feedback when hover exists |
| Focus | visible keyboard focus; no focus suppression without replacement |
| Pressed | immediate activation feedback |
| Validating | invalid local input blocked before mutation where practical |
| Pending | action remains identifiable; duplicate mutation blocked |
| Success | state/result is visible when not otherwise self-evident |
| Error | actionable recovery guidance; no false success |
| Disabled | used only when action genuinely cannot occur |

For asynchronous mutations, the canonical state flow is:

`IDLE -> VALIDATING -> PENDING -> SUCCESS`

or

`IDLE -> VALIDATING -> PENDING -> ERROR -> RETRY`

## 2. Buttons

### Primary button
Use for the single dominant action in a focused context.

Rules:
- one clear verb or outcome;
- pending label should communicate work (`Saving...`, `Uploading...`);
- double activation blocked during pending mutation;
- focus remains stable unless navigation/dialog completion logically moves it;
- destructive actions do not use the normal positive primary treatment.

### Secondary button
Use for safe alternatives such as Cancel, Back, or less-prominent actions.

### Icon button
Rules:
- accessible name required;
- tooltip/title may supplement but not replace accessible name;
- target should be approximately 44 x 44 CSS px where practical;
- icon-only meaning must be conventional or otherwise discoverable.

### Disabled button
Do not use disabled state to hide required explanation. If users need to know why the action is unavailable, explain the reason contextually.

## 3. Links versus buttons

Use a link for navigation to a resource/route.
Use a button for an action that changes state, opens/closes UI, submits, or mutates data.

Do not use clickable non-semantic `div`/`span` elements for normal actions when native controls can express the behavior.

## 4. Pending and duplicate-submission guard

Any mutation that can be triggered repeatedly MUST guard against duplicate execution.

Client rules:
- disable or logically lock the same action while pending;
- retain an identifiable pending control rather than removing it abruptly;
- do not allow repeated click/Enter to create multiple equivalent requests.

Server rules:
- where duplicates could cause material harm (payments, orders, irreversible state, repeated records), use server-side idempotency/uniqueness/transaction safeguards as appropriate;
- never rely only on a disabled button for data integrity.

## 5. Local validation

Validate inexpensive, deterministic client-known constraints before network submission when practical:
- required fields;
- supported file type;
- file-size ceiling;
- length/format constraints.

Server validation remains authoritative.

Validation messages MUST:
- appear near the affected input/action;
- identify the problem;
- explain the correction where useful;
- not disappear before the user can understand them.

## 6. Operation feedback

### Local status
For current work: `Saving...`, `Uploading...`, `Sending...`.

### Completion status
For completed direct actions: `Saved`, `Profile photo updated`, `Post published`.

### Social notification
For later social events: Hoy!.

Do not send a Hoy! notification merely to compensate for missing inline confirmation.

## 7. Toasts

Toasts MAY be used for concise completion/low-risk informational feedback.

Rules:
- do not put the only copy of a blocking error in a disappearing toast;
- destructive/critical information needs durable context or a dialog;
- toast content must be accessible as a status message;
- do not stack noisy repetitive toasts for rapid equivalent actions;
- timeout duration must be long enough to perceive, and critical content should not auto-disappear.

## 8. Inline status

Use inline status for:
- form validation;
- upload progress/result;
- authentication/account failures;
- retryable module errors;
- content load failures.

Asynchronous status messages should be programmatically available to assistive technology without stealing focus unnecessarily.

## 9. Progress indicators

Use no spinner solely for very brief operations when immediate state change is enough.

When an operation takes long enough to be perceived as waiting:
- expose pending state;
- use an indeterminate indicator if progress is unknown;
- use determinate progress when reliable progress is available and useful;
- do not fabricate percentages.

For long-running work, provide cancellation only when cancellation is technically safe and meaningful.

## 10. Forms

A form MUST:
- provide visible labels;
- preserve valid entered values after recoverable errors;
- show contextual field errors;
- block duplicate submission;
- expose pending and completion states;
- distinguish helper copy from errors;
- avoid repeating the same explanation in adjacent panels.

### Dirty state
If meaningful unsaved edits exist and the user closes/navigates away:
- warn before discarding where losing work would be surprising;
- provide `Keep editing` and consequence-specific `Discard` actions.

No dirty changes -> no unnecessary confirmation.

## 11. Confirmations and destructive actions

Confirmation is based on consequence, not habit.

Examples:
- reaction: no confirmation;
- theme/language: no confirmation;
- replace profile picture: normally no confirmation if old state is safely preserved until replacement succeeds;
- discard unsaved post/profile work: confirmation when meaningful work exists;
- delete post/account or other high-impact data: explicit consequence confirmation.

Confirmation copy MUST name the action and consequence.

Preferred:
`Delete this post?` / `Cancel` / `Delete post`

Avoid:
`Are you sure?` / `No` / `Yes`

## 12. Dialog contract

A modal dialog MUST:
- have `role="dialog"` or appropriate native semantics;
- have an accessible name;
- be truly modal if marked modal;
- move focus into the dialog appropriately;
- trap/contain tab navigation while modal;
- make background content inert/unavailable;
- close with Escape unless doing so would be unsafe or ambiguous;
- have a visible close/cancel action;
- return focus to the invoking control or next logical location after close.

For destructive final steps, initial focus SHOULD favor the least-destructive action when appropriate.

## 13. Popover/disclosure contract

Popover/disclosure triggers MUST:
- be keyboard activatable;
- expose expanded/collapsed state;
- keep trigger and popup relationship understandable;
- close predictably;
- not leave overlapping competing header menus.

FaceBai header rule:
- Language, Account, future Hoy! preview, and future Messages preview belong to one exclusive header-popover group unless a module has an explicitly reviewed reason otherwise.

## 14. Upload contract

Upload sequence:

`SELECT -> VALIDATE -> PREVIEW (when useful) -> UPLOAD -> VERIFY/COMMIT -> SUCCESS`

or

`... -> ERROR -> RETRY`

Required guardrails:
- client-known type/size validation before upload where practical;
- server/storage validation remains authoritative;
- pending state is visible;
- duplicate upload activation blocked;
- existing valid asset remains if replacement fails;
- uploaded object must be owner-authorized before profile commit;
- replacement cleanup occurs only after the new asset is accepted;
- upload status is exposed accessibly.

## 15. Search/input contract

Search SHOULD define:
- idle;
- typing/debounce where relevant;
- loading;
- results;
- no results;
- error;
- clear/reset.

Do not show `No results` while a request is still loading.

## 16. Optimistic UI

Optimistic UI MAY be used for low-risk reversible actions such as reactions when the server contract supports reliable rollback.

Rules:
- never show optimistic success for actions where false success would be materially harmful;
- on server rejection, rollback visible state and explain failure if the change is user-significant;
- do not lose user input during rollback.

## 17. Keyboard contract

All important functionality MUST be keyboard operable.

At minimum:
- Tab/Shift+Tab follow logical order;
- Enter/Space activate buttons/disclosures according to semantics;
- Escape closes applicable popovers/dialogs;
- focus is always visibly locatable;
- focus does not jump unexpectedly after asynchronous updates.

## 18. Motion contract

Default interaction motion:
- press feedback: approximately 70-100 ms;
- hover/color changes: 120-160 ms;
- popover/disclosure: 120-160 ms;
- toast/status entrance: 160-200 ms;
- dialog/sheet: 160-220 ms.

These are FaceBai tokens, not Facebook implementation claims.

When `prefers-reduced-motion: reduce` is active:
- suppress nonessential translate/scale/slide/parallax animations;
- preserve state through immediate or low-motion visual changes;
- do not disable necessary functional feedback.

## 19. Localization contract

Every interaction state must be localizable, not only the idle label.

For each supported language, include applicable:
- idle text;
- pending text;
- validation errors;
- success text;
- error/retry text;
- confirmation title/body/actions;
- empty-state text.

No component is fully localized if only its default label is translated.

## 20. Failure contract

Every networked mutation must define behavior for applicable failures:

| Failure | Minimum UX behavior |
| --- | --- |
| Offline/network | retain work, explain, safe Retry |
| 401/session expired | safe reauthentication path; no false success |
| 403 | explain action is not permitted without leaking sensitive internals |
| 413 | explain file/payload size issue before retry |
| 429 | explain rate limit and prevent rapid retry loops |
| 5xx | retain recoverable work; Retry when safe |
| Timeout | explain uncertain/failed state; avoid blindly duplicating non-idempotent mutation |
| Validation | contextual correction guidance |

## 21. Qualification checklist for each new action

Before an action is accepted, answer:
- What is its semantic control type?
- What are idle/hover/focus/pressed states?
- What happens during pending work?
- Is duplicate activation blocked?
- What is the success state?
- What is the error state?
- What happens if auth expires?
- What happens on 429/5xx/offline/timeout where relevant?
- Does failure preserve valid user work?
- Does it work with keyboard only?
- Does reduced motion preserve usability?
- Does it work in Bisaya, Tagalog, and English?
- Does it remain usable at required responsive widths?
- Does backend authorization independently enforce the action?

An unanswered applicable item means the action is not yet qualified.
