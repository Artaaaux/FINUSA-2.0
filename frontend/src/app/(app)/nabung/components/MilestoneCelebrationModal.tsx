"use client";

import React, { useState } from "react";
import {
  Award,
  Trophy,
  Check,
  X,
  Share2,
} from "lucide-react";
import { formatCurrency } from "../utils";

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalName: string;
  milestoneLevel: number;
  currentAmount: number;
  targetAmount: number;
}

export default function MilestoneCelebrationModal({
  isOpen,
  onClose,
  goalName,
  milestoneLevel,
  currentAmount,
  targetAmount,
}: MilestoneCelebrationModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const milestoneInfo = {
    25: {
      badge: "Lencana Perunggu",
      title: "Pondasi Awal Kokoh!",
      desc: "Langkah pertama yang luar biasa. Anda telah mengumpulkan 25% dari total target.",
      color: "from-amber-600 to-amber-400",
      textColor: "text-amber-300",
    },
    50: {
      badge: "Lencana Perak",
      title: "Separuh Jalan Tercapai!",
      desc: "Konsistensi Anda terbukti! 50% target kini sudah aman di tabungan.",
      color: "from-slate-400 to-slate-200",
      textColor: "text-slate-200",
    },
    75: {
      badge: "Lencana Emas",
      title: "Mendekati Garis Akhir!",
      desc: "Tinggal sedikit lagi! 75% target telah terkumpul dan impian semakin nyata.",
      color: "from-yellow-500 to-amber-300",
      textColor: "text-yellow-300",
    },
    100: {
      badge: "Lencana Platinum",
      title: "Target 100% Tercapai Penuh!",
      desc: "Selamat atas dedikasi dan kedisiplinan Anda. Target finansial ini telah tuntas sempurna!",
      color: "from-teal-400 via-blue-500 to-purple-500",
      textColor: "text-emerald-300",
    },
  }[milestoneLevel as 25 | 50 | 75 | 100] || {
    badge: "Lencana Prestasi",
    title: "Pencapaian Baru!",
    desc: `Anda telah mencapai ${milestoneLevel}% dari target tabungan.`,
    color: "from-blue-500 to-indigo-500",
    textColor: "text-blue-300",
  };

  const handleCopyShare = () => {
    const text = `Alhamdulillah! Tabungan "${goalName}" saya di FINUSA telah mencapai milestone ${milestoneLevel}% (${formatCurrency(
      currentAmount
    )} / ${formatCurrency(targetAmount)})! 🎯📈`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#161c28] border border-purple-500/30 p-6 sm:p-8 text-center shadow-2xl overflow-hidden my-auto"
        style={{
          boxShadow: "0 0 50px rgba(168,85,247,0.25), 0 20px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Ambient Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Trophy / Badge Animation */}
        <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${milestoneInfo.color} flex items-center justify-center text-slate-950 shadow-xl border border-white/30 transform hover:scale-105 transition-transform`}
          >
            {milestoneLevel >= 100 ? (
              <Trophy className="w-10 h-10 text-white" />
            ) : (
              <Award className="w-10 h-10 text-slate-900" />
            )}
          </div>
          <span className="absolute -bottom-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0F1419] text-purple-300 border border-purple-500/30">
            {milestoneLevel}%
          </span>
        </div>

        {/* Titles */}
        <span className={`text-xs font-bold uppercase tracking-wider ${milestoneInfo.textColor}`}>
          {milestoneInfo.badge}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1 mb-2 tracking-tight">
          {milestoneInfo.title}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          {milestoneInfo.desc}
        </p>

        {/* Goal Stats Card */}
        <div className="p-4 rounded-2xl bg-[#1a1f2e] border border-slate-800 text-left space-y-2 mb-6">
          <div className="text-xs font-bold text-white truncate">{goalName}</div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-slate-400">Terkumpul:</span>
            <strong className="text-emerald-400 font-extrabold tabular-nums">
              {formatCurrency(currentAmount)}
            </strong>
          </div>
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-slate-400">Target Akhir:</span>
            <span className="text-slate-300 font-semibold tabular-nums">
              {formatCurrency(targetAmount)}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-teal-400 to-emerald-400"
              style={{ width: `${Math.min(100, milestoneLevel)}%` }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleCopyShare}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-200 bg-[#1f2534] hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Teks Ringkasan Disalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>Salin Teks Capaian untuk Dibagikan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
          >
            Lanjutkan Menabung
          </button>
        </div>
      </div>
    </div>
  );
}
