import assert from "node:assert/strict";
import test from "node:test";
import { safeLocalPath } from "../lib/auth/security.ts";

test("safeLocalPath preserves safe local paths", () => {
  assert.equal(safeLocalPath("/tambayan"), "/tambayan");
  assert.equal(safeLocalPath("/tambayan?tab=latest#post-1"), "/tambayan?tab=latest#post-1");
});

test("safeLocalPath rejects external and ambiguous redirects", () => {
  for (const value of [
    "https://evil.example/",
    "//evil.example/",
    "/\\evil.example/",
    "\\evil.example",
    "javascript:alert(1)",
    "",
  ]) {
    assert.equal(safeLocalPath(value), "/tambayan", String(value));
  }
});

test("safeLocalPath supports an explicit fallback", () => {
  assert.equal(safeLocalPath("https://evil.example/", "/login"), "/login");
});
