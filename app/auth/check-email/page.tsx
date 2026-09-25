import Link from "next/link";
import { resendSignupConfirmation } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const rawEmail = typeof params.email === "string" ? params.email : "";
  const canResend = rawEmail.includes("@");
  const email = canResend ? rawEmail : t("auth.email");
  const sent = params.sent === "1";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <AuthShell eyebrow={t("auth.verifyEmailEyebrow")} locale={locale}>
      <div className="auth-state-icon" aria-hidden="true">✉</div>
      <div className="auth-heading auth-heading-centered">
        <h1>{t("auth.checkEmailTitle")}</h1>
        <p className="auth-copy">{t("auth.checkEmailCopyPrefix")} <strong>{email}</strong>. {t("auth.checkEmailCopySuffix")}</p>
      </div>

      <AuthStatus tone="info" title={t("auth.didntReceive")}>{t("auth.didntReceiveBody")}</AuthStatus>
      {sent ? <AuthStatus tone="success" title={t("auth.verificationSent")}>{t("auth.verificationSentBody")}</AuthStatus> : null}
      {error ? <AuthStatus tone="error" title={t("auth.resendFailed")}>{error}</AuthStatus> : null}

      {canResend ? (
        <form action={resendSignupConfirmation} className="auth-form">
          <input name="email" type="hidden" value={rawEmail} />
          <TurnstileField action="resend-confirmation" locale={locale} />
          <AuthSubmitButton idleLabel={t("auth.resendVerification")} pendingLabel={t("auth.sendingVerification")} />
        </form>
      ) : null}

      <div className="auth-links"><Link href="/register">{t("auth.useDifferentEmail")}</Link><Link href="/login">{t("auth.backToSignIn")}</Link></div>
    </AuthShell>
  );
}
