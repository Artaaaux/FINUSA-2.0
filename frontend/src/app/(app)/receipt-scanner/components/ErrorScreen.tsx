"use client";

import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Edit3,
  HardDrive,
  Camera,
  FolderOpen,
} from "lucide-react";
import { ScannerErrorType } from "@/shared/hooks/useReceiptScanner";

interface ErrorScreenProps {
  errorType?: ScannerErrorType | null;
  errorMessage?: string | null;
  onRetry: () => void;
  onManualEntry: () => void;
  onOpenGallery?: () => void;
}

export default function ErrorScreen({
  errorType,
  errorMessage,
  onRetry,
  onManualEntry,
  onOpenGallery,
}: ErrorScreenProps) {
  const getErrorContent = () => {
    switch (errorType) {
      case "blurry":
        return {
          title: "Foto Struk Kurang Jelas",
          desc: "Teks pada struk buram atau terpotong. Pastikan pencahayaan cukup dan posisikan struk tegak lurus kamera.",
          icon: <Camera className="w-8 h-8 text-amber-400" />,
          iconBg: "bg-amber-500/10 border-amber-500/20",
        };
      case "quota":
        return {
          title: "Kapasitas Penyimpanan Penuh (5MB)",
          desc: "Batas penyimpanan foto struk kamu telah mencapai kuota maksimal 5MB. Hapus foto struk lama untuk melanjutkan.",
          icon: <HardDrive className="w-8 h-8 text-rose-400" />,
          iconBg: "bg-rose-500/10 border-rose-500/20",
        };
      case "ocr_failed":
        return {
          title: "Gagal Membaca Data Struk",
          desc: "AI tidak dapat mengenali format struk belanja ini. Kamu bisa mencoba memotret ulang atau mengisi rincian secara manual.",
          icon: <AlertTriangle className="w-8 h-8 text-rose-400" />,
          iconBg: "bg-rose-500/10 border-rose-500/20",
        };
      default:
        return {
          title: "Terjadi Kendala Pemindaian",
          desc: errorMessage || "Terjadi kesalahan saat memproses gambar struk belanja kamu.",
          icon: <AlertTriangle className="w-8 h-8 text-amber-400" />,
          iconBg: "bg-amber-500/10 border-amber-500/20",
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-2xl bg-[#0F1419] border border-slate-800 shadow-2xl text-center space-y-6">
      <div
        className={`w-16 h-16 rounded-2xl ${content.iconBg} border flex items-center justify-center mx-auto`}
      >
        {content.icon}
      </div>

      <div className="space-y-2">
        <h3 className="text-base sm:text-lg font-bold text-white">
          {content.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {content.desc}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        {errorType === "quota" && onOpenGallery ? (
          <button
            onClick={onOpenGallery}
            className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            Buka Galeri Struk & Kelola Kuota
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Ambil / Upload Foto Ulang
          </button>
        )}

        <button
          onClick={onManualEntry}
          className="w-full px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
        >
          <Edit3 className="w-4 h-4" />
          Lanjutkan dengan Input Manual
        </button>
      </div>
    </div>
  );
}
