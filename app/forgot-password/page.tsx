import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const sent = params.sent === "1";

  return (
    <AuthShell eyebrow="ACCOUNT RECOVERY">
      <div className="auth-heading">
        <h1>Reset your password</h1>
        <p className="auth-copy">Enter your FaceBai email. For privacy, we show the same confirmation whether or not an account exists.</p>
      </div>

      {error ? <AuthStatus tone="error" title="Recovery request not sent">{error}</AuthStatus> : null}
      {sent ? <AuthStatus tone="success" title="Check your inbox">If an account exists for that email, we sent a recovery link. Check spam or junk if it does not arrive within a minute.</AuthStatus> : null}

      <form action={requestPasswordReset} className="auth-form">
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <TurnstileField action="password-reset" />
        <AuthSubmitButton idleLabel="Send recovery link" pendingLabel="Sending recovery link…" />
      </form>
      <div className="auth-links"><Link href="/login">Back to sign in</Link></div>
    </AuthShell>
  );
}
