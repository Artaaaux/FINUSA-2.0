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
      
      {/* Ambient Glow Effects (Global - GPU Accelerated Procedural Gradients) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ transform: 'translateZ(0)', contain: 'strict' }}
        aria-hidden="true"
      >
        <div 
          className="absolute top-0 right-1/4 w-[750px] h-[550px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.16) 0%, rgba(59, 130, 246, 0.08) 35%, rgba(59, 130, 246, 0) 70%)',
            transform: 'translate3d(0, -33.33%, 0)',
          }}
        />
        <div 
          className="absolute top-1/3 -left-[150px] w-[650px] h-[650px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.12) 0%, rgba(6, 182, 212, 0.05) 40%, rgba(6, 182, 212, 0) 70%)',
            transform: 'translateZ(0)',
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-[100px] w-[750px] h-[750px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.11) 0%, rgba(147, 51, 234, 0.04) 45%, rgba(147, 51, 234, 0) 70%)',
            transform: 'translateZ(0)',
          }}
        />
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
