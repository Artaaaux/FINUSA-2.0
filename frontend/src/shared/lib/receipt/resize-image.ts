import sharp from "sharp";

export interface OptimizedImageResult {
  buffer: Buffer;
  base64: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  resolution?: string;
}

/**
 * Server-side image optimization using Sharp
 * - Corrects EXIF rotation
 * - Resizes proportionally to maxWidth/maxHeight (default 1000x1000 for OCR)
 * - Converts to optimized JPEG/WebP with target file size (~100KB)
 */
export async function optimizeReceiptImage(
  input: Buffer | Uint8Array,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: "jpeg" | "webp";
    /** Stretch contrast + mild sharpen (improves legibility of faded thermal receipts for AI) */
    enhance?: boolean;
  } = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 80,
    format = "jpeg",
    enhance = false,
  } = options;

  let pipeline = sharp(input).rotate(); // auto-rotate based on EXIF

  pipeline = pipeline.resize({
    width: maxWidth,
    height: maxHeight,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (enhance) {
    pipeline = pipeline.normalise().sharpen({ sigma: 1 });
  }

  let outputBuffer: Buffer;
  let mimeType: string;

  if (format === "webp") {
    outputBuffer = await pipeline.webp({ quality, effort: 4 }).toBuffer();
    mimeType = "image/webp";
  } else {
    outputBuffer = await pipeline
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer();
    mimeType = "image/jpeg";
  }

  // If buffer is still too large, do a second pass with lower quality.
  // AI-bound (enhanced) images get a larger budget so small receipt text is not destroyed by compression.
  const maxBytes = enhance ? 400 * 1024 : 150 * 1024;
  const secondPassQuality = enhance ? 75 : 60;
  if (outputBuffer.length > maxBytes && quality > 65) {
    if (format === "webp") {
      outputBuffer = await sharp(outputBuffer).webp({ quality: secondPassQuality }).toBuffer();
    } else {
      outputBuffer = await sharp(outputBuffer).jpeg({ quality: secondPassQuality, mozjpeg: true }).toBuffer();
    }
  }

  const finalMeta = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    base64: outputBuffer.toString("base64"),
    mimeType,
    sizeBytes: outputBuffer.length,
    width: finalMeta.width,
    height: finalMeta.height,
    resolution: `${finalMeta.width || 0}x${finalMeta.height || 0}`,
  };
}

/**
 * Creates a smaller thumbnail (e.g. 500x500 max) for Supabase Storage archiving
 */
export async function createStorageReceiptImage(
  input: Buffer | Uint8Array
): Promise<OptimizedImageResult> {
  return optimizeReceiptImage(input, {
    maxWidth: 500,
    maxHeight: 500,
    quality: 75,
    format: "jpeg",
  });
}
