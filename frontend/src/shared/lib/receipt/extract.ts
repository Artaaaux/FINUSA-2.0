import path from "path";
import fs from "fs";
import { NvidiaModelsClient } from "./nvidia-models";

declare const __non_webpack_require__: NodeRequire | undefined;
import { detectCategory } from "./categorize";
import type { ReceiptItem, ExtractedReceiptData } from "./types";
import { generateSimulatedReceipt } from "./sample";

export type { ReceiptItem, ExtractedReceiptData };
export { generateSimulatedReceipt };

const RECEIPT_EXTRACTION_SYSTEM_PROMPT = `You are FINUSA AI, an expert financial receipt verification and data extraction assistant.

CRITICAL FIRST STEP - RECEIPT VERIFICATION:
Carefully examine the visual content of the image before extracting any data.
1. Determine whether the image contains an actual printed receipt, cash register slip, supermarket/store invoice, restaurant bill, or electronic payment proof (e-receipt, QRIS, or transfer screenshot).
2. If the image is NOT a receipt (for example: photo of a room, bookshelf, furniture, person, selfie, clothing, pet, landscape, random objects, food without a bill, or document without financial transactions):
   You MUST return strictly:
   {
     "isReceipt": false,
     "confidence": 0,
     "rejectionReason": "Foto bukan struk belanja atau bukti transaksi keuangan."
   }
   ABSOLUTELY DO NOT guess, fabricate, or hallucinate store names, items, or prices!

3. If the image contains a receipt but it is completely blurry, illegible, or unreadable:
   You MUST return strictly:
   {
     "isReceipt": false,
     "confidence": 0,
     "rejectionReason": "Gambar struk terlalu buram atau tidak terbaca."
   }

4. ONLY if the image is a genuine, readable receipt or payment proof, return strictly:
   {
     "isReceipt": true,
     "merchant": "Actual store or merchant name seen on receipt",
     "merchantAddress": "Address if visible, or null",
     "date": "YYYY-MM-DD",
     "time": "HH:MM",
     "items": [
       {
         "name": "Item name visible on receipt",
         "quantity": 1,
         "price": 0,
         "totalPrice": 0
       }
     ],
     "subtotal": 0,
     "tax": 0,
     "serviceCharge": 0,
     "discount": 0,
     "total": 0,
     "paymentMethod": "Cash / QRIS / Debit / Credit / Transfer / Unknown",
     "confidence": 95,
     "suggestedCategory": "Makanan & Minuman | Belanja & Groceries | Transportasi | Utilitas & Tagihan | Kesehatan | Hiburan & Rekreasi | Operasional Usaha | Lainnya"
   }

STRICT RULES:
1. Output ONLY a valid JSON object. No conversational prose or markdown wrap outside JSON.
2. Format all prices and totals as raw numbers without currency symbols (Rp) or commas.
3. NEVER invent dummy transactions if the photo is not a receipt.`;

/**
 * Normalizes Indonesian date formats to ISO YYYY-MM-DD
 */
function normalizeDate(rawDate?: string): string {
  if (!rawDate) return new Date().toISOString().split("T")[0];

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate;
  }

  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {
    // ignore
  }

  // Fallback to today
  return new Date().toISOString().split("T")[0];
}

/**
 * Cleans and guarantees numerical values
 */
function cleanNumber(val: unknown): number {
  if (typeof val === "number") return isNaN(val) ? 0 : Math.abs(val);
  if (typeof val === "string") {
    const cleaned = val.replace(/[^0-9.-]+/g, "");
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.abs(num);
  }
  return 0;
}

/**
 * Repairs malformed JSON strings commonly returned by LLMs
 */
function repairJsonString(raw: string): string {
  let cleaned = raw.trim();

  // 1. Remove markdown code fence if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  // 2. Remove comments
  cleaned = cleaned.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

  // 3. Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  // 4. Fix numbers with commas as thousands separators (e.g. ": 36,000" -> ": 36000")
  cleaned = cleaned.replace(/:\s*(\d{1,3}(?:,\d{3})+)(\s*[,}\]])/g, (_, num, end) => {
    return `: ${num.replace(/,/g, "")}${end}`;
  });

  // 5. Fix unquoted currency strings (e.g. ": Rp 70.000" or ": Rp 70,000" -> ": 70000")
  cleaned = cleaned.replace(/:\s*(?:Rp\.?|IDR)\s*([0-9.,]+)(\s*[,}\]])/gi, (_, val, end) => {
    const cleanNum = val.replace(/[^0-9]/g, "");
    return `: ${cleanNum}${end}`;
  });

  return cleaned;
}

/**
 * Attempts to parse a candidate JSON string, with repair fallback
 */
function tryParseJson(candidate: string): Record<string, unknown> | null {
  if (!candidate || candidate.trim().length < 2) return null;
  const trimmed = candidate.trim();

  // 1. Standard parse
  try {
    const obj = JSON.parse(trimmed);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return obj as Record<string, unknown>;
    }
  } catch {
    // continue to repair
  }

  // 2. Repaired parse
  try {
    const repaired = repairJsonString(trimmed);
    const obj = JSON.parse(repaired);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return obj as Record<string, unknown>;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Finds all balanced top-level JSON objects by tracking brace depth in a single O(N) pass
 */
function findBalancedJsonObjects(text: string): string[] {
  const results: string[] = [];
  let depth = 0;
  let startIdx = -1;
  let inString = false;
  let escape = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (char === "\\") {
      escape = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === "{") {
        if (depth === 0) startIdx = i;
        depth++;
      } else if (char === "}") {
        depth--;
        if (depth === 0 && startIdx !== -1) {
          results.push(text.substring(startIdx, i + 1));
          startIdx = -1;
        }
      }
    }
  }
  return results;
}

/**
 * Fallback parser that heuristically extracts receipt data from plain markdown/text
 * when the model produces structured text instead of raw JSON.
 */
function parseReceiptFromPlainText(text: string): Record<string, unknown> | null {
  const result: Record<string, unknown> = {};

  const merchantMatch = text.match(/(?:Merchant|Toko|Store)\s*(?:Name)?\s*[:=]\s*([^\n\r*]+)/i);
  if (merchantMatch) result.merchant = merchantMatch[1].trim();

  const addressMatch = text.match(/(?:Address|Alamat)\s*[:=]\s*([^\n\r*]+)/i);
  if (addressMatch) result.merchantAddress = addressMatch[1].trim();

  const dateMatch = text.match(/(?:Date|Tanggal|Tgl)\s*[:=]\s*([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})/i);
  if (dateMatch) result.date = dateMatch[1].trim();

  const timeMatch = text.match(/(?:Time|Waktu|Jam)\s*[:=]\s*([0-9]{1,2}:[0-9]{2}(?::[0-9]{2})?)/i);
  if (timeMatch) result.time = timeMatch[1].trim();

  const totalMatch = text.match(/(?:Grand Total|Total Akhir|Total)\s*[:=]?\s*(?:Rp\.?|IDR)?\s*([0-9.,]+)/i);
  if (totalMatch) {
    result.total = parseFloat(totalMatch[1].replace(/[^0-9]/g, "")) || 0;
  }

  const paymentMatch = text.match(/(?:Payment|Metode Pembayaran|Bayar)\s*[:=]\s*([^\n\r*]+)/i);
  if (paymentMatch) result.paymentMethod = paymentMatch[1].trim();

  // Extract items from lines starting with *, -, or +
  const items: Array<{ name: string; quantity: number; price: number; totalPrice: number }> = [];
  const itemLines = text.match(/^\s*[*+-]\s+([^:\n\r]+)[:=]\s*([^\n\r]+)/gm);
  if (itemLines) {
    for (const line of itemLines) {
      if (/Date|Time|Total|Subtotal|Merchant|Payment|Address|Confidence|Category/i.test(line)) continue;
      const m = line.match(/^\s*[*+-]\s+([^:\n\r]+)[:=]\s*(?:.*?)(?:Rp\.?|IDR)?\s*([0-9.,]+)$/i);
      if (m) {
        const name = m[1].trim();
        const price = parseFloat(m[2].replace(/[^0-9]/g, "")) || 0;
        items.push({ name, quantity: 1, price, totalPrice: price });
      }
    }
  }
  if (items.length > 0) {
    result.items = items;
  }

  if (result.merchant || result.total) {
    return result;
  }
  return null;
}

/**
 * Safely extracts and parses JSON from reasoning LLM outputs (handles markdown blocks, reasoning text, etc.)
 */
function extractJsonFromModelResponse(text: string): Record<string, unknown> {
  if (!text || typeof text !== "string") {
    throw new Error("Respon model AI kosong.");
  }

  // 1. First, check if text has markdown code block: ```json ... ``` or ``` ... ```
  const codeBlockMatches = text.matchAll(/```(?:json)?\s*([\s\S]*?)\s*```/gi);
  for (const match of codeBlockMatches) {
    if (match && match[1]) {
      const parsed = tryParseJson(match[1]);
      if (parsed) return parsed;
    }
  }

  // 2. Find outermost balanced JSON object by counting braces { and } in O(N)
  const balancedObjects = findBalancedJsonObjects(text);
  for (const candidate of balancedObjects) {
    const parsed = tryParseJson(candidate);
    if (parsed) return parsed;
  }

  // 3. Fallback: Find from first '{' to last '}'
  const firstOpen = text.indexOf("{");
  const lastClose = text.lastIndexOf("}");
  if (firstOpen !== -1 && lastClose > firstOpen) {
    const candidate = text.substring(firstOpen, lastClose + 1);
    const parsed = tryParseJson(candidate);
    if (parsed) return parsed;
  }

  // 4. Fallback: Heuristic parser from markdown / plain text
  const heuristic = parseReceiptFromPlainText(text);
  if (heuristic) {
    console.warn("[extractJsonFromModelResponse] Parsed receipt heuristically from text output.");
    return heuristic;
  }

  // 5. If everything failed, try clean parse of the full string or throw informative error
  const lastAttempt = tryParseJson(text);
  if (lastAttempt) return lastAttempt;

  throw new Error(`Respon AI tidak memuat format JSON yang valid. Cuplikan respon: ${text.slice(0, 100)}...`);
}

/**
 * Checks whether Tesseract WebAssembly binaries are present on disk before spawning worker
 */
function isTesseractWasmAvailable(): boolean {
  try {
    const req = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : require;
    const corePkg = req.resolve("tesseract.js-core/package.json");
    const coreDir = path.dirname(corePkg);
    const candidateFiles = [
      "tesseract-core-relaxedsimd.wasm",
      "tesseract-core-simd.wasm",
      "tesseract-core.wasm",
    ];
    return candidateFiles.some((file) => fs.existsSync(path.join(coreDir, file)));
  } catch {
    return false;
  }
}

/**
 * Executes local Tesseract OCR with safety checks and timeout to prevent serverless worker hangs
 */
async function performOcr(imageInput: string): Promise<string> {
  if (!isTesseractWasmAvailable()) {
    console.warn("[performOcr] Tesseract WASM binaries not found in environment, skipping local OCR fallback.");
    throw new Error("Local OCR WASM binary is not available in this serverless environment.");
  }

  const ocrPromise = async () => {
    let worker;
    try {
      const workerOptions: Record<string, unknown> = {};

      try {
        const req = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : require;
        const tesseractEntry = req.resolve("tesseract.js/package.json");
        const workerPath = path.join(path.dirname(tesseractEntry), "dist", "worker.min.js");
        if (fs.existsSync(workerPath)) {
          workerOptions.workerPath = workerPath;
        }
      } catch {
        // fallback if require.resolve is unavailable
      }

      // Check for local traineddata files to avoid remote CDN download delay
      const candidateDirs = [
        process.cwd(),
        path.join(process.cwd(), "frontend"),
        path.resolve(__dirname, "../../../.."),
      ];

      for (const dir of candidateDirs) {
        if (fs.existsSync(path.join(dir, "eng.traineddata")) || fs.existsSync(path.join(dir, "ind.traineddata"))) {
          workerOptions.langPath = dir;
          workerOptions.gzip = false;
          break;
        }
      }

      const { createWorker } = await import("tesseract.js");
      worker = await createWorker("ind+eng", 1, workerOptions);
      const ret = await worker.recognize(imageInput);
      return ret.data.text || "";
    } finally {
      if (worker) {
        await worker.terminate().catch(() => {});
      }
    }
  };

  return Promise.race([
    ocrPromise(),
    new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error("OCR operation timed out after 12 seconds")), 12000)
    ),
  ]);
}

/**
 * Helper to construct ExtractedReceiptData from parsed JSON
 */
function buildExtractedData(parsed: Record<string, unknown>): ExtractedReceiptData {
  const isReceiptExplicit = parsed.isReceipt !== false && parsed.is_receipt !== false;
  const rejectionReason = typeof parsed.rejectionReason === "string"
    ? parsed.rejectionReason
    : typeof parsed.rejection_reason === "string"
    ? parsed.rejection_reason
    : undefined;

  // If the model explicitly identified this is not a receipt
  if (!isReceiptExplicit) {
    return {
      isReceipt: false,
      rejectionReason: rejectionReason || "Foto yang diambil bukan struk belanja atau bukti transaksi keuangan.",
      merchant: "",
      date: normalizeDate(),
      category: "Lainnya",
      items: [],
      subtotal: 0,
      tax: 0,
      serviceCharge: 0,
      discount: 0,
      total: 0,
      paymentMethod: "",
      confidence: 0,
      isSimulated: false,
    };
  }

  // Handle nested objects if the model put details in receiptDetails, receipt, or data
  const data = (
    parsed.receiptDetails && typeof parsed.receiptDetails === "object"
      ? parsed.receiptDetails
      : parsed.receipt && typeof parsed.receipt === "object"
      ? parsed.receipt
      : parsed.data && typeof parsed.data === "object"
      ? parsed.data
      : parsed
  ) as Record<string, unknown>;

  const rawItems = Array.isArray(data.items)
    ? data.items
    : Array.isArray(parsed.items)
    ? parsed.items
    : [];

  const items: ReceiptItem[] = rawItems.map((item: Record<string, unknown>, idx: number) => {
    const qty = cleanNumber(item.quantity || item.qty) || 1;
    const price = cleanNumber(item.unitPrice || item.price);
    const totalPrice = cleanNumber(item.totalPrice || item.subtotal || item.total) || qty * price;
    return {
      id: `item-${Date.now()}-${idx}`,
      name: String(item.name || item.description || item.itemName || `Item ${idx + 1}`).trim(),
      quantity: qty,
      price: price || (qty > 0 ? Math.round(totalPrice / qty) : totalPrice),
      totalPrice,
    };
  });

  const total = cleanNumber(data.total || parsed.total || data.grandTotal);
  const subtotal = cleanNumber(data.subTotal || data.subtotal || parsed.subTotal || parsed.subtotal) ||
    (items.length > 0 ? items.reduce((acc, i) => acc + i.totalPrice, 0) : total);
  const tax = cleanNumber(data.tax || parsed.tax);
  const serviceCharge = cleanNumber(data.serviceCharge || parsed.serviceCharge);
  const discount = cleanNumber(data.discount || parsed.discount);

  const rawMerchant = typeof data.storeName === "string"
    ? data.storeName.trim()
    : typeof data.merchant === "string"
    ? data.merchant.trim()
    : typeof parsed.merchant === "string"
    ? parsed.merchant.trim()
    : "";
  const merchant = rawMerchant || "Toko / Merchant";
  const category = typeof data.suggestedCategory === "string" && data.suggestedCategory.trim()
    ? data.suggestedCategory.trim()
    : typeof parsed.suggestedCategory === "string" && parsed.suggestedCategory.trim()
    ? parsed.suggestedCategory.trim()
    : detectCategory(merchant, items);

  let parsedConfidence = parsed.confidence !== undefined
    ? cleanNumber(parsed.confidence)
    : data.confidence !== undefined
    ? cleanNumber(data.confidence)
    : 85;

  // If confidence was given on a 0.0 - 1.0 scale, convert to percentage (e.g. 0.95 -> 95, 1 -> 100)
  if (parsedConfidence > 0 && parsedConfidence <= 1) {
    parsedConfidence = Math.round(parsedConfidence * 100);
  }

  // Sanity check: If total is 0, no items, or confidence is very low, treat as invalid receipt
  if ((items.length === 0 && total <= 0) || parsedConfidence < 30) {
    return {
      isReceipt: false,
      rejectionReason: rejectionReason || "Tidak ditemukan rincian transaksi struk belanja yang valid.",
      merchant: rawMerchant,
      date: normalizeDate(typeof parsed.date === "string" ? parsed.date : undefined),
      category: "Lainnya",
      items: [],
      subtotal: 0,
      tax: 0,
      serviceCharge: 0,
      discount: 0,
      total: 0,
      paymentMethod: "",
      confidence: parsedConfidence,
      isSimulated: false,
    };
  }

  return {
    isReceipt: true,
    merchant,
    merchantAddress: typeof data.merchantAddress === "string"
      ? data.merchantAddress
      : typeof parsed.merchantAddress === "string"
      ? parsed.merchantAddress
      : undefined,
    date: normalizeDate(typeof data.transactionDate === "string" ? data.transactionDate : typeof data.date === "string" ? data.date : typeof parsed.date === "string" ? parsed.date : undefined),
    time: typeof data.transactionTime === "string" ? data.transactionTime : typeof data.time === "string" ? data.time : typeof parsed.time === "string" ? parsed.time : new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    category,
    items,
    subtotal,
    tax,
    serviceCharge,
    discount,
    total: total || subtotal + tax + serviceCharge - discount,
    paymentMethod: typeof data.paymentMethod === "string" ? data.paymentMethod : typeof parsed.paymentMethod === "string" ? parsed.paymentMethod : "QRIS",
    confidence: Math.min(100, Math.max(0, parsedConfidence)),
    notes: undefined,
    isSimulated: false,
  };
}

/**
 * Extracts structured financial data from an image buffer or base64 using NVIDIA Multimodal Vision & OCR
 */
export async function extractReceiptData(
  base64Image: string,
  mimeType = "image/jpeg"
): Promise<ExtractedReceiptData> {
  const client = new NvidiaModelsClient();

  if (!client.isConfigured()) {
    throw new Error("NVIDIA API Key belum dikonfigurasi di environment variables (NVIDIA_API_KEY).");
  }

  const imageUrl = base64Image.startsWith("data:")
    ? base64Image
    : `data:${mimeType};base64,${base64Image}`;

  // PRIMARY METHOD: Direct NVIDIA Multimodal Vision Analysis (Fast ~2-4s, Serverless-safe, No Tesseract worker issues)
  try {
    const visionPrompt = `Verify and extract data from this image. If this image is NOT an actual receipt or invoice, output {"isReceipt": false, "confidence": 0, "rejectionReason": "Foto bukan struk belanja atau bukti transaksi keuangan."}. Do NOT invent data. Output strictly the requested JSON object starting with '{' and ending with '}'.`;
    const rawResponse = await client.analyzeImage(
      imageUrl,
      mimeType,
      visionPrompt,
      RECEIPT_EXTRACTION_SYSTEM_PROMPT
    );

    const parsed = extractJsonFromModelResponse(rawResponse);
    return buildExtractedData(parsed);
  } catch (visionErr: unknown) {
    console.warn("Direct NVIDIA Vision extraction failed, attempting OCR fallback:", visionErr);

    // FALLBACK METHOD: Local OCR text extraction + NVIDIA Text model
    try {
      const ocrText = await performOcr(imageUrl);

      if (!ocrText || ocrText.trim().length === 0) {
        throw new Error("Gagal membaca teks dari gambar struk (OCR Kosong). Pastikan gambar struk jelas dan tidak blur.");
      }

      const textPrompt = `Below is raw OCR text extracted from a potential receipt. If this text is NOT from an actual receipt or invoice, return {"isReceipt": false, "confidence": 0, "rejectionReason": "Teks tidak mencerminkan transaksi struk belanja."}. Otherwise, structurize this text into the requested JSON schema:\n\n"""\n${ocrText}\n"""`;
      const rawTextResponse = await client.analyzeText(
        textPrompt,
        RECEIPT_EXTRACTION_SYSTEM_PROMPT
      );

      const parsed = extractJsonFromModelResponse(rawTextResponse);
      return buildExtractedData(parsed);
    } catch (fallbackErr: unknown) {
      console.error("Both Vision and OCR fallback failed:", fallbackErr);
      const mainMessage = visionErr instanceof Error ? visionErr.message : "Kesalahan koneksi ke NVIDIA API";
      throw new Error(`Gagal memproses struk belanja: ${mainMessage}`);
    }
  }
}



