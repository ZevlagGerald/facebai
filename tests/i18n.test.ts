import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const config = readFileSync(new URL("../lib/i18n/config.ts", import.meta.url), "utf8");
const messages = readFileSync(new URL("../lib/i18n/messages.ts", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const socialShell = readFileSync(new URL("../app/components/social-shell.tsx", import.meta.url), "utf8");
const authShell = readFileSync(new URL("../app/components/auth-shell.tsx", import.meta.url), "utf8");

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
