import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Users } from "lucide-react"
import Link from "next/link"

const upcomingEvents = [
  {
    title: "Youth Camp 2026",
    date: "May 10–12, 2026",
    time: "8:00 AM onwards",
    location: "Camp John Hay, Baguio City",
    category: "Youth",
    description: "A three-day overnight camp for all youth members aged 13–25. Theme: 'Rooted: Growing Deep in Christ.' Activities include worship nights, team building, outdoor adventures, and intensive discipleship sessions. Registration fee includes accommodation and meals.",
    featured: true,
    slots: 80,
    registered: 47,
  },
  {
    title: "Women's Conference — Arise, Shine!",
    date: "March 28, 2026",
    time: "9:00 AM – 4:00 PM",
    location: "ABCMI Main Church, East Quirino Hill, Baguio City",
    category: "Women",
    description: "An empowering full-day conference for women of all ages. Featuring inspiring speakers, worship, breakout sessions on faith, family, and purpose, and a special women's luncheon. Theme: 'Arise, Shine — Your Light Has Come!'",
    featured: false,
    slots: 120,
    registered: 88,
  },
  {
    title: "Easter Sunday Services",
    date: "April 20, 2026",
    time: "5:30 AM (Sunrise) & 9:00 AM",
    location: "ABCMI Main Church",
    category: "Special Service",
    description: "Celebrate the resurrection of our Lord Jesus Christ with our Easter Sunrise Service at 5:30 AM and the main Easter celebration at 9:00 AM. All are welcome. Special music presentations, drama, and a message of hope.",
    featured: false,
    slots: null,
    registered: null,
  },
  {
    title: "Missions Sunday",
    date: "May 3, 2026",
    time: "9:00 AM",
    location: "ABCMI Main Church",
    category: "Missions",
    description: "A special Sunday service dedicated to our global and local mission work. Hear firsthand testimonies from our missionaries, including Ptr. Emannuel Marbella from Vientiane, Laos. A missions offering will be received.",
    featured: false,
    slots: null,
    registered: null,
  },
  {
    title: "Mission Training Seminar",
    date: "April 25, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Fellowship Hall, ABCMI Main Church",
    category: "Training",
    description: "A full-day seminar for aspiring and current missionaries covering cross-cultural communication, church planting principles, evangelism methods, and practical field preparation. Open to all church members with a heart for missions.",
    featured: false,
    slots: 50,
    registered: 22,
  },
  {
    title: "Worship Workshop",
    date: "April 5, 2026",
    time: "2:00 PM – 5:00 PM",
    location: "Main Sanctuary, ABCMI",
    category: "Training",
    description: "An intensive training session for all worship team members and those interested in joining the music ministry. Topics: vocal techniques, instrument playing, leading worship with the Holy Spirit, and spiritual preparation.",
    featured: false,
    slots: 30,
    registered: 18,
  },
  {
    title: "Praise Night",
    date: "April 12, 2026",
    time: "6:00 PM – 9:00 PM",
    location: "Main Sanctuary, ABCMI",
    category: "Special Service",
    description: "A special evening of extended worship and praise open to the entire congregation and guests. No sermon — just two hours of uninterrupted praise and worship. Invite a friend!",
    featured: false,
    slots: null,
    registered: null,
  },
  {
    title: "Youth Outreach at Burnham Park",
    date: "April 18, 2026",
    time: "9:00 AM – 12:00 PM",
    location: "Burnham Park, Baguio City",
    category: "Outreach",
    description: "An evangelism outreach event conducted by the Youth Ministry. Activities include street evangelism, games, and sharing the Gospel to youth and children at Burnham Park. Wear comfortable clothes.",
    featured: false,
    slots: 40,
    registered: 31,
  },
]

const categoryColors: Record<string, string> = {
  Youth: "bg-emerald-500/10 text-emerald-700",
  Women: "bg-rose-500/10 text-rose-700",
  "Special Service": "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Missions: "bg-blue-500/10 text-blue-700",
  Training: "bg-orange-500/10 text-orange-700",
  Outreach: "bg-purple-500/10 text-purple-700",
}

export default function UpcomingEventsPage() {
  const featured = upcomingEvents.find((e) => e.featured)
  const rest = upcomingEvents.filter((e) => !e.featured)

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" />
              Upcoming Events
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">What's Coming Up</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              Join us for worship, fellowship, training, and outreach. There's something for everyone at ABCMI.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-20 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* Featured Event — full 12 cols */}
            {featured && (
              <Card className="w-full bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)] text-white border-none shadow-2xl overflow-hidden">
                <CardContent className="p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-[var(--church-gold)] text-[var(--church-dark-text)] rounded-full text-sm font-bold">
                          Featured Event
                        </span>
                        <Badge className={`${categoryColors[featured.category] || "bg-white/20 text-white"} bg-white/20 text-white border-0`}>
                          {featured.category}
                        </Badge>
                      </div>
                      <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">{featured.title}</h2>
                      <p className="text-white/85 text-lg leading-relaxed mb-6 text-pretty">{featured.description}</p>
                      <div className="flex flex-wrap gap-5 text-sm text-white/90">
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[var(--church-gold)]" />{featured.date}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--church-gold)]" />{featured.time}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[var(--church-gold)]" />{featured.location}</span>
                        {featured.slots && (
                          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[var(--church-gold)]" />{featured.registered}/{featured.slots} registered</span>
                        )}
                      </div>
                    </div>
                    <div className="lg:w-56 flex-shrink-0">
                      {featured.slots && (
                        <div className="bg-white/10 rounded-2xl p-5 text-center">
                          <p className="text-white/70 text-sm mb-1">Slots Available</p>
                          <p className="text-4xl font-bold">{featured.slots - (featured.registered ?? 0)}</p>
                          <p className="text-white/70 text-sm mt-1">of {featured.slots} total</p>
                          <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                            <div
                              className="bg-[var(--church-gold)] h-2 rounded-full"
                              style={{ width: `${((featured.registered ?? 0) / featured.slots) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <Button className="w-full mt-4 bg-white text-[var(--church-primary)] hover:bg-white/90 font-bold h-12">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mini calendar nav */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">All Upcoming Events</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9"><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-sm font-medium text-foreground px-2">April – May 2026</span>
                <Button variant="outline" size="icon" className="h-9 w-9"><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>

            {/* All other events — each card is full width */}
            <div className="space-y-4">
              {rest.map((event, i) => (
                <Card key={i} className="w-full bg-background border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Date block */}
                      <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-[var(--church-primary)]/10 flex flex-col items-center justify-center text-[var(--church-primary)] border border-[var(--church-primary)]/20">
                        <span className="text-xs font-semibold uppercase tracking-wider">{event.date.split(" ")[0]}</span>
                        <span className="text-2xl font-bold leading-none">{event.date.split(" ")[1]?.replace(",", "")}</span>
                        <span className="text-xs font-medium">{event.date.split(" ")[2]}</span>
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                          <Badge className={categoryColors[event.category] || "bg-muted text-muted-foreground"}>
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mb-4 text-pretty">{event.description}</p>
                        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--church-primary)]" />{event.time}</span>
                          <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[var(--church-primary)]" />{event.location}</span>
                          {event.slots && (
                            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[var(--church-primary)]" />{event.registered}/{event.slots} registered</span>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      {event.slots && (
                        <div className="flex-shrink-0 self-center">
                          <Button className="bg-[var(--church-primary)] hover:bg-[var(--church-primary-deep)] text-white h-10 px-6">
                            Register
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
