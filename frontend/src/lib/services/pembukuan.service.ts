import { supabase } from "../auth/supabase";
import { 
  PembukuanTransaction, 
  CategoryItem, 
  RecurringTransaction, 
  FilterState 
} from "@/app/(app)/pembukuan/types";
import { DEFAULT_CATEGORIES } from "@/app/(app)/pembukuan/constants";

export interface AccountItem {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  account_number?: string;
  institution?: string;
  color?: string;
  is_default?: boolean;
}

function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export const PembukuanService = {
  // 1. ACCOUNTS
  async getAccounts(): Promise<AccountItem[]> {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Failed to fetch accounts from Supabase:", error.message);
      return [];
    }
    return data || [];
  },

  async createAccount(acc: Omit<AccountItem, "id">): Promise<AccountItem | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("accounts")
      .insert({
        user_id: user.id,
        name: acc.name,
        type: acc.type,
        balance: acc.balance || 0,
        currency: acc.currency || "IDR",
        account_number: acc.account_number || "",
        institution: acc.institution || "",
        color: acc.color || "#4B7BFF",
        is_default: acc.is_default || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAccountBalance(accountId: string, newBalance: number): Promise<boolean> {
    if (!isValidUUID(accountId)) return false;
    const { error } = await supabase
      .from("accounts")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("id", accountId);

    if (error) throw error;
    return true;
  },

  // 2. CATEGORIES
  async getCategories(): Promise<CategoryItem[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("Failed to fetch categories from Supabase:", error.message);
        return DEFAULT_CATEGORIES;
      }

      const activeCategories = data || [];

      const OLD_DEFAULT_CATEGORY_NAMES = [
        "Omzet Penjualan & Bisnis",
        "Gaji & Honor Pokok",
        "Jasa Konsultasi & Proyek",
        "Investasi & Passive Income",
        "Bahan Baku & Persediaan",
        "Pemasaran & Promosi",
        "Operasional & Utilitas",
        "Gaji Karyawan & Freelance",
        "Logistik & Transportasi",
        "Makan & Konsumsi Usaha",
        "Sewa & Pemeliharaan",
        "Penjualan & Omset Usaha",
        "Pesanan Katering & Event",
        "Jasa & Proyek Freelance",
        "Gaji & Pendapatan Pokok",
        "Bagi Hasil & Investasi",
        "Pengembalian & Klaim",
        "Bahan Baku & Kulakan",
        "Operasional & Sewa Tempat",
        "Gaji Karyawan & Honor",
        "Listrik, Air & Internet",
        "Iklan & Pemasaran",
        "Konsumsi & Jamuan Klien",
        "Pajak & Administrasi",
        "Peralatan & Aset Tetap",
      ];

      const hasOldDefaults = activeCategories.some((c) =>
        OLD_DEFAULT_CATEGORY_NAMES.includes(c.name)
      );
      const hasSimplifiedDefaults = activeCategories.some(
        (c) => c.name === "Sandang" || c.name === "Pangan" || c.name === "Papan"
      );

      // Auto-migrate to simplified defaults (Sandang, Papan, Pangan, Gaji Pokok, Honor)
      if (user && (hasOldDefaults || !hasSimplifiedDefaults || activeCategories.length === 0)) {
        try {
          if (hasOldDefaults) {
            await supabase
              .from("categories")
              .update({ is_active: false })
              .eq("user_id", user.id)
              .in("name", OLD_DEFAULT_CATEGORY_NAMES);
          }

          const targetDefaults = [
            { name: "Gaji Pokok", type: "income", icon: "Wallet", color: "#10B981" },
            { name: "Honor", type: "income", icon: "Briefcase", color: "#3B82F6" },
            { name: "Sandang", type: "expense", icon: "ShoppingBag", color: "#A855F7" },
            { name: "Papan", type: "expense", icon: "Home", color: "#F59E0B" },
            { name: "Pangan", type: "expense", icon: "Utensils", color: "#EF4444" },
          ];

          for (const item of targetDefaults) {
            const existing = activeCategories.find(
              (c) => c.name.toLowerCase() === item.name.toLowerCase() && c.type === item.type
            );
            if (!existing) {
              await supabase.from("categories").insert({
                user_id: user.id,
                name: item.name,
                type: item.type,
                icon: item.icon,
                color: item.color,
                budget_limit: 0,
                is_default: true,
                is_active: true,
              });
            } else if (!existing.is_active) {
              await supabase.from("categories").update({ is_active: true }).eq("id", existing.id);
            }
          }

          const { data: refreshed } = await supabase
            .from("categories")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: true });

          if (refreshed && refreshed.length > 0) {
            return refreshed.map((c) => ({
              id: c.id,
              name: c.name,
              type: c.type,
              icon: c.icon || "Tag",
              color: c.color || "#4B7BFF",
              budgetLimit: Number(c.budget_limit) || undefined,
              colorClass: PembukuanService.mapCategoryColorClass(c.name, c.color),
              iconName: c.icon || "Tag",
              isDefault: Boolean(c.is_default),
            }));
          }
        } catch (syncErr) {
          console.warn("Failed auto-syncing simplified categories:", syncErr);
        }
      }

      if (activeCategories.length === 0) {
        return DEFAULT_CATEGORIES;
      }

      return activeCategories.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        icon: c.icon || "Tag",
        color: c.color || "#4B7BFF",
        budgetLimit: Number(c.budget_limit) || undefined,
        colorClass: PembukuanService.mapCategoryColorClass(c.name, c.color),
        iconName: c.icon || "Tag",
        isDefault: Boolean(c.is_default),
      }));
    } catch (err) {
      console.warn("Error fetching categories:", err);
      return DEFAULT_CATEGORIES;
    }
  },

  mapCategoryColorClass(name: string, customColor?: string): string {
    if (name === "Gaji Pokok") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
    if (name === "Honor") return "text-blue-400 bg-blue-500/10 border-blue-500/25";
    if (name === "Sandang") return "text-purple-400 bg-purple-500/10 border-purple-500/25";
    if (name === "Pangan") return "text-rose-400 bg-rose-500/10 border-rose-500/25";
    if (name === "Papan") return "text-amber-400 bg-amber-500/10 border-amber-500/25";
    if (customColor && customColor.includes("bg-")) return customColor;
    return "text-blue-400 bg-blue-500/10 border-blue-500/25";
  },

  async createCategory(cat: Omit<CategoryItem, "id">): Promise<CategoryItem | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("categories")
      .insert({
        user_id: user.id,
        name: cat.name,
        type: cat.type,
        icon: cat.icon || cat.iconName || "Tag",
        color: cat.colorClass || cat.color || "#4B7BFF",
        budget_limit: cat.budgetLimit || 0,
        is_default: false,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      icon: data.icon,
      color: data.color,
      budgetLimit: Number(data.budget_limit) || undefined,
      iconName: data.icon || "Tag",
      colorClass: PembukuanService.mapCategoryColorClass(data.name, data.color),
      isDefault: false,
    };
  },

  async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<boolean> {
    if (!isValidUUID(id)) return false;
    const payload: Record<string, unknown> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.icon !== undefined) payload.icon = updates.icon;
    if (updates.color !== undefined) payload.color = updates.color;
    if (updates.budgetLimit !== undefined) payload.budget_limit = updates.budgetLimit;

    const { error } = await supabase.from("categories").update(payload).eq("id", id);
    if (error) throw error;
    return true;
  },

  async deleteCategory(id: string): Promise<boolean> {
    if (!isValidUUID(id)) return false;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  // 3. TRANSACTIONS
  async getTransactions(filter?: FilterState): Promise<PembukuanTransaction[]> {
    let query = supabase
      .from("transactions")
      .select(`
        *,
        categories (name, icon, color),
        accounts (name)
      `)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (filter?.type && filter.type !== "all") {
      query = query.eq("type", filter.type);
    }
    if (filter?.status && filter.status !== "all") {
      query = query.eq("status", filter.status);
    }
    if (filter?.searchQuery) {
      query = query.or(`description.ilike.%${filter.searchQuery}%,merchant.ilike.%${filter.searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Failed to fetch transactions from Supabase:", error.message);
      return [];
    }

    return (data || []).map((t) => ({
      id: t.id,
      amount: Number(t.amount),
      type: t.type,
      categoryId: t.category_id || "",
      categoryName: t.categories?.name || "Lainnya",
      categoryIcon: t.categories?.icon || "Layers",
      categoryColor: t.categories?.color || "#4B7BFF",
      accountId: t.account_id || "",
      accountName: t.accounts?.name || "Rekening Utama",
      description: t.description || "",
      merchant: t.merchant || "",
      date: t.date,
      time: t.time || "12:00",
      status: t.status,
      source: t.source || "manual",
      receiptPhotoId: t.receipt_photo_id,
      tags: t.tags || [],
      isReconciled: t.is_reconciled || false,
      createdAt: t.created_at || new Date().toISOString(),
      updatedAt: t.updated_at || new Date().toISOString(),
    }));
  },

  async createTransaction(tx: Omit<PembukuanTransaction, "id">): Promise<PembukuanTransaction | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    let validAccountId: string | null = isValidUUID(tx.accountId) ? tx.accountId : null;
    let validCategoryId: string | null = isValidUUID(tx.categoryId) ? tx.categoryId : null;

    // If accountId is not a valid UUID, attempt to resolve from user's accounts
    if (!validAccountId) {
      const { data: userAccounts } = await supabase
        .from("accounts")
        .select("id, name, is_default")
        .eq("user_id", user.id)
        .limit(10);

      if (userAccounts && userAccounts.length > 0) {
        const matched = tx.accountName
          ? userAccounts.find((a) => a.name.toLowerCase().includes(tx.accountName.toLowerCase()))
          : null;
        validAccountId = matched?.id || userAccounts.find((a) => a.is_default)?.id || userAccounts[0].id;
      }
    }

    // If categoryId is not a valid UUID, attempt to resolve from user's categories
    if (!validCategoryId) {
      const { data: userCategories } = await supabase
        .from("categories")
        .select("id, name, type")
        .eq("user_id", user.id)
        .limit(20);

      if (userCategories && userCategories.length > 0) {
        const matched = tx.categoryName
          ? userCategories.find((c) => c.name.toLowerCase().includes(tx.categoryName.toLowerCase()))
          : null;
        validCategoryId = matched?.id || userCategories.find((c) => c.type === tx.type)?.id || userCategories[0].id;
      }
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        account_id: validAccountId,
        category_id: validCategoryId,
        receipt_photo_id: isValidUUID(tx.receiptPhotoId) ? tx.receiptPhotoId : null,
        amount: tx.amount,
        type: tx.type,
        description: tx.description,
        merchant: tx.merchant || "",
        date: tx.date,
        time: tx.time || "12:00",
        status: tx.status || "completed",
        source: tx.source || "manual",
        tags: tx.tags || [],
        is_reconciled: tx.isReconciled || false,
      })
      .select(`
        *,
        categories (name, icon, color),
        accounts (name)
      `)
      .single();

    if (error) {
      console.error("Failed to insert transaction into Supabase:", error);
      throw error;
    }

    // Adjust account balance if accountId is set
    if (validAccountId) {
      const balanceDelta = tx.type === "income" ? tx.amount : -tx.amount;
      const { data: currentAcc } = await supabase.from("accounts").select("balance").eq("id", validAccountId).single();
      if (currentAcc) {
        await supabase
          .from("accounts")
          .update({ balance: Number(currentAcc.balance) + balanceDelta })
          .eq("id", validAccountId);
      }
    }

    return {
      id: data.id,
      amount: Number(data.amount),
      type: data.type,
      categoryId: data.category_id || "",
      categoryName: data.categories?.name || tx.categoryName,
      categoryIcon: data.categories?.icon || tx.categoryIcon,
      categoryColor: data.categories?.color || tx.categoryColor,
      accountId: data.account_id || "",
      accountName: data.accounts?.name || tx.accountName,
      description: data.description,
      merchant: data.merchant,
      date: data.date,
      time: data.time,
      status: data.status,
      source: data.source,
      receiptPhotoId: data.receipt_photo_id,
      tags: data.tags || [],
      isReconciled: data.is_reconciled,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  },

  async recalibrateAccountBalances(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // 1. Fetch user accounts
      const { data: accounts, error: accErr } = await supabase
        .from("accounts")
        .select("id, name")
        .eq("user_id", user.id);

      if (accErr || !accounts || accounts.length === 0) return false;

      // 2. Fetch all completed transactions for this user
      const { data: transactions } = await supabase
        .from("transactions")
        .select("account_id, amount, type, status")
        .eq("user_id", user.id)
        .eq("status", "completed");

      // 3. Fetch all savings transactions for this user
      const { data: savingsTx } = await supabase
        .from("savings_transactions")
        .select("account_id, amount, type")
        .eq("user_id", user.id);

      // Compute balance per account
      const accountBalances: Record<string, number> = {};
      accounts.forEach((acc) => {
        accountBalances[acc.id] = 0;
      });

      (transactions || []).forEach((tx) => {
        if (tx.account_id && accountBalances[tx.account_id] !== undefined) {
          const delta = tx.type === "income" ? Number(tx.amount) : -Number(tx.amount);
          accountBalances[tx.account_id] += delta;
        }
      });

      (savingsTx || []).forEach((stx) => {
        if (stx.account_id && accountBalances[stx.account_id] !== undefined) {
          const delta = stx.type === "deposit" ? -Number(stx.amount) : Number(stx.amount);
          accountBalances[stx.account_id] += delta;
        }
      });

      // Update accounts in DB
      for (const acc of accounts) {
        const trueBalance = accountBalances[acc.id] ?? 0;
        await supabase
          .from("accounts")
          .update({ balance: trueBalance, updated_at: new Date().toISOString() })
          .eq("id", acc.id);
      }

      return true;
    } catch (e) {
      console.error("Failed to recalibrate account balances:", e);
      return false;
    }
  },

  async updateTransaction(id: string, updates: Partial<PembukuanTransaction>): Promise<boolean> {
    if (!isValidUUID(id)) return false;

    // Check if any fields affecting account balance are being updated
    const affectsBalance =
      updates.amount !== undefined ||
      updates.type !== undefined ||
      updates.accountId !== undefined ||
      updates.status !== undefined;

    let oldTx: { account_id: string | null; amount: number; type: string; status: string } | null = null;
    if (affectsBalance) {
      const { data } = await supabase
        .from("transactions")
        .select("account_id, amount, type, status")
        .eq("id", id)
        .single();
      if (data) oldTx = data;
    }

    const payload: Record<string, unknown> = {};
    if (updates.amount !== undefined) payload.amount = updates.amount;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.merchant !== undefined) payload.merchant = updates.merchant;
    if (updates.date !== undefined) payload.date = updates.date;
    if (updates.time !== undefined) payload.time = updates.time;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.categoryId !== undefined && isValidUUID(updates.categoryId)) payload.category_id = updates.categoryId;
    if (updates.accountId !== undefined && isValidUUID(updates.accountId)) payload.account_id = updates.accountId;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.isReconciled !== undefined) payload.is_reconciled = updates.isReconciled;

    const { error } = await supabase.from("transactions").update(payload).eq("id", id);
    if (error) throw error;

    // Adjust account balances if needed
    if (oldTx) {
      const newAccountId = updates.accountId !== undefined ? (isValidUUID(updates.accountId) ? updates.accountId : null) : oldTx.account_id;
      const newAmount = updates.amount !== undefined ? updates.amount : Number(oldTx.amount);
      const newType = updates.type !== undefined ? updates.type : oldTx.type;
      const newStatus = updates.status !== undefined ? updates.status : oldTx.status;

      // Revert old impact
      if (oldTx.account_id && oldTx.status !== "pending") {
        const oldReverseDelta = oldTx.type === "income" ? -Number(oldTx.amount) : Number(oldTx.amount);
        const { data: acc } = await supabase.from("accounts").select("balance").eq("id", oldTx.account_id).single();
        if (acc) {
          await supabase.from("accounts").update({ balance: Number(acc.balance) + oldReverseDelta }).eq("id", oldTx.account_id);
        }
      }

      // Apply new impact
      if (newAccountId && newStatus !== "pending") {
        const newDelta = newType === "income" ? Number(newAmount) : -Number(newAmount);
        const { data: acc } = await supabase.from("accounts").select("balance").eq("id", newAccountId).single();
        if (acc) {
          await supabase.from("accounts").update({ balance: Number(acc.balance) + newDelta }).eq("id", newAccountId);
        }
      }
    }

    return true;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    if (!isValidUUID(id)) return false;

    // 1. Fetch transaction first to rollback balance
    const { data: tx } = await supabase
      .from("transactions")
      .select("account_id, amount, type, status")
      .eq("id", id)
      .single();

    if (tx && tx.account_id && tx.status !== "pending") {
      const reverseDelta = tx.type === "income" ? -Number(tx.amount) : Number(tx.amount);
      const { data: currentAcc } = await supabase
        .from("accounts")
        .select("balance")
        .eq("id", tx.account_id)
        .single();

      if (currentAcc) {
        await supabase
          .from("accounts")
          .update({ balance: Number(currentAcc.balance) + reverseDelta })
          .eq("id", tx.account_id);
      }
    }

    // 2. Delete transaction
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  async bulkDeleteTransactions(ids: string[]): Promise<boolean> {
    const validIds = ids.filter(isValidUUID);
    if (validIds.length === 0) return false;

    // 1. Fetch all affected transactions to rollback balances
    const { data: txs } = await supabase
      .from("transactions")
      .select("id, account_id, amount, type, status")
      .in("id", validIds);

    // 2. Compute net reverse delta per account
    if (txs && txs.length > 0) {
      const accountDeltas: Record<string, number> = {};
      txs.forEach((tx) => {
        if (tx.account_id && tx.status !== "pending") {
          const reverseDelta = tx.type === "income" ? -Number(tx.amount) : Number(tx.amount);
          accountDeltas[tx.account_id] = (accountDeltas[tx.account_id] || 0) + reverseDelta;
        }
      });

      for (const [accId, delta] of Object.entries(accountDeltas)) {
        if (delta !== 0) {
          const { data: currentAcc } = await supabase.from("accounts").select("balance").eq("id", accId).single();
          if (currentAcc) {
            await supabase
              .from("accounts")
              .update({ balance: Number(currentAcc.balance) + delta })
              .eq("id", accId);
          }
        }
      }
    }

    // 3. Delete transactions
    const { error } = await supabase.from("transactions").delete().in("id", validIds);
    if (error) throw error;
    return true;
  },

  async bulkUpdateStatus(ids: string[], status: "completed" | "pending"): Promise<boolean> {
    const validIds = ids.filter(isValidUUID);
    if (validIds.length === 0) return false;

    // Fetch transactions changing status
    const { data: txs } = await supabase
      .from("transactions")
      .select("id, account_id, amount, type, status")
      .in("id", validIds);

    if (txs && txs.length > 0) {
      const accountDeltas: Record<string, number> = {};
      txs.forEach((tx) => {
        if (tx.account_id && tx.status !== status) {
          const isCompleting = status === "completed";
          const baseDelta = tx.type === "income" ? Number(tx.amount) : -Number(tx.amount);
          const delta = isCompleting ? baseDelta : -baseDelta;
          accountDeltas[tx.account_id] = (accountDeltas[tx.account_id] || 0) + delta;
        }
      });

      for (const [accId, delta] of Object.entries(accountDeltas)) {
        if (delta !== 0) {
          const { data: currentAcc } = await supabase.from("accounts").select("balance").eq("id", accId).single();
          if (currentAcc) {
            await supabase.from("accounts").update({ balance: Number(currentAcc.balance) + delta }).eq("id", accId);
          }
        }
      }
    }

    const { error } = await supabase.from("transactions").update({ status }).in("id", validIds);
    if (error) throw error;
    return true;
  },

  // 4. RECURRING TRANSACTIONS
  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    const { data, error } = await supabase
      .from("recurring_transactions")
      .select(`
        *,
        categories (name),
        accounts (name)
      `)
      .order("next_occurrence_date", { ascending: true });

    if (error) {
      console.warn("Failed to fetch recurring transactions from Supabase:", error.message);
      return [];
    }

    return (data || []).map((r) => ({
      id: r.id,
      name: r.template_name,
      templateName: r.template_name,
      amount: Number(r.amount),
      type: r.type,
      categoryId: r.category_id || "",
      categoryName: r.categories?.name || "Operasional",
      accountId: r.account_id || "",
      accountName: r.accounts?.name || "Kas",
      frequency: r.frequency,
      startDate: r.start_date,
      endDate: r.end_date,
      nextOccurrenceDate: r.next_occurrence_date,
      isActive: r.is_active,
      autoCreate: r.auto_create,
      executionCount: 0,
      description: r.description,
    }));
  },

  async createRecurringTransaction(rec: Omit<RecurringTransaction, "id">): Promise<RecurringTransaction | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("recurring_transactions")
      .insert({
        user_id: user.id,
        template_name: rec.templateName || rec.name,
        amount: rec.amount,
        type: rec.type,
        category_id: isValidUUID(rec.categoryId) ? rec.categoryId : null,
        account_id: isValidUUID(rec.accountId) ? rec.accountId : null,
        frequency: rec.frequency,
        start_date: rec.startDate,
        end_date: rec.endDate || null,
        next_occurrence_date: rec.nextOccurrenceDate,
        is_active: rec.isActive,
        auto_create: rec.autoCreate,
        description: rec.description,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      name: data.template_name,
      templateName: data.template_name,
      amount: Number(data.amount),
      type: data.type,
      categoryId: data.category_id || "",
      categoryName: rec.categoryName,
      accountId: data.account_id || "",
      accountName: rec.accountName,
      frequency: data.frequency,
      startDate: data.start_date,
      endDate: data.end_date,
      nextOccurrenceDate: data.next_occurrence_date,
      isActive: data.is_active,
      autoCreate: data.auto_create,
      executionCount: 0,
      description: data.description,
    };
  },

  async toggleRecurringActive(id: string, isActive: boolean): Promise<boolean> {
    if (!isValidUUID(id)) return false;
    const { error } = await supabase
      .from("recurring_transactions")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) throw error;
    return true;
  },

  async deleteRecurringTransaction(id: string): Promise<boolean> {
    if (!isValidUUID(id)) return false;
    const { error } = await supabase.from("recurring_transactions").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
};
