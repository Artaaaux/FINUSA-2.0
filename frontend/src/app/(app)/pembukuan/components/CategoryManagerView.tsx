"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Tags,
  Store,
  Utensils,
  Briefcase,
  Wallet,
  TrendingUp,
  RotateCcw,
  Package,
  Building2,
  Users,
  Zap,
  Truck,
  Megaphone,
  Coffee,
  FileSpreadsheet,
  Wrench,
  Tag,
  ShoppingBag,
  Home,
  X,
  Check,
} from "lucide-react";
import { CategoryItem, PembukuanTransaction } from "../types";
import { formatCurrency } from "../constants";
import { cn } from "@/shared/lib/utils";

const AVAILABLE_ICONS: { name: string; icon: React.ElementType }[] = [
  { name: "Wallet", icon: Wallet },
  { name: "Briefcase", icon: Briefcase },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Utensils", icon: Utensils },
  { name: "Home", icon: Home },
  { name: "Store", icon: Store },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "RotateCcw", icon: RotateCcw },
  { name: "Package", icon: Package },
  { name: "Building2", icon: Building2 },
  { name: "Users", icon: Users },
  { name: "Zap", icon: Zap },
  { name: "Truck", icon: Truck },
  { name: "Megaphone", icon: Megaphone },
  { name: "Coffee", icon: Coffee },
  { name: "FileSpreadsheet", icon: FileSpreadsheet },
  { name: "Wrench", icon: Wrench },
  { name: "Tag", icon: Tag },
];

const COLOR_PRESETS = [
  { label: "Biru", value: "text-blue-400 bg-blue-500/10 border-blue-500/25", dot: "bg-blue-400" },
  { label: "Teal", value: "text-teal-400 bg-teal-500/10 border-teal-500/25", dot: "bg-teal-400" },
  { label: "Hijau", value: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25", dot: "bg-emerald-400" },
  { label: "Amber", value: "text-amber-400 bg-amber-500/10 border-amber-500/25", dot: "bg-amber-400" },
  { label: "Merah", value: "text-rose-400 bg-rose-500/10 border-rose-500/25", dot: "bg-rose-400" },
  { label: "Ungu", value: "text-purple-400 bg-purple-500/10 border-purple-500/25", dot: "bg-purple-400" },
  { label: "Sky", value: "text-sky-400 bg-sky-500/10 border-sky-500/25", dot: "bg-sky-400" },
  { label: "Pink", value: "text-pink-400 bg-pink-500/10 border-pink-500/25", dot: "bg-pink-400" },
];

interface CategoryManagerViewProps {
  categories: CategoryItem[];
  transactions: PembukuanTransaction[];
  onAddCategory: (cat: Partial<CategoryItem>) => void;
  onUpdateCategory: (id: string, cat: Partial<CategoryItem>) => void;
  onDeleteCategory: (id: string) => void;
}

export default function CategoryManagerView({
  categories,
  transactions,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerViewProps) {
  const [activeType, setActiveType] = useState<"all" | "income" | "expense">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<"income" | "expense">("expense");
  const [formIcon, setFormIcon] = useState("Tag");
  const [formColor, setFormColor] = useState(COLOR_PRESETS[0].value);
  const [formDesc, setFormDesc] = useState("");

  const filteredCategories = categories.filter((c) => {
    if (activeType !== "all" && c.type !== activeType) return false;
    return true;
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormType("expense");
    setFormIcon("Tag");
    setFormColor(COLOR_PRESETS[0].value);
    setFormDesc("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormType(cat.type);
    setFormIcon(cat.iconName);
    setFormColor(cat.colorClass);
    setFormDesc(cat.description || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, {
        name: formName.trim(),
        type: formType,
        iconName: formIcon,
        colorClass: formColor,
        description: formDesc.trim(),
      });
    } else {
      onAddCategory({
        name: formName.trim(),
        type: formType,
        iconName: formIcon,
        colorClass: formColor,
        description: formDesc.trim(),
      });
    }
    setIsModalOpen(false);
  };

  // Compute category statistics
  const getCategoryStats = (catId: string) => {
    const matchedTx = transactions.filter((t) => t.categoryId === catId);
    const totalAmount = matchedTx.reduce((sum, t) => sum + t.amount, 0);
    return {
      count: matchedTx.length,
      totalAmount,
    };
  };

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#161c28] border border-slate-800 shadow-sm">
        <div className="flex items-center gap-1 bg-[#0F1419] p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveType("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeType === "all"
                ? "bg-slate-700 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            Semua Pos ({categories.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveType("income")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeType === "income"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            Pemasukan ({categories.filter((c) => c.type === "income").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveType("expense")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              activeType === "expense"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            Pengeluaran ({categories.filter((c) => c.type === "expense").length})
          </button>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pos Kategori</span>
        </button>
      </div>

      {/* Grid of Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredCategories.map((cat) => {
          const stats = getCategoryStats(cat.id);
          const iconObj = AVAILABLE_ICONS.find((i) => i.name === cat.iconName) || AVAILABLE_ICONS[0];
          const Icon = iconObj.icon;

          return (
            <div
              key={cat.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#161c28] border border-slate-800 hover:border-slate-700 shadow-sm flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", cat.colorClass)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {cat.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Kategori"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {!cat.isDefault && (
                      <button
                        type="button"
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {cat.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Stats Bar */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{stats.count} Transaksi</span>
                <span className="font-bold text-white tabular-nums">
                  {formatCurrency(stats.totalAmount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative w-full max-w-md bg-[#161c28] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#121721]">
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingCategory ? "Edit Kategori Pos" : "Tambah Kategori Pos Baru"}
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
              {/* Category Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  Nama Kategori <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Logistik Gudang"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Type */}
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
                    Pengeluaran
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
                    Pemasukan
                  </button>
                </div>
              </div>

              {/* Color Preset Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Warna Tema
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormColor(preset.value)}
                      className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer",
                        formColor === preset.value
                          ? "border-white ring-2 ring-blue-500/50"
                          : "border-slate-800 hover:border-slate-600"
                      )}
                    >
                      <span className={cn("w-4 h-4 rounded-full", preset.dot)} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Pilih Ikon Lucide
                </label>
                <div className="grid grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1 bg-[#0F1419] rounded-xl border border-slate-800">
                  {AVAILABLE_ICONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formIcon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormIcon(item.name)}
                        className={cn(
                          "h-10 rounded-lg flex items-center justify-center border transition-all cursor-pointer",
                          isSelected
                            ? "bg-blue-600/20 border-blue-500 text-white"
                            : "bg-[#161c28] border-slate-800 text-slate-400 hover:text-white"
                        )}
                        title={item.name}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">
                  Deskripsi Pos Kategori
                </label>
                <input
                  type="text"
                  placeholder="Keterangan alokasi pengeluaran/pemasukan..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F1419] border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
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
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Kategori</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
