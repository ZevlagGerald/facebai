import { redirect } from "next/navigation";
import { SocialIcon } from "@/app/components/social-icons";
import { SocialShell } from "@/app/components/social-shell";
import { createClient } from "@/lib/supabase/server";
import styles from "./tambayan.module.css";

export const dynamic = "force-dynamic";

export default async function TambayanPage() {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio")
    .eq("id", userData.user.id)
    .maybeSingle();

  const displayName = profile?.display_name?.trim() || "Bai";
  const username = profile?.username || "bai";
  const initial = displayName.charAt(0).toUpperCase() || "B";

  const rightRail = (
    <>
      <section className={`${styles.sideCard} ${styles.marketCard}`}>
        <div className={styles.cardHeading}>
          <div className={styles.sideTitleLead}>
            <span className={styles.sideIcon} aria-hidden="true"><SocialIcon name="market" size={19} /></span>
            <div>
              <p className={styles.eyebrow}>COMING SOON</p>
              <h2>Bai & Sell</h2>
            </div>
          </div>
          <span className={styles.puhonBadge}>PUHON</span>
        </div>
        <p className={styles.marketPitch}>Palit. Baligya. Hangyo gamay. Walay atik.</p>
        <p>Pangita og sulit nga deal gikan sa mga Bai sa imong lugar.</p>
        <button type="button" disabled>Bai & Sell · Puhon</button>
        <small>Tigoma sa ang budget, Bai.</small>
      </section>

      <section className={styles.sideCard} aria-label="Notifications, coming soon">
        <div className={styles.cardHeading}>
          <div className={styles.sideTitleLead}>
            <span className={styles.sideIcon} aria-hidden="true"><SocialIcon name="bell" size={19} /></span>
            <div>
              <p className={styles.eyebrow}>HOY!</p>
              <h2>Mga pahibalo</h2>
            </div>
          </div>
          <span className={styles.puhonBadge}>PUHON</span>
        </div>
        <div className={styles.quietState}>
          <strong>Wala pay pahibalo.</strong>
          <span>Dinhi makita ang updates kung maablihan na ang Hoy!.</span>
        </div>
      </section>
    </>
  );

  return (
    <SocialShell
      displayName={displayName}
      username={username}
      activeRail="tambayan"
      contentLabel="Tambayan feed"
      rightRail={rightRail}
    >
      <header className={styles.feedHeading}>
        <div>
          <p className={styles.eyebrow}>HOME FEED</p>
          <h1>Tambayan</h1>
        </div>
        <p>Maayong pag-abot, {displayName}.</p>
      </header>

      <section className={styles.composer} aria-label="Create post preview">
        <div className={styles.composerTop}>
          <div className={styles.avatarSmall} aria-hidden="true">{initial}</div>
          <button type="button" disabled>Unsa&apos;y istorya nimo ron, Bai?</button>
          <span className={styles.composerState}>PUHON</span>
        </div>
        <div className={styles.composerActions}>
          <button type="button" disabled>
            <span className={styles.composerActionIcon}><SocialIcon name="photo" size={19} /></span>
            <span>Litrato</span>
          </button>
          <button type="button" disabled>
            <span className={styles.composerActionIcon}><SocialIcon name="friends" size={19} /></span>
            <span>Kuyog nga Bai</span>
          </button>
          <button type="button" disabled>
            <span className={styles.composerActionIcon}><SocialIcon name="sparkles" size={19} /></span>
            <span>I-post na, Bai</span>
          </button>
        </div>
      </section>

      <section className={styles.emptyFeed}>
        <div className={styles.emptyMark} aria-hidden="true"><SocialIcon name="sparkles" size={24} /></div>
        <h2>Hilom pa ang Tambayan.</h2>
        <p>Puhon, dinhi makita ang mga post ug updates sa imong mga Bai.</p>
        <span className={styles.puhonPill}>POSTS & FEED · PUHON</span>
      </section>
    </SocialShell>
  );
}
