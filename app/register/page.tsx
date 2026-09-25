import Link from "next/link";
import { register } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <AuthShell eyebrow={t("auth.createAccountEyebrow")} locale={locale}>
      <div className="auth-heading">
        <h1>{t("auth.registerTitle")}</h1>
        <p className="auth-copy">{t("auth.registerCopy")}</p>
      </div>

      {error ? <AuthStatus tone="error" title={t("auth.registrationFailed")}>{error}</AuthStatus> : null}

      <form action={register} className="auth-form">
        <label><span>{t("auth.fullName")}</span><input name="full_name" type="text" autoComplete="name" minLength={2} maxLength={80} placeholder="Dodong Pinagtibay" required /></label>
        <label><span>{t("auth.username")}</span><input name="username" type="text" autoCapitalize="none" autoComplete="username" pattern="[A-Za-z0-9][A-Za-z0-9._]{2,29}" placeholder="Oskar" aria-describedby="username-help" required /><small id="username-help">{t("auth.usernameHelp")}</small></label>
        <label><span>{t("auth.dateOfBirth")}</span><input name="date_of_birth" type="date" autoComplete="bday" aria-describedby="dob-help" required /><small id="dob-help">{t("auth.ageHelp")}</small></label>
        <label><span>{t("auth.email")}</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label><span>{t("auth.password")}</span><input name="password" type="password" autoComplete="new-password" minLength={10} placeholder="At least 10 characters" aria-describedby="password-help" required /><small id="password-help">{t("auth.newPasswordHelp")}</small></label>
        <label><span>{t("auth.confirmPassword")}</span><input name="confirm_password" type="password" autoComplete="new-password" minLength={10} placeholder={t("auth.confirmPasswordPlaceholder")} required /></label>
        <label className="check-row"><input name="accept_terms" type="checkbox" required /><span>{t("auth.agreePrefix")} <Link href="/terms">{t("auth.terms")}</Link> {t("auth.and")} <Link href="/privacy">{t("auth.privacy")}</Link>.</span></label>
        <TurnstileField action="register" locale={locale} />
        <AuthSubmitButton idleLabel={t("auth.createAccount")} pendingLabel={t("auth.creatingAccount")} />
      </form>

      <div className="auth-links"><span>{t("auth.alreadyAccount")}</span><Link href="/login">{t("auth.signIn")}</Link></div>
    </AuthShell>
  );
}
