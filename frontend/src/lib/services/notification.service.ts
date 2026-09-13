import { PembukuanService } from "./pembukuan.service";
import { formatCurrency } from "@/app/(app)/home/constants";

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "income" | "expense" | "alert" | "info";
  isRead: boolean;
}

function formatRelativeTime(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return "Baru saja";
  try {
    const today = new Date();
    const todayYMD = today.toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayYMD = yesterday.toISOString().split("T")[0];

    const timeFormatted = timeStr ? timeStr.slice(0, 5) : "";

    if (dateStr === todayYMD) {
      return timeFormatted ? `Hari ini, ${timeFormatted}` : "Hari ini";
    }
    if (dateStr === yesterdayYMD) {
      return timeFormatted ? `Kemarin, ${timeFormatted}` : "Kemarin";
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const formatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(d);
    return timeFormatted ? `${formatted}, ${timeFormatted}` : formatted;
  } catch {
    return dateStr;
  }
}

export const NotificationService = {
  getReadNotificationIds(userId: string): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
      const stored = localStorage.getItem(`finusa_read_notifs_${userId}`);
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr)) {
          return new Set(arr);
        }
      }
    } catch {
      // ignore JSON parse errors
    }
    return new Set();
  },

  markNotificationsAsRead(userId: string, ids: string[]): void {
    if (typeof window === "undefined" || !userId) return;
    try {
      const current = this.getReadNotificationIds(userId);
      ids.forEach((id) => current.add(id));
      localStorage.setItem(
        `finusa_read_notifs_${userId}`,
        JSON.stringify(Array.from(current))
      );
    } catch {
      // ignore storage errors
    }
  },

  async loadFinancialNotifications(userId: string): Promise<NotificationItem[]> {
    const readIds = this.getReadNotificationIds(userId);
    const notifications: NotificationItem[] = [];

    try {
      const transactions = await PembukuanService.getTransactions();

      if (!transactions || transactions.length === 0) {
        return [
          {
            id: "welcome-onboarding",
            title: "Selamat Datang di FINUSA",
            desc: "Mulai catat transaksi pertama Anda di menu Catat atau gunakan fitur Scan Struk AI.",
            time: "Hari ini",
            type: "info",
            isRead: readIds.has("welcome-onboarding"),
          },
        ];
      }

      // ── 1. Financial Intelligence Insight: Pengeluaran Terbesar ────────────
      const expenses = transactions.filter((t) => t.type === "expense");
      const incomes = transactions.filter((t) => t.type === "income");

      const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount || 0), 0);
      const totalIncome = incomes.reduce((acc, t) => acc + Number(t.amount || 0), 0);

      if (expenses.length > 0 && totalExpense > 0) {
        const categoryTotals: Record<string, number> = {};
        for (const t of expenses) {
          const cat = t.categoryName || "Lainnya";
          categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount || 0);
        }

        const sortedCategories = Object.entries(categoryTotals).sort(
          (a, b) => b[1] - a[1]
        );

        if (sortedCategories.length > 0) {
          const [topCat, topAmount] = sortedCategories[0];
          const percentage = Math.round((topAmount / totalExpense) * 100);
          const topExpenseId = `insight-top-${topCat}-${Math.round(topAmount)}`;

          notifications.push({
            id: topExpenseId,
            title: "Pengeluaran Terbesar",
            desc: `Pos pengeluaran terbesar Anda adalah ${topCat} sebesar ${formatCurrency(topAmount)} (${percentage}% dari total pengeluaran).`,
            time: "Analisis AI Finusa",
            type: "alert",
            isRead: readIds.has(topExpenseId),
          });
        }
      }

      // ── 2. Financial Intelligence Insight: Status Arus Kas ─────────────────
      if (totalIncome > 0 && totalExpense > 0) {
        if (totalIncome >= totalExpense) {
          const surplus = totalIncome - totalExpense;
          const surplusId = `cashflow-surplus-${Math.round(surplus)}`;
          notifications.push({
            id: surplusId,
            title: "Kondisi Kas Sehat (Surplus)",
            desc: `Arus kas Anda mengalami surplus ${formatCurrency(surplus)}. Pemasukan lebih besar daripada pengeluaran.`,
            time: "Bulan ini",
            type: "info",
            isRead: readIds.has(surplusId),
          });
        } else {
          const deficit = totalExpense - totalIncome;
          const deficitId = `cashflow-deficit-${Math.round(deficit)}`;
          notifications.push({
            id: deficitId,
            title: "Peringatan: Defisit Pengeluaran",
            desc: `Pengeluaran Anda melebihi pemasukan sebesar ${formatCurrency(deficit)}. Pertimbangkan untuk menghemat pengeluaran sekunder.`,
            time: "Bulan ini",
            type: "alert",
            isRead: readIds.has(deficitId),
          });
        }
      }

      // ── 3. Recent Transactions (Pemasukan & Pengeluaran Terakhir) ─────────
      const recentTxList = transactions.slice(0, 5);
      for (const tx of recentTxList) {
        const notifId = `tx-${tx.id}`;
        const isIncome = tx.type === "income";

        const label = tx.description || tx.categoryName || (isIncome ? "Pemasukan" : "Pengeluaran");
        const account = tx.accountName || "Kas";

        notifications.push({
          id: notifId,
          title: isIncome ? "Pemasukan Berhasil Dicatat" : "Pengeluaran Berhasil Dicatat",
          desc: isIncome
            ? `${label} +${formatCurrency(tx.amount)} masuk ke ${account}.`
            : `${label} -${formatCurrency(tx.amount)} via ${account}.`,
          time: formatRelativeTime(tx.date, tx.time),
          type: isIncome ? "income" : "expense",
          isRead: readIds.has(notifId),
        });
      }
    } catch (e) {
      console.warn("Failed to generate financial notifications:", e);
    }

    return notifications;
  },
};
