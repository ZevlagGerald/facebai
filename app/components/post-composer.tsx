"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPostWithState, type CreatePostState } from "@/app/actions/posts";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { InlineStatus } from "@/app/components/inline-status";
import { SocialIcon } from "@/app/components/social-icons";
import { type Locale } from "@/lib/i18n/config";
import { getF2SocialTranslations } from "@/lib/i18n/f2-social";
import { getF3PostTranslations } from "@/lib/i18n/f3-posts";
import { POST_BODY_MAX_LENGTH } from "@/lib/posts/validation";
import styles from "./post-composer.module.css";

const initialState: CreatePostState = { errorCode: null, saved: false };

export function PostComposer({
  initial,
  locale,
}: {
  initial: string;
  locale: Locale;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const t = getF3PostTranslations(locale);
  const t2 = getF2SocialTranslations(locale);
  const [state, formAction] = useActionState(createPostWithState, initialState);

  useEffect(() => {
    if (!state.saved) return;
    formRef.current?.reset();
    router.refresh();
  }, [router, state.saved]);

  const fieldError = state.errorCode === "body_required"
    ? t("composer.bodyRequired")
    : state.errorCode === "body_too_long"
      ? t("composer.bodyTooLong")
      : null;

  return (
    <form ref={formRef} action={formAction} className={styles.form} aria-label={t("composer.label")}>
      <div className={styles.editorRow}>
        <div className={styles.avatar} aria-hidden="true">{initial}</div>
        <textarea
          className={styles.editor}
          name="body"
          maxLength={POST_BODY_MAX_LENGTH}
          placeholder={t("composer.placeholder")}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? "post-body-error" : undefined}
          required
        />
      </div>

      {fieldError ? (
        <div className={styles.status} id="post-body-error">
          <InlineStatus tone="error" title={t("composer.saveFailedTitle")}>
            {fieldError}
          </InlineStatus>
        </div>
      ) : null}

      {state.errorCode === "save_failed" ? (
        <div className={styles.status}>
          <InlineStatus tone="error" title={t("composer.saveFailedTitle")}>
            {t("composer.saveFailed")}
          </InlineStatus>
        </div>
      ) : null}

      {state.saved ? (
        <div className={styles.status}>
          <InlineStatus tone="success" title={t("composer.savedTitle")}>
            {t("composer.saved")}
          </InlineStatus>
        </div>
      ) : null}

      <div className={styles.footer}>
        <div className={styles.futureActions} aria-label={t2("common.puhon")}>
          <button type="button" disabled>
            <SocialIcon name="photo" size={18} /> {t2("feed.photo")}
          </button>
          <button type="button" disabled>
            <SocialIcon name="friends" size={18} /> {t2("feed.withBai")}
          </button>
        </div>
        <AuthSubmitButton
          className={styles.submit}
          idleLabel={t("composer.post")}
          pendingLabel={t("composer.posting")}
        />
      </div>
    </form>
  );
}
