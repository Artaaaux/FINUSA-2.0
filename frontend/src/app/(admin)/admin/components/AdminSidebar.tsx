"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  Receipt, 
  PiggyBank, 
  BarChart3, 
  Settings, 
  KeyRound,
  Sparkles,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export type AdminNavSectionId = 
  | "dashboard"
  | "users"
  | "transactions"
  | "receipt_scan"
  | "savings"
  | "reports"
  | "settings"
  | "setup";

interface AdminSidebarProps {
  activeSection: AdminNavSectionId;
  onSelectSection: (sectionId: AdminNavSectionId) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenInfoModal: () => void;
  stats?: {
    totalUsers: number;
    totalTransactions: number;
    totalReceiptPhotos: number;
    totalSavingsGoals: number;
  };
}

export function AdminSidebar({
  activeSection,
  onSelectSection,
  isOpen,
  onClose,
  onOpenInfoModal,
  stats,
}: AdminSidebarProps) {
  const navGroups = [
    {
      group: "Overview",
      items: [
        {
          id: "dashboard" as AdminNavSectionId,
          label: "Dashboard",
          icon: LayoutDashboard,
          badge: null,
          isExternal: false,
        },
      ],
    },
    {
      group: "Management",
      items: [
        {
          id: "users" as AdminNavSectionId,
          label: "Pengguna",
          icon: Users,
          badge: stats?.totalUsers ?? 21,
          isExternal: false,
        },
        {
          id: "transactions" as AdminNavSectionId,
          label: "Transaksi",
          icon: ArrowLeftRight,
          badge: stats?.totalTransactions ?? 7,
          isExternal: true,
          href: "/pembukuan",
        },
        {
          id: "receipt_scan" as AdminNavSectionId,
          label: "Scan Struk AI",
          icon: Receipt,
          badge: stats?.totalReceiptPhotos ?? 0,
          isExternal: true,
          href: "/receipt-scanner",
        },
        {
          id: "savings" as AdminNavSectionId,
          label: "Target Nabung",
          icon: PiggyBank,
          badge: stats?.totalSavingsGoals ?? 2,
          isExternal: true,
          href: "/nabung",
        },
      ],
    },
    {
      group: "Administration",
      items: [
        {
          id: "reports" as AdminNavSectionId,
          label: "Laporan",
          icon: BarChart3,
          badge: null,
          isExternal: true,
          href: "/monitor",
        },
        {
          id: "settings" as AdminNavSectionId,
          label: "Pengaturan",
          icon: Settings,
          badge: null,
          isExternal: true,
          href: "/settings",
        },
        {
          id: "setup" as AdminNavSectionId,
          label: "Petunjuk & Konfigurasi Admin",
          icon: KeyRound,
          badge: "SQL",
          isExternal: false,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[68px] left-0 z-50 lg:z-30 w-[260px] h-[calc(100vh-68px)] bg-[#070B16]/90 lg:bg-[#070B16]/75 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col justify-between p-4 transition-transform duration-300 ease-out shadow-[4px_0_30px_rgba(0,0,0,0.4)] lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Navigation Groups List */}
        <div className="space-y-6 overflow-y-auto pr-1 select-none custom-scrollbar flex-1">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400/90 font-mono">
                {group.group}
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectSection(item.id);
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 relative ${
                        isActive
                          ? "bg-blue-600/15 text-blue-400 border border-blue-500/35 shadow-[0_0_16px_rgba(59,130,246,0.18)]"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      )}

                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg transition-colors ${
                            isActive
                              ? "bg-blue-500/20 text-blue-300"
                              : "text-slate-400 group-hover:text-slate-200 group-hover:bg-white/[0.05]"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <span className="truncate text-left">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
                        {item.badge !== null && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-colors ${
                              isActive
                                ? "bg-blue-500/25 text-blue-300 border border-blue-400/30"
                                : "bg-white/[0.06] text-slate-400 group-hover:text-slate-200 border border-white/[0.05]"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.isExternal && (
                          <ExternalLink className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Informational Card (Apple Glass) */}
        <div className="pt-3 mt-2 border-t border-white/[0.07]">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0E172F]/80 to-[#0A1022]/90 border border-white/[0.08] p-3.5 shadow-lg group">
            {/* Ambient subtle glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-blue-500/15 transition-all" />

            <div className="flex items-start gap-2.5 relative z-10">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-white tracking-tight">
                  Kelola Platform Finusa
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Kelola keuangan platform lebih mudah, aman, dan terstruktur.
                </p>
                <button
                  onClick={onOpenInfoModal}
                  className="mt-2 text-[11px] font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <span>Pelajari Lebih Lanjut</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
