"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lock, Zap, Target, ChevronDown } from "lucide-react";
import { GlassButton } from "@/shared/components/ui/glass-button";

const trustBadges = [
  {
    icon: Lock,
    title: "Aman & Terpercaya",
    description:
      "Data kamu dienkripsi secara aman dan dilindungi dengan standar keamanan database modern. Privasi Anda adalah prioritas kami.",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Gratis Selamanya",
    description:
      "Seluruh fitur utama dapat diakses tanpa biaya tersembunyi. Tanpa iklan yang mengganggu. Sekarang dan seterusnya.",
    iconColor: "text-accent-green",
    iconBg: "bg-accent-green/10 border-accent-green/20",
  },
  {
    icon: Target,
    title: "Sangat Mudah",
    description:
      "Antarmuka yang minimalis dan intuitif, dirancang agar mudah dipahami bahkan oleh pemula dalam dunia finansial.",
    iconColor: "text-accent-purple",
    iconBg: "bg-accent-purple/10 border-accent-purple/20",
  },
];

const faqs = [
  {
    question: "Apakah FINUSA benar-benar gratis?",
    answer:
      "Ya, FINUSA 100% gratis tanpa biaya tersembunyi. Semua fitur pencatatan kas, scan struk otomatis AI, target tabungan, dan template spreadsheet dapat digunakan sepenuhnya secara gratis.",
  },
  {
    question: "Bagaimana cara kerja fitur Scan Struk AI?",
    answer:
      "Cukup ambil foto struk fisik atau unggah gambar dari galeri. AI Vision Finusa langsung mengekstrak nama merchant, tanggal transaksi, rincian barang, hingga total pengeluaran secara otomatis dan siap disimpan ke pembukuan.",
  },
  {
    question: "Bagaimana FINUSA mengamankan data saya?",
    answer:
      "Kami mengutamakan privasi Anda. Semua data transaksi dan finansial Anda diamankan dengan Row-Level Security (RLS) di Supabase dan koneksi SSL terenkripsi, memastikan tidak ada pihak lain yang bisa mengintip catatan Anda.",
  },
  {
    question: "Bagaimana cara kerja fitur Template Spreadsheet?",
    answer:
      "Anda dapat mengunduh template spreadsheet keuangan siap pakai dalam format .xlsx langsung dari browser. File bisa langsung dibuka di Excel atau Google Sheets tanpa perlu izin akun ataupun koneksi API yang rumit.",
  },
  {
    question: "Apakah ada aplikasi mobile untuk FINUSA?",
    answer:
      "Saat ini FINUSA difokuskan sebagai aplikasi web responsif untuk mobile dan desktop. Tampilan dioptimalkan untuk layar ponsel dengan navigasi cepat layaknya aplikasi mobile modern.",
  },
];

export function TrustSection() {
  const prefersReducedMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-bg-dark px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_40%_at_50%_10%,rgba(37,99,235,0.04)_0%,transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Keamanan dan Transparansi
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-400">
            Kami berkomitmen menyediakan platform yang dapat Anda percaya sepenuhnya.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-3">
          {trustBadges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReducedMotion ? 0 : i * 0.1,
                }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-8 text-center transition-colors duration-300 hover:border-slate-700/80"
              >
                <div className="mb-5 flex justify-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${badge.iconBg}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${badge.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {badge.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-24">
          <div className="mb-10 text-center">
            <h3 className="text-2xl font-bold text-white">Pertanyaan Umum</h3>
            <p className="mt-2 text-sm text-slate-400">
              Jawaban untuk hal-hal yang paling sering ditanyakan.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-slate-800/60 bg-slate-900/20 transition-colors duration-300 hover:border-slate-700/60"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full cursor-pointer items-center justify-between p-5 text-left text-sm font-medium text-white outline-none sm:text-base"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`}
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
                      <div className="border-t border-slate-800/30 px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">
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
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-950 p-8 text-center md:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-accent-purple/5" />

          <div className="relative z-10">
            <h3 className="mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Mulai kelola keuanganmu hari ini.
            </h3>
            <p className="mx-auto mb-8 max-w-md text-sm text-slate-400">
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
                className="text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
              >
                Lihat fitur dulu
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TrustSection;
