import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Users, ArrowLeft, ArrowRight, Calendar, Clock, MapPin, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

const colorHexMap: Record<string, string> = {
  'bg-[var(--church-primary)]': '#2EA8DF',
  'bg-[var(--church-gold)]':    '#E7B93E',
  'bg-emerald-500':             '#10b981',
  'bg-rose-500':                '#f43f5e',
  'bg-orange-500':              '#f97316',
  'bg-indigo-500':              '#6366f1',
  'bg-teal-500':                '#14b8a6',
  'bg-pink-500':                '#ec4899',
}

const eventTypeColors: Record<string, string> = {
  Training:   "bg-blue-500/10 text-blue-600",
  Service:    "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Retreat:    "bg-emerald-500/10 text-emerald-600",
  Outreach:   "bg-rose-500/10 text-rose-600",
  Fellowship: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Special:    "bg-purple-500/10 text-purple-600",
}

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch ministry
  const { data: ministry } = await supabase
    .from('ministries')
    .select('*')
    .eq('slug', slug)
    .eq('visible', true)
    .single()

  if (!ministry) notFound()

  // Fetch upcoming events for this ministry (across all branches)
  const { data: branchMinistries } = await supabase
    .from('branch_ministries')
    .select('id')
    .eq('ministry_id', ministry.id)

  const bmIds = (branchMinistries ?? []).map((bm: { id: number }) => bm.id)

  const { data: eventsRaw } = bmIds.length > 0
    ? await supabase
        .from('ministry_events')
        .select('*')
        .in('branch_ministry_id', bmIds)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date')
        .limit(6)
    : { data: [] }

  const events = eventsRaw ?? []

  const colorHex = colorHexMap[ministry.color] ?? '#2EA8DF'
  const heroStyle = ministry.background_image_url
    ? {}
    : { background: `linear-gradient(135deg, ${colorHex} 0%, #1e1b4b 100%)` }

  return (
    <SiteLayout>
      {/* Hero */}
      <section
        className="pt-24 pb-16 lg:pt-32 lg:pb-20 relative"
        style={heroStyle}
      >
        {ministry.background_image_url && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ministry.background_image_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Link href="/ministries" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Ministries
            </Link>
            <div className="text-white">
              <h1 className="text-3xl lg:text-5xl font-bold mb-3 text-balance">{ministry.name}</h1>
              <p className="text-white/90 text-lg max-w-2xl text-pretty">{ministry.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-white/80 text-sm">
                {ministry.overseer && (
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{ministry.overseer}</span>
                )}
                {ministry.co_leader && (
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{ministry.co_leader}</span>
                )}
                {ministry.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{ministry.location}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">

            {/* Left — About + Activities + Events */}
            <div className="lg:col-span-2 space-y-8">

              {/* About */}
              {ministry.long_description && (
                <Card className="bg-background border-none shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">About This Ministry</h2>
                    <p className="text-muted-foreground leading-relaxed text-pretty">{ministry.long_description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Regular Activities */}
              {ministry.activities && ministry.activities.length > 0 && (
                <Card className="bg-background border-none shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Regular Activities</h2>
                    <ul className="space-y-3">
                      {ministry.activities.map((activity: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[var(--church-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{i + 1}</span>
                          </div>
                          <span className="text-muted-foreground text-sm leading-relaxed">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Events */}
              {events.length > 0 && (
                <Card className="bg-background border-none shadow-lg">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Events</h2>
                    <div className="space-y-4">
                      {events.map((event: {
                        id: number; title: string; date: string; time: string;
                        location: string; type: string; event_description: string
                      }) => (
                        <div key={event.id} className="border border-border rounded-xl p-5 hover:border-[var(--church-primary)] transition-colors">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="font-bold text-foreground text-lg">{event.title}</h3>
                            <Badge className={`flex-shrink-0 ${eventTypeColors[event.type] ?? "bg-muted text-muted-foreground"}`}>
                              {event.type}
                            </Badge>
                          </div>
                          {event.event_description && (
                            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{event.event_description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            {event.date && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-[var(--church-primary)]" />
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                            {event.time && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-[var(--church-primary)]" />
                                {event.time}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-[var(--church-primary)]" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right — Sidebar */}
            <div className="space-y-6">

              {/* Leadership */}
              {(ministry.overseer || ministry.co_leader) && (
                <Card className="bg-background border-none shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">Ministry Leadership</h3>
                    <div className="space-y-4">
                      {ministry.overseer && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--church-primary)]/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-[var(--church-primary)]" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Ministry Overseer</p>
                            <p className="font-semibold text-foreground text-sm">{ministry.overseer}</p>
                          </div>
                        </div>
                      )}
                      {ministry.co_leader && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--church-gold)]/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-[var(--church-gold)]" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Co-Leader</p>
                            <p className="font-semibold text-foreground text-sm">{ministry.co_leader}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location & Contact */}
              {(ministry.location || ministry.contact) && (
                <Card className="bg-background border-none shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">Details</h3>
                    <div className="space-y-3 text-sm">
                      {ministry.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-[var(--church-primary)] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{ministry.location}</span>
                        </div>
                      )}
                      {ministry.contact && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-4 h-4 text-[var(--church-primary)] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{ministry.contact}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Join CTA */}
              <Card className="bg-[var(--church-primary)] border-none shadow-lg text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-lg mb-2">Join This Ministry</h3>
                  <p className="text-white/80 text-sm mb-4 text-pretty">
                    Interested in serving with us? We would love to have you on the team!
                  </p>
                  <Link href="/register">
                    <Button className="w-full bg-white text-[var(--church-primary)] hover:bg-white/90 font-semibold">
                      Register Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* All Ministries */}
              <Card className="bg-background border-none shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-3">Explore Other Ministries</h3>
                  <Link href="/ministries">
                    <Button variant="outline" className="w-full border-[var(--church-primary)] text-[var(--church-primary)] hover:bg-[var(--church-primary)] hover:text-white">
                      View All Ministries
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
