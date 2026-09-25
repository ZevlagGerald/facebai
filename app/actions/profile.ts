"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/profile/validation";

function fail(message: string): never {
  redirect(`/ako?error=${encodeURIComponent(message)}`);
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako");

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
