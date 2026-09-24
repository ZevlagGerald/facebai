export const FACEBAI_LEGAL_VERSION = "2026-09-24";

export function safeLocalPath(value: string | null | undefined, fallback = "/tambayan") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }

  try {
    const base = new URL("https://facebai.invalid");
    const parsed = new URL(value, base);
    if (parsed.origin !== base.origin) return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function canonicalSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return "http://localhost:3000";

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside localhost");
    }
    return url.origin;
  } catch {
    throw new Error("Invalid NEXT_PUBLIC_SITE_URL");
  }
}

export function turnstileRequired() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}
