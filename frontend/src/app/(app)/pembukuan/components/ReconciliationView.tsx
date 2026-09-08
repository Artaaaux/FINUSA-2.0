"use client";

import React, { useState } from "react";
import {
  Scale,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Unlink,
  Link as LinkIcon,
  Plus,
  Building,
  Check,
  FileCheck,
} from "lucide-react";
import {
  BankStatementTransaction,
  PembukuanTransaction,
  ReconciliationMatch,
  ReconciliationSummary,
} from "../types";
import { formatCurrency, formatDateIndo } from "../constants";
import { cn } from "@/shared/lib/utils";

interface ReconciliationViewProps {
  bankStatements: BankStatementTransaction[];
  transactions: PembukuanTransaction[];
  matches: ReconciliationMatch[];
  summary: ReconciliationSummary;
  onAutoMatch: () => void;
  onMatch: (bankId: string, appId: string) => void;
  onUnmatch: (bankId: string) => void;
  onQuickCreateAppTrx: (data: Partial<PembukuanTransaction>) => void;
}

export default function ReconciliationView({
  bankStatements,
  transactions,
  matches,
  summary,
  onAutoMatch,
  onMatch,
  onUnmatch,
  onQuickCreateAppTrx,
}: ReconciliationViewProps) {
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const matchedBankMap = new Map(matches.map((m) => [m.bankTrxId, m]));
  const matchedAppMap = new Map(matches.map((m) => [m.appTrxId, m]));

  const handleManualPair = () => {
    if (selectedBankId && selectedAppId) {
      onMatch(selectedBankId, selectedAppId);
      setSelectedBankId(null);
      setSelectedAppId(null);
    }
  };

  const handleCreateFromBank = (bankItem: BankStatementTransaction) => {
    onQuickCreateAppTrx({
      type: bankItem.type === "credit" ? "income" : "expense",
      amount: bankItem.amount,
      date: bankItem.date,
      description: bankItem.description,
      notes: "Dicatat dari rekonsiliasi mutasi rekening koran",
      accountId: summary.accountId,
      accountName: summary.accountName,
      status: "completed",
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Status & Certification Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#161c28] border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" />
                <span>Rekonsiliasi Mutasi Bank</span>
              </h3>
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                  summary.isBalanced
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                )}
              >
                {summary.isBalanced ? "Kas Seimbang (Balanced)" : "Terdapat Selisih"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Akun: <strong className="text-slate-200">{summary.accountName}</strong> • Periode: {formatDateIndo(summary.statementPeriod.start)} - {formatDateIndo(summary.statementPeriod.end)}
            </p>
          </div>

          {/* Auto Match Action Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAutoMatch}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Cocokkan Otomatis (Auto-Match)</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0F1419] border border-slate-800/80 space-y-1">
            <span className="text-slate-400 font-semibold text-[11px]">Saldo Akhir Bank</span>
            <p className="font-bold text-white text-sm tabular-nums">
              {formatCurrency(summary.closingBalance)}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F1419] border border-slate-800/80 space-y-1">
            <span className="text-slate-400 font-semibold text-[11px]">Mutasi Tercocokkan</span>
            <p className="font-bold text-emerald-400 text-sm tabular-nums flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{summary.matchedCount} Mutasi ({Math.round((summary.matchedCount / Math.max(1, bankStatements.length)) * 100)}%)</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F1419] border border-slate-800/80 space-y-1">
            <span className="text-slate-400 font-semibold text-[11px]">Belum Dicocokkan</span>
            <p className="font-bold text-amber-400 text-sm tabular-nums flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{summary.unmatchedBankCount} Mutasi Bank</span>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#0F1419] border border-slate-800/80 space-y-1">
            <span className="text-slate-400 font-semibold text-[11px]">Selisih Pembukuan</span>
            <p className="font-bold text-white text-sm tabular-nums">
              {formatCurrency(summary.discrepancyAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Manual Pair Banner (if both sides are selected) */}
      {selectedBankId && selectedAppId && (
        <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2 text-blue-300 font-medium">
            <LinkIcon className="w-4 h-4 text-blue-400" />
            <span>1 Mutasi Bank dan 1 Transaksi Pembukuan dipilih untuk dicocokkan.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualPair}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Pasangkan Sekarang</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedBankId(null);
                setSelectedAppId(null);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Split-View Reconciliation Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left Side: Bank Statement Mutasi */}
        <div className="p-4 rounded-2xl bg-[#161c28] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Mutasi Rekening Koran Bank ({bankStatements.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">Pilih baris untuk pasang</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {bankStatements.map((bankItem) => {
              const match = matchedBankMap.get(bankItem.id);
              const isSelected = selectedBankId === bankItem.id;
              const isCredit = bankItem.type === "credit";

              return (
                <div
                  key={bankItem.id}
                  onClick={() => !match && setSelectedBankId(isSelected ? null : bankItem.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-xs space-y-1.5",
                    match
                      ? "bg-emerald-500/5 border-emerald-500/25"
                      : isSelected
                      ? "bg-blue-600/15 border-blue-500"
                      : "bg-[#0F1419] border-slate-800 hover:border-slate-700 cursor-pointer"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{bankItem.description}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {formatDateIndo(bankItem.date)}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "font-bold tabular-nums text-right whitespace-nowrap",
                        isCredit ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {isCredit ? "+" : "-"} {formatCurrency(bankItem.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                    {match ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Cocok ({match.confidence}%)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Belum Dicocokkan
                      </span>
                    )}

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {match ? (
                        <button
                          type="button"
                          onClick={() => onUnmatch(bankItem.id)}
                          className="flex items-center gap-1 text-[10px] text-rose-400 hover:underline p-1"
                        >
                          <Unlink className="w-3 h-3" />
                          <span>Lepas</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCreateFromBank(bankItem)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-[10px] font-semibold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Catat ke Ledger</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: FINUSA App Transactions */}
        <div className="p-4 rounded-2xl bg-[#161c28] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Catatan Transaksi FINUSA ({transactions.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">Pilih baris untuk pasang</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {transactions.map((appItem) => {
              const match = matchedAppMap.get(appItem.id);
              const isSelected = selectedAppId === appItem.id;
              const isIncome = appItem.type === "income";

              return (
                <div
                  key={appItem.id}
                  onClick={() => !match && setSelectedAppId(isSelected ? null : appItem.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-xs space-y-1.5",
                    match
                      ? "bg-emerald-500/5 border-emerald-500/25"
                      : isSelected
                      ? "bg-blue-600/15 border-blue-500"
                      : "bg-[#0F1419] border-slate-800 hover:border-slate-700 cursor-pointer"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white">{appItem.description}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {formatDateIndo(appItem.date)} • {appItem.categoryName}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "font-bold tabular-nums text-right whitespace-nowrap",
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(appItem.amount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                    {match ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Terekonsiliasi</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Belum Terhubung
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500">
                      {appItem.accountName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
