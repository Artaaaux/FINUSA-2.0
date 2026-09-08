import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Pengguna belum login." }, { status: 401 });
    }

    // Delete or deactivate from google_accounts
    const { error } = await supabase
      .from("google_accounts")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Koneksi Google Sheets berhasil diputus." });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { error: err.message || "Gagal memutuskan akun Google." },
      { status: 500 }
    );
  }
}
