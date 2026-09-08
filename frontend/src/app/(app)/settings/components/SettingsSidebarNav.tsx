"use client";

import React from "react";
import { 
  User, 
  ShieldCheck, 
  Lock, 
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { SettingsSectionId } from "../types";

interface SettingsSidebarNavProps {
  activeSection: SettingsSectionId;
  onSelectSection: (section: SettingsSectionId) => void;
}

export default function SettingsSidebarNav({
  activeSection,
  onSelectSection,
}: SettingsSidebarNavProps) {
  const sections = [
    {
      id: "profile" as SettingsSectionId,
      label: "Profil & Identitas",
      description: "Nama, email & avatar",
      icon: User,
      color: "text-blue-400",
    },
    {
      id: "security" as SettingsSectionId,
      label: "Akun & Keamanan",
      description: "Kata sandi akun",
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      id: "privacy" as SettingsSectionId,
      label: "Data & Pencadangan",
      description: "Cadangan & hapus data",
      icon: Lock,
      color: "text-rose-400",
    },
    {
      id: "help_about" as SettingsSectionId,
      label: "Bantuan & Tentang",
      description: "FAQ, pintasan & versi",
      icon: HelpCircle,
      color: "text-sky-400",
    },
  ];

  return (
    <nav className="w-full lg:w-64 shrink-0">
      {/* Desktop Vertical Menu */}
      <div className="hidden lg:flex flex-col gap-1.5 p-2 rounded-2xl bg-[#1a1f2e]/70 border border-slate-800/80 sticky top-24 shadow-md">
        {sections.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600/15 border border-blue-500/30 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? "bg-blue-600 text-white shadow-sm" : "bg-slate-800/80 " + item.color
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="text-xs truncate">{item.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.description}</div>
                </div>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-600"}`} />
            </button>
          );
        })}
      </div>

      {/* Mobile & Tablet Horizontal Scroll Bar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {sections.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-400/40 shadow-sm"
                  : "bg-[#1a1f2e] text-slate-400 hover:text-slate-200 border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
