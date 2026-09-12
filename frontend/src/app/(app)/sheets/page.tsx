"use client";

import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { SHEET_TEMPLATES } from "./constants";
import TemplateCard from "./components/TemplateCard";

export default function SheetsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800/60 mb-2">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Template Spreadsheet
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
          Download template keuangan dalam format <code className="text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded text-[11px]">.xlsx</code> — bisa langsung dibuka di Excel, Google Sheets, atau aplikasi spreadsheet lainnya.
        </p>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="text-slate-200 font-medium">Cara pakai:</span> Pilih template yang sesuai, klik Download, lalu buka file-nya. Kamu bisa langsung mengisi data di atas contoh yang ada, atau hapus baris contoh dan mulai dari awal.
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SHEET_TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
