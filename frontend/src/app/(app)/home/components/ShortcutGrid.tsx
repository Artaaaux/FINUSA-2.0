import React from "react";
import Link from "next/link";
import { BarChart3, ScanLine, PiggyBank, BookOpen, Table2, Wrench } from "lucide-react";

const shortcuts = [
  { label: "Monitor", icon: BarChart3, href: "/monitor" },
  { label: "Scan", icon: ScanLine, href: "/receipt-scanner" },
  { label: "Nabung", icon: PiggyBank, href: "/nabung" },
  { label: "Catat", icon: BookOpen, href: "/pembukuan" },
  { label: "Sheets", icon: Table2, href: "/sheets" },
  { label: "Pengaturan", icon: Wrench, href: "/settings" },
];

export function ShortcutGrid() {
  return (
    <div>
        <h2 className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-4">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-400/80" aria-hidden="true" />
          Pintasan Fitur
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {shortcuts.map((shortcut) => (
                <Link
                key={shortcut.href}
                href={shortcut.href}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border-light/40 bg-bg-section p-6 text-center text-slate-300 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-white hover:-translate-y-1"
                >
                <shortcut.icon className="h-8 w-8 transition-transform group-hover:scale-110" />
                <span className="text-sm font-semibold">{shortcut.label}</span>
                </Link>
            ))}
        </div>
    </div>
  );
}
