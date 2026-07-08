"use client";

import { useState } from "react";
import { Lock, Zap, Target, Sparkles, ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GlassButton } from "@/shared/components/ui/glass-button";

const badges = [
  {
    icon: Lock,
    title: "Aman & Terpercaya",
    desc: "Data kamu dienkripsi secara aman dan dilindungi dengan standar keamanan database modern.",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    hoverColor:
      "hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)]",
  },
  {
    icon: Zap,
    title: "Gratis Selamanya",
    desc: "Seluruh fitur utama dapat diakses tanpa biaya tersembunyi. Sekarang dan seterusnya.",
    color: "text-accent-green border-accent-green/20 bg-accent-green/5",
    hoverColor:
      "hover:border-accent-green/40 hover:shadow-[0_8px_30px_rgba(0,255,136,0.08)]",
  },
  {
    icon: Target,
    title: "Sangat Mudah",
    desc: "Antarmuka yang minimalis dan intuitif, dirancang agar mudah dipahami bahkan oleh pemula.",
    color: "text-accent-purple border-accent-purple/20 bg-accent-purple/5",
    hoverColor:
      "hover:border-accent-purple/40 hover:shadow-[0_8px_30px_rgba(167,139,250,0.08)]",
  },
];

const faqs = [
  {
    question: "Apakah FINUSA benar-benar gratis?",
    answer: "Ya, FINUSA 100% gratis tanpa biaya tersembunyi. Semua fitur literasi keuangan, AI advisor, pembukuan kas UMKM, dan simulasi tabungan dapat digunakan sepenuhnya secara gratis.",
  },
  {
    question: "Bagaimana FINUSA mengamankan data saya?",
    answer: "Kami mengutamakan privasi Anda. Semua data transaksi dan finansial Anda diamankan dengan Row-Level Security (RLS) di Supabase dan koneksi SSL terenkripsi, memastikan tidak ada pihak lain yang bisa mengintip catatan Anda.",
  },
  {
    question: "Bagaimana cara kerja integrasi Google Sheets?",
    answer: "Anda dapat menghubungkan akun Google Anda di halaman pengaturan. FINUSA akan secara otomatis mengekspor data pencatatan pengeluaran harian dan buku kas UMKM Anda ke spreadsheet pilihan Anda secara berkala.",
  },
  {
    question: "Apakah ada aplikasi mobile untuk FINUSA?",
    answer: "Saat ini FINUSA difokuskan sebagai aplikasi web yang sangat responsif di perangkat mobile dan desktop. Pengembangan versi aplikasi mobile native (React Native) direncanakan pada peta jalan pengembangan selanjutnya.",
  },
];

export function TrustSection() {
  const shouldReduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-gradient-to-b from-[#0A0B1E] via-[#0F0E28] to-[#060818] px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Unique BG: purple nebula center-top, blue orb bottom, scattered star dots */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_40%_at_50%_10%,rgba(139,92,246,0.07)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_95%,rgba(37,99,235,0.05)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 15%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 45%, black 15%, transparent 80%)' }} />
      <div className="pointer-events-none absolute left-1/3 -top-10 h-[450px] w-[450px] rounded-full bg-violet-600/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-[-10%] h-[350px] w-[350px] rounded-full bg-blue-500/[0.05] blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1 text-xs font-semibold tracking-wider text-accent-cyan uppercase">
            JAMINAN & FITUR
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Aman, Cepat, dan Transparan
          </h2>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-24">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : i * 0.1,
                }}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                className={`text-center rounded-2xl border border-slate-800/60 bg-slate-900/10 p-8 backdrop-blur-md transition-all duration-300 ${badge.hoverColor}`}
              >
                <div className="mb-5 flex justify-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${badge.color}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">
                  {badge.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {badge.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Accordion Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="text-accent-cyan h-6 w-6" />
              Pertanyaan yang Sering Diajukan
            </h3>
            <p className="text-gray-400 text-sm mt-2">Punya pertanyaan lain? Berikut rangkuman hal yang paling sering ditanyakan.</p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800/60 bg-slate-900/10 backdrop-blur-md overflow-hidden transition-colors duration-300 hover:border-slate-700/60"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left text-white font-medium text-sm sm:text-base outline-none cursor-pointer"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-accent-cyan" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-slate-800/30">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-accent-cyan/15 bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950 p-8 text-center shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-accent-cyan/30 md:p-12"
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 via-accent-cyan/5 to-accent-purple/5" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1 text-xs font-semibold tracking-wider text-accent-cyan uppercase"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              SIAP MULAI?
            </motion.div>

            <h3 className="mb-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Mulai kelola keuanganmu hari ini.
            </h3>
            <p className="mx-auto mb-8 max-w-md text-sm text-gray-400 leading-relaxed">
              Tidak perlu kartu kredit. Tidak perlu pengalaman finansial.
              Langsung mulai — gratis selamanya.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <GlassButton asChild size="lg">
                <a href="/auth/signup" aria-label="Mulai menggunakan FINUSA gratis">
                  Mulai Gratis Sekarang
                </a>
              </GlassButton>
              <a
                href="#features"
                className="text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-accent-cyan"
              >
                Lihat fitur dulu →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TrustSection;
