import { SiteLayout } from "@/components/layout/site-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Music,
  Star,
  Users,
  Heart,
  BookOpen,
  Baby,
  Stethoscope,
  Globe,
  MessageCircle,
  Flame,
  ArrowRight,
  Clock,
  Calendar,
  MapPin
} from "lucide-react"

const ministries = [
  {
    id: 1,
    name: "Music Ministry",
    description: "Leading the congregation in worship through music and song. We glorify God with our voices and instruments, creating an atmosphere of praise.",
    icon: Music,
    color: "bg-[var(--church-primary)]",
    leader: "Ptr. Fhey Coyoy",
    meetingTime: "Saturdays, 4:00 PM",
    members: 24,
    events: [
      { title: "Worship Workshop", date: "Apr 5, 2026", time: "2:00 PM", location: "Main Sanctuary", type: "Training" },
      { title: "Praise Night", date: "Apr 12, 2026", time: "6:00 PM", location: "Main Sanctuary", type: "Service" },
    ],
  },
  {
    id: 2,
    name: "Dance Ministry",
    description: "Expressing worship through movement and dance. We use the art of dance to praise God and minister to the congregation.",
    icon: Star,
    color: "bg-pink-500",
    leader: "Sister Ana Villanueva",
    meetingTime: "Saturdays, 3:00 PM",
    members: 15,
    events: [],
  },
  {
    id: 3,
    name: "Singles and Adults Ministry (SAM)",
    description: "Connecting single adults and mature members through fellowship, Bible study, and community service activities.",
    icon: Users,
    color: "bg-[var(--church-gold)]",
    leader: "Ptr. Billy Antero",
    meetingTime: "Sundays after service",
    members: 38,
    events: [
      { title: "Singles Fellowship Night", date: "Apr 11, 2026", time: "6:00 PM", location: "Fellowship Hall", type: "Fellowship" },
    ],
  },
  {
    id: 4,
    name: "Youth Ministry (ABCMI Youth)",
    description: "Empowering young people to live out their faith and become leaders for Christ. We build young disciples through relevant teaching and fellowship.",
    icon: Flame,
    color: "bg-emerald-500",
    leader: "Ptr. Emannuel Marbella",
    meetingTime: "Fridays, 6:00 PM",
    members: 45,
    events: [
      { title: "Youth Camp 2026", date: "May 10, 2026", time: "8:00 AM", location: "Camp John Hay, Baguio", type: "Retreat" },
      { title: "Youth Outreach", date: "Apr 18, 2026", time: "9:00 AM", location: "Burnham Park, Baguio", type: "Outreach" },
    ],
  },
  {
    id: 5,
    name: "Men's Ministry",
    description: "Building godly men through accountability, Bible study, and fellowship. We encourage men to lead their families and serve the church.",
    icon: Users,
    color: "bg-indigo-500",
    leader: "Ptr. Julio Coyoy",
    meetingTime: "Saturdays, 6:00 AM",
    members: 29,
    events: [],
  },
  {
    id: 6,
    name: "Women's Ministry",
    description: "Nurturing women in their faith journey through Bible study, prayer, and mutual support. We build strong, godly women for Christ.",
    icon: Heart,
    color: "bg-rose-500",
    leader: "Ptr. Mirriam Anno",
    meetingTime: "Saturdays, 9:00 AM",
    members: 41,
    events: [],
  },
  {
    id: 7,
    name: "Children's Ministry",
    description: "Teaching children the Word of God in fun and engaging ways. We lay the foundation of faith in young hearts through creative lessons.",
    icon: Baby,
    color: "bg-orange-500",
    leader: "Ptr. Divina Dangilan",
    meetingTime: "Sundays during service",
    members: 52,
    events: [],
  },
  {
    id: 8,
    name: "Health Ministry",
    description: "Caring for the physical well-being of our community as an extension of Christ's love. We provide health education and assistance.",
    icon: Stethoscope,
    color: "bg-teal-500",
    leader: "Ptr. Rosel Montero",
    meetingTime: "Monthly health programs",
    members: 18,
    events: [],
  },
  {
    id: 9,
    name: "Missions and Evangelism Ministry",
    description: "Spreading the Gospel locally and globally through church planting, outreach programs, and mission trips to unreached peoples.",
    icon: Globe,
    color: "bg-[var(--church-primary)]",
    leader: "Ptr. Ysrael Coyoy",
    meetingTime: "Monthly planning meetings",
    members: 33,
    events: [
      { title: "Mission Training Seminar", date: "Apr 25, 2026", time: "9:00 AM", location: "Fellowship Hall", type: "Training" },
    ],
  },
  {
    id: 10,
    name: "Discipleship Group",
    description: "Growing deeper in faith through intentional Bible study and one-on-one mentorship. We make disciples who make disciples.",
    icon: BookOpen,
    color: "bg-indigo-500",
    leader: "Ptr. Marvin Anno",
    meetingTime: "Weekly small groups",
    members: 27,
    events: [],
  },
  {
    id: 11,
    name: "Counseling Ministry",
    description: "Providing spiritual and emotional support through confidential counseling sessions. We walk alongside those in need with compassion.",
    icon: MessageCircle,
    color: "bg-teal-500",
    leader: "Ptr. Josie Perilla-Cayto",
    meetingTime: "By appointment",
    members: 8,
    events: [],
  },
]

const eventTypeColors: Record<string, string> = {
  Training: "bg-blue-500/10 text-blue-600",
  Service: "bg-[var(--church-primary)]/10 text-[var(--church-primary)]",
  Retreat: "bg-emerald-500/10 text-emerald-600",
  Outreach: "bg-rose-500/10 text-rose-600",
  Fellowship: "bg-[var(--church-gold)]/10 text-[var(--church-gold)]",
  Special: "bg-purple-500/10 text-purple-600",
}

const allUpcomingEvents = ministries
  .flatMap(m => m.events.map(e => ({ ...e, ministry: m.name, color: m.color })))
  .slice(0, 5)

export default function MinistriesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-20 bg-gradient-to-br from-[var(--church-primary)] to-[var(--church-primary-deep)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Our Ministries</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto text-pretty">
              Discover your place in the body of Christ. Every ministry is an opportunity to serve, grow, and make an eternal difference.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 text-white/80 text-sm">
              <span className="flex items-center gap-2"><Users className="w-4 h-4" />{ministries.length} Ministries</span>
              <span className="flex items-center gap-2"><Heart className="w-4 h-4" />{ministries.reduce((s, m) => s + m.members, 0)}+ Serving</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Ministry Events */}
      {allUpcomingEvents.length > 0 && (
        <section className="py-12 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Ministry Events</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {allUpcomingEvents.map((event, i) => (
                  <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <Badge variant="secondary" className={`text-xs mb-2 ${eventTypeColors[event.type] || "bg-muted text-muted-foreground"}`}>
                        {event.type}
                      </Badge>
                      <p className="text-sm font-semibold text-foreground leading-tight mb-1">{event.title}</p>
                      <p className="text-xs text-[var(--church-primary)] font-medium mb-2">{event.ministry}</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Ministries Grid */}
      <section className="py-16 lg:py-24 bg-[var(--church-light-blue)]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry) => (
                <Card key={ministry.id} className="bg-background border-none shadow-lg hover:shadow-xl transition-shadow group flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-14 h-14 rounded-xl ${ministry.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <ministry.icon className="w-7 h-7 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                        {ministry.members} members
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-foreground group-hover:text-[var(--church-primary)] transition-colors leading-tight">
                      {ministry.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {ministry.description}
                    </p>
                    <div className="space-y-1.5 text-sm border-t border-border pt-3">
                      <div className="flex items-start gap-2">
                        <Users className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-foreground font-medium text-xs">{ministry.leader}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-xs">{ministry.meetingTime}</span>
                      </div>
                    </div>

                    {/* Ministry events */}
                    {ministry.events.length > 0 && (
                      <div className="border-t border-border pt-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Upcoming Events</p>
                        <div className="space-y-2">
                          {ministry.events.slice(0, 2).map((event, i) => (
                            <div key={i} className="flex items-start gap-2 bg-muted/50 rounded-lg p-2">
                              <Badge variant="secondary" className={`text-[10px] flex-shrink-0 mt-0.5 ${eventTypeColors[event.type] || "bg-muted text-muted-foreground"}`}>
                                {event.type}
                              </Badge>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-foreground truncate">{event.title}</p>
                                <p className="text-[10px] text-muted-foreground">{event.date} • {event.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
