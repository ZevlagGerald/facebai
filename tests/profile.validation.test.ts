import assert from "node:assert/strict";
import test from "node:test";
import { PROFILE_BIO_MAX, validateProfileInput } from "../lib/profile/validation.ts";

test("profile validation normalizes editable identity fields", () => {
  const result = validateProfileInput({
    displayName: "  Zev   Bai  ",
    username: "  ZeV.Bai_01  ",
    bio: "  Building FaceBai.  ",
  });

  assert.deepEqual(result, {
    ok: true,
    value: {
      displayName: "Zev Bai",
      username: "zev.bai_01",
      bio: "Building FaceBai.",
    },
  });
});

test("profile validation rejects invalid usernames and display names", () => {
  assert.equal(validateProfileInput({ displayName: "Z", username: "valid.bai", bio: "" }).ok, false);
  assert.equal(validateProfileInput({ displayName: "Valid Bai", username: "has-hyphen", bio: "" }).ok, false);
});

test("profile validation enforces the database bio limit", () => {
  const result = validateProfileInput({
    displayName: "Valid Bai",
    username: "valid.bai",
    bio: "x".repeat(PROFILE_BIO_MAX + 1),
  });

  assert.equal(result.ok, false);
});
