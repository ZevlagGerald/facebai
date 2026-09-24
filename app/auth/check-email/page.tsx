import Link from "next/link";
import { resendSignupConfirmation } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawEmail = typeof params.email === "string" ? params.email : "";
  const canResend = rawEmail.includes("@");
  const email = canResend ? rawEmail : "your email";
  const sent = params.sent === "1";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <AuthShell eyebrow="VERIFY YOUR EMAIL">
      <div className="auth-state-icon" aria-hidden="true">✉</div>
      <div className="auth-heading auth-heading-centered">
        <h1>Check your email</h1>
        <p className="auth-copy">We sent a verification link to <strong>{email}</strong>. Open the newest FaceBai message and confirm your account to continue.</p>
      </div>

      <AuthStatus tone="info" title="Didn’t receive the email?">Check your spam or junk folder. Delivery can take a minute, and older verification links should be ignored after requesting a new one.</AuthStatus>
      {sent ? <AuthStatus tone="success" title="Fresh verification email sent">Use the newest verification message in your inbox.</AuthStatus> : null}
      {error ? <AuthStatus tone="error" title="Could not resend yet">{error}</AuthStatus> : null}

      {canResend ? (
        <form action={resendSignupConfirmation} className="auth-form">
          <input name="email" type="hidden" value={rawEmail} />
          <TurnstileField action="resend-confirmation" />
          <AuthSubmitButton idleLabel="Resend verification email" pendingLabel="Sending verification email…" />
        </form>
      ) : null}

      <div className="auth-links"><Link href="/register">Use a different email</Link><Link href="/login">Back to sign in</Link></div>
    </AuthShell>
  );
}
