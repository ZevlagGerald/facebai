import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const sent = params.sent === "1";

  return (
    <AuthShell eyebrow={t("auth.recoveryEyebrow")} locale={locale}>
      <div className="auth-heading">
        <h1>{t("auth.resetTitle")}</h1>
        <p className="auth-copy">{t("auth.resetCopy")}</p>
      </div>

      {error ? <AuthStatus tone="error" title={t("auth.recoveryNotSent")}>{error}</AuthStatus> : null}
      {sent ? <AuthStatus tone="success" title={t("auth.checkInbox")}>{t("auth.recoverySentBody")}</AuthStatus> : null}

      <form action={requestPasswordReset} className="auth-form">
        <label><span>{t("auth.email")}</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <TurnstileField action="password-reset" locale={locale} />
        <AuthSubmitButton idleLabel={t("auth.sendRecovery")} pendingLabel={t("auth.sendingRecovery")} />
      </form>
      <div className="auth-links"><Link href="/login">{t("auth.backToSignIn")}</Link></div>
    </AuthShell>
  );
}
