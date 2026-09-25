import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/tambayan/page.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/components/social-shell.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/tambayan/tambayan.module.css", import.meta.url), "utf8");
const wrangler = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");

test("F2 shell keeps unavailable social modules visibly marked as PUHON", () => {
  assert.match(shell, /label: "Mga Bai"[^\n]+badge: "PUHON"/);
  assert.match(shell, /label: "Pundok"[^\n]+badge: "PUHON"/);
  assert.match(shell, /label: "Bai & Sell"[^\n]+badge: "PUHON"/);
  assert.match(shell, /aria-label="Notifications, coming soon"/);
  assert.match(page, /aria-label="Notifications, coming soon"/);
  assert.match(page, /<span className=\{styles\.puhonBadge\}>PUHON<\/span>/);
});

test("F2 shell keeps logout semantically explicit and available on mobile", () => {
  assert.match(shell, /aria-label="Log out of FaceBai"/);
  assert.match(css, /\.noticeButton \{ display: none; \}/);
  assert.doesNotMatch(css, /\.noticeButton, \.logout \{ display: none; \}/);
  assert.match(css, /\.logout \{ min-height: 36px; padding: 7px 9px; font-size: 11px; \}/);
  assert.match(css, /\.logout:focus-visible/);
});

test("F2 shell retains the approved three-column desktop architecture and responsive gates", () => {
  assert.match(css, /grid-template-columns: 230px minmax\(0, 680px\) 300px/);
  assert.match(css, /@media \(max-width: 1220px\)/);
  assert.match(css, /@media \(max-width: 980px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /@media \(max-width: 430px\)/);
});

test("Cloudflare Preview configuration carries version metadata separately from production", () => {
  assert.match(wrangler, /"version_metadata"\s*:\s*\{\s*"binding"\s*:\s*"CF_VERSION_METADATA"\s*\}/s);
  assert.match(wrangler, /"previews"\s*:\s*\{\s*"version_metadata"\s*:\s*\{\s*"binding"\s*:\s*"CF_VERSION_METADATA"\s*\}\s*\}/s);
  assert.match(wrangler, /"preview_urls"\s*:\s*true/);
});
