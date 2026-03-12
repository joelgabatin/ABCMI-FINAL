import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart, ArrowRight } from "lucide-react"

export function AboutPreview() {
  return (
    <section id="about-preview" className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">Who We Are</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
              About Our Church
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Since 1986, Arise and Build For Christ Ministries has been a beacon of hope, faith, and community in Baguio City and beyond.
            </p>
          </div>

          {/* Mission, Vision, Values Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-[var(--church-primary)]" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Our Mission</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To spread the Gospel of Jesus Christ, make disciples of all nations, and build a community of believers rooted in faith, hope, and love.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--church-gold)]/20 flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-7 h-7 text-[var(--church-gold)]" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Our Vision</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To see transformed lives, strong families, and thriving communities through the power of the Gospel and the love of Christ.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-[var(--church-primary)]" />
                </div>
                <h3 className="font-bold text-xl mb-3 text-foreground">Our Values</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Faith in God, love for one another, integrity in all things, and commitment to serving our community with excellence.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Church History Preview */}
          <div className="bg-background rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-[var(--church-gold)] font-semibold text-sm uppercase tracking-wider">Est. 1986</span>
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mt-2 mb-4">
                  Our Journey of Faith
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  What began as a house church founded by Rev. Marino S. Coyoy and Elizabeth L. Coyoy has grown into a ministry with multiple outreach locations across the Philippines and even internationally.
                </p>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  From Quirino Hill to Laos, we continue to plant churches and spread the Gospel, building disciples and transforming communities through the power of Christ.
                </p>
                <Link href="/about">
                  <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white">
                    Learn Our Full Story
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--church-light-blue)] rounded-xl p-6 text-center">
                  <span className="text-3xl lg:text-4xl font-bold text-[var(--church-primary)]">40+</span>
                  <p className="text-sm text-muted-foreground mt-1">Years of Ministry</p>
                </div>
                <div className="bg-[var(--church-light-blue)] rounded-xl p-6 text-center">
                  <span className="text-3xl lg:text-4xl font-bold text-[var(--church-primary)]">15+</span>
                  <p className="text-sm text-muted-foreground mt-1">Local Outreaches</p>
                </div>
                <div className="bg-[var(--church-light-blue)] rounded-xl p-6 text-center">
                  <span className="text-3xl lg:text-4xl font-bold text-[var(--church-gold)]">11</span>
                  <p className="text-sm text-muted-foreground mt-1">Active Ministries</p>
                </div>
                <div className="bg-[var(--church-light-blue)] rounded-xl p-6 text-center">
                  <span className="text-3xl lg:text-4xl font-bold text-[var(--church-gold)]">1</span>
                  <p className="text-sm text-muted-foreground mt-1">International Mission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
