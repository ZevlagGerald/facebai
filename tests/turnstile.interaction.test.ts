import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  TURNSTILE_DELAY_NOTICE_MS,
  classifyTurnstileClientError,
  normalizeTurnstileClientErrorCode,
  type TurnstileClientFailureKind,
} from "../lib/auth/turnstile-client.ts";
import { getTurnstileInteractionCopy } from "../lib/i18n/turnstile-interaction.ts";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const FAILURE_KINDS: TurnstileClientFailureKind[] = [
  "configuration",
  "clock_or_cache",
  "iframe_load",
  "timeout",
  "challenge",
  "unknown",
];

test("Turnstile client diagnostics accept only bounded numeric error codes", () => {
  assert.equal(normalizeTurnstileClientErrorCode("110200"), "110200");
  assert.equal(normalizeTurnstileClientErrorCode(200500), "200500");

  for (const unsafe of ["", "110200<script>", "abc", "1234567", null, undefined]) {
    assert.equal(normalizeTurnstileClientErrorCode(unsafe), null, String(unsafe));
  }
});

test("Cloudflare-documented Turnstile errors preserve retryability semantics", () => {
  for (const code of ["110100", "110110", "110200", "400020", "400070"]) {
    assert.deepEqual(classifyTurnstileClientError(code), {
      code,
      kind: "configuration",
      retryable: false,
    });
  }

  assert.deepEqual(classifyTurnstileClientError("200100"), {
    code: "200100",
    kind: "clock_or_cache",
    retryable: false,
  });
  assert.deepEqual(classifyTurnstileClientError("200500"), {
    code: "200500",
    kind: "iframe_load",
    retryable: true,
  });

  for (const code of ["110600", "110620"]) {
    assert.deepEqual(classifyTurnstileClientError(code), {
      code,
      kind: "timeout",
      retryable: true,
    });
  }

  for (const code of ["300001", "600010"]) {
    assert.deepEqual(classifyTurnstileClientError(code), {
      code,
      kind: "challenge",
      retryable: true,
    });
  }

  assert.deepEqual(classifyTurnstileClientError("999999"), {
    code: "999999",
    kind: "unknown",
    retryable: true,
  });
});

test("FaceBai exposes every Turnstile lifecycle message in all supported locales", () => {
  for (const locale of ["ceb", "tl", "en"] as const) {
    const copy = getTurnstileInteractionCopy(locale);

    for (const key of [
      "title",
      "unavailableTitle",
      "unavailableBody",
      "loading",
      "delayed",
      "ready",
      "verified",
      "expired",
      "retrying",
      "unsupported",
      "retry",
      "diagnosticLabel",
    ] as const) {
      assert.ok(copy[key].length > 0, `${locale}:${key}`);
    }

    for (const kind of FAILURE_KINDS) {
      assert.ok(copy.errors[kind].length > 0, `${locale}:${kind}`);
    }
  }
});

test("Turnstile component wires delayed, expiry, timeout, error diagnostics, and retry states", () => {
  const source = read("app/components/turnstile-field.tsx");

  for (const state of ["loading", "delayed", "ready", "verified", "expired", "error", "retrying"]) {
    assert.ok(source.includes(`| "${state}"`) || source.includes(`= "${state}"`), state);
  }

  assert.ok(source.includes("TURNSTILE_DELAY_NOTICE_MS"));
  assert.ok(source.includes("window.setTimeout"));
  assert.ok(source.includes('"expired-callback"'));
  assert.ok(source.includes('"timeout-callback"'));
  assert.ok(source.includes('"unsupported-callback"'));
  assert.ok(source.includes('"error-callback": (rawCode: unknown)'));
  assert.ok(source.includes("classifyTurnstileClientError(rawCode)"));
  assert.ok(source.includes("failure?.retryable ?? true"));
  assert.ok(source.includes("window.turnstile.reset(widgetIdRef.current)"));
  assert.ok(source.includes('role={status === "error" ? "alert" : "status"}'));
  assert.ok(source.includes('aria-busy={status === "loading" || status === "retrying" ? true : undefined}'));
});

test("FaceBai owns one Turnstile response field and disables Cloudflare duplicate form injection", () => {
  const source = read("app/components/turnstile-field.tsx");
  const responseFieldCount = source.split('name="cf-turnstile-response"').length - 1;

  assert.equal(responseFieldCount, 1);
  assert.ok(source.includes('"response-field": false'));
  assert.ok(source.includes('retry: "auto"'));
  assert.ok(source.includes('"retry-interval": TURNSTILE_DELAY_NOTICE_MS'));
  assert.ok(source.includes('"refresh-expired": "auto"'));
  assert.ok(source.includes('"refresh-timeout": "auto"'));
});

test("Turnstile diagnostics expose only a sanitized error code and never log challenge tokens", () => {
  const component = read("app/components/turnstile-field.tsx");
  const classifier = read("lib/auth/turnstile-client.ts");

  assert.ok(component.includes("failure?.code"));
  assert.ok(component.includes("copy.diagnosticLabel"));
  assert.doesNotMatch(component, /console\.(?:log|info|warn|error|debug)/u);
  assert.doesNotMatch(classifier, /console\.(?:log|info|warn|error|debug)/u);

  const diagnosticBlock = component.match(/\{failure\?\.code \? \([\s\S]*?\) : null\}/u)?.[0] ?? "";
  assert.ok(diagnosticBlock.length > 0);
  assert.doesNotMatch(diagnosticBlock, /\btoken\b/iu);
});

test("Turnstile retry control meets the auth touch-target floor", () => {
  const css = read("app/components/turnstile-field.module.css");
  assert.match(css, /\.retryButton\s*\{[\s\S]*?min-height:\s*44px;/u);
});

test("Turnstile delayed notice threshold stays bounded and intentional", () => {
  assert.ok(TURNSTILE_DELAY_NOTICE_MS >= 5_000);
  assert.ok(TURNSTILE_DELAY_NOTICE_MS <= 15_000);
});
