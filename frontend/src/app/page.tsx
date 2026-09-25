import { Footer } from "@/shared/components/layout/footer";
import { Navbar } from "@/shared/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustTicker } from "@/components/sections/trust-ticker";
import { FeaturesSection } from "@/components/sections/features-section";
import { DeepDiveAIScanSection } from "@/components/sections/deep-dive-scan-section";
import { HowToUseSection } from "@/components/sections/how-to-use-section";
import { SavingsGoalsSection } from "@/components/sections/savings-goals-section";
import { CtaSection } from "@/components/sections/cta-section";

export default function Home() {
  return (
    <div className="bg-navy-950 text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-finusa-blue selection:text-white min-h-screen relative">
      
      {/* Ambient Glow Effects (Global) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[700px] h-[550px] bg-blue-500/15 rounded-full blur-3xl transform -translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/3 -left-[150px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-[100px] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      </div>

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
