import { HeroSection } from "@/components/sections/hero-section";
import { HomepageSections } from "@/components/sections/homepage-sections";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <div id="hero-insight" className="h-px" />
      <HomepageSections />
    </main>
  );
}
