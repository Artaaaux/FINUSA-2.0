"use client";

import React from "react";
import {
  X,
  Award,
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  Flame,
  Coins,
  Layers,
} from "lucide-react";
import { SavingsAchievement } from "../types";

interface AchievementsShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: SavingsAchievement[];
}

function getAchievementIcon(iconName: string) {
  switch (iconName) {
    case "Sparkles":
      return <Sparkles className="w-5 h-5 text-amber-400" />;
    case "Award":
      return <Award className="w-5 h-5 text-blue-400" />;
    case "Trophy":
      return <Trophy className="w-5 h-5 text-yellow-400" />;
    case "Flame":
      return <Flame className="w-5 h-5 text-rose-400" />;
    case "Coins":
      return <Coins className="w-5 h-5 text-emerald-400" />;
    case "Layers":
      return <Layers className="w-5 h-5 text-purple-400" />;
    default:
      return <Award className="w-5 h-5 text-slate-400" />;
  }
}

export default function AchievementsShowcase({
  isOpen,
  onClose,
  achievements,
}: AchievementsShowcaseProps) {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#161c28] border border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#1a1f2e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Lencana & Pencapaian Menabung
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {unlockedCount} / {achievements.length} Terbuka
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Apresiasi atas disiplin finansial dan komitmen mencapai target impian
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

        {/* Badges Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                ach.unlocked
                  ? "bg-[#1a1f2e] border-slate-700/90 shadow-sm"
                  : "bg-slate-900/60 border-slate-800/80 opacity-60"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${
                  ach.unlocked
                    ? "bg-[#1f2534] border-slate-700"
                    : "bg-slate-950 border-slate-800 text-slate-600"
                }`}
              >
                {ach.unlocked ? getAchievementIcon(ach.icon) : <Lock className="w-4 h-4 text-slate-600" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {ach.category}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold ${
                      ach.tier === "Platinum"
                        ? "text-teal-400"
                        : ach.tier === "Gold"
                        ? "text-yellow-400"
                        : ach.tier === "Silver"
                        ? "text-slate-300"
                        : "text-amber-400"
                    }`}
                  >
                    {ach.tier}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white leading-snug">{ach.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {ach.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                  {ach.unlocked ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Diraih pada {ach.unlockedDate}
                    </span>
                  ) : (
                    <span className="text-slate-500">Belum Terbuka</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#1a1f2e] border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
