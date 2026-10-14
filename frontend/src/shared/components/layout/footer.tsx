import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer id="about" className="border-t border-white/[0.08] bg-[#020716] py-16 relative z-10 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/Assets/logo-full-320.webp" 
                alt="FINUSA Finance Nusantara" 
                width={160}
                height={40}
                className="h-10 w-auto object-contain brightness-110" 
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform manajemen finansial pintar bertenaga AI untuk generasi muda Indonesia. Mencatat pengeluaran otomatis, menabung impian, dan membangun masa depan yang stabil.
            </p>
          </div>

          {/* Links 1 - Produk */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-sans">Produk &amp; Modul</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/bantuan/cara-pakai-scan-ai" className="hover:text-cyan-400 transition-colors">
                  Struk Scan
                </Link>
              </li>
              <li>
                <Link href="#fitur" className="hover:text-cyan-400 transition-colors">
                  Fitur Unggulan
                </Link>
              </li>
              <li>
                <Link href="/bantuan/konsep-tabungan" className="hover:text-cyan-400 transition-colors">
                  Target Tabungan
                </Link>
              </li>
              <li>
                <Link href="/bantuan/ringkasan-arus-kas" className="hover:text-cyan-400 transition-colors">
                  Monitor Likuiditas
                </Link>
              </li>
              <li>
                <Link href="/bantuan/alur-catat-transaksi" className="hover:text-cyan-400 transition-colors">
                  Buku Catat Kas
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 - Bantuan */}
          <div className="space-y-3.5">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-sans">Bantuan &amp; Panduan</p>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/bantuan" className="hover:text-cyan-400 transition-colors">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link href="/bantuan" className="hover:text-cyan-400 transition-colors">
                  Dokumentasi Fitur
                </Link>
              </li>
              <li>
                <Link href="/bantuan/menghubungkan-google-sheets" className="hover:text-cyan-400 transition-colors">
                  Template Spreadsheet
                </Link>
              </li>
              <li>
                <Link href="/bantuan/tips-akurasi-scan-ai" className="hover:text-cyan-400 transition-colors">
                  Tips Scan Struk
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

        {/* Footer Credit */}
        <div className="pt-8 flex items-center justify-center text-xs text-slate-500">
          <span className="text-slate-400">Developed by artaaaux developer</span>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
