import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_TRANSACTION_AMOUNT = 1_000_000_000_000; // 1 Triliun

function formatCompactNumber(val: number): string {
  if (val % 1 === 0) return val.toString();
  const rounded = Number(val.toFixed(1));
  return rounded.toString().replace(".", ",");
}

/**
 * Format number to Indonesian Rupiah standard:
 * - Batas maksimum di angka 1 Triliun (1.000.000.000.000)
 * - Penulisan singkatan:
 *   >= 1 Triliun -> t (misal: "Rp 1 t")
 *   >= 1 Miliar -> m (misal: "Rp 1,5 m")
 *   >= 1 Juta -> jt (misal: "Rp 2,5 jt")
 *   >= 1 Ribu -> Rb (misal: "Rp 25 Rb", "Rp 1,5 Rb")
 *   < 1 Ribu -> nominal penuh (misal: "Rp 500", "Rp 1", "Rp 0")
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "Rp 0";

  const isNegative = amount < 0;
  const clampedAbs = Math.min(Math.abs(amount), MAX_TRANSACTION_AMOUNT);
  const sign = isNegative ? "- " : "";

  if (clampedAbs >= 1_000_000_000_000) {
    const val = clampedAbs / 1_000_000_000_000;
    return `${sign}Rp ${formatCompactNumber(val)} t`;
  }
  if (clampedAbs >= 1_000_000_000) {
    const val = clampedAbs / 1_000_000_000;
    return `${sign}Rp ${formatCompactNumber(val)} m`;
  }
  if (clampedAbs >= 1_000_000) {
    const val = clampedAbs / 1_000_000;
    return `${sign}Rp ${formatCompactNumber(val)} jt`;
  }
  if (clampedAbs >= 1_000) {
    const val = clampedAbs / 1_000;
    return `${sign}Rp ${formatCompactNumber(val)} Rb`;
  }

  return `${sign}Rp ${Math.round(clampedAbs).toLocaleString("id-ID")}`;
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
