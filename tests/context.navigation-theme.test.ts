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

test("theme persistence is application-level and resolved before themed body content", () => {
  assert.match(rootLayout, /cookieStore\.get\(THEME_COOKIE\)/);
  assert.match(rootLayout, /data-theme=\{explicitTheme \?\? undefined\}/);
  assert.match(rootLayout, /<head>[\s\S]*?THEME_BOOTSTRAP_SCRIPT[\s\S]*?<\/head>/);
  assert.match(themeConfig, /cookieTheme[\s\S]*?storedTheme[\s\S]*?prefers-color-scheme: dark/);
  assert.match(themeConfig, /root\.dataset\.theme = resolvedTheme/);
  assert.match(themeConfig, /document\.cookie = "facebai-theme="/);
  assert.match(themeToggle, /persistTheme\(next\)/);
  assert.match(themeToggle, /document\.cookie = `\$\{THEME_COOKIE\}=\$\{theme\}/);
});

test("owner profile opens bounded editing inside the visible profile context", () => {
  assert.match(profilePage, /parseEditMode\(params\.edit\)/);
  assert.match(profilePage, /<ProfileContextualEditor/);
  assert.match(profileHero, /avatarEditHref/);
  assert.match(profileHero, /coverEditHref/);
  assert.match(profileHero, /scroll=\{false\}/);
  assert.match(contextualEditor, /<GovernedDialog/);
  assert.match(contextualEditor, /router\.back\(\)/);
  assert.match(contextualEditor, /href="\/ako\?edit=avatar" replace scroll=\{false\}/);
  assert.match(contextualEditor, /href="\/ako\?edit=cover" replace scroll=\{false\}/);
  assert.match(contextualEditor, /href="\/ako\?edit=bio" replace scroll=\{false\}/);
  assert.match(contextualEditor, /href="\/ako\?edit=details" replace scroll=\{false\}/);
});

test("contextual editing preserves dirty-form and upload completion contracts", () => {
  assert.match(contextualEditor, /textDirty/);
  assert.match(contextualEditor, /profile\.discardTitle/);
  assert.match(contextualEditor, /<ProfileEditForm[\s\S]*?embedded[\s\S]*?onDirtyChange=\{setTextDirty\}[\s\S]*?onSaved=\{completeTask\}/);
  assert.match(editForm, /embedded = false/);
  assert.match(editForm, /onDirtyChange\?: \(dirty: boolean\) => void/);
  assert.match(editForm, /onSaved\?: \(\) => void/);
  assert.match(uploader, /onSuccess\?: \(\) => void/);
  assert.match(contextualEditor, /onSuccess=\{completeTask\}/);
  assert.match(contextualEditor, /router\.replace\("\/ako\?updated=1"/);
});
