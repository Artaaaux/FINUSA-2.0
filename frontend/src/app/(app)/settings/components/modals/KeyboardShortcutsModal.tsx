"use client";

import React from "react";
import { 
  X, 
  Keyboard 
} from "lucide-react";
import { KEYBOARD_SHORTCUTS } from "../../constants";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  const categories = Array.from(new Set(KEYBOARD_SHORTCUTS.map((s) => s.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Pintasan Keyboard Finusa
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Navigasi cepat dan catat transaksi tanpa meninggalkan keyboard.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list grouped by category */}
        <div className="py-4 space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {cat}
              </div>
              <div className="space-y-1.5">
                {KEYBOARD_SHORTCUTS.filter((s) => s.category === cat).map((s, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-slate-300">{s.description}</span>
                    <div className="flex items-center gap-1">
                      {s.keyCombo.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 rounded-md bg-slate-950 border border-slate-700 text-slate-200 font-mono text-[11px] font-bold shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
