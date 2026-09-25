import Link from "next/link";
import { login } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";
import { safeLocalPath } from "@/lib/auth/security";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const message = typeof params.message === "string" ? params.message : "";
  const next = safeLocalPath(typeof params.next === "string" ? params.next : "/tambayan");

  return (
    <AuthShell eyebrow={t("auth.welcomeBack")} locale={locale}>
      <div className="auth-heading">
        <h1>{t("auth.loginTitle")}</h1>
        <p className="auth-copy">{t("auth.loginCopy")}</p>
      </div>

      {error ? <AuthStatus tone="error" title={t("auth.signInFailed")}>{error}</AuthStatus> : null}
      {message ? <AuthStatus tone="success" title={t("auth.accountUpdated")}>{message}</AuthStatus> : null}

      <form action={login} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label>
          <span>{t("auth.email")}</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label>
          <span>{t("auth.password")}</span>
          <input name="password" type="password" autoComplete="current-password" placeholder={t("auth.passwordPlaceholder")} required />
        </label>
        <div className="auth-inline-link"><Link href="/forgot-password">{t("auth.forgotPassword")}</Link></div>
        <TurnstileField action="login" locale={locale} />
        <AuthSubmitButton idleLabel={t("auth.signIn")} pendingLabel={t("auth.signingIn")} />
      </form>

      <div className="auth-divider"><span>{t("auth.newToFaceBai")}</span></div>
      <div className="auth-links">
        <Link href="/register">{t("auth.createFaceBaiAccount")}</Link>
      </div>
    </AuthShell>
  );
}
