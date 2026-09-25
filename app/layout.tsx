import type { Metadata } from "next";
import "./globals.css";
import "./auth-polish.css";
import { htmlLanguage } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";

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
  const locale = await getLocale();

  return (
    <html lang={htmlLanguage(locale)} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
