"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  PembukuanTransaction,
  CategoryItem,
  RecurringTransaction,
  FilterState,
  PembukuanKpiData,
  PembukuanTab,
  TransactionStatus,
} from "../types";
import {
  DEFAULT_CATEGORIES,
  PEMBUKUAN_ACCOUNTS,
  AccountOption,
  isCashTransaction,
  MAX_TRANSACTION_AMOUNT,
  formatCurrency,
} from "../constants";
import { PembukuanService } from "@/lib/services/pembukuan.service";

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  datePreset: "all",
  startDate: "",
  endDate: "",
  type: "all",
  status: "all",
  categoryIds: [],
  accountIds: [],
  paymentChannel: "all",
  sortBy: "date_desc",
  page: 1,
  pageSize: 10,
  viewMode: "table",
};

export function usePembukuan() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<PembukuanTab>("ledger");

  // Core Data Stores
  const [transactions, setTransactions] = useState<PembukuanTransaction[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [accounts, setAccounts] = useState<AccountOption[]>(PEMBUKUAN_ACCOUNTS);
  const [recurring, setRecurring] = useState<RecurringTransaction[]>([]);

  // UI Selection & Filter State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc?: string; type: "success" | "error" | "info" } | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    setIsClient(true);

    async function loadSupabaseData() {
      try {
        await PembukuanService.recalibrateAccountBalances();

        const [dbTx, dbCat, dbRec, dbAcc] = await Promise.all([
          PembukuanService.getTransactions(),
          PembukuanService.getCategories(),
          PembukuanService.getRecurringTransactions(),
          PembukuanService.getAccounts(),
        ]);

        if (dbTx) {
          setTransactions(
            dbTx.map((t) => ({
              ...t,
              amount: Math.min(Number(t.amount) || 0, MAX_TRANSACTION_AMOUNT),
            }))
          );
        }

        if (dbCat && dbCat.length > 0) {
          setCategories(dbCat);
        }

        if (dbRec) {
          setRecurring(dbRec);
        }

        if (dbAcc && dbAcc.length > 0) {
          const mappedAccounts = dbAcc.map((a) => ({
            id: a.id,
            name: a.name,
            type: a.type || "Kas",
            accountNumber: a.account_number || ("•••• " + a.id.slice(-4)),
            color: a.color || "#4B7BFF",
            balance: Number(a.balance),
          }));

          const hasTransferBank = mappedAccounts.some(
            (a) => a.name.toLowerCase().includes("transfer") || a.name.toLowerCase().includes("bank")
          );
          if (!hasTransferBank) {
            const tfOption = PEMBUKUAN_ACCOUNTS.find((a) => a.id === "acc-tf-bank");
            if (tfOption) {
              mappedAccounts.splice(1, 0, tfOption);
            }
          }

          setAccounts(mappedAccounts);
        }
      } catch (err) {
        console.warn("Supabase fetch failed in usePembukuan:", err);
      }
    }

    loadSupabaseData();
  }, []);

  // Save to localStorage for instant offline access
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("finusa_pembukuan_transactions", JSON.stringify(transactions));
      } catch {}
    }
  }, [transactions, isClient]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("finusa_pembukuan_categories", JSON.stringify(categories));
      } catch {}
    }
  }, [categories, isClient]);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("finusa_pembukuan_recurring", JSON.stringify(recurring));
      } catch {}
    }
  }, [recurring, isClient]);

  const showToast = useCallback((title: string, desc?: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const refreshAccounts = useCallback(async () => {
    try {
      const dbAcc = await PembukuanService.getAccounts();
      if (dbAcc && dbAcc.length > 0) {
        setAccounts(
          dbAcc.map((a) => ({
            id: a.id,
            name: a.name,
            type: a.type || "Kas",
            accountNumber: a.account_number || ("•••• " + a.id.slice(-4)),
            color: a.color || "#4B7BFF",
            balance: Number(a.balance),
          }))
        );
      }
    } catch (e) {
      console.warn("Failed to refresh accounts:", e);
    }
  }, []);

  // --- CRUD: Transactions ---
  const addTransaction = useCallback(async (data: Partial<PembukuanTransaction>) => {
    const tempId = `trx-${Date.now()}`;
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const defaultAcc = accounts.find((a) => a.id === data.accountId) || accounts[0];
    const defaultCat = categories.find((c) => c.id === data.categoryId) || 
                       categories.find((c) => c.type === (data.type || "expense")) || 
                       categories[0];

    const cleanAmount = Math.min(Math.max(0, Number(data.amount) || 0), MAX_TRANSACTION_AMOUNT);

    const newTx: PembukuanTransaction = {
      id: tempId,
      date: data.date || todayStr,
      time: data.time || timeStr,
      type: data.type || "expense",
      amount: cleanAmount,
      categoryId: data.categoryId || defaultCat?.id || "",
      categoryName: data.categoryName || defaultCat?.name || "Lainnya",
      categoryIcon: data.categoryIcon || defaultCat?.iconName || "Layers",
      categoryColor: data.categoryColor || defaultCat?.colorClass || "#4B7BFF",
      accountId: data.accountId || defaultAcc?.id || "",
      accountName: data.accountName || defaultAcc?.name || "Rekening Kas",
      toAccountId: data.toAccountId,
      toAccountName: data.toAccountName,
      description: data.description || "Transaksi Baru",
      notes: data.notes || "",
      merchant: data.merchant || "",
      status: data.status || "completed",
      tags: data.tags || [],
      attachments: data.attachments || [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast("Transaksi Berhasil Disimpan", `Tercatat ${formatCurrency(newTx.amount)}`, "success");

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("finusa:transaction-recorded", {
          detail: newTx,
        })
      );
    }

    try {
      const savedTx = newTx.type === "expense"
        ? await PembukuanService.recordExpense(newTx)
        : await PembukuanService.createTransaction(newTx);
      if (savedTx) {
        setTransactions((prev) => prev.map((t) => (t.id === tempId ? savedTx : t)));
      }
      await refreshAccounts();
    } catch (e) {
      console.warn("Could not save transaction to Supabase:", e);
    }

    return newTx;
  }, [showToast, accounts, categories, refreshAccounts]);

  const updateTransaction = useCallback(async (id: string, updates: Partial<PembukuanTransaction>) => {
    const sanitizedUpdates = { ...updates };
    if (sanitizedUpdates.amount !== undefined) {
      sanitizedUpdates.amount = Math.min(Math.max(0, Number(sanitizedUpdates.amount) || 0), MAX_TRANSACTION_AMOUNT);
    }

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...sanitizedUpdates, updatedAt: new Date().toISOString() } : t))
    );
    showToast("Transaksi Diperbarui", undefined, "info");

    try {
      await PembukuanService.updateTransaction(id, sanitizedUpdates);
      await refreshAccounts();
    } catch (e) {
      console.warn("Could not update transaction in Supabase:", e);
    }
  }, [showToast, refreshAccounts]);

  const deleteTransaction = useCallback(async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast("Transaksi Dihapus", undefined, "info");

    try {
      await PembukuanService.deleteTransaction(id);
      await refreshAccounts();
    } catch (e) {
      console.warn("Could not delete transaction in Supabase:", e);
    }
  }, [showToast, refreshAccounts]);

  const bulkDeleteTransactions = useCallback(async (ids: string[]) => {
    setTransactions((prev) => prev.filter((t) => !ids.includes(t.id)));
    setSelectedIds([]);
    showToast(`${ids.length} Transaksi Dihapus`, undefined, "info");

    try {
      await PembukuanService.bulkDeleteTransactions(ids);
      await refreshAccounts();
    } catch (e) {
      console.warn("Could not bulk delete in Supabase:", e);
    }
  }, [showToast, refreshAccounts]);

  const bulkUpdateStatus = useCallback(async (ids: string[], status: TransactionStatus) => {
    setTransactions((prev) =>
      prev.map((t) => (ids.includes(t.id) ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
    setSelectedIds([]);
    showToast(`Status ${ids.length} Transaksi Diubah ke ${status === "completed" ? "Selesai" : "Pending"}`, undefined, "success");

    try {
      await PembukuanService.bulkUpdateStatus(ids, status);
      await refreshAccounts();
    } catch (e) {
      console.warn("Could not bulk update in Supabase:", e);
    }
  }, [showToast, refreshAccounts]);

  // --- CRUD: Categories ---
  const addCategory = useCallback(async (data: Partial<CategoryItem>) => {
    const tempId = `cat-${Date.now()}`;
    const newCat: CategoryItem = {
      id: tempId,
      name: data.name || "Kategori Baru",
      type: data.type || "expense",
      iconName: data.iconName || "Tag",
      colorClass: data.colorClass || "text-blue-400 bg-blue-500/10 border-blue-500/25",
      isDefault: false,
      description: data.description || "",
      budgetLimit: data.budgetLimit || 0,
    };
    setCategories((prev) => [...prev, newCat]);
    showToast("Kategori Dibuat", `Kategori ${newCat.name} siap digunakan`, "success");

    try {
      const savedCat = await PembukuanService.createCategory(newCat);
      if (savedCat) {
        setCategories((prev) => prev.map((c) => (c.id === tempId ? savedCat : c)));
      }
    } catch (e) {
      console.warn("Could not save category to Supabase:", e);
    }

    return newCat;
  }, [showToast]);

  const updateCategory = useCallback(async (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast("Kategori Diperbarui", undefined, "info");

    try {
      await PembukuanService.updateCategory(id, updates);
    } catch (e) {
      console.warn("Could not update category in Supabase:", e);
    }
  }, [showToast]);

  const deleteCategory = useCallback(async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast("Kategori Dihapus", undefined, "info");

    try {
      await PembukuanService.deleteCategory(id);
    } catch (e) {
      console.warn("Could not delete category in Supabase:", e);
    }
  }, [showToast]);

  // --- CRUD: Recurring Transactions ---
  const addRecurring = useCallback(async (data: Partial<RecurringTransaction>) => {
    const tempId = `rec-${Date.now()}`;
    const newRec: RecurringTransaction = {
      id: tempId,
      name: data.name || data.templateName || "Jadwal Rutin",
      templateName: data.templateName || data.name || "Jadwal Rutin",
      amount: data.amount || 0,
      type: data.type || "expense",
      categoryId: data.categoryId || categories[0]?.id || "",
      categoryName: data.categoryName || categories[0]?.name || "Operasional",
      accountId: data.accountId || accounts[0]?.id || "",
      accountName: data.accountName || accounts[0]?.name || "Kas",
      frequency: data.frequency || "monthly",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      endDate: data.endDate,
      nextOccurrenceDate: data.nextOccurrenceDate || new Date().toISOString().split("T")[0],
      isActive: data.isActive !== undefined ? data.isActive : true,
      autoCreate: data.autoCreate !== undefined ? data.autoCreate : false,
      executionCount: 0,
      description: data.description || "",
    };
    setRecurring((prev) => [...prev, newRec]);
    showToast("Jadwal Rutin Disimpan", `${newRec.templateName} telah ditambahkan`, "success");

    try {
      const savedRec = await PembukuanService.createRecurringTransaction(newRec);
      if (savedRec) {
        setRecurring((prev) => prev.map((r) => (r.id === tempId ? savedRec : r)));
      }
    } catch (e) {
      console.warn("Could not save recurring transaction to Supabase:", e);
    }

    return newRec;
  }, [showToast, accounts, categories]);

  const updateRecurring = useCallback((id: string, updates: Partial<RecurringTransaction>) => {
    setRecurring((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    showToast("Jadwal Rutin Diperbarui", undefined, "info");
  }, [showToast]);

  const toggleRecurringActive = useCallback(async (id: string) => {
    let nextState = true;
    setRecurring((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          nextState = !r.isActive;
          return { ...r, isActive: nextState };
        }
        return r;
      })
    );
    showToast(nextState ? "Jadwal Diaktifkan" : "Jadwal Dinonaktifkan", undefined, "info");

    try {
      await PembukuanService.toggleRecurringActive(id, nextState);
    } catch (e) {
      console.warn("Could not toggle recurring in Supabase:", e);
    }
  }, [showToast]);

  const deleteRecurring = useCallback(async (id: string) => {
    setRecurring((prev) => prev.filter((r) => r.id !== id));
    showToast("Jadwal Rutin Dihapus", undefined, "info");

    try {
      await PembukuanService.deleteRecurringTransaction(id);
    } catch (e) {
      console.warn("Could not delete recurring in Supabase:", e);
    }
  }, [showToast]);

  const triggerRecurringNow = useCallback((recOrId: string | RecurringTransaction) => {
    const rec = typeof recOrId === "string" ? recurring.find((r) => r.id === recOrId) : recOrId;
    if (!rec) return;

    addTransaction({
      type: rec.type,
      amount: rec.amount,
      categoryId: rec.categoryId,
      categoryName: rec.categoryName,
      accountId: rec.accountId,
      accountName: rec.accountName,
      description: `[Otomatis] ${rec.templateName || rec.name}`,
      notes: rec.description,
      status: "completed",
    });
  }, [addTransaction, recurring]);

  // Bulk Import
  const importTransactions = useCallback((newTxs: Partial<PembukuanTransaction>[]) => {
    newTxs.forEach((tx) => addTransaction(tx));
    showToast("Impor Berhasil", `${newTxs.length} transaksi berhasil dimasukkan ke buku kas`, "success");
  }, [addTransaction, showToast]);

  // --- Memoized Filtered Transactions ---
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const descMatch = tx.description.toLowerCase().includes(q);
        const merchantMatch = tx.merchant?.toLowerCase().includes(q);
        const catMatch = tx.categoryName.toLowerCase().includes(q);
        const tagMatch = tx.tags?.some((t) => t.toLowerCase().includes(q));
        if (!descMatch && !merchantMatch && !catMatch && !tagMatch) return false;
      }

      // Type
      if (filters.type !== "all" && tx.type !== filters.type) return false;

      // Status
      if (filters.status !== "all" && tx.status !== filters.status) return false;

      // Categories
      if (filters.categoryIds.length > 0 && !filters.categoryIds.includes(tx.categoryId)) return false;

      // Accounts
      if (filters.accountIds.length > 0 && !filters.accountIds.includes(tx.accountId)) return false;

      // Payment Channel (Tunai vs Non-Tunai / Digital)
      if (filters.paymentChannel && filters.paymentChannel !== "all") {
        const isCash = isCashTransaction(tx, accounts);
        if (filters.paymentChannel === "cash" && !isCash) return false;
        if (filters.paymentChannel === "digital" && isCash) return false;
      }

      // Date Filters
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth() + 1;
      const todayDay = now.getDate();
      const todayStr = `${todayYear}-${pad(todayMonth)}-${pad(todayDay)}`;

      if (filters.datePreset === "today") {
        if (!tx.date.startsWith(todayStr)) return false;
      } else if (filters.datePreset === "this_week") {
        const weekAgo = new Date(todayYear, todayMonth - 1, todayDay - 7);
        const weekAgoStr = `${weekAgo.getFullYear()}-${pad(weekAgo.getMonth() + 1)}-${pad(weekAgo.getDate())}`;
        if (tx.date < weekAgoStr || tx.date > todayStr) return false;
      } else if (filters.datePreset === "this_month") {
        const monthStr = `${todayYear}-${pad(todayMonth)}`;
        if (!tx.date.startsWith(monthStr)) return false;
      } else if (filters.datePreset === "last_month") {
        const lastMonthDate = new Date(todayYear, todayMonth - 2, 1);
        const lastMonthStr = `${lastMonthDate.getFullYear()}-${pad(lastMonthDate.getMonth() + 1)}`;
        if (!tx.date.startsWith(lastMonthStr)) return false;
      } else if (filters.datePreset === "custom") {
        if (filters.startDate && tx.date < filters.startDate) return false;
        if (filters.endDate && tx.date > filters.endDate) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "date_desc") return b.date.localeCompare(a.date);
      if (filters.sortBy === "date_asc") return a.date.localeCompare(b.date);
      if (filters.sortBy === "amount_desc") return b.amount - a.amount;
      if (filters.sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });
  }, [transactions, filters, accounts]);

  // --- Memoized KPI Data ---
  const kpiData: PembukuanKpiData = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let cashIncome = 0;
    let digitalIncome = 0;
    let cashExpense = 0;
    let digitalExpense = 0;
    let pendingTotal = 0;
    let pendingCount = 0;

    transactions.forEach((t) => {
      const isCash = isCashTransaction(t, accounts);
      if (t.type === "income") {
        totalIncome += t.amount;
        if (isCash) cashIncome += t.amount;
        else digitalIncome += t.amount;
      }
      if (t.type === "expense") {
        totalExpense += t.amount;
        if (isCash) cashExpense += t.amount;
        else digitalExpense += t.amount;
      }
      if (t.status === "pending") {
        pendingTotal += t.amount;
        pendingCount++;
      }
    });

    const netProfit = totalIncome - totalExpense;
    const count = transactions.length;

    return {
      totalIncome,
      totalExpense,
      netCashflow: netProfit,
      netProfit,
      cashIncome,
      digitalIncome,
      cashExpense,
      digitalExpense,
      pendingTotal,
      pendingCount,
      transactionCount: count,
      incomeTrend: 0,
      expenseTrend: 0,
      profitTrend: 0,
      totalIncomeFormatted: formatCurrency(totalIncome),
      totalExpenseFormatted: formatCurrency(totalExpense),
      netProfitFormatted: formatCurrency(netProfit),
      isProfitable: netProfit >= 0,
    };
  }, [transactions, accounts]);

  return {
    activeTab,
    setActiveTab,
    transactions,
    filteredTransactions,
    categories,
    recurring,
    filters,
    setFilters,
    selectedIds,
    setSelectedIds,
    kpiData,
    toastMessage,
    dismissToast,
    accounts,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
    bulkUpdateStatus,
    addCategory,
    updateCategory,
    deleteCategory,
    addRecurring,
    updateRecurring,
    toggleRecurringActive,
    deleteRecurring,
    triggerRecurringNow,
    importTransactions,
  };
}
