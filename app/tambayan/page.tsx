import { redirect } from "next/navigation";
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
          <div>
            <p className={styles.eyebrow}>COMING SOON</p>
            <h2>Bai & Sell</h2>
          </div>
          <span className={styles.puhonBadge}>PUHON</span>
        </div>
        <p className={styles.marketPitch}>Palit. Baligya. Hangyo gamay. Walay atik.</p>
        <p>Pangita og sulit nga deal gikan sa mga Bai sa imong lugar.</p>
        <button type="button" disabled>Puhon pa</button>
        <small>Tigoma sa ang budget, Bai.</small>
      </section>

      <section className={styles.sideCard} aria-label="Notifications, coming soon">
        <div className={styles.cardHeading}>
          <div>
            <p className={styles.eyebrow}>HOY!</p>
            <h2>Mga pahibalo</h2>
          </div>
          <span className={styles.puhonBadge}>PUHON</span>
        </div>
        <div className={styles.quietState}>
          <strong>Hilom pa.</strong>
          <span>Walay nangitag gubot.</span>
        </div>
      </section>

      <section className={styles.sideCard}>
        <p className={styles.eyebrow}>FACEBAI BETA</p>
        <p className={styles.betaCopy}>Social features are arriving by module. Klaro ang “Puhon” aron kabalo ka unsay live ug unsay ginahimo pa.</p>
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
      <div className={styles.welcome}>
        <p className={styles.eyebrow}>TAMBAYAN</p>
        <h1>Maayong pag-abot, {displayName}.</h1>
        <p>Diri magsugod ang chika, updates, ug mga “pag sure oi?” moments sa mga Bai.</p>
      </div>

      <section className={styles.composer} aria-label="Create post preview">
        <div className={styles.composerTop}>
          <div className={styles.avatarSmall} aria-hidden="true">{initial}</div>
          <button type="button" disabled>Unsa&apos;y istorya nimo ron, Bai?</button>
        </div>
        <div className={styles.composerActions}>
          <button type="button" disabled>Litrato</button>
          <button type="button" disabled>Kuyog nga Bai</button>
          <button type="button" disabled>I-post na, Bai <span>PUHON</span></button>
        </div>
      </section>

      <section className={styles.emptyFeed}>
        <div className={styles.emptyMark} aria-hidden="true">…</div>
        <h2>Hilom lagi diri, Bai.</h2>
        <p>Ikaw unta sa una, pero kuan sa — ang posting module sunod pa. Dili ta mag-atiki og fake posts.</p>
        <span className={styles.puhonPill}>PUHON · POSTS & FEED</span>
      </section>
    </SocialShell>
  );
}
