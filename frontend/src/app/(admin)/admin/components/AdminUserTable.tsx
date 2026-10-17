"use client";

import React, { useState } from "react";
import { 
  Users, 
  Key, 
  Search, 
  ArrowUpDown, 
  ShieldCheck, 
  Copy, 
  Check
} from "lucide-react";
import { AdminUserItem } from "@/lib/services/admin.service";
import { SortOption } from "../page";

interface AdminUserTableProps {
  users: AdminUserItem[];
  filteredUsers: AdminUserItem[];
  search: string;
  onSearchChange: (val: string) => void;
  roleFilter: "all" | "admin" | "user";
  onRoleFilterChange: (val: "all" | "admin" | "user") => void;
  sortBy: SortOption;
  onSortByChange: (val: SortOption) => void;
  currentUserEmail: string;
  activeTab: "users" | "setup";
  onTabChange: (tab: "users" | "setup") => void;
  onRequestRoleToggle: (user: AdminUserItem) => void;
  updatingUserId: string | null;
  loading: boolean;
}

function formatLastSeen(timestamp?: string): { text: string; isOnline: boolean; fullDate: string } {
  if (!timestamp) return { text: "Belum tercatat", isOnline: false, fullDate: "-" };
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return { text: "-", isOnline: false, fullDate: "-" };

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const fullDate = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMin < 5) {
    return { text: "Online Sekarang", isOnline: true, fullDate };
  }
  if (diffMin < 60) {
    return { text: `${diffMin} mnt lalu`, isOnline: false, fullDate };
  }
  if (diffHour < 24) {
    return { text: `${diffHour} jam lalu`, isOnline: false, fullDate };
  }
  if (diffDay === 1) {
    return { text: "Kemarin", isOnline: false, fullDate };
  }
  if (diffDay < 7) {
    return { text: `${diffDay} hari lalu`, isOnline: false, fullDate };
  }

  return {
    text: date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    isOnline: false,
    fullDate,
  };
}

export function AdminUserTable({
  users,
  filteredUsers,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  sortBy,
  onSortByChange,
  currentUserEmail,
  activeTab,
  onTabChange,
  onRequestRoleToggle,
  updatingUserId,
  loading,
}: AdminUserTableProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 1800);
  };

  const adminCount = users.filter(
    (u) => u.systemRole === "admin" || u.systemRole === "super_admin"
  ).length;
  const userCount = users.filter((u) => u.systemRole === "user").length;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#090F21]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.08)]">
      {/* ── Section Tabs Header ── */}
      <div className="px-5 sm:px-6 pt-5 pb-0 border-b border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          {/* Tab 1: Daftar Pengguna */}
          <button
            onClick={() => onTabChange("users")}
            className={`pb-3.5 px-1 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 shrink-0 ${
              activeTab === "users"
                ? "text-blue-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Pengguna ({users.length})</span>
            {activeTab === "users" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}
          </button>

          {/* Tab 2: Petunjuk & Konfigurasi */}
          <button
            onClick={() => onTabChange("setup")}
            className={`pb-3.5 px-1 text-xs sm:text-sm font-bold transition-all relative flex items-center gap-2 shrink-0 ${
              activeTab === "setup"
                ? "text-blue-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Petunjuk & Konfigurasi Admin</span>
            {activeTab === "setup" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}
          </button>
        </div>

        {/* Total Users Status Badge */}
        <div className="hidden md:flex items-center gap-2 pb-3.5 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{users.length} Total Akun</span>
        </div>
      </div>

      {/* If Tab is setup, parent handles or this is user view */}
      {activeTab === "users" && (
        <div className="p-4 sm:p-6 space-y-4">
          {/* ── Search & Filter Toolbar ── */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 bg-[#0B1226]/60 p-3 sm:p-3.5 rounded-xl border border-white/[0.06] backdrop-blur-md">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari email atau nama pengguna..."
                className="w-full bg-[#060A16]/80 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-sans"
              />
            </div>

            {/* Filter Pills + Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Role Filter Segmented Control */}
              <div className="flex items-center bg-[#060A16]/90 border border-white/[0.08] rounded-xl p-1 text-xs">
                <button
                  onClick={() => onRoleFilterChange("all")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    roleFilter === "all"
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Semua ({users.length})
                </button>
                <button
                  onClick={() => onRoleFilterChange("admin")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    roleFilter === "admin"
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Admin ({adminCount})
                </button>
                <button
                  onClick={() => onRoleFilterChange("user")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    roleFilter === "user"
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  User ({userCount})
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 bg-[#060A16]/90 border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-400 hidden sm:inline text-[11px]">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value as SortOption)}
                  aria-label="Urutkan daftar pengguna"
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1 text-xs"
                >
                  <option value="created_desc" className="bg-[#0B1226] text-white">
                    Tanggal Daftar: Terbaru
                  </option>
                  <option value="created_asc" className="bg-[#0B1226] text-white">
                    Tanggal Daftar: Terlama
                  </option>
                  <option value="name_asc" className="bg-[#0B1226] text-white">
                    Nama (A &rarr; Z)
                  </option>
                  <option value="name_desc" className="bg-[#0B1226] text-white">
                    Nama (Z &rarr; A)
                  </option>
                  <option value="last_seen_desc" className="bg-[#0B1226] text-white">
                    Terakhir Online
                  </option>
                </select>
              </div>

              {/* Result Count Badge */}
              <span className="text-xs text-slate-400 font-mono hidden xl:inline px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                {filteredUsers.length} pengguna
              </span>
            </div>
          </div>

          {/* ── User Table Container ── */}
          <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#070B16]/50 shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead className="bg-[#080E1F]/80 border-b border-white/[0.08] text-[11px] font-mono uppercase tracking-wider text-slate-400/90 select-none">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Pengguna</th>
                    <th className="py-3.5 px-4 font-semibold">Email</th>
                    <th className="py-3.5 px-4 font-semibold">Hak Akses Sistem</th>
                    <th className="py-3.5 px-4 font-semibold">Role Finusa</th>
                    <th className="py-3.5 px-4 font-semibold">Terakhir Online</th>
                    <th className="py-3.5 px-4 font-semibold">Bergabung</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Aksi Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-slate-400 text-xs">
                        {loading
                          ? "Memuat data pengguna platform..."
                          : "Tidak ada pengguna yang cocok dengan kriteria pencarian/filter."}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((item) => {
                      const isAdmin = item.systemRole === "admin" || item.systemRole === "super_admin";
                      const isCurrentUser =
                        currentUserEmail &&
                        item.email.toLowerCase() === currentUserEmail.toLowerCase();
                      const isUpdating = updatingUserId === item.id;
                      const lastSeen = formatLastSeen(item.lastSeenAt);
                      const initial = item.firstName
                        ? item.firstName.charAt(0).toUpperCase()
                        : item.email.charAt(0).toUpperCase();

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-white/[0.03] transition-colors group"
                        >
                          {/* 1. Pengguna (Avatar + Nama) */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/[0.1] flex items-center justify-center font-bold text-white text-xs shadow-sm">
                                  {initial}
                                </div>
                                {lastSeen.isOnline && (
                                  <span
                                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090F21] shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                                    title="Online Sekarang"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="font-semibold text-white block truncate tracking-tight">
                                  {item.firstName || item.lastName
                                    ? `${item.firstName} ${item.lastName}`.trim()
                                    : "Pengguna Finusa"}
                                </span>
                                {isCurrentUser && (
                                  <span className="text-[10px] text-blue-400 font-medium">
                                    (Akun Anda Saat Ini)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. Email */}
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            <div className="flex items-center gap-1.5 group/email">
                              <span className="truncate max-w-[200px]" title={item.email}>
                                {item.email}
                              </span>
                              <button
                                onClick={() => handleCopyEmail(item.email)}
                                title="Salin Email"
                                className="opacity-0 group-hover/email:opacity-100 p-1 rounded hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all"
                              >
                                {copiedEmail === item.email ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* 3. Hak Akses Sistem */}
                          <td className="py-3.5 px-4">
                            {isAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.15)]">
                                <ShieldCheck className="w-3 h-3" />
                                <span>{item.systemRole === "super_admin" ? "Super Admin" : "Admin"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                                User Biasa
                              </span>
                            )}
                          </td>

                          {/* 4. Role Finusa */}
                          <td className="py-3.5 px-4 text-slate-400 font-medium">
                            {item.role || "Pemilik Akun"}
                          </td>

                          {/* 5. Terakhir Online */}
                          <td className="py-3.5 px-4">
                            {lastSeen.isOnline ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                Online
                              </span>
                            ) : (
                              <div title={lastSeen.fullDate}>
                                <span className="text-slate-300 font-medium block">
                                  {lastSeen.text}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {lastSeen.fullDate}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* 6. Bergabung */}
                          <td className="py-3.5 px-4 text-slate-400">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "-"}
                          </td>

                          {/* 7. Aksi Role */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => onRequestRoleToggle(item)}
                              disabled={isUpdating}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${
                                isAdmin
                                  ? "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25"
                                  : "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/25"
                              }`}
                            >
                              {isUpdating
                                ? "Memproses..."
                                : isAdmin
                                ? "Jadikan User Biasa"
                                : "Jadikan Admin"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
