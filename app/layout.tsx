import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaceBai — Tambayan sa Tanang Bisaya",
  description: "FaceBai is a Bisaya-first social community at facebai.party.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ceb">
      <body>{children}</body>
    </html>
  );
}
