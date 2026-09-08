export type PeriodType = "this_month" | "last_month" | "this_year";

export type TransactionType = "all" | "income" | "expense";

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  categoryId: string;
  account: string;
  accountId: string;
  amount: number;
  type: "income" | "expense";
  status: "completed" | "pending";
  notes?: string;
  merchant?: string;
}

export interface Account {
  id: string;
  name: string;
  type: "cash" | "e_wallet" | "savings" | "investment";
  balance: number;
  accountNumber: string;
  institution: string;
  color: string;
}

export interface BudgetCategory {
  id: string;
  categoryId: string;
  categoryName: string;
  iconName: string;
  budgetAmount: number;
  spentAmount: number;
  period: "monthly" | "yearly";
}

export interface KpiMetric {
  title: string;
  value: number;
  previousValue: number;
  changePercentage: number;
  isPositive: boolean;
  trendText: string;
}

export interface DashboardSummary {
  period: PeriodType;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  netCashflow: number;
  savingRate: number;
  kpis: {
    balance: KpiMetric;
    income: KpiMetric;
    expense: KpiMetric;
    savingRate: KpiMetric;
  };
}

export interface CashflowPoint {
  label: string;
  income: number;
  expense: number;
  net: number;
}

export interface CategoryBreakdownPoint {
  name: string;
  value: number;
  color: string;
  percentage: number;
  iconName: string;
}

export interface FilterState {
  searchQuery: string;
  type: TransactionType;
  category: string;
  account: string;
  sortBy: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
  page: number;
  pageSize: number;
}
