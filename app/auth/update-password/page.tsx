import Link from "next/link";
import { redirect } from "next/navigation";
import { updatePassword } from "@/app/actions/auth";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";
import { AuthSubmitButton } from "@/app/components/auth-submit-button";
import { createClient } from "@/lib/supabase/server";

export default async function UpdatePasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : "";

  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !data?.claims?.sub) redirect("/login");

  return (
    <AuthShell eyebrow="SECURE YOUR ACCOUNT">
      <div className="auth-state-icon" aria-hidden="true">⌁</div>
      <div className="auth-heading auth-heading-centered">
        <h1>Choose a new password</h1>
        <p className="auth-copy">Create a fresh password for your FaceBai account. You will sign in again after it is updated.</p>
      </div>

      {error ? <AuthStatus tone="error" title="Password not updated">{error}</AuthStatus> : null}
      <AuthStatus tone="info" title="Password requirements">Use at least 10 characters and do not reuse a password from another account.</AuthStatus>

      <form action={updatePassword} className="auth-form">
        <label><span>New password</span><input name="password" type="password" autoComplete="new-password" minLength={10} placeholder="At least 10 characters" required /></label>
        <label><span>Confirm new password</span><input name="confirm_password" type="password" autoComplete="new-password" minLength={10} placeholder="Enter your new password again" required /></label>
        <AuthSubmitButton idleLabel="Update password" pendingLabel="Updating password…" />
      </form>
      <div className="auth-links"><Link href="/forgot-password">Request a new recovery link</Link></div>
    </AuthShell>
  );
}
