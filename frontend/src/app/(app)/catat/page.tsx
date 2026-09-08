"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { usePembukuan } from "@/app/(app)/pembukuan/hooks/usePembukuan";
import { PembukuanTransaction } from "@/app/(app)/pembukuan/types";

import PembukuanHeader from "@/app/(app)/pembukuan/components/PembukuanHeader";
import PembukuanKpiCards from "@/app/(app)/pembukuan/components/PembukuanKpiCards";
import QuickAddBar from "@/app/(app)/pembukuan/components/QuickAddBar";
import PembukuanFilterBar from "@/app/(app)/pembukuan/components/PembukuanFilterBar";
import TransactionTable from "@/app/(app)/pembukuan/components/TransactionTable";
import TransactionCardList from "@/app/(app)/pembukuan/components/TransactionCardList";
import AddTransactionModal from "@/app/(app)/pembukuan/components/AddTransactionModal";
import TransactionDetailModal from "@/app/(app)/pembukuan/components/TransactionDetailModal";
import CategoryManagerView from "@/app/(app)/pembukuan/components/CategoryManagerView";
import RecurringTransactionsView from "@/app/(app)/pembukuan/components/RecurringTransactionsView";
import BulkImportModal from "@/app/(app)/pembukuan/components/BulkImportModal";
import PembukuanExportModal from "@/app/(app)/pembukuan/components/PembukuanExportModal";

const staggered = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] },
});

function CatatFooter() {
  return (
    <footer className="mt-10 sm:mt-14 -mx-3.5 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 border-t border-slate-800/80 bg-[#0F1419]/90">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} FINUSA (Finance Nusantara). Fitur Catat & Manajemen Transaksi.
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

export default function CatatPage() {
  const {
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
  } = usePembukuan();

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<PembukuanTransaction | null>(null);
  const [detailTransaction, setDetailTransaction] = useState<PembukuanTransaction | null>(null);

  // Selection Toggles
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const currentPageIds = filteredTransactions
      .slice((filters.page - 1) * filters.pageSize, filters.page * filters.pageSize)
      .map((t) => t.id);

    const isAllCurrentSelected = currentPageIds.every((id) => selectedIds.includes(id));
    if (isAllCurrentSelected) {
      setSelectedIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleDuplicateTransaction = (tx: PembukuanTransaction) => {
    addTransaction({
      type: tx.type,
      amount: tx.amount,
      categoryId: tx.categoryId,
      categoryName: tx.categoryName,
      accountId: tx.accountId,
      accountName: tx.accountName,
      description: `${tx.description} (Salinan)`,
      merchant: tx.merchant,
      notes: tx.notes,
      tags: tx.tags,
      status: "completed",
    });
  };

  return (
    <div className="space-y-5 sm:space-y-6 min-h-screen">
      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-[#161c28] border border-slate-700 shadow-2xl flex items-center gap-3 text-xs max-w-sm"
          >
            {toastMessage.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            )}
            {toastMessage.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            )}
            {toastMessage.type === "info" && (
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
            )}

            <div>
              <p className="font-bold text-white">{toastMessage.title}</p>
              {toastMessage.desc && (
                <p className="text-slate-400 mt-0.5">{toastMessage.desc}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header with Tabs & Primary Actions */}
      <motion.div {...staggered(0)}>
        <PembukuanHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsAddModalOpen(true);
          }}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          totalTransactionsCount={transactions.length}
          pendingCount={kpiData.pendingCount}
        />
      </motion.div>

      {/* Tab 1: Ledger & Buku Transaksi */}
      {activeTab === "ledger" && (
        <div className="space-y-5">
          {/* 2. KPI Cards */}
          <motion.div {...staggered(0.04)}>
            <PembukuanKpiCards kpiData={kpiData} />
          </motion.div>

          {/* 3. Quick Add Bar */}
          <motion.div {...staggered(0.08)}>
            <QuickAddBar
              categories={categories}
              accounts={accounts}
              onAddTransaction={addTransaction}
            />
          </motion.div>

          {/* 4. Filter & Search Bar */}
          <motion.div {...staggered(0.12)}>
            <PembukuanFilterBar
              filters={filters}
              onFilterChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
              categories={categories}
              accounts={accounts}
              totalFilteredCount={filteredTransactions.length}
              totalCount={transactions.length}
              selectedIds={selectedIds}
              onClearSelection={() => setSelectedIds([])}
              onBulkDelete={bulkDeleteTransactions}
              onBulkUpdateStatus={bulkUpdateStatus}
            />
          </motion.div>

          {/* 5. Transactions Table / Card View */}
          <motion.div {...staggered(0.16)}>
            {filters.viewMode === "table" ? (
              <TransactionTable
                transactions={filteredTransactions}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onOpenDetail={(tx) => setDetailTransaction(tx)}
                onOpenEdit={(tx) => {
                  setEditingTransaction(tx);
                  setIsAddModalOpen(true);
                }}
                onDelete={deleteTransaction}
                onOpenAddModal={() => {
                  setEditingTransaction(null);
                  setIsAddModalOpen(true);
                }}
                page={filters.page}
                pageSize={filters.pageSize}
                onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
              />
            ) : (
              <TransactionCardList
                transactions={filteredTransactions}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onOpenDetail={(tx) => setDetailTransaction(tx)}
                onOpenEdit={(tx) => {
                  setEditingTransaction(tx);
                  setIsAddModalOpen(true);
                }}
                onDelete={deleteTransaction}
              />
            )}
          </motion.div>
        </div>
      )}

      {/* Tab 2: Kategori Pos */}
      {activeTab === "categories" && (
        <motion.div {...staggered(0.04)}>
          <CategoryManagerView
            categories={categories}
            transactions={transactions}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        </motion.div>
      )}

      {/* Tab 3: Jadwal Berulang */}
      {activeTab === "recurring" && (
        <motion.div {...staggered(0.04)}>
          <RecurringTransactionsView
            recurring={recurring}
            categories={categories}
            accounts={accounts}
            onAddRecurring={addRecurring}
            onUpdateRecurring={updateRecurring}
            onToggleActive={toggleRecurringActive}
            onDeleteRecurring={deleteRecurring}
            onTriggerNow={triggerRecurringNow}
          />
        </motion.div>
      )}

      {/* ── Modals & Drawers ── */}

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={(data) => {
          if (editingTransaction) {
            updateTransaction(editingTransaction.id, data);
          } else {
            addTransaction(data);
          }
        }}
        categories={categories}
        accounts={accounts}
        editingTransaction={editingTransaction}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={detailTransaction}
        isOpen={Boolean(detailTransaction)}
        onClose={() => setDetailTransaction(null)}
        onEdit={(tx) => {
          setDetailTransaction(null);
          setEditingTransaction(tx);
          setIsAddModalOpen(true);
        }}
        onDelete={(id) => {
          deleteTransaction(id);
          setDetailTransaction(null);
        }}
        onDuplicate={(tx) => {
          handleDuplicateTransaction(tx);
          setDetailTransaction(null);
        }}
      />

      {/* Bulk Import CSV Modal */}
      <BulkImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirmImport={importTransactions}
        categories={categories}
        accounts={accounts}
      />

      {/* Export Modal */}
      <PembukuanExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={filteredTransactions}
      />

      <CatatFooter />
    </div>
  );
}
