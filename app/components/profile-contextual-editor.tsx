"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthStatus } from "@/app/components/auth-status";
import { GovernedDialog } from "@/app/components/governed-dialog";
import { ProfileMediaUploader } from "@/app/components/profile-media-uploader";
import { SocialIcon } from "@/app/components/social-icons";
import { type Locale } from "@/lib/i18n/config";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import { getTranslations } from "@/lib/i18n/messages";
import styles from "./profile-surface.module.css";

export type ProfileContextualEditMode = "profile" | "avatar" | "cover";

export function ProfileContextualEditor({
  mode,
  displayName,
  username,
  bio,
  avatarUrl,
  coverUrl,
  avatarConfigured,
  coverConfigured,
  locale,
}: {
  mode: ProfileContextualEditMode;
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  avatarConfigured: boolean;
  coverConfigured: boolean;
  locale: Locale;
}) {
  const router = useRouter();
  const t = getTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const initial = displayName.charAt(0).toUpperCase() || "B";
  const mediaUnavailable = mode === "avatar"
    ? avatarConfigured && !avatarUrl
    : mode === "cover"
      ? coverConfigured && !coverUrl
      : (avatarConfigured && !avatarUrl) || (coverConfigured && !coverUrl);

  const title = mode === "avatar"
    ? t("profile.profilePhoto")
    : mode === "cover"
      ? t("profile.coverPhoto")
      : t("profile.editProfile");

  function closeToProfile() {
    // Replace rather than traversing blindly so a directly opened modal cannot send
    // the user to an unrelated previous site. Browser Back still naturally closes
    // an in-app query-backed modal because the parent /ako entry remains underneath it.
    router.replace("/ako", { scroll: false });
  }

  function completeTask() {
    router.replace("/ako?updated=1", { scroll: false });
  }

  return (
    <GovernedDialog
      open
      title={title}
      closeLabel={t("common.cancel")}
      onClose={closeToProfile}
    >
      {mediaUnavailable ? (
        <AuthStatus tone="warning" title={ti("profile.mediaPreviewUnavailableTitle")}>
          {ti("profile.mediaPreviewUnavailable")}
        </AuthStatus>
      ) : null}

      {mode === "profile" ? (
        <div className={styles.editMenu}>
          <Link className={styles.editChoice} href="/ako?edit=avatar" replace scroll={false}>
            <span className={`${styles.choicePreview} ${styles.choiceAvatar}`} aria-hidden="true">
              {avatarUrl ? <img src={avatarUrl} alt="" /> : initial}
            </span>
            <span className={styles.choiceCopy}>
              <strong>{t("profile.profilePhoto")}</strong>
              <small>{t("profile.squareBest")}</small>
            </span>
            <SocialIcon name="chevron-right" size={19} />
          </Link>

          <Link className={styles.editChoice} href="/ako?edit=cover" replace scroll={false}>
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
              <small>{bio || t("profile.noBio")}</small>
            </span>
            <SocialIcon name="chevron-right" size={19} />
          </a>

          <a className={styles.editChoice} href="/ako/edit?section=details" data-facebai-dirty-boundary>
            <span className={`${styles.choicePreview} ${styles.choiceIcon}`} aria-hidden="true">
              <SocialIcon name="user" size={20} />
            </span>
            <span className={styles.choiceCopy}>
              <strong>{t("profile.publicIdentity")}</strong>
              <small>{displayName} · @{username}</small>
            </span>
            <SocialIcon name="chevron-right" size={19} />
          </a>
        </div>
      ) : null}

      {mode === "avatar" ? (
        <div>
          <div className={styles.sectionHeading}>
            <p>{t("profile.profilePhotoHelp")}</p>
          </div>
          <div className={styles.avatarEditorPreview} aria-hidden="true">
            {avatarUrl ? <img src={avatarUrl} alt="" /> : initial}
          </div>
          <ProfileMediaUploader
            kind="avatar"
            label={t("profile.profilePhoto")}
            locale={locale}
            compact
            onSuccess={completeTask}
          />
        </div>
      ) : null}

      {mode === "cover" ? (
        <div>
          <div className={styles.sectionHeading}>
            <p>{t("profile.coverPhotoHelp")}</p>
          </div>
          <div className={styles.coverEditorPreview} aria-hidden="true">
            {coverUrl ? <img src={coverUrl} alt="" /> : <SocialIcon name="photo" size={28} />}
          </div>
          <ProfileMediaUploader
            kind="cover"
            label={t("profile.coverPhoto")}
            locale={locale}
            compact
            onSuccess={completeTask}
          />
        </div>
      ) : null}
    </GovernedDialog>
  );
}
