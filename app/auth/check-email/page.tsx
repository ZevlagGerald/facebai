import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { ResendVerificationForm } from "@/app/components/auth-forms";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const rawEmail = typeof params.email === "string" ? params.email : "";
  const canResend = rawEmail.includes("@");
  const email = canResend ? rawEmail : t("auth.email");

  return (
    <AuthShell eyebrow={t("auth.verifyEmailEyebrow")} locale={locale}>
      <div className="auth-state-icon" aria-hidden="true">✉</div>
      <div className="auth-heading auth-heading-centered">
        <h1>{t("auth.checkEmailTitle")}</h1>
        <p className="auth-copy">{t("auth.checkEmailCopyPrefix")} <strong>{email}</strong>. {t("auth.checkEmailCopySuffix")}</p>
      </div>

      <AuthStatus tone="info" title={t("auth.didntReceive")}>{t("auth.didntReceiveBody")}</AuthStatus>

      {canResend ? <ResendVerificationForm locale={locale} email={rawEmail} /> : null}

      <div className="auth-links"><Link href="/register">{t("auth.useDifferentEmail")}</Link><Link href="/login">{t("auth.backToSignIn")}</Link></div>
    </AuthShell>
  );
}
