# FaceBai Module Qualification Standard

Status: **NORMATIVE ANNEX — official governance v1.0**

This document defines the evidence required before a FaceBai module may be called `QUALIFIED` under Official FaceBai Design & Interaction Governance v1.0.

## 1. Qualification principle

A module is not qualified because:
- it looks correct in one screenshot;
- its build succeeds;
- the happy path works once;
- a backend table exists;
- an automated test passes without runtime evidence.

Qualification is evidence-based and must distinguish PROVEN from UNPROVEN.

## 2. Required evidence language

Use exactly:
- **PROVEN** — directly evidenced by test, source inspection, runtime, or verified configuration;
- **UNPROVEN** — designed/expected but not demonstrated;
- **FAILED** — evidence contradicts requirement;
- **NOT APPLICABLE** — requirement does not apply and reason is documented.

## 3. Module state matrix

Before implementation, each module must classify every state below.

| State | Required question |
| --- | --- |
| Loading | What does the user see while initial data is unresolved? |
| Empty | What does a valid no-content state look like? |
| Ready | What is the normal usable state? |
| Pending | What changes while a user action is being processed? |
| Success | How is completion represented? |
| Error | What failed and how does the user recover? |
| Unauthorized | What happens if the user lacks access? |
| Unavailable | How is Coming Soon/disabled capability distinguished from error? |
| Offline/timeout | How is recoverable network uncertainty handled? |

A state may be NOT APPLICABLE only with a documented reason.

## 4. Qualification gates

### 4.1 Visual Pass
Prove:
- correct interface mode and placement;
- content hierarchy;
- spacing/typography/surface hierarchy;
- Light and Dark behavior where supported;
- no clipped/overlapping controls;
- no fake content/state;
- design remains FaceBai-branded rather than generic/Facebook-copy.

### 4.2 Functional Pass
Prove:
- expected navigation/actions work;
- form submission/state transitions work;
- buttons/links use correct semantics;
- duplicate action protection works for mutations;
- success results are reflected accurately.

### 4.3 Failure/Edge Pass
Prove applicable handling for:
- invalid input;
- double click/repeated Enter;
- expired auth / 401;
- forbidden / 403;
- payload too large / 413;
- rate limit / 429;
- 5xx;
- offline/network error;
- timeout;
- empty data;
- malformed/missing route parameters;
- replacement/update failure preserving prior valid state.

### 4.4 Accessibility Pass
Prove:
- semantic controls/landmarks;
- accessible names;
- keyboard-only completion;
- visible focus;
- dialog/popover focus behavior;
- programmatic state/status messages;
- contrast;
- target size/spacing;
- no color-only meaning;
- reduced-motion behavior;
- responsive reflow.

### 4.5 Localization Pass
Prove:
- Bisaya (`ceb`);
- Tagalog (`tl`);
- English (`en`);
- no missing translation key;
- longer strings do not break layout;
- errors/pending/success/confirmation states are translated, not only static labels.

### 4.6 Security/RLS Pass
Required for private/data-mutating modules.

Prove as applicable:
- server-side auth/authorization;
- RLS/storage-policy enforcement;
- owner scoping;
- no privilege inferred from client-only state;
- no unauthorized read/list/update/delete;
- no secret exposure;
- safe error disclosure;
- idempotency/uniqueness/transaction protection where duplicate requests could be harmful.

### 4.7 Deployment/Runtime Pass
Prove:
- exact commit identified;
- CI/test checks green;
- intended Cloudflare build/deployment successful;
- runtime environment corresponds to tested code;
- no unauthorized `main`, production, DNS, secret, or backend mutation occurred during qualification.

## 5. Test pyramid

FaceBai should use the cheapest reliable test at each layer, then add browser/manual evidence where source-level tests cannot prove behavior.

| Layer | Purpose |
| --- | --- |
| Unit | pure validation, parsing, state helpers |
| Component | reusable control behavior and accessibility semantics |
| Integration | server actions/data boundaries/module cooperation |
| Browser E2E | real click/keyboard/navigation/upload/route behavior |
| Accessibility automation | detectable WCAG/ARIA issues (axe) |
| Manual accessibility | keyboard/focus/status/assistive-technology-aware review |
| Visual regression | high-value responsive/theme surfaces |
| RLS/storage tests | data authorization |
| Fault injection | 401/403/413/429/5xx/offline/timeout paths |

Playwright is the preferred browser-E2E foundation for FaceBai; `@axe-core/playwright` is the recommended automated accessibility integration. Automated accessibility scans do not replace manual testing.

## 6. Representative viewport matrix

High-value UI surfaces must be qualified against representative classes:

| Class | Width target |
| --- | ---: |
| Wide desktop | 1440-1920 px |
| Laptop | ~1280 px |
| Tablet | ~1024 px |
| Compact/tablet | ~720 px |
| Mobile | ~430 px |
| Narrow mobile | ~360 px |

Not every patch needs every screenshot, but the module must have automated/responsive evidence and final representative visual proof before qualification.

## 7. Theme matrix

Where theming is supported, each major module must prove:
- Light mode usable;
- Dark mode usable;
- focus/hover/error/success/disabled states remain distinguishable;
- surface hierarchy does not collapse;
- approved brand assets remain correct.

## 8. Localization matrix

At minimum, qualification must exercise:

| Locale | Requirement |
| --- | --- |
| `ceb` | canonical FaceBai voice and default UI |
| `tl` | functional parity and layout integrity |
| `en` | functional parity and layout integrity |

Automated tests should detect missing keys; browser/visual checks should cover string expansion on representative high-risk screens.

## 9. Button/action guardrail matrix

Every new action must document/test applicable items:

| Guardrail | Evidence |
| --- | --- |
| correct semantic control | source/component/browser |
| hover/focus/pressed | visual/browser |
| pending state | component/browser |
| duplicate activation blocked | component/E2E |
| success result | integration/E2E |
| validation error | unit/component/E2E |
| 401/session expiry | integration/E2E/fault injection |
| 403 | integration/fault injection |
| 413 | upload/action test |
| 429 | fault injection |
| 5xx | fault injection |
| offline/timeout | browser/fault injection |
| keyboard-only | manual/E2E |
| reduced motion | browser/manual |
| three locales | i18n/browser |
| responsive access | browser/visual |
| backend authorization | RLS/integration |

## 10. Dialog/popover qualification

Dialogs must prove:
- accessible label/title;
- focus enters appropriately;
- Tab/Shift+Tab remain within modal when modal;
- Escape closes when allowed;
- visible close/cancel exists;
- background is inert when marked modal;
- focus returns logically after close.

Popovers/disclosures must prove:
- keyboard activation;
- expanded state semantics;
- repeated trigger closes;
- Escape/outside interaction behavior where applicable;
- exclusive header menus do not overlap;
- focus order remains usable.

## 11. Upload qualification

For each upload module prove:
- accepted type handling;
- size limit handling;
- invalid type rejection;
- oversized rejection;
- pending state;
- duplicate upload guard;
- success state;
- failure preserves prior valid asset;
- retry works when safe;
- auth expiry behavior;
- owner-scoped backend verification;
- storage/RLS policy behavior;
- replacement cleanup safety;
- accessible status announcement.

## 12. Mutation safety

For actions that change data, qualification must answer:
- Is the mutation reversible?
- Can it be repeated safely?
- What happens if the client retries after uncertain network completion?
- Is idempotency/uniqueness required?
- What is preserved if the request fails midway?
- Is authorization enforced independently of the UI?

Materially harmful duplicate mutations cannot be considered qualified with client-side button disabling alone.

## 13. Empty-state qualification

Empty states must:
- clearly say no content exists;
- not resemble loading/error;
- provide a next step when a real next step exists;
- avoid fake sample activity unless explicitly presented as a non-production demo/example;
- not expose internal milestone language to normal end users unless intentionally part of beta communication.

## 14. Coming Soon qualification

A Coming Soon module must:
- be clearly non-functional;
- not display fake data/counts/state;
- use consistent PUHON/Coming Soon semantics;
- prevent controls from appearing live when they cannot complete;
- remain accessible and understandable in all supported locales.

## 15. Evidence package for tranche review

Every meaningful tranche report should include:
- tranche name/scope;
- exact branch/commit;
- changed files;
- migrations/config mutations if any;
- test results;
- deployment/runtime result;
- PROVEN items;
- UNPROVEN items;
- failures/known limitations;
- explicit statement that `main`/production/DNS/backend were or were not changed;
- requested owner decision when a governance gate requires approval.

## 16. Severity handling

Suggested qualification severity:

- **Critical** — security/privacy/data loss/unauthorized production mutation: STOP.
- **High** — core action broken, inaccessible critical flow, false success, destructive duplication: NOT QUALIFIED.
- **Medium** — significant usability/responsive/localization issue: repair before final qualification unless owner explicitly accepts bounded deferral.
- **Low** — polish/non-blocking inconsistency: may be documented for follow-up if it does not undermine the module contract.

Severity is based on user/product impact, not visual annoyance alone.

## 17. Qualification statuses

Use only:
- `PLANNED`
- `IMPLEMENTED / UNQUALIFIED`
- `TECHNICAL PASS / VISUAL QA PENDING`
- `QUALIFICATION BLOCKED`
- `QUALIFIED`
- `FROZEN` (only when owner/governance explicitly freezes a qualified baseline)

Do not call a module `QUALIFIED` while an applicable mandatory gate remains UNPROVEN.

## 18. Definition of FROZEN

A module may be marked `FROZEN` only when:
- it is already QUALIFIED;
- the owner or governing plan explicitly freezes it;
- future unrelated tranches must not reopen it without a demonstrated regression, dependency, security issue, or explicit owner direction.

Freeze does not prohibit urgent security/accessibility fixes; such changes require a bounded regression qualification.

## 19. Pre-merge / pre-production rule

Qualification on a feature/development environment does not authorize:
- merging to `main`;
- production deployment;
- DNS/routes changes;
- secret changes;
- production database mutation.

Those actions remain separately governed by root `GOVERNANCE.md` and explicit owner approval requirements.
