import Link from "next/link";
import { AuthShell } from "@/app/components/auth-shell";

export default async function CheckEmailPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "your email";
  return <AuthShell><h1>Check your email</h1><p className="auth-copy">We sent a verification link to <strong>{email}</strong>. Verify it before entering Tambayan.</p><div className="auth-links"><Link href="/login">Back to login</Link></div></AuthShell>;
}
