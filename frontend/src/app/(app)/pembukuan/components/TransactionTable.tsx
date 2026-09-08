"use client";

import React from "react";
import {
  Paperclip,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PembukuanTransaction } from "../types";
import { formatCurrency, formatDateIndo } from "../constants";
import { cn } from "@/shared/lib/utils";

interface TransactionTableProps {
  transactions: PembukuanTransaction[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenDetail: (tx: PembukuanTransaction) => void;
  onOpenEdit: (tx: PembukuanTransaction) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: () => void;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

export default function TransactionTable({
  transactions,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onOpenDetail,
  onOpenEdit,
  onDelete,
  onOpenAddModal,
  page,
  pageSize,
  onPageChange,
}: TransactionTableProps) {
  const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
  const paginatedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize);
  const isAllSelected =
    paginatedTransactions.length > 0 &&
    paginatedTransactions.every((t) => selectedIds.includes(t.id));

  if (transactions.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-[#161c28] border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto text-blue-400">
          <Tag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white">Belum Ada Transaksi</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Tidak ditemukan transaksi yang cocok dengan kriteria filter saat ini.
        </p>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <span>Catat Transaksi Sekarang</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#161c28] border border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#121721] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  aria-label="Pilih Semua"
                />
              </th>
              <th className="py-3 px-4">Tanggal & Waktu</th>
              <th className="py-3 px-4">Deskripsi & Tag</th>
              <th className="py-3 px-4">Kategori Pos</th>
              <th className="py-3 px-4">Metode Pembayaran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Nominal (Rp)</th>
              <th className="py-3 px-4 w-20 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-xs">
            {paginatedTransactions.map((tx) => {
              const isSelected = selectedIds.includes(tx.id);
              const isIncome = tx.type === "income";

              return (
                <tr
                  key={tx.id}
                  className={cn(
                    "group hover:bg-[#1a2130] transition-colors cursor-pointer",
                    isSelected && "bg-blue-600/10"
                  )}
                  onClick={() => onOpenDetail(tx)}
                >
                  {/* Checkbox */}
                  <td
                    className="py-3.5 px-4 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(tx.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(tx.id)}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                      aria-label={`Pilih transaksi ${tx.description}`}
                    />
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-semibold text-white">
                      {formatDateIndo(tx.date)}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {tx.time || "12:00"}
                    </p>
                  </td>

                  {/* Description, Merchant, Tags & Attachment */}
                  <td className="py-3.5 px-4 min-w-[200px]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
                        {tx.description}
                      </span>
                      {tx.attachments && tx.attachments.length > 0 && (
                        <span
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]"
                          title="Terdapat lampiran struk"
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{tx.attachments.length}</span>
                        </span>
                      )}
                    </div>

                    {tx.merchant && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {tx.merchant}
                      </p>
                    )}

                    {tx.tags && tx.tags.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap mt-1">
                        {tx.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.2 rounded-md bg-slate-800/90 text-slate-400 border border-slate-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-200">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isIncome ? "bg-emerald-400" : "bg-rose-400"
                        )}
                      />
                      <span>{tx.categoryName}</span>
                    </span>
                  </td>

                  {/* Account */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-300 font-medium">
                    {tx.accountName}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {tx.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selesai</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-semibold">
                        <Clock className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={cn(
                        "font-extrabold text-sm tabular-nums",
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
                    </span>
                  </td>

                  {/* Row Action Buttons */}
                  <td
                    className="py-3.5 px-4 text-center whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors cursor-pointer"
                        title="Lihat Rincian"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenEdit(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                        title="Edit Transaksi"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(tx.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-4 py-3 border-t border-slate-800 bg-[#121721] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <p>
          Halaman <strong className="text-white">{page}</strong> dari{" "}
          <strong className="text-white">{totalPages}</strong> (Total {transactions.length} baris data)
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Sebelumnya</span>
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
