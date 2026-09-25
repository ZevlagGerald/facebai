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
import { getTranslations } from "@/lib/i18n/messages";
import { getInteractionTranslations, type InteractionMessageKey } from "@/lib/i18n/interaction";
import styles from "./profile-surface.module.css";

type ProfileEditSection = "bio" | "details";

const initialState: ProfileUpdateState = { errorCode: null };

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
}: {
  section: ProfileEditSection;
  displayName: string;
  username: string;
  bio: string;
  locale: Locale;
}) {
  const router = useRouter();
  const t = getTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const [state, formAction] = useActionState(updateProfileWithState, initialState);
  const [dirty, setDirty] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);

  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function requestClose() {
    if (dirty) {
      setDiscardOpen(true);
      return;
    }
    router.push("/ako/edit");
  }

  function discardAndClose() {
    setDirty(false);
    setDiscardOpen(false);
    router.push("/ako/edit");
  }

  return (
    <>
      <header className={styles.focusedHeader}>
        <div>
          <p className={styles.eyebrow}>{t("nav.profile").toUpperCase()}</p>
          <h1>{t("profile.editProfile")}</h1>
        </div>
        <GovernedButton
          type="button"
          className={styles.focusedClose}
          unstyled
          aria-label={t("common.cancel")}
          onClick={requestClose}
        >
          ×
        </GovernedButton>
      </header>

      <div className={styles.focusedBody}>
        <div className={styles.sectionHeading}>
          <h2>{section === "bio" ? t("profile.bio") : t("profile.publicIdentity")}</h2>
        </div>

        {state.errorCode ? (
          <div className={styles.focusedStatus}>
            <InlineStatus tone="error" title={t("profile.notSaved")}>
              {ti(updateErrorKey[state.errorCode])}
            </InlineStatus>
          </div>
        ) : null}

        <form action={formAction} className={styles.form} onChange={() => setDirty(true)}>
          {section === "bio" ? (
            <>
              <input type="hidden" name="display_name" value={displayName} />
              <input type="hidden" name="username" value={username} />
              <label>
                <span>{t("profile.bio")}</span>
                <textarea
                  name="bio"
                  defaultValue={bio}
                  maxLength={500}
                  placeholder={t("profile.bioPlaceholder")}
                  autoFocus
                />
                <small className={styles.help}>{t("profile.bioHelp")}</small>
              </label>
            </>
          ) : (
            <>
              <input type="hidden" name="bio" value={bio} />
              <label>
                <span>{t("profile.displayName")}</span>
                <input
                  name="display_name"
                  defaultValue={displayName}
                  minLength={2}
                  maxLength={80}
                  required
                  autoComplete="name"
                  autoFocus
                />
                <small className={styles.help}>{t("profile.displayNameHelp")}</small>
              </label>
              <label>
                <span>{t("profile.username")}</span>
                <input
                  name="username"
                  defaultValue={username}
                  minLength={3}
                  maxLength={30}
                  pattern="[A-Za-z0-9._]+"
                  required
                  autoCapitalize="none"
                  spellCheck={false}
                />
                <small className={styles.help}>{t("profile.usernameHelp")}</small>
              </label>
            </>
          )}

          <AuthSubmitButton idleLabel={t("profile.saveChanges")} pendingLabel={t("profile.savingChanges")} />
        </form>
      </div>

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
