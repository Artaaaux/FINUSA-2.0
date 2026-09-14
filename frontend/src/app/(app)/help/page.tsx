import React, { Suspense } from "react";
import { HelpCenterLayout } from "@/components/help/HelpCenterLayout";

export const metadata = {
  title: "Pusat Bantuan | FINUSA",
  description: "Panduan lengkap penggunaan fitur FINUSA.",
};

export default function HelpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh] text-slate-500 text-sm">
          Memuat panduan FINUSA...
        </div>
      }
    >
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-3 sm:-my-6 lg:-my-8">
        <HelpCenterLayout isAppShell={true} />
      </div>
    </Suspense>
  );
}
