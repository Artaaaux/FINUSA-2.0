"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  BadgeCheck,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Calendar,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/hooks";
import { useUserProfile } from "@/lib/context/UserProfileContext";

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name[0].toUpperCase();
}

type GreetingInfo = {
  text: string;
  Icon: LucideIcon;
  subText: string;
};

function getGreetingInfo(): GreetingInfo {
  const hour = new Date().getHours();
  if (hour < 5)  return { text: "Selamat Malam",  Icon: Moon,     subText: "Masih kerja malam ya?" };
  if (hour < 12) return { text: "Selamat Pagi",   Icon: Sun,      subText: "Semangat memulai hari dan kelola keuangan!" };
  if (hour < 15) return { text: "Selamat Siang",  Icon: CloudSun, subText: "Jaga kondisi & tetap fokus bertumbuh!" };
  if (hour < 18) return { text: "Selamat Sore",   Icon: Sunset,   subText: "Waktu terbaik evaluasi arus kas hari ini." };
  return          { text: "Selamat Malam",  Icon: Moon,     subText: "Santai dan istirahat yang cukup!" };
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

export function UserProfile() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const greeting = getGreetingInfo();
  const GreetingIcon = greeting.Icon;

  // Derive display values from profile context
  const profileName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ")
    : "";
  const emailUsername = user?.email ? user.email.split("@")[0] : "Pengguna";
  const displayName = profileName || user?.user_metadata?.first_name || emailUsername;
  const firstName = displayName.split(" ")[0];
  const initials = getInitials(displayName);
  const displayEmail = user?.email || "user@finusa.id";
  const companyName = profile?.companyName;
  const userRole = companyName ? `${companyName}` : "Pemilik Akun";
  const avatarUrl = profile?.avatarUrl || "";

  return (
    <div
      className="relative rounded-xl sm:rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(26,31,46,0.8) 0%, rgba(21,26,36,0.6) 100%)",
        border: "1px solid rgba(75,123,255,0.15)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top accent line */}
      <div
        className="h-0.5 w-full bg-gradient-to-r from-blue-500/40 via-teal-500/40 to-transparent"
        aria-hidden="true"
      />

      {/* 2-column layout */}
      <div className="relative z-10 flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">

        {/* ── LEFT: Greeting ─────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center gap-2.5 sm:gap-4">

          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {mounted ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <GreetingIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" aria-hidden="true" />
                  <span className="text-xs sm:text-sm font-medium text-slate-400">{greeting.text}</span>
                </div>
              ) : (
                <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
              )}

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" aria-hidden="true" />
                Tersambung Cloud
              </div>
            </div>

            {/* Action icons */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <Link
                href="/settings"
                className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Pengaturan akun"
              >
                <Settings className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Main greeting text */}
          {mounted ? (
            <>
              <motion.h1 {...fadeUp(0.05)} className="text-xl sm:text-3xl lg:text-[38px] font-bold text-white leading-tight">
                Halo, {firstName}!
              </motion.h1>

              <motion.p {...fadeUp(0.15)} className="text-xs sm:text-base text-slate-300 leading-relaxed">
                {greeting.subText}
              </motion.p>

              <motion.div {...fadeUp(0.25)} className="flex items-center gap-2 text-[11px] sm:text-[13px] text-slate-400">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" aria-hidden="true" />
                <span>{getFormattedDate()}</span>
                <span aria-hidden="true">•</span>
                <Activity className="w-3 h-3 flex-shrink-0 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400 font-medium">Status: Aktif</span>
              </motion.div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse" />
              <div className="h-4 w-40 rounded bg-white/5 animate-pulse" />
            </div>
          )}
        </div>

        {/* ── RIGHT: Profile Card ──────────────────────── */}
        {mounted && (
          <motion.div {...fadeUp(0.3)} className="lg:w-[240px] xl:w-[260px] shrink-0">
            <div
              className="relative rounded-xl p-3.5 sm:p-5 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-3 overflow-hidden bg-[#1f2534] border border-slate-700/60 shadow-md"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 lg:flex-col lg:text-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`Avatar ${displayName}`}
                    className="relative z-10 h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border border-white/20 shadow-sm shrink-0"
                  />
                ) : (
                  <div
                    className="relative z-10 h-12 w-12 sm:h-16 sm:w-16 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold text-white bg-gradient-to-br from-blue-600 to-teal-500 border border-white/20 shadow-sm shrink-0"
                    aria-label={`Avatar ${displayName}`}
                  >
                    {initials}
                  </div>
                )}
                <div className="lg:mt-1">
                  <p className="text-xs sm:text-sm font-bold text-white leading-tight">{displayName}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate max-w-[140px] sm:max-w-none">
                    {displayEmail}
                  </p>
                </div>
              </div>

              {/* User tier/role badge */}
              <div
                className="relative z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 shrink-0"
              >
                <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                {userRole}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
