"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const prevPathname = useRef(pathname);

  // Trigger loading & blur animation whenever pathname changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIsNavigating(true);
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 360);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Intercept internal link clicks to trigger blur immediately on click
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href && target.href.startsWith(window.location.origin)) {
        try {
          const targetUrl = new URL(target.href);
          const targetPath = targetUrl.pathname;
          if (
            targetPath !== pathname &&
            !target.hasAttribute("download") &&
            target.getAttribute("target") !== "_blank"
          ) {
            setIsNavigating(true);
          }
        } catch {
          // ignore parsing error
        }
      }
    };

    document.addEventListener("click", handleLinkClick);
    return () => document.removeEventListener("click", handleLinkClick);
  }, [pathname]);

  return (
    <div className="relative w-full">
      {/* ── Top Ambient Luminous Sweep on Navigation ── */}
      <motion.div
        key={`glow-${pathname}`}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-[52px] lg:top-[60px] inset-x-0 h-[2px] bg-gradient-to-r from-blue-600 via-teal-400 to-emerald-400 origin-left z-50 pointer-events-none shadow-[0_0_12px_rgba(75,123,255,0.8)]"
        aria-hidden="true"
      />

      {/* ── Fullscreen Screen Blur & Floating Loading Badge ── */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#0F1419]/45 backdrop-blur-md flex items-center justify-center pointer-events-none"
            aria-live="polite"
            aria-busy="true"
          >
            {/* High-tech Finusa Loading Card */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="p-5 rounded-2xl bg-[#121722]/90 border border-slate-700/60 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(75,123,255,0.18)] flex flex-col items-center gap-3 min-w-[130px]"
            >
              {/* Dual Ring Spinner with Finusa F glyph */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Outer spinning gradient ring */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-teal-400 animate-spin" />
                
                {/* Center Finusa Badge */}
                <div className="w-8 h-8 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/Assets/LogoIcon.png" 
                    alt="FINUSA Logo" 
                    className="w-6 h-6 object-contain drop-shadow-[0_2px_6px_rgba(0,193,255,0.4)]" 
                  />
                </div>
              </div>

              {/* Status text with animated pulsing dots */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200 tracking-wide">
                  Memuat
                </span>
                <span className="flex gap-1 mt-0.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse [animation-duration:1s]" />
                  <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse [animation-duration:1s] [animation-delay:200ms]" />
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse [animation-duration:1s] [animation-delay:400ms]" />
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Page Content with Smooth De-blur Entrance ── */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1], // Exponential ease-out
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
