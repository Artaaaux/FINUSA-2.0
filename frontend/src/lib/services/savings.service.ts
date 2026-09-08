import { supabase } from "../auth/supabase";
import { 
  SavingsGoal, 
  AutoSaveSettings,
  SavingsCategory,
  GoalPriority,
  GoalStatus
} from "@/app/(app)/nabung/types";

interface DbGoalTransaction {
  id: string;
  goal_id: string;
  amount: number;
  type: string;
  date: string;
  note?: string;
  created_at: string;
  account_id?: string;
  accounts?: { name: string };
}

function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export const SavingsService = {
  // 1. SAVINGS GOALS
  async getSavingsGoals(): Promise<SavingsGoal[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("savings_goals")
      .select(`
        *,
        goal_transactions (
          id,
          goal_id,
          amount,
          type,
          date,
          note,
          created_at,
          account_id,
          accounts (name)
        )
      `)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Failed to fetch savings goals from Supabase:", error.message);
      return [];
    }

    return (data || []).map((g) => {
      const current = Number(g.current_amount);
      const target = Number(g.target_amount);

      const txs = ((g.goal_transactions as DbGoalTransaction[]) || []).map((tx) => ({
        id: tx.id,
        goalId: tx.goal_id,
        amount: Number(tx.amount),
        date: tx.date,
        method: tx.type === "deposit" ? "Setoran Tabungan" : "Penarikan Dana",
        sourceAccount: tx.accounts?.name || "Rekening Kas",
        notes: tx.note || "",
        isAutoSave: false,
      }));

      return {
        id: g.id,
        name: g.name,
        category: (g.category || "darurat") as SavingsCategory,
        categoryLabel: g.category || "Dana Darurat",
        userType: "UMKM",
        targetAmount: target,
        currentAmount: current,
        startDate: g.created_at ? g.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
        targetDate: g.deadline || new Date().toISOString().split("T")[0],
        priority: (g.priority || "tinggi") as GoalPriority,
        status: (current >= target ? "tercapai" : "aktif") as GoalStatus,
        description: g.description || "",
        iconName: g.icon || "ShieldCheck",
        accentColor: "text-emerald-400",
        gradient: "from-emerald-500 to-teal-400",
        badgeClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
        iconContainerClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        ringStrokeColor: g.color || "#10B981",
        autoSave: {
          enabled: false,
          frequency: "bulanan",
          amount: Math.round(target / 6),
          sourceAccount: "BCA Bisnis & Operasional",
          nextDebitDate: new Date().toISOString().split("T")[0],
        },
        transactions: txs,
        milestones: [
          { level: 25, label: "Langkah Awal (25%)", percentage: 25, reached: current >= target * 0.25, badgeName: "Perunggu", description: "Pondasi dana mulai terbentuk" },
          { level: 50, label: "Separuh Jalan (50%)", percentage: 50, reached: current >= target * 0.50, badgeName: "Perak", description: "50% target tercapai" },
          { level: 75, label: "Mendekati Target (75%)", percentage: 75, reached: current >= target * 0.75, badgeName: "Emas", description: "75% target terkumpul" },
          { level: 100, label: "Target Tuntas (100%)", percentage: 100, reached: current >= target, badgeName: "Platinum", description: "Target finansial tercapai sempurna" },
        ],
        createdAt: g.created_at || new Date().toISOString(),
        updatedAt: g.updated_at || new Date().toISOString(),
      };
    });
  },

  async createSavingsGoal(goal: {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    category: string;
    targetDate?: string;
    icon?: string;
    color?: string;
    priority?: string;
    status?: string;
    description?: string;
    isPinned?: boolean;
  }): Promise<SavingsGoal | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("User not authenticated in createSavingsGoal");
      return null;
    }

    const safeDeadline = goal.targetDate && goal.targetDate.trim() ? goal.targetDate.split("T")[0] : null;

    const { data, error } = await supabase
      .from("savings_goals")
      .insert({
        user_id: user.id,
        name: goal.name,
        target_amount: Number(goal.targetAmount) || 0,
        current_amount: Number(goal.currentAmount) || 0,
        category: goal.category || "Umum",
        deadline: safeDeadline,
        icon: goal.icon || "ShieldCheck",
        color: goal.color || "#10B981",
        priority: goal.priority || "tinggi",
        status: goal.status || "active",
        is_pinned: goal.isPinned || false,
        description: goal.description || "",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Failed to insert savings goal:",
        error.message || "Unknown error",
        "Details:", error.details,
        "Hint:", error.hint,
        "Code:", error.code
      );
      throw error;
    }

    const current = Number(data.current_amount);
    const target = Number(data.target_amount);

    return {
      id: data.id,
      name: data.name,
      category: (data.category || "darurat") as SavingsCategory,
      categoryLabel: data.category || "Dana Darurat",
      userType: "UMKM",
      targetAmount: target,
      currentAmount: current,
      startDate: new Date().toISOString().split("T")[0],
      targetDate: data.deadline || new Date().toISOString().split("T")[0],
      priority: (data.priority || "tinggi") as GoalPriority,
      status: (current >= target ? "tercapai" : "aktif") as GoalStatus,
      description: data.description || "",
      iconName: data.icon || "ShieldCheck",
      accentColor: "text-emerald-400",
      gradient: "from-emerald-500 to-teal-400",
      badgeClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      iconContainerClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      ringStrokeColor: data.color || "#10B981",
      autoSave: {
        enabled: false,
        frequency: "bulanan",
        amount: Math.round(target / 6),
        sourceAccount: "BCA Bisnis & Operasional",
        nextDebitDate: new Date().toISOString().split("T")[0],
      },
      transactions: [],
      milestones: [
        { level: 25, label: "Langkah Awal (25%)", percentage: 25, reached: current >= target * 0.25, badgeName: "Perunggu", description: "Pondasi dana mulai terbentuk" },
        { level: 50, label: "Separuh Jalan (50%)", percentage: 50, reached: current >= target * 0.50, badgeName: "Perak", description: "50% target tercapai" },
        { level: 75, label: "Mendekati Target (75%)", percentage: 75, reached: current >= target * 0.75, badgeName: "Emas", description: "75% target terkumpul" },
        { level: 100, label: "Target Tuntas (100%)", percentage: 100, reached: current >= target, badgeName: "Platinum", description: "Target finansial tercapai sempurna" },
      ],
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
    };
  },

  async depositMoney(
    goalId: string, 
    amount: number, 
    accountId?: string, 
    note?: string
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    let targetGoalId = goalId;
    if (!isValidUUID(targetGoalId)) {
      // If temporary ID, find first goal or matching goal
      const { data: userGoals } = await supabase
        .from("savings_goals")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (userGoals && userGoals.length > 0) {
        targetGoalId = userGoals[0].id;
      } else {
        return false;
      }
    }

    // 1. Get current goal
    const { data: goal, error: goalErr } = await supabase
      .from("savings_goals")
      .select("current_amount, target_amount")
      .eq("id", targetGoalId)
      .single();

    if (goalErr || !goal) return false;

    const newAmount = Number(goal.current_amount) + amount;
    const isCompleted = newAmount >= Number(goal.target_amount);

    // 2. Update goal
    await supabase
      .from("savings_goals")
      .update({
        current_amount: newAmount,
        status: isCompleted ? "completed" : "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetGoalId);

    // 3. Record goal transaction
    const validAccId = isValidUUID(accountId) ? accountId : null;
    await supabase.from("goal_transactions").insert({
      goal_id: targetGoalId,
      user_id: user.id,
      account_id: validAccId,
      amount: amount,
      type: "deposit",
      note: note || "Setoran manual tabungan",
    });

    // 4. Deduct from source account balance if provided
    if (validAccId) {
      const { data: acc } = await supabase.from("accounts").select("balance").eq("id", validAccId).single();
      if (acc) {
        await supabase
          .from("accounts")
          .update({ balance: Number(acc.balance) - amount })
          .eq("id", validAccId);
      }
    }

    return true;
  },

  async withdrawMoney(
    goalId: string, 
    amount: number, 
    accountId?: string, 
    note?: string
  ): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    let targetGoalId = goalId;
    if (!isValidUUID(targetGoalId)) {
      const { data: userGoals } = await supabase
        .from("savings_goals")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (userGoals && userGoals.length > 0) {
        targetGoalId = userGoals[0].id;
      } else {
        return false;
      }
    }

    const { data: goal } = await supabase
      .from("savings_goals")
      .select("current_amount")
      .eq("id", targetGoalId)
      .single();

    if (!goal) return false;

    const newAmount = Math.max(0, Number(goal.current_amount) - amount);

    await supabase
      .from("savings_goals")
      .update({
        current_amount: newAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", targetGoalId);

    const validAccId = isValidUUID(accountId) ? accountId : null;
    await supabase.from("goal_transactions").insert({
      goal_id: targetGoalId,
      user_id: user.id,
      account_id: validAccId,
      amount: amount,
      type: "withdrawal",
      note: note || "Penarikan tabungan",
    });

    if (validAccId) {
      const { data: acc } = await supabase.from("accounts").select("balance").eq("id", validAccId).single();
      if (acc) {
        await supabase
          .from("accounts")
          .update({ balance: Number(acc.balance) + amount })
          .eq("id", validAccId);
      }
    }

    return true;
  },

  async updateSavingsGoal(goalId: string, updates: Partial<SavingsGoal>): Promise<boolean> {
    if (!isValidUUID(goalId)) return false;
    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.targetAmount !== undefined) payload.target_amount = updates.targetAmount;
    if (updates.currentAmount !== undefined) payload.current_amount = updates.currentAmount;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.targetDate !== undefined) payload.deadline = updates.targetDate;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.iconName !== undefined) payload.icon = updates.iconName;
    if (updates.ringStrokeColor !== undefined) payload.color = updates.ringStrokeColor;

    const { error } = await supabase
      .from("savings_goals")
      .update(payload)
      .eq("id", goalId);

    if (error) throw error;
    return true;
  },

  async deleteSavingsGoal(goalId: string): Promise<boolean> {
    if (!isValidUUID(goalId)) return false;
    const { error } = await supabase.from("savings_goals").delete().eq("id", goalId);
    if (error) throw error;
    return true;
  },

  async saveAutoSaveSettings(goalId: string, settings: AutoSaveSettings): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isValidUUID(goalId)) return false;

    const { error } = await supabase
      .from("recurring_transfers")
      .upsert({
        goal_id: goalId,
        user_id: user.id,
        amount: settings.amount,
        frequency: settings.frequency === "mingguan" ? "weekly" : settings.frequency === "harian" ? "daily" : "monthly",
        next_run_date: settings.nextDebitDate || new Date().toISOString().split("T")[0],
        is_active: settings.enabled,
      });

    if (error) throw error;
    return true;
  }
};
