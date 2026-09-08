"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserProfile } from "./components/UserProfile";
import { SummarySection } from "./components/SummarySection";
import QuickAccess from "./components/QuickAccess";
import SavingsGoals from "./components/SavingsGoals";
import RecentActivity from "./components/RecentActivity";
import DailyTip from "./components/DailyTip";
import Link from "next/link";

const staggered = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
});

function DashboardFooter() {
  return (
    <footer
      className="mt-8 sm:mt-12 -mx-3.5 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 sm:py-6 border-t border-slate-800 bg-[#0F1419]/80"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} FINUSA. All rights reserved.
        </p>
        <div className="flex items-center gap-4 sm:gap-5">
          {[
            { label: "Privasi", href: "/help" },
            { label: "Ketentuan", href: "/help" },
            { label: "Bantuan", href: "/help" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-slate-500 hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-xs text-slate-600 font-mono">v2.0</span>
        </div>
      </div>
    </footer>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">

      {/* 1. Hero Welcome Section */}
      <motion.div {...staggered(0)}>
        <UserProfile />
      </motion.div>

      {/* 2. Summary Cards (ATM Credit Card Style - 2x2 on Mobile, 4x1 on Desktop) */}
      <motion.div {...staggered(0.05)}>
        <SummarySection />
      </motion.div>

      {/* 3. Quick Action Buttons */}
      <motion.div {...staggered(0.1)}>
        <QuickAccess />
      </motion.div>

      {/* 4. Savings Goals */}
      <motion.div {...staggered(0.15)}>
        <SavingsGoals />
      </motion.div>

      {/* 5. Recent Transactions + Daily Tip */}
      <motion.div
        {...staggered(0.2)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
      >
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="lg:col-span-1">
          <DailyTip />
        </div>
      </motion.div>

      <div className="hidden lg:block">
        <DashboardFooter />
      </div>
    </div>
  );
}
