import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase-server";
import { optimizeReceiptImage } from "@/shared/lib/receipt/resize-image";
import { extractReceiptData } from "@/shared/lib/receipt/extract";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds

export async function POST(req: NextRequest) {
  try {
    // 0. Autentikasi Pengguna: Pastikan hanya pengguna terautentikasi yang dapat memicu AI model
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Silakan masuk (login) terlebih dahulu untuk memproses struk." },
        { status: 401 }
      );
    }

    let imageBuffer: Buffer | null = null;
    let mimeType = "image/jpeg";
    let clientTime: string | undefined;
    let clientTimezone: string | undefined;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") || formData.get("image");
      const ct = formData.get("clientTime");
      const ctz = formData.get("clientTimezone");
      if (typeof ct === "string" && ct.trim()) clientTime = ct.trim();
      if (typeof ctz === "string" && ctz.trim()) clientTimezone = ctz.trim();

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json(
          { error: "File gambar struk tidak ditemukan dalam request." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
      mimeType = file.type || "image/jpeg";
    } else if (contentType.includes("application/json")) {
      const body = await req.json();
      const base64Data = body.image || body.base64;
      if (typeof body.clientTime === "string" && body.clientTime.trim()) clientTime = body.clientTime.trim();
      if (typeof body.clientTimezone === "string" && body.clientTimezone.trim()) clientTimezone = body.clientTimezone.trim();

      if (!base64Data || typeof base64Data !== "string") {
        return NextResponse.json(
          { error: "Payload base64 gambar struk tidak valid." },
          { status: 400 }
        );
      }

      // Strip data URI header if present
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1] || "image/jpeg";
        imageBuffer = Buffer.from(matches[2], "base64");
      } else {
        imageBuffer = Buffer.from(base64Data, "base64");
      }
    } else {
      return NextResponse.json(
        { error: "Format request tidak didukung. Gunakan multipart/form-data atau JSON base64." },
        { status: 400 }
      );
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return NextResponse.json(
        { error: "Data gambar kosong." },
        { status: 400 }
      );
    }

    if (imageBuffer.length > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran gambar terlalu besar. Maksimal 10MB." },
        { status: 413 }
      );
    }

    // 1. Optimize image for AI Vision (1120px = native 2x2 tile grid of most vision models; enhance faded thermal text)
    const startTime = Date.now();
    console.info(`[RECEIPT_SCAN:START] User: ${user.id} | RawSize: ${Math.round(imageBuffer.length / 1024)}KB | Type: ${mimeType}`);

    const optimizedOcr = await optimizeReceiptImage(imageBuffer, {
      maxWidth: 960,
      maxHeight: 960,
      quality: 80,
      format: "jpeg",
      enhance: true,
    });

    // 2. Extract Receipt Data using NVIDIA Multimodal Vision AI Model
    const extractedData = await extractReceiptData(
      optimizedOcr.base64,
      optimizedOcr.mimeType || mimeType,
      clientTime,
      clientTimezone
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // 3. Validate if image is actually a valid receipt
    // (confidence rules are handled inside extractReceiptData; a readable receipt with low confidence
    //  is still sent to the confirm screen where the user can correct it)
    if (extractedData.isReceipt === false) {
      const isBlurry =
        extractedData.rejectionCode === "UNREADABLE" ||
        extractedData.rejectionReason?.toLowerCase().includes("buram") ||
        extractedData.rejectionReason?.toLowerCase().includes("blurry") ||
        extractedData.rejectionReason?.toLowerCase().includes("terbaca");

      console.info(
        `[RECEIPT_SCAN:REJECTED] User: ${user.id} | Code: ${extractedData.rejectionCode || "-"} | Reason: "${extractedData.rejectionReason || "Not a receipt"}" | Conf: ${extractedData.confidence}% | Img: ${optimizedOcr.resolution} ${Math.round(optimizedOcr.sizeBytes / 1024)}KB | Duration: ${duration}s`
      );

      return NextResponse.json(
        {
          success: false,
          error: extractedData.rejectionReason || "Foto yang diambil bukan struk belanja atau bukti pembayaran yang valid.",
          code: isBlurry ? "RECEIPT_ILLEGIBLE" : "NOT_A_RECEIPT",
          extractedData,
        },
        { status: 422 }
      );
    }

    console.info(
      `[RECEIPT_SCAN:SUCCESS] User: ${user.id} | Merchant: "${extractedData.merchant || "Unknown"}" | Total: Rp ${extractedData.total || 0} | Conf: ${extractedData.confidence}% | Duration: ${duration}s`
    );

    return NextResponse.json({
      success: true,
      extractedData,
    });
  } catch (error: unknown) {
    console.error("Receipt Scan API Error:", error);
    const err = error as { message?: string; code?: string; statusCode?: number };
    const isTimeout = err.code === "TIMEOUT" || err.statusCode === 408;

    return NextResponse.json(
      {
        error: isTimeout
          ? "Server AI sedang mengalami antrean padat (waktu pemrosesan habis). Silakan coba scan ulang struk Anda atau gunakan input manual."
          : err.message || "Terjadi kesalahan saat memproses gambar struk.",
        code: isTimeout ? "SCAN_TIMEOUT" : err.code || "OCR_PROCESSING_FAILED",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
