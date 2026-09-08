"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
  Utensils,
  ShoppingCart,
  Car,
  Zap,
  Tag,
  RotateCcw,
} from "lucide-react";
import { Transaction, TransactionType } from "../types";
import { formatCurrency, formatDateIndo } from "../constants";
import TransactionDetailModal from "./TransactionDetailModal";
import { cn } from "@/shared/lib/utils";

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  operasional: Briefcase,
  income_business: Briefcase,
  makanan: Utensils,
  belanja: ShoppingCart,
  transportasi: Car,
  utilitas: Zap,
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc" | "amount_asc">("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Extract unique categories & accounts for dropdowns
  const availableCategories = useMemo(() => {
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set);
  }, [transactions]);

  const availableAccounts = useMemo(() => {
    const set = new Set(transactions.map((t) => t.account));
    return Array.from(set);
  }, [transactions]);

  // Filter & Sort Pipeline
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = t.description.toLowerCase().includes(q);
          const matchMerchant = (t.merchant || "").toLowerCase().includes(q);
          const matchCategory = t.category.toLowerCase().includes(q);
          const matchAccount = t.account.toLowerCase().includes(q);
          if (!matchDesc && !matchMerchant && !matchCategory && !matchAccount) return false;
        }

        // Type
        if (typeFilter !== "all" && t.type !== typeFilter) {
          return false;
        }

        // Category
        if (categoryFilter !== "all" && t.category !== categoryFilter) {
          return false;
        }

        // Account
        if (accountFilter !== "all" && t.account !== accountFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date_desc") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "date_asc") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "amount_desc") {
          return b.amount - a.amount;
        }
        if (sortBy === "amount_asc") {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchQuery, typeFilter, categoryFilter, accountFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const hasActiveFilters =
    searchQuery !== "" ||
    typeFilter !== "all" ||
    categoryFilter !== "all" ||
    accountFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setAccountFilter("all");
    setSortBy("date_desc");
    setCurrentPage(1);
  };

  return (
    <div className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-[#151B26] border border-slate-800/90 shadow-lg shadow-black/20 space-y-4">
      {/* Title & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
            Daftar Transaksi
          </h2>
          <p className="text-xs text-slate-400">
            Catatan semua uang yang masuk dan keluar
          </p>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start md:self-auto">
          {[
            { id: "all" as const, label: "Semua" },
            { id: "income" as const, label: "Pemasukan" },
            { id: "expense" as const, label: "Pengeluaran" },
          ].map((tab) => {
            const isActive = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setTypeFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  isActive
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Search + Dropdown Filters + Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
        {/* Search Input (5 Cols on LG) */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari transaksi, merchant, catatan..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown (3 Cols on LG) */}
        <div className="lg:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Account Dropdown (3 Cols on LG) */}
        <div className="lg:col-span-3">
          <select
            value={accountFilter}
            onChange={(e) => {
              setAccountFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Semua Rekening</option>
            {availableAccounts.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown (2 Cols on LG) */}
        <div className="lg:col-span-2">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "date_desc"
                  | "date_asc"
                  | "amount_desc"
                  | "amount_asc"
              )
            }
            className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="date_desc">Terbaru</option>
            <option value="date_asc">Terlama</option>
            <option value="amount_desc">Nominal Tertinggi</option>
            <option value="amount_asc">Nominal Terendah</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips & Reset */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px]">Filter Aktif:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 text-[11px]">
              Teks: &quot;{searchQuery}&quot;
              <button type="button" onClick={() => setSearchQuery("")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {typeFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 text-[11px]">
              Tipe: {typeFilter === "income" ? "Pemasukan" : "Pengeluaran"}
              <button type="button" onClick={() => setTypeFilter("all")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {categoryFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 text-[11px]">
              Pos: {categoryFilter}
              <button type="button" onClick={() => setCategoryFilter("all")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {accountFilter !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 border border-slate-700 text-[11px]">
              Akun: {accountFilter}
              <button type="button" onClick={() => setAccountFilter("all")}>
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 ml-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Semua
          </button>
        </div>
      )}

      {/* Transactions Display: Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Deskripsi & Pihak</th>
              <th className="py-3 px-4">Kategori Pos</th>
              <th className="py-3 px-4">Rekening Akun</th>
              <th className="py-3 px-4 text-right">Nominal</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((trx) => {
                const isIncome = trx.type === "income";
                const IconComp =
                  CATEGORY_ICON_MAP[trx.categoryId] || Tag;

                return (
                  <tr
                    key={trx.id}
                    onClick={() => setSelectedTransaction(trx)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap font-medium">
                      {formatDateIndo(trx.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {trx.description}
                      </div>
                      {trx.merchant && (
                        <span className="text-[11px] text-slate-400">
                          {trx.merchant}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300">
                        <IconComp className="w-3 h-3 text-blue-400" />
                        {trx.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap font-medium">
                      {trx.account}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <span
                        className={cn(
                          "font-bold tabular-nums text-sm",
                          isIncome ? "text-emerald-400" : "text-rose-400"
                        )}
                      >
                        {isIncome
                          ? `+${formatCurrency(trx.amount)}`
                          : `-${formatCurrency(trx.amount)}`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTransaction(trx);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Lihat Rincian"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="font-semibold text-slate-300">
                      Tidak ada transaksi ditemukan
                    </p>
                    <p className="text-xs text-slate-400">
                      Coba sesuaikan kata kunci pencarian atau filter yang dipilih.
                    </p>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700 text-xs font-semibold transition-colors mt-2"
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden space-y-2.5">
        {paginatedTransactions.length > 0 ? (
          paginatedTransactions.map((trx) => {
            const isIncome = trx.type === "income";
            const IconComp =
              CATEGORY_ICON_MAP[trx.categoryId] || Tag;

            return (
              <div
                key={trx.id}
                onClick={() => setSelectedTransaction(trx)}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 active:bg-slate-800/80 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 mt-0.5",
                        isIncome
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate">
                        {trx.description}
                      </h4>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {trx.merchant ? `${trx.merchant} • ` : ""}
                        {trx.account}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={cn(
                        "font-bold tabular-nums text-xs sm:text-sm block",
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {isIncome
                        ? `+${formatCurrency(trx.amount)}`
                        : `-${formatCurrency(trx.amount)}`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateIndo(trx.date)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                  <span className="inline-flex items-center gap-1 text-slate-400">
                    <IconComp className="w-3 h-3 text-blue-400" />
                    {trx.category}
                  </span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    Detail <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800/60">
            <p className="font-semibold text-slate-300 text-xs">
              Tidak ada transaksi ditemukan
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700 text-xs font-semibold transition-colors mt-2"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs text-slate-400">
        <div>
          Menampilkan{" "}
          <span className="font-semibold text-white tabular-nums">
            {filteredTransactions.length > 0
              ? (currentPage - 1) * pageSize + 1
              : 0}
          </span>{" "}
          hingga{" "}
          <span className="font-semibold text-white tabular-nums">
            {Math.min(currentPage * pageSize, filteredTransactions.length)}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-white tabular-nums">
            {filteredTransactions.length}
          </span>{" "}
          transaksi
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <span className="px-2 font-semibold text-white tabular-nums">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
