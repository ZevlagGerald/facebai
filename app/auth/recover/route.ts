import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function redirect(request: NextRequest, pathname: string) {
  const response = NextResponse.redirect(new URL(pathname, request.nextUrl.origin));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const code = request.nextUrl.searchParams.get("code");
  const flowId = request.nextUrl.searchParams.get("sb_flow_id");
  const supabase = await createClient();

  // SSR-safe recovery links should land here with a token hash so the server
  // can verify the recovery OTP and persist the resulting session in cookies.
  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (!error) return redirect(request, "/auth/update-password");
  }

  // Keep PKCE auth-code support for compatibility with links that return a code.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );

    if (!error) return redirect(request, "/auth/update-password");
  }

  return redirect(request, "/auth/error");
}
