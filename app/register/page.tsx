import Link from "next/link";
import { register } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  return (
    <AuthShell>
      <h1>Himo og FaceBai account</h1>
      <p className="auth-copy">Private beta: 18+ while our safety and age-assurance systems are being completed.</p>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <form action={register} className="auth-form">
        <label>Full name<input name="full_name" type="text" autoComplete="name" minLength={2} maxLength={80} required /></label>
        <label>Username<input name="username" type="text" autoCapitalize="none" autoComplete="username" pattern="[a-z0-9][a-z0-9._]{2,29}" required /></label>
        <label>Date of birth<input name="date_of_birth" type="date" autoComplete="bday" required /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="new-password" minLength={10} required /></label>
        <label>Confirm password<input name="confirm_password" type="password" autoComplete="new-password" minLength={10} required /></label>
        <label className="check-row"><input name="accept_terms" type="checkbox" required /><span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Notice</Link>.</span></label>
        <button className="primary-button" type="submit">Create account</button>
      </form>
      <div className="auth-links"><Link href="/login">Already have an account?</Link></div>
    </AuthShell>
  );
}
