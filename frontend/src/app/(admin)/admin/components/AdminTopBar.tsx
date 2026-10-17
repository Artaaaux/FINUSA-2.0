"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  ArrowLeft, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";

interface AdminTopBarProps {
  adminEmail: string;
  systemRole: string;
  onSignOut: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AdminTopBar({
  adminEmail,
  systemRole,
  onSignOut,
  isSidebarOpen,
  onToggleSidebar,
}: AdminTopBarProps) {
  const displayRole = systemRole === "super_admin" ? "Super Admin" : "Admin";

  return (
    <header className="sticky top-0 z-40 h-[68px] bg-[#070B16]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.35)]">
      {/* Left: Mobile Toggle + Logo & Brand */}
      <div className="flex items-center gap-3.5">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Tutup Menu Navigasi" : "Buka Menu Navigasi"}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* FINUSA Brand Link */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/[0.12] bg-[#0D1529] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.25)] group-hover:border-blue-500/40 transition-all">
            <Image
              src="/LogoFinusa.png"
              alt="FINUSA"
              fill
              sizes="36px"
              className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Fallback icon representation if image fails
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            {/* Fallback spark icon in case image is missing */}
            <Sparkles className="w-4 h-4 text-blue-400 absolute pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight group-hover:text-blue-400 transition-colors">
                FINUSA
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                <ShieldCheck className="w-3 h-3 text-blue-400" />
                Admin Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
              Pusat Kendali Sederhana
            </p>
          </div>
        </Link>
      </div>

      {/* Right: Admin Account Pill + Switch to App + Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Administrator Profile Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            {adminEmail ? adminEmail.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 tracking-tight max-w-[190px] truncate" title={adminEmail}>
              {adminEmail || "admin@finusa.web.id"}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              {displayRole}
            </span>
          </div>
        </div>

        {/* Switch to User App */}
        <Link
          href="/home"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] hover:text-white border border-white/[0.08] hover:border-white/[0.18] transition-all shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Aplikasi Pengguna</span>
        </Link>

        {/* Logout Button */}
        <button
          onClick={onSignOut}
          title="Keluar dari Akun Admin"
          aria-label="Keluar"
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-white/[0.03] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/25 transition-all active:scale-95 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
