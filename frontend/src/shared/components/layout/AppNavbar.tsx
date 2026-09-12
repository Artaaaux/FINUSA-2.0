"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Loader2,
  Search,
  Calendar,
  ArrowRight,
  X,
  TrendingUp,
  ArrowDownLeft,
  ShieldCheck,
  FolderKanban,
  Activity,
  CreditCard,
  ScanLine,
  Blocks,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/auth/supabase";
import { useAuth } from "@/lib/auth/hooks";
import { useUserProfile } from "@/lib/context/UserProfileContext";
import { cn } from "@/shared/lib/utils";

// ─── Route Metadata ──────────────────────────────────────────────────────────
const routeMeta: Record<
  string,
  { label: string; subtitle: string; icon: React.ElementType }
> = {
  "/home": { label: "Home", subtitle: "Dashboard Ringkasan", icon: LayoutDashboard },
  "/receipt-scanner": { label: "Scan Struk", subtitle: "Smart OCR Scanner", icon: ScanLine },
  "/ai": { label: "Scan Struk", subtitle: "Smart OCR Scanner", icon: ScanLine },
  "/monitor": { label: "Monitor", subtitle: "Analisis Likuiditas & Kas", icon: Activity },
  "/nabung": { label: "Nabung", subtitle: "Target & Tabungan Impian", icon: CreditCard },
  "/catat": { label: "Catat", subtitle: "Pemasukan & Pengeluaran", icon: FolderKanban },
  "/pembukuan": { label: "Catat", subtitle: "Pemasukan & Pengeluaran", icon: FolderKanban },
  "/sheets": { label: "Template", subtitle: "Download Template Keuangan", icon: Blocks },
  "/settings": { label: "Pengaturan", subtitle: "Preferensi Akun & Sistem", icon: Settings },
  "/help": { label: "Bantuan", subtitle: "Panduan Penggunaan Finusa", icon: HelpCircle },
};

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "income" | "alert" | "info";
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Pemasukan Berhasil Dicatat",
    desc: "Honor Jasa Konsultasi & Proyek +Rp 5.000.000 masuk ke Kas Tunai.",
    time: "Hari ini, 15:36",
    type: "income",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Kondisi Kas Sehat (Surplus)",
    desc: "Arus kas Anda bulan ini mengalami surplus kas bertumbuh +5.0%.",
    time: "Hari ini, 12:00",
    type: "alert",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Cloud Backup Tersinkron",
    desc: "Seluruh pencatatan dan saldo terenkripsi aman di Cloud Supabase.",
    time: "Kemarin",
    type: "info",
    isRead: true,
  },
];

export default function AppNavbar({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { profile } = useUserProfile();

  // Dropdowns & Modals
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active page meta
  const currentMeta = routeMeta[pathname] || {
    label: "FINUSA",
    subtitle: "Finance Nusantara",
    icon: FolderKanban,
  };
  const RouteIcon = currentMeta.icon;

  // Unread notifications count
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Display name & avatar
  const profileName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ")
    : "";
  const userName = profileName || (user?.email ? user.email.split("@")[0] : "Pengguna");
  const userInitial = userName.charAt(0).toUpperCase();
  const avatarUrl = profile?.avatarUrl || "";

  // Formatted date (Indonesian)
  const todayDateStr = useMemo(() => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date());
  }, []);

  // Keyboard shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchModalOpen(false);
        setNotifOpen(false);
        setDropdownOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 80);
    } else {
      setSearchQuery("");
    }
  }, [searchModalOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const markAllNotifRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Quick command searchable items
  const commandItems = [
    { title: "Catat Transaksi Baru", category: "Aksi Cepat", href: "/catat", icon: FolderKanban },
    { title: "Monitor Likuiditas & Kas", category: "Menu Utama", href: "/monitor", icon: Activity },
    { title: "Nabung & Alokasi Target", category: "Menu Utama", href: "/nabung", icon: CreditCard },
    { title: "Scan Struk Belanja (OCR)", category: "Alat AI", href: "/receipt-scanner", icon: ScanLine },
    { title: "Template Spreadsheet Keuangan", category: "Alat", href: "/sheets", icon: Blocks },
    { title: "Pengaturan Akun & Profil", category: "Sistem", href: "/settings", icon: Settings },
    { title: "Panduan & Bantuan", category: "Dukungan", href: "/help", icon: HelpCircle },
  ];

  const filteredCommands = commandItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 right-0 h-[56px] lg:h-[64px] z-40 transition-all duration-300",
          isCollapsed ? "left-0 lg:left-[72px]" : "left-0 lg:left-[250px]"
        )}
        style={{
          background:
            "linear-gradient(180deg, rgba(22, 28, 40, 0.98) 0%, rgba(15, 20, 25, 0.98) 100%)",
        }}
      >
        {/* Top ambient highlight line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/35 via-teal-500/25 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Bottom subtle edge divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-slate-800/40 via-slate-700/60 to-slate-800/40 pointer-events-none"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between h-full px-3 sm:px-6 gap-2 sm:gap-3">
          {/* ── LEFT: Brand Logo (mobile) + Rich Breadcrumb & Context ── */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Mobile Logo Container Tile */}
            <div className="lg:hidden w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-teal-500/15 border border-blue-500/30 p-1 flex items-center justify-center shadow-[0_0_12px_rgba(75,123,255,0.2)] shrink-0">
              <img
                src="/Assets/LogoIcon.png"
                alt="FINUSA Logo"
                className="w-5 h-5 object-contain drop-shadow-[0_1px_4px_rgba(75,123,255,0.4)]"
              />
            </div>

            {/* Desktop Section Icon Badge */}
            <div className="hidden lg:flex w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/15 to-teal-500/10 border border-blue-500/25 items-center justify-center text-blue-400 shadow-[0_0_14px_rgba(75,123,255,0.12)] shrink-0">
              <RouteIcon className="w-4 h-4" />
            </div>

            {/* Title & Breadcrumb */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-blue-400 sm:text-slate-400">
                  FINUSA
                </span>
                <span className="text-slate-600 text-[10px]">/</span>
                <span className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                  {currentMeta.label}
                </span>

                {/* Live Sync Status Pill */}
                <span className="inline-flex items-center gap-1 ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden xs:inline">Cloud</span> Sync
                </span>
              </div>

              {/* Subtitle tag */}
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5 max-w-[135px] xs:max-w-[190px] sm:max-w-none">
                {currentMeta.subtitle}
              </span>
            </div>
          </div>

          {/* ── CENTER: Quick Spotlight Search Bar (Desktop) ── */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-md px-2">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="w-full h-9 px-3.5 rounded-xl bg-[#0F1419]/75 hover:bg-[#161c28] border border-slate-800 hover:border-blue-500/40 text-left transition-all duration-200 flex items-center justify-between group shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Buka pencarian cepat"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors shrink-0" />
                <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors truncate">
                  Cari transaksi, menu, fitur...
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <kbd className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-400 group-hover:text-slate-300">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* ── RIGHT: Controls, Notifications & Profile ── */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Indonesian Date Badge (Desktop xl) */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#161c28]/60 border border-slate-800/80 text-[11px] text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{todayDateStr}</span>
            </div>

            {/* Search Trigger Button (Mobile / Tablet) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-[#161c28]/80 hover:bg-[#1f2534] active:scale-95 border border-slate-800/90 hover:border-blue-500/30 text-slate-300 hover:text-white transition-all duration-150 cursor-pointer shadow-xs"
              aria-label="Cari fitur atau transaksi"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notification Bell with Interactive Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className={cn(
                  "relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center border transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-xs",
                  notifOpen
                    ? "bg-[#1f2534] border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(75,123,255,0.2)]"
                    : "bg-[#161c28]/80 hover:bg-[#1f2534] border-slate-800/90 hover:border-slate-700 text-slate-300 hover:text-white"
                )}
                aria-label={`Notifikasi keuangan (${unreadCount} belum dibaca)`}
                aria-expanded={notifOpen}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] max-w-xs sm:max-w-sm sm:w-88 rounded-2xl shadow-2xl p-3 z-50 bg-[#161c28] border border-slate-700/80"
                  >
                    <div className="flex items-center justify-between px-2 pb-2.5 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Notifikasi Keuangan</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400">
                            {unreadCount} Baru
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => markAllNotifRead()}
                          className="text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                        >
                          Tandai dibaca
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto my-1">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "p-2.5 rounded-xl transition-colors flex items-start gap-3",
                            item.isRead ? "opacity-75 hover:bg-white/[0.02]" : "bg-blue-500/[0.04] hover:bg-blue-500/[0.08]"
                          )}
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border",
                              item.type === "income"
                                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                                : item.type === "alert"
                                ? "bg-blue-500/10 border-blue-500/25 text-blue-400"
                                : "bg-teal-500/10 border-teal-500/25 text-teal-400"
                            )}
                          >
                            {item.type === "income" ? (
                              <ArrowDownLeft className="w-3.5 h-3.5" />
                            ) : item.type === "alert" ? (
                              <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white leading-tight">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.desc}
                            </p>
                            <span className="text-[9px] text-slate-500 mt-1 block font-mono">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 text-center">
                      <Link
                        href="/monitor"
                        onClick={() => setNotifOpen(false)}
                        className="text-[11px] text-slate-400 hover:text-blue-400 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Lihat Analisis Keuangan</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Quick Link */}
            <Link
              href="/settings"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center bg-[#161c28]/80 hover:bg-[#1f2534] active:scale-95 border border-slate-800/90 hover:border-slate-700 text-slate-300 hover:text-white transition-all duration-150 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Pengaturan akun"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Vertical Divider */}
            <div
              className="w-px h-5 sm:h-6 bg-gradient-to-b from-transparent via-slate-700/60 to-transparent mx-0.5 sm:mx-1 shrink-0"
              aria-hidden="true"
            />

            {/* ── User Profile Pill with Dropdown ── */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-2.5 rounded-full sm:rounded-xl bg-[#161c28]/80 hover:bg-[#1f2534] active:scale-95 border border-slate-800/90 hover:border-blue-500/30 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group shadow-xs"
                aria-expanded={dropdownOpen}
                aria-haspopup="menu"
                aria-label="Menu profil pengguna"
              >
                {/* Avatar with subtle ring */}
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={`Avatar ${userName}`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 ring-1 ring-blue-400/30 shadow-xs">
                      <span>{userInitial}</span>
                    </div>
                  )}
                </div>

                {/* Name & Tag (Desktop) */}
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-blue-300 transition-colors leading-none truncate max-w-[120px]">
                    {userName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1">
                    Akun Finusa
                  </span>
                </div>

                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200",
                    dropdownOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl p-1.5 z-50 bg-[#161c28] border border-slate-700/80"
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-800/80">
                      <p className="text-xs font-bold text-white truncate">{userName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/settings"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span>Profil Pengguna</span>
                      </Link>
                      <Link
                        href="/settings"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span>Pengaturan Rekening & Sistem</span>
                      </Link>
                      <Link
                        href="/help"
                        role="menuitem"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                        <span>Pusat Bantuan</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-800/80">
                      <button
                        role="menuitem"
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors w-full cursor-pointer disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                        ) : (
                          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                        <span>{isLoggingOut ? "Keluar..." : "Keluar Akun"}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Spotlight / Command Palette Modal (⌘K) ── */}
      <AnimatePresence>
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchModalOpen(false)}
              className="fixed inset-0 bg-black/60"
            />

            {/* Command Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative w-full max-w-lg rounded-2xl bg-[#161c28] border border-slate-700 shadow-2xl overflow-hidden z-10"
            >
              {/* Search Input Box */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-[#0F1419]/60">
                <Search className="w-4 h-4 text-blue-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Cari transaksi, halaman, atau pintasan aksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-slate-400 hover:text-white rounded-md cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                    ESC
                  </kbd>
                )}
              </div>

              {/* Command List */}
              <div className="p-2 max-h-80 overflow-y-auto space-y-1">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => {
                    const CmdIcon = cmd.icon;
                    return (
                      <button
                        key={cmd.title}
                        type="button"
                        onClick={() => {
                          setSearchModalOpen(false);
                          router.push(cmd.href);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-blue-500/10 hover:border-blue-500/25 border border-transparent transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-[#0F1419] border border-slate-800 group-hover:border-blue-500/30 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                            <CmdIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {cmd.title}
                            </p>
                            <span className="text-[10px] text-slate-500">{cmd.category}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada hasil yang cocok dengan &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>

              {/* Dialog Footer */}
              <div className="px-4 py-2 bg-[#0F1419]/70 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Navigasi Cepat Finusa</span>
                <span>ESC untuk menutup</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
