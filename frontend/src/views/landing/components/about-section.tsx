"use client";

import { GraduationCap, Briefcase, Users, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const audiences = [
  {
    icon: GraduationCap,
    title: "Untuk Mahasiswa",
    desc: "Belajar membagi uang, menabung untuk impian, dan mengerti financial planning sejak muda.",
    highlights: [
      "Budgeting uang jajan & beasiswa",
      "Simulasi tabungan & target impian",
      "Materi literasi keuangan gratis",
    ],
    iconColor: "text-accent-cyan",
    bgColor: "bg-accent-cyan/10 border-accent-cyan/20",
    hoverBorder: "hover:border-accent-cyan/45",
    glowColor: "group-hover:shadow-[0_8px_40px_rgba(0,217,255,0.06)]",
  },
  {
    icon: Briefcase,
    title: "Untuk Pemilik UMKM",
    desc: "Pantau arus kas bisnis, hitung margin, break-even point, dan planning pertumbuhan bisnis.",
    highlights: [
      "Pembukuan kas digital sederhana",
      "Pencatatan laba/rugi otomatis",
      "Analisis margin keuntungan",
    ],
    iconColor: "text-accent-purple",
    bgColor: "bg-accent-purple/10 border-accent-purple/20",
    hoverBorder: "hover:border-accent-purple/45",
    glowColor: "group-hover:shadow-[0_8px_40px_rgba(167,139,250,0.06)]",
  },
  {
    icon: Users,
    title: "Untuk Umum & Keluarga",
    desc: "Membantu Anda memahami keuangan pribadi, merencanakan investasi, dan masa depan finansial.",
    highlights: [
      "Dashboard keuangan personal",
      "Tips cerdas dari AI advisor",
      "Perencanaan dana darurat",
    ],
    iconColor: "text-accent-green",
    bgColor: "bg-accent-green/10 border-accent-green/20",
    hoverBorder: "hover:border-accent-green/45",
    glowColor: "group-hover:shadow-[0_8px_40px_rgba(0,255,136,0.06)]",
  },
];

export function AboutSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-bl from-[#0B0D1F] via-[#0E1225] to-[#080C1A] px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Unique BG: warm amber top-right, cool cyan bottom-left, cross-hatch overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_80%_15%,rgba(251,191,36,0.05)_0%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_15%_85%,rgba(0,217,255,0.06)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 25%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 25%, transparent 75%)' }} />
      <div className="pointer-events-none absolute right-[-5%] top-0 h-[400px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[90px]" />
      <div className="pointer-events-none absolute left-[-8%] bottom-[-5%] h-[450px] w-[450px] rounded-full bg-accent-cyan/[0.05] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Context, Story & Stats */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1 text-xs font-semibold tracking-wider text-accent-cyan uppercase"
            >
              TENTANG FINUSA
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"
            >
              Solusi Tepat untuk Mengelola Keuangan
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mb-8 text-base leading-relaxed text-gray-400"
            >
              Finusa dirancang khusus untuk memecahkan masalah keuangan yang sering dialami oleh mahasiswa dan pengusaha mikro di Indonesia. Kami menggabungkan kecerdasan buatan dengan alat praktis agar siapa saja bisa mengambil keputusan keuangan yang bijak.
            </motion.p>

            {/* Glowing Stats Column inside Left Block */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-6 border-t border-slate-800 pt-8"
            >
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-accent-cyan">100%</span>
                <span className="text-xs font-medium text-gray-400 mt-1">Gratis Selamanya</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-accent-purple">24/7</span>
                <span className="text-xs font-medium text-gray-400 mt-1">AI Chat Support</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold text-accent-green">3+</span>
                <span className="text-xs font-medium text-gray-400 mt-1">Modul Utama</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Audience Cards Stack */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {audiences.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : 0.1 * i,
                    duration: 0.5,
                  }}
                  whileHover={shouldReduceMotion ? {} : { x: 8 }}
                  className={`group relative flex flex-col rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-900/40 to-slate-950/20 p-6 backdrop-blur-md transition-all duration-300 ${item.hoverBorder} ${item.glowColor} lg:flex-row lg:items-center lg:gap-6`}
                >
                  {/* Icon wrap */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border mb-4 lg:mb-0 ${item.bgColor}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${item.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Text content block */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <ChevronRightIcon className="h-4 w-4 text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-white hidden lg:block" />
                    </div>
                    <p className="mb-4 text-xs text-gray-400 leading-relaxed max-w-lg">
                      {item.desc}
                    </p>

                    {/* Horizontal bullet badges */}
                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((h) => (
                        <span
                          key={h}
                          className="inline-flex items-center gap-1 rounded bg-slate-900/60 border border-slate-800/50 px-2 py-0.8 text-[10px] text-gray-300 font-medium"
                        >
                          <CheckCircle2 className={`h-3 w-3 ${item.iconColor}`} />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

// Small helper component inline
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default AboutSection;
