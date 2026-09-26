export const TURNSTILE_DELAY_NOTICE_MS = 8_000;

export type TurnstileClientFailureKind =
  | "configuration"
  | "clock_or_cache"
  | "iframe_load"
  | "timeout"
  | "challenge"
  | "unknown";

export type TurnstileClientFailure = {
  code: string | null;
  kind: TurnstileClientFailureKind;
  retryable: boolean;
};

const CONFIGURATION_CODES = new Set([
  "110100",
  "110110",
  "110200",
  "400020",
  "400070",
]);

const TIMEOUT_CODES = new Set(["110600", "110620"]);

export function normalizeTurnstileClientErrorCode(value: unknown): string | null {
  const code = String(value ?? "").trim();
  return /^\d{3,6}$/u.test(code) ? code : null;
}

export function classifyTurnstileClientError(value: unknown): TurnstileClientFailure {
  const code = normalizeTurnstileClientErrorCode(value);

  if (!code) {
    return { code: null, kind: "unknown", retryable: true };
  }

  if (CONFIGURATION_CODES.has(code)) {
    return { code, kind: "configuration", retryable: false };
  }

  if (code === "200100") {
    return { code, kind: "clock_or_cache", retryable: false };
  }

  if (code === "200500") {
    return { code, kind: "iframe_load", retryable: true };
  }

  if (TIMEOUT_CODES.has(code)) {
    return { code, kind: "timeout", retryable: true };
  }

  if (code.startsWith("300") || code.startsWith("600")) {
    return { code, kind: "challenge", retryable: true };
  }

  return { code, kind: "unknown", retryable: true };
}
