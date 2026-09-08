"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Save, 
  Table, 
  ArrowRight 
} from "lucide-react";
import { SyncedSheetItem, ColumnMappingItem } from "../../types";

interface ColumnMapperModalProps {
  sheet: SyncedSheetItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveMapping: (sheetId: string, updatedMappings: ColumnMappingItem[]) => void;
}

export default function ColumnMapperModal({
  sheet,
  isOpen,
  onClose,
  onSaveMapping,
}: ColumnMapperModalProps) {
  const [mappings, setMappings] = useState<ColumnMappingItem[]>([]);

  useEffect(() => {
    if (sheet) {
      setMappings(sheet.columnMappings);
    }
  }, [sheet]);

  const samplePreview = [
    { date: "2024-03-15", type: "Pemasukan", category: "Omzet Penjualan", amount: "Rp 4.500.000", description: "Batch 1 Toko", account: "BCA Bisnis" },
    { date: "2024-03-16", type: "Pengeluaran", category: "Bahan Baku", amount: "Rp 1.850.000", description: "Packaging box", account: "Mandiri" },
    { date: "2024-03-17", type: "Pengeluaran", category: "Logistik", amount: "Rp 320.000", description: "Ongkir kurir", account: "GoPay" },
  ];

  if (!isOpen || !sheet) return null;

  const handleHeaderChange = (index: number, newSource: string) => {
    const updated = [...mappings];
    updated[index].sourceColumn = newSource;
    setMappings(updated);
  };

  const handleAutoSuggest = () => {
    const suggested: ColumnMappingItem[] = [
      { sourceColumn: "Tanggal Transaksi", targetField: "date", dataType: "date", isRequired: true },
      { sourceColumn: "Tipe Aliran", targetField: "type", dataType: "string", isRequired: true },
      { sourceColumn: "Kategori Biaya/Omzet", targetField: "category", dataType: "string", isRequired: true },
      { sourceColumn: "Nominal Bersih", targetField: "amount", dataType: "number", isRequired: true },
      { sourceColumn: "Catatan Tambahan", targetField: "description", dataType: "string", isRequired: false },
      { sourceColumn: "Dompet / Akun Kas", targetField: "account", dataType: "string", isRequired: true },
      { sourceColumn: "Status Transaksi", targetField: "status", dataType: "string", isRequired: false, isReadOnly: true },
    ];
    setMappings(suggested);
  };

  const handleSave = () => {
    onSaveMapping(sheet.id, mappings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#1a1f2e] border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-8 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Pemetaan Kolom Spreadsheet
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {sheet.sheetTitle} (Tab: {sheet.sheetTabName})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header */}
        <div className="py-3 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-xs text-slate-400">
            Sesuaikan header kolom di Google Sheets agar data Finusa masuk ke sel yang tepat.
          </p>
          <button
            type="button"
            onClick={handleAutoSuggest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deteksi Otomatis AI</span>
          </button>
        </div>

        {/* Mapping Form List */}
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 py-1">
          {mappings.map((item, index) => (
            <div
              key={item.targetField}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Target Field Info */}
              <div className="sm:w-1/3 space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{item.targetField.toUpperCase()}</span>
                  {item.isRequired && (
                    <span className="text-rose-400 text-[10px]" title="Field Wajib">*Wajib</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Tipe: {item.dataType}</span>
              </div>

              <ArrowRight className="hidden sm:block w-4 h-4 text-slate-600 shrink-0" />

              {/* Source Column Input */}
              <div className="flex-1">
                <label className="text-[10px] text-slate-400 block mb-1">
                  Nama Header di Google Sheets:
                </label>
                <input
                  type="text"
                  value={item.sourceColumn}
                  onChange={(e) => handleHeaderChange(index, e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700/80 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="Nama kolom di sheet"
                />
              </div>

              {/* Status check */}
              <div className="flex items-center gap-1 text-[11px] sm:w-20 justify-end">
                {item.sourceColumn.trim() ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Valid</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Kosong</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview Table */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
            <Table className="w-3.5 h-3.5 text-blue-400" />
            <span>Pratinjau Format Output (3 Baris Contoh):</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono text-slate-300">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  {mappings.map((m) => (
                    <th key={m.targetField} className="px-2.5 py-1.5 whitespace-nowrap">
                      {m.sourceColumn || m.targetField}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {samplePreview.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/20">
                    <td className="px-2.5 py-1.5 whitespace-nowrap">{row.date}</td>
                    <td className="px-2.5 py-1.5 whitespace-nowrap">{row.type}</td>
                    <td className="px-2.5 py-1.5 whitespace-nowrap">{row.category}</td>
                    <td className="px-2.5 py-1.5 whitespace-nowrap">{row.amount}</td>
                    <td className="px-2.5 py-1.5 whitespace-nowrap">{row.description}</td>
                    <td className="px-2.5 py-1.5 whitespace-nowrap">{row.account}</td>
                    <td className="px-2.5 py-1.5 whitespace-nowrap text-emerald-400">Tersinkron</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pemetaan Kolom</span>
          </button>
        </div>
      </div>
    </div>
  );
}
