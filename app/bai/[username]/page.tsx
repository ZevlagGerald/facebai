import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProfileHero } from "@/app/components/profile-hero";
import { SocialIcon } from "@/app/components/social-icons";
import { SocialShell } from "@/app/components/social-shell";
import styles from "@/app/components/profile-surface.module.css";
import { normalizeUsername, USERNAME_PATTERN } from "@/lib/auth/validation";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";
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
  const locale = await getLocale();
  const t = getTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const route = await params;
  const requestedUsername = normalizeUsername(route.username);
  if (!USERNAME_PATTERN.test(requestedUsername)) notFound();

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect(`/login?next=${encodeURIComponent(`/bai/${requestedUsername}`)}`);

  const [
    { data: viewerProfile, error: viewerProfileError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    supabase.from("profiles").select("username, display_name").eq("id", userData.user.id).maybeSingle(),
    supabase.from("profiles").select("id, username, display_name, bio, avatar_key, cover_key").eq("username", requestedUsername).maybeSingle(),
  ]);

  if (viewerProfileError || !viewerProfile) redirect("/tambayan");

  if (profileError) {
    return (
      <SocialShell
        displayName={viewerProfile.display_name}
        username={viewerProfile.username}
        activeRail={null}
        contentLabel={ti("profile.publicLoadFailedTitle")}
        rightRail={null}
        locale={locale}
      >
        <section
          className={styles.streamCard}
          role="alert"
          aria-labelledby="public-profile-load-failed-title"
        >
          <div className={styles.streamIcon} aria-hidden="true">
            <SocialIcon name="user" size={23} />
          </div>
          <h2 id="public-profile-load-failed-title">{ti("profile.publicLoadFailedTitle")}</h2>
          <p>{ti("profile.publicLoadFailed")}</p>
          <Link className={styles.secondaryLink} href={`/bai/${requestedUsername}`}>
            {ti("common.retry")}
          </Link>
        </section>
      </SocialShell>
    );
  }

  if (!profile) notFound();

  const [avatarUrl, coverUrl] = await Promise.all([
    signedMediaUrl(supabase, profile.avatar_key),
    signedMediaUrl(supabase, profile.cover_key),
  ]);
  const isOwner = profile.id === userData.user.id;

  const rightRail = (
    <div className={styles.sideStack}>
      <section className={styles.sideCard} id="about">
        <p className={styles.eyebrow}>{t("profile.about")}</p>
        <h2>{t("profile.aboutThisBai")}</h2>
        <p>{profile.bio || t("profile.noBio")}</p>
      </section>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>{isOwner ? t("profile.yourProfile") : t("nav.friends").toUpperCase()}</p>
        <h2>{isOwner ? t("profile.controls") : t("profile.socialActions")}</h2>
        {isOwner ? (
          <>
            <p>{t("profile.ownerControlBody")}</p>
            <Link className={styles.profileLink} href="/ako/edit">{t("profile.editMyProfile")}</Link>
          </>
        ) : (
          <>
            <p>{t("profile.friendBody")}</p>
            <button className={styles.disabledAction} type="button" disabled>{t("profile.friendsPuhon")}</button>
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
      contentLabel={`${profile.display_name} · ${t("common.profile")}`}
      rightRail={rightRail}
      locale={locale}
    >
      <ProfileHero
        displayName={profile.display_name}
        username={profile.username}
        bio={profile.bio}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        actionHref={isOwner ? "/ako/edit" : undefined}
        mediaEditHref={isOwner ? "/ako/edit" : undefined}
        locale={locale}
      />

      <section className={styles.streamCard} aria-label={t("profile.postsAndFeed")}>
        <div className={styles.streamIcon}><SocialIcon name="home" size={23} /></div>
        <h2>{t("profile.noPosts")}</h2>
        <p>{t("profile.noPostsBody")}</p>
        <span className={styles.puhonBadge}>{t("profile.postsAndFeed")}</span>
      </section>
    </SocialShell>
  );
}
