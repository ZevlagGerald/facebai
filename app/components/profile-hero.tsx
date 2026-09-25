import Link from "next/link";
import { SocialIcon } from "@/app/components/social-icons";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getTranslations } from "@/lib/i18n/messages";
import styles from "@/app/components/profile-surface.module.css";

export function ProfileHero({
  displayName,
  username,
  bio,
  avatarUrl,
  coverUrl,
  actionHref,
  actionLabel,
  mediaEditHref,
  locale = DEFAULT_LOCALE,
}: {
  displayName: string;
  username: string;
  bio: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  actionHref?: string;
  actionLabel?: string;
  mediaEditHref?: string;
  locale?: Locale;
}) {
  const initial = displayName.charAt(0).toUpperCase() || "B";
  const t = getTranslations(locale);
  const resolvedActionLabel = actionLabel ?? t("profile.editProfile");

  return (
    <section className={styles.hero} aria-label={`${displayName} · ${t("common.profile")}`}>
      <div className={styles.cover}>
        {coverUrl ? (
          <img className={styles.coverImage} src={coverUrl} alt={`${displayName} ${t("profile.coverPhoto")}`} />
        ) : (
          <div className={styles.coverFallback} aria-label={t("profile.noCover")}>
            <SocialIcon name="photo" size={22} />
            <span>{t("profile.noCover")}</span>
          </div>
        )}
        {mediaEditHref ? (
          <Link
            className={styles.coverEdit}
            href={`${mediaEditHref}?section=cover`}
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
              <span aria-label={t("profile.noProfilePhoto")}>{initial}</span>
            )}
          </div>
          {mediaEditHref ? (
            <Link
              className={styles.avatarEdit}
              href={`${mediaEditHref}?section=avatar`}
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
            <Link className={styles.primaryAction} href={actionHref}>
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
