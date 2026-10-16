"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Users, 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Check, 
  Activity, 
  Sparkles,
  Database,
  Key,
  ArrowUpDown
} from "lucide-react";
import { AdminService, AdminUserItem, AdminStatsSummary } from "@/lib/services/admin.service";
import { getAdminEmails } from "@/lib/auth/admin";

export type SortOption = "created_desc" | "created_asc" | "name_asc" | "name_desc" | "last_seen_desc";

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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "setup">("users");
  const [stats, setStats] = useState<AdminStatsSummary>({
    totalUsers: 0,
    totalTransactions: 0,
    totalReceiptPhotos: 0,
    totalSavingsGoals: 0,
  });
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created_desc");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ user }, statsData, usersData] = await Promise.all([
        AdminService.checkAdminAccess(),
        AdminService.getStats(),
        AdminService.getUsers(search),
      ]);

      if (user?.email) {
        setCurrentUserEmail(user.email);
      }
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (roleFilter === "admin") {
      result = result.filter((u) => u.systemRole === "admin" || u.systemRole === "super_admin");
    } else if (roleFilter === "user") {
      result = result.filter((u) => u.systemRole === "user");
    }

    result.sort((a, b) => {
      if (sortBy === "name_asc") {
        const nameA = (a.firstName + " " + a.lastName).trim() || a.email;
        const nameB = (b.firstName + " " + b.lastName).trim() || b.email;
        return nameA.localeCompare(nameB, "id", { sensitivity: "base" });
      }
      if (sortBy === "name_desc") {
        const nameA = (a.firstName + " " + a.lastName).trim() || a.email;
        const nameB = (b.firstName + " " + b.lastName).trim() || b.email;
        return nameB.localeCompare(nameA, "id", { sensitivity: "base" });
      }
      if (sortBy === "created_asc") {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      }
      if (sortBy === "last_seen_desc") {
        return new Date(b.lastSeenAt || 0).getTime() - new Date(a.lastSeenAt || 0).getTime();
      }
      // default: created_desc
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return result;
  }, [users, roleFilter, sortBy]);

  const handleToggleAdminRole = async (userItem: AdminUserItem) => {
    const newRole = userItem.systemRole === "admin" || userItem.systemRole === "super_admin" 
      ? "user" 
      : "admin";

    setUpdatingUserId(userItem.id);
    try {
      const ok = await AdminService.updateUserSystemRole(userItem.id, newRole);
      if (ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userItem.id ? { ...u, systemRole: newRole } : u))
        );
      } else {
        alert("Gagal memperbarui role pengguna. Pastikan migrasi SQL 02_simple_admin_setup.sql sudah dijalankan di Supabase.");
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Terjadi kesalahan saat mengubah role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const sampleSqlQuery = currentUserEmail
    ? `UPDATE public.profiles \nSET system_role = 'super_admin' \nWHERE email = '${currentUserEmail}';`
    : `UPDATE public.profiles \nSET system_role = 'super_admin' \nWHERE email = 'email_anda@gmail.com';`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSqlQuery);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const envAdminEmails = getAdminEmails();

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Admin Finusa (Mode Sederhana)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pusat Manajemen & Hak Akses
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Kelola peran admin, tinjau ringkasan metrik platform, dan pastikan konfigurasi akun terhubung dengan benar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
              Segarkan Data
            </button>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300">Supabase DB:</span>
            <span className="text-emerald-400 font-medium">Terhubung</span>
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300">AI Vision Engine:</span>
            <span className="text-slate-300 font-medium">MecutinAI + NVIDIA NIM</span>
          </div>
          <span className="text-slate-700">&bull;</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-300">Admin Guard:</span>
            <span className="text-blue-400 font-medium">Aktif</span>
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#141923] border border-slate-800/90 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Pengguna</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.totalUsers.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Akun terdaftar di database</p>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="bg-[#141923] border border-slate-800/90 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Buku Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.totalTransactions.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Mutasi kas tercatat</p>
          </div>
        </div>

        {/* Total Receipts */}
        <div className="bg-[#141923] border border-slate-800/90 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Scan Struk AI</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.totalReceiptPhotos.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Struk belanja tersimpan</p>
          </div>
        </div>

        {/* Savings Goals */}
        <div className="bg-[#141923] border border-slate-800/90 rounded-xl p-5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Target Nabung</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {stats.totalSavingsGoals.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Celengan aktif pengguna</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-4">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
            activeTab === "users" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Pengguna ({users.length})</span>
          {activeTab === "users" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("setup")}
          className={`pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2 ${
            activeTab === "setup" ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Petunjuk & Konfigurasi Admin</span>
          {activeTab === "setup" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      {/* Tab 1: User Management */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#141923] p-3 rounded-2xl border border-slate-800/80">
            {/* Search input */}
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari email atau nama pengguna..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Filter Pills */}
              <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setRoleFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    roleFilter === "all"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Semua ({users.length})
                </button>
                <button
                  onClick={() => setRoleFilter("admin")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    roleFilter === "admin"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => setRoleFilter("user")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    roleFilter === "user"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  User
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-slate-500 hidden sm:inline">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Urutkan daftar pengguna"
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
                >
                  <option value="created_desc" className="bg-[#141923] text-white">Tanggal Daftar: Terbaru</option>
                  <option value="created_asc" className="bg-[#141923] text-white">Tanggal Daftar: Terlama</option>
                  <option value="name_asc" className="bg-[#141923] text-white">Nama (A &rarr; Z)</option>
                  <option value="name_desc" className="bg-[#141923] text-white">Nama (Z &rarr; A)</option>
                  <option value="last_seen_desc" className="bg-[#141923] text-white">Terakhir Online</option>
                </select>
              </div>

              <span className="text-xs text-slate-500 hidden xl:inline ml-1 font-mono">
                {filteredAndSortedUsers.length} pengguna
              </span>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#141923] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/60 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
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
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAndSortedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                        {loading ? "Memuat data pengguna..." : "Tidak ada pengguna yang cocok dengan kriteria pencarian/filter."}
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedUsers.map((item) => {
                      const isAdmin = item.systemRole === "admin" || item.systemRole === "super_admin";
                      const isCurrentUser = item.email.toLowerCase() === currentUserEmail.toLowerCase();
                      const isUpdating = updatingUserId === item.id;
                      const lastSeen = formatLastSeen(item.lastSeenAt);

                      return (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          {/* Nama & Avatar */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
                                  {item.firstName ? item.firstName.charAt(0).toUpperCase() : item.email.charAt(0).toUpperCase()}
                                </div>
                                {lastSeen.isOnline && (
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#141923]" title="Online Sekarang" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium text-white block truncate">
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

                          {/* Email */}
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {item.email}
                          </td>

                          {/* System Role */}
                          <td className="py-3.5 px-4">
                            {isAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <ShieldCheck className="w-3 h-3" />
                                {item.systemRole === "super_admin" ? "Super Admin" : "Admin"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                                User Biasa
                              </span>
                            )}
                          </td>

                          {/* Role Finusa */}
                          <td className="py-3.5 px-4 text-slate-400">
                            {item.role}
                          </td>

                          {/* Terakhir Online */}
                          <td className="py-3.5 px-4">
                            {lastSeen.isOnline ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Online
                              </span>
                            ) : (
                              <div title={lastSeen.fullDate}>
                                <span className="text-slate-300 font-medium block">
                                  {lastSeen.text}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {lastSeen.fullDate}
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Joined */}
                          <td className="py-3.5 px-4 text-slate-400">
                            {item.createdAt 
                              ? new Date(item.createdAt).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })
                              : "-"}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleToggleAdminRole(item)}
                              disabled={isUpdating}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isAdmin
                                  ? "text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
                                  : "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20"
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

      {/* Tab 2: Setup Guide */}
      {activeTab === "setup" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Method 1: Database Migration / SQL */}
          <div className="bg-[#141923] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Metode 1: Supabase SQL Query</h3>
                <p className="text-xs text-slate-400">Aktifkan hak akses admin permanen via database</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Buka menu <strong>SQL Editor</strong> di dashboard Supabase Anda, jalankan berkas migrasi{" "}
              <code className="text-blue-400 bg-blue-950/40 px-1 py-0.5 rounded">
                supabase/migrations/02_simple_admin_setup.sql
              </code>
              , lalu jalankan query di bawah ini:
            </p>

            <div className="relative">
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto">
                {sampleSqlQuery}
              </pre>
              <button
                onClick={handleCopySql}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Salin Query"
              >
                {copiedQuery ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Setelah menjalankan query tersebut di Supabase, akun Anda langsung memiliki hak <strong>super_admin</strong>.
              </span>
            </div>
          </div>

          {/* Method 2: Environment Variable */}
          <div className="bg-[#141923] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Metode 2: Environment Variable (.env.local)</h3>
                <p className="text-xs text-slate-400">Otorisasi langsung tanpa menyentuh database</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Anda juga dapat menambahkan email admin langsung ke dalam berkas{" "}
              <code className="text-purple-400 bg-purple-950/40 px-1 py-0.5 rounded">frontend/.env.local</code>{" "}
              (dipisahkan tanda koma jika lebih dari satu):
            </p>

            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-purple-300 overflow-x-auto">
              ADMIN_EMAILS={currentUserEmail || "email_anda@gmail.com"},admin@finusa.web.id<br />
              NEXT_PUBLIC_ADMIN_EMAILS={currentUserEmail || "email_anda@gmail.com"},admin@finusa.web.id
            </pre>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-medium text-slate-300 block">
                Daftar Email Admin yang Terdeteksi Saat Ini:
              </span>
              {envAdminEmails.length === 0 ? (
                <span className="text-xs text-amber-400 italic">
                  Belum ada email yang diatur di variabel ADMIN_EMAILS.
                </span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {envAdminEmails.map((email) => (
                    <span
                      key={email}
                      className="px-2.5 py-1 rounded-md text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
