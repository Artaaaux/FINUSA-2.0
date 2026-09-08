"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Building,
  Tag,
  Paperclip,
  Trash2,
  Check,
} from "lucide-react";
import {
  PembukuanTransaction,
  TransactionType,
  TransactionStatus,
  CategoryItem,
  AttachmentItem,
} from "../types";
import { AccountOption } from "../constants";
import { cn } from "@/shared/lib/utils";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PembukuanTransaction>) => void;
  categories: CategoryItem[];
  accounts: AccountOption[];
  editingTransaction?: PembukuanTransaction | null;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  accounts,
  editingTransaction,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amountStr, setAmountStr] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [merchant, setMerchant] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [accountId, setAccountId] = useState<string>("");
  const [status, setStatus] = useState<TransactionStatus>("completed");
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>("");
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  // Initialize or reset form when opened or editing
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmountStr(String(editingTransaction.amount));
      setDate(editingTransaction.date);
      setTime(editingTransaction.time || "12:00");
      setDescription(editingTransaction.description);
      setMerchant(editingTransaction.merchant || "");
      setCategoryId(editingTransaction.categoryId);
      setAccountId(editingTransaction.accountId);
      setStatus(editingTransaction.status);
      setTags(editingTransaction.tags || []);
      setNotes(editingTransaction.notes || "");
      setAttachments(editingTransaction.attachments || []);
    } else {
      const now = new Date();
      setType("expense");
      setAmountStr("");
      setDate(now.toISOString().split("T")[0]);
      setTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
      setDescription("");
      setMerchant("");
      const initialCat = categories.find((c) => c.type === "expense")?.id || categories[0]?.id || "";
      setCategoryId(initialCat);
      setAccountId(accounts[0]?.id || "");
      setStatus("completed");
      setTags([]);
      setNotes("");
      setAttachments([]);
    }
  }, [editingTransaction, isOpen, categories, accounts]);

  const availableCategories = React.useMemo(() => {
    const filtered = categories.filter((c) => c.type === (type === "income" ? "income" : "expense"));
    const seen = new Set<string>();
    return filtered.filter((c) => {
      const lower = c.name.trim().toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
  }, [categories, type]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const clean = tagInput.trim().replace(/,/g, "");
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newAtt: AttachmentItem = {
      id: `att-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };
    setAttachments([...attachments, newAtt]);
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments(attachments.filter((a) => a.id !== attId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr.replace(/[^0-9]/g, ""));
    if (!parsedAmount || parsedAmount <= 0) return;

    const chosenCat = categories.find((c) => c.id === categoryId) || availableCategories[0] || { id: "", name: type === "income" ? "Pemasukan" : "Pengeluaran" };
    const chosenAcc = accounts.find((a) => a.id === accountId) || accounts[0] || { id: "", name: "Rekening Kas" };

    onSubmit({
      id: editingTransaction?.id,
      type,
      amount: parsedAmount,
      date,
      time,
      description: description.trim() || chosenCat.name,
      merchant: merchant.trim(),
      categoryId: chosenCat.id,
      categoryName: chosenCat.name,
      accountId: chosenAcc.id,
      accountName: chosenAcc.name,
      status,
      tags,
      notes: notes.trim(),
      attachments,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/60 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-2xl max-h-[92vh] bg-[#161c28] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121721]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingTransaction ? "Edit Transaksi" : "Catat Transaksi Baru"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Masukkan rincian buku kas secara lengkap dan terstruktur
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Tipe Transaksi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setType("expense");
                      const defaultCat = categories.find((c) => c.type === "expense")?.id;
                      if (defaultCat) setCategoryId(defaultCat);
                    }}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold border transition-all cursor-pointer",
                      type === "expense"
                        ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-xs"
                        : "bg-[#0F1419] border-slate-800 text-slate-400 hover:text-white"
                    )}
                  >
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                    <span>Pengeluaran</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setType("income");
                      const defaultCat = categories.find((c) => c.type === "income")?.id;
                      if (defaultCat) setCategoryId(defaultCat);
                    }}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold border transition-all cursor-pointer",
                      type === "income"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs"
                        : "bg-[#0F1419] border-slate-800 text-slate-400 hover:text-white"
                    )}
                  >
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    <span>Pemasukan</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Nominal Transaksi (Rp) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="0"
                  value={amountStr ? Number(amountStr.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setAmountStr(raw);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-extrabold text-lg tabular-nums focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Tanggal Transaksi
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Waktu / Jam
                  </label>
                  <input
                    type="text"
                    placeholder="14:30"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Accounts & Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Metode Pembayaran
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    Kategori Pos
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description & Merchant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Deskripsi Transaksi <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Belanja Bahan Baku Dapur"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Nama Toko / Pihak Terkait
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Toko Grosir Berkah"
                    value={merchant}
                    onChange={(e) => setMerchant(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Status Pembayaran
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus("completed")}
                      className={cn(
                        "flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer text-center",
                        status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-[#0F1419] border-slate-800 text-slate-400"
                      )}
                    >
                      Selesai (Lunas)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("pending")}
                      className={cn(
                        "flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer text-center",
                        status === "pending"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-[#0F1419] border-slate-800 text-slate-400"
                      )}
                    >
                      Pending (Invoice)
                    </button>
                  </div>
                </div>

                {/* Tags input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Label / Tag (Tekan Enter)
                  </label>
                  <div className="p-2 rounded-xl bg-[#0F1419] border border-slate-700 flex items-center gap-1.5 flex-wrap min-h-[42px]">
                    {tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={tags.length === 0 ? "Ketik tag lalu Enter..." : ""}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="flex-1 bg-transparent text-white focus:outline-none min-w-[100px]"
                    />
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                  Lampiran Bukti Struk / Nota
                </label>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F1419] border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold cursor-pointer transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Pilih Berkas / Foto</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">
                    JPG, PNG, atau PDF (Maks 5MB)
                  </span>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#0F1419] border border-slate-800 text-xs"
                      >
                        <span className="text-slate-300 font-medium truncate max-w-xs">
                          {att.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Tambahkan catatan khusus untuk rekonsiliasi atau audit..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={!amountStr || !description}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingTransaction ? "Simpan Perubahan" : "Simpan Transaksi"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
