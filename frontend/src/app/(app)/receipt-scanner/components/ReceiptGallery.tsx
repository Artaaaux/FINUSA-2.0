"use client";

import React, { useState } from "react";
import {
  HardDrive,
  Trash2,
  ArrowLeft,
  ZoomIn,
  X,
  ScanLine,
  Loader2,
} from "lucide-react";
import { QuotaInfo, PastReceipt } from "@/shared/hooks/useReceiptScanner";
import { formatBytes } from "@/shared/hooks/useImageOptimizer";
import { formatCurrency } from "@/app/(app)/home/constants";

interface ReceiptGalleryProps {
  quota: QuotaInfo;
  receipts: PastReceipt[];
  isLoading: boolean;
  onBackToScanner: () => void;
  onDeleteReceipt: (id: string, filePath: string) => Promise<void>;
}

export default function ReceiptGallery({
  quota,
  receipts,
  isLoading,
  onBackToScanner,
  onDeleteReceipt,
}: ReceiptGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const usedMB = (quota.totalUsedBytes / (1024 * 1024)).toFixed(2);
  const maxMB = (quota.maxQuotaBytes / (1024 * 1024)).toFixed(0);

  const handleDelete = async (id: string, filePath: string) => {
    if (confirm("Apakah kamu yakin ingin menghapus foto struk ini?")) {
      setDeletingId(id);
      await onDeleteReceipt(id, filePath);
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-[#161c28] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToScanner}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Kembali ke Scanner"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white">
              Galeri & Penyimpanan Struk
            </h1>
            <p className="text-xs text-slate-400">
              Kelola arsip foto struk dan pantau kapasitas kuota 5MB
            </p>
          </div>
        </div>

        <button
          onClick={onBackToScanner}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <ScanLine className="w-4 h-4" />
          Scan Baru
        </button>
      </div>

      {/* Storage Quota Progress Card */}
      <div className="p-5 rounded-2xl bg-[#161c28] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Kapasitas Penyimpanan Struk
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-300 tabular-nums">
            {usedMB} MB / {maxMB} MB ({quota.usedPercentage}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              quota.usedPercentage > 90
                ? "bg-gradient-to-r from-amber-500 to-rose-500"
                : quota.usedPercentage > 75
                ? "bg-gradient-to-r from-blue-500 to-amber-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-500"
            }`}
            style={{ width: `${Math.max(2, quota.usedPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Total {receipts.length} foto struk tersimpan</span>
          <span>Maksimal 5MB per pengguna</span>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Daftar Struk Tersimpan
        </h2>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Memuat riwayat struk...</p>
          </div>
        ) : receipts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#161c28]/60 border border-dashed border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mx-auto text-slate-500">
              <HardDrive className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Belum Ada Struk</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Foto struk yang kamu scan dan simpan akan muncul di sini.
              </p>
            </div>
            <button
              onClick={onBackToScanner}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ScanLine className="w-3.5 h-3.5" />
              Mulai Pindai Struk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {receipts.map((r) => {
              const data = (r.extracted_data || {}) as Record<string, unknown>;
              const merchantName = typeof data.merchant === "string" ? data.merchant : "Struk Belanja";
              const totalAmount = typeof data.total === "number" ? data.total : (Number(data.total) || undefined);
              const dateStr = new Date(r.uploaded_at).toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              );

              return (
                <div
                  key={r.id}
                  className="rounded-xl bg-[#161c28] border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() =>
                      r.publicUrl && setSelectedImage(r.publicUrl)
                    }
                    className="relative w-full h-40 bg-black/40 cursor-pointer overflow-hidden flex items-center justify-center"
                  >
                    {r.publicUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.publicUrl}
                        alt="Struk thumbnail"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ScanLine className="w-8 h-8 text-slate-600" />
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                      <ZoomIn className="w-4 h-4" /> Lihat
                    </div>

                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-slate-300 font-mono">
                      {formatBytes(r.file_size)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs font-bold text-white truncate">
                        {merchantName}
                      </h3>
                      {totalAmount !== undefined ? (
                        <span className="text-xs font-bold text-emerald-400 tabular-nums">
                          {formatCurrency(totalAmount)}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                      <span>{dateStr}</span>
                      <button
                        onClick={() => handleDelete(r.id, r.file_path)}
                        disabled={deletingId === r.id}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                        title="Hapus struk dari penyimpanan"
                      >
                        {deletingId === r.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="relative max-w-2xl max-h-[90vh] w-full bg-[#0F1419] rounded-2xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#161c28]">
              <h3 className="text-sm font-bold text-white">Foto Struk</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Struk Full"
                className="w-auto h-auto max-h-[75vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
