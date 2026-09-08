import { PembukuanService } from "./pembukuan.service";

export interface MonthlyFinancialSummary {
  period: "this_month" | "last_month" | "this_year";
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRatePercent: number;
  previousIncome: number;
  previousExpense: number;
  previousSavingsRatePercent: number;
  incomeGrowthPercent: number;
  expenseGrowthPercent: number;
  savingRateChangePercent: number;
  balanceChangePercent: number;
  topIncomeCategory: string;
  topExpenseCategory: string;
  transactionCount: number;
  activeAccountsCount: number;
  totalAccountBalance: number;
  categoryBreakdown: Array<{ name: string; amount: number; percentage: number; color: string }>;
  monthlyTrend: Array<{ month: string; income: number; expense: number; net: number }>;
}

export const AnalyticsService = {
  async getDashboardSummary(period: "this_month" | "last_month" | "this_year" = "this_month"): Promise<MonthlyFinancialSummary> {
    const [transactions, accounts] = await Promise.all([
      PembukuanService.getTransactions(),
      PembukuanService.getAccounts(),
    ]);

    const totalAccountBalance = accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Filter strings based on period
    let currentMatch: (dateStr: string) => boolean;
    let previousMatch: (dateStr: string) => boolean;

    if (period === "this_month") {
      const curMonthStr = `${currentYear}-${pad(currentMonth)}`;
      const prevDate = new Date(currentYear, currentMonth - 2, 1);
      const prevMonthStr = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}`;
      currentMatch = (d) => d.startsWith(curMonthStr);
      previousMatch = (d) => d.startsWith(prevMonthStr);
    } else if (period === "last_month") {
      const targetDate = new Date(currentYear, currentMonth - 2, 1);
      const targetMonthStr = `${targetDate.getFullYear()}-${pad(targetDate.getMonth() + 1)}`;
      const prevDate = new Date(currentYear, currentMonth - 3, 1);
      const prevMonthStr = `${prevDate.getFullYear()}-${pad(prevDate.getMonth() + 1)}`;
      currentMatch = (d) => d.startsWith(targetMonthStr);
      previousMatch = (d) => d.startsWith(prevMonthStr);
    } else {
      // this_year
      const curYearStr = `${currentYear}-`;
      const prevYearStr = `${currentYear - 1}-`;
      currentMatch = (d) => d.startsWith(curYearStr);
      previousMatch = (d) => d.startsWith(prevYearStr);
    }

    let totalIncome = 0;
    let totalExpense = 0;
    let previousIncome = 0;
    let previousExpense = 0;

    const expenseCategoryMap: Record<string, { amount: number; color: string }> = {};
    const incomeCategoryMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (currentMatch(tx.date)) {
        if (tx.type === "income") {
          totalIncome += tx.amount;
          const catName = tx.categoryName || "Penjualan Usaha";
          incomeCategoryMap[catName] = (incomeCategoryMap[catName] || 0) + tx.amount;
        } else if (tx.type === "expense") {
          totalExpense += tx.amount;
          const catName = tx.categoryName || "Operasional";
          if (!expenseCategoryMap[catName]) {
            expenseCategoryMap[catName] = { amount: 0, color: tx.categoryColor || "#4B7BFF" };
          }
          expenseCategoryMap[catName].amount += tx.amount;
        }
      } else if (previousMatch(tx.date)) {
        if (tx.type === "income") {
          previousIncome += tx.amount;
        } else if (tx.type === "expense") {
          previousExpense += tx.amount;
        }
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRatePercent = totalIncome > 0 ? Math.round((netSavings / totalIncome) * 100) : 0;

    const prevNet = previousIncome - previousExpense;
    const previousSavingsRatePercent = previousIncome > 0 ? Math.round((prevNet / previousIncome) * 100) : 0;

    // Growth calculations
    let incomeGrowthPercent = 0;
    if (previousIncome > 0) {
      incomeGrowthPercent = Math.round(((totalIncome - previousIncome) / previousIncome) * 100);
    } else if (totalIncome > 0) {
      incomeGrowthPercent = 100;
    }

    let expenseGrowthPercent = 0;
    if (previousExpense > 0) {
      expenseGrowthPercent = Math.round(((totalExpense - previousExpense) / previousExpense) * 100);
    } else if (totalExpense > 0) {
      expenseGrowthPercent = 100;
    }

    const savingRateChangePercent = savingsRatePercent - previousSavingsRatePercent;

    const balanceChangePercent = totalAccountBalance > 0
      ? Math.round((netSavings / totalAccountBalance) * 100)
      : 0;

    // Find top categories
    let topIncomeCategory = "Penjualan";
    let maxInc = 0;
    Object.entries(incomeCategoryMap).forEach(([cat, amt]) => {
      if (amt > maxInc) {
        maxInc = amt;
        topIncomeCategory = cat;
      }
    });

    let topExpenseCategory = "Operasional";
    let maxExp = 0;
    Object.entries(expenseCategoryMap).forEach(([cat, item]) => {
      if (item.amount > maxExp) {
        maxExp = item.amount;
        topExpenseCategory = cat;
      }
    });

    const categoryBreakdown = Object.entries(expenseCategoryMap).map(([name, val]) => ({
      name,
      amount: val.amount,
      color: val.color,
      percentage: totalExpense > 0 ? Math.round((val.amount / totalExpense) * 100) : 0,
    })).sort((a, b) => b.amount - a.amount);

    // Compute monthly trend (last 6 months)
    const monthlyTrend: Array<{ month: string; income: number; expense: number; net: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1 - i, 1);
      const mStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
      const mLabel = d.toLocaleString("id-ID", { month: "short" });

      let inc = 0;
      let exp = 0;
      transactions.forEach((tx) => {
        if (tx.date.startsWith(mStr)) {
          if (tx.type === "income") inc += tx.amount;
          if (tx.type === "expense") exp += tx.amount;
        }
      });

      monthlyTrend.push({
        month: mLabel,
        income: inc,
        expense: exp,
        net: inc - exp,
      });
    }

    return {
      period,
      totalIncome,
      totalExpense,
      netSavings,
      savingsRatePercent,
      previousIncome,
      previousExpense,
      previousSavingsRatePercent,
      incomeGrowthPercent,
      expenseGrowthPercent,
      savingRateChangePercent,
      balanceChangePercent,
      topIncomeCategory,
      topExpenseCategory,
      transactionCount: transactions.length,
      activeAccountsCount: accounts.length,
      totalAccountBalance,
      categoryBreakdown,
      monthlyTrend,
    };
  },
};
