"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Briefcase, Users } from "lucide-react";
import React from "react";

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

const audiences = [
  {
    icon: GraduationCap,
    title: "Pelajar & Mahasiswa",
    description:
      "Mulai bangun kebiasaan finansial yang sehat sejak dini dengan alat yang dirancang khusus untuk pelajar.",
    bullets: ["Budgeting uang saku & beasiswa", "Simulasi tabungan & target impian"],
    iconColor: "text-accent-cyan",
    iconBg: "bg-accent-cyan/10",
  },
  {
    icon: Briefcase,
    title: "Pekerja & Profesional Muda",
    description:
      "Kelola gaji pertama, alokasi tabungan, dan rencanakan masa depan finansial Anda.",
    bullets: ["Simulasi dana darurat otomatis", "Analisis pengeluaran bulanan"],
    iconColor: "text-accent-purple",
    iconBg: "bg-accent-purple/10",
  },
  {
    icon: Users,
    title: "Keluarga & Umum",
    description:
      "Rencanakan keuangan bersama dengan fitur scan struk dan dashboard personal.",
    bullets: ["Dashboard keuangan personal", "Perencanaan jangka panjang"],
    iconColor: "text-accent-green",
    iconBg: "bg-accent-green/10",
  },
];

export function AboutSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-bg-dark px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_80%_15%,rgba(37,99,235,0.04)_0%,transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center"
        >
          {/* Left Column */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Dirancang untuk Generasi Muda Indonesia
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              FINUSA hadir untuk memberdayakan masyarakat Indonesia dengan
              literasi dan alat manajemen keuangan yang praktis dan terpercaya.
              Kami percaya setiap orang berhak mencapai kemerdekaan finansial.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 border-t border-slate-800 pt-8">
              {[
                { value: "100%", label: "Gratis Selamanya" },
                { value: "AI OCR", label: "Scan Struk Instan" },
                { value: "6+", label: "Modul Utama" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs font-medium text-slate-400">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={containerVariants} className="space-y-4">
            {audiences.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="group relative flex flex-col rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6 transition-colors duration-300 hover:border-slate-700/80 sm:flex-row sm:gap-6 lg:flex-row lg:items-start lg:gap-6"
                >
                  {/* Icon */}
                  <div
                    className={`mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-800 ${item.iconBg} sm:mb-0`}
                  >
                    <Icon
                      className={`h-5 w-5 ${item.iconColor}`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">
                        {item.title}
                      </h3>
                      <ChevronRightIcon className="hidden h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white lg:block" />
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                    <ul className="space-y-1.5">
                      {item.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-center text-xs text-slate-300"
                        >
                          <span className={`mr-2 h-1.5 w-1.5 rounded-full ${item.iconBg}`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
