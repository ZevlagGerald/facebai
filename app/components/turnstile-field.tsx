"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getTranslations } from "@/lib/i18n/messages";

type TurnstileAction = "register" | "login" | "password-reset" | "resend-confirmation";
type TurnstileStatus = "loading" | "ready" | "verified" | "expired" | "error";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileField({
  action,
  locale = DEFAULT_LOCALE,
}: {
  action: TurnstileAction;
  locale?: Locale;
}) {
  const t = getTranslations(locale);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<TurnstileStatus>("loading");

  const setSubmitEnabled = useCallback((enabled: boolean) => {
    const form = containerRef.current?.closest("form");
    const submit = form?.querySelector<HTMLButtonElement>("[data-auth-submit]");
    if (submit) submit.disabled = !enabled;
  }, []);

  const renderWidget = useCallback(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current) return;

    setStatus("ready");
    setSubmitEnabled(false);
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      size: "flexible",
      action,
      callback: (value: string) => {
        setToken(value);
        setStatus("verified");
        setSubmitEnabled(true);
      },
      "expired-callback": () => {
        setToken("");
        setStatus("expired");
        setSubmitEnabled(false);
      },
      "error-callback": () => {
        setToken("");
        setStatus("error");
        setSubmitEnabled(false);
      },
    });
  }, [action, scriptReady, setSubmitEnabled, siteKey]);

  useEffect(() => {
    setSubmitEnabled(false);
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget, setSubmitEnabled]);

  const retry = () => {
    setToken("");
    setSubmitEnabled(false);

    if (widgetIdRef.current && window.turnstile) {
      setStatus("ready");
      window.turnstile.reset(widgetIdRef.current);
      return;
    }

    if (window.turnstile) {
      setStatus("loading");
      renderWidget();
      return;
    }

    window.location.reload();
  };

  if (!siteKey) {
    return (
      <div className="turnstile-panel turnstile-error" role="alert">
        <strong>{t("turnstile.unavailableTitle")}</strong>
        <span>{t("turnstile.unavailableBody")}</span>
      </div>
    );
  }

  return (
    <div className={`turnstile-panel turnstile-${status}`}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => {
          setToken("");
          setStatus("error");
          setSubmitEnabled(false);
        }}
      />
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
      <div className="turnstile-heading">
        <span className="turnstile-dot" aria-hidden="true" />
        <strong>{t("turnstile.title")}</strong>
      </div>
      <p className="turnstile-message" role="status" aria-live="polite">
        {status === "loading" ? t("turnstile.loading") : null}
        {status === "ready" ? t("turnstile.ready") : null}
        {status === "verified" ? t("turnstile.verified") : null}
        {status === "expired" ? t("turnstile.expired") : null}
        {status === "error" ? t("turnstile.error") : null}
      </p>
      <div ref={containerRef} className="turnstile-widget" />
      {(status === "expired" || status === "error") ? (
        <button type="button" className="turnstile-retry" onClick={retry}>{t("turnstile.retry")}</button>
      ) : null}
    </div>
  );
}
