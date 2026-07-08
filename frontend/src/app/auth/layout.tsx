import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-premium bg-bg-dark min-h-screen w-full flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative select-none">
      {/* Floating Home Button */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <Link
          href="/"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-300 backdrop-blur-md text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Main card wrapper */}
      <div className="w-full max-w-[400px] z-10 flex flex-col items-center">
        {children}
      </div>

      {/* Bottom subtle copyright / branding */}
      <div className="mt-8 text-xs text-slate-600 z-10 pointer-events-none text-center">
        © {new Date().getFullYear()} FINUSA. Hak Cipta Dilindungi.
      </div>
    </div>
  );
}
