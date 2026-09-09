import { NextRequest, NextResponse } from "next/server";
import { optimizeReceiptImage } from "@/shared/lib/receipt/resize-image";
import { extractReceiptData } from "@/shared/lib/receipt/extract";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds

export async function POST(req: NextRequest) {
  try {
    let imageBuffer: Buffer | null = null;
    let mimeType = "image/jpeg";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") || formData.get("image");

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

    // 1. Optimize image for AI Vision & OCR (vertical receipt ratio, ~50-80KB)
    const optimizedOcr = await optimizeReceiptImage(imageBuffer, {
      maxWidth: 800,
      maxHeight: 1200,
      quality: 75,
      format: "jpeg",
    });

    // 2. Extract Receipt Data using NVIDIA Multimodal Vision AI Model
    const extractedData = await extractReceiptData(
      optimizedOcr.base64,
      optimizedOcr.mimeType || mimeType
    );

    // 3. Validate if image is actually a valid receipt
    if (extractedData.isReceipt === false || extractedData.confidence < 40) {
      const isBlurry =
        extractedData.rejectionReason?.toLowerCase().includes("buram") ||
        extractedData.rejectionReason?.toLowerCase().includes("blurry") ||
        extractedData.rejectionReason?.toLowerCase().includes("terbaca");

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

    return NextResponse.json({
      success: true,
      extractedData,
    });
  } catch (error: unknown) {
    console.error("Receipt Scan API Error:", error);
    const err = error as { message?: string; code?: string };
    return NextResponse.json(
      {
        error: err.message || "Terjadi kesalahan saat memproses gambar struk.",
        code: err.code || "OCR_PROCESSING_FAILED",
      },
      { status: 500 }
    );
  }
}
