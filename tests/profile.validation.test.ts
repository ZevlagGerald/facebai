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

test("profile validation rejects invalid usernames and display names with stable codes", () => {
  const displayName = validateProfileInput({ displayName: "Z", username: "valid.bai", bio: "" });
  assert.equal(displayName.ok, false);
  if (!displayName.ok) assert.equal(displayName.code, "display_name");

  const username = validateProfileInput({ displayName: "Valid Bai", username: "has-hyphen", bio: "" });
  assert.equal(username.ok, false);
  if (!username.ok) assert.equal(username.code, "username");
});

test("profile validation enforces the database bio limit with a stable code", () => {
  const result = validateProfileInput({
    displayName: "Valid Bai",
    username: "valid.bai",
    bio: "x".repeat(PROFILE_BIO_MAX + 1),
  });

  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.code, "bio");
});
