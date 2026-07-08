"use client";

import * as React from "react";
import { Menu, X, Home, Blocks , Info, LogIn  } from "lucide-react";

import { GlassButton } from "@/shared/components/ui/glass-button";
import { MenuBar } from "@/shared/components/ui/glow-menu";
import logoImg from "../../../../public/Assets/Logo.png";

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "#home",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Blocks ,
    label: "Feature",
    href: "#features",
    gradient:
      "radial-gradient(circle, rgba(0,217,255,0.15) 0%, rgba(0,217,255,0.06) 50%, rgba(0,217,255,0) 100%)",
    iconColor: "text-accent-cyan",
  },
  {
    icon: Info,
    label: "Tentang",
    href: "#about",
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-accent-green",
  },
  {
    icon: LogIn,
    label: "Daftar",
    href: "#trust",
    gradient:
      "radial-gradient(circle, rgba(167,139,250,0.15) 0%, rgba(167,139,250,0.06) 50%, rgba(167,139,250,0) 100%)",
    iconColor: "text-accent-purple",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("Home");

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

  // Scrollspy feature to set active MenuBar item dynamically
  React.useEffect(() => {
    const sections = menuItems.map((item) =>
      document.getElementById(item.href.substring(1))
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const item = menuItems.find(
              (m) => m.href.substring(1) === entry.target.id
            );
            if (item) {
              setActiveItem(item.label);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: "-10% 0px -40% 0px" }
    );

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    setIsOpen(false);
    const item = menuItems.find((m) => m.label === label);
    if (item) {
      const element = document.getElementById(item.href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md"
        aria-label="Navigasi utama"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}

          <a
            href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleItemClick("Home");
              }}
              className="flex min-h-11 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="FINUSA beranda"
            >
              <img 
                src={logoImg.src} 
                alt="FINUSA Logo"
                className="h-9 w-auto object-contain ml-1 sm:ml-2"
              />
            </a>
          {/* Desktop Nav using the MenuBar (glow-menu) component */}
          <div className="hidden items-center md:flex">
            <MenuBar
              items={menuItems}
              activeItem={activeItem}
              onItemClick={handleItemClick}
              className="border-slate-800 bg-slate-900/40"
            />
          </div>

          {/* Desktop Actions + Mobile Burger */}
          <div className="flex items-center gap-4">
            <a
              href="/auth/login"
              className="hidden text-sm font-semibold text-gray-400 transition-colors duration-200 hover:text-accent-cyan sm:inline"
            >
              Login
            </a>
            <GlassButton asChild size="default" className="hidden sm:inline-flex">
              <a href="/auth/signup">Mulai Gratis</a>
            </GlassButton>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 transition-colors hover:bg-slate-800 md:hidden"
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            >
              {isOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-visibility ${isOpen ? "visible" : "invisible delay-300"}`}
        aria-hidden={!isOpen}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer panel */}
        <aside
          className={`absolute right-0 top-0 flex h-full w-72 flex-col border-l border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <span className="text-sm font-semibold tracking-wide text-white/70 uppercase">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 transition-colors hover:bg-slate-800"
              aria-label="Tutup menu"
            >
              <X size={20} className="text-white/70" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
            {menuItems.map((item, i) => (
              <button
                key={item.label}
                onClick={() => handleItemClick(item.label)}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  activeItem === item.label
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                style={{
                  transitionDelay: isOpen ? `${75 + i * 50}ms` : "0ms",
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? "translateX(0)" : "translateX(20px)",
                  transition: `opacity 300ms ease ${isOpen ? 75 + i * 50 : 0}ms, transform 300ms ease ${isOpen ? 75 + i * 50 : 0}ms, background-color 200ms, color 200ms`,
                }}
              >
                <item.icon className={`h-5 w-5 ${activeItem === item.label ? item.iconColor : "text-gray-500 group-hover:text-gray-300"} transition-colors duration-200`} />
                {item.label}
                {activeItem === item.label && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                )}
              </button>
            ))}
          </nav>

          {/* Drawer footer */}
          <div className="border-t border-slate-800 px-4 py-5 space-y-3">
            <a
              href="/auth/login"
              className="flex items-center justify-center rounded-lg border border-slate-700 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-slate-600 hover:text-white"
            >
              Login
            </a>
            <GlassButton asChild size="default" className="w-full">
              <a href="/auth/signup">Mulai Gratis</a>
            </GlassButton>
          </div>
        </aside>
      </div>
    </header>
  );
}
