import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { safeLocalPath } from "@/lib/auth/security";
import type { Database } from "@/lib/database.types";

const PUBLIC_PREFIXES = ["/login", "/register", "/forgot-password", "/auth/", "/privacy", "/terms"];
const CACHE_HEADERS = ["cache-control", "expires", "pragma"] as const;

function redirectWithAuthState(url: URL, source: NextResponse) {
  const redirected = NextResponse.redirect(url);

  for (const cookie of source.cookies.getAll()) {
    redirected.cookies.set(cookie);
  }

  for (const header of CACHE_HEADERS) {
    const value = source.headers.get(header);
    if (value) redirected.headers.set(header, value);
  }

  return redirected;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request, headers });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();
  const isAuthenticated = !error && Boolean(data?.claims?.sub);
  const pathname = request.nextUrl.pathname;
  const isPublic = pathname === "/" || PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isAuthenticated && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", safeLocalPath(`${pathname}${request.nextUrl.search}`));
    return redirectWithAuthState(url, response);
  }

  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/tambayan";
    url.search = "";
    return redirectWithAuthState(url, response);
  }

  return response;
}
