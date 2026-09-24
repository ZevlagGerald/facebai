import Link from "next/link";
import { login } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";
import { safeLocalPath } from "@/lib/auth/security";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const message = typeof params.message === "string" ? params.message : "";
  const next = safeLocalPath(typeof params.next === "string" ? params.next : "/tambayan");

  return (
    <AuthShell eyebrow="WELCOME BACK">
      <div className="auth-heading">
        <h1>Maayong pagbalik, Bai.</h1>
        <p className="auth-copy">Sign in to continue to your FaceBai Tambayan.</p>
      </div>

      {error ? <AuthStatus tone="error" title="Sign-in unsuccessful">{error}</AuthStatus> : null}
      {message ? <AuthStatus tone="success" title="Account updated">{message}</AuthStatus> : null}

      <form action={login} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label>
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
        </label>
        <div className="auth-inline-link"><Link href="/forgot-password">Forgot your password?</Link></div>
        <TurnstileField action="login" />
        <AuthSubmitButton idleLabel="Sign in" pendingLabel="Signing in…" />
      </form>

      <div className="auth-divider"><span>New to FaceBai?</span></div>
      <div className="auth-links">
        <Link href="/register">Create a FaceBai account</Link>
      </div>
    </AuthShell>
  );
}
