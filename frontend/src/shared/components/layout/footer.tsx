'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#020716] py-16 relative z-10 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img 
                src="/Assets/logo-full.png" 
                alt="FINUSA Finance Nusantara" 
                width={160}
                height={40}
                loading="lazy"
                className="h-10 w-auto object-contain brightness-110" 
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform manajemen finansial pintar bertenaga AI untuk generasi muda Indonesia. Mencatat pengeluaran otomatis, menabung impian, dan membangun masa depan yang stabil.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/20 text-xs font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                FINUSA v2.0 • 100% Gratis
              </span>
            </div>
          </div>

          {/* Links 1 - Produk */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-sans">Produk</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/receipt-scanner" className="hover:text-cyan-400 transition-colors">
                  AI Scan Struk
                </Link>
              </li>
              <li>
                <Link href="/home" className="hover:text-cyan-400 transition-colors">
                  Dashboard Keuangan
                </Link>
              </li>
              <li>
                <Link href="/nabung" className="hover:text-cyan-400 transition-colors">
                  Target Nabung
                </Link>
              </li>
              <li>
                <Link href="/monitor" className="hover:text-cyan-400 transition-colors">
                  Monitor Likuiditas
                </Link>
              </li>
              <li>
                <Link href="/catat" className="hover:text-cyan-400 transition-colors">
                  Buku Catat Kas
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 - Bantuan */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-sans">Bantuan</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/bantuan" className="hover:text-cyan-400 transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-cyan-400 transition-colors">
                  Panduan Pengguna
                </Link>
              </li>
              <li>
                <Link href="/template" className="hover:text-cyan-400 transition-colors">
                  Template Spreadsheet
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 3 - Legalitas */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-sans">Legalitas</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Keamanan &amp; Enkripsi
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Finusa (Finance Nusantara). Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Dibuat dengan ❤️ untuk kemandirian finansial generasi muda Indonesia</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
