import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editPage = readFileSync(new URL("../app/ako/edit/page.tsx", import.meta.url), "utf8");
const editForm = readFileSync(new URL("../app/components/profile-edit-form.tsx", import.meta.url), "utf8");
const editFormCss = readFileSync(new URL("../app/components/profile-edit-form.module.css", import.meta.url), "utf8");
const uploader = readFileSync(new URL("../app/components/profile-media-uploader.tsx", import.meta.url), "utf8");
const surfaceCss = readFileSync(new URL("../app/components/profile-surface.module.css", import.meta.url), "utf8");

test("profile validation errors remain contextual and associated with affected fields", () => {
  assert.match(editForm, /aria-invalid=\{bioError \? true : undefined\}/);
  assert.match(editForm, /profile-bio-help profile-bio-error/);
  assert.match(editForm, /aria-invalid=\{displayNameError \? true : undefined\}/);
  assert.match(editForm, /profile-name-help profile-name-error/);
  assert.match(editForm, /aria-invalid=\{usernameError \? true : undefined\}/);
  assert.match(editForm, /profile-username-help profile-username-error/);
  assert.match(editForm, /className=\{formStyles\.fieldError\} role="alert"/);
  assert.match(editFormCss, /\.fieldError/);
  assert.match(editFormCss, /\.invalidField/);
});

test("profile editor preserves the locked profile surface stylesheet", () => {
  assert.match(surfaceCss, /^\.hero,/);
  assert.match(surfaceCss, /\.coverImage/);
  assert.match(surfaceCss, /grid-template-columns: 132px minmax\(0, 1fr\) auto/);
  assert.match(surfaceCss, /font-size: clamp\(29px, 4vw, 38px\)/);
});

test("dirty text-edit entry crosses a document boundary so beforeunload protects browser Back", () => {
  assert.match(editForm, /window\.addEventListener\("beforeunload", onBeforeUnload\)/);
  assert.match(editPage, /<a className=\{styles\.editChoice\} href="\/ako\/edit\?section=bio" data-facebai-dirty-boundary>/);
  assert.match(editPage, /<a className=\{styles\.editChoice\} href="\/ako\/edit\?section=details" data-facebai-dirty-boundary>/);
  assert.doesNotMatch(editPage, /<Link className=\{styles\.editChoice\} href="\/ako\/edit\?section=(?:bio|details)"/);
});

test("profile media retry is offered only for recoverable failures", () => {
  assert.match(uploader, /function isRetryableCommitError/);
  assert.match(uploader, /code === "verify_failed" \|\| code === "profile_load_failed" \|\| code === "save_failed"/);
  assert.match(uploader, /userError \|\| !userData\.user[\s\S]*?setRetryFile\(null\)/);
  assert.match(uploader, /setRetryFile\(isRetryableCommitError\(commit\.errorCode\) \? file : null\)/);
});