import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";
import styles from "./tambayan.module.css";

export const dynamic = "force-dynamic";

const navItems = [
  { label: "Tambayan", helper: "Home feed", active: true },
  { label: "Mga Bai", helper: "Friends", active: false, badge: "PUHON" },
  { label: "Pundok", helper: "Groups", active: false, badge: "PUHON" },
  { label: "Bai & Sell", helper: "Marketplace", active: false, badge: "PUHON" },
];

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

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <a className={styles.brand} href="/tambayan" aria-label="FaceBai Tambayan">
          <img src="/brand/facebai-logo-light.webp?v=stable-20260925" alt="FaceBai" />
        </a>

        <label className={styles.search} aria-label="Search FaceBai">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Pangitaa ang imong Bai..." disabled aria-describedby="search-puhon" />
          <small id="search-puhon">Puhon</small>
        </label>

        <nav className={styles.topnav} aria-label="FaceBai main navigation">
          {navItems.map((item) => (
            <span
              key={item.label}
              className={`${styles.navItem} ${item.active ? styles.navActive : ""}`}
              aria-current={item.active ? "page" : undefined}
              aria-label={`${item.label}: ${item.helper}${item.active ? "" : ", coming soon"}`}
            >
              {item.label}
              {item.badge ? <b>{item.badge}</b> : null}
            </span>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <button className={styles.noticeButton} type="button" disabled aria-label="Notifications, coming soon">
            Hoy!
            <span>PUHON</span>
          </button>
          <ThemeToggle />
          <form action={logout}>
            <button type="submit" className={styles.logout} aria-label="Log out of FaceBai">Lakaw sa ko</button>
          </form>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.leftRail} aria-label="FaceBai shortcuts">
          <section className={styles.profileMini}>
            <div className={styles.avatar} aria-hidden="true">{initial}</div>
            <div>
              <strong>{displayName}</strong>
              <span>@{username}</span>
            </div>
          </section>

          <div className={styles.railMenu}>
            <span className={styles.railActive}>Tambayan <small>Home</small></span>
            <span aria-disabled="true">Ako <small>Profile · puhon</small></span>
            <span aria-disabled="true">Mga Bai <small>Friends · puhon</small></span>
            <span aria-disabled="true">Pundok <small>Groups · puhon</small></span>
            <span aria-disabled="true">Mga Litrato <small>Photos · puhon</small></span>
            <span aria-disabled="true">Lingaw <small>Entertainment · puhon</small></span>
          </div>

          <p className={styles.railQuote}>“Kuan sa... ginahimo pa nato.”</p>
        </aside>

        <section className={styles.feed} aria-label="Tambayan feed">
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
        </section>

        <aside className={styles.rightRail} aria-label="FaceBai updates">
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
        </aside>
      </div>
    </main>
  );
}
