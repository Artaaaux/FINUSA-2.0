"use client";

import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  FileSpreadsheet, 
  Link2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ArrowLeftRight 
} from "lucide-react";
import { SheetTemplate, SyncFrequency, SyncedSheetItem, SheetDataFilters } from "../../types";
import { SHEET_TEMPLATES, DEFAULT_COLUMN_MAPPINGS } from "../../constants";

interface CreateSheetWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newSheet: SyncedSheetItem) => void;
  initialTemplate?: SheetTemplate | null;
}

export default function CreateSheetWizardModal({
  isOpen,
  onClose,
  onCreated,
  initialTemplate = null,
}: CreateSheetWizardModalProps) {
  const [step, setStep] = useState<number>(initialTemplate ? 2 : 1);
  const [method, setMethod] = useState<"template" | "blank" | "import">(
    initialTemplate ? "template" : "template"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<SheetTemplate | null>(
    initialTemplate || SHEET_TEMPLATES[0]
  );
  const [title, setTitle] = useState(
    initialTemplate ? `FINUSA - ${initialTemplate.name}` : "FINUSA - Rekap Pembukuan Otomatis"
  );
  const [tabName, setTabName] = useState("Sheet1");
  const [frequency, setFrequency] = useState<SyncFrequency>("realtime");
  const [bidirectional, setBidirectional] = useState(true);
  const [importUrl, setImportUrl] = useState("");
  const [dateRange, setDateRange] = useState<SheetDataFilters["dateRange"]>("this_year");

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    const generatedId = `sheet-${Date.now()}`;
    const generatedGoogleId = method === "import" && importUrl.includes("/d/")
      ? importUrl.split("/d/")[1].split("/")[0]
      : `1${Math.random().toString(36).substring(2, 15)}XFinusa`;

    const newSheet: SyncedSheetItem = {
      id: generatedId,
      googleSheetId: generatedGoogleId,
      sheetTitle: title.trim() || "FINUSA Spreadsheet Baru",
      sheetUrl: `https://docs.google.com/spreadsheets/d/${generatedGoogleId}/edit`,
      sheetTabName: tabName.trim() || "Sheet1",
      syncFrequency: frequency,
      isActive: true,
      bidirectional: bidirectional,
      lastSyncAt: new Date().toISOString(),
      nextSyncAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
      syncStatus: "synced",
      lastError: null,
      rowCount: selectedTemplate?.sampleRows.length ? selectedTemplate.sampleRows.length + 15 : 25,
      templateId: method === "template" && selectedTemplate ? selectedTemplate.id : undefined,
      templateCategory: method === "template" && selectedTemplate ? selectedTemplate.category : undefined,
      filters: {
        dateRange: dateRange,
        categories: ["Semua"],
        accounts: ["Semua Rekening"],
        transactionStatus: "all",
      },
      columnMappings: DEFAULT_COLUMN_MAPPINGS,
      sharedUsers: [
        {
          id: `usr-${Date.now()}`,
          email: "artaaaux.finance@gmail.com",
          name: "Pemilik Akun (Anda)",
          permission: "owner",
          addedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };

    onCreated(newSheet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              <span>Tambah Spreadsheet Terhubung</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Langkah {step} dari 3: {step === 1 ? "Pilih Metode" : step === 2 ? "Konfigurasi & Templat" : "Review & Buat"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 py-4 border-b border-slate-800/60">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : step > s
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? "bg-emerald-500/40" : "bg-slate-800"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="py-5 min-h-[300px]">
          {/* STEP 1: Method Selection */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 mb-2">
                Pilih cara membuat integrasi Google Sheets:
              </div>

              {/* Option 1: Template */}
              <div
                onClick={() => { setMethod("template"); }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  method === "template"
                    ? "bg-blue-500/10 border-blue-500/50 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Gunakan Templat Finusa (Direkomendasikan)</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Buat spreadsheet otomatis berisi formula rekap, grafik pivot, dan struktur kolom keuangan terstandarisasi.
                  </p>
                </div>
              </div>

              {/* Option 2: Blank */}
              <div
                onClick={() => { setMethod("blank"); }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  method === "blank"
                    ? "bg-blue-500/10 border-blue-500/50 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">Buat Spreadsheet Kosong</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Finusa akan membuat spreadsheet baru di Google Drive Anda dengan header kolom baku (Tanggal, Kategori, Nominal, dll).
                  </p>
                </div>
              </div>

              {/* Option 3: Import URL */}
              <div
                onClick={() => { setMethod("import"); }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  method === "import"
                    ? "bg-blue-500/10 border-blue-500/50 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Link2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">Hubungkan Google Sheets yang Sudah Ada</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tempel link URL spreadsheet Google Drive Anda dan lakukan pemetaan kolom data yang ada.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Configuration & Details */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Template Picker if method is template */}
              {method === "template" && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Pilih Desain Templat Keuangan
                  </label>
                  <select
                    value={selectedTemplate?.id || ""}
                    onChange={(e) => {
                      const found = SHEET_TEMPLATES.find((t) => t.id === e.target.value);
                      setSelectedTemplate(found || null);
                      if (found) setTitle(`FINUSA - ${found.name}`);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {SHEET_TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.categoryLabel})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Import URL field if method is import */}
              {method === "import" && (
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    URL Google Sheets
                  </label>
                  <input
                    type="url"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1AbC.../edit"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pastikan akun Google Anda memiliki hak akses Edit ke sheet ini.
                  </p>
                </div>
              )}

              {/* Sheet Title */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Judul Spreadsheet di Google Drive
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: FINUSA - Pembukuan 2024"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tab Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Nama Tab / Worksheet
                  </label>
                  <input
                    type="text"
                    value={tabName}
                    onChange={(e) => setTabName(e.target.value)}
                    placeholder="Sheet1"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Frekuensi Sinkronisasi
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as SyncFrequency)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="realtime">Real-time (Tiap 5 Menit)</option>
                    <option value="hourly">Tiap 1 Jam</option>
                    <option value="daily">Harian (Pukul 08:00 WIB)</option>
                    <option value="weekly">Mingguan (Tiap Minggu)</option>
                    <option value="manual">Manual (Saat Ditekan)</option>
                  </select>
                </div>
              </div>

              {/* Data Range Filter */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Cakupan Data yang Ditransfer
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as SheetDataFilters["dateRange"])}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="this_year">Semua Transaksi Tahun Ini</option>
                  <option value="this_month">Bulan Berjalan</option>
                  <option value="last_30_days">30 Hari Terakhir</option>
                  <option value="all">Semua Riwayat (Tanpa Batas)</option>
                </select>
              </div>

              {/* Bi-directional Toggle */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
                    <span>Sinkronisasi Dua Arah (Bi-Directional)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Perubahan baris atau penambahan data di Google Sheets akan otomatis diperbarui ke database Finusa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBidirectional(!bidirectional)}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                    bidirectional ? "bg-teal-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      bidirectional ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Summary */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Metode Pembuatan:</span>
                  <span className="text-xs font-bold text-white capitalize">{method}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Nama Spreadsheet:</span>
                  <span className="text-xs font-semibold text-slate-200">{title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Tab Aktif:</span>
                  <span className="text-xs font-mono text-slate-300">{tabName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Jadwal Sinkronisasi:</span>
                  <span className="text-xs font-medium text-blue-400 capitalize">{frequency}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Arah Sinkronisasi:</span>
                  <span className="text-xs font-medium text-teal-400">
                    {bidirectional ? "Dua Arah (Finusa ⇄ Google Sheets)" : "Satu Arah (Finusa → Sheets)"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Filter Tanggal:</span>
                  <span className="text-xs text-slate-300 font-mono">{dateRange}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                <p>
                  Finusa akan langsung membuat baris header dan melakukan transfer batch perdana setelah Anda mengonfirmasi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors cursor-pointer"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Buat & Mulai Sinkronisasi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
