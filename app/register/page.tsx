import Link from "next/link";
import { register } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { TurnstileField } from "@/app/components/turnstile-field";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <AuthShell eyebrow="CREATE YOUR ACCOUNT">
      <div className="auth-heading">
        <h1>Himo og FaceBai account</h1>
        <p className="auth-copy">Join FaceBai and be part of a growing Bisaya community. Private beta access is currently 18+.</p>
      </div>

      {error ? <AuthStatus tone="error" title="Registration not completed">{error}</AuthStatus> : null}

      <form action={register} className="auth-form">
        <label><span>Full name</span><input name="full_name" type="text" autoComplete="name" minLength={2} maxLength={80} placeholder="Dodong Pinagtibay" required /></label>
        <label><span>Username</span><input name="username" type="text" autoCapitalize="none" autoComplete="username" pattern="[A-Za-z0-9][A-Za-z0-9._]{2,29}" placeholder="Oskar" aria-describedby="username-help" required /><small id="username-help">3–30 letters, numbers, dots, or underscores. Usernames are saved in lowercase.</small></label>
        <label><span>Date of birth</span><input name="date_of_birth" type="date" autoComplete="bday" aria-describedby="dob-help" required /><small id="dob-help">You must be 18 or older during the private beta.</small></label>
        <label><span>Email address</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label><span>Password</span><input name="password" type="password" autoComplete="new-password" minLength={10} placeholder="At least 10 characters" aria-describedby="password-help" required /><small id="password-help">Use at least 10 characters and avoid passwords you use elsewhere.</small></label>
        <label><span>Confirm password</span><input name="confirm_password" type="password" autoComplete="new-password" minLength={10} placeholder="Enter your password again" required /></label>
        <label className="check-row"><input name="accept_terms" type="checkbox" required /><span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Notice</Link>.</span></label>
        <TurnstileField action="register" />
        <AuthSubmitButton idleLabel="Create account" pendingLabel="Creating account…" />
      </form>

      <div className="auth-links"><span>Already have an account?</span><Link href="/login">Sign in</Link></div>
    </AuthShell>
  );
}
