"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  ShieldCheck,
  Store,
  Laptop,
  GraduationCap,
  Home,
  Car,
  Plane,
  Target,
  Calculator,
} from "lucide-react";
import { SavingsGoal, SavingsCategory, GoalPriority } from "../types";
import { CATEGORY_METADATA } from "../constants";
import { formatCurrency, calculateMonthlyRecommendation, calculateDaysRemaining } from "../utils";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: Partial<SavingsGoal>) => void;
  editingGoal?: SavingsGoal | null;
}

export default function CreateGoalModal({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}: CreateGoalModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SavingsCategory>("darurat");
  const [userType, setUserType] = useState<"UMKM" | "Mahasiswa" | "Umum">("UMKM");
  const [targetAmount, setTargetAmount] = useState<number>(10000000);
  const [targetDate, setTargetDate] = useState("");
  const [priority, setPriority] = useState<GoalPriority>("tinggi");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Default target date 6 months from now
  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setCategory(editingGoal.category);
      setUserType(editingGoal.userType);
      setTargetAmount(editingGoal.targetAmount);
      setTargetDate(editingGoal.targetDate);
      setPriority(editingGoal.priority);
      setDescription(editingGoal.description);
    } else {
      const future = new Date();
      future.setMonth(future.getMonth() + 6);
      const formattedDate = future.toISOString().split("T")[0];
      setName("");
      setCategory("darurat");
      setUserType("UMKM");
      setTargetAmount(15000000);
      setTargetDate(formattedDate);
      setPriority("tinggi");
      setDescription("");
    }
    setError("");
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const daysLeft = targetDate ? calculateDaysRemaining(targetDate) : 0;
  const monthlyRec =
    targetDate && targetAmount > 0
      ? calculateMonthlyRecommendation(editingGoal?.currentAmount || 0, targetAmount, targetDate)
      : 0;

  const categoryOptions: { key: SavingsCategory; label: string; icon: React.ElementType }[] = [
    { key: "darurat", label: "Dana Darurat", icon: ShieldCheck },
    { key: "usaha", label: "Bisnis & UMKM", icon: Store },
    { key: "gadget", label: "Gadget & Kerja", icon: Laptop },
    { key: "pendidikan", label: "Pendidikan", icon: GraduationCap },
    { key: "properti", label: "Properti", icon: Home },
    { key: "kendaraan", label: "Kendaraan", icon: Car },
    { key: "liburan", label: "Ibadah & Liburan", icon: Plane },
    { key: "lainnya", label: "Lainnya", icon: Target },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 3) {
      setError("Nama target tabungan minimal 3 karakter");
      return;
    }
    if (!targetAmount || targetAmount < 100000) {
      setError("Target nominal minimal Rp 100.000");
      return;
    }
    if (!targetDate) {
      setError("Pilih target batas waktu (deadline)");
      return;
    }

    const catMeta = CATEGORY_METADATA[category] || CATEGORY_METADATA.lainnya;

    const goalData: Partial<SavingsGoal> = {
      name: name.trim(),
      category,
      categoryLabel: catMeta.label,
      userType,
      targetAmount,
      targetDate,
      priority,
      description: description.trim() || `Pos tabungan untuk keperluan ${catMeta.label}.`,
      iconName: catMeta.iconName,
      accentColor: catMeta.colorClass,
      gradient: catMeta.gradient,
      badgeClass: catMeta.badgeClass,
      iconContainerClass: catMeta.bgClass,
      ringStrokeColor: catMeta.ringStrokeColor,
    };

    onSubmit(goalData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-[#161c28] border border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1a1f2e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {editingGoal ? "Ubah Target Tabungan" : "Buat Target Tabungan Baru"}
              </h2>
              <p className="text-xs text-slate-400">
                Tentukan target nominal dan simulasi jadwal menabung yang achievable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* 1. Nama Target */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Pos Tabungan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Dana Darurat Toko, Laptop Skripsi..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1a1f2e] border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 2. Kategori */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Kategori Tabungan <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categoryOptions.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm"
                        : "bg-[#1a1f2e] border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate max-w-full text-[11px]">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Segment Pengguna & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Profil Pengguna
              </label>
              <div className="flex bg-[#1a1f2e] border border-slate-700 rounded-xl p-1">
                {(["UMKM", "Mahasiswa", "Umum"] as const).map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setUserType(seg)}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                      userType === seg ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {seg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tingkat Prioritas
              </label>
              <div className="flex bg-[#1a1f2e] border border-slate-700 rounded-xl p-1">
                {(["tinggi", "sedang", "rendah"] as const).map((pri) => (
                  <button
                    key={pri}
                    type="button"
                    onClick={() => setPriority(pri)}
                    className={`flex-1 py-1.5 text-xs rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                      priority === pri
                        ? pri === "tinggi"
                          ? "bg-rose-600 text-white"
                          : pri === "sedang"
                          ? "bg-amber-600 text-white"
                          : "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Target Nominal & Target Tanggal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Nominal (Rp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={100000}
                step={50000}
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-[#1a1f2e] border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500 tabular-nums transition-colors"
              />
              <div className="text-[11px] text-slate-400 mt-1 font-medium">
                {formatCurrency(targetAmount)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Batas Waktu <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#1a1f2e] border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {daysLeft > 0 ? `${daysLeft} hari lagi` : "Batas waktu"}
              </div>
            </div>
          </div>

          {/* 5. Real-Time Calculation Widget */}
          {targetAmount > 0 && targetDate && (
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <Calculator className="w-4 h-4" />
                <span>Simulasi Rencana Nabung Otomatis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Untuk mencapai <strong>{formatCurrency(targetAmount)}</strong> dalam{" "}
                <strong>{daysLeft} hari</strong>, Anda disarankan menyisihkan:
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161c28] border border-slate-800 text-xs">
                <span className="text-slate-400">Rekomendasi Setoran:</span>
                <strong className="text-teal-300 font-extrabold text-sm tabular-nums">
                  {formatCurrency(monthlyRec)} <span className="text-xs font-normal text-slate-400">/bulan</span>
                </strong>
              </div>
            </div>
          )}

          {/* 6. Deskripsi / Catatan */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Catatan & Deskripsi Pos (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Alokasi 10% omzet tiap akhir pekan untuk cadangan mesin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#1a1f2e] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
            >
              {editingGoal ? "Simpan Perubahan" : "Buat Target Tabungan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
