"use client";

import * as React from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  label: string;
  href: string;
}

const navItems: MenuItem[] = [
  { label: "Beranda", href: "#beranda" },
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Tujuan", href: "#tujuan" },
  { label: "Tentang", href: "#about" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("Beranda");
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Scroll detection for header background
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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

  // Scrollspy to update active item
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
    e.preventDefault();
    setActiveItem(item.label);
    setIsOpen(false);
    if (item.href.startsWith("#")) {
      const targetId = item.href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = `/${item.href}`;
      }
    } else {
      window.location.href = item.href;
    }
  };

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-navy-950/85 backdrop-blur-xl border-b border-white/[0.08] shadow-lg shadow-black/20" 
          : "bg-navy-950/60 backdrop-blur-md border-b border-white/[0.05]"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        
        {/* Brand Logo: Clean Logo Mark */}
        <a 
          href="#beranda" 
          onClick={(e) => handleNavClick(e, navItems[0])}
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
          aria-label="Finusa Beranda"
        >
          <div className="relative w-10 h-10 flex items-center justify-center p-1 rounded-xl bg-white/[0.03] border border-white/10 group-hover:border-blue-500/40 transition-all duration-300 shadow-sm">
            <img 
              src="/Assets/logo-mark.png" 
              alt="Finusa Icon" 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Finusa
          </span>
        </a>

        {/* Desktop Navigation Links: Stitch Glass Pill */}
        <nav 
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-1.5 bg-navy-900/60 p-1.5 rounded-full border border-white/[0.08] backdrop-blur-md shadow-inner"
        >
          {navItems.map((item) => {
            const isActive = activeItem === item.label;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600/25 text-blue-400 border border-blue-500/35 shadow-[0_0_15px_rgba(22,135,255,0.25)] font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex px-5 py-2 rounded-xl text-sm font-medium text-slate-200 hover:text-white hover:bg-white/[0.08] transition border border-transparent hover:border-white/10"
          >
            Masuk
          </Link>
          
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-[0_0_20px_rgba(22,135,255,0.4)] hover:shadow-[0_0_25px_rgba(22,135,255,0.6)] transition transform active:scale-95 duration-200"
          >
            <span>Mulai Gratis</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2.5 text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 md:hidden transition"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-visibility ${
          isOpen ? "visible" : "invisible delay-300"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <aside
          className={`absolute right-0 top-0 flex h-full w-[300px] flex-col border-l border-white/10 bg-navy-950/95 backdrop-blur-2xl transition-transform duration-300 ease-out shadow-2xl ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div className="flex items-center gap-2.5">
              <img src="/Assets/logo-mark.png" alt="Finusa" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-white">Finusa</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white transition"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-1 flex-col gap-1.5 px-4 py-6 overflow-y-auto">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  activeItem === item.label
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-500">→</span>
              </a>
            ))}
          </nav>

          {/* Drawer Footer Actions */}
          <div className="border-t border-white/10 p-5 space-y-3 bg-navy-900/40">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.08] hover:text-white transition"
            >
              Masuk ke Akun
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-glow-blue transition active:scale-95"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </aside>
      </div>
    </header>
  );
}

export default Navbar;
