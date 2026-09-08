import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/auth/supabase-middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

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
    "/sheets/:path*",
    "/settings/:path*",
    "/help/:path*",
  ],
};
