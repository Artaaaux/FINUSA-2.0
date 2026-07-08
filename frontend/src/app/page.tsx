import { Footer } from "@/shared/components/layout/footer";
import { Navbar } from "@/shared/components/layout/navbar";
import { HeroSection } from "@/pages/landing/components/hero-section";
import { FeaturesSection } from "@/pages/landing/components/features-section";
import { AboutSection } from "@/pages/landing/components/about-section";
import { TrustSection } from "@/pages/landing/components/trust-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}

