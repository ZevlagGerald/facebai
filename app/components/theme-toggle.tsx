"use client";

import { useEffect, useState } from "react";
import { GovernedButton } from "@/app/components/governed-button";
import { SocialIcon } from "@/app/components/social-icons";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getInteractionTranslations } from "@/lib/i18n/interaction";

export function ThemeToggle({
  variant = "text",
  locale = DEFAULT_LOCALE,
}: {
  variant?: "text" | "icon";
  locale?: Locale;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const ti = getInteractionTranslations(locale);

  useEffect(() => {
    const stored = window.localStorage.getItem("facebai-theme");
    const initial = stored === "dark" || stored === "light"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("facebai-theme", next);
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
