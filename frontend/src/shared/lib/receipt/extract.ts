import { createWorker } from "tesseract.js";
import path from "path";
import fs from "fs";
import { NvidiaModelsClient } from "./nvidia-models";
import { detectCategory } from "./categorize";
import type { ReceiptItem, ExtractedReceiptData } from "./types";
import { generateSimulatedReceipt } from "./sample";

export type { ReceiptItem, ExtractedReceiptData };
export { generateSimulatedReceipt };

const OCR_SYSTEM_PROMPT = `You are FINUSA AI, an expert financial data extraction assistant specialized in structuring raw OCR text from Indonesian receipts, invoices, and payment proof (Indomaret, Alfamart, Supermarket, Restoran, Kafe, SPBU Pertamina, Apotek, etc.).

Analyze the raw OCR text carefully and return a single valid JSON object strictly matching this schema:
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

Important Rules:
1. Parse all monetary amounts as clean numbers without currency symbols (Rp), dots, or commas (e.g. Rp 45.000 -> 45000).
2. If total is printed explicitly (Grand Total / Total Akhir / Bayar), make sure 'total' equals that final amount.
3. If items list is blurry but total is clear, extract whatever items possible and ensure total matches.
4. If the text is completely illegible or empty, set confidence to < 40 and total to 0.
5. Return ONLY the JSON object. No conversational prose or markdown wrap outside JSON.`;

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
 * Safely extracts and parses JSON from reasoning LLM outputs (handles markdown blocks, reasoning text, etc.)
 */
function extractJsonFromModelResponse(text: string): Record<string, unknown> {
  // 1. Try matching ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // ignore
    }
  }

  // 2. Try parsing candidate from the last open brace to the last close brace
  const lastOpenBrace = text.lastIndexOf("{");
  const lastCloseBrace = text.lastIndexOf("}");
  if (lastOpenBrace !== -1 && lastCloseBrace !== -1 && lastCloseBrace > lastOpenBrace) {
    try {
      const candidate = text.substring(lastOpenBrace, lastCloseBrace + 1);
      return JSON.parse(candidate);
    } catch {
      // ignore
    }
  }

  // 3. Search backwards for balanced JSON object candidates
  for (let i = text.length - 1; i >= 0; i--) {
    if (text[i] === "}") {
      for (let j = 0; j < i; j++) {
        if (text[j] === "{") {
          try {
            const candidate = text.substring(j, i + 1);
            return JSON.parse(candidate);
          } catch {
            // continue
          }
        }
      }
    }
  }

  return JSON.parse(text);
}

/**
 * Executes local Tesseract OCR with explicitly resolved workerPath to avoid bundler resolution issues
 */
async function performOcr(imageInput: string): Promise<string> {
  const workerOptions: Record<string, unknown> = {};

  try {
    const tesseractEntry = require.resolve("tesseract.js");
    const workerPath = path.join(path.dirname(tesseractEntry), "worker-script", "node", "index.js");
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

  const worker = await createWorker("ind+eng", 1, workerOptions);
  try {
    const ret = await worker.recognize(imageInput);
    return ret.data.text || "";
  } finally {
    await worker.terminate();
  }
}

/**
 * Extracts structured financial data from an image buffer or base64 using Nvidia Nemotron LLM & OCR
 */
export async function extractReceiptData(
  base64Image: string,
  mimeType = "image/jpeg"
): Promise<ExtractedReceiptData> {
  const client = new NvidiaModelsClient();

  if (!client.isConfigured()) {
    throw new Error("NVIDIA API Key is not configured.");
  }

  try {
    // 1. OCR text extraction using Tesseract.js
    const imageUrl = base64Image.startsWith("data:")
      ? base64Image
      : `data:${mimeType};base64,${base64Image}`;

    const ocrText = await performOcr(imageUrl);

    if (!ocrText || ocrText.trim().length === 0) {
      throw new Error("Gagal membaca teks dari gambar struk (OCR Kosong). Pastikan gambar jelas.");
    }

    // 2. Structurize using Nvidia model
    const prompt = `Below is the raw text extracted from a receipt via OCR. Structurize this text into the requested JSON schema.

Raw OCR Text:
"""
${ocrText}
"""`;

    const rawResponse = await client.analyzeText(
      prompt,
      OCR_SYSTEM_PROMPT
    );

    // Parse JSON safely from reasoning LLM
    let parsed: Record<string, unknown>;
    try {
      parsed = extractJsonFromModelResponse(rawResponse);
    } catch {
      console.error("Failed to parse JSON from AI response:", rawResponse);
      throw new Error("Gagal mengurai format JSON dari respons model AI.");
    }

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
      confidence: Math.min(100, Math.max(0, cleanNumber(parsed.confidence) || 88)),
      notes: undefined,
      isSimulated: false,
    };
  } catch (err) {
    console.error("OCR API extraction failed:", err);
    throw err;
  }
}

