import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const localeAction = readFileSync(new URL("../app/actions/locale.ts", import.meta.url), "utf8");
const languageSwitcher = readFileSync(new URL("../app/components/language-switcher.tsx", import.meta.url), "utf8");
const localeOptionButton = readFileSync(new URL("../app/components/locale-option-button.tsx", import.meta.url), "utf8");
const themeToggle = readFileSync(new URL("../app/components/theme-toggle.tsx", import.meta.url), "utf8");
const rootLayout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const themeConfig = readFileSync(new URL("../lib/theme/config.ts", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/components/social-shell.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/tambayan/tambayan.module.css", import.meta.url), "utf8");
const profilePage = readFileSync(new URL("../app/ako/page.tsx", import.meta.url), "utf8");
const contextualEditor = readFileSync(new URL("../app/components/profile-contextual-editor.tsx", import.meta.url), "utf8");
const editProfilePage = readFileSync(new URL("../app/ako/edit/page.tsx", import.meta.url), "utf8");
const editProfileForm = readFileSync(new URL("../app/components/profile-edit-form.tsx", import.meta.url), "utf8");
const uploader = readFileSync(new URL("../app/components/profile-media-uploader.tsx", import.meta.url), "utf8");
const profileAction = readFileSync(new URL("../app/actions/profile.ts", import.meta.url), "utf8");
const media = readFileSync(new URL("../lib/profile/media.ts", import.meta.url), "utf8");
const interactionI18n = readFileSync(new URL("../lib/i18n/interaction.ts", import.meta.url), "utf8");

test("F2 final gate persists locale safely for one year across FaceBai routes", () => {
  assert.match(localeAction, /store\.set\(LOCALE_COOKIE, locale/);
  assert.match(localeAction, /path: "\/"/);
  assert.match(localeAction, /maxAge: 60 \* 60 \* 24 \* 365/);
  assert.match(localeAction, /sameSite: "lax"/);
  assert.match(localeAction, /secure: process\.env\.NODE_ENV === "production"/);
});

test("F2 final gate resolves theme globally before paint and persists explicit choice", () => {
  assert.match(rootLayout, /THEME_BOOTSTRAP_SCRIPT/);
  assert.match(rootLayout, /data-theme=\{explicitTheme \?\? undefined\}/);
  assert.match(rootLayout, /cookieStore\.get\(THEME_COOKIE\)/);
  assert.match(themeConfig, /THEME_COOKIE = "facebai-theme"/);
  assert.match(themeConfig, /localStorage\.getItem/);
  assert.match(themeConfig, /prefers-color-scheme: dark/);
  assert.match(themeToggle, /localStorage\.setItem\(THEME_STORAGE_KEY, theme\)/);
  assert.match(themeToggle, /document\.cookie = `\$\{THEME_COOKIE\}=\$\{theme\}/);
  assert.match(themeToggle, /getInteractionTranslations\(locale\)/);
  assert.match(themeToggle, /data-facebai-action|GovernedButton/);
});

test("F2 final gate keeps language and account disclosures mutually exclusive", () => {
  assert.match(languageSwitcher, /name=\{variant === "social" \? "facebai-header-menu" : undefined\}/);
  assert.match(shell, /<details className=\{styles\.accountMenu\} name="facebai-header-menu">/);
});

test("F2 final gate governs locale and logout mutations", () => {
  assert.match(localeOptionButton, /useFormStatus\(\)/);
  assert.match(localeOptionButton, /disabled=\{pending\}/);
  assert.match(localeOptionButton, /data-facebai-pending=\{pending \? "true" : "false"\}/);
  assert.match(shell, /<form action=\{logout\}>/);
  assert.match(shell, /AuthSubmitButton/);
  assert.match(shell, /pendingLabel=\{ti\("common\.loggingOut"\)\}/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.headerActions \{ grid-column: 2; grid-row: 1; \}/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*?\.accountPopover \{ width: min\(270px, calc\(100vw - 24px\)\); right: -2px; \}/);
});

test("F2 final gate keeps profile identity separate from contextual owner editing", () => {
  assert.match(profilePage, /actionHref="\/ako\?edit=profile"/);
  assert.match(profilePage, /avatarEditHref="\/ako\?edit=avatar"/);
  assert.match(profilePage, /coverEditHref="\/ako\?edit=cover"/);
  assert.match(profilePage, /<ProfileContextualEditor/);
  assert.match(contextualEditor, /<GovernedDialog/);
  assert.doesNotMatch(profilePage, /<form action=\{updateProfile/);
  assert.match(editProfilePage, /ProfileEditForm/);
  assert.match(editProfilePage, /ProfileMediaUploader kind="avatar"/);
  assert.match(editProfilePage, /ProfileMediaUploader kind="cover"/);
});

test("F2 final gate preserves recoverable text edits and warns before explicit discard", () => {
  assert.match(editProfileForm, /useActionState\(updateProfileWithState, initialState\)/);
  assert.match(editProfileForm, /onChange=\{markDirty\}/);
  assert.match(editProfileForm, /beforeunload/);
  assert.match(editProfileForm, /GovernedDialog/);
  assert.match(editProfileForm, /profile\.discardTitle/);
  assert.match(editProfileForm, /profile\.discardChanges/);
  assert.match(profileAction, /return \{ errorCode: validation\.code, saved: false \}/);
  assert.match(profileAction, /return \{ errorCode: "username_taken", saved: false \}/);
  assert.match(profileAction, /return \{ errorCode: "save_failed", saved: false \}/);
  assert.match(profileAction, /return \{ errorCode: null, saved: true \}/);
});

test("F2 final gate constrains profile media before upload and exposes governed feedback", () => {
  assert.match(media, /PROFILE_MEDIA_MAX_BYTES = 5 \* 1024 \* 1024/);
  assert.match(media, /"image\/jpeg": "jpg"/);
  assert.match(media, /"image\/png": "png"/);
  assert.match(media, /"image\/webp": "webp"/);
  assert.match(media, /validateProfileMediaFileCode/);
  assert.match(uploader, /accept="image\/jpeg,image\/png,image\/webp"/);
  assert.match(uploader, /disabled=\{state === "uploading"\}/);
  assert.match(uploader, /ProgressIndicator/);
  assert.match(uploader, /InlineStatus tone="error"/);
  assert.match(uploader, /retryFile/);
  assert.match(uploader, /profile\.mediaRetry/);
  assert.match(uploader, /onSuccess\?: \(\) => void/);
});

test("F2 final gate verifies owner-scoped media paths before profile commit and cleans replaced media", () => {
  assert.match(profileAction, /isOwnedProfileMediaPath\(userId, input\.kind, input\.path\)/);
  assert.match(profileAction, /\.list\(folder, \{ limit: 10, search: filename \}\)/);
  assert.match(profileAction, /createSignedUrl\(input\.path, 60\)/);
  assert.match(profileAction, /\.update\(mediaUpdate\)/);
  assert.match(profileAction, /previousKey && previousKey !== input\.path && isOwnedProfileMediaPath/);
  assert.match(profileAction, /\.remove\(\[previousKey\]\)/);
});

test("F2 final gate localizes governed interaction states for all three supported locales", () => {
  assert.match(interactionI18n, /const ceb:/);
  assert.match(interactionI18n, /const tl:/);
  assert.match(interactionI18n, /const en:/);
  assert.match(interactionI18n, /profile\.validationDisplayName/);
  assert.match(interactionI18n, /profile\.mediaRetry/);
  assert.match(interactionI18n, /theme\.switchDark/);
});
