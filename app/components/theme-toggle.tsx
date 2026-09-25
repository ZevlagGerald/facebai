"use client";

import { useEffect, useState } from "react";
import { SocialIcon } from "@/app/components/social-icons";

export function ThemeToggle({ variant = "text" }: { variant?: "text" | "icon" }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {variant === "icon" ? (
        <SocialIcon name={theme === "light" ? "moon" : "sun"} size={19} />
      ) : (
        theme === "light" ? "Dark" : "Light"
      )}
    </button>
  );
}
