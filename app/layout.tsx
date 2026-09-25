import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import "./auth-polish.css";
import "./governance.css";
import { htmlLanguage } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import { THEME_BOOTSTRAP_SCRIPT, THEME_COOKIE, parseTheme } from "@/lib/theme/config";

export const metadata: Metadata = {
  title: "FaceBai — Tambayan sa mga Bisaya",
  description: "FaceBai is a Bisaya-first social community platform.",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);
  const explicitTheme = parseTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <html
      lang={htmlLanguage(locale)}
      data-theme={explicitTheme ?? undefined}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
