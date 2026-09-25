import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { SocialIcon, type SocialIconName } from "@/app/components/social-icons";
import { ThemeToggle } from "@/app/components/theme-toggle";
import styles from "@/app/tambayan/tambayan.module.css";

type ActiveRail = "tambayan" | "ako" | null;
type TopNavItem = {
  label: string;
  helper: string;
  icon: SocialIconName;
  href?: string;
  badge?: string;
};

const topNav: readonly TopNavItem[] = [
  { label: "Tambayan", helper: "Home feed", icon: "home", href: "/tambayan" },
  { label: "Mga Bai", helper: "Friends", icon: "friends", badge: "PUHON" },
  { label: "Pundok", helper: "Groups", icon: "groups", badge: "PUHON" },
  { label: "Bai & Sell", helper: "Marketplace", icon: "market", badge: "PUHON" },
];

const personalShortcuts: readonly TopNavItem[] = [
  { label: "Ako", helper: "Profile", icon: "user", href: "/ako" },
  { label: "Mga Litrato", helper: "Photos", icon: "photo", badge: "PUHON" },
  { label: "Lingaw", helper: "Entertainment", icon: "sparkles", badge: "PUHON" },
];

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
          <SocialIcon name="search" size={18} />
          <input type="search" placeholder="Pangitaa ang imong Bai..." disabled aria-describedby="search-puhon" />
          <small id="search-puhon" className={styles.puhonMini}>PUHON</small>
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
                >
                  <SocialIcon name={item.icon} size={20} />
                  <span className={styles.navLabel}>{item.label}</span>
                </Link>
              );
            }

            return (
              <span
                key={item.label}
                className={`${styles.navItem} ${styles.navDisabled}`}
                aria-disabled="true"
                aria-label={`${item.label}: ${item.helper}, coming soon`}
              >
                <SocialIcon name={item.icon} size={20} />
                <span className={styles.navLabel}>{item.label}</span>
                {item.badge ? <b className={styles.navBadge}>{item.badge}</b> : null}
              </span>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          <button className={styles.utilityButton} type="button" disabled aria-label="Notifications, coming soon" title="Hoy! — coming soon">
            <SocialIcon name="bell" size={19} />
            <span className={styles.utilityLabel}>Hoy!</span>
            <span className={styles.noticeDot} aria-hidden="true" />
          </button>
          <ThemeToggle variant="icon" />

          <details className={styles.accountMenu}>
            <summary aria-label="Open FaceBai account menu" title="Account menu">
              <span className={styles.accountAvatar} aria-hidden="true">{initial}</span>
              <SocialIcon name="chevron-down" size={15} />
            </summary>
            <div className={styles.accountPopover}>
              <div className={styles.accountIdentity}>
                <span className={styles.accountAvatarLarge} aria-hidden="true">{initial}</span>
                <div>
                  <strong>{displayName}</strong>
                  <small>@{username}</small>
                </div>
              </div>
              <Link className={styles.accountLink} href="/ako">
                <SocialIcon name="user" size={18} />
                Ako · Profile
              </Link>
              <form action={logout}>
                <button type="submit" className={styles.logout} aria-label="Log out of FaceBai">Lakaw sa ko</button>
              </form>
            </div>
          </details>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.leftRail} aria-label="FaceBai personal shortcuts">
          <Link className={styles.profileMini} href="/ako" aria-label={`Open ${displayName}'s profile`}>
            <div className={styles.avatar} aria-hidden="true">{initial}</div>
            <div>
              <strong>{displayName}</strong>
              <span>@{username}</span>
            </div>
          </Link>

          <p className={styles.railHeading}>IMONG SHORTCUTS</p>
          <div className={styles.railMenu}>
            {personalShortcuts.map((item) => {
              const active = item.href === "/ako" && activeRail === "ako";
              if (item.href) {
                return (
                  <Link
                    key={item.label}
                    className={`${styles.railItem} ${active ? styles.railActive : ""}`}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className={styles.railIcon}><SocialIcon name={item.icon} size={19} /></span>
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return (
                <span key={item.label} className={`${styles.railItem} ${styles.railDisabled}`} aria-disabled="true">
                  <span className={styles.railIcon}><SocialIcon name={item.icon} size={19} /></span>
                  <span>{item.label}</span>
                  <small>PUHON</small>
                </span>
              );
            })}
          </div>

          <div className={styles.railDivider} />
          <p className={styles.railQuote}>“Kuan sa... ginahimo pa nato.”</p>
        </aside>

        <section className={styles.feed} aria-label={contentLabel}>
          {children}
        </section>

        <aside className={styles.rightRail} aria-label="FaceBai context and updates">
          {rightRail}
        </aside>
      </div>
    </main>
  );
}
