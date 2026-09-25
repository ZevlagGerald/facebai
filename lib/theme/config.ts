export type Theme = "light" | "dark";

export const THEME_COOKIE = "facebai-theme";
export const THEME_STORAGE_KEY = "facebai-theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseTheme(value: string | null | undefined): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

export const THEME_BOOTSTRAP_SCRIPT = `(() => {
  try {
    const root = document.documentElement;
    const cookiePair = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith("${THEME_COOKIE}="));
    const cookieTheme = cookiePair ? cookiePair.slice("${THEME_COOKIE}=".length) : null;
    const storedTheme = window.localStorage.getItem("${THEME_STORAGE_KEY}");
    const explicitTheme = cookieTheme === "light" || cookieTheme === "dark"
      ? cookieTheme
      : storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : null;
    const resolvedTheme = explicitTheme ?? (
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );

    root.dataset.theme = resolvedTheme;

    if (explicitTheme) {
      window.localStorage.setItem("${THEME_STORAGE_KEY}", explicitTheme);
      if (!cookieTheme) {
        const secure = window.location.protocol === "https:" ? "; Secure" : "";
        document.cookie = "${THEME_COOKIE}=" + explicitTheme
          + "; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax" + secure;
      }
    }
  } catch {
    // CSS light defaults remain the final fallback when browser storage is unavailable.
  }
})();`;
