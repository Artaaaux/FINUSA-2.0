"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  ShieldCheck,
  Laptop,
  GraduationCap,
  Plane,
  Target,
  Calculator,
  Calendar as CalendarIcon,
  Check,
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

// Convert YYYY-MM-DD to DD/MM/YYYY
function isoToDdmmyyyy(iso: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
  }
  return "";
}

// Convert DD/MM/YYYY to YYYY-MM-DD
function ddmmyyyyToIso(ddmmyyyy: string): string {
  if (!ddmmyyyy) return "";
  const cleaned = ddmmyyyy.replace(/[^0-9/]/g, "");
  const parts = cleaned.split("/");
  if (parts.length === 3) {
    const d = parts[0].padStart(2, "0");
    const m = parts[1].padStart(2, "0");
    const y = parts[2];
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const day = parseInt(d, 10);
      const month = parseInt(m, 10);
      const year = parseInt(y, 10);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2024 && year <= 2100) {
        return `${year}-${m}-${d}`;
      }
    }
  }
  return "";
}

// Human readable Indonesian date
function formatIndonesianReadable(iso: string): string {
  if (!iso) return "";
  try {
    const parts = iso.split("-").map(Number);
    if (parts.length !== 3) return "";
    const [y, m, d] = parts;
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function CreateGoalModal({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}: CreateGoalModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SavingsCategory>("darurat");
  const [userType, setUserType] = useState<"Pelajar" | "Umum">("Pelajar");
  const [targetAmount, setTargetAmount] = useState<number>(5000000);
  const [targetDate, setTargetDate] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [priority, setPriority] = useState<GoalPriority>("tinggi");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const hiddenDateInputRef = useRef<HTMLInputElement>(null);

  // Kategori tabungan esensial berdasarkan perencanaan finansial pribadi
  const essentialCategories: {
    key: SavingsCategory;
    label: string;
    description: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
  }[] = [
    {
      key: "darurat",
      label: "Dana Darurat",
      description: "Jaring pengaman saat ada kebutuhan mendesak / tak terduga",
      icon: ShieldCheck,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/15 border-emerald-500/30",
    },
    {
      key: "pendidikan",
      label: "Pendidikan & Belajar",
      description: "Biaya sekolah/kuliah, buku, kursus & sertifikasi keahlian",
      icon: GraduationCap,
      iconColor: "text-cyan-400",
      iconBg: "bg-cyan-500/15 border-cyan-500/30",
    },
    {
      key: "gadget",
      label: "Gadget & Produktivitas",
      description: "Laptop, smartphone & perangkat penunjang belajar/kerja",
      icon: Laptop,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/15 border-blue-500/30",
    },
    {
      key: "liburan",
      label: "Impian & Liburan",
      description: "Traveling, hobi, barang impian, dan apresiasi diri",
      icon: Plane,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/15 border-purple-500/30",
    },
    {
      key: "lainnya",
      label: "Kebutuhan Lainnya",
      description: "Target simpanan fleksibel dan pos tabungan khusus lainnya",
      icon: Target,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/15 border-amber-500/30",
    },
  ];

  // Inisialisasi data form saat modal dibuka
  useEffect(() => {
    if (editingGoal) {
      setName(editingGoal.name);
      setCategory(editingGoal.category);
      setUserType(editingGoal.userType === "Umum" ? "Umum" : "Pelajar");
      setTargetAmount(editingGoal.targetAmount);
      setTargetDate(editingGoal.targetDate);
      setDateInput(isoToDdmmyyyy(editingGoal.targetDate));
      setPriority(editingGoal.priority);
      setDescription(editingGoal.description);
    } else {
      const future = new Date();
      future.setMonth(future.getMonth() + 6);
      const iso = future.toISOString().split("T")[0];
      setName("");
      setCategory("darurat");
      setUserType("Pelajar");
      setTargetAmount(5000000);
      setTargetDate(iso);
      setDateInput(isoToDdmmyyyy(iso));
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

  // Handle typing inside date input with auto-formatting slashes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length > 8) raw = raw.slice(0, 8);

    let formatted = raw;
    if (raw.length > 2 && raw.length <= 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    } else if (raw.length > 4) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4)}`;
    }

    setDateInput(formatted);
    const iso = ddmmyyyyToIso(formatted);
    if (iso) {
      setTargetDate(iso);
    }
  };

  // Quick preset months (+3, +6, +12 months)
  const handlePresetMonths = (months: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${day}`;
    setTargetDate(iso);
    setDateInput(`${day}/${m}/${y}`);
  };

  // Trigger native calendar picker
  const handleCalendarPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value;
    if (iso) {
      setTargetDate(iso);
      setDateInput(isoToDdmmyyyy(iso));
    }
  };

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

    const iso = ddmmyyyyToIso(dateInput) || targetDate;
    if (!iso) {
      setError("Format tanggal batas waktu belum lengkap (gunakan format DD/MM/YYYY)");
      return;
    }

    const catMeta = CATEGORY_METADATA[category] || CATEGORY_METADATA.lainnya;

    const goalData: Partial<SavingsGoal> = {
      name: name.trim(),
      category,
      categoryLabel: catMeta.label,
      userType,
      targetAmount,
      targetDate: iso,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-[#161c28] border border-slate-700/80 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col"
        style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.6)" }}
      >
        {/* Header: Clean title with no '+' icon */}
        <div className="p-5 sm:p-6 bg-[#1a1f2e] border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {editingGoal ? "Ubah Target Tabungan" : "Buat Target Tabungan Baru"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tentukan target nominal dan batas waktu menabung yang realistis
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Nama Pos Tabungan */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nama Pos Tabungan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Dana Darurat, Laptop Belajar, Uang Semester..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1a1f2e] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 2. Kategori Tabungan (User-friendly curated cards) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300">
                Kategori Tabungan <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Pilih pos yang sesuai</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {essentialCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex items-start gap-3 ${
                      isSelected
                        ? "bg-blue-600/15 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        : "bg-[#1a1f2e]/80 border-slate-800 hover:border-slate-700 hover:bg-[#1a1f2e]"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${cat.iconBg} ${cat.iconColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="truncate">{cat.label}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Profil Pengguna & Tingkat Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Profil Pengguna
              </label>
              <div className="flex bg-[#1a1f2e] border border-slate-800 rounded-xl p-1">
                {(["Pelajar", "Umum"] as const).map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setUserType(seg)}
                    className={`flex-1 py-2 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                      userType === seg
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
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
              <div className="flex bg-[#1a1f2e] border border-slate-800 rounded-xl p-1">
                {(["tinggi", "sedang", "rendah"] as const).map((pri) => (
                  <button
                    key={pri}
                    type="button"
                    onClick={() => setPriority(pri)}
                    className={`flex-1 py-2 text-xs rounded-lg font-semibold capitalize transition-all cursor-pointer ${
                      priority === pri
                        ? pri === "tinggi"
                          ? "bg-rose-600 text-white shadow-sm"
                          : pri === "sedang"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {pri}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Target Nominal & Target Batas Waktu (DD/MM/YYYY) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Target Nominal */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Nominal (Rp) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min={100000}
                step={50000}
                required
                value={targetAmount || ""}
                onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
                placeholder="Contoh: 5000000"
                className="w-full px-3.5 py-2.5 bg-[#1a1f2e] border border-slate-700/80 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500 tabular-nums transition-colors"
              />
              <div className="text-[11px] text-teal-400 mt-1.5 font-medium">
                {formatCurrency(targetAmount)}
              </div>
            </div>

            {/* Target Batas Waktu in DD/MM/YYYY */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Target Waktu (DD/MM/YYYY) <span className="text-rose-400">*</span>
                </label>
              </div>

              {/* Input with Calendar Icon Button */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="HH/BB/TTTT (misal: 25/12/2026)"
                  value={dateInput}
                  onChange={handleDateChange}
                  maxLength={10}
                  className="w-full pl-3.5 pr-10 py-2.5 bg-[#1a1f2e] border border-slate-700/80 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />

                {/* Calendar Icon Button with hidden picker */}
                <button
                  type="button"
                  onClick={() => {
                    if (hiddenDateInputRef.current) {
                      if ("showPicker" in HTMLInputElement.prototype) {
                        hiddenDateInputRef.current.showPicker();
                      } else {
                        hiddenDateInputRef.current.focus();
                      }
                    }
                  }}
                  className="absolute right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Buka Kalender"
                >
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                </button>

                {/* Hidden native date input for picker support */}
                <input
                  ref={hiddenDateInputRef}
                  type="date"
                  value={targetDate}
                  onChange={handleCalendarPickerChange}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>

              {/* Quick Deadline Presets */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-500">Cepat:</span>
                {[
                  { label: "+3 Bulan", months: 3 },
                  { label: "+6 Bulan", months: 6 },
                  { label: "+1 Tahun", months: 12 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePresetMonths(p.months)}
                    className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-[10px] font-medium text-slate-300 transition-colors cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Clear Indonesian date feedback */}
              <div className="text-[11px] mt-1.5 leading-snug">
                {targetDate && daysLeft >= 0 ? (
                  <span className="text-teal-400 font-medium">
                    Batas: {formatIndonesianReadable(targetDate)} ({daysLeft} hari lagi)
                  </span>
                ) : (
                  <span className="text-slate-500">
                    Ketik tanggal dalam format Hari/Bulan/Tahun
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 5. Real-Time Calculation Widget */}
          {targetAmount > 0 && targetDate && daysLeft > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <Calculator className="w-4 h-4" />
                <span>Simulasi Rencana Nabung Otomatis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Untuk mencapai <strong>{formatCurrency(targetAmount)}</strong> dalam{" "}
                <strong>{daysLeft} hari</strong>, Anda disarankan menyisihkan:
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#161c28] border border-slate-800 text-xs">
                <span className="text-slate-400 font-medium">Rekomendasi Setoran:</span>
                <strong className="text-teal-300 font-extrabold text-sm tabular-nums">
                  {formatCurrency(monthlyRec)} <span className="text-xs font-normal text-slate-400">/bulan</span>
                </strong>
              </div>
            </div>
          )}

          {/* 6. Deskripsi / Catatan (Opsional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Catatan & Deskripsi Pos (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Sisihkan uang saku tiap pekan untuk persiapan semester baru..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#1a1f2e] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer active:scale-95"
            >
              {editingGoal ? "Simpan Perubahan" : "Buat Target Tabungan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
