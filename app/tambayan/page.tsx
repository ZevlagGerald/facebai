import Link from "next/link";
import { redirect } from "next/navigation";
import profileStyles from "@/app/components/profile-surface.module.css";
import { SocialIcon } from "@/app/components/social-icons";
import { SocialShell } from "@/app/components/social-shell";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import { getF2SocialTranslations } from "@/lib/i18n/f2-social";
import { getLocale } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import styles from "./tambayan.module.css";

export const dynamic = "force-dynamic";

export default async function TambayanPage() {
  const locale = await getLocale();
  const t = getF2SocialTranslations(locale);
  const ti = getInteractionTranslations(locale);
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) redirect("/login");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return (
      <main className={styles.shell}>
        <div className={styles.layout}>
          <aside className={styles.leftRail} aria-hidden="true" />
          <section className={styles.feed} aria-label={ti("profile.loadFailedTitle")}>
            <header className={styles.feedHeading}>
              <div>
                <p className={styles.eyebrow}>FACEBAI</p>
                <h1 id="profile-load-failed-title">{ti("profile.loadFailedTitle")}</h1>
              </div>
            </header>

            <section
              className={styles.emptyFeed}
              role="alert"
              aria-labelledby="profile-load-failed-title"
            >
              <div className={styles.emptyMark} aria-hidden="true">
                <SocialIcon name="user" size={24} />
              </div>
              <p>{ti("profile.loadFailed")}</p>
              <Link className={profileStyles.secondaryLink} href="/tambayan">
                {ti("common.retry")}
              </Link>
            </section>
          </section>
          <aside className={styles.rightRail} aria-hidden="true" />
        </div>
      </main>
    );
  }

  const displayName = profile.display_name.trim();
  const username = profile.username;
  const initial = displayName.charAt(0).toUpperCase() || "B";

  const rightRail = (
    <>
      <section className={`${styles.sideCard} ${styles.marketCard}`}>
        <div className={styles.cardHeading}>
          <div className={styles.sideTitleLead}>
            <span className={styles.sideIcon} aria-hidden="true"><SocialIcon name="market" size={19} /></span>
            <div>
              <p className={styles.eyebrow}>{t("feed.marketEyebrow")}</p>
              <h2>Bai & Sell</h2>
            </div>
          </div>
          <span className={styles.puhonBadge}>{t("common.puhon")}</span>
        </div>
        <p className={styles.marketPitch}>{t("feed.marketPitch")}</p>
        <p>{t("feed.marketBody")}</p>
        <button type="button" disabled>{t("feed.marketDisabled")}</button>
        <small>{t("feed.marketFootnote")}</small>
      </section>

      <section className={styles.sideCard} aria-label={t("feed.notificationsAria")}>
        <div className={styles.cardHeading}>
          <div className={styles.sideTitleLead}>
            <span className={styles.sideIcon} aria-hidden="true"><SocialIcon name="bell" size={19} /></span>
            <div>
              <p className={styles.eyebrow}>{t("feed.notificationsEyebrow")}</p>
              <h2>{t("feed.notificationsTitle")}</h2>
            </div>
          </div>
          <span className={styles.puhonBadge}>{t("common.puhon")}</span>
        </div>
        <div className={styles.quietState}>
          <strong>{t("feed.notificationsEmpty")}</strong>
          <span>{t("feed.notificationsBody")}</span>
        </div>
      </section>
    </>
  );

  return (
    <SocialShell
      displayName={displayName}
      username={username}
      activeRail="tambayan"
      contentLabel={t("feed.contentLabel")}
      rightRail={rightRail}
      locale={locale}
    >
      <header className={styles.feedHeading}>
        <div>
          <p className={styles.eyebrow}>{t("feed.homeFeed")}</p>
          <h1>{t("feed.title")}</h1>
        </div>
        <p>{t("feed.welcome")}, {displayName}.</p>
      </header>

      <section className={styles.composer} aria-label={t("feed.createPostPreview")}>
        <div className={styles.composerTop}>
          <div className={styles.avatarSmall} aria-hidden="true">{initial}</div>
          <button type="button" disabled>{t("feed.composerPrompt")}</button>
          <span className={styles.composerState}>{t("common.puhon")}</span>
        </div>
        <div className={styles.composerActions}>
          <button type="button" disabled>
            <span className={styles.composerActionIcon}><SocialIcon name="photo" size={19} /></span>
            <span>{t("feed.photo")}</span>
          </button>
          <button type="button" disabled>
            <span className={styles.composerActionIcon}><SocialIcon name="friends" size={19} /></span>
            <span>{t("feed.withBai")}</span>
          </button>
          <button type="button" disabled>
            <span className={styles.composerActionIcon}><SocialIcon name="sparkles" size={19} /></span>
            <span>{t("feed.post")}</span>
          </button>
        </div>
      </section>

      <section className={styles.emptyFeed}>
        <div className={styles.emptyMark} aria-hidden="true"><SocialIcon name="sparkles" size={24} /></div>
        <h2>{t("feed.emptyTitle")}</h2>
        <p>{t("feed.emptyBody")}</p>
        <span className={styles.puhonPill}>{t("feed.postsAndFeed")}</span>
      </section>
    </SocialShell>
  );
}
