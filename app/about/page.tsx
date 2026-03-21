import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye } from "lucide-react"
import { createClient } from '@supabase/supabase-js'
import { churchContent as staticContent } from "@/lib/church-content"
import type { ChurchContent } from "@/lib/church-content"

export const dynamic = 'force-dynamic'

async function getChurchContent(): Promise<ChurchContent> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const [settingsRes, coreValuesRes, beliefsRes, historyRes] = await Promise.all([
      supabase.from('"church_VMD"').select('*').eq('id', 1).single(),
      supabase.from('church_core_values').select('*').order('sort_order'),
      supabase.from('church_beliefs').select('*').order('sort_order'),
      supabase.from('church_history').select('*').order('sort_order'),
    ])

    const settings   = settingsRes.data
    const coreValues = coreValuesRes.data
    const beliefs    = beliefsRes.data
    const history    = historyRes.data

    return {
      mission: {
        ...staticContent.mission,
        body: settings?.mission_body || staticContent.mission.body,
      },
      vision: {
        ...staticContent.vision,
        body: settings?.vision_body || staticContent.vision.body,
        drivingForce: settings?.driving_force || staticContent.vision.drivingForce,
      },
      coreValues: coreValues?.length
        ? coreValues.map((cv: { title: string; description: string }) => ({
            title: cv.title,
            description: cv.description,
          }))
        : staticContent.coreValues,
      statementOfFaith: {
        ...staticContent.statementOfFaith,
        beliefs: beliefs?.length
          ? beliefs.map((b: { belief: string }) => b.belief)
          : staticContent.statementOfFaith.beliefs,
      },
      history: {
        ...staticContent.history,
        timeline: history?.length
          ? history.map((h: { year: string; event: string }) => ({ year: h.year, event: h.event }))
          : staticContent.history.timeline,
      },
    }
  } catch {
    return staticContent
  }
}

export default async function AboutPage() {
  const { mission, vision, coreValues, statementOfFaith, history } = await getChurchContent()

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
