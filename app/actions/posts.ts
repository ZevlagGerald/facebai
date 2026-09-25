"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validatePostBody, type PostValidationErrorCode } from "@/lib/posts/validation";

export type CreatePostErrorCode = PostValidationErrorCode | "save_failed";

export type CreatePostState = {
  errorCode: CreatePostErrorCode | null;
  saved: boolean;
};

export async function createPostWithState(
  _previousState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/tambayan");

  const validation = validatePostBody(String(formData.get("body") ?? ""));
  if (!validation.ok) return { errorCode: validation.code, saved: false };

  const { error } = await supabase.from("posts").insert({
    author_id: userData.user.id,
    body: validation.value.body,
    visibility: "public",
  });

  if (error) return { errorCode: "save_failed", saved: false };
  return { errorCode: null, saved: true };
}
