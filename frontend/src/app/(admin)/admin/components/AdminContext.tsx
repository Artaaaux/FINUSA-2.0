"use client";

import React, { createContext, useContext, useState } from "react";
import { AdminStatsSummary } from "@/lib/services/admin.service";
import { AdminNavSectionId } from "./AdminSidebar";
import { REFERENCE_ADMIN_STATS } from "./admin-mock-data";

interface AdminContextValue {
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  systemRole: string;
  setSystemRole: (role: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  activeSection: AdminNavSectionId;
  setActiveSection: (section: AdminNavSectionId) => void;
  selectedModule: AdminNavSectionId | null;
  setSelectedModule: (mod: AdminNavSectionId | null) => void;
  isInfoModalOpen: boolean;
  setIsInfoModalOpen: (open: boolean) => void;
  stats: AdminStatsSummary;
  setStats: React.Dispatch<React.SetStateAction<AdminStatsSummary>>;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminEmail, setAdminEmail] = useState<string>("admin@finusa.web.id");
  const [systemRole, setSystemRole] = useState<string>("super_admin");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<AdminNavSectionId>("dashboard");
  const [selectedModule, setSelectedModule] = useState<AdminNavSectionId | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<AdminStatsSummary>(REFERENCE_ADMIN_STATS);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AdminContext.Provider
      value={{
        adminEmail,
        setAdminEmail,
        systemRole,
        setSystemRole,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        activeSection,
        setActiveSection,
        selectedModule,
        setSelectedModule,
        isInfoModalOpen,
        setIsInfoModalOpen,
        stats,
        setStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}
