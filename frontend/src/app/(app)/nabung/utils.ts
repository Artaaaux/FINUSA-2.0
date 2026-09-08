export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatShortCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1).replace(".0", "")}M`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1).replace(".0", "")}jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}rb`;
  }
  return `Rp ${amount}`;
}

export function calculateDaysRemaining(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  // reset hours to midnight
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function calculateMonthsRemaining(targetDate: string): number {
  const days = calculateDaysRemaining(targetDate);
  const months = Math.ceil(days / 30);
  return Math.max(1, months);
}

export function calculateMonthlyRecommendation(
  current: number,
  target: number,
  targetDate: string
): number {
  const remainingAmount = Math.max(0, target - current);
  if (remainingAmount <= 0) return 0;
  const months = calculateMonthsRemaining(targetDate);
  return Math.ceil(remainingAmount / months);
}

export function calculateDailyRecommendation(
  current: number,
  target: number,
  targetDate: string
): number {
  const remainingAmount = Math.max(0, target - current);
  if (remainingAmount <= 0) return 0;
  const days = calculateDaysRemaining(targetDate);
  return Math.ceil(remainingAmount / Math.max(1, days));
}

export function generateSavingsProjection(
  current: number,
  target: number,
  monthlySave: number,
  targetDate: string
) {
  const months = Math.min(12, Math.max(3, calculateMonthsRemaining(targetDate)));
  const data = [];
  const now = new Date();

  let accumulated = current;
  for (let i = 0; i <= months; i++) {
    const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const monthName = futureDate.toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    });

    data.push({
      bulan: i === 0 ? "Sekarang" : monthName,
      akumulasi: Math.min(target * 1.05, accumulated),
      target: target,
    });

    accumulated += monthlySave;
  }

  return data;
}

export function formatDateIndo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
