"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Blocks,
  ScanLine, 
  CreditCard,
  Activity, 
  Settings 
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface NavItemType {
  id: number;
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  isCenter?: boolean;
}

const defaultNavItems: NavItemType[] = [
  { id: 0, key: "home", label: "Home", href: "/home", icon: <LayoutDashboard size={16} /> },
  { id: 1, key: "catat", label: "Catat", href: "/catat", icon: <FolderKanban size={16} /> },
  { id: 2, key: "sheets", label: "Sheets", href: "/sheets", icon: <Blocks size={16} /> },
  { id: 3, key: "scan", label: "Scan", href: "/receipt-scanner", icon: <ScanLine size={19} />, isCenter: true },
  { id: 4, key: "nabung", label: "Nabung", href: "/nabung", icon: <CreditCard size={16} /> },
  { id: 5, key: "monitor", label: "Monitor", href: "/monitor", icon: <Activity size={16} /> },
  { id: 6, key: "settings", label: "Setting", href: "/settings", icon: <Settings size={16} /> },
];

export const FloatingNav = ({ 
  className,
  customItems
}: { 
  className?: string;
  customItems?: NavItemType[];
}) => {
  const pathname = usePathname();
  const items = customItems || defaultNavItems;

  const getInitialActive = useCallback(() => {
    if (pathname.includes("/receipt-scanner") || pathname.includes("/ai")) return 3;
    if (pathname.startsWith("/catat") || pathname.startsWith("/pembukuan")) return 1;
    if (pathname.startsWith("/sheets")) return 2;
    if (pathname.startsWith("/nabung")) return 4;
    if (pathname.startsWith("/monitor")) return 5;
    if (pathname.startsWith("/settings")) return 6;
    return 0; // default Home
  }, [pathname]);

  const [active, setActive] = useState(getInitialActive);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Synchronize active state with Next.js pathname
  useEffect(() => {
    setActive(getInitialActive());
  }, [getInitialActive]);

  // Update sliding indicator position
  useEffect(() => {
    const updateIndicator = () => {
      // If center scan button is active, hide the standard sliding pill
      if (items[active]?.isCenter) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      if (btnRefs.current[active] && containerRef.current) {
        const btn = btnRefs.current[active];
        const container = containerRef.current;
        if (!btn) return;

        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          width: btnRect.width - 4,
          left: btnRect.left - containerRect.left + 2,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active, items]);

  return (
    <div
      className={cn(
        "fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-[calc(100%-1.75rem)] max-w-md sm:max-w-lg lg:hidden select-none pointer-events-auto",
        className
      )}
      style={{
        marginBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
      }}
    >
      <div
        ref={containerRef}
        className="relative flex items-center justify-between bg-[#121722] shadow-[0_16px_36px_rgba(0,0,0,0.6),0_0_24px_rgba(75,123,255,0.08)] rounded-full px-1.5 py-1 border border-slate-700/60"
      >
        {/* Sliding Active Indicator with spring physics (Circle) */}
        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute top-1 bottom-1 rounded-full bg-blue-500/15 border border-blue-400/30 pointer-events-none shadow-[0_0_12px_rgba(75,123,255,0.25)]"
        />

        {items.map((item, index) => {
          const isActive = active === index;

          if (item.isCenter) {
            return (
              <Link
                key={item.id}
                ref={(el) => { btnRefs.current[index] = el; }}
                href={item.href}
                onClick={() => setActive(index)}
                className="relative flex flex-col items-center justify-center flex-1 h-[54px] py-1 focus:outline-none group z-20"
                aria-label={item.label}
              >
                {/* Elevated Circular Button with proper elevation and breathable spacing */}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative -mt-7 mb-1 flex items-center justify-center"
                >
                  {/* Outer protective ring matching the bar surface */}
                  <div
                    className={cn(
                      "p-1 rounded-full transition-all duration-300 shadow-xl relative",
                      isActive
                        ? "bg-[#121722] ring-2 ring-blue-400/80 shadow-[0_0_22px_rgba(75,123,255,0.45)]"
                        : "bg-[#121722] ring-2 ring-slate-700/80 group-hover:ring-blue-500/50 shadow-[0_6px_20px_rgba(0,0,0,0.55)]"
                    )}
                  >
                    {/* Inner Action Button */}
                    <div
                      className={cn(
                        "w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 relative border overflow-hidden",
                        isActive
                          ? "bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 border-blue-300/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]"
                          : "bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 border-blue-400/35 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]"
                      )}
                    >
                      {/* Inner sheen reflection */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

                      <div className="z-10">{item.icon}</div>
                    </div>

                    {/* AI Pill Badge on the upper right corner */}
                    <span className="absolute -top-1 -right-1 px-1.5 py-px bg-teal-400 text-teal-950 font-black text-[9px] rounded-full shadow-md tracking-tighter border border-[#121722]">
                      AI
                    </span>
                  </div>
                </motion.div>

                {/* Horizontally aligned label matching other items */}
                <span
                  className={cn(
                    "text-[9px] sm:text-[9.5px] tracking-tight font-medium transition-colors duration-200 leading-none",
                    isActive ? "text-blue-400 font-bold" : "text-slate-400 group-hover:text-slate-200"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              ref={(el) => { btnRefs.current[index] = el; }}
              href={item.href}
              onClick={() => setActive(index)}
              className="relative flex flex-col items-center justify-center flex-1 h-[54px] py-1 focus:outline-none group z-10"
              aria-label={item.label}
            >
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center justify-center w-full"
              >
                <div
                  className={cn(
                    "flex items-center justify-center transition-all duration-200",
                    isActive
                      ? "text-blue-400 scale-105"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                >
                  {item.icon}
                </div>
                <span
                  className={cn(
                    "text-[9px] sm:text-[9.5px] tracking-tight mt-1 transition-colors duration-200 truncate max-w-[42px] text-center leading-none",
                    isActive
                      ? "text-blue-400 font-bold"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingNav;
