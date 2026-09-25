import Link from "next/link";
import { SocialIcon } from "@/app/components/social-icons";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getF2SocialTranslations } from "@/lib/i18n/f2-social";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import styles from "@/app/components/profile-surface.module.css";

export function ProfileHero({
  displayName,
  username,
  bio,
  avatarUrl,
  coverUrl,
  avatarConfigured = false,
  coverConfigured = false,
  actionHref,
  actionLabel,
  mediaEditHref,
  avatarEditHref,
  coverEditHref,
  locale = DEFAULT_LOCALE,
}: {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  avatarConfigured?: boolean;
  coverConfigured?: boolean;
  actionHref?: string;
  actionLabel?: string;
  mediaEditHref?: string;
  avatarEditHref?: string;
  coverEditHref?: string;
  locale?: Locale;
}) {
  const initial = displayName.charAt(0).toUpperCase() || "B";
  const t = getF2SocialTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const resolvedActionLabel = actionLabel ?? t("profile.editProfile");
  const coverFallbackLabel = coverConfigured ? ti("profile.coverPhotoUnavailable") : t("profile.noCover");
  const avatarFallbackLabel = avatarConfigured ? ti("profile.profilePhotoUnavailable") : t("profile.noProfilePhoto");
  const resolvedAvatarEditHref = avatarEditHref ?? (mediaEditHref ? `${mediaEditHref}?section=avatar` : undefined);
  const resolvedCoverEditHref = coverEditHref ?? (mediaEditHref ? `${mediaEditHref}?section=cover` : undefined);

  return (
    <section className={styles.hero} aria-label={`${displayName} · ${t("common.profile")}`}>
      <div className={styles.cover}>
        {coverUrl ? (
          <img className={styles.coverImage} src={coverUrl} alt={`${displayName} ${t("profile.coverPhoto")}`} />
        ) : (
          <div className={styles.coverFallback} aria-label={coverFallbackLabel}>
            <SocialIcon name="photo" size={22} />
            <span>{coverFallbackLabel}</span>
          </div>
        )}
        {resolvedCoverEditHref ? (
          <Link
            className={styles.coverEdit}
            href={resolvedCoverEditHref}
            scroll={false}
            aria-label={`${t("profile.editProfile")}: ${t("profile.coverPhoto")}`}
            title={t("profile.coverPhoto")}
          >
            <SocialIcon name="camera" size={18} />
          </Link>
        ) : null}
      </div>

      <div className={styles.identityRow}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {avatarUrl ? (
              <img className={styles.avatarImage} src={avatarUrl} alt={`${displayName} ${t("profile.profilePhoto")}`} />
            ) : (
              <span aria-label={avatarFallbackLabel}>{initial}</span>
            )}
          </div>
          {resolvedAvatarEditHref ? (
            <Link
              className={styles.avatarEdit}
              href={resolvedAvatarEditHref}
              scroll={false}
              aria-label={`${t("profile.editProfile")}: ${t("profile.profilePhoto")}`}
              title={t("profile.profilePhoto")}
            >
              <SocialIcon name="camera" size={18} />
            </Link>
          ) : null}
        </div>
        <div className={styles.identity}>
          <h1>{displayName}</h1>
          <p className={styles.handle}>@{username}</p>
          <p className={`${styles.bio} ${bio ? "" : styles.emptyBio}`}>{bio || t("profile.noBio")}</p>
        </div>
        {actionHref ? (
          <div className={styles.profileActions}>
            <Link className={styles.primaryAction} href={actionHref} scroll={false}>
              <SocialIcon name="edit" size={18} />
              {resolvedActionLabel}
            </Link>
          </div>
        ) : null}
      </div>

      <nav className={styles.profileTabs} aria-label={t("profile.sectionsAria")}>
        <span className={`${styles.profileTab} ${styles.profileTabActive}`} aria-current="page">{t("profile.tabProfile")}</span>
        <span className={styles.profileTab} aria-disabled="true">{t("profile.tabPosts")} <small>{t("common.puhon")}</small></span>
        <span className={styles.profileTab} aria-disabled="true">{t("profile.tabPhotos")} <small>{t("common.puhon")}</small></span>
      </nav>
    </section>
  );
}
