"use client";

import React from "react";
import { Sparkles, RefreshCw, ArrowLeft } from "lucide-react";

interface ImagePreviewProps {
  imageSrc: string;
  onRetake: () => void;
  onConfirm: () => void;
}

export default function ImagePreview({
  imageSrc,
  onRetake,
  onConfirm,
}: ImagePreviewProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col bg-[#0F1419] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-[#161c28]">
        <div className="flex items-center gap-3">
          <button
            onClick={onRetake}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Pratinjau Foto Struk
            </h2>
            <p className="text-xs text-slate-400">
              Pastikan teks struk terlihat jelas dan tidak buram
            </p>
          </div>
        </div>

        <button
          onClick={onRetake}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Foto Ulang
        </button>
      </div>

      {/* Image Display */}
      <div className="relative flex-1 min-h-[380px] sm:min-h-[480px] bg-[#0A0E14] flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm max-h-[460px] rounded-xl overflow-hidden border border-slate-700/80 shadow-xl bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt="Preview Struk"
            className="w-full h-auto max-h-[460px] object-contain mx-auto"
          />
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="p-5 bg-[#161c28] border-t border-slate-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <button
          onClick={onRetake}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white text-sm font-semibold transition-all cursor-pointer"
        >
          Ambil Ulang
        </button>

        <button
          onClick={onConfirm}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform active:scale-98 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          Pindai & Ekstrak Data AI
        </button>
      </div>
    </div>
  );
}
