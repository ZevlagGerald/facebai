import Link from "next/link";
import { redirect } from "next/navigation";
import { updatePassword } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

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

      {error ? <AuthStatus tone="error" title={t("auth.passwordNotUpdated")}>{error}</AuthStatus> : null}
      <AuthStatus tone="info" title={t("auth.passwordRequirements")}>{t("auth.passwordRequirementsBody")}</AuthStatus>

      <form action={updatePassword} className="auth-form">
        <label><span>{t("auth.newPassword")}</span><input name="password" type="password" autoComplete="new-password" minLength={10} placeholder="At least 10 characters" required /></label>
        <label><span>{t("auth.confirmNewPassword")}</span><input name="confirm_password" type="password" autoComplete="new-password" minLength={10} placeholder={t("auth.newPasswordAgain")} required /></label>
        <AuthSubmitButton idleLabel={t("auth.updatePassword")} pendingLabel={t("auth.updatingPassword")} />
      </form>
      <div className="auth-links"><Link href="/forgot-password">{t("auth.requestNewRecovery")}</Link></div>
    </AuthShell>
  );
}
