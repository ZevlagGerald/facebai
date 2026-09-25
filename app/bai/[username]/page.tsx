import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProfileHero } from "@/app/components/profile-hero";
import { SocialIcon } from "@/app/components/social-icons";
import { SocialShell } from "@/app/components/social-shell";
import styles from "@/app/components/profile-surface.module.css";
import { normalizeUsername, USERNAME_PATTERN } from "@/lib/auth/validation";
import { PROFILE_MEDIA_BUCKET } from "@/lib/profile/media";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function signedMediaUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  key: string | null,
) {
  if (!key) return null;
  const { data, error } = await supabase.storage.from(PROFILE_MEDIA_BUCKET).createSignedUrl(key, 60 * 10);
  return error ? null : data.signedUrl;
}

export default async function BaiProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const route = await params;
  const requestedUsername = normalizeUsername(route.username);
  if (!USERNAME_PATTERN.test(requestedUsername)) notFound();

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect(`/login?next=${encodeURIComponent(`/bai/${requestedUsername}`)}`);

  const [{ data: viewerProfile }, { data: profile }] = await Promise.all([
    supabase.from("profiles").select("username, display_name").eq("id", userData.user.id).maybeSingle(),
    supabase.from("profiles").select("id, username, display_name, bio, avatar_key, cover_key").eq("username", requestedUsername).maybeSingle(),
  ]);

  if (!viewerProfile) redirect("/tambayan");
  if (!profile) notFound();

  const [avatarUrl, coverUrl] = await Promise.all([
    signedMediaUrl(supabase, profile.avatar_key),
    signedMediaUrl(supabase, profile.cover_key),
  ]);
  const isOwner = profile.id === userData.user.id;

  const rightRail = (
    <div className={styles.sideStack}>
      <section className={styles.sideCard} id="about">
        <p className={styles.eyebrow}>ABOUT</p>
        <h2>About this Bai</h2>
        <p>{profile.bio || "Wala pay bio."}</p>
      </section>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>{isOwner ? "YOUR PROFILE" : "MGA BAI"}</p>
        <h2>{isOwner ? "Profile controls" : "Social actions"}</h2>
        {isOwner ? (
          <>
            <p>You own this profile. Profile controls are kept in a separate edit view.</p>
            <Link className={styles.profileLink} href="/ako/edit">Edit my profile</Link>
          </>
        ) : (
          <>
            <p>Friend requests arrive in a later bounded module. No fake relationship state is shown here.</p>
            <button className={styles.disabledAction} type="button" disabled>Mga Bai · PUHON</button>
          </>
        )}
      </section>
    </div>
  );

  return (
    <SocialShell
      displayName={viewerProfile.display_name}
      username={viewerProfile.username}
      activeRail={isOwner ? "ako" : null}
      contentLabel={`${profile.display_name}'s FaceBai profile`}
      rightRail={rightRail}
    >
      <ProfileHero
        displayName={profile.display_name}
        username={profile.username}
        bio={profile.bio}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        actionHref={isOwner ? "/ako/edit" : undefined}
      />

      <section className={styles.streamCard} aria-label="Profile posts coming soon">
        <div className={styles.streamIcon}><SocialIcon name="home" size={23} /></div>
        <h2>Hilom pa diri.</h2>
        <p>Profile posts arrive with the bounded posts/feed module. No fabricated posts or activity are displayed.</p>
        <span className={styles.puhonBadge}>PUHON · POSTS & FEED</span>
      </section>
    </SocialShell>
  );
}
