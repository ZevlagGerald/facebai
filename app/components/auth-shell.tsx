import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getTranslations } from "@/lib/i18n/messages";
import styles from "./auth-shell.module.css";

export function AuthShell({
  children,
  eyebrow = "FACEBAI ACCOUNT",
  locale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  locale?: Locale;
}) {
  const t = getTranslations(locale);

  return (
    <main className="auth-shell">
      <div className="auth-background" aria-hidden="true" />
      <div className="auth-shade" aria-hidden="true" />
      <div className={styles.controls}>
        <LanguageSwitcher locale={locale} variant="auth" />
        <ThemeToggle locale={locale} />
      </div>

      <section className="auth-stage" aria-label={t("auth.accessAria")}>
        <aside className="auth-brand" aria-label="FaceBai">
          <div className="auth-logo-slot">
            <img className="logo logo-stable" src="/brand/facebai-logo-light.webp?v=stable-20260925" alt="FaceBai" />
          </div>
          <p className="auth-domain">facebai.party</p>
          <div className="auth-brand-copy">
            <h2>{t("auth.brandHeadline")}</h2>
            <p>{t("auth.brandCopy")}</p>
          </div>
        </aside>

        <div className="auth-card-wrap">
          <div className="auth-card-eyebrow">{eyebrow}</div>
          <div className="auth-card">{children}</div>
          <p className="auth-footnote">{t("auth.footnote")}</p>
        </div>
      </section>
    </main>
  );
}
