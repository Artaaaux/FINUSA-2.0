import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";
import { syncSpreadsheetTransactions } from "@/lib/google/sheets";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Pengguna belum login." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { sheetId, triggeredBy = "manual_user" } = body;

    if (sheetId) {
      // Sync single sheet
      const result = await syncSpreadsheetTransactions(user.id, sheetId, triggeredBy);
      return NextResponse.json({ success: true, result });
    } else {
      // Sync all active sheets
      const { data: sheets } = await supabase
        .from("synced_sheets")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_active", true);

      const results = [];
      for (const s of (sheets || [])) {
        try {
          const res = await syncSpreadsheetTransactions(user.id, s.id, triggeredBy);
          results.push({ sheetId: s.id, ...res });
        } catch (e: unknown) {
          const err = e as Error;
          results.push({ sheetId: s.id, success: false, error: err.message });
        }
      }

      return NextResponse.json({ success: true, results });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Sync spreadsheet error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menyinkronkan data ke Google Sheets." },
      { status: 500 }
    );
  }
}
