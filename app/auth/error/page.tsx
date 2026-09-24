import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";

export default function AuthErrorPage() {
  return <AuthShell><h1>Verification failed</h1><p className="auth-copy">The verification link may be invalid or expired. Start the sign-in flow again.</p><div className="auth-links"><Link href="/login">Go to login</Link></div></AuthShell>;
}
