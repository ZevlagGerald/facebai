"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  TURNSTILE_DELAY_NOTICE_MS,
  classifyTurnstileClientError,
  type TurnstileClientFailureKind,
} from "@/lib/auth/turnstile-client";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getTurnstileInteractionCopy } from "@/lib/i18n/turnstile-interaction";
import styles from "./turnstile-field.module.css";

type TurnstileAction = "register" | "login" | "password-reset" | "resend-confirmation";
type TurnstileStatus =
  | "loading"
  | "delayed"
  | "ready"
  | "verified"
  | "expired"
  | "error"
  | "retrying";

type TurnstileFailure = {
  code: string | null;
  kind: TurnstileClientFailureKind | "unsupported";
  retryable: boolean;
};

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
  onVerifiedChange,
}: {
  action: TurnstileAction;
  locale?: Locale;
  onVerifiedChange?: (verified: boolean) => void;
}) {
  const copy = getTurnstileInteractionCopy(locale);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<TurnstileStatus>("loading");
  const [failure, setFailure] = useState<TurnstileFailure | null>(null);

  const blockSubmission = useCallback(() => {
    setToken("");
    onVerifiedChange?.(false);
  }, [onVerifiedChange]);

  const renderWidget = useCallback(() => {
    if (!siteKey || !scriptReady || !containerRef.current || !window.turnstile) return;
    if (widgetIdRef.current) return;

    setFailure(null);
    setStatus("ready");
    onVerifiedChange?.(false);

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "auto",
        size: "flexible",
        action,
        "response-field": false,
        retry: "auto",
        "retry-interval": TURNSTILE_DELAY_NOTICE_MS,
        "refresh-expired": "auto",
        "refresh-timeout": "auto",
        callback: (value: string) => {
          setFailure(null);
          setToken(value);
          setStatus("verified");
          onVerifiedChange?.(true);
        },
        "before-interactive-callback": () => {
          setFailure(null);
          setStatus("ready");
          onVerifiedChange?.(false);
        },
        "expired-callback": () => {
          blockSubmission();
          setFailure(null);
          setStatus("expired");
        },
        "timeout-callback": () => {
          blockSubmission();
          setFailure({ code: null, kind: "timeout", retryable: true });
          setStatus("error");
        },
        "unsupported-callback": () => {
          blockSubmission();
          setFailure({ code: null, kind: "unsupported", retryable: false });
          setStatus("error");
        },
        "error-callback": (rawCode: unknown) => {
          blockSubmission();
          const clientFailure = classifyTurnstileClientError(rawCode);
          setFailure(clientFailure);
          setStatus("error");
        },
      });
    } catch {
      blockSubmission();
      setFailure({ code: null, kind: "iframe_load", retryable: true });
      setStatus("error");
    }
  }, [action, blockSubmission, onVerifiedChange, scriptReady, siteKey]);

  useEffect(() => {
    onVerifiedChange?.(false);
    renderWidget();

    return () => {
      onVerifiedChange?.(false);
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [onVerifiedChange, renderWidget]);

  useEffect(() => {
    if (status !== "loading" && status !== "retrying") return;

    const timer = window.setTimeout(() => {
      setStatus((current) =>
        current === "loading" || current === "retrying" ? "delayed" : current,
      );
    }, TURNSTILE_DELAY_NOTICE_MS);

    return () => window.clearTimeout(timer);
  }, [status]);

  const retry = () => {
    blockSubmission();
    setFailure(null);
    setStatus("retrying");

    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        setFailure({ code: null, kind: "unknown", retryable: true });
        setStatus("error");
      }
      return;
    }

    if (window.turnstile) {
      if (scriptReady) {
        renderWidget();
      } else {
        setScriptReady(true);
      }
      return;
    }

    window.location.reload();
  };

  if (!siteKey) {
    return (
      <div className={`turnstile-panel turnstile-error ${styles.unavailable}`} role="alert">
        <strong>{copy.unavailableTitle}</strong>
        <span>{copy.unavailableBody}</span>
      </div>
    );
  }

  const errorMessage = !failure
    ? copy.errors.unknown
    : failure.kind === "unsupported"
      ? copy.unsupported
      : copy.errors[failure.kind];
  const message = status === "loading"
    ? copy.loading
    : status === "delayed"
      ? copy.delayed
      : status === "ready"
        ? copy.ready
        : status === "verified"
          ? copy.verified
          : status === "expired"
            ? copy.expired
            : status === "retrying"
              ? copy.retrying
              : errorMessage;
  const canRetry =
    status === "delayed" ||
    status === "expired" ||
    (status === "error" && (failure?.retryable ?? true));
  const stateClass = status === "delayed"
    ? styles.delayed
    : status === "retrying"
      ? styles.retrying
      : "";

  return (
    <div
      className={`turnstile-panel turnstile-${status} ${stateClass}`.trim()}
      data-turnstile-status={status}
      aria-busy={status === "loading" || status === "retrying" ? true : undefined}
    >
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => {
          setFailure(null);
          setScriptReady(true);
        }}
        onError={() => {
          setScriptReady(false);
          blockSubmission();
          setFailure({ code: null, kind: "iframe_load", retryable: true });
          setStatus("error");
        }}
      />
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
      <div className="turnstile-heading">
        <span className="turnstile-dot" aria-hidden="true" />
        <strong>{copy.title}</strong>
      </div>
      <p
        className="turnstile-message"
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
        aria-atomic="true"
      >
        {message}
      </p>
      {failure?.code ? (
        <p className={styles.diagnostic}>
          {copy.diagnosticLabel}: <code>{failure.code}</code>
        </p>
      ) : null}
      <div ref={containerRef} className="turnstile-widget" />
      {canRetry ? (
        <button
          type="button"
          className={`turnstile-retry ${styles.retryButton}`}
          onClick={retry}
        >
          {copy.retry}
        </button>
      ) : null}
    </div>
  );
}
