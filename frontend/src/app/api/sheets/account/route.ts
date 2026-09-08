import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isConnected: false });
    }

    const { data: account, error } = await supabase
      .from("google_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !account) {
      return NextResponse.json({
        isConnected: false,
        email: "",
        name: "",
        avatarUrl: "",
        connectedAt: "",
        lastUsedAt: "",
        autoSyncEnabled: false,
        quotaUsedPercent: 0,
        grantedScopes: [],
      });
    }

    return NextResponse.json({
      isConnected: true,
      email: account.email,
      name: account.name || account.email,
      avatarUrl: account.avatar_url || "",
      connectedAt: account.connected_at,
      lastUsedAt: account.last_used_at || account.connected_at,
      autoSyncEnabled: account.auto_sync_enabled,
      quotaUsedPercent: account.quota_used_percent || 5,
      grantedScopes: account.granted_scopes || [],
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
