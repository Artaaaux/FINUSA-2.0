"use client";

import React, { useState } from "react";
import AppSidebar from "@/shared/components/layout/AppSidebar";
import AppNavbar from "@/shared/components/layout/AppNavbar";
import AdaptiveBottomNav from "@/shared/components/layout/AdaptiveBottomNav";
import PageTransition from "@/shared/components/layout/PageTransition";
import { cn } from "@/shared/lib/utils";
import { UserProfileProvider } from "@/lib/context/UserProfileContext";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <UserProfileProvider>
    <div className="min-h-screen text-slate-200 bg-[#0F1419]">

      {/* ── Ambient Background ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(75,123,255,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(42,157,143,0.05) 0%, transparent 60%), #0F1419",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* ── Subtle noise texture ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* ── Desktop Sidebar & Top Navbar ── */}
      <AppSidebar isCollapsed={isCollapsed} onCollapseToggle={() => setIsCollapsed(!isCollapsed)} />
      <AppNavbar isCollapsed={isCollapsed} />

      {/* ── Mobile Adaptive Bottom Navigation Bar ── */}
      <AdaptiveBottomNav />

      {/* ── Main content with Route Transition ── */}
      <main
        className={cn(
          "relative pt-[56px] lg:pt-[64px] pb-[100px] lg:pb-8 transition-all duration-300 min-h-screen",
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[250px]"
        )}
        style={{ zIndex: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
    </UserProfileProvider>
  );
}
