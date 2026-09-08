"use client";

import React from "react";
import {
  Paperclip,
  CheckCircle2,
  Clock,
  Trash2,
  Edit3,
} from "lucide-react";
import { PembukuanTransaction } from "../types";
import { formatCurrency, formatDateIndo } from "../constants";
import { cn } from "@/shared/lib/utils";

interface TransactionCardListProps {
  transactions: PembukuanTransaction[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onOpenDetail: (tx: PembukuanTransaction) => void;
  onOpenEdit: (tx: PembukuanTransaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionCardList({
  transactions,
  selectedIds,
  onToggleSelect,
  onOpenDetail,
  onOpenEdit,
  onDelete,
}: TransactionCardListProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const isSelected = selectedIds.includes(tx.id);
        const isIncome = tx.type === "income";

        return (
          <div
            key={tx.id}
            onClick={() => onOpenDetail(tx)}
            className={cn(
              "p-4 rounded-2xl bg-[#161c28] border border-slate-800 shadow-sm space-y-3 hover:border-slate-700 transition-all cursor-pointer",
              isSelected && "border-blue-500/50 bg-blue-600/5"
            )}
          >
            {/* Top Row: Category & Amount */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    onToggleSelect(tx.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 cursor-pointer"
                  aria-label={`Pilih ${tx.description}`}
                />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-200">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      isIncome ? "bg-emerald-400" : "bg-rose-400"
                    )}
                  />
                  <span>{tx.categoryName}</span>
                </span>
              </div>

              <span
                className={cn(
                  "font-extrabold text-base tabular-nums",
                  isIncome ? "text-emerald-400" : "text-rose-400"
                )}
              >
                {isIncome ? "+" : "-"} {formatCurrency(tx.amount)}
              </span>
            </div>

            {/* Middle Row: Description & Details */}
            <div>
              <h4 className="font-bold text-white text-sm">
                {tx.description}
              </h4>
              {tx.merchant && (
                <p className="text-xs text-slate-400 mt-0.5">{tx.merchant}</p>
              )}
            </div>

            {/* Tags & Attachments */}
            {(tx.tags?.length > 0 || (tx.attachments && tx.attachments.length > 0)) && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {tx.attachments && tx.attachments.length > 0 && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                    <Paperclip className="w-3 h-3" />
                    <span>{tx.attachments.length} Struk</span>
                  </span>
                )}
                {tx.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-400 border border-slate-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom Row: Account, Date, Status & Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">{tx.accountName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  {formatDateIndo(tx.date)}
                </span>
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {tx.status === "completed" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Selesai</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>Pending</span>
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenEdit(tx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(tx.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
