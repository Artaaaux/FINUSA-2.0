"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AdminService, AdminUserItem } from "@/lib/services/admin.service";
import { useAdmin } from "./components/AdminContext";
import { AdminHeader } from "./components/AdminHeader";
import { AdminMetrics } from "./components/AdminMetrics";
import { AdminUserTable } from "./components/AdminUserTable";
import { AdminSetupGuide } from "./components/AdminSetupGuide";
import { AdminRoleModal } from "./components/AdminRoleModal";
import { AdminToast, ToastMessage } from "./components/AdminToast";
import { REFERENCE_ADMIN_USERS } from "./components/admin-mock-data";

export type SortOption = "created_desc" | "created_asc" | "name_asc" | "name_desc" | "last_seen_desc";

export default function AdminPage() {
  const { 
    adminEmail, 
    activeSection, 
    setActiveSection, 
    setSelectedModule,
    stats, 
    setStats 
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<"users" | "setup">("users");
  const [users, setUsers] = useState<AdminUserItem[]>(REFERENCE_ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created_desc");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [loading, setLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Role confirmation modal state
  const [modalUser, setModalUser] = useState<AdminUserItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingRole, setIsProcessingRole] = useState(false);

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize active section from sidebar with tabs
  useEffect(() => {
    if (activeSection === "setup") {
      setActiveTab("setup");
    } else if (activeSection === "users" || activeSection === "dashboard") {
      setActiveTab("users");
    }
  }, [activeSection]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        AdminService.getStats(),
        AdminService.getUsers(search),
      ]);

      setStats(statsData);
      setUsers(usersData && usersData.length > 0 ? usersData : REFERENCE_ADMIN_USERS);
      addToast("success", "Data Berhasil Disegarkan", "Metrik platform dan daftar pengguna telah diperbarui.");
    } catch (err) {
      console.error("Failed to load admin data:", err);
      addToast("error", "Gagal Memuat Data", "Terjadi gangguan saat mengambil data terbaru dari database.");
    } finally {
      setLoading(false);
    }
  }, [search, setStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Tab change handler
  const handleTabChange = (tab: "users" | "setup") => {
    setActiveTab(tab);
    if (tab === "setup") {
      setActiveSection("setup");
    } else {
      setActiveSection("users");
    }
  };

  // Filter and sort users
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

  // Role toggle request -> open confirmation dialog
  const handleRequestRoleToggle = (userItem: AdminUserItem) => {
    setModalUser(userItem);
    setIsModalOpen(true);
  };

  // Confirm role toggle execution
  const handleConfirmRoleToggle = async () => {
    if (!modalUser) return;

    const newRole = modalUser.systemRole === "admin" || modalUser.systemRole === "super_admin" 
      ? "user" 
      : "admin";

    setIsProcessingRole(true);
    setUpdatingUserId(modalUser.id);

    try {
      const ok = await AdminService.updateUserSystemRole(modalUser.id, newRole);
      if (ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === modalUser.id ? { ...u, systemRole: newRole } : u))
        );
        addToast(
          "success",
          "Hak Akses Berhasil Diperbarui",
          `Status pengguna ${modalUser.email} sekarang adalah ${newRole === "admin" ? "Admin" : "User Biasa"}.`
        );
      } else {
        addToast(
          "error",
          "Gagal Memperbarui Role",
          "Pastikan migrasi SQL 02_simple_admin_setup.sql sudah dijalankan di Supabase."
        );
      }
    } catch (err) {
      console.error("Error updating role:", err);
      addToast("error", "Kesalahan Sistem", "Terjadi kendala saat mengubah role pengguna.");
    } finally {
      setIsProcessingRole(false);
      setUpdatingUserId(null);
      setIsModalOpen(false);
      setModalUser(null);
    }
  };

  const handleMetricCardClick = (metricType: string) => {
    if (metricType === "users") {
      setActiveTab("users");
      setActiveSection("users");
    } else {
      setSelectedModule(
        metricType === "transactions"
          ? "transactions"
          : metricType === "receipts"
          ? "receipt_scan"
          : "savings"
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* ── Main Administrative Overview Panel ── */}
      <AdminHeader onRefresh={loadData} isLoading={loading} />

      {/* ── 4 KPI Metric Cards Grid ── */}
      <AdminMetrics stats={stats} onCardClick={handleMetricCardClick} />

      {/* ── Main Content Area ── */}
      {activeTab === "users" ? (
        <AdminUserTable
          users={users}
          filteredUsers={filteredAndSortedUsers}
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          currentUserEmail={adminEmail}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onRequestRoleToggle={handleRequestRoleToggle}
          updatingUserId={updatingUserId}
          loading={loading}
        />
      ) : (
        <div className="space-y-6">
          {/* Header tab switcher bar for setup guide view */}
          <div className="rounded-2xl bg-[#090F21]/80 backdrop-blur-2xl border border-white/[0.08] p-5 shadow-lg">
            <div className="flex items-center gap-4 border-b border-white/[0.08] pb-4">
              <button
                onClick={() => handleTabChange("users")}
                className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                &larr; Kembali ke Daftar Pengguna ({users.length})
              </button>
            </div>
            <div className="mt-4">
              <AdminSetupGuide currentUserEmail={adminEmail} />
            </div>
          </div>
        </div>
      )}

      {/* ── Role Confirmation Modal ── */}
      <AdminRoleModal
        user={modalUser}
        isOpen={isModalOpen}
        onClose={() => {
          if (!isProcessingRole) {
            setIsModalOpen(false);
            setModalUser(null);
          }
        }}
        onConfirm={handleConfirmRoleToggle}
        isProcessing={isProcessingRole}
      />

      {/* ── Feedback Toast Notifications ── */}
      <AdminToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
