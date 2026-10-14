"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ArrowRight,
  Home,
  Sparkles,
  Lightbulb,
  Target,
  ChevronRight,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: MenuItem[] = [
  { label: "Beranda", href: "#beranda", icon: Home },
  { label: "Fitur", href: "#fitur", icon: Sparkles },
  { label: "Langkah Cerdas", href: "#langkah-cerdas", icon: Lightbulb },
  { label: "Tabungan Impian", href: "#tabungan-impian", icon: Target },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("Beranda");
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Sliding pill capsule geometry
  const navCapsuleRef = React.useRef<HTMLElement | null>(null);
  const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = React.useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Calculate sliding pill position relative to parent capsule
  const updatePill = React.useCallback(() => {
    const activeIndex = navItems.findIndex((item) => item.label === activeItem);
    const activeEl = itemRefs.current[activeIndex];
    const containerEl = navCapsuleRef.current;

    if (activeEl && containerEl) {
      const left = activeEl.offsetLeft;
      const width = activeEl.offsetWidth;
      setPillStyle({ left, width, opacity: 1 });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeItem]);

  // Recalculate on activeItem change and window resize
  React.useEffect(() => {
    updatePill();
    const timer = setTimeout(updatePill, 60);
    const handleResize = () => updatePill();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [updatePill]);

  // Scroll detection for header background with rAF throttle & state guard
  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextScrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Scrollspy to update active item on landing page
  React.useEffect(() => {
    const sectionIds = navItems
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.substring(1));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const matched = navItems.find((item) => item.href === `#${entry.target.id}`);
            if (matched) {
              setActiveItem(matched.label);
            }
          }
        });
      },
      { threshold: 0.2, rootMargin: "-20% 0px -40% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: MenuItem) => {
    setActiveItem(item.label);
    setIsOpen(false);

    if (item.href.startsWith("#")) {
      e.preventDefault();
      const targetId = item.href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = `/${item.href}`;
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 px-3 sm:px-6 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
        {/* Ambient Atmospheric Glow Behind Navbar */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[720px] max-w-[95vw] h-28 bg-[radial-gradient(ellipse_at_center,rgba(22,135,255,0.20)_0%,rgba(28,216,210,0.08)_40%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1360px] mx-auto pointer-events-auto">
          <div
            className={`w-full rounded-2xl md:rounded-[22px] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300 ${
              isScrolled
                ? "bg-[#06122c]/85 border border-white/[0.12] backdrop-blur-2xl backdrop-saturate-[190%] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.16),0_24px_48px_-12px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(22,135,255,0.2)]"
                : "bg-gradient-to-b from-[#0a1838]/75 via-[#06122c]/70 to-[#040e24]/75 border border-white/[0.09] backdrop-blur-2xl backdrop-saturate-[190%] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_20px_40px_-15px_rgba(1,4,15,0.7),0_0_30px_-5px_rgba(22,135,255,0.12)]"
            }`}
          >
            {/* 1. LEFT: Finusa Logo with Apple Jewel Bezel */}
            <a
              href="#beranda"
              onClick={(e) => handleNavClick(e, navItems[0])}
              className="flex items-center gap-3 sm:gap-3.5 group select-none shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Finusa Beranda"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#1687ff] via-[#105fd4] to-[#042468] p-[1.5px] shadow-[0_4px_16px_rgba(22,135,255,0.35)] flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-[#081534] rounded-[10px] flex items-center justify-center relative p-1">
                  <Image
                    src="/Assets/logo-mark-80.webp"
                    alt="Finusa Icon"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-1 leading-none font-sans">
                  Finusa
                </span>
                <span className="text-[9px] uppercase tracking-wider text-blue-300/70 font-semibold mt-1">
                  Finance Companion
                </span>
              </div>
            </a>

            {/* 2. CENTER: Apple VisionOS / macOS Sliding Nav Capsule */}
            <nav
              ref={navCapsuleRef}
              aria-label="Navigasi Utama"
              className="hidden md:flex items-center relative rounded-full p-1 bg-[#040d1f]/60 border border-white/[0.08] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08),0_4px_14px_rgba(0,0,0,0.3)] backdrop-blur-md mx-2 lg:mx-4"
            >
              {/* Interactive Sliding Indicator Pill */}
              <div
                className="sliding-pill absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-blue-600/35 via-blue-500/30 to-cyan-500/25 border border-blue-400/45 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_4px_16px_rgba(22,135,255,0.45)] pointer-events-none transition-all duration-300"
                style={{
                  left: `${pillStyle.left}px`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                aria-hidden="true"
              />

              {navItems.map((item, idx) => {
                const isActive = activeItem === item.label;
                return (
                  <a
                    key={item.label}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`relative z-10 px-4 lg:px-5 py-1.5 text-[13.5px] lg:text-[14px] rounded-full transition-colors duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-300 hover:text-white font-medium"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* 3. RIGHT: Apple-Style Modern Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Apple Frosted Glass Button: Masuk */}
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full text-[13px] sm:text-[14px] font-semibold text-slate-200 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] hover:border-white/[0.28] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_0_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Masuk
              </Link>

              {/* Apple Glowing VisionOS Primary Pill Button: Mulai Gratis */}
              <Link
                href="/auth/signup"
                className="group inline-flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] font-semibold text-white bg-gradient-to-r from-[#258bff] via-[#0d6efd] to-[#0856cb] hover:from-[#3aa0ff] hover:via-[#1778ff] hover:to-[#0a61e3] border border-cyan-300/40 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),0_8px_24px_-4px_rgba(22,135,255,0.55),0_2px_6px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.6),0_12px_30px_-4px_rgba(22,135,255,0.75),0_0_20px_rgba(28,216,210,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Mulai Gratis</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                aria-label={isOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none delay-300"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`fixed right-0 top-0 bottom-0 flex h-full h-[100dvh] w-[310px] max-w-[85vw] flex-col border-l border-white/[0.1] bg-[#03091e]/95 backdrop-blur-2xl transition-transform duration-300 ease-out shadow-[-24px_0_60px_rgba(0,0,0,0.85)] ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#1687ff] via-[#105fd4] to-[#042468] p-[1px] shadow-[0_2px_10px_rgba(22,135,255,0.3)] flex items-center justify-center">
                <div className="w-full h-full bg-[#081534] rounded-[7px] flex items-center justify-center p-0.5">
                  <Image
                    src="/Assets/logo-mark-80.webp"
                    alt="Finusa"
                    width={26}
                    height={26}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white font-sans leading-none">Finusa</span>
                <span className="text-[9px] uppercase tracking-wider text-blue-300/70 font-semibold mt-0.5">
                  Finance Companion
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/10 transition cursor-pointer"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-1 flex-col gap-2 px-4 py-6 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all group ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_12px_rgba(22,135,255,0.25)]"
                          : "bg-white/[0.04] text-slate-400 border border-white/5 group-hover:text-white group-hover:bg-white/[0.08] group-hover:border-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="tracking-tight">{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-all ${
                      isActive
                        ? "text-blue-400 translate-x-0.5"
                        : "text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Drawer Footer Actions */}
          <div className="border-t border-white/10 p-5 space-y-3 bg-[#020817]/80 backdrop-blur-xl">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] py-3 text-sm font-semibold text-slate-200 hover:text-white transition"
            >
              Masuk ke Akun
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#258bff] via-[#0d6efd] to-[#0856cb] hover:from-[#3aa0ff] hover:to-[#0a61e3] py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(22,135,255,0.4)] transition active:scale-95 duration-200"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

export default Navbar;
