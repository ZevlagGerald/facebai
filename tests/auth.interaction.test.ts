import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  INITIAL_AUTH_ACTION_STATE,
  authErrorState,
  authSuccessState,
  type AuthErrorCode,
  type AuthSuccessCode,
} from "../lib/auth/action-state.ts";
import { authProviderFailureKind } from "../lib/auth/provider-errors.ts";
import { getAuthInteractionCopy } from "../lib/i18n/auth-interaction.ts";

const ERROR_CODES: AuthErrorCode[] = [
  "full_name_invalid",
  "username_invalid",
  "email_invalid",
  "password_too_short",
  "passwords_mismatch",
  "adult_required",
  "terms_required",
  "security_required",
  "security_failed",
  "too_many_requests",
  "email_rate_limited",
  "registration_failed",
  "login_failed",
  "verification_resend_failed",
  "recovery_failed",
  "password_update_failed",
  "session_expired",
];

const SUCCESS_CODES: AuthSuccessCode[] = [
  "recovery_sent",
  "verification_sent",
  "password_updated",
];

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("structured auth state advances revisions without carrying stale state", () => {
  const error = authErrorState(INITIAL_AUTH_ACTION_STATE, {
    formError: "login_failed",
    values: { email: "user@example.com", next: "/tambayan" },
  });
  assert.equal(error.status, "error");
  assert.equal(error.revision, 1);
  assert.equal(error.formError, "login_failed");
  assert.deepEqual(error.values, { email: "user@example.com", next: "/tambayan" });

  const success = authSuccessState(error, "recovery_sent", { email: "user@example.com" });
  assert.equal(success.status, "success");
  assert.equal(success.revision, 2);
  assert.equal(success.formError, undefined);
  assert.equal(success.successCode, "recovery_sent");
});

test("safe returned form values cannot include credentials or captcha tokens", () => {
  const source = read("lib/auth/action-state.ts");
  const safeValues = source.match(/export type AuthSafeValues = \{([\s\S]*?)\n\};/u)?.[1] ?? "";

  for (const forbidden of ["password", "confirm_password", "captcha", "token", "secret"]) {
    assert.doesNotMatch(safeValues, new RegExp(forbidden, "iu"), forbidden);
  }

  for (const allowed of ["full_name", "username", "date_of_birth", "email", "accept_terms", "next"]) {
    assert.match(safeValues, new RegExp(`\\b${allowed}\\b`, "u"), allowed);
  }
});

test("stable Supabase provider errors map to bounded interaction categories", () => {
  assert.equal(authProviderFailureKind({ code: "captcha_failed" }), "captcha");
  assert.equal(authProviderFailureKind({ code: "over_request_rate_limit" }), "request_rate_limit");
  assert.equal(authProviderFailureKind({ code: "over_email_send_rate_limit" }), "email_rate_limit");
  assert.equal(authProviderFailureKind({ code: "email_address_not_authorized" }), "email_delivery_restricted");
  assert.equal(authProviderFailureKind({ code: "user_not_found" }), "user_not_found");
  assert.equal(authProviderFailureKind({ code: "unexpected_failure" }), "other");
  assert.equal(authProviderFailureKind(null), "other");
});

test("every auth interaction code is localized in Bisaya, Tagalog, and English", () => {
  for (const locale of ["ceb", "tl", "en"] as const) {
    const copy = getAuthInteractionCopy(locale);
    assert.ok(copy.attentionTitle.length > 0, locale);
    assert.ok(copy.successTitle.length > 0, locale);
    for (const code of ERROR_CODES) assert.ok(copy.errors[code]?.length > 0, `${locale}:${code}`);
    for (const code of SUCCESS_CODES) assert.ok(copy.successes[code]?.length > 0, `${locale}:${code}`);
  }
});

test("auth actions preserve enumeration-safe recovery and resend behavior", () => {
  const source = read("app/actions/auth.ts");
  assert.match(source, /shouldObscureEmailDeliveryFailure\(error\)/u);
  assert.match(source, /kind === "email_rate_limit" \|\| kind === "email_delivery_restricted" \|\| kind === "user_not_found"/u);
  assert.match(source, /authSuccessState\(previous, "verification_sent", values\)/u);
  assert.match(source, /authSuccessState\(previous, "recovery_sent", values\)/u);
  assert.match(source, /fieldErrors: \{ security: "security_failed" \}/u);
  assert.match(source, /formError: "too_many_requests"/u);
  assert.doesNotMatch(source, /redirect\(`?[^`\n]*[?&](?:error|message)=/u);
});

test("auth forms preserve only safe fields while credentials and Turnstile remount after errors", () => {
  const source = read("app/components/auth-forms.tsx");

  for (const keyPrefix of [
    "login-email-",
    "register-full-name-",
    "register-username-",
    "register-dob-",
    "register-email-",
    "register-terms-",
    "recovery-email-",
    "login-password-",
    "register-password-",
    "register-confirm-password-",
    "update-password-",
    "update-confirm-password-",
    "login-turnstile-",
    "register-turnstile-",
    "recovery-turnstile-",
    "resend-turnstile-",
  ]) {
    assert.ok(source.includes(`${keyPrefix}\${state.revision}`), keyPrefix);
  }

  assert.match(source, /aria-invalid=/u);
  assert.match(source, /aria-describedby=/u);
  assert.doesNotMatch(source, /\bnoValidate\b/u);
});

test("password recovery and resend success replace the unfinished form state", () => {
  const source = read("app/components/auth-forms.tsx");
  assert.match(source, /if \(state\.status === "success"\) \{[\s\S]*?<FormStatus state=\{state\} locale=\{locale\}/u);
  assert.match(source, /export function ResendVerificationForm[\s\S]*?if \(state\.status === "success"\)/u);
});

test("auth pages use stable status codes rather than raw English error query strings", () => {
  const paths = [
    "app/login/page.tsx",
    "app/register/page.tsx",
    "app/forgot-password/page.tsx",
    "app/auth/check-email/page.tsx",
    "app/auth/update-password/page.tsx",
  ];

  for (const path of paths) {
    const source = read(path);
    assert.doesNotMatch(source, /params\.(?:error|message)\b/u, path);
    assert.doesNotMatch(source, /searchParams\.get\(["'](?:error|message)["']\)/u, path);
  }

  assert.match(read("app/login/page.tsx"), /status === "password-updated"/u);
});

test("auth interaction source never logs credentials or captcha tokens", () => {
  for (const path of [
    "app/actions/auth.ts",
    "app/components/auth-forms.tsx",
    "lib/auth/action-state.ts",
    "lib/auth/provider-errors.ts",
  ]) {
    const source = read(path);
    assert.doesNotMatch(source, /console\.(?:log|info|warn|error|debug)/u, path);
  }
});
