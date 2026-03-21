import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollDownButton } from "@/components/layout/scroll-buttons"
import { Heart, Calendar, BookOpen } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[var(--church-primary)] via-[var(--church-primary-deep)] to-[#156a91]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
              <span className="text-3xl lg:text-4xl font-bold">ABCMI</span>
            </div>
          </div>

          {/* Church Name */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-balance">
            Welcome to our Church
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
            Arise and Build For Christ Ministries Inc.
          </p>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            A faith-centered community dedicated to spreading the Gospel, nurturing believers, and building disciples for Christ. Join us in worship, prayer, and fellowship.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
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
          </div>
        </div>

        {/* Scroll Down Button */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollDownButton targetId="about-preview" />
        </div>
      </div>
    </section>
  )
}
