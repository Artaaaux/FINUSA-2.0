import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client, getGoogleUserWithClient } from "@/lib/google/oauth";
import { createClient } from "@/lib/auth/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateStr = searchParams.get("state");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${appUrl.replace(/\/$/, "")}/sheets?error=no_code`);
  }

  try {
    const supabase = await createClient();
    let userId: string | undefined = undefined;

    // 1. Try to get userId from state or Supabase session
    if (stateStr) {
      try {
        const parsed = JSON.parse(stateStr);
        userId = parsed.userId;
      } catch (e) {
        console.warn("Could not parse OAuth state", e);
      }
    }

    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      return NextResponse.redirect(`${appUrl.replace(/\/$/, "")}/sheets?error=unauthorized`);
    }

    // 2. Exchange code for tokens
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 3. Fetch user info from Google
    const googleUser = await getGoogleUserWithClient(oauth2Client);

    // 4. Save to Supabase public.google_accounts
    const { error: upsertError } = await supabase
      .from("google_accounts")
      .upsert({
        user_id: userId,
        email: googleUser.email || "",
        name: googleUser.name || "Akun Google Finusa",
        avatar_url: googleUser.picture || "",
        access_token: tokens.access_token || "",
        refresh_token: tokens.refresh_token || "",
        token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
        granted_scopes: tokens.scope ? tokens.scope.split(" ") : [],
        is_active: true,
        auto_sync_enabled: true,
        quota_used_percent: 5,
        connected_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (upsertError) {
      console.error("Failed to upsert google_accounts:", upsertError);
    }

    return NextResponse.redirect(`${appUrl.replace(/\/$/, "")}/sheets?connected=true`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${appUrl.replace(/\/$/, "")}/sheets?error=callback_failed`);
  }
}
