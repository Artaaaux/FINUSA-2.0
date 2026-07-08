"use client";

import * as React from "react";
import {
  ArrowRight,
  Bot,
  Calculator,
  LineChart,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { GlassButton } from "@/shared/components/ui/glass-button";

const titleWords = ["Kelola", "Keuangan", "Dengan", "Mudah"];

const labels = [
  { icon: Bot, label: "AI Advisor" },
  { icon: LineChart, label: "Monitor Pasar" },
  { icon: Calculator, label: "Budget Tools" },
];

export function MynaHero() {
  const shouldReduceMotion = useReducedMotion();
  const wordDelay = shouldReduceMotion ? 0 : 0.15;

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[500px] items-center overflow-hidden px-4 pb-16 pt-28 text-white md:min-h-[500px] md:pb-20 md:pt-32 lg:min-h-[520px]"
    >
      {/* Dark mode gradient: 3-stop blue→navy→purple */}
      <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(135deg,#2563EB_0%,#1e40af_50%,#9333EA_100%)] dark:block" />
      <div className="absolute inset-0 -z-10 hidden bg-[radial-gradient(circle_at_30%_20%,rgba(0,217,255,0.15),transparent_50%)] dark:block" />
      {/* Light mode gradient: 2-stop blue */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#2563EB_0%,#1e40af_100%)] dark:hidden" />
      {/* Bottom fade for smooth section transition */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-bg-light/40 to-transparent dark:from-bg-dark/60" />

      <div className="container">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Badge — cyan accent pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-cyan/30 bg-white/[0.12] px-4 py-2 text-sm font-semibold text-blue-50 shadow-sm backdrop-blur-xl"
          >
            <ShieldCheck className="h-4 w-4 text-accent-cyan" />
            Finance Nusantara untuk mahasiswa &amp; UMKM
          </motion.div>

          {/* Title with staggered word animation */}
          <h1 className="max-w-4xl text-[28px] font-bold leading-[1.2] md:text-[40px] lg:text-[48px]">
            {titleWords.map((text, index) => (
              <motion.span
                key={text}
                initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{
                  delay: index * wordDelay,
                  duration: shouldReduceMotion ? 0 : 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="inline-block px-1.5 md:px-2"
              >
                {text}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 1.2,
              duration: shouldReduceMotion ? 0 : 0.6,
            }}
            className="mt-5 max-w-2xl text-[15px] leading-[1.6] text-blue-100 md:text-[18px]"
          >
            Solusi finansial lengkap untuk mahasiswa &amp; UMKM — belajar literasi
            keuangan, memantau pasar, dan mengatur arus kas harian.
          </motion.p>

          {/* Feature labels — dark mode: slate bg + cyan border */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 1.8,
              duration: shouldReduceMotion ? 0 : 0.5,
            }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            {labels.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 1.8 + index * 0.15,
                  duration: shouldReduceMotion ? 0 : 0.6,
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                }}
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.12] px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-xl dark:border-accent-cyan/30 dark:bg-slate-800/50"
              >
                <feature.icon className="h-4 w-4 text-accent-cyan" />
                <span>{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 2.4,
              duration: shouldReduceMotion ? 0 : 0.6,
              type: "spring",
              stiffness: 100,
              damping: 12,
            }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <GlassButton asChild size="lg">
              <a href="/signup" aria-label="Mulai menggunakan FINUSA gratis">
                Mulai Gratis <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </GlassButton>
            <GlassButton
              asChild
              size="lg"
              variant="secondary"
              className="border-accent-cyan/50 bg-white/10 text-white hover:bg-white/[0.15] hover:text-white dark:border-accent-cyan/50 dark:text-accent-cyan"
            >
              <a href="#features">Lihat Fitur</a>
            </GlassButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
