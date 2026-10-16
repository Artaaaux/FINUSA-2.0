import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/auth/supabase-middleware";
import { isUserAdmin } from "@/lib/auth/admin";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  if (!user) {
    console.info(`[AUTH_GUARD:REDIRECT] Path: ${pathname} -> /auth/login`);
    const loginUrl = new URL("/auth/login", request.url);
    if (pathname.startsWith("/admin")) {
      loginUrl.searchParams.set("next", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Khusus rute /admin, verifikasi hak akses administratif
  if (pathname.startsWith("/admin")) {
    let hasAdminAccess = isUserAdmin(user.email);

    if (!hasAdminAccess && supabase) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("system_role, role")
          .eq("id", user.id)
          .maybeSingle();

        hasAdminAccess = isUserAdmin(
          user.email,
          profile?.system_role,
          profile?.role
        );
      } catch (err) {
        console.warn("[ADMIN_GUARD] Failed to verify profile role:", err);
      }
    }

    if (!hasAdminAccess) {
      console.warn(`[ADMIN_GUARD:FORBIDDEN] User: ${user.email} (${user.id}) attempted to access ${pathname}`);
      const homeUrl = new URL("/home", request.url);
      homeUrl.searchParams.set("error", "unauthorized_admin");
      return NextResponse.redirect(homeUrl);
    }
  }

  console.info(`[APP:ACCESS] User: ${user.id} | Path: ${pathname}`);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
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
