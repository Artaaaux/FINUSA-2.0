"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  RefreshCw, 
  Unlink, 
  Link2, 
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { GoogleAccountInfo } from "../types";

interface GoogleAccountBannerProps {
  accountInfo: GoogleAccountInfo;
  onToggleAutoSync: (enabled: boolean) => void;
  onToggleConnection: () => void;
  onReconnect: () => void;
}

export default function GoogleAccountBanner({
  accountInfo,
  onToggleAutoSync,
  onToggleConnection,
  onReconnect,
}: GoogleAccountBannerProps) {
  const [showScopes, setShowScopes] = useState(false);

  return (
    <div className="rounded-2xl bg-[#1a1f2e] border border-slate-800/80 p-4 sm:p-5 shadow-lg transition-all hover:border-slate-700/80 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Account Identity & Status */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600/30 via-teal-500/20 to-indigo-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg shadow-inner shrink-0">
              G
            </div>
            <span 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#1a1f2e] ${
                accountInfo.isConnected ? "bg-emerald-500" : "bg-rose-500"
              }`}
              title={accountInfo.isConnected ? "Akun aktif" : "Terputus"}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-white">
                {accountInfo.isConnected ? accountInfo.name : "Akun Google Belum Terhubung"}
              </h3>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                accountInfo.isConnected 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {accountInfo.isConnected ? "OAuth 2.0 Aktif" : "Menunggu Otorisasi"}
              </span>
            </div>
            
            <p className="text-xs text-slate-400">
              {accountInfo.isConnected ? (
                <>
                  <span className="text-slate-300 font-mono">{accountInfo.email}</span>
                  {" • "}
                  Terkoneksi sejak {new Date(accountInfo.connectedAt).toLocaleDateString("id-ID", { month: "short", year: "numeric", day: "numeric" })}
                </>
              ) : (
                "Hubungkan akun Google Drive & Spreadsheet Anda untuk mengaktifkan sinkronisasi otomatis."
              )}
            </p>
          </div>
        </div>

        {/* Right: Controls & Auto-sync switch */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/60">
          {accountInfo.isConnected ? (
            <>
              {/* Auto Sync Toggle */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-200">Auto-Sync</div>
                  <div className="text-[10px] text-slate-400">Tiap 5 menit</div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleAutoSync(!accountInfo.autoSyncEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                    accountInfo.autoSyncEnabled ? "bg-blue-600" : "bg-slate-700"
                  }`}
                  aria-label="Toggle Auto-Sync"
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      accountInfo.autoSyncEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* API Quota indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">Kuota API:</span>
                <span className="font-mono text-slate-200">{accountInfo.quotaUsedPercent}%</span>
              </div>

              {/* Action buttons */}
              <button
                type="button"
                onClick={onReconnect}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer"
                title="Perbarui Otorisasi Token"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onToggleConnection}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 transition-colors cursor-pointer"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span>Putus Akun</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onToggleConnection}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-400/30 cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              <span>Hubungkan Akun Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Scopes and Security Info */}
      {accountInfo.isConnected && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <button
            type="button"
            onClick={() => setShowScopes(!showScopes)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors text-left cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Izin Akses Terenkripsi (3 scopes aktif)</span>
            {showScopes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              Pembaruan Terakhir: {new Date(accountInfo.lastUsedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
            </span>
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:underline"
            >
              <span>Kelola di Google</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {showScopes && (
        <div className="mt-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
          <div className="text-slate-300 font-medium">Izin yang diberikan ke Finusa:</div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] font-mono">
            <li>https://www.googleapis.com/auth/spreadsheets (Baca & Tulis Spreadsheet)</li>
            <li>https://www.googleapis.com/auth/drive.file (Membuat file spreadsheet baru atas nama pengguna)</li>
            <li>https://www.googleapis.com/auth/drive.readonly (Melihat daftar spreadsheet di Google Drive Anda)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
