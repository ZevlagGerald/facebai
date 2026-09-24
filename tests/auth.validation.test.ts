import assert from "node:assert/strict";
import test from "node:test";
import { isAdult, normalizeUsername, parseIsoDate, USERNAME_PATTERN } from "../lib/auth/validation.ts";

test("normalizeUsername trims and lowercases", () => {
  assert.equal(normalizeUsername("  Bai.ZEV_01  "), "bai.zev_01");
});

test("username pattern accepts canonical handles and rejects malformed ones", () => {
  for (const value of ["bai123", "zev.byte", "zev_byte"]) {
    assert.equal(USERNAME_PATTERN.test(value), true, value);
  }

  for (const value of ["ab", ".startswrong", "UPPERCASE", "has space", "has-hyphen"]) {
    assert.equal(USERNAME_PATTERN.test(value), false, value);
  }
});

test("parseIsoDate rejects normalized or malformed calendar dates", () => {
  assert.equal(parseIsoDate("2008-02-30"), null);
  assert.equal(parseIsoDate("2008-13-01"), null);
  assert.equal(parseIsoDate("1899-12-31"), null);
  assert.equal(parseIsoDate("08-02-01"), null);
  assert.equal(parseIsoDate("2008/02/01"), null);
  assert.ok(parseIsoDate("2008-02-29"));
});

test("isAdult uses exact UTC birthday boundaries", () => {
  const beforeBirthday = new Date("2026-09-24T12:00:00Z");
  const onBirthday = new Date("2026-09-25T00:00:00Z");

  assert.equal(isAdult("2008-09-25", beforeBirthday), false);
  assert.equal(isAdult("2008-09-25", onBirthday), true);
  assert.equal(isAdult("2000-01-01", beforeBirthday), true);
  assert.equal(isAdult("2008-02-30", beforeBirthday), false);
});
