import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { ProfileMediaUploader } from "@/app/components/profile-media-uploader";
import { SocialIcon } from "@/app/components/social-icons";
import styles from "@/app/components/profile-surface.module.css";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";
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
  const { data, error } = await supabase.storage.from(PROFILE_MEDIA_BUCKET).createSignedUrl(key, 60 * 10);
  return error ? null : data.signedUrl;
}

export default async function EditAkoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : "";
  const section = parseEditSection(params.section);

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako/edit");

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
  const initial = profile.display_name.charAt(0).toUpperCase() || "B";
  const closeHref = section ? "/ako/edit" : "/ako";

  return (
    <main className={styles.focusedPage}>
      <section className={styles.focusedDialog} aria-label={t("profile.editContentLabel")}>
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

            <Link className={styles.editChoice} href="/ako/edit?section=bio">
              <span className={`${styles.choicePreview} ${styles.choiceIcon}`} aria-hidden="true">
                <SocialIcon name="edit" size={19} />
              </span>
              <span className={styles.choiceCopy}>
                <strong>{t("profile.bio")}</strong>
                <small>{profile.bio || t("profile.noBio")}</small>
              </span>
              <SocialIcon name="chevron-right" size={19} />
            </Link>

            <Link className={styles.editChoice} href="/ako/edit?section=details">
              <span className={`${styles.choicePreview} ${styles.choiceIcon}`} aria-hidden="true">
                <SocialIcon name="user" size={20} />
              </span>
              <span className={styles.choiceCopy}>
                <strong>{t("profile.publicIdentity")}</strong>
                <small>{profile.display_name} · @{profile.username}</small>
              </span>
              <SocialIcon name="chevron-right" size={19} />
            </Link>

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

        {section === "bio" ? (
          <div className={styles.focusedBody}>
            <div className={styles.sectionHeading}>
              <h2>{t("profile.bio")}</h2>
            </div>
            <form action={updateProfile} className={styles.form}>
              <input type="hidden" name="display_name" value={profile.display_name} />
              <input type="hidden" name="username" value={profile.username} />
              <label>
                <span>{t("profile.bio")}</span>
                <textarea name="bio" defaultValue={profile.bio} maxLength={500} placeholder={t("profile.bioPlaceholder")} autoFocus />
                <small className={styles.help}>{t("profile.bioHelp")}</small>
              </label>
              <AuthSubmitButton idleLabel={t("profile.saveChanges")} pendingLabel={t("profile.savingChanges")} />
            </form>
          </div>
        ) : null}

        {section === "details" ? (
          <div className={styles.focusedBody}>
            <div className={styles.sectionHeading}>
              <h2>{t("profile.publicIdentity")}</h2>
            </div>
            <form action={updateProfile} className={styles.form}>
              <input type="hidden" name="bio" value={profile.bio} />
              <label>
                <span>{t("profile.displayName")}</span>
                <input name="display_name" defaultValue={profile.display_name} minLength={2} maxLength={80} required autoComplete="name" autoFocus />
                <small className={styles.help}>{t("profile.displayNameHelp")}</small>
              </label>
              <label>
                <span>{t("profile.username")}</span>
                <input name="username" defaultValue={profile.username} minLength={3} maxLength={30} required autoCapitalize="none" spellCheck={false} />
                <small className={styles.help}>{t("profile.usernameHelp")}</small>
              </label>
              <AuthSubmitButton idleLabel={t("profile.saveChanges")} pendingLabel={t("profile.savingChanges")} />
            </form>
          </div>
        ) : null}
      </section>
    </main>
  );
}
