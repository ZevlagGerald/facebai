import { setLocale } from "@/app/actions/locale";
import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/config";
import { getTranslations } from "@/lib/i18n/messages";
import styles from "./language-switcher.module.css";

export function LanguageSwitcher({
  locale,
  variant = "social",
}: {
  locale: Locale;
  variant?: "social" | "auth";
}) {
  const t = getTranslations(locale);

  return (
    <details className={`${styles.switcher} ${variant === "auth" ? styles.auth : styles.social}`}>
      <summary className={styles.summary} aria-label={t("common.language")} title={t("common.language")}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.6 2.5 4 5.5 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.5-4-9s1.4-6.5 4-9Z" />
        </svg>
        <span className={styles.currentLabel}>{LOCALE_LABELS[locale]}</span>
        <span className={styles.chevron} aria-hidden="true">▾</span>
      </summary>
      <div className={styles.menu} role="menu" aria-label={t("common.language")}>
        {SUPPORTED_LOCALES.map((option) => (
          <form key={option} action={setLocale} className={styles.optionForm}>
            <button
              className={styles.option}
              type="submit"
              name="locale"
              value={option}
              role="menuitem"
              aria-current={option === locale ? "true" : undefined}
            >
              <strong>{LOCALE_LABELS[option]}</strong>
              <small>{option.toUpperCase()}</small>
              <span className={styles.check} aria-hidden="true">{option === locale ? "✓" : ""}</span>
            </button>
          </form>
        ))}
      </div>
    </details>
  );
}
