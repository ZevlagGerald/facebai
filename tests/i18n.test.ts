import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const config = readFileSync(new URL("../lib/i18n/config.ts", import.meta.url), "utf8");
const messages = readFileSync(new URL("../lib/i18n/messages.ts", import.meta.url), "utf8");
const f2Social = readFileSync(new URL("../lib/i18n/f2-social.ts", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const socialShell = readFileSync(new URL("../app/components/social-shell.tsx", import.meta.url), "utf8");
const authShell = readFileSync(new URL("../app/components/auth-shell.tsx", import.meta.url), "utf8");
const tambayan = readFileSync(new URL("../app/tambayan/page.tsx", import.meta.url), "utf8");
const profilePage = readFileSync(new URL("../app/ako/page.tsx", import.meta.url), "utf8");
const profileHero = readFileSync(new URL("../app/components/profile-hero.tsx", import.meta.url), "utf8");
const contextualEditor = readFileSync(new URL("../app/components/profile-contextual-editor.tsx", import.meta.url), "utf8");
const editProfilePage = readFileSync(new URL("../app/ako/edit/page.tsx", import.meta.url), "utf8");
const editProfileForm = readFileSync(new URL("../app/components/profile-edit-form.tsx", import.meta.url), "utf8");

test("FaceBai i18n exposes Bisaya, Tagalog, and English with Bisaya as default", () => {
  assert.match(config, /SUPPORTED_LOCALES = \["ceb", "tl", "en"\]/);
  assert.match(config, /DEFAULT_LOCALE: Locale = "ceb"/);
  assert.match(config, /ceb: "Bisaya"/);
  assert.match(config, /tl: "Tagalog"/);
  assert.match(config, /en: "English"/);
});

test("all three FaceBai dictionaries are present", () => {
  assert.match(messages, /const cebMessages/);
  assert.match(messages, /const tlMessages/);
  assert.match(messages, /const enMessages/);
  assert.match(messages, /"nav\.tambayan"/);
  assert.match(messages, /"auth\.loginTitle"/);
  assert.match(messages, /"turnstile\.title"/);
});

test("document language and both auth/social shells use the selected locale", () => {
  assert.match(layout, /htmlLanguage\(locale\)/);
  assert.match(socialShell, /LanguageSwitcher locale=\{locale\}/);
  assert.match(authShell, /LanguageSwitcher locale=\{locale\} variant="auth"/);
});

test("F2 social surfaces use a bounded locale polish layer without changing the canonical auth dictionary", () => {
  assert.match(f2Social, /getTranslations, type MessageKey/);
  assert.match(f2Social, /"feed\.homeFeed": "TAMBAYAN FEED"/);
  assert.match(f2Social, /"feed\.marketEyebrow": "PUHON"/);
  assert.match(f2Social, /"nav\.profileMenu": "Akong profile"/);
  assert.match(f2Social, /"profile\.about": "BAHIN"/);
  assert.match(f2Social, /"profile\.urlEyebrow": "LINK SA PROFILE"/);
  assert.match(f2Social, /"profile\.editProfile": "Usba ang profile"/);
  assert.match(f2Social, /"profile\.profilePhoto": "Litrato sa profile"/);
  assert.match(f2Social, /"feed\.homeFeed": "FEED NG TAMBAYAN"/);
  assert.match(f2Social, /"nav\.marketHelper": "Pamilihan"/);
  assert.match(f2Social, /"profile\.profilePhoto": "Larawan sa profile"/);

  for (const source of [socialShell, tambayan, profilePage, profileHero, contextualEditor, editProfilePage, editProfileForm]) {
    assert.match(source, /getF2SocialTranslations/);
  }
});
