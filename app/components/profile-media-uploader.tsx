"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  commitProfileMedia,
  type CommitProfileMediaErrorCode,
} from "@/app/actions/profile";
import { GovernedButton } from "@/app/components/governed-button";
import { InlineStatus } from "@/app/components/inline-status";
import { ProgressIndicator } from "@/app/components/progress-indicator";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getTranslations } from "@/lib/i18n/messages";
import { getInteractionTranslations, type InteractionMessageKey } from "@/lib/i18n/interaction";
import {
  PROFILE_MEDIA_BUCKET,
  profileMediaExtension,
  profileMediaPath,
  type ProfileMediaKind,
  type ProfileMediaValidationCode,
  validateProfileMediaFileCode,
} from "@/lib/profile/media";
import { createClient } from "@/lib/supabase/client";
import styles from "./profile-media-uploader.module.css";

type UploadState = "idle" | "uploading" | "success" | "error";

const validationMessageKey: Record<ProfileMediaValidationCode, InteractionMessageKey> = {
  invalid_type: "profile.mediaInvalidType",
  empty: "profile.mediaEmpty",
  too_large: "profile.mediaTooLarge",
};

const commitMessageKey: Record<CommitProfileMediaErrorCode, InteractionMessageKey> = {
  unsupported_kind: "profile.mediaUploadFailed",
  session_expired: "profile.mediaSessionExpired",
  invalid_path: "profile.mediaVerifyFailed",
  invalid_file: "profile.mediaVerifyFailed",
  verify_failed: "profile.mediaVerifyFailed",
  profile_load_failed: "profile.mediaProfileLoadFailed",
  save_failed: "profile.mediaSaveFailed",
};

function isRetryableCommitError(code: CommitProfileMediaErrorCode) {
  return code === "verify_failed" || code === "profile_load_failed" || code === "save_failed";
}

export function ProfileMediaUploader({
  kind,
  label,
  locale = DEFAULT_LOCALE,
  compact = false,
}: {
  kind: ProfileMediaKind;
  label: string;
  locale?: Locale;
  compact?: boolean;
}) {
  const router = useRouter();
  const t = getTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState(t("profile.mediaDefault"));
  const [retryFile, setRetryFile] = useState<File | null>(null);
  const inputId = `profile-media-${kind}`;

  async function uploadFile(file: File) {
    const fileError = validateProfileMediaFileCode(file);
    if (fileError) {
      setRetryFile(null);
      setState("error");
      setMessage(ti(validationMessageKey[fileError]));
      return;
    }

    const extension = profileMediaExtension(file.type);
    if (!extension) {
      setRetryFile(null);
      setState("error");
      setMessage(ti("profile.mediaInvalidType"));
      return;
    }

    setRetryFile(null);
    setState("uploading");
    setMessage(`${t("profile.mediaUploading")} ${label.toLowerCase()}…`);

    try {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setRetryFile(null);
        setState("error");
        setMessage(ti("profile.mediaSessionExpired"));
        return;
      }

      const path = profileMediaPath(userData.user.id, kind, crypto.randomUUID(), extension);
      const { error: uploadError } = await supabase.storage
        .from(PROFILE_MEDIA_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        setRetryFile(file);
        setState("error");
        setMessage(ti("profile.mediaUploadFailed"));
        return;
      }

      const commit = await commitProfileMedia({ kind, path });
      if (!commit.ok) {
        try {
          await supabase.storage.from(PROFILE_MEDIA_BUCKET).remove([path]);
        } catch {
          // Best-effort orphan cleanup only; the profile commit explicitly failed.
        }
        setRetryFile(isRetryableCommitError(commit.errorCode) ? file : null);
        setState("error");
        setMessage(ti(commitMessageKey[commit.errorCode]));
        return;
      }

      setRetryFile(null);
      setState("success");
      setMessage(`${label} ${t("profile.mediaUpdatedSuffix")}`);
      router.refresh();
    } catch {
      // Do not delete an uploaded path here. A transport failure can make server-action
      // completion ambiguous, and deleting it could remove media already committed to the profile.
      setRetryFile(file);
      setState("error");
      setMessage(ti("profile.mediaUploadFailed"));
    }
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    await uploadFile(file);
  }

  return (
    <div className={styles.uploader}>
      {!compact ? (
        <div className={styles.heading}>
          <strong>{label}</strong>
          <span>{kind === "avatar" ? t("profile.squareBest") : t("profile.wideBest")}</span>
        </div>
      ) : null}
      <input
        className={styles.fileInput}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={state === "uploading"}
        onChange={onFileChange}
      />
      <label
        className={`${styles.picker} ${state === "uploading" ? styles.pickerBusy : ""}`}
        htmlFor={inputId}
        aria-disabled={state === "uploading"}
        data-facebai-action
      >
        {state === "uploading" ? t("profile.uploading") : `${t("profile.choose")} ${label.toLowerCase()}`}
      </label>

      {state === "uploading" ? (
        <ProgressIndicator label={message} />
      ) : state === "error" ? (
        <div className={styles.feedbackStack}>
          <InlineStatus tone="error" title={ti("profile.mediaErrorTitle")}>{message}</InlineStatus>
          {retryFile ? (
            <GovernedButton type="button" variant="secondary" onClick={() => uploadFile(retryFile)}>
              {ti("profile.mediaRetry")}
            </GovernedButton>
          ) : null}
        </div>
      ) : state === "success" ? (
        <InlineStatus tone="success" title={ti("profile.mediaSuccessTitle")}>{message}</InlineStatus>
      ) : (
        <p className={styles.status}>{message}</p>
      )}
    </div>
  );
}
