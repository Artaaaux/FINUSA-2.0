import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";

export const runtime = "nodejs";

const MAX_QUOTA_BYTES = 5 * 1024 * 1024; // 5MB

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Query receipt_photos to compute total file_size
    const { data, error } = await supabase
      .from("receipt_photos")
      .select("file_size")
      .eq("user_id", user.id);

    if (error) {
      // If table doesn't exist yet, return safe defaults
      return NextResponse.json({
        totalUsedBytes: 0,
        maxQuotaBytes: MAX_QUOTA_BYTES,
        usedPercentage: 0,
        isQuotaExceeded: false,
        totalReceipts: 0,
      });
    }

    const totalUsedBytes = (data || []).reduce(
      (sum, item) => sum + (Number(item.file_size) || 0),
      0
    );

    const usedPercentage = Math.min(
      100,
      Math.round((totalUsedBytes / MAX_QUOTA_BYTES) * 100)
    );

    const isQuotaExceeded = totalUsedBytes >= MAX_QUOTA_BYTES;

    return NextResponse.json({
      totalUsedBytes,
      maxQuotaBytes: MAX_QUOTA_BYTES,
      usedPercentage,
      isQuotaExceeded,
      totalReceipts: data?.length || 0,
      availableBytes: Math.max(0, MAX_QUOTA_BYTES - totalUsedBytes),
    });
  } catch (err: unknown) {
    console.error("Quota API Error:", err);
    return NextResponse.json(
      {
        totalUsedBytes: 0,
        maxQuotaBytes: MAX_QUOTA_BYTES,
        usedPercentage: 0,
        isQuotaExceeded: false,
        totalReceipts: 0,
      },
      { status: 200 }
    );
  }
}
