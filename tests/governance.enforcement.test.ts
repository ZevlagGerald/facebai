import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("global governance motion tokens and reduced-motion guard are loaded", async () => {
  const [layout, css] = await Promise.all([
    source("app/layout.tsx"),
    source("app/governance.css"),
  ]);

  assert.match(layout, /import "\.\/governance\.css"/);
  assert.match(css, /--fb-motion-press:\s*90ms/);
  assert.match(css, /--fb-control-target:\s*44px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /transition-duration:\s*\.001ms\s*!important/);
});

test("governed button blocks duplicate pending activation and exposes state", async () => {
  const button = await source("app/components/governed-button.tsx");

  assert.match(button, /disabled \|\| pending/);
  assert.match(button, /disabled=\{blocked\}/);
  assert.match(button, /aria-busy=\{pending \|\| undefined\}/);
  assert.match(button, /data-facebai-action/);
  assert.match(button, /data-facebai-pending/);
  assert.match(button, /"aria-label": string/);
});

test("existing auth submit uses governed mutation behavior without replacing its locked presentation", async () => {
  const submit = await source("app/components/auth-submit-button.tsx");

  assert.match(submit, /GovernedButton/);
  assert.match(submit, /pending=\{pending\}/);
  assert.match(submit, /pendingLabel=\{pendingLabel\}/);
  assert.match(submit, /unstyled/);
  assert.match(submit, /data-auth-submit/);
});

test("inline status exposes durable assistive status semantics", async () => {
  const status = await source("app/components/inline-status.tsx");

  assert.match(status, /role = tone === "error" \? "alert" : "status"/);
  assert.match(status, /aria-live=\{tone === "error" \? "assertive" : "polite"\}/);
  assert.match(status, /aria-atomic="true"/);
});

test("dialog and disclosure foundations encode keyboard/modal semantics", async () => {
  const [dialog, disclosure] = await Promise.all([
    source("app/components/governed-dialog.tsx"),
    source("app/components/governed-disclosure.tsx"),
  ]);

  assert.match(dialog, /showModal\(\)/);
  assert.match(dialog, /aria-modal="true"/);
  assert.match(dialog, /onCancel=/);
  assert.match(dialog, /returnFocusRef/);
  assert.match(disclosure, /<details/);
  assert.match(disclosure, /name=\{name\}/);
  assert.match(disclosure, /<summary data-facebai-action>/);
});

test("CI includes pinned Playwright and axe browser governance gate", async () => {
  const workflow = await source(".github/workflows/ci.yml");
  const config = await source("playwright.config.mjs");
  const e2e = await source("e2e/governance.public.spec.mjs");

  assert.match(workflow, /browser-governance:/);
  assert.match(workflow, /@playwright\/test@1\.63\.0/);
  assert.match(workflow, /@axe-core\/playwright@4\.13\.0/);
  assert.match(workflow, /playwright install --with-deps chromium/);
  assert.match(config, /Desktop Chrome/);
  assert.match(config, /Pixel 7/);
  assert.match(e2e, /AxeBuilder/);
  assert.match(e2e, /serious/);
  assert.match(e2e, /critical/);
});
