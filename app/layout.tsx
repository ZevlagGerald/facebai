import type { Metadata } from "next";
import "./globals.css";
import "./auth-polish.css";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ceb" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
