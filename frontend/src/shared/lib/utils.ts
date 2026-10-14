import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_TRANSACTION_AMOUNT = 1_000_000_000_000; // 1 Triliun

/**
 * Format number to Indonesian Rupiah standard:
 * - Batas maksimum di angka 1 Triliun (1.000.000.000.000)
 * - Ketika angka >= 100 Juta, disingkat menjadi JT, M, T (misal: "Rp 200 JT", "Rp 1,5 M", "Rp 1 T")
 * - Ketika angka < 100 Juta, ditampilkan nominal penuh (misal: "Rp 10.000.000", "Rp 25.000")
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "Rp 0";

  const isNegative = amount < 0;
  const clampedAbs = Math.min(Math.abs(amount), MAX_TRANSACTION_AMOUNT);
  const sign = isNegative ? "- " : "";

  if (clampedAbs >= 100_000_000) {
    if (clampedAbs >= 1_000_000_000_000) {
      const val = clampedAbs / 1_000_000_000_000;
      const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1).replace(".", ",");
      return `${sign}Rp ${formatted} T`;
    }
    if (clampedAbs >= 1_000_000_000) {
      const val = clampedAbs / 1_000_000_000;
      const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1).replace(".", ",");
      return `${sign}Rp ${formatted} M`;
    }
    const val = clampedAbs / 1_000_000;
    const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1).replace(".", ",");
    return `${sign}Rp ${formatted} JT`;
  }

  return `${isNegative ? "- " : ""}Rp ${Math.round(clampedAbs).toLocaleString("id-ID")}`;
}

export const formatRupiah = formatCurrency;

/**
 * Format number to compact Indonesian Rupiah (e.g. Rp 1,5 jt or Rp 500 rb)
 */
export function formatRupiahCompact(amount: number): string {
  return formatCurrency(amount);
}

/**
 * Format ISO date string to Indonesian formatted date (e.g. 12 Okt 2026)
 */
export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}
