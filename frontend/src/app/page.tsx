import { Footer } from "@/shared/components/layout/footer";
import { Navbar } from "@/shared/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustTicker } from "@/components/sections/trust-ticker";
import { FeaturesSection } from "@/components/sections/features-section";
import { DeepDiveAIScanSection } from "@/components/sections/deep-dive-scan-section";
import { HowToUseSection } from "@/components/sections/how-to-use-section";
import { SavingsGoalsSection } from "@/components/sections/savings-goals-section";
import { CtaSection } from "@/components/sections/cta-section";
import { AnimationPauser } from "@/components/ui/animation-pauser";

export default function Home() {
  return (
    <div className="bg-navy-950 text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-finusa-blue selection:text-white min-h-screen relative">
      <AnimationPauser />
      <div className="relative z-10 bg-finusa-radial">
        <Navbar />
        <main>
          <HeroSection />
          <TrustTicker />
          <FeaturesSection />
          <DeepDiveAIScanSection />
          <HowToUseSection />
          <SavingsGoalsSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
