import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";
import { AuthStatus } from "@/app/components/auth-status";

export default function AccountConfirmedPage() {
  return (
    <AuthShell eyebrow="ACCOUNT VERIFIED">
      <div className="auth-state-icon" aria-hidden="true">✓</div>
      <div className="auth-heading auth-heading-centered">
        <h1>Your account is verified.</h1>
        <p className="auth-copy">Welcome to FaceBai, Bai. Your email has been confirmed and your account is ready.</p>
      </div>
      <AuthStatus tone="success" title="Verification complete">You can now continue to Tambayan and start using your FaceBai account.</AuthStatus>
      <div className="auth-action-stack">
        <Link className="primary-button auth-button-link" href="/tambayan">Continue to Tambayan</Link>
      </div>
    </AuthShell>
  );
}
