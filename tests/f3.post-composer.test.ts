import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const action = readFileSync(new URL("../app/actions/posts.ts", import.meta.url), "utf8");
const composer = readFileSync(new URL("../app/components/post-composer.tsx", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/tambayan/page.tsx", import.meta.url), "utf8");
const validation = readFileSync(new URL("../lib/posts/validation.ts", import.meta.url), "utf8");
const i18n = readFileSync(new URL("../lib/i18n/f3-posts.ts", import.meta.url), "utf8");

test("F3-B validates text posts on the server before insert", () => {
  assert.match(validation, /POST_BODY_MAX_LENGTH = 5000/);
  assert.match(validation, /const body = input\.trim\(\)/);
  assert.match(validation, /body_required/);
  assert.match(validation, /body_too_long/);
  assert.match(action, /validatePostBody\(String\(formData\.get\("body"\)/);
});

test("F3-B creates only authenticated owner posts with public visibility", () => {
  assert.match(action, /supabase\.auth\.getUser\(\)/);
  assert.match(action, /redirect\("\/login\?next=\/tambayan"\)/);
  assert.match(action, /\.from\("posts"\)\.insert\(\{/);
  assert.match(action, /author_id: userData\.user\.id/);
  assert.match(action, /body: validation\.value\.body/);
  assert.match(action, /visibility: "public"/);
  assert.match(action, /save_failed/);
});

test("F3-B composer is real, governed, and double-submit protected", () => {
  assert.match(page, /<PostComposer initial=\{initial\} locale=\{locale\} \/>/);
  assert.match(composer, /useActionState\(createPostWithState, initialState\)/);
  assert.match(composer, /<textarea[\s\S]*?name="body"[\s\S]*?maxLength=\{POST_BODY_MAX_LENGTH\}/);
  assert.match(composer, /<AuthSubmitButton[\s\S]*?pendingLabel=\{t\("composer\.posting"\)\}/);
  assert.match(composer, /InlineStatus tone="error"/);
  assert.match(composer, /InlineStatus tone="success"/);
  assert.match(composer, /formRef\.current\?\.reset\(\)/);
  assert.match(composer, /router\.refresh\(\)/);
});

test("F3-B keeps future media/social composer actions explicitly disabled", () => {
  assert.match(composer, /SocialIcon name="photo"[\s\S]*?t2\("feed\.photo"\)/);
  assert.match(composer, /SocialIcon name="friends"[\s\S]*?t2\("feed\.withBai"\)/);
  assert.match(composer, /<button type="button" disabled>/);
});

test("F3-B localizes all real composer states in Bisaya, Tagalog, and English", () => {
  assert.match(i18n, /const ceb:/);
  assert.match(i18n, /const tl:/);
  assert.match(i18n, /const en:/);
  assert.match(i18n, /"composer\.posting"/);
  assert.match(i18n, /"composer\.bodyRequired"/);
  assert.match(i18n, /"composer\.saveFailed"/);
  assert.match(i18n, /"composer\.saved"/);
});

test("F3-B completion hands off honestly to the real F3-C feed", () => {
  assert.match(page, /<PostFeed/);
  assert.doesNotMatch(page, /feed\.pendingTitle/);
  assert.doesNotMatch(page, /feed\.pendingBody/);
  assert.doesNotMatch(i18n, /next tranche|sunod nga tranche|susunod na feed tranche/i);
});
