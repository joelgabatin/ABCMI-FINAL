import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollDownButton } from "@/components/layout/scroll-buttons"
import { Heart, Calendar, BookOpen } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/home-hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-balance">
            Welcome to the FAMILY
          </h1>

          {/* CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/services">
              <Button size="lg" className="bg-[var(--church-gold)] hover:bg-[#d4a934] text-[var(--church-dark-text)] font-semibold px-8 w-full sm:w-auto">
                <Calendar className="w-5 h-5 mr-2" />
                Join Our Service
              </Button>
            </Link>
            <Link href="/prayer-request">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 w-full sm:w-auto">
                <Heart className="w-5 h-5 mr-2" />
                Prayer Request
              </Button>
            </Link>
          </div> */}

          {/* Quick Links */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Link href="/prayer-request" className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors border border-white/20">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Prayer Request</span>
            </Link>
            <Link href="/counseling" className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors border border-white/20">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              <span className="text-sm font-medium">Counseling</span>
            </Link>
            <Link href="/bible-reading" className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors border border-white/20">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Daily Reading</span>
            </Link>
            <Link href="/donate" className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors border border-white/20">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Donate</span>
            </Link>
          </div> */}
        </div>
      </div>

      {/* Scroll Down Button — anchored to the bottom of the section */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <ScrollDownButton targetId="about-preview" />
      </div>
    </section>
  )
}
