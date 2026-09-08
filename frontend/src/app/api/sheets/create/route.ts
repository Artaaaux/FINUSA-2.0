import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";
import { createGoogleSpreadsheet } from "@/lib/google/sheets";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Pengguna belum login." }, { status: 401 });
    }

    const body = await req.json();
    const { title, templateCategory } = body;

    const newSheet = await createGoogleSpreadsheet(
      user.id,
      title || "FINUSA - Pembukuan & Rekap Kas",
      templateCategory || "income_expense"
    );

    return NextResponse.json({
      success: true,
      sheet: newSheet,
      message: "Spreadsheet berhasil dibuat di Google Drive dan terhubung!",
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Create spreadsheet error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat spreadsheet di Google Drive." },
      { status: 500 }
    );
  }
}
