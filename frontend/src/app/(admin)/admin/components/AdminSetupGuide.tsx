"use client";

import React, { useState } from "react";
import { Database, Key, CheckCircle2, Copy, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { getAdminEmails } from "@/lib/auth/admin";

interface AdminSetupGuideProps {
  currentUserEmail: string;
}

export function AdminSetupGuide({ currentUserEmail }: AdminSetupGuideProps) {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const sampleSqlQuery = currentUserEmail
    ? `UPDATE public.profiles \nSET system_role = 'super_admin' \nWHERE email = '${currentUserEmail}';`
    : `UPDATE public.profiles \nSET system_role = 'super_admin' \nWHERE email = 'email_anda@gmail.com';`;

  const sampleEnvConfig = `ADMIN_EMAILS=${currentUserEmail || "email_anda@gmail.com"},admin@finusa.web.id\nNEXT_PUBLIC_ADMIN_EMAILS=${currentUserEmail || "email_anda@gmail.com"},admin@finusa.web.id`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sampleSqlQuery);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnvConfig);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const envAdminEmails = getAdminEmails();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Database Migration / SQL */}
        <div className="relative overflow-hidden rounded-2xl bg-[#090F21]/80 backdrop-blur-xl border border-white/[0.08] p-6 space-y-4 shadow-[0_15px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Metode 1: Supabase SQL Query
              </h3>
              <p className="text-xs text-slate-400">
                Aktifkan hak akses admin permanen via database PostgreSQL
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Buka menu <strong>SQL Editor</strong> di dashboard Supabase Anda, jalankan berkas migrasi{" "}
            <code className="text-blue-300 bg-blue-950/60 border border-blue-500/30 px-1.5 py-0.5 rounded-md font-mono text-[11px]">
              supabase/migrations/02_simple_admin_setup.sql
            </code>
            , kemudian jalankan query di bawah ini:
          </p>

          <div className="relative group">
            <pre className="bg-[#050813] border border-white/[0.08] rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto shadow-inner leading-relaxed">
              {sampleSqlQuery}
            </pre>
            <button
              onClick={handleCopySql}
              aria-label="Salin query SQL"
              className="absolute top-3 right-3 p-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-slate-200 transition-all active:scale-95 shadow-sm"
              title="Salin Query"
            >
              {copiedSql ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-sans font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-sans">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin SQL</span>
                </div>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Setelah menjalankan query tersebut di Supabase, akun Anda langsung memiliki hak{" "}
              <strong className="text-emerald-300">super_admin</strong> dengan wewenang mengelola peran pengguna lainnya.
            </span>
          </div>
        </div>

        {/* Method 2: Environment Variable */}
        <div className="relative overflow-hidden rounded-2xl bg-[#090F21]/80 backdrop-blur-xl border border-white/[0.08] p-6 space-y-4 shadow-[0_15px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Metode 2: Environment Variable (.env.local)
              </h3>
              <p className="text-xs text-slate-400">
                Otorisasi langsung via konfigurasi tanpa menyentuh tabel database
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Anda juga dapat mendaftarkan email admin langsung ke dalam berkas{" "}
            <code className="text-purple-300 bg-purple-950/60 border border-purple-500/30 px-1.5 py-0.5 rounded-md font-mono text-[11px]">
              frontend/.env.local
            </code>{" "}
            (dipisahkan tanda koma jika lebih dari satu akun):
          </p>

          <div className="relative group">
            <pre className="bg-[#050813] border border-white/[0.08] rounded-xl p-4 text-xs font-mono text-purple-300 overflow-x-auto shadow-inner leading-relaxed">
              {sampleEnvConfig}
            </pre>
            <button
              onClick={handleCopyEnv}
              aria-label="Salin konfigurasi env"
              className="absolute top-3 right-3 p-2 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-slate-200 transition-all active:scale-95 shadow-sm"
              title="Salin Konfigurasi"
            >
              {copiedEnv ? (
                <div className="flex items-center gap-1.5 text-purple-400 text-[11px] font-sans font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-sans">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Env</span>
                </div>
              )}
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-slate-300 block">
              Daftar Email Admin yang Terdeteksi Saat Ini:
            </span>
            {envAdminEmails.length === 0 ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Belum ada email yang diatur di variabel ADMIN_EMAILS. Gunakan Metode 1 atau tambahkan ke .env.local.</span>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {envAdminEmails.map((email) => (
                  <span
                    key={email}
                    className="px-3 py-1 rounded-lg text-xs font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium"
                  >
                    {email}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Best Practices Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0A132B]/70 to-[#0C1938]/70 backdrop-blur-xl border border-white/[0.08] p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">
              Panduan Keamanan Hak Akses (Principle of Least Privilege)
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Hanya berikan peran <strong>Super Admin</strong> dan <strong>Admin</strong> kepada personel terpercaya yang bertanggung jawab atas pemeliharaan sistem. Seluruh tindakan perubahan role terlindungi oleh Row Level Security (RLS) PostgreSQL dan diverifikasi melalui Admin Guard middleware.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
