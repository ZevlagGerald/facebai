import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editPage = readFileSync(new URL("../app/ako/edit/page.tsx", import.meta.url), "utf8");
const profilePage = readFileSync(new URL("../app/ako/page.tsx", import.meta.url), "utf8");
const profileHero = readFileSync(new URL("../app/components/profile-hero.tsx", import.meta.url), "utf8");
const uploader = readFileSync(new URL("../app/components/profile-media-uploader.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/components/profile-surface.module.css", import.meta.url), "utf8");
const standard = readFileSync(new URL("../docs/FACEBAI_UI_PLACEMENT_STANDARD.md", import.meta.url), "utf8");

test("F2 GUI V2.3 makes profile editing a focused task instead of a social dashboard", () => {
  assert.doesNotMatch(editPage, /<SocialShell/);
  assert.match(editPage, /className=\{styles\.focusedDialog\}/);
  assert.match(css, /width: min\(680px, 100%\)/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.focusedDialog \{ min-height: 100vh/);
});

test("F2 GUI V2.3 progressively discloses one profile task at a time", () => {
  assert.match(editPage, /\?section=avatar/);
  assert.match(editPage, /\?section=cover/);
  assert.match(editPage, /\?section=bio/);
  assert.match(editPage, /\?section=details/);
  assert.match(editPage, /section === "avatar"/);
  assert.match(editPage, /section === "cover"/);
  assert.match(editPage, /section === "bio"/);
  assert.match(editPage, /section === "details"/);
});

test("F2 GUI V2.3 moves profile media editing to direct profile affordances", () => {
  assert.match(profilePage, /mediaEditHref="\/ako\/edit"/);
  assert.match(profileHero, /\?section=cover/);
  assert.match(profileHero, /\?section=avatar/);
  assert.match(profileHero, /SocialIcon name="camera"/);
});

test("focused media editors reuse the qualified uploader without duplicate heading chrome", () => {
  assert.match(editPage, /ProfileMediaUploader kind="avatar"[^\n]+compact/);
  assert.match(editPage, /ProfileMediaUploader kind="cover"[^\n]+compact/);
  assert.match(uploader, /compact = false/);
  assert.match(uploader, /!compact \?/);
});

test("FaceBai placement standard locks social, focused task, settings, and quick utility modes", () => {
  assert.match(standard, /### 1\. Social/);
  assert.match(standard, /### 2\. Focused task/);
  assert.match(standard, /### 3\. Settings/);
  assert.match(standard, /### 4\. Quick utility/);
  assert.match(standard, /Post creation \| Compact composer entry point -> focused creation task/);
});
