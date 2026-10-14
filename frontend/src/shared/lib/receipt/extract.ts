import path from "path";
import fs from "fs";
import { createRequire } from "node:module";
import { NvidiaModelsClient } from "./nvidia-models";
import { detectCategory, detectItemCategory } from "./categorize";
import type { ReceiptItem, ExtractedReceiptData } from "./types";
import { generateSimulatedReceipt } from "./sample";
import {
  getCurrentScanTime,
  normalizeTime,
  ALLOWED_PAYMENT_METHODS,
  AllowedPaymentMethod,
  normalizePaymentMethod,
} from "./utils";

export type { ReceiptItem, ExtractedReceiptData, AllowedPaymentMethod };
export {
  generateSimulatedReceipt,
  getCurrentScanTime,
  normalizeTime,
  ALLOWED_PAYMENT_METHODS,
  normalizePaymentMethod,
};

const RECEIPT_EXTRACTION_SYSTEM_PROMPT = `You are FINUSA AI, an expert at reading Indonesian shopping receipts and categorizing expenses.

CONTEXT: The user opened a receipt-scanner app and INTENDS to photograph a receipt. Real receipt photos are often imperfect: the receipt may be small in the frame, lying on a floor, table, or in a hand, crumpled, tilted, shadowed, or printed on faded thermal paper. Screenshots of digital receipts (e-receipts), invoices, and payment confirmation screens (e-wallet, QRIS, bank transfer) are also valid. All of these ARE receipts.

STEP 1 - OBSERVE (always fill "evidence"):
- "visibleText": up to 8 short text lines you can actually read in the image, copied as printed.
- "receiptSignals": which of these you actually see:
  "merchant_name", "item_lines_with_prices", "total_keyword" (Total / Subtotal / Grand Total / Jumlah),
  "payment_keyword" (Tunai / Cash / Bayar / Kembali / Kembalian / QRIS / Debit / Transfer),
  "receipt_number" (No Nota / No. Struk / Invoice / Kasir / Order), "date_or_time",
  "currency_amounts" (Rp, or numbers such as 19.000 / 19,000).

STEP 2 - DECIDE:
- isReceipt = true when at least 2 receiptSignals are visible, regardless of the background (floor, table, hand, etc.).
- isReceipt = false ONLY when the image clearly contains no transaction document, e.g. a logo, poster, artwork, selfie, person, pet, landscape, a room or object with no paper bill, food without a bill, or a screen showing code / websites / non-payment content.
- If it looks like a receipt but the amounts are too small or blurry to read, use isReceipt = false with rejectionCode "UNREADABLE".

STEP 3 - EXTRACT (only when isReceipt = true). Categorize EACH item into exactly ONE Finusa expense category:
- "Makan": All food, drinks, snacks, restaurant meals, cafe drinks, bakery, groceries meant for consumption (e.g. roti, beras, susu, mie instan, telur, kopi, buah, sayur, cemilan, biskuit, sosis).
- "Kebutuhan": Daily household necessities, hygiene products, toiletries, cleaning supplies, personal care, medicine (e.g. sabun mandi, deterjen, sampo, pasta gigi, sikat gigi, tisu, pembersih lantai, obat, panadol).
- "Transportasi": Fuel, bensin, Pertamax, solar, toll tickets, parking, ojek/taxi fares, vehicle maintenance.
- "Cicilan": Loan installments, debt repayments, monthly billing, credit payments, utilities.
- "Keinginan": Entertainment, recreation, leisure shopping, hobbies, fashion, accessories, toys, cigarettes.
- "Lainnya": General items that do not fit the above categories.

OUTPUT - a single JSON object.
When it IS a receipt:
{
  "evidence": { "visibleText": ["Ayam Geprek Murah", "Total 19,000"], "receiptSignals": ["merchant_name", "total_keyword", "currency_amounts"] },
  "isReceipt": true,
  "merchant": "Actual Store or Merchant Name",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "items": [
    {
      "name": "Item Name as printed",
      "category": "Makan | Kebutuhan | Transportasi | Cicilan | Keinginan | Lainnya",
      "quantity": 1,
      "price": 15000,
      "totalPrice": 15000
    }
  ],
  "total": 15000,
  "paymentMethod": "E-Wallet | QRIS | Transfer Bank | Cash | (leave empty string \\"\\" if not detected on receipt)",
  "confidence": 95
}

When it is NOT a receipt (no other fields):
{
  "evidence": { "visibleText": ["..."], "receiptSignals": [] },
  "isReceipt": false,
  "rejectionCode": "SCREEN | NO_DOCUMENT | NOT_FINANCIAL | UNREADABLE"
}
rejectionCode meaning: SCREEN = photo of a monitor/laptop/TV showing non-payment content; NO_DOCUMENT = no paper bill or document visible (logo, person, room, object); NOT_FINANCIAL = a document or text that is not a transaction (book, letter, notes, poster, menu); UNREADABLE = looks like a receipt but its text cannot be read.

STRICT RULES:
1. Output ONLY a valid JSON object. No conversational prose or markdown wrap outside JSON.
2. Format all prices and totals as raw numbers without currency symbols (Rp) or thousand separators.
3. For "time", strictly format as 24-hour "HH:MM" (e.g. "14:30"). NEVER confuse prices, subtotals, or amounts (such as 20,000 or 20.000) with time! If no valid transaction time is printed on the receipt, output "" (empty string).
4. For "paymentMethod", choose ONLY from: "E-Wallet", "QRIS", "Transfer Bank", "Cash". If unknown or not printed on the receipt, output "" (empty string).
5. Only extract what is actually printed. NEVER invent stores, items, or prices.`;

/**
 * User-facing (Indonesian) rejection messages, mapped from the model's rejectionCode.
 * Kept server-side so the model can never "copy" a rejection sentence without looking at the image.
 */
export const REJECTION_MESSAGES: Record<string, string> = {
  SCREEN:
    "Foto terdeteksi sebagai layar monitor/laptop yang tidak menampilkan bukti transaksi. Arahkan kamera ke struk belanja fisik atau bukti pembayaran resmi.",
  NO_DOCUMENT:
    "Tidak terlihat struk belanja pada foto. Pastikan struk berada di dalam kotak pemindai.",
  NOT_FINANCIAL:
    "Dokumen pada foto bukan struk belanja atau bukti transaksi keuangan.",
  UNREADABLE:
    "Struk terdeteksi, tetapi teksnya buram atau terlalu kecil untuk terbaca. Dekatkan kamera, pastikan cahaya cukup, lalu foto ulang.",
};

const DEFAULT_REJECTION_MESSAGE = "Foto yang diambil bukan struk belanja atau bukti transaksi keuangan.";

/**
 * Deterministic keyword heuristic: does a raw text transcription look like a receipt?
 * Used as a second opinion before rejecting a photo.
 */
export function looksLikeReceiptText(text: string): boolean {
  if (!text) return false;
  const t = text.toLowerCase();
  const keywordPatterns = [
    /\b(sub\s*total|total|grand\s*total|jumlah)\b/,
    /\b(tunai|cash|bayar|kembali|kembalian|change|qris|debit|kredit|transfer|ovo|gopay|dana|shopeepay)\b/,
    /\b(nota|struk|kasir|cashier|invoice|receipt|order|trx|transaksi)\b/,
    /\b(rp\.?|idr)\s*\d/,
    /\b(ppn|pajak|tax|diskon|discount|service|qty)\b/,
  ];
  const keywordHits = keywordPatterns.filter((p) => p.test(t)).length;
  const amountMatches = t.match(/\b\d{1,3}(?:[.,]\d{3})+\b/g) || [];
  return (keywordHits >= 2 && amountMatches.length >= 2) || (keywordHits >= 1 && amountMatches.length >= 3);
}

/**
 * Normalizes Indonesian date formats to ISO YYYY-MM-DD
 */
function normalizeDate(rawDate?: string): string {
  const today = new Date().toISOString().split("T")[0];
  if (!rawDate || !rawDate.trim()) return today;

  const trimmed = rawDate.trim();

  // If already ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[\/\.-](\d{1,2})[\/\.-](\d{2,4})$/);
  if (dmyMatch) {
    let day = parseInt(dmyMatch[1], 10);
    let month = parseInt(dmyMatch[2], 10);
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) year += 2000;

    // Check if month and day might be flipped (if month > 12 and day <= 12)
    if (month > 12 && day <= 12) {
      const temp = day;
      day = month;
      month = temp;
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${year}-${pad(month)}-${pad(day)}`;
    }
  }

  // Handle Indonesian month names: e.g. "14 Oktober 2026", "14 Okt 2026", "14-Okt-2026"
  const monthMap: Record<string, string> = {
    jan: "01", januari: "01", january: "01",
    feb: "02", februari: "02", february: "02",
    mar: "03", maret: "03", march: "03",
    apr: "04", april: "04",
    mei: "05", may: "05",
    jun: "06", juni: "06", june: "06",
    jul: "07", juli: "07", july: "07",
    agu: "08", agt: "08", agustus: "08", august: "08",
    sep: "09", september: "09",
    okt: "10", oktober: "10", october: "10",
    nov: "11", november: "11",
    des: "12", desember: "12", december: "12",
  };

  const textMonthMatch = trimmed.match(/(\d{1,2})\s*[-/\s]\s*([a-zA-Z]+)\s*[-/\s]\s*(\d{2,4})/);
  if (textMonthMatch) {
    const day = parseInt(textMonthMatch[1], 10);
    const mStr = textMonthMatch[2].toLowerCase();
    let year = parseInt(textMonthMatch[3], 10);
    if (year < 100) year += 2000;

    const matchedMonth = Object.keys(monthMap).find((k) => mStr.startsWith(k));
    if (matchedMonth && day >= 1 && day <= 31) {
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${year}-${monthMap[matchedMonth]}-${pad(day)}`;
    }
  }

  try {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split("T")[0];
    }
  } catch {
    // ignore
  }

  // Fallback to today
  return today;
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
    const req = createRequire(import.meta.url);
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
function buildExtractedData(
  parsed: Record<string, unknown>,
  clientTime?: string,
  clientTimezone?: string
): ExtractedReceiptData {
  const isReceiptExplicit = parsed.isReceipt !== false && parsed.is_receipt !== false;
  const rawCode = typeof parsed.rejectionCode === "string"
    ? parsed.rejectionCode
    : typeof parsed.rejection_code === "string"
    ? parsed.rejection_code
    : "";
  const rejectionCode = rawCode.trim().toUpperCase() || undefined;
  const modelReason = typeof parsed.rejectionReason === "string"
    ? parsed.rejectionReason
    : typeof parsed.rejection_reason === "string"
    ? parsed.rejection_reason
    : undefined;
  const rejectionReason =
    (rejectionCode && REJECTION_MESSAGES[rejectionCode]) || modelReason || DEFAULT_REJECTION_MESSAGE;

  // If the model explicitly identified this is not a receipt
  if (!isReceiptExplicit) {
    return {
      isReceipt: false,
      rejectionCode: rejectionCode && REJECTION_MESSAGES[rejectionCode] ? rejectionCode : "NOT_RECEIPT",
      rejectionReason,
      merchant: "",
      date: normalizeDate(),
      time: clientTime || getCurrentScanTime(clientTimezone),
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
    const name = String(item.name || item.description || item.itemName || `Item ${idx + 1}`).trim();
    const itemCat = typeof item.category === "string" && item.category.trim()
      ? item.category.trim()
      : detectItemCategory(name);

    return {
      id: `item-${Date.now()}-${idx}`,
      name,
      category: itemCat,
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
  const category = detectCategory(merchant, items);

  let parsedConfidence = parsed.confidence !== undefined
    ? cleanNumber(parsed.confidence)
    : data.confidence !== undefined
    ? cleanNumber(data.confidence)
    : 85;

  // If confidence was given on a 0.0 - 1.0 scale, convert to percentage (e.g. 0.95 -> 95, 1 -> 100)
  if (parsedConfidence > 0 && parsedConfidence <= 1) {
    parsedConfidence = Math.round(parsedConfidence * 100);
  }

  // Sanity check: the model said "receipt" but nothing usable was extracted -> treat as unreadable receipt.
  // Sanity check: A genuine financial receipt MUST have at least one non-zero monetary transaction value.
  // If total is 0 and no item has a positive price, it is arbitrary text or a logo/document, not a transaction.
  const hasMonetaryValue = total > 0 || items.some((i) => i.price > 0 || i.totalPrice > 0);
  if (!hasMonetaryValue) {
    return {
      isReceipt: false,
      rejectionCode: "NOT_FINANCIAL",
      rejectionReason: REJECTION_MESSAGES.NOT_FINANCIAL,
      merchant: rawMerchant,
      date: normalizeDate(typeof parsed.date === "string" ? parsed.date : undefined),
      time: clientTime || getCurrentScanTime(clientTimezone),
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
    time: normalizeTime(typeof data.transactionTime === "string" ? data.transactionTime : typeof data.time === "string" ? data.time : typeof parsed.time === "string" ? parsed.time : undefined, clientTime, clientTimezone),
    category,
    items,
    subtotal,
    tax,
    serviceCharge,
    discount,
    total: total || subtotal + tax + serviceCharge - discount,
    paymentMethod: normalizePaymentMethod(typeof data.paymentMethod === "string" ? data.paymentMethod : typeof parsed.paymentMethod === "string" ? parsed.paymentMethod : undefined),
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
  mimeType = "image/jpeg",
  clientTime?: string,
  clientTimezone?: string
): Promise<ExtractedReceiptData> {
  const client = new NvidiaModelsClient();

  if (!client.isConfigured()) {
    throw new Error("NVIDIA API Key belum dikonfigurasi di environment variables (NVIDIA_API_KEY).");
  }

  const imageUrl = base64Image.startsWith("data:")
    ? base64Image
    : `data:${mimeType};base64,${base64Image}`;

  // PRIMARY METHOD: Direct NVIDIA Multimodal Vision Analysis (Serverless-safe, No Tesseract worker issues)
  const startedAt = Date.now();
  try {
    const visionPrompt = `Follow STEP 1, STEP 2 and STEP 3 for the attached image and return the JSON object.`;
    const rawResponse = await client.analyzeImage(
      imageUrl,
      mimeType,
      visionPrompt,
      RECEIPT_EXTRACTION_SYSTEM_PROMPT,
      { timeoutMs: 45000 }
    );

    const parsed = extractJsonFromModelResponse(rawResponse);
    const firstPass = buildExtractedData(parsed, clientTime, clientTimezone);
    if (firstPass.isReceipt !== false) {
      return firstPass;
    }

    console.info(
      `[RECEIPT_SCAN:AI_REJECT_PASS1] Code: ${firstPass.rejectionCode} | Evidence: ${JSON.stringify(parsed.evidence ?? null).slice(0, 400)} | Raw: ${rawResponse.slice(0, 200).replace(/\s+/g, " ")}`
    );

    // SECOND OPINION: before rejecting, transcribe all text and check for receipt keywords.
    // A false rejection is far more costly to the user than a few extra seconds.
    const elapsedMs = Date.now() - startedAt;
    const remainingMs = 50000 - elapsedMs;
    if (remainingMs < 15000) {
      return firstPass;
    }

    try {
      const transcription = await client.analyzeImage(
        imageUrl,
        mimeType,
        "Transcribe ALL text visible in this image exactly as printed, line by line. Output plain text only, no commentary. If there is no readable text, output NO_TEXT.",
        undefined,
        { jsonMode: false, maxTokens: 1024, timeoutMs: Math.min(20000, remainingMs - 5000) }
      );

      const receiptLike = looksLikeReceiptText(transcription);
      console.info(
        `[RECEIPT_SCAN:AI_SECOND_OPINION] ReceiptLike: ${receiptLike} | Text: ${transcription.slice(0, 200).replace(/\s+/g, " ")}`
      );

      if (!receiptLike) {
        return firstPass;
      }

      const textPrompt = `The user photographed a document and this is a text transcription of everything visible in the photo. Apply STEP 1, STEP 2 and STEP 3 to this transcription (treat it as the image content) and return the JSON object:\n\n"""\n${transcription}\n"""`;
      const rawTextResponse = await client.analyzeText(textPrompt, RECEIPT_EXTRACTION_SYSTEM_PROMPT, {
        timeoutMs: Math.max(10000, 50000 - (Date.now() - startedAt)),
      });
      const secondPass = buildExtractedData(
        extractJsonFromModelResponse(rawTextResponse),
        clientTime,
        clientTimezone
      );
      return secondPass.isReceipt !== false ? secondPass : firstPass;
    } catch (secondOpinionErr: unknown) {
      console.warn("[RECEIPT_SCAN:AI_SECOND_OPINION] failed, keeping first-pass result:", secondOpinionErr);
      return firstPass;
    }
  } catch (visionErr: unknown) {
    console.warn("Direct NVIDIA Vision extraction failed, attempting OCR fallback:", visionErr);

    // FALLBACK METHOD: Local OCR text extraction + NVIDIA Text model
    try {
      const ocrText = await performOcr(imageUrl);

      if (!ocrText || ocrText.trim().length === 0) {
        throw new Error("Gagal membaca teks dari gambar struk (OCR Kosong). Pastikan gambar struk jelas dan tidak blur.");
      }

      const textPrompt = `Below is raw OCR text extracted from a photo the user took with a receipt scanner. Apply STEP 1, STEP 2 and STEP 3 to this text (treat it as the image content) and return the JSON object:\n\n"""\n${ocrText}\n"""`;
      const rawTextResponse = await client.analyzeText(
        textPrompt,
        RECEIPT_EXTRACTION_SYSTEM_PROMPT
      );

      const parsed = extractJsonFromModelResponse(rawTextResponse);
      return buildExtractedData(parsed, clientTime, clientTimezone);
    } catch (fallbackErr: unknown) {
      console.error("Both Vision and OCR fallback failed:", fallbackErr);
      const mainMessage = visionErr instanceof Error ? visionErr.message : "Kesalahan koneksi ke NVIDIA API";
      throw new Error(`Gagal memproses struk belanja: ${mainMessage}`);
    }
  }
}



