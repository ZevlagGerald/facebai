import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfile } from "@/app/actions/profile";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { ProfileMediaUploader } from "@/app/components/profile-media-uploader";
import { SocialShell } from "@/app/components/social-shell";
import styles from "@/app/components/profile-surface.module.css";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EditAkoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const errorMessage = typeof params.error === "string" ? params.error : "";

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) redirect("/login?next=/ako/edit");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!profile) redirect("/tambayan");

  const rightRail = (
    <div className={styles.sideStack}>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>{t("common.editProfile").toUpperCase()}</p>
        <h2>{t("profile.publicIdentity")}</h2>
        <p>{t("profile.publicIdentityBody")}</p>
        <Link className={styles.profileLink} href="/ako">{t("profile.backToProfile")}</Link>
      </section>
      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>{t("profile.urlEyebrow")}</p>
        <h2>/bai/{profile.username}</h2>
        <p>{t("profile.changeUsernamePath")}</p>
      </section>
    </div>
  );

  return (
    <SocialShell
      displayName={profile.display_name}
      username={profile.username}
      activeRail="ako"
      contentLabel={t("profile.editContentLabel")}
      rightRail={rightRail}
      locale={locale}
    >
      <section className={styles.settingsIntro}>
        <div>
          <p className={styles.eyebrow}>{t("nav.profile").toUpperCase()}</p>
          <h1>{t("profile.editProfile")}</h1>
          <p>{t("profile.editIntro")}</p>
        </div>
        <Link className={styles.settingsBack} href="/ako">{t("common.cancel")}</Link>
      </section>

      <section className={styles.editCard}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>{t("profile.mediaEyebrow")}</p>
            <h2>{t("profile.photos")}</h2>
          </div>
        </div>
        <div className={styles.mediaGrid}>
          <div className={styles.mediaPanel}>
            <h3>{t("profile.profilePhoto")}</h3>
            <p>{t("profile.profilePhotoHelp")}</p>
            <ProfileMediaUploader kind="avatar" label={t("profile.profilePhoto")} locale={locale} />
          </div>
          <div className={styles.mediaPanel}>
            <h3>{t("profile.coverPhoto")}</h3>
            <p>{t("profile.coverPhotoHelp")}</p>
            <ProfileMediaUploader kind="cover" label={t("profile.coverPhoto")} locale={locale} />
          </div>
        </div>
      </section>

      <section className={styles.editCard}>
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>{t("profile.basicInfo")}</p>
            <h2>{t("profile.nameUsernameBio")}</h2>
          </div>
        </div>

        {errorMessage ? <AuthStatus tone="error" title={t("profile.notSaved")}>{errorMessage}</AuthStatus> : null}

        <form action={updateProfile} className={styles.form}>
          <label>
            <span>{t("profile.displayName")}</span>
            <input name="display_name" defaultValue={profile.display_name} minLength={2} maxLength={80} required autoComplete="name" />
            <small className={styles.help}>{t("profile.displayNameHelp")}</small>
          </label>

          <label>
            <span>{t("profile.username")}</span>
            <input name="username" defaultValue={profile.username} minLength={3} maxLength={30} required autoCapitalize="none" spellCheck={false} />
            <small className={styles.help}>{t("profile.usernameHelp")}</small>
          </label>

          <label>
            <span>{t("profile.bio")}</span>
            <textarea name="bio" defaultValue={profile.bio} maxLength={500} placeholder={t("profile.bioPlaceholder")} />
            <small className={styles.help}>{t("profile.bioHelp")}</small>
          </label>

          <AuthSubmitButton idleLabel={t("profile.saveChanges")} pendingLabel={t("profile.savingChanges")} />
        </form>
      </section>
    </SocialShell>
  );
}
