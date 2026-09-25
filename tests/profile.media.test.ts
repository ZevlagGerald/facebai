import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  isOwnedProfileMediaPath,
  PROFILE_MEDIA_MAX_BYTES,
  profileMediaExtension,
  profileMediaPath,
  validateProfileMediaFile,
  validateProfileMediaFileCode,
} from "../lib/profile/media.ts";

const userId = "123e4567-e89b-12d3-a456-426614174000";
const objectId = "123e4567-e89b-12d3-a456-426614174001";
const readScopeMigration = readFileSync(
  new URL("../supabase/migrations/0004_profile_media_read_scope.sql", import.meta.url),
  "utf8",
);
const signedUrlScopeMigration = readFileSync(
  new URL("../supabase/migrations/0005_profile_media_signed_url_scope.sql", import.meta.url),
  "utf8",
);
const cleanupScopeMigration = readFileSync(
  new URL("../supabase/migrations/0006_profile_media_delete_many_scope.sql", import.meta.url),
  "utf8",
);

test("profile media accepts only the locked image formats", () => {
  assert.equal(profileMediaExtension("image/jpeg"), "jpg");
  assert.equal(profileMediaExtension("image/png"), "png");
  assert.equal(profileMediaExtension("image/webp"), "webp");
  assert.equal(profileMediaExtension("image/svg+xml"), null);
  assert.equal(profileMediaExtension("text/html"), null);
});

test("profile media path is owner and kind scoped", () => {
  const avatar = profileMediaPath(userId, "avatar", objectId, "jpg");
  assert.equal(avatar, `${userId}/avatar/${objectId}.jpg`);
  assert.equal(isOwnedProfileMediaPath(userId, "avatar", avatar), true);
  assert.equal(isOwnedProfileMediaPath(userId, "cover", avatar), false);
  assert.equal(isOwnedProfileMediaPath("223e4567-e89b-12d3-a456-426614174000", "avatar", avatar), false);
  assert.equal(isOwnedProfileMediaPath(userId, "avatar", `${userId}/avatar/not-a-uuid.jpg`), false);
});

test("profile media file validation enforces type and 5 MB ceiling", () => {
  assert.equal(validateProfileMediaFile({ type: "image/png", size: 1024 }), null);
  assert.match(validateProfileMediaFile({ type: "image/svg+xml", size: 1024 }) ?? "", /JPEG, PNG, or WebP/);
  assert.match(validateProfileMediaFile({ type: "image/png", size: PROFILE_MEDIA_MAX_BYTES + 1 }) ?? "", /5 MB/);
  assert.match(validateProfileMediaFile({ type: "image/png", size: 0 }) ?? "", /empty/);
});

test("profile media validation exposes stable codes for localized UI", () => {
  assert.equal(validateProfileMediaFileCode({ type: "image/png", size: 1024 }), null);
  assert.equal(validateProfileMediaFileCode({ type: "image/svg+xml", size: 1024 }), "invalid_type");
  assert.equal(validateProfileMediaFileCode({ type: "image/png", size: 0 }), "empty");
  assert.equal(validateProfileMediaFileCode({ type: "image/png", size: PROFILE_MEDIA_MAX_BYTES + 1 }), "too_large");
});

test("profile media RLS permits signed display without reopening global listing", () => {
  assert.match(signedUrlScopeMigration, /'object\.sign'/);
  assert.match(signedUrlScopeMigration, /'object\.sign_many'/);
  assert.match(signedUrlScopeMigration, /'object\.get_authenticated'/);
  assert.doesNotMatch(signedUrlScopeMigration, /allow_only_operation\('object\.list'\)/);

  assert.match(readScopeMigration, /allow_only_operation\('object\.list'\)/);
  assert.match(readScopeMigration, /storage\.foldername\(name\)\)\[1\].*auth\.uid\(\)/s);
  assert.match(readScopeMigration, /\[2\].*in \('avatar', 'cover'\)/s);
});

test("profile media cleanup permits batch delete visibility without broadening delete ownership", () => {
  assert.match(cleanupScopeMigration, /'object\.delete_many'/);
  assert.match(cleanupScopeMigration, /'object\.sign'/);
  assert.doesNotMatch(cleanupScopeMigration, /allow_only_operation\('object\.list'\)/);

  const profileMediaFoundation = readFileSync(
    new URL("../supabase/migrations/0003_profile_media.sql", import.meta.url),
    "utf8",
  );
  assert.match(profileMediaFoundation, /create policy "users delete own profile media"/);
  assert.match(profileMediaFoundation, /for delete\s+to authenticated/s);
  assert.match(profileMediaFoundation, /storage\.foldername\(name\)\)\[1\].*auth\.uid\(\)/s);
  assert.match(profileMediaFoundation, /\[2\].*in \('avatar', 'cover'\)/s);
});
