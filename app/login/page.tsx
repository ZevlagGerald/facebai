import Link from "next/link";
import { login } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { TurnstileField } from "@/app/components/turnstile-field";
import { safeLocalPath } from "@/lib/auth/security";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";
  const next = safeLocalPath(typeof params.next === "string" ? params.next : "/tambayan");

  return (
    <AuthShell>
      <h1>Maayong pagbalik, Bai.</h1>
      <p className="auth-copy">Sulod sa imong FaceBai account.</p>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <form action={login} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <TurnstileField action="login" />
        <button className="primary-button" type="submit">Log in</button>
      </form>
      <div className="auth-links"><Link href="/register">Create new FaceBai account</Link></div>
    </AuthShell>
  );
}
