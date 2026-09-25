import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/tambayan/page.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/components/social-shell.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/tambayan/tambayan.module.css", import.meta.url), "utf8");
const profilePage = readFileSync(new URL("../app/ako/page.tsx", import.meta.url), "utf8");
const editProfilePage = readFileSync(new URL("../app/ako/edit/page.tsx", import.meta.url), "utf8");
const wrangler = readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");

test("F2 GUI keeps primary navigation visible, labeled, localized, and state-honest", () => {
  assert.match(shell, /labelKey: "nav\.tambayan"[^\n]+icon: "home"[^\n]+href: "\/tambayan"/);
  assert.match(shell, /labelKey: "nav\.friends"[^\n]+comingSoon: true/);
  assert.match(shell, /labelKey: "nav\.groups"[^\n]+comingSoon: true/);
  assert.match(shell, /labelKey: "nav\.market"[^\n]+comingSoon: true/);
  assert.match(shell, /LanguageSwitcher locale=\{locale\}/);
  assert.match(shell, /t\("common\.notificationsComingSoon"\)/);
  assert.match(page, /t\("feed\.notificationsAria"\)/);
});

test("F2 GUI V2.1 uses separated social surfaces and distinct future-state semantics", () => {
  assert.match(css, /--social-canvas: #f5f2e9/);
  assert.match(css, /--social-surface: #fffdf8/);
  assert.match(css, /--social-puhon-bg: #fff1bd/);
  assert.match(css, /:global\(html\[data-theme='dark'\]\) \.shell/);
  assert.match(css, /--social-canvas: #111713/);
  assert.match(css, /--social-surface: #1d2721/);
  assert.match(css, /--social-surface-raised: #243028/);
  assert.doesNotMatch(css, /--social-canvas: #0b1f17/);
});

test("F2 GUI V2.1 composer communicates with icons and localized actions", () => {
  assert.match(page, /SocialIcon name="photo"/);
  assert.match(page, /SocialIcon name="friends"/);
  assert.match(page, /SocialIcon name="sparkles"/);
  assert.match(page, /className=\{styles\.composerState\}>\{t\("common\.puhon"\)\}/);
  assert.match(css, /\.composerActionIcon/);
});

test("F2 shell keeps logout accessible inside the account menu", () => {
  assert.match(shell, /className=\{styles\.accountMenu\}/);
  assert.match(shell, /aria-label=\{t\("nav\.logoutAria"\)\}/);
  assert.match(css, /\.accountPopover/);
  assert.match(css, /\.logout:focus-visible/);
});

test("F2 GUI retains three-column desktop architecture and engineered responsive gates", () => {
  assert.match(css, /grid-template-columns: 232px minmax\(0, 720px\) 320px/);
  assert.match(css, /@media \(max-width: 1280px\)/);
  assert.match(css, /@media \(max-width: 1080px\)/);
  assert.match(css, /@media \(max-width: 860px\)/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /grid-template-columns: repeat\(4, 1fr\)/);
});

test("F2 profile separates social identity from editing and keeps future content honest", () => {
  assert.match(profilePage, /actionHref="\/ako\/edit"/);
  assert.doesNotMatch(profilePage, /<form action=\{updateProfile\}/);
  assert.match(profilePage, /t\("profile\.postsAndFeed"\)/);
  assert.match(editProfilePage, /<form action=\{updateProfile\}/);
  assert.match(editProfilePage, /ProfileMediaUploader kind="avatar"/);
  assert.match(editProfilePage, /ProfileMediaUploader kind="cover"/);
});

test("Cloudflare Preview configuration carries version metadata separately from production", () => {
  assert.match(wrangler, /"version_metadata"\s*:\s*\{\s*"binding"\s*:\s*"CF_VERSION_METADATA"\s*\}/s);
  assert.match(wrangler, /"previews"\s*:\s*\{\s*"version_metadata"\s*:\s*\{\s*"binding"\s*:\s*"CF_VERSION_METADATA"\s*\}\s*\}/s);
  assert.match(wrangler, /"preview_urls"\s*:\s*true/);
});
