import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Quote } from "lucide-react"
import Image from "next/image"
import { churchContent } from "@/lib/church-content"

const sectionIcons = [Target, Eye, Flame, BookOpen]

export default function AboutPage() {
  const { mission, vision, coreValues, statementOfFaith, history } = churchContent

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">About Our Church</h1>
            <p className="text-xl text-white/90 text-pretty">
              Learn about our history, mission, vision, and the values that guide us.
            </p>
          </div>
        </div>
      </section>

      {/* Founders / Pioneers */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[var(--church-gold)] font-semibold text-sm uppercase tracking-wider">Our Founders</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 text-balance">The Pioneers of ABCMI</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-pretty">
                Arise and Build for Christ Ministries Inc. was founded in 1984 in Baguio City by two servants of God whose lives were wholly surrendered to the vision God placed in their hearts — to build His kingdom among the nations.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Founder 1 */}
              <Card className="bg-background border border-border shadow-xl overflow-hidden group hover:border-[var(--church-primary)] transition-colors">
                <CardContent className="p-0">
                  <div className="relative h-72 w-full overflow-hidden bg-[var(--church-soft-gray)]">
                    <Image
                      src="/images/founder-marino-coyoy.jpg"
                      alt="Rev. Marino S. Coyoy — Co-Founder of ABCMI"
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xl font-bold">Rev. Marino S. Coyoy</p>
                      <p className="text-white/80 text-sm">Co-Founder &amp; Senior Pastor</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="w-6 h-6 text-[var(--church-gold)] flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground text-sm leading-relaxed italic text-pretty">
                        "God gave us a burden for the lost — not just in Baguio but to the nations. We started with faith, a few families, and a word from God: Arise and Build."
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                      Rev. Marino S. Coyoy is the visionary co-founder of ABCMI. Called into full-time ministry in the 1980s, he pioneered the church planting work that began in East Quirino Hill, Baguio City, and has since expanded to 13 branches across the Philippines and abroad. Under his leadership, ABCMI established its core mission of teaching, training, and equipping faithful servants for local and global church planting.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Co-Founder */}
              <Card className="bg-background border border-border shadow-xl overflow-hidden group hover:border-[var(--church-primary)] transition-colors">
                <CardContent className="p-0">
                  <div className="relative h-72 w-full overflow-hidden bg-[var(--church-soft-gray)]">
                    <Image
                      src="/images/founder-elizabeth-coyoy.jpg"
                      alt="Rev. Elizabeth L. Coyoy — Co-Founder of ABCMI"
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xl font-bold">Rev. Elizabeth L. Coyoy</p>
                      <p className="text-white/80 text-sm">Co-Founder &amp; Women's Ministry Pioneer</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="w-6 h-6 text-[var(--church-gold)] flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground text-sm leading-relaxed italic text-pretty">
                        "Every soul matters to God. We planted this church with tears, prayers, and the deep conviction that God is faithful to build what He has called us to build."
                      </p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                      Rev. Elizabeth L. Coyoy co-founded ABCMI alongside her husband and has been a pillar of strength and prayer in the ministry for four decades. She pioneered the Women's Ministry and played a vital role in nurturing the early congregation. Her heart for discipleship and intercession continues to shape the spiritual culture of the entire ABCMI network.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Legacy banner */}
            <div className="mt-10 bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)] rounded-2xl p-8 text-white text-center">
              <p className="text-lg font-semibold mb-2">40 Years of God's Faithfulness</p>
              <p className="text-white/85 text-sm max-w-xl mx-auto text-pretty">
                From a single house church in 1984 to 13 branches across the Philippines and Southeast Asia — the legacy of our founders is a testament to what God can do through two surrendered lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="bg-background border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-7 h-7 text-[var(--church-primary)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{mission.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-pretty">{mission.body}</p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="bg-background border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-7 h-7 text-[var(--church-gold)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{vision.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-pretty mb-4">{vision.body}</p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-1">Driving Force:</p>
                  <p className="text-muted-foreground text-sm">{vision.drivingForce}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 text-balance">Core Values</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <Card key={index} className="border border-border hover:border-[var(--church-primary)] transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--church-primary)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-lg text-foreground">{value.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statement of Fundamentals */}
      <section className="py-16 lg:py-24 bg-[var(--church-soft-gray)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">What We Believe</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 text-balance">{statementOfFaith.title}</h2>
              <p className="text-muted-foreground mt-4 text-pretty">{statementOfFaith.intro}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {statementOfFaith.beliefs.map((belief, index) => (
                <div key={index} className="flex items-start gap-3 bg-background rounded-lg px-5 py-4 shadow-sm">
                  <span className="w-7 h-7 rounded-full bg-[var(--church-primary)] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-foreground text-sm leading-relaxed">{belief}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Church History Timeline */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[var(--church-gold)] font-semibold text-sm uppercase tracking-wider">{history.subtitle}</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 text-balance">{history.title}</h2>
            </div>

            <div className="relative">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--church-primary)]/20 -translate-x-1/2" />
              <div className="space-y-8">
                {history.timeline.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start gap-6 lg:gap-12 ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-[var(--church-primary)] border-4 border-background -translate-x-1/2 z-10" />
                    <div
                      className={`ml-12 lg:ml-0 lg:w-[calc(50%-2rem)] ${
                        index % 2 === 0 ? "lg:pr-8 lg:text-right" : "lg:pl-8"
                      }`}
                    >
                      <Card className="bg-background border border-border shadow-sm">
                        <CardContent className="p-5">
                          <span className="inline-block px-3 py-1 bg-[var(--church-primary)] text-white text-sm font-bold rounded-full mb-2">
                            {item.year}
                          </span>
                          <p className="text-muted-foreground text-sm leading-relaxed">{item.event}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
