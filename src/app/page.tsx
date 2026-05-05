import { Aurora } from "@/components/ui/Aurora";
import { CtaBand } from "@/components/landing/CtaBand";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteHeader } from "@/components/landing/SiteHeader";
import { WhySleepMatters } from "@/components/landing/WhySleepMatters";

export default function LandingPage() {
  return (
    <main className="relative isolate min-h-dvh">
      <Aurora />
      <SiteHeader />
      <Hero />
      <div id="how">
        <HowItWorks />
      </div>
      <div id="why">
        <WhySleepMatters />
      </div>
      <CtaBand />
      <SiteFooter />
    </main>
  );
}
