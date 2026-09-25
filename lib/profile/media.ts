export const PROFILE_MEDIA_BUCKET = "profile-media";
export const PROFILE_MEDIA_MAX_BYTES = 5 * 1024 * 1024;

export type ProfileMediaKind = "avatar" | "cover";
export type ProfileMediaExtension = "jpg" | "png" | "webp";
export type ProfileMediaValidationCode = "invalid_type" | "empty" | "too_large";

const MIME_EXTENSIONS: Record<string, ProfileMediaExtension> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const UUID_PATTERN = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function profileMediaExtension(mimeType: string): ProfileMediaExtension | null {
  return MIME_EXTENSIONS[mimeType.toLowerCase()] ?? null;
}

export function profileMediaPath(
  userId: string,
  kind: ProfileMediaKind,
  objectId: string,
  extension: ProfileMediaExtension,
) {
  return `${userId}/${kind}/${objectId}.${extension}`;
}

export function isOwnedProfileMediaPath(userId: string, kind: ProfileMediaKind, path: string) {
  const pattern = new RegExp(
    `^${escapeRegExp(userId)}/${kind}/${UUID_PATTERN}\\.(jpg|png|webp)$`,
  );
  return pattern.test(path);
}

export function validateProfileMediaFileCode(file: { type: string; size: number }): ProfileMediaValidationCode | null {
  if (!profileMediaExtension(file.type)) return "invalid_type";
  if (file.size <= 0) return "empty";
  if (file.size > PROFILE_MEDIA_MAX_BYTES) return "too_large";
  return null;
}

export function validateProfileMediaFile(file: { type: string; size: number }): string | null {
  const code = validateProfileMediaFileCode(file);
  if (code === "invalid_type") return "Choose a JPEG, PNG, or WebP image.";
  if (code === "empty") return "That image is empty. Choose another file.";
  if (code === "too_large") return "Image must be 5 MB or smaller.";
  return null;
}
