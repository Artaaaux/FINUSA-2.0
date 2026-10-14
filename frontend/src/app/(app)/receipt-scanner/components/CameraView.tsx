"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Flashlight,
  FlashlightOff,
  SwitchCamera,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
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
  const mobileGuideRef = useRef<HTMLDivElement>(null);
  const desktopGuideRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
  const [isDragging, setIsDragging] = useState(false);

  // Check screen size on mount: desktop defaults to upload, mobile defaults to camera
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDesktop = window.innerWidth >= 768;
      setActiveTab(isDesktop ? "upload" : "camera");
    }
  }, []);

  // Control camera stream based on active tab
  useEffect(() => {
    if (activeTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, startCamera, stopCamera]);

  const handleMobileShutter = () => {
    const dataUrl = takeSnapshot(mobileGuideRef.current);
    if (dataUrl) {
      onCapture(dataUrl);
    }
  };

  const handleDesktopShutter = () => {
    const dataUrl = takeSnapshot(desktopGuideRef.current);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ======================================================== */}
      {/* 1. DESKTOP VIEW: First-class wide layout (md: and up)     */}
      {/* ======================================================== */}
      <div className="hidden md:flex flex-col w-full max-w-3xl mx-auto rounded-2xl bg-[#0F1419] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Desktop Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-[#161c28]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Pindai Struk Belanja</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Smart OCR
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Unggah file struk atau gunakan webcam komputer untuk pencatatan otomatis
            </p>
          </div>

          {/* Tab Switcher Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === "upload"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Upload className="w-3.5 h-3.5" />
              Upload File
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("camera")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                activeTab === "camera"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <Camera className="w-3.5 h-3.5" />
              Kamera Webcam
            </button>
          </div>
        </div>

        {/* Tab 1: Upload File Mode (Desktop Default) */}
        {activeTab === "upload" && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Drag & Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group",
                isDragging
                  ? "border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.25)] scale-[1.01]"
                  : "border-slate-700/80 bg-slate-900/40 hover:border-blue-500/60 hover:bg-slate-900/70"
              )}
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all shadow-lg">
                <Upload className="w-8 h-8" />
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {isDragging ? "Lepaskan File Struk di Sini" : "Tarik & Lepas Foto Struk ke Sini"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
                atau klik area ini untuk memilih file foto struk belanja dari komputer kamu
              </p>

              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all pointer-events-none"
              >
                <ImageIcon className="w-4 h-4" />
                Pilih File dari Komputer
              </button>

              <span className="text-[11px] text-slate-500 mt-4">
                Mendukung format JPG, PNG, WEBP, HEIC (Maksimal 10MB)
              </span>
            </div>

            {/* Feature Highlights on Desktop */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pencahayaan Jelas</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Pastikan foto tidak buram atau tertutup bayangan tebal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Struk Lengkap</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Nama toko, tanggal, item pembelian, dan nominal total terlihat.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>AI Ekstraksi Otomatis</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Kategori, nama produk, dan nominal langsung terisi ke pembukuan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Desktop Webcam Mode */}
        {activeTab === "camera" && (
          <div className="relative flex flex-col">
            <div className="relative w-full aspect-[16/9] max-h-[460px] bg-black flex items-center justify-center overflow-hidden">
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

              {/* Viewfinder Overlay Mask for Desktop */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div
                  ref={desktopGuideRef}
                  className="relative w-full max-w-sm aspect-[4/3] rounded-2xl border-2 border-blue-400/60 shadow-[0_0_0_9999px_rgba(10,14,20,0.72)] overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_16px_rgba(59,130,246,1)] z-10"
                    animate={{ top: ["5%", "90%", "5%"], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
                <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs font-medium shadow-lg">
                  Arahkan struk belanja ke dalam kotak pemindai
                </div>
              </div>

              {/* Fallback when permission denied */}
              {permission !== "granted" && !isLoading && (
                <div className="absolute inset-0 z-30 bg-[#0F1419] flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h3 className="text-base font-bold text-white">
                      {permission === "denied" ? "Izin Akses Kamera Ditolak" : "Kamera Tidak Terdeteksi"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {error || "Aktifkan izin kamera di browser kamu atau unggah foto struk langsung dari file."}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("upload")}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Gunakan Upload File
                    </button>
                    {permission === "denied" && (
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
                      >
                        Coba Akses Lagi
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-slate-300 font-medium">Menghubungkan ke webcam...</span>
                </div>
              )}
            </div>

            {/* Desktop Webcam Action Bar */}
            <div className="px-6 py-4 bg-[#161c28] border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Beralih ke Upload File
              </button>

              <button
                type="button"
                onClick={handleDesktopShutter}
                disabled={permission !== "granted"}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
              >
                <Camera className="w-4 h-4" />
                Ambil Foto Struk
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 2. MOBILE VIEW: Natural portrait mobile scanner (md:hidden)*/}
      {/* ======================================================== */}
      <div className="flex md:hidden flex-col w-full max-w-sm sm:max-w-md mx-auto h-[calc(100dvh-175px)] min-h-[500px] max-h-[640px] bg-[#0A0E14] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
        {/* Top Bar Controls */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Struk Scan
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
                  <Flashlight className="w-4 h-4" />
                ) : (
                  <FlashlightOff className="w-4 h-4" />
                )}
              </button>
            )}

            {hasMultipleCameras && (
              <button
                onClick={toggleFacingMode}
                className="p-2.5 rounded-full bg-black/70 hover:bg-black text-slate-200 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                aria-label="Switch Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Viewfinder Area */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-black">
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
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
            <div
              ref={mobileGuideRef}
              className="relative w-full max-w-[270px] aspect-[3/4] max-h-[54vh] rounded-3xl border border-blue-500/35 overflow-hidden shadow-[0_0_0_9999px_rgba(10,14,20,0.72)]"
            >
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-2xl shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-2xl shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-400 rounded-bl-2xl shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-400 rounded-br-2xl shadow-[0_0_12px_rgba(168,85,247,0.8)]" />

              <motion.div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_16px_rgba(59,130,246,1)] z-10"
                animate={{ top: ["5%", "90%", "5%"], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Center Guidance Caption */}
          <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
            <div className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-slate-200 text-xs font-medium text-center shadow-lg">
              Posisikan struk belanja di dalam kotak pemindai
            </div>
          </div>

          {/* Mobile Fallback */}
          {permission !== "granted" && !isLoading && (
            <div className="absolute inset-0 z-30 bg-[#0F1419] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Camera className="w-7 h-7" />
              </div>
              <div className="max-w-xs space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {permission === "denied" ? "Izin Akses Kamera Ditolak" : "Kamera Tidak Terdeteksi"}
                </h3>
                <p className="text-xs text-slate-400">
                  {error || "Gunakan galeri untuk mengunggah foto struk belanja perangkatmu."}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 w-full max-w-xs pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  Upload Foto Struk
                </button>
                {permission === "denied" && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all cursor-pointer"
                  >
                    Coba Akses Lagi
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="absolute inset-0 z-30 bg-black/80 flex flex-col items-center justify-center gap-3">
              <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-300 font-medium">Menghubungkan ke kamera...</span>
            </div>
          )}
        </div>

        {/* Mobile Shutter & Action Bar */}
        <div className="relative z-20 px-6 py-3.5 bg-[#0F1419] border-t border-slate-800/80">
          <div className="w-full max-w-xs mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer group"
              aria-label="Upload dari galeri"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 group-hover:bg-slate-700/80 border border-slate-700 flex items-center justify-center transition-all">
                <ImageIcon className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
              </div>
              <span className="text-[11px] font-medium">Galeri</span>
            </button>

            {/* Shutter Button (68px) */}
            <div className="relative flex items-center justify-center">
              <button
                type="button"
                onClick={handleMobileShutter}
                disabled={permission !== "granted"}
                className={cn(
                  "relative w-16 h-16 rounded-full p-1.5 border-[3.5px] border-white/90 hover:border-white transition-all transform active:scale-90 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center bg-white/10 backdrop-blur-xs",
                  permission !== "granted" && "opacity-50 cursor-not-allowed"
                )}
                aria-label="Ambil Foto Struk"
              >
                <div className="w-full h-full rounded-full bg-white hover:bg-slate-100 active:bg-slate-200 transition-all shadow-inner" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer group"
              aria-label="Upload File Struk"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 group-hover:bg-slate-700/80 border border-slate-700 flex items-center justify-center transition-all">
                <Upload className="w-4 h-4 text-slate-300 group-hover:text-purple-400" />
              </div>
              <span className="text-[11px] font-medium">Upload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
