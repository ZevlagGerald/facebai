"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthStatus } from "@/app/components/auth-status";
import { GovernedButton } from "@/app/components/governed-button";
import { GovernedDialog } from "@/app/components/governed-dialog";
import { ProfileEditForm } from "@/app/components/profile-edit-form";
import { ProfileMediaUploader } from "@/app/components/profile-media-uploader";
import { SocialIcon } from "@/app/components/social-icons";
import { type Locale } from "@/lib/i18n/config";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import { getTranslations } from "@/lib/i18n/messages";
import styles from "./profile-surface.module.css";

export type ProfileContextualEditMode = "profile" | "avatar" | "cover" | "bio" | "details";

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
  const [textDirty, setTextDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const textMode = mode === "bio" || mode === "details";
  const initial = displayName.charAt(0).toUpperCase() || "B";
  const mediaUnavailable = mode === "avatar"
    ? avatarConfigured && !avatarUrl
    : mode === "cover"
      ? coverConfigured && !coverUrl
      : mode === "profile"
        ? (avatarConfigured && !avatarUrl) || (coverConfigured && !coverUrl)
        : false;

  const title = mode === "avatar"
    ? t("profile.profilePhoto")
    : mode === "cover"
      ? t("profile.coverPhoto")
      : mode === "bio"
        ? t("profile.bio")
        : mode === "details"
          ? t("profile.publicIdentity")
          : t("profile.editProfile");

  function closeToProfile() {
    router.back();
  }

  function requestClose() {
    if (textMode && textDirty) {
      setDiscardOpen(true);
      return;
    }
    closeToProfile();
  }

  function completeTask() {
    setTextDirty(false);
    router.replace("/ako?updated=1", { scroll: false });
  }

  function discardAndClose() {
    setTextDirty(false);
    setDiscardOpen(false);
    closeToProfile();
  }

  return (
    <>
      <GovernedDialog
        open
        title={title}
        closeLabel={t("common.cancel")}
        onClose={requestClose}
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

            <Link className={styles.editChoice} href="/ako?edit=bio" replace scroll={false}>
              <span className={`${styles.choicePreview} ${styles.choiceIcon}`} aria-hidden="true">
                <SocialIcon name="edit" size={19} />
              </span>
              <span className={styles.choiceCopy}>
                <strong>{t("profile.bio")}</strong>
                <small>{bio || t("profile.noBio")}</small>
              </span>
              <SocialIcon name="chevron-right" size={19} />
            </Link>

            <Link className={styles.editChoice} href="/ako?edit=details" replace scroll={false}>
              <span className={`${styles.choicePreview} ${styles.choiceIcon}`} aria-hidden="true">
                <SocialIcon name="user" size={20} />
              </span>
              <span className={styles.choiceCopy}>
                <strong>{t("profile.publicIdentity")}</strong>
                <small>{displayName} · @{username}</small>
              </span>
              <SocialIcon name="chevron-right" size={19} />
            </Link>
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

        {mode === "bio" || mode === "details" ? (
          <ProfileEditForm
            section={mode}
            displayName={displayName}
            username={username}
            bio={bio}
            locale={locale}
            embedded
            onDirtyChange={setTextDirty}
            onSaved={completeTask}
          />
        ) : null}
      </GovernedDialog>

      <GovernedDialog
        open={discardOpen}
        title={ti("profile.discardTitle")}
        closeLabel={t("common.cancel")}
        onClose={() => setDiscardOpen(false)}
        footer={(
          <>
            <GovernedButton type="button" variant="secondary" onClick={() => setDiscardOpen(false)} data-dialog-initial-focus>
              {ti("profile.keepEditing")}
            </GovernedButton>
            <GovernedButton type="button" variant="danger" onClick={discardAndClose}>
              {ti("profile.discardChanges")}
            </GovernedButton>
          </>
        )}
      >
        <p>{ti("profile.discardBody")}</p>
      </GovernedDialog>
    </>
  );
}
