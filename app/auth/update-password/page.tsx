import { redirect } from "next/navigation";
import { updatePassword } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !data?.claims?.sub) redirect("/login");

  return (
    <AuthShell>
      <h1>Choose a new password</h1>
      <p className="auth-copy">Use at least 10 characters and do not reuse an old password.</p>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <form action={updatePassword} className="auth-form">
        <label>New password<input name="password" type="password" autoComplete="new-password" minLength={10} required /></label>
        <label>Confirm new password<input name="confirm_password" type="password" autoComplete="new-password" minLength={10} required /></label>
        <button className="primary-button" type="submit">Update password</button>
      </form>
    </AuthShell>
  );
}
