import { NextResponse } from "next/server";
import { generateAuthUrl } from "@/lib/google/oauth";
import { createClient } from "@/lib/auth/supabase-server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Pengguna belum login." }, { status: 401 });
    }

    const state = JSON.stringify({ userId: user.id });
    const url = generateAuthUrl(state);

    return NextResponse.json({ url });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Failed to generate Google Auth URL:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat URL autentikasi Google." },
      { status: 500 }
    );
  }
}
