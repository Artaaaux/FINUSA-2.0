"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ScanLine } from "lucide-react";

interface ProcessingScreenProps {
  imageSrc?: string | null;
}

const steps = [
  { id: 1, text: "Mengoptimalkan resolusi & kompresi gambar..." },
  { id: 2, text: "Membaca teks struk dengan AI Vision..." },
  { id: 3, text: "Mengekstrak rincian barang, total & kategori..." },
];

export default function ProcessingScreen({ imageSrc }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(2), 1600);
    const t2 = setTimeout(() => setCurrentStep(3), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto p-6 sm:p-8 rounded-2xl bg-[#0F1419] border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
      {/* Animated Thumbnail Scanner */}
      <div className="relative w-40 h-52 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-slate-950 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt="Processing Receipt"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <ScanLine className="w-12 h-12" />
          </div>
        )}

        {/* Laser Beam */}
        <motion.div
          className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_rgba(34,211,238,1)] z-10"
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pulse Overlay */}
        <motion.div
          className="absolute inset-0 bg-blue-500/10 pointer-events-none"
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Main Status Text */}
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          Sedang Memproses Struk
        </h3>
        <p className="text-xs text-slate-400">
          AI sedang mengekstrak data keuangan dari foto kamu
        </p>
      </div>

      {/* Progress Steps */}
      <div className="w-full max-w-xs space-y-2.5 text-left pt-2">
        {steps.map((s) => {
          const isDone = currentStep > s.id;
          const isCurrent = currentStep === s.id;

          return (
            <div
              key={s.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${
                isDone
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : isCurrent
                  ? "bg-blue-500/15 border-blue-500/40 text-white font-semibold"
                  : "bg-slate-900/40 border-slate-800 text-slate-500"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0" />
              )}
              <span className="text-xs leading-tight truncate">{s.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
