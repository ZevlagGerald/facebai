import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { ForgotPasswordForm } from "@/app/components/auth-forms";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function ForgotPasswordPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <AuthShell eyebrow={t("auth.recoveryEyebrow")} locale={locale}>
      <div className="auth-heading">
        <h1>{t("auth.resetTitle")}</h1>
        <p className="auth-copy">{t("auth.resetCopy")}</p>
      </div>

      <ForgotPasswordForm locale={locale} />
      <div className="auth-links"><Link href="/login">{t("auth.backToSignIn")}</Link></div>
    </AuthShell>
  );
}
