"use client";

import { useEffect, useState } from "react";
import { GovernedButton } from "@/app/components/governed-button";
import { SocialIcon } from "@/app/components/social-icons";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import {
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  THEME_STORAGE_KEY,
  parseTheme,
  type Theme,
} from "@/lib/theme/config";

function persistTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function ThemeToggle({
  variant = "text",
  locale = DEFAULT_LOCALE,
}: {
  variant?: "text" | "icon";
  locale?: Locale;
}) {
  const [theme, setTheme] = useState<Theme>("light");
  const ti = getInteractionTranslations(locale);

  useEffect(() => {
    const initial = parseTheme(document.documentElement.dataset.theme)
      ?? parseTheme(window.localStorage.getItem(THEME_STORAGE_KEY))
      ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    persistTheme(next);
    setTheme(next);
  }

  const nextTheme = theme === "light" ? "dark" : "light";
  const actionLabel = nextTheme === "dark" ? ti("theme.switchDark") : ti("theme.switchLight");

  return (
    <GovernedButton
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={actionLabel}
      title={actionLabel}
      unstyled
    >
      {variant === "icon" ? (
        <SocialIcon name={theme === "light" ? "moon" : "sun"} size={19} />
      ) : (
        theme === "light" ? "Dark" : "Light"
      )}
    </GovernedButton>
  );
}
