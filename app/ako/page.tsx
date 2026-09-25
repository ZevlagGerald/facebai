import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { ProfileHero } from "@/app/components/profile-hero";
import { SocialShell } from "@/app/components/social-shell";
import { createClient } from "@/lib/supabase/server";
import styles from "@/app/components/profile-surface.module.css";

export const dynamic = "force-dynamic";

export default async function AkoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : "";
  const updated = params.updated === "1";

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_key, cover_key")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!profile) redirect("/tambayan");

  const rightRail = (
    <div className={styles.sideStack}>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>PROFILE URL</p>
        <h2>/bai/{profile.username}</h2>
        <p>This is your stable FaceBai profile path. Changing your username also changes this URL.</p>
        <Link className={styles.profileLink} href={`/bai/${profile.username}`}>View my profile</Link>
      </section>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>PROFILE MEDIA</p>
        <h2>Avatar & cover</h2>
        <p>Storage uploads are intentionally not enabled yet. We will add them only after bucket and RLS review.</p>
        <span className={styles.puhonBadge}>PUHON · STORAGE</span>
      </section>
    </div>
  );

  return (
    <SocialShell
      displayName={profile.display_name}
      username={profile.username}
      activeRail="ako"
      contentLabel="Your FaceBai profile"
      rightRail={rightRail}
    >
      <ProfileHero displayName={profile.display_name} username={profile.username} bio={profile.bio} />

      <section className={styles.editCard}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>AKO</p>
            <h2>Edit profile</h2>
          </div>
        </div>

        {updated ? <AuthStatus tone="success" title="Profile updated">Saved na, Bai. Your profile changes are live.</AuthStatus> : null}
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

          <AuthSubmitButton idleLabel="Save profile" pendingLabel="Saving profile…" />
        </form>
      </section>
    </SocialShell>
  );
}
