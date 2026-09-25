import { normalizeUsername, USERNAME_PATTERN } from "../auth/validation.ts";

export const PROFILE_DISPLAY_NAME_MAX = 80;
export const PROFILE_BIO_MAX = 500;

export type ProfileInput = {
  displayName: string;
  username: string;
  bio: string;
};

export type ProfileValidationResult =
  | { ok: true; value: { displayName: string; username: string; bio: string } }
  | { ok: false; error: string };

export function validateProfileInput(input: ProfileInput): ProfileValidationResult {
  const displayName = input.displayName.trim().replace(/\s+/g, " ");
  const username = normalizeUsername(input.username);
  const bio = input.bio.trim();

  if (displayName.length < 2 || displayName.length > PROFILE_DISPLAY_NAME_MAX) {
    return { ok: false, error: "Display name must be 2–80 characters." };
  }

  if (!USERNAME_PATTERN.test(username)) {
    return { ok: false, error: "Username must be 3–30 lowercase letters, numbers, dots, or underscores." };
  }

  if (bio.length > PROFILE_BIO_MAX) {
    return { ok: false, error: "Bio must be 500 characters or fewer." };
  }

  return { ok: true, value: { displayName, username, bio } };
}
