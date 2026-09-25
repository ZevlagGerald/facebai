import assert from "node:assert/strict";
import test from "node:test";
import {
  isOwnedProfileMediaPath,
  PROFILE_MEDIA_MAX_BYTES,
  profileMediaExtension,
  profileMediaPath,
  validateProfileMediaFile,
} from "../lib/profile/media.ts";

const userId = "123e4567-e89b-12d3-a456-426614174000";
const objectId = "123e4567-e89b-12d3-a456-426614174001";

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
