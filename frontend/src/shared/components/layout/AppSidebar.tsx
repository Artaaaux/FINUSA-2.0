"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { SidebarNav } from "@/shared/components/ui/dashboard-sidebar";

export default function AppSidebar({
  isCollapsed,
  onCollapseToggle,
}: {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden lg:flex fixed top-0 left-0 bottom-0 flex-col transition-all duration-300 z-30 bg-[#0F1419] border-r border-slate-800",
        isCollapsed ? "w-[72px]" : "w-[250px]"
      )}
    >
      <SidebarNav 
        isCollapsed={isCollapsed}
        onCollapseToggle={onCollapseToggle}
      />
    </aside>
  );
}