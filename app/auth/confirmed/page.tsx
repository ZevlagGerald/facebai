import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function AccountConfirmedPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <AuthShell eyebrow={t("auth.verifiedEyebrow")} locale={locale}>
      <div className="auth-state-icon" aria-hidden="true">✓</div>
      <div className="auth-heading auth-heading-centered">
        <h1>{t("auth.verifiedTitle")}</h1>
        <p className="auth-copy">{t("auth.verifiedCopy")}</p>
      </div>
      <AuthStatus tone="success" title={t("auth.verificationComplete")}>{t("auth.verificationCompleteBody")}</AuthStatus>
      <div className="auth-action-stack">
        <Link className="primary-button auth-button-link" href="/tambayan">{t("auth.continueTambayan")}</Link>
      </div>
    </AuthShell>
  );
}
