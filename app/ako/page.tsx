import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthStatus } from "@/app/components/auth-status";
import { ProfileHero } from "@/app/components/profile-hero";
import { SocialIcon } from "@/app/components/social-icons";
import { SocialShell } from "@/app/components/social-shell";
import styles from "@/app/components/profile-surface.module.css";
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
  try {
    const { data, error } = await supabase.storage.from(PROFILE_MEDIA_BUCKET).createSignedUrl(key, 60 * 10);
    return error ? null : data.signedUrl;
  } catch {
    return null;
  }
}

export default async function AkoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : "";
  const updated = params.updated === "1";

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_key, cover_key")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile) redirect("/tambayan");

  const [avatarUrl, coverUrl] = await Promise.all([
    signedMediaUrl(supabase, profile.avatar_key),
    signedMediaUrl(supabase, profile.cover_key),
  ]);

  const rightRail = (
    <div className={styles.sideStack}>
      <section className={styles.sideCard} id="about">
        <p className={styles.eyebrow}>{t("profile.about")}</p>
        <h2>{t("profile.aboutThisBai")}</h2>
        <p>{profile.bio || t("profile.noBioAdd")}</p>
      </section>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>{t("profile.urlEyebrow")}</p>
        <h2>/bai/{profile.username}</h2>
        <p>{t("profile.pathFollowsUsername")}</p>
        <Link className={styles.profileLink} href={`/bai/${profile.username}`}>{t("profile.viewUrl")}</Link>
      </section>
    </div>
  );

  return (
    <SocialShell
      displayName={profile.display_name}
      username={profile.username}
      activeRail="ako"
      contentLabel={t("profile.contentLabel")}
      rightRail={rightRail}
      locale={locale}
    >
      {updated ? <AuthStatus tone="success" title={t("profile.updatedTitle")}>{t("profile.updatedBody")}</AuthStatus> : null}
      {errorMessage ? <AuthStatus tone="error" title={t("profile.notSaved")}>{errorMessage}</AuthStatus> : null}

      <ProfileHero
        displayName={profile.display_name}
        username={profile.username}
        bio={profile.bio}
        avatarUrl={avatarUrl}
        coverUrl={coverUrl}
        avatarConfigured={Boolean(profile.avatar_key)}
        coverConfigured={Boolean(profile.cover_key)}
        actionHref="/ako/edit"
        mediaEditHref="/ako/edit"
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
