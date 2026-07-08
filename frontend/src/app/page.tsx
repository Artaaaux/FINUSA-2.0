import { Footer } from "@/shared/components/layout/footer";
import { Navbar } from "@/shared/components/layout/navbar";
import { HeroSection } from "@/views/landing/components/hero-section";
import { FeaturesSection } from "@/views/landing/components/features-section";
import { AboutSection } from "@/views/landing/components/about-section";
import { TrustSection } from "@/views/landing/components/trust-section";

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

