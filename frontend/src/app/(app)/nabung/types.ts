export type SavingsCategory =
  | "darurat"
  | "usaha"
  | "gadget"
  | "pendidikan"
  | "properti"
  | "kendaraan"
  | "liburan"
  | "investasi"
  | "lainnya";

export type GoalPriority = "tinggi" | "sedang" | "rendah";

export type GoalStatus = "aktif" | "tercapai" | "tertunda";

export type MilestoneLevel = 25 | 50 | 75 | 100;

export interface GoalMilestone {
  level: MilestoneLevel;
  label: string;
  percentage: number;
  reached: boolean;
  reachedAt?: string;
  badgeName: string;
  description: string;
}

export interface GoalTransaction {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  method: string;
  sourceAccount: string;
  notes?: string;
  isAutoSave?: boolean;
}

export interface AutoSaveSettings {
  enabled: boolean;
  frequency: "harian" | "mingguan" | "bulanan";
  amount: number;
  sourceAccount: string;
  nextDebitDate: string;
  dayOfMonth?: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  category: SavingsCategory;
  categoryLabel: string;
  userType: "UMKM" | "Mahasiswa" | "Umum";
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  priority: GoalPriority;
  status: GoalStatus;
  description: string;
  iconName: string;
  accentColor: string;
  gradient: string;
  badgeClass: string;
  iconContainerClass: string;
  ringStrokeColor: string;
  autoSave: AutoSaveSettings;
  transactions: GoalTransaction[];
  milestones: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface SavingsInsight {
  id: string;
  title: string;
  description: string;
  impact: "tinggi" | "sedang";
  categoryTag: string;
  actionType: "add_money" | "create_goal" | "setup_autosave" | "filter_budget";
  actionLabel: string;
  goalIdTarget?: string;
  potentialSavings: number;
}

export interface SavingsAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

export interface AccountOption {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber: string;
}

export interface GoalFilterState {
  search: string;
  category: string;
  status: string;
  priority: string;
  sortBy: "deadline" | "progress_desc" | "progress_asc" | "amount_desc" | "priority";
  viewMode: "grid" | "list";
}
