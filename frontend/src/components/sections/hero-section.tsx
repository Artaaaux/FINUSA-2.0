import {
  ArrowRight,
  ScanLine,
  CreditCard,
  LineChart,
} from "lucide-react";

import { GlassButton } from "@/shared/components/ui/glass-button";

const titleWords = ["Kelola", "Keuangan", "Dengan", "Mudah"];

const featureLabels = [
  { icon: ScanLine, text: "Scan Struk AI" },
  { icon: LineChart, text: "Monitor Keuangan" },
  { icon: CreditCard, text: "Target Tabungan" },
];

export default function HeroSection() {

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-bg-dark via-bg-section to-bg-dark px-4 pb-24 pt-32 sm:px-6 lg:px-8"
    >
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute right-10 top-20 h-72 w-72 rounded-full bg-blue-500 opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 h-72 w-72 rounded-full bg-accent-purple opacity-20 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
        {/* Title with staggered word animation */}
        <h1 className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
          {titleWords.map((word) => (
            <span
              key={word}
              className="fin-title-word mr-3 inline-block"
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="fin-subtitle mx-auto mb-12 max-w-3xl text-lg text-gray-200 sm:text-xl">
          Solusi cerdas untuk mencatat transaksi harian, memantau arus kas,
          dan mencapai target tabungan impian bagi pelajar dan generasi muda.
        </p>

        {/* Feature pills */}
        <div className="fin-pills-wrapper mb-12 flex flex-wrap justify-center gap-3">
          {featureLabels.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="fin-pill-item flex cursor-default items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-gray-200 backdrop-blur-sm transition-transform duration-200 hover:scale-105"
              >
                <Icon className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="fin-cta-wrapper flex flex-wrap justify-center gap-4 sm:gap-6">
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
        </div>
      </div>
    </section>
  );
}
export { HeroSection };
