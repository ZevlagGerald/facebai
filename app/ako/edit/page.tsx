import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { ProfileMediaUploader } from "@/app/components/profile-media-uploader";
import { SocialShell } from "@/app/components/social-shell";
import { createClient } from "@/lib/supabase/server";
import styles from "@/app/components/profile-surface.module.css";

export const dynamic = "force-dynamic";

export default async function EditAkoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : "";

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako/edit");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!profile) redirect("/tambayan");

  const rightRail = (
    <div className={styles.sideStack}>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>EDITING PROFILE</p>
        <h2>Your public identity</h2>
        <p>Display name, username, bio, avatar, and cover are visible to signed-in FaceBai users.</p>
        <Link className={styles.profileLink} href="/ako">Back to my profile</Link>
      </section>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>PROFILE URL</p>
        <h2>/bai/{profile.username}</h2>
        <p>Changing your username also changes this path.</p>
      </section>
    </div>
  );

  return (
    <SocialShell
      displayName={profile.display_name}
      username={profile.username}
      activeRail="ako"
      contentLabel="Edit your FaceBai profile"
      rightRail={rightRail}
    >
      <section className={styles.settingsIntro}>
        <div>
          <p className={styles.eyebrow}>AKO</p>
          <h1>Edit profile</h1>
          <p>Keep profile controls here so your main profile stays social, not administrative.</p>
        </div>
        <Link className={styles.settingsBack} href="/ako">Cancel</Link>
      </section>

      <section className={styles.editCard}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>PROFILE MEDIA</p>
            <h2>Photos</h2>
          </div>
        </div>
        <div className={styles.mediaGrid}>
          <div className={styles.mediaPanel}>
            <h3>Profile photo</h3>
            <p>Use a clear square image. JPEG, PNG, or WebP up to 5 MB.</p>
            <ProfileMediaUploader kind="avatar" label="Profile photo" />
          </div>
          <div className={styles.mediaPanel}>
            <h3>Cover photo</h3>
            <p>A wide image works best. JPEG, PNG, or WebP up to 5 MB.</p>
            <ProfileMediaUploader kind="cover" label="Cover photo" />
          </div>
        </div>
      </section>

      <section className={styles.editCard}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>BASIC INFO</p>
            <h2>Name, username & bio</h2>
          </div>
        </div>

        {errorMessage ? <AuthStatus tone="error" title="Profile not saved">{errorMessage}</AuthStatus> : null}

        <form action={updateProfile} className={styles.form}>
          <label>
            <span>Display name</span>
            <input name="display_name" defaultValue={profile.display_name} minLength={2} maxLength={80} required autoComplete="name" />
            <small className={styles.help}>This is the name other Bai will see.</small>
          </label>

          <label>
            <span>Username</span>
            <input name="username" defaultValue={profile.username} minLength={3} maxLength={30} required autoCapitalize="none" spellCheck={false} />
            <small className={styles.help}>3–30 letters, numbers, dots, or underscores. Changing it changes your profile URL.</small>
          </label>

          <label>
            <span>Bio</span>
            <textarea name="bio" defaultValue={profile.bio} maxLength={500} placeholder="Sulti gamay bahin nimo, Bai." />
            <small className={styles.help}>Up to 500 characters. Keep it useful and respectful.</small>
          </label>

          <AuthSubmitButton idleLabel="Save changes" pendingLabel="Saving changes…" />
        </form>
      </section>
    </SocialShell>
  );
}
