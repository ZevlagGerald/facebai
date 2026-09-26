export type AuthProviderErrorLike = {
  code?: string | null;
};

export type AuthProviderFailureKind =
  | "captcha"
  | "request_rate_limit"
  | "email_rate_limit"
  | "user_not_found"
  | "other";

export function authProviderFailureKind(error: unknown): AuthProviderFailureKind {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as AuthProviderErrorLike).code ?? "")
      : "";

  switch (code) {
    case "captcha_failed":
      return "captcha";
    case "over_request_rate_limit":
      return "request_rate_limit";
    case "over_email_send_rate_limit":
      return "email_rate_limit";
    case "user_not_found":
      return "user_not_found";
    default:
      return "other";
  }
}
