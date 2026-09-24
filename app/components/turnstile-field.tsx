"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

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

export function TurnstileField({ action }: { action: TurnstileAction }) {
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
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  const retry = () => {
    setToken("");
    setStatus("ready");
    setSubmitEnabled(false);
    if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
  };

  if (!siteKey) {
    return (
      <div className="turnstile-panel turnstile-error" role="alert">
        <strong>Security check unavailable.</strong>
        <span>FaceBai cannot safely submit this form right now. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className={`turnstile-panel turnstile-${status}`}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setStatus("error")}
      />
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
      <div className="turnstile-heading">
        <span className="turnstile-dot" aria-hidden="true" />
        <strong>Security check</strong>
      </div>
      <p className="turnstile-message" role="status" aria-live="polite">
        {status === "loading" ? "Loading secure verification…" : null}
        {status === "ready" ? "Complete the check below to continue." : null}
        {status === "verified" ? "Security check completed." : null}
        {status === "expired" ? "Security check expired. Please verify again." : null}
        {status === "error" ? "Security check failed to load. Please retry." : null}
      </p>
      <div ref={containerRef} className="turnstile-widget" />
      {(status === "expired" || status === "error") ? (
        <button type="button" className="turnstile-retry" onClick={retry}>Retry security check</button>
      ) : null}
    </div>
  );
}
