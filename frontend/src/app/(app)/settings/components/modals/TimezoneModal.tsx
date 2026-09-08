"use client";

import React, { useState, useEffect } from "react";
import { Clock, Check, X, Globe2 } from "lucide-react";

interface TimezoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimezone: string;
  onSelectTimezone: (tz: string) => void;
}

const TIMEZONES = [
  {
    id: "Asia/Jakarta (WIB)",
    name: "WIB — Waktu Indonesia Barat",
    region: "Sumatra, Jawa, Kalimantan Barat & Tengah",
    utc: "UTC+7",
    offsetHours: 7,
  },
  {
    id: "Asia/Makassar (WITA)",
    name: "WITA — Waktu Indonesia Tengah",
    region: "Bali, Nusa Tenggara, Kalimantan Selatan & Timur, Sulawesi",
    utc: "UTC+8",
    offsetHours: 8,
  },
  {
    id: "Asia/Jayapura (WIT)",
    name: "WIT — Waktu Indonesia Timur",
    region: "Maluku, Maluku Utara, Papua & sekitarnya",
    utc: "UTC+9",
    offsetHours: 9,
  },
  {
    id: "Asia/Singapore (SGT)",
    name: "SGT — Singapore / Malaysia Standard Time",
    region: "Singapura, Semenanjung Malaysia, Sabah, Sarawak",
    utc: "UTC+8",
    offsetHours: 8,
  },
];

export default function TimezoneModal({
  isOpen,
  onClose,
  currentTimezone,
  onSelectTimezone,
}: TimezoneModalProps) {
  const [selected, setSelected] = useState(currentTimezone);
  const [liveTimes, setLiveTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelected(currentTimezone);
  }, [currentTimezone]);

  // Update real-time clock preview
  useEffect(() => {
    if (!isOpen) return;

    const updateClock = () => {
      const now = new Date();
      const times: Record<string, string> = {};

      TIMEZONES.forEach((tz) => {
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const tzDate = new Date(utc + 3600000 * tz.offsetHours);
        const hours = String(tzDate.getHours()).padStart(2, "0");
        const mins = String(tzDate.getMinutes()).padStart(2, "0");
        const secs = String(tzDate.getSeconds()).padStart(2, "0");
        times[tz.id] = `${hours}:${mins}:${secs}`;
      });

      setLiveTimes(times);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = (tzId: string) => {
    setSelected(tzId);
    onSelectTimezone(tzId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full sm:max-w-lg bg-[#161c28] border border-slate-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Pilih Zona Waktu
              </h3>
              <p className="text-xs text-slate-400">
                Penyelarasan waktu transaksi uang masuk & keluar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Note */}
        <div className="my-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-2.5">
          <Globe2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
            Semua catatan keuangan dan sinkronisasi Google Sheets akan secara otomatis disesuaikan dengan zona waktu yang Anda pilih di bawah ini.
          </p>
        </div>

        {/* Timezone List */}
        <div className="space-y-2.5">
          {TIMEZONES.map((tz) => {
            const isCurrent = selected.includes(tz.id.split(" ")[0]) || selected === tz.id;
            return (
              <button
                key={tz.id}
                type="button"
                onClick={() => handleApply(tz.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600/15 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/40"
                    : "bg-[#121722] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {tz.name}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {tz.utc}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {tz.region}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {liveTimes[tz.id] && (
                    <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-950/40 px-2 py-1 rounded border border-blue-800/40">
                      {liveTimes[tz.id]}
                    </span>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isCurrent
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isCurrent && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
