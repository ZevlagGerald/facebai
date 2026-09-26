import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { UpdatePasswordForm } from "@/app/components/auth-forms";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !data?.claims?.sub) redirect("/login");

  return (
    <AuthShell eyebrow={t("auth.secureAccountEyebrow")} locale={locale}>
      <div className="auth-state-icon" aria-hidden="true">⌁</div>
      <div className="auth-heading auth-heading-centered">
        <h1>{t("auth.chooseNewPassword")}</h1>
        <p className="auth-copy">{t("auth.chooseNewPasswordCopy")}</p>
      </div>

      <AuthStatus tone="info" title={t("auth.passwordRequirements")}>{t("auth.passwordRequirementsBody")}</AuthStatus>

      <UpdatePasswordForm locale={locale} />
      <div className="auth-links"><Link href="/forgot-password">{t("auth.requestNewRecovery")}</Link></div>
    </AuthShell>
  );
}
