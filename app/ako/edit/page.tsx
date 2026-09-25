import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthStatus } from "@/app/components/auth-status";
import { ProfileEditForm } from "@/app/components/profile-edit-form";
import { ProfileMediaUploader } from "@/app/components/profile-media-uploader";
import { SocialIcon } from "@/app/components/social-icons";
import styles from "@/app/components/profile-surface.module.css";
import { getF2SocialTranslations } from "@/lib/i18n/f2-social";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import { getLocale } from "@/lib/i18n/server";
import { PROFILE_MEDIA_BUCKET } from "@/lib/profile/media";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EditSection = "avatar" | "cover" | "bio" | "details" | null;

function parseEditSection(value: string | string[] | undefined): EditSection {
  if (value === "avatar" || value === "cover" || value === "bio" || value === "details") return value;
  return null;
}

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

export default async function EditAkoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getF2SocialTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : "";
  const section = parseEditSection(params.section);

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako/edit");

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
  const mediaPreviewUnavailable = Boolean(
    (profile.avatar_key && !avatarUrl) || (profile.cover_key && !coverUrl),
  );
  const initial = profile.display_name.charAt(0).toUpperCase() || "B";
  const closeHref = section ? "/ako/edit" : "/ako";
  const textSection = section === "bio" || section === "details";

  return (
    <main className={styles.focusedPage}>
      <section className={styles.focusedDialog} aria-label={t("profile.editContentLabel")}>
        {textSection ? (
          <ProfileEditForm
            section={section}
            displayName={profile.display_name}
            username={profile.username}
            bio={profile.bio}
            locale={locale}
          />
        ) : (
          <>
            <header className={styles.focusedHeader}>
              <div>
                <p className={styles.eyebrow}>{t("nav.profile").toUpperCase()}</p>
                <h1>{t("profile.editProfile")}</h1>
              </div>
              <Link
                className={styles.focusedClose}
                href={closeHref}
                aria-label={section ? t("common.cancel") : t("profile.backToProfile")}
              >
                ×
              </Link>
            </header>

            {errorMessage ? (
              <div className={styles.focusedStatus}>
                <AuthStatus tone="error" title={t("profile.notSaved")}>{errorMessage}</AuthStatus>
              </div>
            ) : null}

            {mediaPreviewUnavailable ? (
              <div className={styles.focusedStatus}>
                <AuthStatus tone="warning" title={ti("profile.mediaPreviewUnavailableTitle")}>
                  {ti("profile.mediaPreviewUnavailable")}
                </AuthStatus>
              </div>
            ) : null}

            {!section ? (
              <div className={styles.editMenu}>
                <Link className={styles.editChoice} href="/ako/edit?section=avatar">
                  <span className={`${styles.choicePreview} ${styles.choiceAvatar}`} aria-hidden="true">
                    {avatarUrl ? <img src={avatarUrl} alt="" /> : initial}
                  </span>
                  <span className={styles.choiceCopy}>
                    <strong>{t("profile.profilePhoto")}</strong>
                    <small>{t("profile.squareBest")}</small>
                  </span>
                  <SocialIcon name="chevron-right" size={19} />
                </Link>

                <Link className={styles.editChoice} href="/ako/edit?section=cover">
                  <span className={`${styles.choicePreview} ${styles.choiceCover}`} aria-hidden="true">
                    {coverUrl ? <img src={coverUrl} alt="" /> : <SocialIcon name="photo" size={20} />}
                  </span>
                  <span className={styles.choiceCopy}>
                    <strong>{t("profile.coverPhoto")}</strong>
                    <small>{t("profile.wideBest")}</small>
                  </span>
                  <SocialIcon name="chevron-right" size={19} />
                </Link>

                <a className={styles.editChoice} href="/ako/edit?section=bio" data-facebai-dirty-boundary>
                  <span className={`${styles.choicePreview} ${styles.choiceIcon}`} aria-hidden="true">
                    <SocialIcon name="edit" size={19} />
                  </span>
                  <span className={styles.choiceCopy}>
                    <strong>{t("profile.bio")}</strong>
                    <small>{profile.bio || t("profile.noBio")}</small>
                  </span>
                  <SocialIcon name="chevron-right" size={19} />
                </a>

                <a className={styles.editChoice} href="/ako/edit?section=details" data-facebai-dirty-boundary>
                  <span className={`${styles.choicePreview} ${styles.choiceIcon}`} aria-hidden="true">
                    <SocialIcon name="user" size={20} />
                  </span>
                  <span className={styles.choiceCopy}>
                    <strong>{t("profile.publicIdentity")}</strong>
                    <small>{profile.display_name} · @{profile.username}</small>
                  </span>
                  <SocialIcon name="chevron-right" size={19} />
                </a>

                <div className={styles.focusedFooter}>
                  <Link className={styles.doneButton} href="/ako">{t("profile.backToProfile")}</Link>
                </div>
              </div>
            ) : null}

            {section === "avatar" ? (
              <div className={styles.focusedBody}>
                <div className={styles.sectionHeading}>
                  <h2>{t("profile.profilePhoto")}</h2>
                  <p>{t("profile.profilePhotoHelp")}</p>
                </div>
                <div className={styles.avatarEditorPreview} aria-hidden="true">
                  {avatarUrl ? <img src={avatarUrl} alt="" /> : initial}
                </div>
                <ProfileMediaUploader kind="avatar" label={t("profile.profilePhoto")} locale={locale} compact />
              </div>
            ) : null}

            {section === "cover" ? (
              <div className={styles.focusedBody}>
                <div className={styles.sectionHeading}>
                  <h2>{t("profile.coverPhoto")}</h2>
                  <p>{t("profile.coverPhotoHelp")}</p>
                </div>
                <div className={styles.coverEditorPreview} aria-hidden="true">
                  {coverUrl ? <img src={coverUrl} alt="" /> : <SocialIcon name="photo" size={28} />}
                </div>
                <ProfileMediaUploader kind="cover" label={t("profile.coverPhoto")} locale={locale} compact />
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
