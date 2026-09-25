import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { ThemeToggle } from "@/app/components/theme-toggle";
import styles from "@/app/tambayan/tambayan.module.css";

type ActiveRail = "tambayan" | "ako" | null;

const topNav = [
  { label: "Tambayan", helper: "Home feed", href: "/tambayan" },
  { label: "Mga Bai", helper: "Friends", badge: "PUHON" },
  { label: "Pundok", helper: "Groups", badge: "PUHON" },
  { label: "Bai & Sell", helper: "Marketplace", badge: "PUHON" },
] as const;

const railLinkStyle = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  color: "inherit",
  textDecoration: "none",
} as const;

export function SocialShell({
  displayName,
  username,
  activeRail,
  children,
  rightRail,
  contentLabel,
}: {
  displayName: string;
  username: string;
  activeRail: ActiveRail;
  children: ReactNode;
  rightRail: ReactNode;
  contentLabel: string;
}) {
  const initial = displayName.charAt(0).toUpperCase() || "B";

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/tambayan" aria-label="FaceBai Tambayan">
          <img src="/brand/facebai-logo-light.webp?v=stable-20260925" alt="FaceBai" />
        </Link>

        <label className={styles.search} aria-label="Search FaceBai">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Pangitaa ang imong Bai..." disabled aria-describedby="search-puhon" />
          <small id="search-puhon">Puhon</small>
        </label>

        <nav className={styles.topnav} aria-label="FaceBai main navigation">
          {topNav.map((item) => {
            const active = item.href === "/tambayan" && activeRail === "tambayan";
            if (item.href) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navActive : ""}`}
                  aria-current={active ? "page" : undefined}
                  aria-label={`${item.label}: ${item.helper}`}
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <span
                key={item.label}
                className={styles.navItem}
                aria-disabled="true"
                aria-label={`${item.label}: ${item.helper}, coming soon`}
              >
                {item.label}
                {item.badge ? <b>{item.badge}</b> : null}
              </span>
            );
          })}
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
            <span className={activeRail === "tambayan" ? styles.railActive : undefined}>
              <Link href="/tambayan" aria-current={activeRail === "tambayan" ? "page" : undefined} style={railLinkStyle}>
                Tambayan <small>Home</small>
              </Link>
            </span>
            <span className={activeRail === "ako" ? styles.railActive : undefined}>
              <Link href="/ako" aria-current={activeRail === "ako" ? "page" : undefined} style={railLinkStyle}>
                Ako <small>Profile</small>
              </Link>
            </span>
            <span aria-disabled="true">Mga Bai <small>Friends · puhon</small></span>
            <span aria-disabled="true">Pundok <small>Groups · puhon</small></span>
            <span aria-disabled="true">Mga Litrato <small>Photos · puhon</small></span>
            <span aria-disabled="true">Lingaw <small>Entertainment · puhon</small></span>
          </div>

          <p className={styles.railQuote}>“Kuan sa... ginahimo pa nato.”</p>
        </aside>

        <section className={styles.feed} aria-label={contentLabel}>
          {children}
        </section>

        <aside className={styles.rightRail} aria-label="FaceBai updates">
          {rightRail}
        </aside>
      </div>
    </main>
  );
}
