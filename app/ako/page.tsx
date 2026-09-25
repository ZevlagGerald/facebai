import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthStatus } from "@/app/components/auth-status";
import { ProfileHero } from "@/app/components/profile-hero";
import { SocialIcon } from "@/app/components/social-icons";
import { SocialShell } from "@/app/components/social-shell";
import { PROFILE_MEDIA_BUCKET } from "@/lib/profile/media";
import { createClient } from "@/lib/supabase/server";
import styles from "@/app/components/profile-surface.module.css";

export const dynamic = "force-dynamic";

async function signedMediaUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  key: string | null,
) {
  if (!key) return null;
  const { data, error } = await supabase.storage.from(PROFILE_MEDIA_BUCKET).createSignedUrl(key, 60 * 10);
  return error ? null : data.signedUrl;
}

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

  const [avatarUrl, coverUrl] = await Promise.all([
    signedMediaUrl(supabase, profile.avatar_key),
    signedMediaUrl(supabase, profile.cover_key),
  ]);

  const rightRail = (
    <div className={styles.sideStack}>
      <section className={styles.sideCard} id="about">
        <p className={styles.eyebrow}>ABOUT</p>
        <h2>About this Bai</h2>
        <p>{profile.bio || "Wala pay bio. Add one from Edit profile."}</p>
      </section>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>PROFILE URL</p>
        <h2>/bai/{profile.username}</h2>
        <p>Your FaceBai profile path follows your username.</p>
        <Link className={styles.profileLink} href={`/bai/${profile.username}`}>View profile URL</Link>
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
      {updated ? <AuthStatus tone="success" title="Profile updated">Saved na, Bai. Your changes are live.</AuthStatus> : null}
      {errorMessage ? <AuthStatus tone="error" title="Profile not saved">{errorMessage}</AuthStatus> : null}

      <ProfileHero
        displayName={profile.display_name}
        username={profile.username}
        bio={profile.bio}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        actionHref="/ako/edit"
      />

      <section className={styles.streamCard} aria-label="Profile posts coming soon">
        <div className={styles.streamIcon}><SocialIcon name="home" size={23} /></div>
        <h2>Wala pay profile posts.</h2>
        <p>Posting and the real social feed arrive in F3. Dili ta magbutang og fake activity just to fill the page.</p>
        <span className={styles.puhonBadge}>PUHON · POSTS & FEED</span>
      </section>
    </SocialShell>
  );
}
