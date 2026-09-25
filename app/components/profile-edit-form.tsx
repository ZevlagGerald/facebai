"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateProfileWithState,
  type ProfileUpdateErrorCode,
  type ProfileUpdateState,
} from "@/app/actions/profile";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { GovernedButton } from "@/app/components/governed-button";
import { GovernedDialog } from "@/app/components/governed-dialog";
import { InlineStatus } from "@/app/components/inline-status";
import { type Locale } from "@/lib/i18n/config";
import { getF2SocialTranslations } from "@/lib/i18n/f2-social";
import { getInteractionTranslations, type InteractionMessageKey } from "@/lib/i18n/interaction";
import formStyles from "./profile-edit-form.module.css";
import styles from "./profile-surface.module.css";

type ProfileEditSection = "bio" | "details";

const initialState: ProfileUpdateState = { errorCode: null, saved: false };

const updateErrorKey: Record<ProfileUpdateErrorCode, InteractionMessageKey> = {
  display_name: "profile.validationDisplayName",
  username: "profile.validationUsername",
  bio: "profile.validationBio",
  username_taken: "profile.usernameTaken",
  save_failed: "profile.saveFailed",
};

export function ProfileEditForm({
  section,
  displayName,
  username,
  bio,
  locale,
  embedded = false,
  onDirtyChange,
  onSaved,
}: {
  section: ProfileEditSection;
  displayName: string;
  username: string;
  bio: string;
  locale: Locale;
  embedded?: boolean;
  onDirtyChange?: (dirty: boolean) => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const t = getF2SocialTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const [state, formAction] = useActionState(updateProfileWithState, initialState);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const errorCode = state.errorCode;
  const bioError = errorCode === "bio" ? ti(updateErrorKey[errorCode]) : null;
  const displayNameError = errorCode === "display_name" ? ti(updateErrorKey[errorCode]) : null;
  const usernameError = errorCode === "username" || errorCode === "username_taken"
    ? ti(updateErrorKey[errorCode])
    : null;
  const generalError = errorCode === "save_failed" ? ti(updateErrorKey[errorCode]) : null;

  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!state.saved) return;
    setDirty(false);
    onDirtyChange?.(false);
    if (onSaved) {
      onSaved();
    } else {
      router.replace("/ako?updated=1");
    }
    // Completion is terminal for this mounted editor; the route/modal closes immediately.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.saved]);

  function markDirty() {
    if (dirty) return;
    setDirty(true);
    onDirtyChange?.(true);
  }

  function requestClose() {
    if (dirty) {
      setDiscardOpen(true);
      return;
    }
    router.push("/ako/edit");
  }

  function discardAndClose() {
    setDirty(false);
    onDirtyChange?.(false);
    setDiscardOpen(false);
    router.push("/ako/edit");
  }

  return (
    <>
      {!embedded ? (
        <header className={styles.focusedHeader}>
          <div>
            <p className={styles.eyebrow}>{t("nav.profile").toUpperCase()}</p>
            <h1>{t("profile.editProfile")}</h1>
          </div>
          <GovernedButton
            type="button"
            className={`${styles.focusedClose} ${formStyles.closeButton}`}
            unstyled
            aria-label={t("common.cancel")}
            onClick={requestClose}
          >
            ×
          </GovernedButton>
        </header>
      ) : null}

      <div className={embedded ? undefined : styles.focusedBody}>
        <div className={styles.sectionHeading}>
          {!embedded ? <h2>{section === "bio" ? t("profile.bio") : t("profile.publicIdentity")}</h2> : null}
        </div>

        {generalError ? (
          <div className={formStyles.generalStatus}>
            <InlineStatus tone="error" title={t("profile.notSaved")}>
              {generalError}
            </InlineStatus>
          </div>
        ) : null}

        <form action={formAction} className={styles.form} onChange={markDirty}>
          {section === "bio" ? (
            <>
              <input type="hidden" name="display_name" value={displayName} />
              <input type="hidden" name="username" value={username} />
              <label>
                <span>{t("profile.bio")}</span>
                <textarea
                  className={bioError ? formStyles.invalidField : undefined}
                  name="bio"
                  defaultValue={bio}
                  maxLength={500}
                  placeholder={t("profile.bioPlaceholder")}
                  autoFocus
                  aria-invalid={bioError ? true : undefined}
                  aria-describedby={bioError ? "profile-bio-help profile-bio-error" : "profile-bio-help"}
                />
                <small id="profile-bio-help" className={styles.help}>{t("profile.bioHelp")}</small>
                {bioError ? <small id="profile-bio-error" className={formStyles.fieldError} role="alert">{bioError}</small> : null}
              </label>
            </>
          ) : (
            <>
              <input type="hidden" name="bio" value={bio} />
              <label>
                <span>{t("profile.displayName")}</span>
                <input
                  className={displayNameError ? formStyles.invalidField : undefined}
                  name="display_name"
                  defaultValue={displayName}
                  minLength={2}
                  maxLength={80}
                  required
                  autoComplete="name"
                  autoFocus
                  aria-invalid={displayNameError ? true : undefined}
                  aria-describedby={displayNameError ? "profile-name-help profile-name-error" : "profile-name-help"}
                />
                <small id="profile-name-help" className={styles.help}>{t("profile.displayNameHelp")}</small>
                {displayNameError ? <small id="profile-name-error" className={formStyles.fieldError} role="alert">{displayNameError}</small> : null}
              </label>
              <label>
                <span>{t("profile.username")}</span>
                <input
                  className={usernameError ? formStyles.invalidField : undefined}
                  name="username"
                  defaultValue={username}
                  minLength={3}
                  maxLength={30}
                  pattern="[A-Za-z0-9._]+"
                  required
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={usernameError ? true : undefined}
                  aria-describedby={usernameError ? "profile-username-help profile-username-error" : "profile-username-help"}
                />
                <small id="profile-username-help" className={styles.help}>{t("profile.usernameHelp")}</small>
                {usernameError ? <small id="profile-username-error" className={formStyles.fieldError} role="alert">{usernameError}</small> : null}
              </label>
            </>
          )}

          <AuthSubmitButton idleLabel={t("profile.saveChanges")} pendingLabel={t("profile.savingChanges")} />
        </form>
      </div>

      {!embedded ? (
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
      ) : null}
    </>
  );
}
