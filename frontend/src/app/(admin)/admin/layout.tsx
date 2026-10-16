"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/auth/supabase";
import { AdminService } from "@/lib/services/admin.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [systemRole, setSystemRole] = useState<string>("admin");
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function verify() {
      try {
        const { isAdmin, user, profile } = await AdminService.checkAdminAccess();
        if (!isMounted) return;

        if (!isAdmin || !user) {
          router.replace("/home?error=unauthorized_admin");
          return;
        }

        setAdminEmail(user.email);
        setSystemRole(profile?.system_role || "admin");
      } catch (err) {
        console.error("Admin verification error:", err);
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    }
    verify();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#0F1419] flex flex-col items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-sm font-medium tracking-wide">Memverifikasi hak akses Admin Finusa...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1419] text-slate-100 flex flex-col">
      {/* Top Navbar Admin */}
      <header className="sticky top-0 z-40 bg-[#141923]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-900 flex items-center justify-center">
              <Image
                src="/LogoFinusa.webp"
                alt="Finusa Logo"
                fill
                sizes="32px"
                className="object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight group-hover:text-blue-400 transition-colors">
                  FINUSA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Pusat Kendali Sederhana
              </p>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* User Email Pill */}
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-medium text-slate-200">{adminEmail}</span>
            <span className="text-[10px] text-emerald-400 capitalize flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {systemRole.replace("_", " ")}
            </span>
          </div>

          {/* Switch to User App */}
          <Link
            href="/home"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Aplikasi Pengguna</span>
          </Link>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            title="Keluar"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500 bg-[#0F1419]">
        <span>FINUSA Admin Control System &bull; Versi Mode Sederhana</span>
      </footer>
    </div>
  );
}
