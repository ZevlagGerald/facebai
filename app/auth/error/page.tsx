import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function AuthErrorPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <AuthShell eyebrow={t("auth.linkEyebrow")} locale={locale}>
      <div className="auth-state-icon auth-state-icon-error" aria-hidden="true">!</div>
      <div className="auth-heading auth-heading-centered">
        <h1>{t("auth.linkInvalidTitle")}</h1>
        <p className="auth-copy">{t("auth.linkInvalidCopy")}</p>
      </div>
      <AuthStatus tone="warning" title={t("auth.whatNext")}>{t("auth.whatNextBody")}</AuthStatus>
      <div className="auth-action-stack">
        <Link className="primary-button auth-button-link" href="/login">{t("auth.goToSignIn")}</Link>
        <Link className="secondary-button auth-button-link" href="/forgot-password">{t("auth.resetAgain")}</Link>
      </div>
    </AuthShell>
  );
}
