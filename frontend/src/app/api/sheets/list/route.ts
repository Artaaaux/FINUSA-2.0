import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ sheets: [] });
    }

    const { data: sheets, error } = await supabase
      .from("synced_sheets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedSheets = (sheets || []).map((s) => ({
      id: s.id,
      googleSheetId: s.google_sheet_id,
      sheetTitle: s.sheet_title,
      sheetUrl: s.sheet_url,
      sheetTabName: s.sheet_tab_name,
      syncFrequency: s.sync_frequency,
      isActive: s.is_active,
      bidirectional: s.bidirectional,
      lastSyncAt: s.last_sync_at,
      nextSyncAt: s.next_sync_at,
      syncStatus: s.sync_status,
      lastError: s.last_error,
      rowCount: s.row_count,
      templateId: s.template_id,
      templateCategory: s.template_category,
      filters: s.filters || {},
      columnMappings: s.column_mappings || [],
      sharedUsers: s.shared_users || [],
      createdAt: s.created_at,
    }));

    return NextResponse.json({ sheets: formattedSheets });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
