"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calculator,
  LineChart,
  ShieldCheck,
} from "lucide-react";

import { GlassButton } from "@/shared/components/ui/glass-button";

const titleWords = ["Kelola", "Keuangan", "Dengan", "Mudah"];

const featureLabels = [
  { icon: Bot, text: "AI Advisor" },
  { icon: LineChart, text: "Monitor Keuangan" },
  { icon: Calculator, text: "Budget Tools" },
];

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();
  const wordDelay = shouldReduceMotion ? 0 : 0.15;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-bg-dark via-bg-section to-bg-dark px-4 pb-24 pt-32 sm:px-6 lg:px-8"
    >
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute right-10 top-20 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-72 w-72 rounded-full bg-accent-purple opacity-20 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-700/50 bg-blue-900/30 px-4 py-2 backdrop-blur-sm"
        >
          <ShieldCheck className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
          <span className="text-sm font-medium text-blue-200">
            Finance Nusantara 
          </span>
        </motion.div>

        {/* Title with staggered word animation */}
        <h1 className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
          {titleWords.map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.6,
                delay: i * wordDelay,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="mr-3 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            delay: shouldReduceMotion ? 0 : 0.6,
          }}
          className="mx-auto mb-12 max-w-3xl text-lg text-gray-200 sm:text-xl"
        >
          Solusi finansial lengkap untuk belajar literasi keuangan, memantau
          pasar, dan mengatur arus kas harian.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            delay: shouldReduceMotion ? 0 : 0.8,
          }}
          className="mb-12 flex flex-wrap justify-center gap-3"
        >
          {featureLabels.map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.4,
                delay: shouldReduceMotion ? 0 : 1 + i * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
              className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur-sm"
            >
              <item.icon className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.6,
            delay: shouldReduceMotion ? 0 : 1,
          }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6"
        >
          <GlassButton asChild size="lg">
            <a href="/auth/signup" aria-label="Mulai menggunakan FINUSA gratis">
              Mulai Gratis <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </GlassButton>
          <a
            href="#features"
            className="rounded-lg border-2 border-accent-cyan/50 px-6 py-3 font-semibold text-accent-cyan transition-all duration-200 hover:bg-accent-cyan/10 sm:px-8"
          >
            Lihat Fitur
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
