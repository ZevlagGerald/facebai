"use server";

import { redirect } from "next/navigation";
import {
  isOwnedProfileMediaPath,
  PROFILE_MEDIA_BUCKET,
  type ProfileMediaKind,
} from "@/lib/profile/media";
import { createClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/profile/validation";

export type ProfileUpdateErrorCode =
  | "display_name"
  | "username"
  | "bio"
  | "username_taken"
  | "save_failed";

export type ProfileUpdateState = {
  errorCode: ProfileUpdateErrorCode | null;
};

export async function updateProfileWithState(
  _previousState: ProfileUpdateState,
  formData: FormData,
): Promise<ProfileUpdateState> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako/edit");

  const validation = validateProfileInput({
    displayName: String(formData.get("display_name") ?? ""),
    username: String(formData.get("username") ?? ""),
    bio: String(formData.get("bio") ?? ""),
  });

  if (!validation.ok) return { errorCode: validation.code };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: validation.value.displayName,
      username: validation.value.username,
      bio: validation.value.bio,
    })
    .eq("id", userData.user.id);

  if (error?.code === "23505") return { errorCode: "username_taken" };
  if (error) return { errorCode: "save_failed" };

  redirect("/ako?updated=1");
}

export async function updateProfile(formData: FormData) {
  const state = await updateProfileWithState({ errorCode: null }, formData);
  if (state.errorCode) redirect(`/ako/edit?error=${encodeURIComponent(state.errorCode)}`);
}

export type CommitProfileMediaErrorCode =
  | "unsupported_kind"
  | "session_expired"
  | "invalid_path"
  | "invalid_file"
  | "verify_failed"
  | "profile_load_failed"
  | "save_failed";

export type CommitProfileMediaResult =
  | { ok: true }
  | { ok: false; errorCode: CommitProfileMediaErrorCode };

export async function commitProfileMedia(input: {
  kind: ProfileMediaKind;
  path: string;
}): Promise<CommitProfileMediaResult> {
  if (input.kind !== "avatar" && input.kind !== "cover") {
    return { ok: false, errorCode: "unsupported_kind" };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, errorCode: "session_expired" };
  }

  const userId = userData.user.id;
  if (!isOwnedProfileMediaPath(userId, input.kind, input.path)) {
    return { ok: false, errorCode: "invalid_path" };
  }

  const parts = input.path.split("/");
  const filename = parts.at(-1);
  const folder = `${userId}/${input.kind}`;
  if (!filename) return { ok: false, errorCode: "invalid_file" };

  const { data: objects, error: objectError } = await supabase.storage
    .from(PROFILE_MEDIA_BUCKET)
    .list(folder, { limit: 10, search: filename });

  if (objectError || !objects?.some((object) => object.name === filename)) {
    return { ok: false, errorCode: "verify_failed" };
  }

  const column = input.kind === "avatar" ? "avatar_key" : "cover_key";
  const { data: current, error: currentError } = await supabase
    .from("profiles")
    .select("avatar_key, cover_key")
    .eq("id", userId)
    .maybeSingle();

  if (currentError || !current) {
    return { ok: false, errorCode: "profile_load_failed" };
  }

  const previousKey = current[column];
  const mediaUpdate = input.kind === "avatar"
    ? { avatar_key: input.path }
    : { cover_key: input.path };
  const { error: updateError } = await supabase
    .from("profiles")
    .update(mediaUpdate)
    .eq("id", userId);

  if (updateError) {
    return { ok: false, errorCode: "save_failed" };
  }

  if (previousKey && previousKey !== input.path && isOwnedProfileMediaPath(userId, input.kind, previousKey)) {
    await supabase.storage.from(PROFILE_MEDIA_BUCKET).remove([previousKey]);
  }

  return { ok: true };
}
