"use client";

import { motion, useReducedMotion } from "framer-motion";

export function IntroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="intro"
      className="relative scroll-mt-28 overflow-hidden border-t border-slate-200 bg-bg-light py-10 md:py-16 dark:border-white/10 dark:bg-section-dark"
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          className="relative mx-auto max-w-3xl rounded-2xl border-2 border-transparent p-8 text-center transition-all duration-300 hover:border-accent-cyan/20 hover:shadow-lg dark:hover:shadow-card-dark"
        >
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Tentang Kami
          </p>
          <h2 className="text-[28px] font-bold leading-[1.3] text-[#1F2937] dark:text-white md:text-[28px]">
            Apa itu Finusa?
          </h2>
          <p className="mx-auto mt-5 max-w-[760px] text-[15px] leading-[1.6] text-[#6B7280] dark:text-[#D1D5DB] md:text-[15px]">
            Finusa membantu kamu mengelola keuangan dengan fitur-fitur edukatif
            dan mudah digunakan. Sempurna untuk pemula yang ingin belajar
            financial literacy sambil membangun kebiasaan finansial yang sehat.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default IntroSection;
