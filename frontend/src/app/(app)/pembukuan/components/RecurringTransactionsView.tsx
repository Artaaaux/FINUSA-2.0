"use client";

import React, { useState } from "react";
import {
  CalendarClock,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit3,
  Calendar,
  X,
  Check,
} from "lucide-react";
import {
  RecurringTransaction,
  RecurringFrequency,
  CategoryItem,
  TransactionType,
} from "../types";
import { AccountOption, formatCurrency, formatDateIndo } from "../constants";
import { cn } from "@/shared/lib/utils";

interface RecurringTransactionsViewProps {
  recurring: RecurringTransaction[];
  categories: CategoryItem[];
  accounts: AccountOption[];
  onAddRecurring: (data: Partial<RecurringTransaction>) => void;
  onUpdateRecurring: (id: string, data: Partial<RecurringTransaction>) => void;
  onToggleActive: (id: string) => void;
  onDeleteRecurring: (id: string) => void;
  onTriggerNow: (id: string) => void;
}

export default function RecurringTransactionsView({
  recurring,
  categories,
  accounts,
  onAddRecurring,
  onUpdateRecurring,
  onToggleActive,
  onDeleteRecurring,
  onTriggerNow,
}: RecurringTransactionsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecurringTransaction | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<TransactionType>("expense");
  const [formAmountStr, setFormAmountStr] = useState("");
  const [formFrequency, setFormFrequency] = useState<RecurringFrequency>("monthly");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formAccountId, setFormAccountId] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formNextDate, setFormNextDate] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const availableCategories = React.useMemo(() => {
    const filtered = categories.filter((c) => c.type === (formType === "income" ? "income" : "expense"));
    const seen = new Set<string>();
    return filtered.filter((c) => {
      const lower = c.name.trim().toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [categories, formType]);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormName("");
    setFormType("expense");
    setFormAmountStr("");
    setFormFrequency("monthly");
    const initialCat = categories.find((c) => c.type === "expense")?.id || categories[0]?.id || "";
    setFormCategoryId(initialCat);
    setFormAccountId(accounts[0]?.id || "acc-mandiri");
    const today = new Date().toISOString().split("T")[0];
    setFormStartDate(today);
    setFormNextDate(today);
    setFormNotes("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: RecurringTransaction) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormType(item.type);
    setFormAmountStr(String(item.amount));
    setFormFrequency(item.frequency);
    setFormCategoryId(item.categoryId);
    setFormAccountId(item.accountId);
    setFormStartDate(item.startDate);
    setFormNextDate(item.nextOccurrenceDate);
    setFormNotes(item.notes || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(formAmountStr.replace(/[^0-9]/g, ""));
    if (!parsedAmount || parsedAmount <= 0 || !formName.trim()) return;

    const chosenCat = categories.find((c) => c.id === formCategoryId) || availableCategories[0];
    const chosenAcc = accounts.find((a) => a.id === formAccountId) || accounts[0];

    if (editingItem) {
      onUpdateRecurring(editingItem.id, {
        name: formName.trim(),
        type: formType,
        amount: parsedAmount,
        frequency: formFrequency,
        categoryId: chosenCat.id,
        categoryName: chosenCat.name,
        accountId: chosenAcc.id,
        accountName: chosenAcc.name,
        startDate: formStartDate,
        nextOccurrenceDate: formNextDate,
        notes: formNotes.trim(),
      });
    } else {
      onAddRecurring({
        name: formName.trim(),
        type: formType,
        amount: parsedAmount,
        frequency: formFrequency,
        categoryId: chosenCat.id,
        categoryName: chosenCat.name,
        accountId: chosenAcc.id,
        accountName: chosenAcc.name,
        startDate: formStartDate,
        nextOccurrenceDate: formNextDate,
        notes: formNotes.trim(),
      });
    }
    setIsModalOpen(false);
  };

  const getFrequencyLabel = (freq: RecurringFrequency) => {
    switch (freq) {
      case "daily":
        return "Setiap Hari";
      case "weekly":
        return "Setiap Minggu";
      case "biweekly":
        return "Setiap 2 Minggu";
      case "monthly":
        return "Setiap Bulan";
      case "yearly":
        return "Setiap Tahun";
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#161c28] border border-slate-800 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-blue-400" />
            <span>Jadwal Transaksi Otomatis & Rutin</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola tagihan rutin, sewa, langganan internet, atau alokasi tabungan berulang.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Jadwal Baru</span>
        </button>
      </div>

      {/* Recurring Items List */}
      {recurring.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-[#161c28] border border-slate-800 text-center space-y-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <CalendarClock className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-white">Belum Ada Jadwal Transaksi</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Atur tagihan rutin bulanan seperti sewa hunian, token listrik, atau gaji pokok agar otomatis tercatat di buku kas.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Jadwal Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recurring.map((item) => {
            const isIncome = item.type === "income";

            return (
              <div
                key={item.id}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl bg-[#161c28] border shadow-sm flex flex-col justify-between space-y-4 transition-all",
                  item.isActive ? "border-slate-800 hover:border-slate-700" : "border-slate-800/50 opacity-70"
                )}
              >
                <div className="space-y-3">
                  {/* Header & Status Toggle */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">
                          {item.name}
                        </h4>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-semibold border",
                            item.isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                          )}
                        >
                          {item.isActive ? "Aktif" : "Dijeda"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.categoryName} • {item.accountName}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "font-extrabold text-sm sm:text-base tabular-nums",
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {isIncome ? "+" : "-"} {formatCurrency(item.amount)}
                    </span>
                  </div>

                  {/* Schedule info pills */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="px-2.5 py-1 rounded-xl bg-[#0F1419] border border-slate-800 text-slate-300 font-medium">
                      {getFrequencyLabel(item.frequency)}
                    </span>

                    <span className="px-2.5 py-1 rounded-xl bg-[#0F1419] border border-slate-800 text-slate-300 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Jadwal: {formatDateIndo(item.nextOccurrenceDate)}</span>
                    </span>

                    <span className="px-2.5 py-1 rounded-xl bg-[#0F1419] border border-slate-800 text-slate-400 font-mono">
                      {item.executionCount}x dieksekusi
                    </span>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onTriggerNow(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-colors cursor-pointer"
                    title="Eksekusi dan catat ke buku kas sekarang"
                  >
                    <Play className="w-3 h-3" />
                    <span>Jalankan Sekarang</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleActive(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title={item.isActive ? "Jeda Jadwal" : "Aktifkan Jadwal"}
                    >
                      {item.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Jadwal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteRecurring(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Hapus Jadwal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create / Edit Recurring */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-lg bg-[#161c28] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121721]">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingItem ? "Edit Jadwal Berulang" : "Buat Jadwal Transaksi Berulang"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  Nama Jadwal Transaksi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sewa Tempat Usaha Bulanan"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Type Switcher */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  Tipe Arus Kas
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType("expense")}
                    className={cn(
                      "py-2 rounded-xl font-bold border transition-all cursor-pointer",
                      formType === "expense"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                        : "bg-[#0F1419] border-slate-800 text-slate-400"
                    )}
                  >
                    Pengeluaran Berulang
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("income")}
                    className={cn(
                      "py-2 rounded-xl font-bold border transition-all cursor-pointer",
                      formType === "income"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-[#0F1419] border-slate-800 text-slate-400"
                    )}
                  >
                    Pemasukan Berulang
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  Nominal Transaksi (Rp) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="0"
                  value={formAmountStr ? Number(formAmountStr.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                  onChange={(e) => setFormAmountStr(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-bold tabular-nums focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Frequency & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Frekuensi Jadwal
                  </label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as RecurringFrequency)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="biweekly">2-Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Kategori Pos
                  </label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account & Next Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formAccountId}
                    onChange={(e) => setFormAccountId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Tanggal Eksekusi Berikutnya
                  </label>
                  <input
                    type="date"
                    required
                    value={formNextDate}
                    onChange={(e) => setFormNextDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  Catatan Transaksi
                </label>
                <input
                  type="text"
                  placeholder="Keterangan kontrak, jatuh tempo, dsb..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Jadwal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
