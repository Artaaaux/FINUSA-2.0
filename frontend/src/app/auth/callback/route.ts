import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const rawNext = searchParams.get("next");

  // Validasi ketat target path (mencegah Open Redirect & Host Header Injection)
  let safeNext = "/home";
  if (type === "recovery" || rawNext === "/auth/reset-password" || rawNext?.includes("reset-password")) {
    safeNext = "/auth/reset-password";
  } else if (
    rawNext &&
    rawNext.startsWith("/") &&
    !rawNext.startsWith("//") &&
    !rawNext.includes("\\") &&
    !rawNext.includes("://")
  ) {
    safeNext = rawNext;
  }

  if (code) {
    const redirectUrl = new URL(safeNext, origin).toString();
    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }

    console.error("Auth callback error exchanging code:", error.message);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
