export type TransactionType = "income" | "expense" | "transfer";
export type TransactionStatus = "completed" | "pending";

export type PembukuanTab =
  | "ledger"
  | "categories"
  | "recurring"
  | "reconciliation"
  | "import";

export type DatePreset =
  | "all"
  | "today"
  | "this_week"
  | "this_month"
  | "last_month"
  | "this_year"
  | "custom";

export interface AttachmentItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface PembukuanTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  toAccountId?: string; // for transfer
  toAccountName?: string;
  description: string;
  notes?: string;
  merchant?: string;
  status: TransactionStatus;
  tags: string[];
  source?: string;
  categoryIcon?: string;
  categoryColor?: string;
  receiptPhotoId?: string;
  attachments?: AttachmentItem[];
  isReconciled?: boolean;
  reconciledAt?: string;
  recurringId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  type: "income" | "expense";
  iconName: string; // Lucide icon name
  colorClass: string; // Tailwind color class combo
  isDefault: boolean;
  description?: string;
  budgetLimit?: number;
  icon?: string;
  color?: string;
}

export type RecurringFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly";

export interface RecurringTransaction {
  id: string;
  name: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  nextOccurrenceDate: string;
  isActive: boolean;
  notes?: string;
  lastGeneratedAt?: string;
  executionCount: number;
  templateName?: string;
  description?: string;
  autoCreate?: boolean;
}

export interface BankStatementTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit"; // credit = income into bank, debit = expense
  balanceAfter?: number;
  matchedTransactionId?: string;
}

export interface ReconciliationMatch {
  bankTrxId: string;
  appTrxId: string;
  confidence: number;
  matchedBy: "auto" | "manual";
}

export interface ReconciliationSummary {
  accountId: string;
  accountName: string;
  statementPeriod: {
    start: string;
    end: string;
  };
  openingBalance: number;
  closingBalance: number;
  totalBankCredit: number;
  totalBankDebit: number;
  totalBankStatements?: number;
  matchedCount: number;
  unmatchedCount?: number;
  unmatchedBankCount: number;
  unmatchedAppCount: number;
  discrepancy?: number;
  discrepancyAmount: number;
  isBalanced: boolean;
  status?: "verified" | "completed" | "in_progress" | string;
}

export interface FilterState {
  searchQuery: string;
  datePreset: DatePreset;
  startDate: string;
  endDate: string;
  type: "all" | TransactionType;
  status: "all" | TransactionStatus;
  categoryIds: string[];
  accountIds: string[];
  minAmount?: number;
  maxAmount?: number;
  hasAttachment?: boolean;
  isReconciled?: "all" | "yes" | "no";
  sortBy: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
  page: number;
  pageSize: number;
  viewMode: "table" | "cards";
}

export interface PembukuanKpiData {
  totalIncome: number;
  totalExpense: number;
  netCashflow: number;
  pendingTotal: number;
  pendingCount: number;
  completedCount?: number;
  totalTransactionsCount?: number;
  profitMargin?: number;
  unreconciledCount?: number;
  totalTransactions?: number;
}

export interface ImportColumnMapping {
  dateCol: string;
  descriptionCol: string;
  amountCol: string;
  typeCol?: string;
  categoryCol?: string;
  accountCol?: string;
  notesCol?: string;
}

export interface ImportPreviewItem {
  rowNumber: number;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  isValid: boolean;
  errorMessage?: string;
  isDuplicate?: boolean;
}
