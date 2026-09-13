/**
 * Client-safe helper functions for receipt scanning:
 * - Time normalization & current scan time fallback
 * - Payment method normalization & allowed options
 * - Safe time display formatting
 * 
 * NOTE: Do NOT import node-specific modules (like fs, path, child_process) here,
 * as this file is used by client-side hooks and components.
 */

export const ALLOWED_PAYMENT_METHODS = [
  "E-Wallet",
  "QRIS",
  "Transfer Bank",
  "Cash",
] as const;

export type AllowedPaymentMethod = (typeof ALLOWED_PAYMENT_METHODS)[number];

/**
 * Returns current local time in 24-hour HH:mm format.
 * - In browser: uses client device's local Date (e.g. 09:57).
 * - On server: formats using provided timezone (defaulting to Asia/Jakarta or Asia/Makassar).
 */
export function getCurrentScanTime(timezone?: string): string {
  if (typeof window !== "undefined") {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  try {
    const tz = timezone || "Asia/Jakarta";
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return formatter.format(new Date());
  } catch {
    const now = new Date();
    const utcHours = now.getUTCHours();
    const wibHours = (utcHours + 7) % 24;
    return `${String(wibHours).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;
  }
}

/**
 * Normalizes time to HH:mm 24-hour format.
 * If invalid, looks like a price (e.g. 20,000 / 20.000 / Rp), or missing,
 * falls back to the client's scan time.
 */
export function normalizeTime(
  rawTime?: unknown,
  fallbackTime?: string,
  timezone?: string
): string {
  const getFallback = () => {
    if (fallbackTime && /^[0-2]?[0-9]:[0-5][0-9]$/.test(fallbackTime.trim())) {
      return fallbackTime.trim();
    }
    return getCurrentScanTime(timezone);
  };

  if (!rawTime || typeof rawTime !== "string") {
    return getFallback();
  }

  const trimmed = rawTime.trim();
  if (!trimmed) {
    return getFallback();
  }

  // Reject anything that looks like a price with thousand separator: e.g. "20,000", "20.000"
  if (/[.,]\d{3}/.test(trimmed)) {
    return getFallback();
  }

  // Reject if it contains currency symbols or terms
  if (/rp|idr|rupiah/i.test(trimmed)) {
    return getFallback();
  }

  // Reject if it contains alphabetic characters not related to time indicators
  const withoutMeridiem = trimmed.replace(/\b(am|pm|wib|wita|wit)\b/gi, "").trim();
  if (/[a-z]/i.test(withoutMeridiem)) {
    return getFallback();
  }

  // Match standard 24h or 12h time format: "HH:mm", "HH.mm", "H:mm", "HH:mm:ss"
  const match = trimmed.match(/^([01]?[0-9]|2[0-3])[:.]([0-5][0-9])(?::[0-5][0-9])?(?:\s*(am|pm))?$/i);
  if (!match) {
    return getFallback();
  }

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toLowerCase();

  if (meridiem === "pm" && hours < 12) {
    hours += 12;
  } else if (meridiem === "am" && hours === 12) {
    hours = 0;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return getFallback();
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Normalizes payment method to one of the 4 supported types:
 * "E-Wallet" | "QRIS" | "Transfer Bank" | "Cash"
 * If unknown or not printed on receipt, returns "" (empty string) so the user can fill it in.
 */
export function normalizePaymentMethod(rawMethod?: unknown): string {
  if (!rawMethod || typeof rawMethod !== "string") {
    return "";
  }

  const clean = rawMethod.trim();
  if (!clean) return "";

  const lower = clean.toLowerCase();

  // QRIS
  if (lower.includes("qris")) {
    return "QRIS";
  }

  // E-Wallet (gopay, ovo, dana, shopee, linkaja, e-wallet, ewallet, wallet)
  if (
    lower.includes("wallet") ||
    lower.includes("gopay") ||
    lower.includes("ovo") ||
    lower.includes("dana") ||
    lower.includes("shopee") ||
    lower.includes("linkaja")
  ) {
    return "E-Wallet";
  }

  // Transfer Bank (transfer, tf, bank, debit, kredit, credit, rekening, atm, bca, mandiri, bri, bni)
  if (
    lower.includes("transfer") ||
    lower.includes("tf") ||
    lower.includes("bank") ||
    lower.includes("debit") ||
    lower.includes("kredit") ||
    lower.includes("credit") ||
    lower.includes("rekening") ||
    lower.includes("atm") ||
    lower.includes("bca") ||
    lower.includes("mandiri") ||
    lower.includes("bri") ||
    lower.includes("bni")
  ) {
    return "Transfer Bank";
  }

  // Cash / Tunai
  if (
    lower.includes("cash") ||
    lower.includes("tunai")
  ) {
    return "Cash";
  }

  return "";
}

/**
 * Safe time display formatter for tables and modals.
 * Converts corrupted strings (e.g. price amounts) to fallback time.
 */
export function formatTimeDisplay(timeStr?: string): string {
  if (!timeStr) return "12:00";
  if (/[.,]\d{3}/.test(timeStr) || /rp|idr/i.test(timeStr)) {
    return "12:00";
  }
  const match = timeStr.match(/^([01]?[0-9]|2[0-3])[:.]([0-5][0-9])/);
  if (match) {
    return `${match[1].padStart(2, "0")}:${match[2]}`;
  }
  return timeStr;
}
