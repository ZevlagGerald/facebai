"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { commitProfileMedia } from "@/app/actions/profile";
import {
  PROFILE_MEDIA_BUCKET,
  profileMediaExtension,
  profileMediaPath,
  type ProfileMediaKind,
  validateProfileMediaFile,
} from "@/lib/profile/media";
import { createClient } from "@/lib/supabase/client";
import styles from "./profile-media-uploader.module.css";

type UploadState = "idle" | "uploading" | "success" | "error";

export function ProfileMediaUploader({
  kind,
  label,
}: {
  kind: ProfileMediaKind;
  label: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<UploadState>("idle");
  const [message, setMessage] = useState("JPEG, PNG, or WebP · max 5 MB");
  const inputId = `profile-media-${kind}`;

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    const fileError = validateProfileMediaFile(file);
    if (fileError) {
      setState("error");
      setMessage(fileError);
      return;
    }

    const extension = profileMediaExtension(file.type);
    if (!extension) return;

    setState("uploading");
    setMessage(`Uploading ${label.toLowerCase()}…`);

    const supabase = createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setState("error");
      setMessage("Your session expired. Sign in again and retry.");
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
      setState("error");
      setMessage("Upload failed. Check the image and try again.");
      return;
    }

    const commit = await commitProfileMedia({ kind, path });
    if (!commit.ok) {
      await supabase.storage.from(PROFILE_MEDIA_BUCKET).remove([path]);
      setState("error");
      setMessage(commit.error);
      return;
    }

    setState("success");
    setMessage(`${label} updated.`);
    router.refresh();
  }

  return (
    <div className={styles.uploader}>
      <div className={styles.heading}>
        <strong>{label}</strong>
        <span>{kind === "avatar" ? "Square works best" : "Wide image works best"}</span>
      </div>
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
      >
        {state === "uploading" ? "Uploading…" : `Choose ${label.toLowerCase()}`}
      </label>
      <p
        className={`${styles.status} ${state === "error" ? styles.error : ""} ${state === "success" ? styles.success : ""}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}
