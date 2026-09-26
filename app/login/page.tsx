import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { LoginForm } from "@/app/components/auth-forms";
import { safeLocalPath } from "@/lib/auth/security";
import { getAuthInteractionCopy } from "@/lib/i18n/auth-interaction";
import { getLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n/messages";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const locale = await getLocale();
  const t = getTranslations(locale);
  const interaction = getAuthInteractionCopy(locale);
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";
  const next = safeLocalPath(typeof params.next === "string" ? params.next : "/tambayan");

  return (
    <AuthShell eyebrow={t("auth.welcomeBack")} locale={locale}>
      <div className="auth-heading">
        <h1>{t("auth.loginTitle")}</h1>
        <p className="auth-copy">{t("auth.loginCopy")}</p>
      </div>

      {status === "password-updated" ? (
        <AuthStatus tone="success" title={t("auth.accountUpdated")}>
          {interaction.successes.password_updated}
        </AuthStatus>
      ) : null}

      <LoginForm locale={locale} next={next} />

      <div className="auth-divider"><span>{t("auth.newToFaceBai")}</span></div>
      <div className="auth-links">
        <Link href="/register">{t("auth.createFaceBaiAccount")}</Link>
      </div>
    </AuthShell>
  );
}
