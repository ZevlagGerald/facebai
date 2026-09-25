import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const rootLayout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const themeConfig = readFileSync(new URL("../lib/theme/config.ts", import.meta.url), "utf8");
const themeToggle = readFileSync(new URL("../app/components/theme-toggle.tsx", import.meta.url), "utf8");
const profilePage = readFileSync(new URL("../app/ako/page.tsx", import.meta.url), "utf8");
const profileHero = readFileSync(new URL("../app/components/profile-hero.tsx", import.meta.url), "utf8");
const contextualEditor = readFileSync(new URL("../app/components/profile-contextual-editor.tsx", import.meta.url), "utf8");
const editForm = readFileSync(new URL("../app/components/profile-edit-form.tsx", import.meta.url), "utf8");
const uploader = readFileSync(new URL("../app/components/profile-media-uploader.tsx", import.meta.url), "utf8");
const dialog = readFileSync(new URL("../app/components/governed-dialog.tsx", import.meta.url), "utf8");

test("theme persistence is application-level and resolved before themed body content", () => {
  assert.match(rootLayout, /cookieStore\.get\(THEME_COOKIE\)/);
  assert.match(rootLayout, /data-theme=\{explicitTheme \?\? undefined\}/);
  assert.match(rootLayout, /<head>[\s\S]*?THEME_BOOTSTRAP_SCRIPT[\s\S]*?<\/head>/);
  assert.match(themeConfig, /cookieTheme[\s\S]*?storedTheme[\s\S]*?prefers-color-scheme: dark/);
  assert.match(themeConfig, /root\.dataset\.theme = resolvedTheme/);
  assert.match(themeConfig, /document\.cookie = "\$\{THEME_COOKIE\}=" \+ explicitTheme/);
  assert.match(themeToggle, /persistTheme\(next\)/);
  assert.match(themeToggle, /document\.cookie = `\$\{THEME_COOKIE\}=\$\{theme\}/);
});

test("owner media editing opens inside visible profile context and closes safely", () => {
  assert.match(profilePage, /parseEditMode\(params\.edit\)/);
  assert.match(profilePage, /value === "profile" \|\| value === "avatar" \|\| value === "cover"/);
  assert.match(profilePage, /<ProfileContextualEditor/);
  assert.match(profileHero, /avatarEditHref/);
  assert.match(profileHero, /coverEditHref/);
  assert.match(profileHero, /scroll=\{false\}/);
  assert.match(contextualEditor, /<GovernedDialog/);
  assert.match(contextualEditor, /router\.replace\("\/ako", \{ scroll: false \}\)/);
  assert.match(contextualEditor, /href="\/ako\?edit=avatar" replace scroll=\{false\}/);
  assert.match(contextualEditor, /href="\/ako\?edit=cover" replace scroll=\{false\}/);
  assert.match(dialog, /returnFocusRef\.current\?\.isConnected/);
});

test("meaningful text edits retain the standalone dirty-boundary fallback", () => {
  assert.match(contextualEditor, /href="\/ako\/edit\?section=bio" data-facebai-dirty-boundary/);
  assert.match(contextualEditor, /href="\/ako\/edit\?section=details" data-facebai-dirty-boundary/);
  assert.doesNotMatch(contextualEditor, /href="\/ako\?edit=bio"/);
  assert.doesNotMatch(contextualEditor, /href="\/ako\?edit=details"/);
  assert.match(editForm, /beforeunload/);
  assert.match(editForm, /profile\.discardTitle/);
});

test("contextual media completion returns to profile without a full-page redirect", () => {
  assert.match(uploader, /onSuccess\?: \(\) => void/);
  assert.match(contextualEditor, /onSuccess=\{completeTask\}/);
  assert.match(contextualEditor, /router\.replace\("\/ako\?updated=1"/);
});
