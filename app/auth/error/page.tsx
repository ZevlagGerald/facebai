import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";

export default function AuthErrorPage() {
  return (
    <AuthShell eyebrow="ACCOUNT LINK">
      <div className="auth-state-icon auth-state-icon-error" aria-hidden="true">!</div>
      <div className="auth-heading auth-heading-centered">
        <h1>This link can’t be used</h1>
        <p className="auth-copy">The verification or recovery link may be expired, already used, or incomplete.</p>
      </div>
      <AuthStatus tone="warning" title="What to do next">Start the account flow again and use the newest email FaceBai sends you. One-time links should not be reused.</AuthStatus>
      <div className="auth-action-stack">
        <Link className="primary-button auth-button-link" href="/login">Go to sign in</Link>
        <Link className="secondary-button auth-button-link" href="/forgot-password">Reset password again</Link>
      </div>
    </AuthShell>
  );
}
