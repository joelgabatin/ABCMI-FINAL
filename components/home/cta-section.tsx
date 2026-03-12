import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, BookOpen, Users, HandCoins } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[var(--church-primary)] via-[var(--church-primary-deep)] to-[#156a91]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            How Can We Serve You?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            We are here to support you in your faith journey. Choose how you{`'`}d like to connect with us today.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/prayer-request" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/20 h-full">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Prayer Request</h3>
                <p className="text-sm text-white/80">
                  Share your prayer needs with our intercessory ministry.
                </p>
              </div>
            </Link>

            <Link href="/counseling" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/20 h-full">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Counseling</h3>
                <p className="text-sm text-white/80">
                  Book a confidential session with our pastoral team.
                </p>
              </div>
            </Link>

            <Link href="/bible-study" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/20 h-full">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Bible Study</h3>
                <p className="text-sm text-white/80">
                  Join or start a Bible study group in your area.
                </p>
              </div>
            </Link>

            <Link href="/donate" className="group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all border border-white/20 h-full">
                <div className="w-16 h-16 rounded-full bg-[var(--church-gold)]/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <HandCoins className="w-8 h-8 text-[var(--church-gold)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">Give</h3>
                <p className="text-sm text-white/80">
                  Support the ministry and help spread the Gospel.
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-12">
            <Link href="/register">
              <Button size="lg" className="bg-[var(--church-gold)] hover:bg-[#d4a934] text-[var(--church-dark-text)] font-semibold px-8">
                Become a Member
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
