import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/auth/supabase-middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    console.info(`[AUTH_GUARD:REDIRECT] Path: ${request.nextUrl.pathname} -> /auth/login`);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  console.info(`[APP:ACCESS] User: ${user.id} | Path: ${request.nextUrl.pathname}`);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/home/:path*",
    "/receipt-scanner/:path*",
    "/ai/:path*",
    "/monitor/:path*",
    "/nabung/:path*",
    "/catat/:path*",
    "/pembukuan/:path*",
    "/template/:path*",
    "/settings/:path*",
    "/help/:path*",
  ],
};
