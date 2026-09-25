import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/actions/auth";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { SocialIcon, type SocialIconName } from "@/app/components/social-icons";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getTranslations, type MessageKey } from "@/lib/i18n/messages";
import styles from "@/app/tambayan/tambayan.module.css";

type ActiveRail = "tambayan" | "ako" | null;
type IconTone = "home" | "friends" | "groups" | "market" | "profile" | "photos" | "fun";
type NavItem = {
  labelKey: MessageKey;
  helperKey: MessageKey;
  icon: SocialIconName;
  tone: IconTone;
  href?: string;
  comingSoon?: boolean;
};

const topNav: readonly NavItem[] = [
  { labelKey: "nav.tambayan", helperKey: "nav.tambayanHelper", icon: "home", tone: "home", href: "/tambayan" },
  { labelKey: "nav.friends", helperKey: "nav.friendsHelper", icon: "friends", tone: "friends", comingSoon: true },
  { labelKey: "nav.groups", helperKey: "nav.groupsHelper", icon: "groups", tone: "groups", comingSoon: true },
  { labelKey: "nav.market", helperKey: "nav.marketHelper", icon: "market", tone: "market", comingSoon: true },
];

const personalShortcuts: readonly NavItem[] = [
  { labelKey: "nav.profile", helperKey: "common.profile", icon: "user", tone: "profile", href: "/ako" },
  { labelKey: "nav.photos", helperKey: "nav.photos", icon: "photo", tone: "photos", comingSoon: true },
  { labelKey: "nav.fun", helperKey: "nav.fun", icon: "sparkles", tone: "fun", comingSoon: true },
];

export function SocialShell({
  displayName,
  username,
  activeRail,
  children,
  rightRail,
  contentLabel,
  locale = DEFAULT_LOCALE,
}: {
  displayName: string;
  username: string;
  activeRail: ActiveRail;
  children: ReactNode;
  rightRail: ReactNode;
  contentLabel: string;
  locale?: Locale;
}) {
  const initial = displayName.charAt(0).toUpperCase() || "B";
  const t = getTranslations(locale);

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.headerLeft}>
          <Link className={styles.brand} href="/tambayan" aria-label="FaceBai">
            <img src="/brand/facebai-logo-light.webp?v=stable-20260925" alt="FaceBai" />
          </Link>

          <label className={styles.search} aria-label={t("nav.searchPlaceholder")}>
            <SocialIcon name="search" size={18} />
            <input type="search" placeholder={t("nav.searchPlaceholder")} disabled aria-describedby="search-puhon" />
            <small id="search-puhon" className={styles.puhonMini}>{t("common.puhon")}</small>
          </label>
        </div>

        <nav className={styles.topnav} aria-label="FaceBai">
          {topNav.map((item) => {
            const label = t(item.labelKey);
            const helper = t(item.helperKey);
            const active = item.href === "/tambayan" && activeRail === "tambayan";

            if (item.href) {
              return (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.navActive : ""}`}
                  aria-current={active ? "page" : undefined}
                  aria-label={`${label}: ${helper}`}
                >
                  <span className={styles.navGlyph} data-tone={item.tone}><SocialIcon name={item.icon} size={20} /></span>
                  <span className={styles.navLabel}>{label}</span>
                </Link>
              );
            }

            return (
              <span
                key={item.labelKey}
                className={`${styles.navItem} ${styles.navDisabled}`}
                aria-disabled="true"
                aria-label={`${label}: ${helper}, ${t("common.comingSoon")}`}
              >
                <span className={styles.navGlyph} data-tone={item.tone}><SocialIcon name={item.icon} size={20} /></span>
                <span className={styles.navLabel}>{label}</span>
                {item.comingSoon ? <b className={styles.navBadge}>{t("common.puhon")}</b> : null}
              </span>
            );
          })}
        </nav>

        <div className={styles.headerActions}>
          <LanguageSwitcher locale={locale} />
          <button className={styles.utilityButton} type="button" disabled aria-label={t("common.notificationsComingSoon")} title={t("nav.notificationsTitle")}>
            <SocialIcon name="bell" size={19} />
            <span className={styles.utilityLabel}>Hoy!</span>
            <span className={styles.noticeDot} aria-hidden="true" />
          </button>
          <ThemeToggle variant="icon" />

          <details className={styles.accountMenu} name="facebai-header-menu">
            <summary aria-label={t("nav.accountMenu")} title={t("nav.accountMenu")}>
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
                {t("nav.profileMenu")}
              </Link>
              <form action={logout}>
                <button type="submit" className={styles.logout} aria-label={t("nav.logoutAria")}>{t("common.logout")}</button>
              </form>
            </div>
          </details>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.leftRail} aria-label={t("nav.shortcuts")}>
          <Link className={styles.profileMini} href="/ako" aria-label={`${t("common.profile")}: ${displayName}`}>
            <div className={styles.avatar} aria-hidden="true">{initial}</div>
            <div>
              <strong>{displayName}</strong>
              <span>@{username}</span>
            </div>
          </Link>

          <p className={styles.railHeading}>{t("nav.shortcuts")}</p>
          <div className={styles.railMenu}>
            {personalShortcuts.map((item) => {
              const label = t(item.labelKey);
              const active = item.href === "/ako" && activeRail === "ako";

              if (item.href) {
                return (
                  <Link
                    key={item.labelKey}
                    className={`${styles.railItem} ${active ? styles.railActive : ""}`}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className={styles.railIcon} data-tone={item.tone}><SocialIcon name={item.icon} size={19} /></span>
                    <span>{label}</span>
                  </Link>
                );
              }

              return (
                <span key={item.labelKey} className={`${styles.railItem} ${styles.railDisabled}`} aria-disabled="true">
                  <span className={styles.railIcon} data-tone={item.tone}><SocialIcon name={item.icon} size={19} /></span>
                  <span>{label}</span>
                  <small>{t("common.puhon")}</small>
                </span>
              );
            })}
          </div>

          <div className={styles.railDivider} />
          <p className={styles.railQuote}>{t("nav.quote")}</p>
        </aside>

        <section className={styles.feed} aria-label={contentLabel}>
          {children}
        </section>

        <aside className={styles.rightRail} aria-label="FaceBai">
          {rightRail}
        </aside>
      </div>
    </main>
  );
}
