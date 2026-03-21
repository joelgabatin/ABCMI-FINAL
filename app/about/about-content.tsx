"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye } from "lucide-react"
import type { ChurchContent } from "@/lib/church-content"

export default function AboutContent({ initial }: { initial: ChurchContent }) {
  const [content, setContent] = useState<ChurchContent>(initial)

  useEffect(() => {
    const supabase = createClient()

    const refetch = async () => {
      const res = await fetch("/api/church-content", { cache: "no-store" })
      if (res.ok) {
        const d = await res.json()
        setContent(prev => ({
          ...prev,
          mission:  { ...prev.mission,  body: d.mission  ?? prev.mission.body },
          vision:   { ...prev.vision,   body: d.vision   ?? prev.vision.body, drivingForce: d.drivingForce ?? prev.vision.drivingForce },
          coreValues: d.coreValues?.length
            ? d.coreValues.map((cv: { title: string }) => ({ title: cv.title }))
            : prev.coreValues,
          statementOfFaith: {
            ...prev.statementOfFaith,
            beliefs: d.beliefs?.length
              ? d.beliefs.map((b: { belief: string }) => b.belief)
              : prev.statementOfFaith.beliefs,
          },
          history: {
            ...prev.history,
            timeline: d.history?.length
              ? d.history.map((h: { year: string; event: string }) => ({ year: h.year, event: h.event }))
              : prev.history.timeline,
          },
        }))
      }
    }

    const channel = supabase
      .channel("about-page-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "church_VMD" },        () => refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "church_core_values" }, () => refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "church_beliefs" },     () => refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "church_history" },     () => refetch())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const { mission, vision, coreValues, statementOfFaith, history } = content

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
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[var(--church-primary)] font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-2 text-balance">Core Values</h2>
            </div>
            <div className="space-y-3">
              {coreValues.map((value, index) => (
                <div key={index} className="flex items-center gap-4 px-6 py-4 rounded-lg bg-[var(--church-light-blue)] border border-[var(--church-primary)]/10">
                  <span className="w-8 h-8 rounded-full bg-[var(--church-primary)] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="font-semibold text-foreground">{value.title}</p>
                </div>
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
                    className={`relative flex items-start gap-6 lg:gap-12 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                  >
                    <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-[var(--church-primary)] border-4 border-background -translate-x-1/2 z-10" />
                    <div className={`ml-12 lg:ml-0 lg:w-[calc(50%-2rem)] ${index % 2 === 0 ? "lg:pr-8 lg:text-right" : "lg:pl-8"}`}>
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
