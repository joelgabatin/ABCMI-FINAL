import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Heart, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface Ministry {
  id: number
  name: string
  slug: string
  description: string
  color: string
  background_image_url: string | null
  overseer: string | null
  visible: boolean
}

export const revalidate = 60

export default async function MinistriesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ministries')
    .select('id, name, slug, description, color, background_image_url, overseer, visible')
    .eq('visible', true)
    .order('id')

  const ministries: Ministry[] = data ?? []

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="pt-24 pb-16 lg:pt-32 lg:pb-20 relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510384742052-1abcb6282645?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Our Ministries</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              Discover your place in the body of Christ. Every ministry is an opportunity to serve, grow, and make an eternal difference.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm">
              <span className="flex items-center gap-2"><Users className="w-4 h-4" />{ministries.length} Ministries</span>
              <span className="flex items-center gap-2"><Heart className="w-4 h-4" />Serving Together</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry) => (
                <Link key={ministry.id} href={`/ministries/${ministry.slug}`} className="group">
                  <Card className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full overflow-hidden">
                    {/* Image / color banner */}
                    <div className="relative h-40 flex-shrink-0">
                      {ministry.background_image_url ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ministry.background_image_url}
                            alt={ministry.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/45" />
                        </>
                      ) : (
                        <div className={`absolute inset-0 ${ministry.color} group-hover:opacity-90 transition-opacity`} />
                      )}
                      <div className="relative z-10 h-full flex flex-col justify-end p-5">
                        <h3 className="text-white font-bold text-lg leading-tight drop-shadow">
                          {ministry.name}
                        </h3>
                        {ministry.overseer && (
                          <p className="text-white/80 text-xs mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3" />{ministry.overseer}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <CardContent className="flex-1 flex flex-col gap-3 p-5">
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                        {ministry.description}
                      </p>
                      <span className="flex items-center gap-1 text-xs text-[var(--church-primary)] font-medium group-hover:gap-2 transition-all">
                        View Ministry <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
              Ready to Serve?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 text-pretty">
              We believe everyone has a unique gift to contribute to the body of Christ.
              Join a ministry today and discover how you can make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white w-full sm:w-auto">
                  Become a Member
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/counseling">
                <Button size="lg" variant="outline" className="border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white w-full sm:w-auto">
                  Talk to a Pastor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
