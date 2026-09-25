"use client";

import { useFormStatus } from "react-dom";
import { getInteractionTranslations } from "@/lib/i18n/interaction";
import type { Locale } from "@/lib/i18n/config";
import styles from "./language-switcher.module.css";

export function LocaleOptionButton({
  option,
  currentLocale,
  label,
}: {
  option: Locale;
  currentLocale: Locale;
  label: string;
}) {
  const { pending } = useFormStatus();
  const ti = getInteractionTranslations(currentLocale);

  return (
    <button
      className={styles.option}
      type="submit"
      name="locale"
      value={option}
      role="menuitem"
      aria-current={option === currentLocale ? "true" : undefined}
      aria-busy={pending || undefined}
      aria-disabled={pending}
      disabled={pending}
      data-facebai-action
      data-facebai-pending={pending ? "true" : "false"}
    >
      <strong>{pending ? ti("language.changing") : label}</strong>
      <small>{option.toUpperCase()}</small>
      <span className={styles.check} aria-hidden="true">{option === currentLocale ? "✓" : ""}</span>
    </button>
  );
}
