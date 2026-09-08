"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Target } from "lucide-react";
import {
  SavingsGoal,
  SavingsInsight,
  SavingsAchievement,
  GoalFilterState,
  AutoSaveSettings,
} from "./types";
import {
  INITIAL_ACHIEVEMENTS,
} from "./constants";
import { SavingsService } from "@/lib/services/savings.service";
import NabungHeader from "./components/NabungHeader";
import NabungKpiSummary from "./components/NabungKpiSummary";
import NabungFilterBar from "./components/NabungFilterBar";
import GoalCard from "./components/GoalCard";
import GoalListRow from "./components/GoalListRow";
import GoalDetailModal from "./components/GoalDetailModal";
import CreateGoalModal from "./components/CreateGoalModal";
import AddMoneyModal from "./components/AddMoneyModal";
import AutoSaveModal from "./components/AutoSaveModal";
import MilestoneCelebrationModal from "./components/MilestoneCelebrationModal";
import SmartSavingsInsights from "./components/SmartSavingsInsights";
import AchievementsShowcase from "./components/AchievementsShowcase";
import NabungExportModal from "./components/NabungExportModal";

const staggered = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
});

function NabungFooter() {
  return (
    <footer className="mt-10 sm:mt-14 -mx-3.5 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-800/80 bg-[#0F1419]/90">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} FINUSA (Finance Nusantara). Fitur Target Tabungan.
        </p>
        <div className="flex items-center gap-4 sm:gap-5">
          {[
            { label: "Bantuan", href: "/help" },
            { label: "Privasi", href: "/help" },
            { label: "Syarat & Ketentuan", href: "/help" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-xs text-slate-500 font-mono">v2.0</span>
        </div>
      </div>
    </footer>
  );
}

export default function NabungPage() {
  // State Initialization
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [insights] = useState<SavingsInsight[]>([]);
  const [achievements] = useState<SavingsAchievement[]>(INITIAL_ACHIEVEMENTS);
  const [isClient, setIsClient] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<GoalFilterState>({
    search: "",
    category: "all",
    status: "all",
    priority: "all",
    sortBy: "deadline",
    viewMode: "grid",
  });

  // Modals Active State
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);
  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);
  const [autoSaveGoal, setAutoSaveGoal] = useState<SavingsGoal | null>(null);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showInsightsBanner, setShowInsightsBanner] = useState(true);

  // Celebration Modal State
  const [celebrationState, setCelebrationState] = useState<{
    isOpen: boolean;
    goalName: string;
    milestoneLevel: number;
    currentAmount: number;
    targetAmount: number;
  }>({
    isOpen: false,
    goalName: "",
    milestoneLevel: 25,
    currentAmount: 0,
    targetAmount: 0,
  });

  // Client hydration & Supabase data load
  useEffect(() => {
    setIsClient(true);

    async function loadSavingsData() {
      try {
        const dbGoals = await SavingsService.getSavingsGoals();
        if (dbGoals) {
          setGoals(dbGoals);
        }
      } catch (err) {
        console.warn("Failed to load savings from Supabase:", err);
      }
    }

    loadSavingsData();
  }, []);

  // Save to localStorage whenever goals change
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("finusa_savings_goals", JSON.stringify(goals));
      } catch {
        // ignore
      }
    }
  }, [goals, isClient]);

  // Handle Deposit Money
  const handleDeposit = async (
    goalId: string,
    depositAmount: number,
    sourceAccount = "BCA Bisnis & Operasional",
    notes = "Setoran Tabungan"
  ) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;

        const oldAmount = g.currentAmount;
        const oldPercent = Math.round((oldAmount / g.targetAmount) * 100);
        const newAmount = Math.min(g.targetAmount * 1.2, oldAmount + depositAmount);
        const newPercent = Math.round((newAmount / g.targetAmount) * 100);

        // Check if crossed any milestone
        const milestoneLevels: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];
        let justCrossedMilestone: number | null = null;
        for (const level of milestoneLevels) {
          if (oldPercent < level && newPercent >= level) {
            justCrossedMilestone = level;
          }
        }

        if (justCrossedMilestone) {
          setCelebrationState({
            isOpen: true,
            goalName: g.name,
            milestoneLevel: justCrossedMilestone,
            currentAmount: newAmount,
            targetAmount: g.targetAmount,
          });
        }

        const newTx = {
          id: `tx-${Date.now()}`,
          goalId: g.id,
          amount: depositAmount,
          date: new Date().toISOString().split("T")[0],
          method: "Manual Deposit",
          sourceAccount,
          notes,
          isAutoSave: false,
        };

        const updatedMilestones = g.milestones.map((m) => {
          if (newPercent >= m.percentage && !m.reached) {
            return {
              ...m,
              reached: true,
              reachedAt: new Date().toISOString().split("T")[0],
            };
          }
          return m;
        });

        const isCompleted = newAmount >= g.targetAmount;

        return {
          ...g,
          currentAmount: newAmount,
          status: isCompleted ? "tercapai" : g.status,
          transactions: [newTx, ...g.transactions],
          milestones: updatedMilestones,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Sync deposit to Supabase and refresh
    try {
      await SavingsService.depositMoney(goalId, depositAmount, undefined, notes);
      const freshGoals = await SavingsService.getSavingsGoals();
      if (freshGoals && freshGoals.length > 0) {
        setGoals(freshGoals);
      }
    } catch (e) {
      console.warn("Could not save deposit to Supabase:", e);
    }
  };

  // Handle Create / Edit Goal
  const handleSaveGoal = async (goalData: Partial<SavingsGoal>) => {
    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== editingGoal.id) return g;
          return {
            ...g,
            ...goalData,
            updatedAt: new Date().toISOString(),
          } as SavingsGoal;
        })
      );
      setEditingGoal(null);

      try {
        await SavingsService.updateSavingsGoal(editingGoal.id, goalData);
      } catch (e) {
        console.warn("Could not update savings goal in Supabase:", e);
      }
    } else {
      const tempId = `goal-${Date.now()}`;
      const newGoal: SavingsGoal = {
        id: tempId,
        name: goalData.name || "Target Baru",
        category: goalData.category || "darurat",
        categoryLabel: goalData.categoryLabel || "Dana Darurat",
        userType: goalData.userType || "UMKM",
        targetAmount: goalData.targetAmount || 10000000,
        currentAmount: goalData.currentAmount || 0,
        startDate: new Date().toISOString().split("T")[0],
        targetDate: goalData.targetDate || new Date().toISOString().split("T")[0],
        priority: goalData.priority || "tinggi",
        status: "aktif",
        description: goalData.description || "",
        iconName: goalData.iconName || "ShieldCheck",
        accentColor: goalData.accentColor || "text-emerald-400",
        gradient: goalData.gradient || "from-emerald-500 to-teal-400",
        badgeClass: goalData.badgeClass || "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
        iconContainerClass: goalData.iconContainerClass || "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
        ringStrokeColor: goalData.ringStrokeColor || "#10B981",
        autoSave: {
          enabled: false,
          frequency: "bulanan",
          amount: Math.round((goalData.targetAmount || 10000000) / 6),
          sourceAccount: "BCA Bisnis & Operasional",
          nextDebitDate: new Date().toISOString().split("T")[0],
        },
        transactions: [],
        milestones: [
          { level: 25, label: "Langkah Awal (25%)", percentage: 25, reached: false, badgeName: "Perunggu", description: "Pondasi dana mulai terbentuk" },
          { level: 50, label: "Separuh Jalan (50%)", percentage: 50, reached: false, badgeName: "Perak", description: "50% target tercapai" },
          { level: 75, label: "Mendekati Target (75%)", percentage: 75, reached: false, badgeName: "Emas", description: "75% target terkumpul" },
          { level: 100, label: "Target Tuntas (100%)", percentage: 100, reached: false, badgeName: "Platinum", description: "Target finansial tercapai sempurna" },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setGoals((prev) => [newGoal, ...prev]);

      try {
        const created = await SavingsService.createSavingsGoal({
          name: newGoal.name,
          targetAmount: newGoal.targetAmount,
          currentAmount: newGoal.currentAmount,
          category: newGoal.category,
          targetDate: newGoal.targetDate,
          priority: newGoal.priority,
          status: newGoal.status,
          description: newGoal.description,
          icon: newGoal.iconName,
          color: newGoal.ringStrokeColor,
          isPinned: false,
        });

        if (created) {
          setGoals((prev) => prev.map((g) => (g.id === tempId ? created : g)));
        }
      } catch (e) {
        console.warn("Could not create savings goal in Supabase:", e);
      }
    }
  };

  // Handle Delete Goal
  const handleDeleteGoal = async (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
      setIsDetailOpen(false);
    }

    try {
      await SavingsService.deleteSavingsGoal(goalId);
    } catch (e) {
      console.warn("Could not delete savings goal from Supabase:", e);
    }
  };

  // Handle Auto-Save Save
  const handleSaveAutoSave = (goalId: string, settings: AutoSaveSettings) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        return {
          ...g,
          autoSave: settings,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Handle Insight Action Trigger
  const handleInsightAction = (insight: SavingsInsight) => {
    if (insight.actionType === "add_money" && insight.goalIdTarget) {
      const targetG = goals.find((g) => g.id === insight.goalIdTarget);
      if (targetG) {
        setDepositGoal(targetG);
      }
    } else if (insight.actionType === "setup_autosave" && insight.goalIdTarget) {
      const targetG = goals.find((g) => g.id === insight.goalIdTarget);
      if (targetG) {
        setAutoSaveGoal(targetG);
      }
    } else {
      setIsCreateOpen(true);
    }
  };

  // Filter and Sort Goals
  const filteredGoals = useMemo(() => {
    return goals
      .filter((g) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = g.name.toLowerCase().includes(q);
          const matchDesc = g.description.toLowerCase().includes(q);
          const matchCat = g.categoryLabel.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        if (filters.category !== "all" && g.category !== filters.category) {
          return false;
        }

        if (filters.status !== "all") {
          if (filters.status === "aktif" && g.status !== "aktif") return false;
          if (filters.status === "tercapai" && g.status !== "tercapai" && g.currentAmount < g.targetAmount) return false;
          if (filters.status === "tertunda" && g.status !== "tertunda") return false;
        }

        if (filters.priority !== "all" && g.priority !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "deadline") {
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        }
        if (filters.sortBy === "progress_desc") {
          const pa = a.currentAmount / a.targetAmount;
          const pb = b.currentAmount / b.targetAmount;
          return pb - pa;
        }
        if (filters.sortBy === "progress_asc") {
          const pa = a.currentAmount / a.targetAmount;
          const pb = b.currentAmount / b.targetAmount;
          return pa - pb;
        }
        if (filters.sortBy === "amount_desc") {
          return b.targetAmount - a.targetAmount;
        }
        if (filters.sortBy === "priority") {
          const pOrder = { tinggi: 3, sedang: 2, rendah: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        return 0;
      });
  }, [goals, filters]);

  const activeGoalsCount = goals.filter((g) => g.status === "aktif" && g.currentAmount < g.targetAmount).length;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 min-h-screen">
      {/* 1. Top Header */}
      <motion.div {...staggered(0)}>
        <NabungHeader
          activeGoalsCount={activeGoalsCount}
          totalGoalsCount={goals.length}
          onOpenCreate={() => {
            setEditingGoal(null);
            setIsCreateOpen(true);
          }}
          onOpenInsights={() => setShowInsightsBanner(!showInsightsBanner)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
        />
      </motion.div>

      {/* 2. KPI Summary Cards */}
      <motion.div {...staggered(0.04)}>
        <NabungKpiSummary goals={goals} />
      </motion.div>

      {/* 3. Smart Savings Insights Banner */}
      <AnimatePresence>
        {showInsightsBanner && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SmartSavingsInsights
              insights={insights}
              onActionClick={handleInsightAction}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Filter, Search & Sort Bar */}
      <motion.div {...staggered(0.08)}>
        <NabungFilterBar
          filters={filters}
          onFilterChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
          onResetFilters={() =>
            setFilters({
              search: "",
              category: "all",
              status: "all",
              priority: "all",
              sortBy: "deadline",
              viewMode: filters.viewMode,
            })
          }
          filteredCount={filteredGoals.length}
          totalCount={goals.length}
        />
      </motion.div>

      {/* 5. Goal Cards Display (Grid or List View) */}
      <motion.div {...staggered(0.12)}>
        {filteredGoals.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-[#161c28] p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
              <Target className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Tidak ada target tabungan yang cocok
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Coba sesuaikan kata kunci pencarian, filter kategori, atau buat pos target tabungan baru sekarang.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingGoal(null);
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Target Baru</span>
            </button>
          </div>
        ) : filters.viewMode === "list" ? (
          <div className="space-y-2.5">
            {filteredGoals.map((g) => (
              <GoalListRow
                key={g.id}
                goal={g}
                onQuickDeposit={(id, amt) => handleDeposit(id, amt)}
                onOpenDetail={(goal) => {
                  setSelectedGoal(goal);
                  setIsDetailOpen(true);
                }}
                onOpenDepositModal={(goal) => setDepositGoal(goal)}
                onOpenAutoSaveModal={(goal) => setAutoSaveGoal(goal)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredGoals.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                onQuickDeposit={(id, amt) => handleDeposit(id, amt)}
                onOpenDetail={(goal) => {
                  setSelectedGoal(goal);
                  setIsDetailOpen(true);
                }}
                onOpenDepositModal={(goal) => setDepositGoal(goal)}
                onOpenAutoSaveModal={(goal) => setAutoSaveGoal(goal)}
                onEditGoal={(goal) => {
                  setEditingGoal(goal);
                  setIsCreateOpen(true);
                }}
                onDeleteGoal={(id) => handleDeleteGoal(id)}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Modals & Overlays ── */}

      {/* Detail Modal */}
      <GoalDetailModal
        goal={selectedGoal}
        isOpen={isDetailOpen}
        onClose={() => {
          setSelectedGoal(null);
          setIsDetailOpen(false);
        }}
        onOpenDeposit={(goal) => {
          setIsDetailOpen(false);
          setDepositGoal(goal);
        }}
        onOpenEdit={(goal) => {
          setIsDetailOpen(false);
          setEditingGoal(goal);
          setIsCreateOpen(true);
        }}
        onOpenAutoSave={(goal) => {
          setIsDetailOpen(false);
          setAutoSaveGoal(goal);
        }}
      />

      {/* Create / Edit Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSaveGoal}
        editingGoal={editingGoal}
      />

      {/* Deposit Money Modal */}
      <AddMoneyModal
        goal={depositGoal}
        isOpen={Boolean(depositGoal)}
        onClose={() => setDepositGoal(null)}
        onSubmitDeposit={(goalId, amount, src, notes) =>
          handleDeposit(goalId, amount, src, notes)
        }
      />

      {/* Auto-Save Modal */}
      <AutoSaveModal
        goal={autoSaveGoal}
        isOpen={Boolean(autoSaveGoal)}
        onClose={() => setAutoSaveGoal(null)}
        onSaveAutoSave={handleSaveAutoSave}
      />

      {/* Milestone Celebration Modal */}
      <MilestoneCelebrationModal
        isOpen={celebrationState.isOpen}
        onClose={() =>
          setCelebrationState((prev) => ({ ...prev, isOpen: false }))
        }
        goalName={celebrationState.goalName}
        milestoneLevel={celebrationState.milestoneLevel}
        currentAmount={celebrationState.currentAmount}
        targetAmount={celebrationState.targetAmount}
      />

      {/* Achievements Showcase Modal */}
      <AchievementsShowcase
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      {/* Export Modal */}
      <NabungExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        goals={goals}
      />

      <NabungFooter />
    </div>
  );
}
