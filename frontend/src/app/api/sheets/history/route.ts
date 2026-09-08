import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ history: [] });
    }

    const { data: history, error } = await supabase
      .from("sheet_sync_history")
      .select("*")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedHistory = (history || []).map((h) => ({
      id: h.id,
      sheetId: h.sheet_id,
      sheetTitle: h.sheet_title,
      timestamp: h.timestamp,
      status: h.status,
      rowsAdded: h.rows_added,
      rowsUpdated: h.rows_updated,
      rowsDeleted: h.rows_deleted,
      durationMs: h.duration_ms,
      triggeredBy: h.triggered_by,
      errorMessage: h.error_message,
    }));

    return NextResponse.json({ history: formattedHistory });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
