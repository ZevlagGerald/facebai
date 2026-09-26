import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { RegisterForm } from "@/app/components/auth-forms";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function RegisterPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  return (
    <AuthShell eyebrow={t("auth.createAccountEyebrow")} locale={locale}>
      <div className="auth-heading">
        <h1>{t("auth.registerTitle")}</h1>
        <p className="auth-copy">{t("auth.registerCopy")}</p>
      </div>

      <RegisterForm locale={locale} />

      <div className="auth-links"><span>{t("auth.alreadyAccount")}</span><Link href="/login">{t("auth.signIn")}</Link></div>
    </AuthShell>
  );
}
