import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, ArrowRight } from "lucide-react"

export function TestimonySection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-[var(--church-gold)] font-semibold text-sm uppercase tracking-wider">Testimonies</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-4">
              God Is Moving
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Hear how God has been working in the lives of our church family. Your testimony could inspire someone today.
            </p>
          </div>

          {/* Featured Testimony */}
          <Card className="bg-[var(--church-light-blue)] border-none shadow-lg overflow-hidden">
            <CardContent className="p-8 lg:p-12">
              <Quote className="w-12 h-12 text-[var(--church-primary)] opacity-50 mb-6" />
              <blockquote className="text-lg lg:text-xl text-foreground leading-relaxed mb-6 font-serif italic">
                {'"'}When I first walked into Arise and Build For Christ Ministries, I was broken and searching for meaning. Through the love of this church family, the powerful teaching of God{`'`}s Word, and the transforming power of the Holy Spirit, I found new life in Christ. Today, I serve in the worship ministry, and my family has been restored. God is truly faithful!{'"'}
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--church-primary)] flex items-center justify-center text-white font-bold">
                  MJ
                </div>
                <div>
                  <p className="font-semibold text-foreground">Maria J.</p>
                  <p className="text-sm text-muted-foreground">Church Member since 2019</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Verse */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-none">
              <CardContent className="p-8">
                <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Verse of the Day</span>
                <p className="text-xl lg:text-2xl font-serif italic mt-4 mb-4 leading-relaxed">
                  {'"'}For I know the plans I have for you,{'"'} declares the LORD, {'"'}plans to prosper you and not to harm you, plans to give you hope and a future.{'"'}
                </p>
                <p className="text-[var(--church-gold)] font-semibold">Jeremiah 29:11</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link href="/feedback">
              <Button variant="outline" className="border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white">
                Share Your Testimony
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
