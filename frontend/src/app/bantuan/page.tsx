import React, { Suspense } from "react";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { HelpCenterLayout } from "@/components/help/HelpCenterLayout";

export const metadata = {
  title: "Pusat Bantuan & Panduan Penggunaan | FINUSA",
  description:
    "Dokumentasi lengkap dan panduan operasional seluruh fitur FINUSA: Target Tabungan, Scan Struk AI, Catat Kas, Monitor Arus Kas, Pembukuan Usaha, dan Integrasi Google Sheets.",
};

export default function BantuanPublicPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-slate-500 text-sm">
            Memuat panduan FINUSA...
          </div>
        }
      >
        <HelpCenterLayout isAppShell={false} />
      </Suspense>
      <Footer />
    </>
  );
}
