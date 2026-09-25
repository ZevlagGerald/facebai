export const SUPPORTED_LOCALES = ["ceb", "tl", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ceb";
export const LOCALE_COOKIE = "facebai-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ceb: "Bisaya",
  tl: "Tagalog",
  en: "English",
};

export function parseLocale(value: unknown): Locale {
  return value === "tl" || value === "en" || value === "ceb" ? value : DEFAULT_LOCALE;
}

export function htmlLanguage(locale: Locale): string {
  return locale;
}
