import { ArrowRight, ScanLine, LineChart, CreditCard } from "lucide-react";

import { GlassButton } from "@/shared/components/ui/glass-button";

const titleWords = ["Keuangan", "Terkelola,", "Masa", "Depan", "Terjamin."];

const featureLabels = [
  { icon: ScanLine, text: "Scan Struk AI" },
  { icon: LineChart, text: "Monitor Keuangan" },
  { icon: CreditCard, text: "Target Tabungan" },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-bg-dark to-[#0f1530] px-4 pb-24 pt-32 sm:px-6 lg:px-8"
    >
      {/* Ambient glow orb - ONE subtle glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        {/* Title with staggered word animation */}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl">
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
        <p className="fin-subtitle mx-auto mb-10 max-w-2xl text-base text-gray-400 sm:text-lg lg:text-xl">
          Platform manajemen keuangan praktis untuk pelajar dan profesional muda. 
          Kelola arus kas, capai target tabungan, dan bangun kebiasaan finansial yang lebih sehat.
        </p>

        {/* Feature pills */}
        <div className="fin-pills-wrapper mb-12 flex flex-wrap justify-center gap-2 sm:gap-3">
          {featureLabels.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.text}
                className="fin-pill-item flex cursor-default items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
              >
                <Icon className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="fin-cta-wrapper flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <GlassButton asChild size="lg" className="w-full sm:w-auto">
            <a href="/auth/signup" aria-label="Mulai menggunakan FINUSA gratis">
              Mulai Gratis <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </GlassButton>
          <a
            href="#features"
            className="w-full text-sm font-semibold text-gray-300 transition-colors hover:text-white sm:w-auto"
          >
            Pelajari Fitur
          </a>
        </div>
        
        {/* Trust Line */}
        <p className="mt-8 text-xs text-gray-500 sm:text-sm">
          100% Gratis &mdash; Tanpa iklan &mdash; Data terenkripsi
        </p>
      </div>
    </section>
  );
}

export { HeroSection };
