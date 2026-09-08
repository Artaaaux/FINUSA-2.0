"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Store,
  Tag,
  CreditCard,
  ZoomIn,
  X,
  Check,
  RotateCcw,
  Receipt,
  Utensils,
  ShoppingCart,
  Car,
  Zap,
  HeartPulse,
  Clapperboard,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";
import type { ExtractedReceiptData, ReceiptItem } from "@/shared/lib/receipt/types";
import { FINUSA_CATEGORIES } from "@/shared/lib/receipt/categorize";
import { formatCurrency } from "@/app/(app)/home/constants";
import { cn } from "@/shared/lib/utils";

interface ConfirmScreenProps {
  imageSrc: string | null;
  data: ExtractedReceiptData;
  isSaving: boolean;
  onUpdateData: (partial: Partial<ExtractedReceiptData>) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, partial: Partial<ReceiptItem>) => void;
  onSave: () => void;
  onRetake: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Utensils,
  ShoppingCart,
  Car,
  Zap,
  HeartPulse,
  Clapperboard,
  Briefcase,
  MoreHorizontal,
};

export default function ConfirmScreen({
  imageSrc,
  data,
  isSaving,
  onUpdateData,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onSave,
  onRetake,
}: ConfirmScreenProps) {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"form" | "image">("form");

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#161c28] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Konfirmasi Data Struk
              {data.isSimulated && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Demo OCR
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">
              Periksa dan sesuaikan rincian sebelum disimpan ke pengeluaran
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Akurasi {data.confidence}%</span>
          </div>

          <button
            onClick={onRetake}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Pindai Ulang
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="lg:hidden flex rounded-xl bg-slate-900/60 p-1 border border-slate-800">
        <button
          onClick={() => setMobileTab("form")}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
            mobileTab === "form"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          Form Data Pengeluaran
        </button>
        <button
          onClick={() => setMobileTab("image")}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
            mobileTab === "image"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          Lihat Foto Struk
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Preview (Desktop sticky, Mobile tab) */}
        <div
          className={cn(
            "lg:col-span-4 lg:sticky lg:top-20 space-y-4",
            mobileTab === "image" ? "block" : "hidden lg:block"
          )}
        >
          <div className="rounded-2xl bg-[#0F1419] border border-slate-800 overflow-hidden shadow-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Foto Struk Asli
              </span>
              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                Perbesar
              </button>
            </div>

            <div
              onClick={() => setIsZoomModalOpen(true)}
              className="relative w-full aspect-[3/4] max-h-[420px] rounded-xl overflow-hidden bg-black/60 border border-slate-700/60 cursor-pointer group flex items-center justify-center"
            >
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt="Struk Belanja"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-center p-4 text-slate-500">
                  <Receipt className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Foto tidak tersedia</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold">
                <ZoomIn className="w-4 h-4" /> Klik untuk perbesar
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Periksa kecocokan data dengan teks pada foto
            </p>
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <div
          className={cn(
            "lg:col-span-8 space-y-5",
            mobileTab === "form" ? "block" : "hidden lg:block"
          )}
        >
          {/* Card: Basic Information */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#161c28] border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-400" />
              Informasi Toko & Waktu
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Merchant Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-slate-300">
                  Nama Toko / Merchant
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.merchant}
                    onChange={(e) => onUpdateData({ merchant: e.target.value })}
                    placeholder="Contoh: Indomaret Point"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  value={data.date}
                  onChange={(e) => onUpdateData({ date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Waktu / Jam
                </label>
                <input
                  type="text"
                  value={data.time || ""}
                  onChange={(e) => onUpdateData({ time: e.target.value })}
                  placeholder="14:30"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Kategori Pengeluaran
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FINUSA_CATEGORIES.map((cat) => {
                  const IconComp = categoryIcons[cat.iconName] || MoreHorizontal;
                  const isSelected =
                    data.category.toLowerCase() === cat.name.toLowerCase() ||
                    data.category.toLowerCase() === cat.id.toLowerCase();

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onUpdateData({ category: cat.name })}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer text-left",
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 text-white font-bold shadow-sm"
                          : "bg-[#0F172A]/80 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600"
                      )}
                    >
                      <IconComp
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          isSelected ? "text-blue-400" : "text-slate-400"
                        )}
                      />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: Itemized List */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#161c28] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                Rincian Barang / Layanan ({data.items.length})
              </h2>

              <button
                type="button"
                onClick={onAddItem}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 hover:bg-blue-500/25 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Item
              </button>
            </div>

            {/* Items Table / List */}
            <div className="space-y-2.5">
              {data.items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-[#0F172A] border border-slate-800"
                >
                  {/* Qty */}
                  <div className="w-16 flex-shrink-0">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateItem(item.id, {
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold text-center focus:outline-none focus:border-blue-500"
                      title="Jumlah"
                    />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        onUpdateItem(item.id, { name: e.target.value })
                      }
                      placeholder="Nama produk"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Total Price */}
                  <div className="w-32 flex-shrink-0">
                    <input
                      type="number"
                      value={item.totalPrice}
                      onChange={(e) =>
                        onUpdateItem(item.id, {
                          totalPrice: parseFloat(e.target.value) || 0,
                          price:
                            (parseFloat(e.target.value) || 0) /
                            (item.quantity || 1),
                        })
                      }
                      placeholder="Harga Total"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-bold text-right tabular-nums focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer flex-shrink-0"
                    aria-label="Hapus item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {data.items.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  Belum ada item. Klik &ldquo;Tambah Item&rdquo; untuk memasukkan rincian.
                </div>
              )}
            </div>
          </div>

          {/* Card: Calculations & Grand Total */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#161c28] border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              Total & Pembayaran
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Metode Pembayaran
                </label>
                <select
                  value={data.paymentMethod}
                  onChange={(e) => onUpdateData({ paymentMethod: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="QRIS">QRIS</option>
                  <option value="Tunai">Tunai / Cash</option>
                  <option value="Kartu Debit">Kartu Debit</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                  <option value="GoPay">GoPay</option>
                  <option value="OVO">OVO</option>
                  <option value="ShopeePay">ShopeePay</option>
                  <option value="Transfer / E-Wallet">Transfer / E-Wallet</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* Subtotal */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Subtotal (Rp)
                </label>
                <input
                  type="number"
                  value={data.subtotal}
                  onChange={(e) =>
                    onUpdateData({ subtotal: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-semibold tabular-nums focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Tax / PPN */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Pajak / PPN (Rp)
                </label>
                <input
                  type="number"
                  value={data.tax}
                  onChange={(e) =>
                    onUpdateData({ tax: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-semibold tabular-nums focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Discount */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Diskon / Potongan (Rp)
                </label>
                <input
                  type="number"
                  value={data.discount}
                  onChange={(e) =>
                    onUpdateData({ discount: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-slate-700 text-white text-sm font-semibold tabular-nums focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Grand Total Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#0F172A] p-4 rounded-xl">
              <div>
                <span className="text-xs text-slate-400 font-medium">
                  Grand Total Pengeluaran
                </span>
                <p className="text-2xl font-extrabold text-white tracking-tight tabular-nums">
                  {formatCurrency(data.total)}
                </p>
              </div>

              <div className="w-full sm:w-auto">
                <input
                  type="number"
                  value={data.total}
                  onChange={(e) =>
                    onUpdateData({ total: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full sm:w-44 px-3.5 py-2 rounded-xl bg-slate-900 border border-blue-500/50 text-emerald-400 text-base font-bold tabular-nums text-right focus:outline-none focus:border-blue-400"
                  title="Ubah Total"
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-5 rounded-2xl bg-[#161c28] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onRetake}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Batal & Foto Ulang
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan ke Pembukuan...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Simpan ke Pengeluaran</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Zoom Foto Struk */}
      <AnimatePresence>
        {isZoomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl max-h-[90vh] w-full bg-[#0F1419] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#161c28]">
                <h3 className="text-sm font-bold text-white">
                  Detail Foto Struk Belanja
                </h3>
                <button
                  onClick={() => setIsZoomModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black">
                {imageSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageSrc}
                    alt="Zoom Struk"
                    className="w-auto h-auto max-h-[75vh] object-contain rounded-lg"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
