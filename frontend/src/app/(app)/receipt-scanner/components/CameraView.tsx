"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Flashlight,
  FlashlightOff,
  SwitchCamera,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useCamera } from "@/shared/hooks/useCamera";
import { cn } from "@/shared/lib/utils";

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  onFileUpload: (file: File) => void;
}

export default function CameraView({
  onCapture,
  onFileUpload,
}: CameraViewProps) {
  const {
    videoRef,
    permission,
    facingMode,
    hasMultipleCameras,
    isTorchOn,
    hasTorch,
    isLoading,
    error,
    startCamera,
    stopCamera,
    toggleFacingMode,
    toggleTorch,
    takeSnapshot,
  } = useCamera();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleShutter = () => {
    const dataUrl = takeSnapshot();
    if (dataUrl) {
      onCapture(dataUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[520px] sm:min-h-[600px] flex flex-col bg-[#0A0E14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Bar Controls */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Scanner AI
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasTorch && (
            <button
              onClick={toggleTorch}
              className={cn(
                "p-2.5 rounded-full transition-all duration-200 cursor-pointer",
                isTorchOn
                  ? "bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                  : "bg-black/70 text-slate-200 hover:bg-black hover:text-white border border-slate-700/60"
              )}
              aria-label="Toggle Flashlight"
            >
              {isTorchOn ? (
                <Flashlight className="w-5 h-5" />
              ) : (
                <FlashlightOff className="w-5 h-5" />
              )}
            </button>
          )}

          {hasMultipleCameras && (
            <button
              onClick={toggleFacingMode}
              className="p-2.5 rounded-full bg-black/70 hover:bg-black text-slate-200 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
              aria-label="Switch Camera"
            >
              <SwitchCamera className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Viewfinder Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            facingMode === "user" && "scale-x-[-1]"
          )}
        />

        {/* Viewfinder Overlay Mask */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
          {/* Guide Frame (Dana / OVO E-Wallet Style) */}
          <div className="relative w-full max-w-sm aspect-[3/4] sm:aspect-[3/4.2] rounded-3xl border border-blue-500/30 overflow-hidden shadow-[0_0_0_9999px_rgba(10,14,20,0.72)]">
            {/* Glowing Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-2xl shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-2xl shadow-[0_0_12px_rgba(168,85,247,0.8)]" />

            {/* Animated Laser Scanning Line */}
            <motion.div
              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_16px_rgba(59,130,246,1)]"
              animate={{
                top: ["5%", "95%", "5%"],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Subtle Grid / Pattern in Guide Frame */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        </div>

        {/* Center Guidance Caption */}
        <div className="absolute bottom-28 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-slate-950/90 border border-slate-700/60 text-slate-200 text-xs sm:text-sm font-medium text-center shadow-lg">
            Posisikan struk belanja di dalam kotak pemindai
          </div>
        </div>

        {/* Permission Denied or Loading Fallback */}
        {permission !== "granted" && !isLoading && (
          <div className="absolute inset-0 z-30 bg-[#0F1419] flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Camera className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {permission === "denied"
                  ? "Izin Akses Kamera Ditolak"
                  : "Kamera Tidak Terdeteksi"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {error ||
                  "Kamu tetap dapat menggunakan scanner dengan mengunggah foto struk dari galeri perangkatmu."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Upload Foto Struk
              </button>
              {permission === "denied" && (
                <button
                  onClick={startCamera}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all cursor-pointer"
                >
                  Coba Akses Lagi
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-300 font-medium">
              Menghubungkan ke kamera...
            </span>
          </div>
        )}
      </div>

      {/* Bottom Shutter & Action Bar */}
      <div className="relative z-20 px-6 py-5 bg-[#0F1419] border-t border-slate-800/80 flex items-center justify-between">
        {/* Gallery / File Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer group"
          aria-label="Upload dari galeri"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-slate-700/80 border border-slate-700 flex items-center justify-center transition-all">
            <ImageIcon className="w-5 h-5 text-slate-300 group-hover:text-blue-400" />
          </div>
          <span className="text-[11px] font-medium">Galeri</span>
        </button>

        {/* Main Capture Shutter Button */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={handleShutter}
            disabled={permission !== "granted"}
            className={cn(
              "relative w-18 h-18 rounded-full p-1 border-2 border-white/80 transition-all transform active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(59,130,246,0.4)]",
              permission !== "granted" && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Ambil Foto Struk"
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 flex items-center justify-center transition-all">
              <Camera className="w-7 h-7 text-white" />
            </div>
          </button>
        </div>

        {/* Upload Fallback Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer group"
          aria-label="Upload File Struk"
        >
          <div className="w-11 h-11 rounded-xl bg-slate-800/80 group-hover:bg-slate-700/80 border border-slate-700 flex items-center justify-center transition-all">
            <Upload className="w-5 h-5 text-slate-300 group-hover:text-purple-400" />
          </div>
          <span className="text-[11px] font-medium">Upload</span>
        </button>
      </div>
    </div>
  );
}
