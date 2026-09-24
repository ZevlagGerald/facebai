import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { TurnstileField } from "@/app/components/turnstile-field";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const sent = params.sent === "1";

  return (
    <AuthShell>
      <h1>Reset your password</h1>
      <p className="auth-copy">Enter your FaceBai email. If an account exists, we will send a recovery link.</p>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {sent ? <p className="form-success" role="status">If an account exists for that email, a recovery link has been sent.</p> : null}
      <form action={requestPasswordReset} className="auth-form">
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <TurnstileField action="password-reset" />
        <button className="primary-button" type="submit">Send recovery link</button>
      </form>
      <div className="auth-links"><Link href="/login">Back to login</Link></div>
    </AuthShell>
  );
}
