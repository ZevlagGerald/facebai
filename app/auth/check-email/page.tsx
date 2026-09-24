import Link from "next/link";
import { resendSignupConfirmation } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { TurnstileField } from "@/app/components/turnstile-field";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rawEmail = typeof params.email === "string" ? params.email : "";
  const canResend = rawEmail.includes("@");
  const email = canResend ? rawEmail : "your email";
  const sent = params.sent === "1";
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <AuthShell>
      <h1>Check your email</h1>
      <p className="auth-copy">We sent a verification link to <strong>{email}</strong>. Verify it before entering Tambayan.</p>
      {sent ? <p className="form-success" role="status">A fresh verification email was sent. Use the newest message in your inbox.</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {canResend ? (
        <form action={resendSignupConfirmation} className="auth-form">
          <input name="email" type="hidden" value={rawEmail} />
          <TurnstileField action="resend-confirmation" />
          <button className="primary-button" type="submit">Resend confirmation email</button>
        </form>
      ) : null}
      <div className="auth-links"><Link href="/login">Back to login</Link></div>
    </AuthShell>
  );
}
