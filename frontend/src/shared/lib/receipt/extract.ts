import path from "path";
import fs from "fs";
import { NvidiaModelsClient } from "./nvidia-models";

declare const __non_webpack_require__: NodeRequire | undefined;
import { detectCategory } from "./categorize";
import type { ReceiptItem, ExtractedReceiptData } from "./types";
import { generateSimulatedReceipt } from "./sample";

export type { ReceiptItem, ExtractedReceiptData };
export { generateSimulatedReceipt };

const RECEIPT_EXTRACTION_SYSTEM_PROMPT = `You are FINUSA AI, an expert financial data extraction assistant specialized in analyzing receipts, invoices, and payment proof (Indomaret, Alfamart, Supermarket, Restoran, Kafe, SPBU Pertamina, Apotek, etc.).

Analyze the receipt image or text carefully and return a single valid JSON object strictly matching this schema:
{
  "merchant": "Name of the store / merchant / merchant brand",
  "merchantAddress": "Address or branch location if visible, or null",
  "date": "Date of transaction in YYYY-MM-DD format (convert Indonesian months, e.g. 23 Ags 2024 -> 2024-08-23). If not found, use current date",
  "time": "Time of transaction in HH:MM:SS or HH:MM format, or null",
  "items": [
    {
      "name": "Item description or product name",
      "quantity": 1,
      "price": 15000,
      "totalPrice": 15000
    }
  ],
  "subtotal": 0,
  "tax": 0,
  "serviceCharge": 0,
  "discount": 0,
  "total": 0,
  "paymentMethod": "Cash / QRIS / Debit / Credit / GoPay / OVO / ShopeePay / Transfer / Unknown",
  "confidence": 95,
  "suggestedCategory": "Makanan & Minuman | Belanja & Groceries | Transportasi | Utilitas & Tagihan | Kesehatan | Hiburan & Rekreasi | Operasional Usaha | Lainnya"
}

MANDATORY RULES:
1. Output ONLY the JSON object. Do NOT write any introduction, commentary, conversational text, or markdown headers (like **Receipt Analysis**).
2. Start your response directly with '{' and end with '}'.
3. Format all monetary amounts as clean numbers without currency symbols (Rp), dots, or commas (e.g. Rp 45.000 -> 45000, 36,000 -> 36000).
4. If total is printed explicitly (Grand Total / Total Akhir / Bayar), make sure 'total' equals that final amount.
5. If items list is blurry but total is clear, extract whatever items possible and ensure total matches.
6. If the receipt is completely illegible or empty, set confidence to < 40 and total to 0.`;

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
  const items: ReceiptItem[] = Array.isArray(parsed.items)
    ? parsed.items.map((item: Record<string, unknown>, idx: number) => {
        const qty = cleanNumber(item.quantity) || 1;
        const price = cleanNumber(item.price);
        const totalPrice = cleanNumber(item.totalPrice) || qty * price;
        return {
          id: `item-${Date.now()}-${idx}`,
          name: String(item.name || `Item ${idx + 1}`).trim(),
          quantity: qty,
          price: price || (qty > 0 ? Math.round(totalPrice / qty) : totalPrice),
          totalPrice,
        };
      })
    : [];

  const total = cleanNumber(parsed.total);
  const subtotal = cleanNumber(parsed.subtotal) || (items.length > 0 ? items.reduce((acc, i) => acc + i.totalPrice, 0) : total);
  const tax = cleanNumber(parsed.tax);
  const serviceCharge = cleanNumber(parsed.serviceCharge);
  const discount = cleanNumber(parsed.discount);

  const merchant = String(parsed.merchant || "Toko / Merchant").trim();
  const category = typeof parsed.suggestedCategory === "string" && parsed.suggestedCategory.trim()
    ? parsed.suggestedCategory.trim()
    : detectCategory(merchant, items);

  return {
    merchant,
    merchantAddress: typeof parsed.merchantAddress === "string" ? parsed.merchantAddress : undefined,
    date: normalizeDate(typeof parsed.date === "string" ? parsed.date : undefined),
    time: typeof parsed.time === "string" ? parsed.time : new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    category,
    items,
    subtotal,
    tax,
    serviceCharge,
    discount,
    total: total || subtotal + tax + serviceCharge - discount,
    paymentMethod: typeof parsed.paymentMethod === "string" ? parsed.paymentMethod : "QRIS",
    confidence: Math.min(100, Math.max(0, cleanNumber(parsed.confidence) || 90)),
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
    const visionPrompt = `Extract the transaction data from this receipt image. Output strictly the requested JSON object starting with '{' and ending with '}'. Do NOT write any introduction, commentary, or markdown text outside the JSON.`;
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

      const textPrompt = `Below is raw OCR text extracted from a receipt. Structurize this text into the requested JSON schema:\n\n"""\n${ocrText}\n"""`;
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


