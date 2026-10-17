"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/lib/auth/supabase";
import { AdminService } from "@/lib/services/admin.service";
import { AdminProvider, useAdmin } from "./components/AdminContext";
import { AdminTopBar } from "./components/AdminTopBar";
import { AdminSidebar, AdminNavSectionId } from "./components/AdminSidebar";
import { AdminModuleModal } from "./components/AdminModuleModal";
import { AdminInfoModal } from "./components/AdminInfoModal";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
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
  } = useAdmin();

  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function verify() {
      try {
        const { isAdmin, user, profile } = await AdminService.checkAdminAccess();
        if (!isMounted) return;

        if (!isAdmin || !user) {
          // Allow preview in development environment
          if (process.env.NODE_ENV === "development") {
            setAdminEmail("admin@finusa.web.id");
            setSystemRole("super_admin");
            setIsVerifying(false);
            return;
          }
          router.replace("/home?error=unauthorized_admin");
          return;
        }

        setAdminEmail(user.email);
        setSystemRole(profile?.system_role || "admin");
      } catch (err) {
        console.error("Admin verification error:", err);
        if (process.env.NODE_ENV === "development") {
          setAdminEmail("admin@finusa.web.id");
          setSystemRole("super_admin");
        }
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    }
    verify();

    return () => {
      isMounted = false;
    };
  }, [router, setAdminEmail, setSystemRole]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  const handleSelectNavSection = (sectionId: AdminNavSectionId) => {
    setActiveSection(sectionId);
    if (["transactions", "receipt_scan", "savings", "reports", "settings"].includes(sectionId)) {
      setSelectedModule(sectionId);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#060A13] flex flex-col items-center justify-center text-slate-300">
        <div className="flex items-center gap-3 p-5 rounded-2xl bg-[#090F21]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
          <span className="text-xs font-semibold tracking-wide text-slate-200">
            Memverifikasi hak akses Admin Finusa...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060A13] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
      {/* ── Soft Ambient Radial Lights (Apple macOS aesthetics) ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(1100px circle at 50% -120px, rgba(37,99,235,0.12) 0%, transparent 65%),
            radial-gradient(800px circle at 100% 30%, rgba(14,165,233,0.06) 0%, transparent 60%),
            radial-gradient(900px circle at 10% 90%, rgba(30,58,138,0.08) 0%, transparent 70%),
            #060A13
          `,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* ── Subtle Ambient Noise Overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* ── Global Top Bar (Fixed/Sticky) ── */}
      <div className="relative z-40">
        <AdminTopBar
          adminEmail={adminEmail}
          systemRole={systemRole}
          onSignOut={handleSignOut}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      </div>

      {/* ── Desktop & Responsive Body Shell (Sidebar + Main Workspace) ── */}
      <div className="relative z-10 flex flex-1 min-h-[calc(100vh-68px)]">
        {/* Persistent Left Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSelectSection={handleSelectNavSection}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onOpenInfoModal={() => setIsInfoModalOpen(true)}
          stats={stats}
        />

        {/* Main Administrative Workspace (Spacious 24-32px padding, max-w-7xl) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full space-y-6 sm:space-y-8">
          {children}
        </main>
      </div>

      {/* ── Modals & Overlays ── */}
      <AdminModuleModal
        sectionId={selectedModule}
        isOpen={Boolean(selectedModule)}
        onClose={() => setSelectedModule(null)}
        stats={stats}
      />

      <AdminInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      {/* ── Refined Minimal Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-4 px-6 text-center text-xs text-slate-500 bg-[#060A13]/80 backdrop-blur-md">
        <span>FINUSA Administrative Control Platform &bull; Apple-Inspired Glassmorphism Engine</span>
      </footer>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminProvider>
  );
}
