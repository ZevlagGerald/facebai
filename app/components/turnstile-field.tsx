"use client";

import Script from "next/script";

export function TurnstileField({ action }: { action: "register" | "login" }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
      <div
        className="cf-turnstile"
        data-sitekey={siteKey}
        data-theme="auto"
        data-action={action}
        data-response-field-name="cf-turnstile-response"
      />
    </>
  );
}
