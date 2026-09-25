"use server";

import { redirect } from "next/navigation";
import {
  isOwnedProfileMediaPath,
  PROFILE_MEDIA_BUCKET,
  type ProfileMediaKind,
} from "@/lib/profile/media";
import { createClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/profile/validation";

function fail(message: string): never {
  redirect(`/ako/edit?error=${encodeURIComponent(message)}`);
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako/edit");

  const validation = validateProfileInput({
    displayName: String(formData.get("display_name") ?? ""),
    username: String(formData.get("username") ?? ""),
    bio: String(formData.get("bio") ?? ""),
  });

  if (!validation.ok) fail(validation.error);

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: validation.value.displayName,
      username: validation.value.username,
      bio: validation.value.bio,
    })
    .eq("id", userData.user.id);

  if (error?.code === "23505") fail("That username is already taken. Try another one, Bai.");
  if (error) fail("Sus, naay nisipyat while saving your profile. Please try again.");

  redirect("/ako?updated=1");
}

export type CommitProfileMediaResult =
  | { ok: true }
  | { ok: false; error: string };

export async function commitProfileMedia(input: {
  kind: ProfileMediaKind;
  path: string;
}): Promise<CommitProfileMediaResult> {
  if (input.kind !== "avatar" && input.kind !== "cover") {
    return { ok: false, error: "Unsupported profile media type." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, error: "Your session expired. Sign in again and retry." };
  }

  const userId = userData.user.id;
  if (!isOwnedProfileMediaPath(userId, input.kind, input.path)) {
    return { ok: false, error: "Invalid profile media path." };
  }

  const parts = input.path.split("/");
  const filename = parts.at(-1);
  const folder = `${userId}/${input.kind}`;
  if (!filename) return { ok: false, error: "Invalid profile media file." };

  const { data: objects, error: objectError } = await supabase.storage
    .from(PROFILE_MEDIA_BUCKET)
    .list(folder, { limit: 10, search: filename });

  if (objectError || !objects?.some((object) => object.name === filename)) {
    return { ok: false, error: "Uploaded image could not be verified. Please retry." };
  }

  const column = input.kind === "avatar" ? "avatar_key" : "cover_key";
  const { data: current, error: currentError } = await supabase
    .from("profiles")
    .select("avatar_key, cover_key")
    .eq("id", userId)
    .maybeSingle();

  if (currentError || !current) {
    return { ok: false, error: "Profile could not be loaded. Please retry." };
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
    return { ok: false, error: "Profile image could not be saved. Please retry." };
  }

  if (previousKey && previousKey !== input.path && isOwnedProfileMediaPath(userId, input.kind, previousKey)) {
    await supabase.storage.from(PROFILE_MEDIA_BUCKET).remove([previousKey]);
  }

  return { ok: true };
}
