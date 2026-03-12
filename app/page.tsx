import { SiteLayout } from "@/components/layout/site-layout"
import { HeroSection } from "@/components/home/hero-section"
import { AboutPreview } from "@/components/home/about-preview"
import { MinistriesPreview } from "@/components/home/ministries-preview"
import { EventsPreview } from "@/components/home/events-preview"
import { TestimonySection } from "@/components/home/testimony-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <AboutPreview />
      <MinistriesPreview />
      <EventsPreview />
      <TestimonySection />
      <CTASection />
    </SiteLayout>
  )
}
